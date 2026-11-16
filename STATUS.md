# SahiScan status

Last updated: 2026-11-16

## What works

- Backend offline core check: `cd Backend; npm run test:core` → `Offline core
  verification PASSED`.
- Backend boot and Atlas connection: `npm start` → `Connected to MongoDB Atlas
  ([REDACTED])` and server listening on port 5000.
- API smoke checks: health 200, signup 201, login 200, and a sample scan 201.
  Tokens were redacted.
- Scan ownership check: a second normal user received 403 when reading another
  user's scan.
- Tesseract returns word-level text, confidence, and bounding boxes.

## What is broken or incomplete

- The result adapter now reads contract fields as an array and defaults unknown
  or missing statuses to needs-review. Missing font data shows Measurement unavailable.
- The readability gate is implemented and verified: fewer than 20 words or
  60 trimmed characters returns 422 before upload or persistence. It does not
  identify unrelated images with text; `isLabel` remains unknown.
- Browser rendering and console testing are UNTESTED because the available
  browser could not reach the local Vite server.
- Several frontend routes remain placeholders, mock-data views, or alert-only
  workflows. See `docs/AUDIT.md`.

## Next steps

Theme work: added indigo/saffron tokens and bilingual branding to auth and scan
result views. `npm run lint` exited 0 with existing warnings; `npm run build`
reported `✓ built in 2.06s` with a large-chunk warning. Browser rendering is
UNTESTED.

The scan service now gates each image on at least 20 OCR words and 60 trimmed
characters. This is a readability check, not label detection. API verification
returned 422 `UNREADABLE_OR_NON_LABEL_IMAGE` for a blank PNG. Six supplied
JPG/PNG samples returned 201; WebP returned 400 `INVALID_FILE_TYPE`.
POST and GET contract comparison returned `same contract true legacy true`.
`npm run test:core` returned `Offline core verification PASSED`.

OCR measurements: `cd Backend; node scripts/measure-ocr.js` exited 0; all
seven supplied images and the generated blank loaded. See `docs/DUMMY_RUNS.md`.

1. Update the frontend to use the implemented scan contract without fabricated values.
2. Add repeatable result rendering and upload-error checks for the viva demo.
3. Complete WebP dimension support together with its upload-filter change.

## Approved implementation — step 1

Preserved pending theme work in its own frontend commit. The incomplete WebP
filter is saved in Git stash `Deferred WebP filter: pair with dimension support`.
No backend change is part of the theme commit. The seven test images remain untracked.
Viva: tokens centralize colors/fonts; the bilingual heading identifies the student
project; the advisory footer explains that a scan needs human verification.

## Approved implementation — step 2

Scan upload now uses scanId and exposes required product name/category outside
optional calibration. Results use fields by fieldName, normalize status aliases,
and load the current ID on refresh/navigation. Shared header/footer and auth copy
identify SahiScan rather than a government department.
Proof: `node scripts/verifyScanAdapter.mjs` printed `PASS: unknown/missing statuses
need review; contract ID, fields, font and 422 mapping`. `npm run build` printed
`built in 2.13s` (large-chunk warning remains). Browser verification is pending.
Viva: the adapter translates API data once; missing evidence remains unknown;
the result component displays server findings rather than calculating legal rules.
