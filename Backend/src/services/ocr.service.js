const Tesseract = require('tesseract.js');

const toConfidence = (item) => {
  const value = Number(item.confidence ?? item.conf ?? item.confidenceScore);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

const flattenWords = (node, output = []) => {
  if (Array.isArray(node)) {
    node.forEach((item) => flattenWords(item, output));
    return output;
  }
  if (!node || typeof node !== 'object') return output;
  // JSON layout output stores actual words inside nested blocks/paragraphs/
  // lines; only retain objects that carry a word text, bbox and confidence.
  const hasChildren = Array.isArray(node.paragraphs) || Array.isArray(node.lines) || Array.isArray(node.words);
  if (!hasChildren && typeof node.text === 'string' && node.bbox && ('confidence' in node || 'conf' in node)) {
    output.push(node);
    return output;
  }
  Object.values(node).forEach((value) => {
    if (value && typeof value === 'object') flattenWords(value, output);
  });
  return output;
};

const runOcr = async (imageBuffer) => {
  // `rotateAuto` uses Tesseract orientation detection before recognition.
  // It corrects common sideways phone captures without retaining a derived file.
  const worker = await Tesseract.createWorker('eng+hin');
  let data;
  try {
    // Tesseract.js v7 defaults to text-only output. `blocks: true` requests
    // its JSON layout tree, which is the source of word bounding boxes and
    // real confidence scores.
    ({ data } = await worker.recognize(imageBuffer, { rotateAuto: true }, { blocks: true }));
  } finally {
    await worker.terminate();
  }

  const blocks = [];
  const source = flattenWords(data.blocks);

  for (const item of source) {
    const bbox = item.bbox || {};
    blocks.push({
      text: item.text,
      x: bbox.x0 ?? item.x0 ?? 0,
      y: bbox.y0 ?? item.y0 ?? 0,
      width: (bbox.x1 ?? item.x1 ?? 0) - (bbox.x0 ?? item.x0 ?? 0),
      height: (bbox.y1 ?? item.y1 ?? 0) - (bbox.y0 ?? item.y0 ?? 0),
      // Tesseract emits confidence per word. Normalise it here so extraction
      // never receives an undefined/placeholder confidence value.
      confidence: toConfidence(item),
    });
  }

  return {
    rawText: data.text || '',
    blocks,
    orientation: {
      degrees: data.orientation_degrees ?? 0,
      confidence: data.orientation_confidence ?? null,
    },
  };
};

module.exports = { runOcr, toConfidence };
