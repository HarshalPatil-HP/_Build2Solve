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

- The frontend displays a hardcoded 2.8 mm font fallback because its expected
  response properties do not match the backend response shape.
- `analysis.fields` is an array in the backend but the result card reads it as
  an object.
- Blank and non-label images are accepted and saved as `needs-review`; there is
  no unreadable/non-label gate yet.
- Browser rendering and console testing are UNTESTED because the available
  browser could not reach the local Vite server.
- Several frontend routes remain placeholders, mock-data views, or alert-only
  workflows. See `docs/AUDIT.md`.

## Next steps

OCR measurements: `cd Backend; node scripts/measure-ocr.js` exited 0; all
seven supplied images and the generated blank loaded. See `docs/DUMMY_RUNS.md`.

1. Add an OCR image-quality/non-label gate before Cloudinary and persistence.
2. Publish a stable scan response contract while preserving compatibility.
3. Update the frontend to use the contract without fabricated font values.
4. Add repeatable API and scan smoke tests for the viva demo.
