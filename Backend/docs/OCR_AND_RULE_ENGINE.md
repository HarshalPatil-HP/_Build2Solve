# OCR and Rule Engine Guide

This document explains how a product-label scan becomes a compliance result. It is written for team members who know basic JavaScript/Node.js but are new to OCR.

## 1. What happens when someone scans a label

The user uploads one to four JPEG/PNG images. They can be any useful panels of the label, not only a fixed “front” and “back.” For example, one image may show quantity and MRP while another has the manufacturer and consumer-care details.

For every image, the backend:

1. Stores the original image in Cloudinary as evidence.
2. Sends the image to Tesseract.js, a local OCR library. OCR means **Optical Character Recognition**: it tries to convert visible text in an image into normal text.
3. Merges the OCR results from all uploaded images.
4. Extracts likely declarations such as MRP, quantity, and consumer care.
5. Sends the extracted fields to the rule engine.
6. Saves the scan, result, and any confirmed failed-rule violations in MongoDB.

The rule engine is deterministic: it does not let AI decide whether a legal rule passed. It checks stored rules against extracted evidence and returns an explanation for every field.

## 2. What Tesseract returns and how we use it

Tesseract.js returns plain OCR text, but plain text alone is not enough. We also request `blocks: true`.

```js
worker.recognize(imageBuffer, { rotateAuto: true }, { blocks: true })
```

`blocks: true` returns a nested layout tree:

```text
block -> paragraph -> line -> word
```

Each word has:

- `text`: what Tesseract read.
- `bbox`: its position and size in the image.
- `confidence`: how confident Tesseract is, normally from 0 to 100.

The backend flattens that tree into word records. It averages the confidence of words belonging to an extracted field. It also calculates an overall confidence across all OCR words.

This information is used for:

- **Readability:** low overall confidence means the label may be blurred, badly lit, small, or unreadable.
- **Needs review:** a field detected below 60% confidence is not silently treated as a reliable pass.
- **Font-size estimate:** word bounding-box height is used with package dimensions to estimate printed font size.
- **Placement heuristic:** word bounding boxes help estimate whether declarations are clustered on one panel.

### Automatic rotation

`rotateAuto: true` is run for every image, inside the scan upload loop. It corrects many small-angle/sideways captures before OCR. It cannot repair a photo that is very blurry, heavily tilted, too compressed, or has text too small. Such an image should result in `needs-review` and a request to retake the photo.

## 3. Regex extraction: what it is for

Regex is a text pattern. It is good for declarations that use legally common or recognisable wording. It is not a general understanding system.

| Field | Typical anchor/pattern | Why regex is suitable |
| --- | --- | --- |
| MRP | `MRP`, `Maximum Retail Price`, `Rs.`, `₹` plus an amount | Price declarations use recognisable price markers. |
| MRP tax wording | `inclusive`, `incl.`, `of all taxes` with limited OCR-tolerant variants | Rule 6(e) requires tax-inclusive wording. |
| Net quantity | number plus `g`, `kg`, `ml`, `l`, `gm`, `gms` | Quantity has standard units. |
| Manufacture/batch date | `Mfg`, `Manufactured`, `Packed`, `Batch`, `B. No.` plus `DD/MM/YY`-style date | Dates have constrained formats and common labels. |
| Manufacturer/marketer | `Manufactured by`, `Marketed by`, `Packed by` | The declaration normally has a legal role label. The value after the label is captured. |
| Consumer care | email, or `Call us`, `Contact`, `Phone`, `Tel`, `Consumer Care` near a valid phone number | Prevents licence/batch numbers from being mistaken for phone numbers. |
| Country of origin | `Country of Origin`, `Made in`, `Product of` | Imported-product declaration normally has a standard phrase. |
| Generic name (weak) | `Generic name`, `Commodity`, `Product name`, `Proprietary Food` | Useful when a label supplies a phrase, but not reliable for all product types. |
| Misleading quantity words | `minimum`, `not less than`, `average`, `about`, `approximately` near quantity | Rule 12(6) provides a concrete prohibited-word list. |

Ingredients, nutrition tables, and FSSAI licence numbers are not Legal Metrology Rule 6 compliance fields. The system may retain a detected FSSAI licence number as context, but it must never create a Legal Metrology violation because it is absent or malformed.

## 4. Code patterns versus database rules

There are two related layers.

### Regex/extraction code

The fallback patterns and OCR-specific tolerance are in:

```text
src/services/extraction.service.js
```

Examples include accepting OCR confusion around `Rs.35/-` and tax wording, or excluding bare licence-like digit runs from date extraction. These patterns are code because they describe how noisy OCR text should be interpreted.

### MongoDB `rules` collection

The database stores the legal rule configuration:

- Rule number, such as `Rule 6(e)`.
- Description and field name.
- Category applicability (`food`, `cosmetics`, `all`, etc.).
- Validation type (`regex`, `presence`, `conditional`).
- Active/inactive state.
- Effective-from/effective-to dates for amendments.

The seed file is:

```text
scripts/seedRules.js
```

