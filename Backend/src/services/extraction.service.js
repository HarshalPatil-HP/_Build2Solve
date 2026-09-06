const { Rule } = require('../models');

const DEFAULT_PATTERNS = {
  mrp: /(?:mrp|maximum retail price)[^\d₹]*(?:₹|rs\.?)\s?\d+(?:\.\d{1,2})?/i,
  netQuantity: /\d+(\.\d+)?\s?(g|kg|ml|l|gm|gms)\b/i,
  mfgDate: /(?:mfg|manufactured|packed|batch|b\.\s*no\.?)[^\d]*(\d{1,2}[\/\-]?\d{2,4}|[a-z]{3,9}\s?\d{4})/i,
  consumerCare: /[\w.+-]+@[\w-]+\.[a-z]{2,}|(?:\+?\d[\d\s-]{8,12}\d)/i,
  genericName: /(?:generic name|commodity|product name|item name|proprietary food)\s*[:\-]?\s*([a-z][a-z0-9 ,&()\-]{2,80})/i,
  manufacturer: /(?:mfg|manufactured|marketed|packed)\s*(?:by|:)?\s*[a-z0-9 ,.&()\-]{5,160}/i,
  countryOfOrigin: /(?:country of origin|made in|product of)\s*[:\s]*([a-z\s]+)/i,
};
const MRP_TAX_PHRASE = /(?:inclusive of all taxes|incl\.?\s*of all taxes)/i;
const FSSAI_PATTERN = /(?:fssai(?:\s*(?:lic(?:ence|ense)?(?:\s*no\.?)?)?)?\s*[:#-]?\s*)(\d{14})/i;
const normalise = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();

const allMatches = (text, pattern) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({ value: match[0].trim(), index: match.index });
    if (!match[0].length) regex.lastIndex += 1;
  }
  return matches;
};

const findBlockForMatch = (blocks, matchText) => {
  const target = normalise(matchText);
  return blocks.find((block) => normalise(block.text).includes(target))
    || blocks.find((block) => target.includes(normalise(block.text))) || null;
};

// Merges OCR candidates across label panels. Identical values are deduped;
// conflicting MRP/quantity/date values are surfaced for human review.
const extractFields = async (ocrResults, category = 'all') => {
  const now = new Date();
  const regexRules = await Rule.find({
    isActive: true, validationType: 'regex', effectiveFrom: { $lte: now },
    $and: [{ $or: [{ category: 'all' }, { category }] }, { $or: [{ effectiveTo: null }, { effectiveTo: { $gte: now } }] }],
  }).sort({ effectiveFrom: -1 }).lean();
  const patterns = { ...DEFAULT_PATTERNS };
  for (const rule of regexRules) {
    if (!rule.fieldName || !rule.validationPattern) continue;
    try { patterns[rule.fieldName] = new RegExp(rule.validationPattern, 'i'); } catch { /* ignore invalid admin regex */ }
  }

  const candidates = Object.fromEntries(Object.keys(patterns).map((field) => [field, []]));
  const fssaiLicenseNumbers = new Set();
  const allBlockConfidences = [];
  for (const { rawText, blocks, imageIndex } of ocrResults) {
    blocks.forEach((block) => allBlockConfidences.push(block.confidence || 0));
    const fssai = rawText.match(FSSAI_PATTERN);
    if (fssai?.[1]) fssaiLicenseNumbers.add(fssai[1]);
    for (const [field, pattern] of Object.entries(patterns)) {
      for (const match of allMatches(rawText, pattern)) {
        const block = findBlockForMatch(blocks, match.value);
        candidates[field].push({
          value: match.value, block, confidence: block?.confidence ?? 0, imageIndex,
          mrpTaxPhraseMissing: field === 'mrp' && !MRP_TAX_PHRASE.test(rawText.slice(Math.max(0, match.index - 80), match.index + match.value.length + 80)),
        });
      }
    }
  }

  const fields = {}; const matchedBlocks = {}; const fieldConfidence = {}; const conflicts = {}; const allDetectedValues = {}; const taxFlags = {};
  for (const [field, values] of Object.entries(candidates)) {
    const unique = [...new Map(values.map((entry) => [normalise(entry.value), entry])).values()];
    unique.sort((a, b) => b.confidence - a.confidence || a.imageIndex - b.imageIndex);
    const selected = unique[0];
    fields[field] = selected?.value || null;
    matchedBlocks[field] = selected?.block || null;
    fieldConfidence[field] = selected?.confidence ?? 0;
    allDetectedValues[field] = unique.map((entry) => entry.value);
    conflicts[field] = ['mrp', 'netQuantity', 'mfgDate'].includes(field) && unique.length > 1;
    taxFlags[field] = selected?.mrpTaxPhraseMissing || false;
  }
  const overallConfidence = allBlockConfidences.length ? allBlockConfidences.reduce((sum, value) => sum + value, 0) / allBlockConfidences.length : 0;
  return { fields, matchedBlocks, fieldConfidence, conflicts, allDetectedValues, mrpTaxPhraseMissing: Boolean(taxFlags.mrp), overallConfidence, supplementaryMetadata: { fssaiLicenseNumbers: [...fssaiLicenseNumbers] } };
};

module.exports = { extractFields, DEFAULT_PATTERNS, MRP_TAX_PHRASE };
