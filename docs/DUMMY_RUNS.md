# OCR measurements

Command: `cd Backend; node scripts/measure-ocr.js` (exit 0). Size is bytes;
confidence is the arithmetic mean of returned word confidences.

| Image | Bytes | Text length | Words | Mean confidence | OCR loads |
|---|---:|---:|---:|---:|---|
| Gemini_Generated_Image_5gedn45gedn45ged.png | 1343749 | 725 | 201 | 35.29 | yes |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | 1124693 | 1598 | 280 | 52.59 | yes |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | 1862094 | 988 | 251 | 51.90 | yes |
| test1.jpg | 64044 | 416 | 69 | 81.32 | yes |
| test2.jpeg | 158357 | 722 | 266 | 46.17 | yes |
| test3.jpeg | 50620 | 785 | 182 | 48.06 | yes |
| Test1_Kurkure.webp | 35672 | 234 | 70 | 28.56 | yes |
| blank.png (generated in memory) | 1582 | 0 | 0 | 0 | yes |

These metrics separate this blank from the supplied images, but
do not establish whether a text-containing unrelated image is a label.

## Threshold choice

The selected minimums of 20 OCR words and 60 trimmed characters are below the
lowest measured supplied image (69 words, 234 characters), while the blank has
zero of both. They detect insufficient readable text, not label identity.
