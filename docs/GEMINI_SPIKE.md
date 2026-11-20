# Gemini label extraction spike

## Official documentation reviewed on 20 November 2026

- Selected model: `gemini-3.5-flash-lite` accepts images and returns text. Google lists standard input and output as free within the free tier. The live run below verified model access. This project’s billing tier is UNVERIFIED. [Model card](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite) · [Pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite)
- Other image-understanding options include the preview model `gemini-3.1-pro-preview` and the older `gemini-2.5-flash`; Google restricts 2.5 Flash access to existing users. [Model catalogue](https://ai.google.dev/gemini-api/docs/models)
- Free-tier RPM and RPD for this project: **UNVERIFIED**. Google directs users to AI Studio for active model/project quotas. Grounding quotas are separate from extraction request quotas. [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- Inline data has a documented 100 MB total payload limit; base64 and the prompt are part of the request. This spike sends one PNG, JPEG or WebP per request. Google documents a maximum of 3,600 image files per request. [Input methods](https://ai.google.dev/gemini-api/docs/file-input-methods) · [Image inputs](https://ai.google.dev/gemini-api/docs/image-understanding)
- Structured output supports a subset of JSON Schema. JSON shape alone cannot establish whether a value was visible. [Structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- Bounding boxes use [ymin, xmin, ymax, xmax], normalized to 0–1000. Multiply x by image width / 1000 and y by image height / 1000 to obtain pixel edges. [Image understanding](https://ai.google.dev/gemini-api/docs/image-understanding)
- Under the unpaid terms Google may use submitted content and responses for product improvement and human review. Google advises against sending sensitive, personal or confidential material. The terms apply paid-service data handling in the EEA, Switzerland and UK, including for unpaid quota. [Gemini API terms](https://ai.google.dev/gemini-api/terms)

## Comparison method

From Backend run `node --env-file-if-exists=.env scripts/gemini-extract-spike.js`. Each image uses the current Tesseract OCR and built-in extraction patterns offline, without project-specific database overrides. Gemini latency includes response transfer and any single 429 backoff. Tesseract latency includes OCR and field extraction. Each duration is per image and repeats across its seven fields. Confidence is model-reported. Values are recorded without grading.

## Run 2026-11-20T05:53:55.550Z

| Image | Field | Gemini | Tesseract | Gemini ms | Tesseract ms | isLabel / readable | Evidence | Confidence | Box |
|---|---|---|---|---:|---:|---|---|---:|---|
| Gemini_Generated_Image_5gedn45gedn45ged.png | netQuantity | 10 kg | null | 17554 | 9475 | true / true | 10 kg | 0.99 | 739, 317, 753, 348 |
| Gemini_Generated_Image_5gedn45gedn45ged.png | mrp | null | null | 17554 | 9475 | true / true | — | 1 | — |
| Gemini_Generated_Image_5gedn45gedn45ged.png | mfgDate | null | null | 17554 | 9475 | true / true | — | 1 | — |
| Gemini_Generated_Image_5gedn45gedn45ged.png | manufacturer | Paribit Agri Industries Limited | null | 17554 | 9475 | true / true | Paribit Agri Industries Limited | 0.95 | 476, 297, 485, 427 |
| Gemini_Generated_Image_5gedn45gedn45ged.png | genericName | WHEAT FLOUR (ATTA) | null | 17554 | 9475 | true / true | WHEAT FLOUR (ATTA) | 0.99 | 435, 264, 452, 434 |
| Gemini_Generated_Image_5gedn45gedn45ged.png | consumerCare | null | null | 17554 | 9475 | true / true | — | 1 | — |
| Gemini_Generated_Image_5gedn45gedn45ged.png | countryOfOrigin | INDIA | PRODUCT OF INDIA Leas Doerice | 17554 | 9475 | true / true | PRODUCT OF INDIA | 0.99 | 686, 309, 695, 388 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | netQuantity | 94g | null | 18033 | 7135 | true / true | NET QTY: 94g | 0.95 | 834, 233, 857, 329 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | mrp | null | rs (330 | 18033 | 7135 | true / true | — | 0 | — |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | mfgDate | null | RCALLUSAT1800 | 18033 | 7135 | true / true | — | 0 | — |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | manufacturer | PepsiCo India Holdings Pvt. Ltd. | PepsiCo india Holdings Pv. Ltd. | 18033 | 7135 | true / true | MARKETED BY: PepsiCo India Holdings Pvt. Ltd. | 0.9 | 464, 537, 493, 709 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | genericName | Namkeen | null | 18033 | 7135 | true / true | PROPRIETARY FOOD – NAMKEEN (15.1) | 0.9 | 317, 231, 329, 392 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | consumerCare | THE CONSUMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | 1800224020 | 18033 | 7135 | true / true | THE CONSUMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | 0.9 | 629, 538, 788, 727 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | countryOfOrigin | null | null | 18033 | 7135 | true / true | — | 0 | — |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | netQuantity | 100g | null | 35110 | 3641 | true / true | NET WT. 100g | 0.95 | 738, 478, 766, 606 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | mrp | null | null | 35110 | 3641 | true / true | — | 0 | — |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | mfgDate | null | null | 35110 | 3641 | true / true | — | 0 | — |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | manufacturer | GITS FOOD PRODUCTS PVT. LTD. | null | 35110 | 3641 | true / true | Manufactured by GITS FOOD PRODUCTS PVT. LTD. | 0.95 | 784, 450, 806, 771 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | genericName | Gulab Jamun mix | null | 35110 | 3641 | true / true | Gulab Jamun mix | 0.85 | 344, 700, 354, 771 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | consumerCare | 020-6249 4000 | null | 35110 | 3641 | true / true | 020-6249 4000 | 0.9 | 844, 664, 864, 770 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | countryOfOrigin | null | null | 35110 | 3641 | true / true | — | 0 | — |
| test1.jpg | netQuantity | null | null | 3579 | 1424 | true / true | — | 0 | — |
| test1.jpg | mrp | null | null | 3579 | 1424 | true / true | — | 0 | — |
| test1.jpg | mfgDate | null | null | 3579 | 1424 | true / true | — | 0 | — |
| test1.jpg | manufacturer | PepsiCo India Holdings Pvt. Ltd. | PepsiCo India Holdings Pvt. Ltd. | 3579 | 1424 | true / true | PepsiCo India Holdings Pvt. Ltd. | 0.95 | 224, 117, 254, 833 |
| test1.jpg | genericName | null | null | 3579 | 1424 | true / true | — | 0 | — |
| test1.jpg | consumerCare | THE CONSUMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | null | 3579 | 1424 | true / true | THE CONSUMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | 0.95 | 606, 156, 910, 849 |
| test1.jpg | countryOfOrigin | INDIA | null | 3579 | 1424 | true / true | INDIA. | 0.9 | 739, 747, 764, 830 |
| test2.jpeg | netQuantity | 118 g | null | 11035 | 4888 | true / true | 118 g | 0.9 | 202, 224, 229, 256 |
| test2.jpeg | mrp | 35/- | null | 11035 | 4888 | true / true | 35/- | 0.9 | 73, 286, 107, 322 |
| test2.jpeg | mfgDate | null | null | 11035 | 4888 | true / true | — | 0 | — |
| test2.jpeg | manufacturer | PEPSICO INDIA HOLDINGS PVT. LTD. | null | 11035 | 4888 | true / true | PEPSICO INDIA HOLDINGS PVT. LTD., | 0.9 | 630, 383, 673, 433 |
| test2.jpeg | genericName | null | null | 11035 | 4888 | true / true | — | 0 | — |
| test2.jpeg | consumerCare | CONSUMER.FEEDBACK@PEPSICO.COM | null | 11035 | 4888 | true / true | CONSUMER.FEEDBACK@PEPSICO.COM | 0.9 | 530, 119, 899, 147 |
| test2.jpeg | countryOfOrigin | null | null | 11035 | 4888 | true / true | — | 0 | — |
| test3.jpeg | netQuantity | null | null | 3467 | 2771 | true / true | — | 0 | — |
| test3.jpeg | mrp | Rs. 35/- | Rs.35 | 3467 | 2771 | true / true | MRP Rs. 35/- | 0.95 | 753, 72, 781, 233 |
| test3.jpeg | mfgDate | null | null | 3467 | 2771 | true / true | — | 0 | — |
| test3.jpeg | manufacturer | null | null | 3467 | 2771 | true / true | — | 0 | — |
| test3.jpeg | genericName | Namkeen | null | 3467 | 2771 | true / true | PROPRIETARY FOOD - NAMKEEN | 0.95 | 166, 36, 196, 448 |
| test3.jpeg | consumerCare | null | null | 3467 | 2771 | true / true | — | 0 | — |
| test3.jpeg | countryOfOrigin | null | null | 3467 | 2771 | true / true | — | 0 | — |
| Test1_Kurkure.webp | netQuantity | null | null | 3558 | 1864 | true / true | — | 0 | — |
| Test1_Kurkure.webp | mrp | 20/- | null | 3558 | 1864 | true / true | MRP Rs. 20/- | 0.95 | 677, 229, 687, 300 |
| Test1_Kurkure.webp | mfgDate | null | null | 3558 | 1864 | true / true | — | 0 | — |
| Test1_Kurkure.webp | manufacturer | PepsiCo India Holdings Pvt. Ltd. | null | 3558 | 1864 | true / true | PEPSICO INDIA HOLDINGS PVT. LTD. | 0.95 | 582, 541, 594, 730 |
| Test1_Kurkure.webp | genericName | NAMKEEN | null | 3558 | 1864 | true / true | NAMKEEN | 0.95 | 676, 228, 686, 276 |
| Test1_Kurkure.webp | consumerCare | THE CUSTOMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | null | 3558 | 1864 | true / true | THE CUSTOMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | 0.9 | 723, 539, 843, 747 |
| Test1_Kurkure.webp | countryOfOrigin | null | null | 3558 | 1864 | true / true | — | 0 | — |
| blank.png | netQuantity | null | null | 2913 | 216 | false / false | — | 0 | — |
| blank.png | mrp | null | null | 2913 | 216 | false / false | — | 0 | — |
| blank.png | mfgDate | null | null | 2913 | 216 | false / false | — | 0 | — |
| blank.png | manufacturer | null | null | 2913 | 216 | false / false | — | 0 | — |
| blank.png | genericName | null | null | 2913 | 216 | false / false | — | 0 | — |
| blank.png | consumerCare | null | null | 2913 | 216 | false / false | — | 0 | — |
| blank.png | countryOfOrigin | null | null | 2913 | 216 | false / false | — | 0 | — |

## Privacy and latency settings

- **Yes.** Under the unpaid-service terms Google uses submitted content (including images) and responses to develop and improve its products. Human reviewers may process them. Google advises against submitting personal, confidential or sensitive content. Paid-service data handling applies in the EEA, Switzerland and UK even for unpaid quota. This project's billing tier is UNVERIFIED. [Terms](https://ai.google.dev/gemini-api/terms)
- The variant explicitly requests MINIMAL thinking. This is already the documented default for Gemini 3.5 Flash-Lite, so a measured difference cannot be attributed to switching thinking off. [Thinking levels](https://ai.google.dev/gemini-api/docs/thinking)
- Low media resolution uses fewer visual tokens and may lose fine print. Separately, the client scales the oriented image to 80% of its original linear dimensions or a longest edge of 960 px, whichever is smaller, and encodes JPEG at quality 88. No cropping or padding. The independent latency effect of downscaling is UNVERIFIED. [Media resolution](https://ai.google.dev/gemini-api/docs/media-resolution) · [Image processing](https://ai.google.dev/gemini-api/docs/image-understanding)
- Compact JSON retains only the seven values and their boxes. The response limit is 1,024 tokens. A cap alone does not establish a speedup; the independent effect of response length here is UNVERIFIED. [Generation configuration](https://ai.google.dev/api/generate-content#GenerationConfig)
- Run `node --env-file-if-exists=.env scripts/gemini-extract-spike.js --low-latency` from Backend with Python and Pillow installed. Each image gets one request. Timings cover the Gemini request through response parsing, excluding local resize and overlay rendering. Before/after values are compared as recorded in Markdown, including case and punctuation and collapsing whitespace. Each latency is repeated for its seven fields.
- Overlay PNGs in `docs/spike-overlays/` have baseline and low-latency suffixes. Both use the oriented full-size source. The box order is [ymin, xmin, ymax, xmax] on a 0–1000 scale. Each x edge is multiplied by source width / 1000 and each y edge by source height / 1000, rounded and clipped at the last pixel. Null boxes draw nothing. [Google's box convention](https://ai.google.dev/gemini-api/docs/image-understanding#object-detection)

## Low-latency run 2026-11-20T06:07:59.557Z

| Image | Field | Before | After | Changed | Before ms | After ms | After box |
|---|---|---|---|---|---:|---:|---|
| Gemini_Generated_Image_5gedn45gedn45ged.png | netQuantity | 10 kg | 10 kg | no | 17554 | 9231 | 740, 314, 756, 356 |
| Gemini_Generated_Image_5gedn45gedn45ged.png | mrp | null | null | no | 17554 | 9231 | — |
| Gemini_Generated_Image_5gedn45gedn45ged.png | mfgDate | null | null | no | 17554 | 9231 | — |
| Gemini_Generated_Image_5gedn45gedn45ged.png | manufacturer | Paribit Agri Industries Limited | RODI01 ADDG Mingream Ltd. Appennor Route No 6x, 601 02 3 Po Rome, Prise Koryza Rags, Nissin Se. Hazere Part On. 021: 783-6519370 | yes | 17554 | 9231 | 561, 541, 585, 686 |
| Gemini_Generated_Image_5gedn45gedn45ged.png | genericName | WHEAT FLOUR (ATTA) | WHEAT FLOUR (ATTA) | no | 17554 | 9231 | 401, 259, 418, 386 |
| Gemini_Generated_Image_5gedn45gedn45ged.png | consumerCare | null | services@apam.com.at | yes | 17554 | 9231 | 805, 564, 812, 630 |
| Gemini_Generated_Image_5gedn45gedn45ged.png | countryOfOrigin | INDIA | PRODUCT OF INDIA | yes | 17554 | 9231 | 665, 303, 674, 382 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | netQuantity | 94g | 94g | no | 18033 | 10777 | 860, 277, 892, 359 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | mrp | null | null | no | 18033 | 10777 | — |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | mfgDate | null | null | no | 18033 | 10777 | — |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | manufacturer | PepsiCo India Holdings Pvt. Ltd. | PEPSICO INDIA HOLDINGS PVT. LTD. | yes | 18033 | 10777 | 677, 539, 697, 705 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | genericName | Namkeen | NAMKEEN (15.1) | yes | 18033 | 10777 | 339, 263, 359, 368 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | consumerCare | THE CONSUMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | 1800 22 4020 | yes | 18033 | 10777 | 741, 567, 757, 663 |
| Gemini_Generated_Image_e9sd44e9sd44e9sd.png | countryOfOrigin | null | null | no | 18033 | 10777 | — |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | netQuantity | 100g | 100g | no | 35110 | 28046 | 735, 501, 761, 619 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | mrp | null | 85.00 | yes | 35110 | 28046 | 579, 608, 589, 647 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | mfgDate | null | null | no | 35110 | 28046 | — |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | manufacturer | GITS FOOD PRODUCTS PVT. LTD. | GITS FOOD PRODUCTS PVT. LTD. | no | 35110 | 28046 | 794, 498, 809, 773 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | genericName | Gulab Jamun mix | Gulab Jamun | yes | 35110 | 28046 | 237, 174, 252, 350 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | consumerCare | 020-6249 4000 | 020-6249 4000 | no | 35110 | 28046 | 844, 674, 860, 770 |
| Gemini_Generated_Image_w1ipkww1ipkww1ip.png | countryOfOrigin | null | null | no | 35110 | 28046 | — |
| test1.jpg | netQuantity | null | null | no | 3579 | 16457 | — |
| test1.jpg | mrp | null | null | no | 3579 | 16457 | — |
| test1.jpg | mfgDate | null | null | no | 3579 | 16457 | — |
| test1.jpg | manufacturer | PepsiCo India Holdings Pvt. Ltd. | PepsiCo India Holdings Pvt. Ltd. | no | 3579 | 16457 | 227, 112, 257, 827 |
| test1.jpg | genericName | null | null | no | 3579 | 16457 | — |
| test1.jpg | consumerCare | THE CONSUMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | CONSUMER.FEEDBACK@PEPSICO.COM | yes | 3579 | 16457 | 847, 180, 902, 841 |
| test1.jpg | countryOfOrigin | INDIA | null | yes | 3579 | 16457 | — |
| test2.jpeg | netQuantity | 118 g | 118 g | no | 11035 | 4728 | 176, 230, 205, 279 |
| test2.jpeg | mrp | 35/- | null | yes | 11035 | 4728 | — |
| test2.jpeg | mfgDate | null | 09/08/26 | yes | 11035 | 4728 | 200, 177, 222, 242 |
| test2.jpeg | manufacturer | PEPSICO INDIA HOLDINGS PVT. LTD. | PEPSICO INDIA HOLDINGS PVT. LTD. | no | 11035 | 4728 | 522, 378, 561, 890 |
| test2.jpeg | genericName | null | null | no | 11035 | 4728 | — |
| test2.jpeg | consumerCare | CONSUMER.FEEDBACK@PEPSICO.COM | 1800 22 4020 | yes | 11035 | 4728 | 739, 218, 762, 348 |
| test2.jpeg | countryOfOrigin | null | null | no | 11035 | 4728 | — |
| test3.jpeg | netQuantity | null | null | no | 3467 | 4036 | — |
| test3.jpeg | mrp | Rs. 35/- | 35/- | yes | 3467 | 4036 | 766, 138, 787, 185 |
| test3.jpeg | mfgDate | null | 09/08/26 | yes | 3467 | 4036 | 786, 432, 798, 508 |
| test3.jpeg | manufacturer | null | PEPSICO INDIA HOLDINGS | yes | 3467 | 4036 | 680, 848, 701, 1000 |
| test3.jpeg | genericName | Namkeen | NAMKEEN | yes | 3467 | 4036 | 173, 277, 193, 352 |
| test3.jpeg | consumerCare | null | null | no | 3467 | 4036 | — |
| test3.jpeg | countryOfOrigin | null | null | no | 3467 | 4036 | — |
| Test1_Kurkure.webp | netQuantity | null | 20/- | yes | 3558 | 3284 | 703, 273, 722, 294 |
| Test1_Kurkure.webp | mrp | 20/- | 20/- | no | 3558 | 3284 | 702, 274, 721, 298 |
| Test1_Kurkure.webp | mfgDate | null | null | no | 3558 | 3284 | — |
| Test1_Kurkure.webp | manufacturer | PepsiCo India Holdings Pvt. Ltd. | PEPSICO INDIA HOLDINGS PVT. LTD. | yes | 3558 | 3284 | 598, 541, 620, 761 |
| Test1_Kurkure.webp | genericName | NAMKEEN | NAMKEEN | no | 3558 | 3284 | 671, 229, 685, 289 |
| Test1_Kurkure.webp | consumerCare | THE CUSTOMER SERVICES MANAGER, PEPSICO INDIA HOLDINGS PVT. LTD., P.O. BOX-27, DLF QUTAB ENCLAVE, PHASE-1, GURUGRAM - 122002, HARYANA, INDIA. OR CALL US AT 1800 22 4020 OR EMAIL US AT CONSUMER.FEEDBACK@PEPSICO.COM | 1800 22 4020 | yes | 3558 | 3284 | 816, 602, 827, 677 |
| Test1_Kurkure.webp | countryOfOrigin | null | null | no | 3558 | 3284 | — |
| blank.png | netQuantity | null | null | no | 2913 | 2358 | — |
| blank.png | mrp | null | null | no | 2913 | 2358 | — |
| blank.png | mfgDate | null | null | no | 2913 | 2358 | — |
| blank.png | manufacturer | null | null | no | 2913 | 2358 | — |
| blank.png | genericName | null | null | no | 2913 | 2358 | — |
| blank.png | consumerCare | null | null | no | 2913 | 2358 | — |
| blank.png | countryOfOrigin | null | null | no | 2913 | 2358 | — |
