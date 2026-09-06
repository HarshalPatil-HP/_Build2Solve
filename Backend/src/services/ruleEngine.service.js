const { Rule } = require('../models');

// Current post-2018 PDP area → minimum font height table (Rule 7)
const FONT_TABLE = [
  { maxArea: 50, normal: 1.0, molded: 2.0 },
  { maxArea: 100, normal: 1.5, molded: 3.0 },
  { maxArea: 500, normal: 2.5, molded: 4.0 },
  { maxArea: 2500, normal: 4.0, molded: 6.0 },
  { maxArea: Infinity, normal: 6.0, molded: 6.0 },
];

const getMinFontMm = (areaCm2, isMolded) => {
  const row = FONT_TABLE.find((r) => areaCm2 <= r.maxArea);
  return isMolded ? row.molded : row.normal;
};

const blockCenter = (block) => ({
  x: block.x + block.width / 2,
  y: block.y + block.height / 2,
});

const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const parseQuantityGrams = (text) => {
  if (!text) return null;
  const m = text.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l|gm|gms)\b/i);
  if (!m) return null;
  const val = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 'kg') return val * 1000;
  if (unit === 'l') return val * 1000;
  return val;
};

const checkFontSize = ({ matchedBlocks, packageWidthCm, packageHeightCm, imageHeightPx, isMolded }) => {
  const qtyBlock = matchedBlocks.netQuantity;
  const estimated = !packageWidthCm || !packageHeightCm;

  const pdpArea = estimated ? 100 : packageWidthCm * packageHeightCm;
  const minMm = getMinFontMm(pdpArea, isMolded);

  const pixelHeight = qtyBlock?.height || 0;
  const imgH = imageHeightPx || 1;

  // pixelToMmRatio = packageHeightCm*10 / imageHeightPixels
  const pixelToMmRatio = estimated ? 0.05 : (packageHeightCm * 10) / imgH;
  const detectedMm = pixelHeight * pixelToMmRatio;

  const pass = pixelHeight > 0 && detectedMm >= minMm;

  return {
    fieldName: 'fontSize',
    detected: pixelHeight > 0,
    value: detectedMm ? `${detectedMm.toFixed(2)}mm (min ${minMm}mm)` : null,
    status: pass ? 'pass' : pixelHeight > 0 ? 'fail' : 'needs-review',
    ruleReference: 'Rule 7',
    reason: pass
      ? `Font height meets minimum for PDP area ~${pdpArea}cm²`
      : pixelHeight > 0
        ? `Estimated font height ${detectedMm.toFixed(2)}mm below minimum ${minMm}mm for PDP area ~${pdpArea}cm²`
        : 'Net quantity block not detected for font-size measurement',
    estimated: estimated || !qtyBlock,
  };
};

const checkPlacement = ({ matchedBlocks, imageHeightPx }) => {
  const mandatory = ['manufacturer', 'mrp', 'netQuantity', 'genericName', 'consumerCare'];
  const points = mandatory
    .map((f) => matchedBlocks[f])
    .filter(Boolean)
    .map(blockCenter);

  if (points.length < 2) {
    return {
      fieldName: 'placement',
      detected: false,
      status: 'needs-review',
      ruleReference: 'Rule 8',
      reason: 'Insufficient detected fields for placement heuristic',
    };
  }

  const centroid = {
    x: points.reduce((s, p) => s + p.x, 0) / points.length,
    y: points.reduce((s, p) => s + p.y, 0) / points.length,
  };

  const imgH = imageHeightPx || 1;
  const flagged = [];

  for (const [field, block] of Object.entries(matchedBlocks)) {
    if (!block || !mandatory.includes(field)) continue;
    const center = blockCenter(block);
    const distPct = (distance(center, centroid) / imgH) * 100;
    if (distPct > 40) flagged.push({ field, distPct: distPct.toFixed(1) });
  }

  return {
    fieldName: 'placement',
    detected: true,
    status: flagged.length ? 'warning' : 'pass',
    ruleReference: 'Rule 8',
    reason: flagged.length
      ? `Heuristic warning: ${flagged.map((f) => `${f.field} (${f.distPct}% from centroid)`).join(', ')} may not comply with Principal Display Panel grouping (Rule 8)`
      : 'All detected mandatory fields cluster within placement heuristic threshold',
  };
};

