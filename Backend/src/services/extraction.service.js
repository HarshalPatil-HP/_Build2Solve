const { Rule } = require('../models');

const DEFAULT_PATTERNS = {
  mrp: /(?:mrp|maximum retail price)[^\d₹]*(?:₹|rs\.?)\s?\d+(?:\.\d{1,2})?/i,
  netQuantity: /\d+(\.\d+)?\s?(g|kg|ml|l|gm|gms)\b/i,
  mfgDate: /(?:mfg|manufactured|packed)[^\d]*(\d{1,2}[\/\-]?\d{2,4}|[a-z]{3,9}\s?\d{4})/i,
  consumerCare: /[\w.+-]+@[\w-]+\.[a-z]{2,}|(?:\+?\d[\d\s-]{8,12}\d)/i,
  genericName: /(?:generic name|commodity|product name|item name)\s*[:\-]?\s*([a-z][a-z0-9 ,&()\-]{2,80})/i,
  manufacturer: /(?:mfg|manufactured|marketed|packed)\s*(?:by|:)?\s*[a-z0-9 ,.&()\-]{5,160}/i,
  countryOfOrigin: /(?:country of origin|made in|product of)\s*[:\s]*([a-z\s]+)/i,
};

const MRP_TAX_PHRASE = /(?:inclusive of all taxes|incl\.?\s*of all taxes)/i;

const findBlockForMatch = (blocks, matchText) => {
  if (!blocks.length || !matchText) return null;
  const target = matchText.toLowerCase();
  return blocks.find((block) => block.text.toLowerCase().includes(target))
    || blocks.find((block) => target.includes(block.text.toLowerCase()))
    || null;
};

const extractFields = async (rawText, blocks, category = 'all') => {
  const now = new Date();
  const regexRules = await Rule.find({
    isActive: true,
    validationType: 'regex',
    effectiveFrom: { $lte: now },
    $and: [
      { $or: [{ category: 'all' }, { category }] },
      { $or: [{ effectiveTo: null }, { effectiveTo: { $gte: now } }] },
    ],
  }).sort({ effectiveFrom: -1 }).lean();

  const patterns = { ...DEFAULT_PATTERNS };
  for (const rule of regexRules) {
    if (rule.fieldName && rule.validationPattern) {
      try {
        patterns[rule.fieldName] = new RegExp(rule.validationPattern, 'i');
      } catch {
        // A malformed administrator-entered regex must not crash every scan.
        continue;
      }
    }
  }

  const result = {};
  const matchedBlocks = {};

  for (const [field, pattern] of Object.entries(patterns)) {
    const match = rawText.match(pattern);
    if (match) {
      result[field] = match[0].trim();
      matchedBlocks[field] = findBlockForMatch(blocks, match[0]);
    } else {
      result[field] = null;
      matchedBlocks[field] = null;
    }
  }

  // Rule 6(e): MRP number alone is insufficient — tax-inclusive phrase required
  const mrpMatch = rawText.match(patterns.mrp);
  const mrpContext = mrpMatch
    ? rawText.slice(Math.max(0, mrpMatch.index - 80), (mrpMatch.index || 0) + mrpMatch[0].length + 80)
    : '';
  if (result.mrp && !MRP_TAX_PHRASE.test(mrpContext)) {
    result.mrpTaxPhraseMissing = true;
  } else {
    result.mrpTaxPhraseMissing = false;
  }

  // Rule 12(6): misleading words near quantity declaration
  const qtyMatch = rawText.match(patterns.netQuantity);
  if (qtyMatch) {
    const start = Math.max(0, (qtyMatch.index ?? 0) - 40);
    const end = (qtyMatch.index ?? 0) + qtyMatch[0].length + 40;
    const nearby = rawText.slice(start, end);
    result.misleadingNearQuantity = /\b(minimum|not less than|average|about|approximately)\b/i.test(nearby);
  } else {
    result.misleadingNearQuantity = false;
  }

  return { fields: result, matchedBlocks };
};

module.exports = { extractFields, DEFAULT_PATTERNS, MRP_TAX_PHRASE };
