const { Rule } = require('../models');

const DEFAULT_PATTERNS = {
  // Accept common OCR substitutions (S/5, I/1) but retain the price marker
  // so ordinary label numbers are not mistaken for an MRP.
  mrp: /(?:mrp|maximum\s+retail\s+price|(?:rs|r[5s]|₹)\.?)[^\d₹]{0,12}(\d{1,5}(?:[.,]\d{1,2})?)(?:\s*\/-?)?/i,
  netQuantity: /\d+(\.\d+)?\s?(g|kg|ml|l|gm|gms)\b/i,
  // Bare digit runs are deliberately excluded: they could be a FSSAI licence
  // or consumer-care number, not a manufacture/batch date.
  mfgDate: /(?:(?:mfg|manufactured|packed|batch|b\.\s*no\.?)\s*[:#-]?\s*)?(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|[a-z]{3,9}\s?\d{4})/i,
  // A long uninterrupted number is not automatically consumer care: FSSAI,
  // GST, batch and licence numbers are common on labels. Phone candidates
  // require a consumer-contact cue and a valid Indian/toll-free shape.
  consumerCare: /(?:[\w.+-]+@[\w-]+\.[a-z]{2,}|(?:(?:call(?:\s+us)?|contact|phone|tel(?:ephone)?|consumer\s*(?:care|services?))[^0-9]{0,25})((?:1800(?:[\s-]?\d){6})|(?:[6-9]\d{4}[\s-]?\d{5})))/i,
  genericName: /(?:generic\s+name|commodity|product\s+name|item\s+name|proprietary\s+food)(?:\s*[:\-–—]\s*|\s+)[a-z][a-z0-9 ,&()\-]{2,80}/i,
  manufacturer: /(?:mfg|manufactured|marketed|packed)\s*(?:by\s*)?[:\-]?\s*([a-z][a-z0-9 ,.&()\-]{3,160})/i,
  countryOfOrigin: /(?:country of origin|made in|product of)\s*[:\s]*([a-z\s]+)/i,
};
const MRP_TAX_PHRASE = /(?:inclusive|incl\.?|[i1l]?n?cl)\s*(?:of|0f)?\s*(?:all|a[l1]{2})?\s*(?:tax(?:es)?|[jt]e?s[kx])/i;
const FSSAI_PATTERN = /(?:fssai(?:\s*(?:lic(?:ence|ense)?(?:\s*no\.?)?)?)?\s*[:#-]?\s*)(\d{14})/i;
const normalise = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();

const allMatches = (text, pattern, field) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    // The value after “Marketed by:” is the declaration, not the label itself.
    const value = ['manufacturer', 'consumerCare'].includes(field) && match[1] ? match[1] : match[0];
    matches.push({ value: value.trim(), index: match.index });
    if (!match[0].length) regex.lastIndex += 1;
  }
  return matches;
};

const findBlocksForMatch = (blocks, matchText) => {
  const tokens = normalise(matchText).match(/[a-z0-9]+/g) || [];
  if (!tokens.length) return [];
  return blocks.filter((block) => {
    const word = normalise(block.text);
    return tokens.some((token) => word.includes(token) || token.includes(word));
  });
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
      for (const match of allMatches(rawText, pattern, field)) {
        const matchedBlocks = findBlocksForMatch(blocks, match.value);
        const confidence = matchedBlocks.length
          ? matchedBlocks.reduce((sum, block) => sum + Number(block.confidence || 0), 0) / matchedBlocks.length
          : 0;
        candidates[field].push({
          value: match.value, block: matchedBlocks[0] || null, confidence, imageIndex,
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