const runRuleEngine = async ({
  category,
  extracted,
  matchedBlocks,
  rawText,
  packageWidthCm,
  packageHeightCm,
  imageHeightPx,
  isMolded = false,
  isTobacco = false,
  isRestaurantFastFood = false,
  isImported = false,
}) => {
  const { fields } = extracted;
  const exemptionsApplied = [];
  const fieldResults = [];
  const estimatedValues = [];

  if (isRestaurantFastFood) {
    return {
      overallStatus: 'compliant',
      fields: [{ fieldName: 'all', status: 'exempt', ruleReference: 'Rule 26', reason: 'Restaurant fast-food exemption applies' }],
      estimatedValues: [],
      exemptionsApplied: ['Rule 26 — restaurant fast-food'],
    };
  }

  const now = new Date();
  const activeRules = await Rule.find({
    isActive: true,
    effectiveFrom: { $lte: now },
    $and: [
      { $or: [{ category: 'all' }, { category }] },
      { $or: [{ effectiveTo: null }, { effectiveTo: { $gte: now } }] },
    ],
  }).sort({ effectiveFrom: -1 }).lean();

  // The DB defines which declarations apply. Legal exemptions remain explicit
  // code because they depend on package facts, not only label text.
  const rulesByField = new Map();
  for (const rule of activeRules) {
    if (!rulesByField.has(rule.fieldName)) rulesByField.set(rule.fieldName, rule);
  }

  const qtyGrams = parseQuantityGrams(fields.netQuantity);
  if (qtyGrams !== null && qtyGrams <= 10 && !isTobacco) {
    exemptionsApplied.push('Rule 26 — net quantity ≤10g/10ml');
    return {
      overallStatus: 'compliant',
      fields: [{ fieldName: 'all', status: 'exempt', ruleReference: 'Rule 26', reason: 'Package ≤10g/10ml exemption' }],
      estimatedValues: [],
      exemptionsApplied,
    };
  }

  const exemptions = {
    manufacturer: category === 'food',
    // Food is exempt from the manufacturer-address declaration, not from
    // manufacturing-date disclosure. Cosmetics follow their separate regime.
    mfgDate: category === 'cosmetics',
    countryOfOrigin: !isImported,
  };
  const declarationFields = ['manufacturer', 'genericName', 'netQuantity', 'mfgDate', 'mrp', 'consumerCare', 'countryOfOrigin'];
  const checks = declarationFields
    .filter((name) => rulesByField.has(name))
    .map((name) => ({ name, dbRule: rulesByField.get(name), exempt: Boolean(exemptions[name]) }));

  for (const check of checks) {
    if (check.exempt) {
      fieldResults.push({
        fieldName: check.name,
        detected: !!fields[check.name],
        value: fields[check.name],
        status: 'exempt',
        ruleReference: check.dbRule.ruleNumber,
        reason: `Exempt for category: ${category}`,
      });
      exemptionsApplied.push(`${check.dbRule.ruleNumber} — ${check.name}`);
      continue;
    }

    let status = fields[check.name] ? 'pass' : 'fail';
    let reason = fields[check.name] ? 'Declaration detected' : 'Mandatory declaration missing';

    if (check.name === 'mrp' && fields.mrpTaxPhraseMissing) {
      status = 'fail';
      reason = 'MRP found but "inclusive of all taxes" phrase missing (Rule 6(e))';
    }

    fieldResults.push({
      fieldName: check.name,
      detected: !!fields[check.name],
      value: fields[check.name],
      status,
      ruleReference: check.dbRule.ruleNumber,
      reason,
    });
  }

  // Readability proxy — average OCR confidence of matched blocks
  const confidences = Object.values(matchedBlocks)
    .filter(Boolean)
    .map((b) => b.confidence || 0);
  const avgConf = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;
  if (rulesByField.has('readability')) fieldResults.push({
    fieldName: 'readability',
    detected: confidences.length > 0,
    value: `${avgConf.toFixed(1)}% avg OCR confidence`,
    status: avgConf >= 60 ? 'pass' : avgConf >= 40 ? 'needs-review' : 'fail',
    ruleReference: 'Rule 9',
    reason: avgConf >= 60 ? 'Label text appears legible (OCR confidence proxy)' : 'Low OCR confidence — label may not be legible; retake photo',
  });

  // Misleading words near quantity
  if (rulesByField.has('misleadingWords')) fieldResults.push({
    fieldName: 'misleadingWords',
    detected: fields.misleadingNearQuantity,
    value: null,
    status: fields.misleadingNearQuantity ? 'fail' : 'pass',
    ruleReference: 'Rule 12(6)',
    reason: fields.misleadingNearQuantity
      ? 'Misleading words detected near net quantity declaration'
      : 'No misleading quantity words detected',
  });

  // Font size
  if (rulesByField.has('fontSize')) {
    const fontResult = checkFontSize({ matchedBlocks, packageWidthCm, packageHeightCm, imageHeightPx, isMolded });
    fieldResults.push({ ...fontResult, ruleReference: rulesByField.get('fontSize').ruleNumber });
    if (fontResult.estimated) estimatedValues.push('fontSize');
  }

  // Placement heuristic
  if (rulesByField.has('placement')) {
    fieldResults.push({ ...checkPlacement({ matchedBlocks, imageHeightPx }), ruleReference: rulesByField.get('placement').ruleNumber });
  }

  // GM label — food only
  if (category === 'food' && rulesByField.has('gmLabel')) {
    const topBlocks = Object.values(matchedBlocks)
      .filter(Boolean)
      .filter((b) => b.y < (imageHeightPx || 9999) * 0.25);
    const hasGm = topBlocks.some((b) => /\bGM\b/i.test(b.text)) || /\bGM\b/i.test(rawText.slice(0, 200));
    fieldResults.push({
      fieldName: 'gmLabel',
      detected: hasGm,
      value: hasGm ? 'GM' : null,
      status: hasGm ? 'pass' : 'needs-review',
      ruleReference: 'Rule 6(7)',
      reason: hasGm ? 'GM label detected near top of PDP' : 'GM label not detected — verify if product is genetically modified food',
    });

    fieldResults.push({
      fieldName: 'vegNonVegDot',
      detected: false,
      value: null,
      status: 'requires-visual-verification',
      ruleReference: 'Rule 6(8)',
      reason: 'Vegetarian/non-vegetarian dot requires color-pixel analysis — not available in Phase 1. Manual visual verification required.',
    });
  }

  if (category === 'cosmetics' && rulesByField.has('vegNonVegDot')) {
    fieldResults.push({
      fieldName: 'vegNonVegDot',
      detected: false,
      value: null,
      status: 'requires-visual-verification',
      ruleReference: 'Rule 6(8)',
      reason: 'Colored dot on toiletries requires color-pixel analysis — manual verification required.',
    });
  }

  const hasFail = fieldResults.some((f) => f.status === 'fail');
  const hasReview = fieldResults.some((f) => ['needs-review', 'requires-visual-verification', 'warning'].includes(f.status));

  return {
    overallStatus: hasFail ? 'non-compliant' : hasReview ? 'needs-review' : 'compliant',
    fields: fieldResults,
    estimatedValues,
    exemptionsApplied,
  };
};

module.exports = { runRuleEngine, getMinFontMm, checkFontSize, checkPlacement };
