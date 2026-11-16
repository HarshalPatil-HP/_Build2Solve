const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { runOcr } = require('../src/services/ocr.service');

// Generate a white PNG in memory, leaving the supplied images untouched.
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}
function blankPng() {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(600, 0); header.writeUInt32BE(400, 4);
  header[8] = 8; header[9] = 2;
  const rows = Buffer.alloc((600 * 3 + 1) * 400, 255);
  for (let y = 0; y < 400; y++) rows[y * (600 * 3 + 1)] = 0;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', zlib.deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]);
}
async function main() {
  const root = path.resolve(__dirname, '../..');
  const names = fs.readdirSync(root).filter(name => /^Gemini_Generated_Image_.*\.png$/.test(name)).sort();
  if (names.length !== 3) throw new Error(`Expected 3 Gemini images, found ${names.length}`);
  names.push('test1.jpg', 'test2.jpeg', 'test3.jpeg', 'Test1_Kurkure.webp');
  const inputs = names.map(name => [name, fs.readFileSync(path.join(root, name))]);
  inputs.push(['blank.png (generated)', blankPng()]);
  for (const [name, image] of inputs) {
    try {
      const result = await runOcr(image);
      const mean = result.blocks.length ? result.blocks.reduce((sum, word) => sum + word.confidence, 0) / result.blocks.length : 0;
      console.log(JSON.stringify({ filename: name, bytes: image.length, textLength: result.rawText.length, blockCount: result.blocks.length, meanConfidence: Number(mean.toFixed(2)), loads: true }));
    } catch (error) {
      console.log(JSON.stringify({ filename: name, loads: false, error: error.message }));
      process.exitCode = 1;
    }
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
