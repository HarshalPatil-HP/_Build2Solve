const Tesseract = require('tesseract.js');

const runOcr = async (imageBuffer) => {
  // English and Hindi are both legally valid declaration languages.
  const { data } = await Tesseract.recognize(imageBuffer, 'eng+hin');

  const blocks = [];
  const source = data.words?.length ? data.words : data.lines || [];

  for (const item of source) {
    const bbox = item.bbox || {};
    blocks.push({
      text: item.text,
      x: bbox.x0 ?? item.x0 ?? 0,
      y: bbox.y0 ?? item.y0 ?? 0,
      width: (bbox.x1 ?? item.x1 ?? 0) - (bbox.x0 ?? item.x0 ?? 0),
      height: (bbox.y1 ?? item.y1 ?? 0) - (bbox.y0 ?? item.y0 ?? 0),
      confidence: item.confidence ?? 0,
    });
  }

  return { rawText: data.text || '', blocks };
};

module.exports = { runOcr };
