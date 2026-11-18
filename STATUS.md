# SahiScan status

## Done and verified
- Phase 2 Task 1: removed unused preview switcher/context after reverse-import checks.
- Task 1 lint exit 0 (warnings); build built in 1.53s; adapter/render/report scripts PASS.
- Task 1 browser checks: UNTESTED.
- Clean reliability task: timing logs record OCR, upload, rulesAndSaveMs and total.
- Failed stages keep null durations; rulesAndSaveMs includes rules plus saves.
- PDF/DOCX buttons use authenticated metadata requests and reject undefined IDs.
- Backend npm run test:core: Offline core verification PASSED.
- Frontend verifyScanAdapter.mjs and verifyScanRendering.mjs: PASS.
- Frontend verifyReportDownload.mjs: PASS (mocked; no network).
- Frontend npm run lint: exit 0 with existing warnings.
- Frontend npm run build: 2935 modules transformed; built in 1.45s.
- Blank browser 422: verified by user-provided screenshot.
- Backend ruleStatus committed in 9e08e57; ruleEngine unchanged.
- Adapter and rendering scripts: PASS, including Exempt and unknown rules.
- Current npm run lint: exit 0 with warnings.
- Current npm run build: built in 3.49s; bundle-size warning.
- Current Backend npm run test:core: Offline core verification PASSED.
- Readability gate implemented; prior `npm run test:core`: PASSED.
- Prior API verification: blank 422; six JPG/PNG samples 201.
- `node scripts/verifyScanAdapter.mjs`: PASS.
- `node scripts/verifyScanRendering.mjs`: PASS.
- `npm run lint`: exit 0 with warnings.
- `npm run build`: 2934 modules; built in 1.27s.
- Browser actions: registration, label upload and saved result rendered.
- Result showed field findings and Measurement unavailable.
- Browser console collection at result: [].

## Known broken
- Network Error: not reproduced, monitor; cause unconfirmed.
- WebP filter is stashed; API WebP support remains incomplete.
- Five-screen reduction is pending.
- Gemini phase has not started.
- Header/logo redesign requested; no redesign applied.

## Not yet tested
- report opening in a real browser and scan latency: UNTESTED
- Blank failure root cause: unconfirmed.
- Exact blank temp file is unavailable; curl failed with code 26.
- File bytes and dimensions cannot be reverified.
- No scan request reached the API in this diagnosis.
- Original request terminal logs are unavailable in this turn.
- CORS headers on that original error remain unverified.
- Separate login and remaining final smoke checks remain untested.

## Next 3 steps
1. Collect timing measurements; reported 37-second scan cause unknown.
2. Resolve WebP support or document PNG/JPEG-only scope.
3. Redesign the header/logo and reduce the frontend to five screens.