At scan time, active DB regex patterns can override code defaults. Therefore, when a seeded pattern changes, run:

```powershell
npm run seed:rules
```

The font-size table, category exemptions, placement heuristic, confidence threshold, and final pass/fail logic are implemented in `src/services/ruleEngine.service.js`. They are code because they require calculations and image/scan facts rather than a simple text match.

## 5. Bugs found and fixed during real-label testing

1. **Cloudinary upload 403**
   - Root cause: the Cloudinary key could authenticate for read-only `ping` but lacked the `create` permission for uploads.
   - Fix: use a Cloudinary key with asset-create/upload permission. This was an account permission problem, not a signature, network, or backend-code problem.

2. **`ReferenceError: confidences is not defined`**
   - Root cause: an old single-image variable remained after the multi-image confidence refactor.
   - Fix: readability now uses `overallConfidence`, calculated by extraction.

3. **All OCR confidence values were 0.0%**
   - Root cause: Tesseract.js v7 returns text by default; no layout output was requested, so `data.words` and `data.lines` were empty.
   - Fix: request `blocks: true`, traverse its layout tree down to leaf words, and use their real Tesseract confidence values.

4. **First layout traversal returned one huge text block per image**
   - Root cause: the traversal stopped at a parent line object that also had text/confidence.
   - Fix: descend through blocks, paragraphs, and lines; retain only leaf word records.

5. **Manufacturer was extracted as `MARKETED BY` instead of the company**
   - Root cause: the pattern matched only the label phrase.
   - Fix: capture the text after `Marketed by:`, `Manufactured by:`, or `Packed by:`. For the real test it extracted `PepsiCo India Holdings Pvt. Ltd.`.

6. **MRP was missed on noisy OCR text**
   - Root cause: the original pattern expected cleaner text and an MRP label.
   - Fix: accept price markers such as `Rs.35/-` and limited OCR-tolerant tax-wording variants. Low confidence still produces `needs-review` rather than a definitive pass.

7. **FSSAI licence number was read as manufacture date**
   - Root cause: the date pattern accepted bare 6-8 digit runs.
   - Fix: require a slash/hyphen date shape or named-month date; bare number runs are excluded.

8. **FSSAI licence number was read as consumer-care phone**
   - Root cause: the old phone regex accepted almost any long digit sequence.
   - Fix: phone matches now require a consumer-contact phrase plus a valid Indian mobile/toll-free shape. The real test no longer misclassifies the licence number.

## 6. Known limitations

- **Generic name is the weakest field.** Many products do not use a fixed phrase before the generic name. Regex can help for labels such as `Proprietary Food - Namkeen`, but cannot reliably understand every product category. An optional LLM-assisted extraction fallback may later propose values, but it must not replace the deterministic rule engine.
- **Bad source images remain bad OCR.** Auto-rotation helps orientation, not blur, glare, severe perspective, tiny text, or compression. The frontend should give capture guidance and let users retake poor photos.
- **Consumer care requires a readable complete number/email.** If OCR returns `1800224` instead of a complete `1800 22 4020`, the backend must not invent missing digits. It returns `needs-review`.
- **Font-size is an estimate.** Without real package dimensions/calibration, a photograph cannot provide laboratory-accurate millimetres.
- **Placement is a heuristic.** Bounding-box clustering can flag a possible Rule 8 issue, but cannot conclusively identify the legal Principal Display Panel from arbitrary photographs.
- **Colour dots need human verification.** The veg/non-veg dot is returned as `requires-visual-verification`; OCR text cannot prove its colour.

## 7. Result statuses in plain language

| Status | Meaning | What the user should do |
| --- | --- | --- |
| `pass` | The system detected evidence matching the applicable rule with enough confidence. | Keep the evidence; no issue was found by this check. |
| `fail` | The system found a definite rule failure, such as a required declaration missing from a readable label or prohibited wording near quantity. | Show the rule reference; create a violation record and allow inspector follow-up. |
| `needs-review` | The system cannot safely decide. Causes include low OCR confidence, conflicting values across images, incomplete phone number, or poor image quality. | Retake/inspect the label manually. Do not treat it as a confirmed legal failure. |
| `exempt` | The rule does not apply for the selected category or exemption conditions. Example: manufacturer declaration is not failed for food under the configured scope. | Record why it is exempt; do not create a violation. |
| `warning` | A non-conclusive heuristic concern, currently used for possible PDP placement problems. | Ask an inspector to check manually. |
| `requires-visual-verification` | The field requires visual/colour judgement outside Phase 1 OCR. | Verify manually; do not claim the system detected it. |

## 8. Team test checklist

Before a demo, run:

```powershell
npm run seed:rules
npm run test:core
npm run test:models
npm start
```

For each real label test, upload one to four sharp, front-facing images. Make sure at least one image clearly shows MRP, net quantity, date/batch, generic name, and consumer-care details. Test both a clear label and an intentionally blurry/rotated one, and confirm that unclear evidence becomes `needs-review`, not a false legal conclusion.
