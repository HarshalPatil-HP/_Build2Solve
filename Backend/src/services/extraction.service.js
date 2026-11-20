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
  const regex = new RegExp(pattern.source, flags + 'd');
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    // The value after “Marketed by:” is the declaration, not the label itself.
    const group = ['manufacturer', 'consumerCare'].includes(field) && match[1] ? 1 : 0;
    const value = match[group].trim();
    const index = match.indices[group][0] + match[group].indexOf(value);
    matches.push({ value, index });
    if (!match[0].length) regex.lastIndex += 1;
  }
  return matches;
};

// Tesseract returns words in reading order. Stop at a mismatch rather than
// borrowing a box from a later occurrence of the same word.
const indexWords = (text, blocks) => {
  const words = [];
  let offset = 0;
  for (const block of blocks) {
    while (offset < text.length && /\s/.test(text[offset])) offset++;
    const word = block.text.trim();
    if (!word) continue;
    if (!text.startsWith(word, offset)) break;
    words.push({ start: offset, end: offset + word.length, block });
    offset += word.length;
  }
  return words;
};

const wordsIn = (words, start, end) =>
  words.filter(word => word.start < end && word.end > start).map(word => word.block);

const quantityHeading = /\bNET\s+(?:WT\.?|WEIGHT|QUANTITY)\b/gi;
const otherQuantityContext = /\b(?:sugars?|fat|energy|per\s+serv(?:e|ing)|cook|add|each)\b/i;

const isDeclaredQuantity = (text, match, words, boxes) => {
  if (!(parseFloat(match.value) > 0) || !boxes.length) return false;
  const lineStart = text.lastIndexOf('\n', match.index - 1) + 1;
  const lineEnd = text.indexOf('\n', match.index + match.value.length);
  const line = text.slice(lineStart, lineEnd < 0 ? text.length : lineEnd);
  if (otherQuantityContext.test(line)) return false;

  return Array.from(text.matchAll(quantityHeading)).some(heading => {
    const end = heading.index + heading[0].length;
    const gap = text.slice(end, match.index);
    if (end > match.index || !/^[ \t.:–-]*\r?\n?[ \t.:–-]*$/.test(gap)) return false;
    const headingBoxes = wordsIn(words, heading.index, end);
    if (!headingBoxes.length) return false;
    const first = headingBoxes[0];
    const last = headingBoxes[headingBoxes.length - 1];
    const value = boxes[0];
    const height = Math.max(last.height, value.height);
    const rightGap = value.x - (last.x + last.width);
    const belowGap = value.y - (last.y + last.height);
    const right = Math.abs(value.y - last.y) <= height && rightGap >= 0 && rightGap <= 6 * height;
    const below = belowGap >= 0 && belowGap <= 2 * height &&
      value.x >= first.x - height && value.x <= last.x + last.width + height;
    return right || below;
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
    const words = indexWords(rawText, blocks);
    blocks.forEach((block) => allBlockConfidences.push(block.confidence || 0));
    const fssai = rawText.match(FSSAI_PATTERN);
    if (fssai?.[1]) fssaiLicenseNumbers.add(fssai[1]);
    for (const [field, pattern] of Object.entries(patterns)) {
      for (const match of allMatches(rawText, pattern, field)) {
        const matchedBlocks = wordsIn(words, match.index, match.index + match.value.length);
        if (field === 'netQuantity' && !isDeclaredQuantity(rawText, match, words, matchedBlocks)) continue;
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
