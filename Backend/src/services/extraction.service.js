const { Rule } = require('../models');

const DEFAULT_PATTERNS = {
  mrp: /(?:mrp|maximum retail price)[^\d₹]*(?:₹|rs\.?)\s?\d+(?:\.\d{1,2})?/i,
  netQuantity: /\d+(\.\d+)?\s?(g|kg|ml|l|gm|gms)\b/i,
  mfgDate: /(?:mfg|manufactured|packed)[^\d]*(\d{1,2}[\/\-]?\d{2,4}|[a-z]{3,9}\s?\d{4})/i,
  consumerCare: /[\w.+-]+@[\w-]+\.[a-z]{2,}|(?:\+?\d[\d\s-]{8,12}\d)/i,
  genericName: /^.{3,60}$/i,
  manufacturer: /(?:mfg|manufactured|marketed|packed)\s*(?:by|:)/i,
  countryOfOrigin: /(?:country of origin|made in|product of)\s*[:\s]*([a-z\s]+)/i,
};

const MRP_TAX_PHRASE = /(?:inclusive of all taxes|incl\.?\s*of all taxes)/i;

const findBlockForMatch = (blocks, index) => {
  if (!blocks.length) return null;
  let charCount = 0;
  for (const block of blocks) {
    charCount += block.text.length + 1;
    if (charCount >= index) return block;
  }
  return blocks[blocks.length - 1];
};

const extractFields = async (rawText, blocks) => {
  const regexRules = await Rule.find({ isActive: true, validationType: 'regex' }).lean();

  const patterns = { ...DEFAULT_PATTERNS };
  for (const rule of regexRules) {
    if (rule.fieldName && rule.validationPattern) {
      patterns[rule.fieldName] = new RegExp(rule.validationPattern, 'i');
    }
  }

  const result = {};
  const matchedBlocks = {};

  for (const [field, pattern] of Object.entries(patterns)) {
    const match = rawText.match(pattern);
    if (match) {
      result[field] = match[0].trim();
      matchedBlocks[field] = findBlockForMatch(blocks, match.index ?? 0);
    } else {
      result[field] = null;
      matchedBlocks[field] = null;
    }
  }

  // Rule 6(e): MRP number alone is insufficient — tax-inclusive phrase required
  if (result.mrp && !MRP_TAX_PHRASE.test(rawText)) {
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
