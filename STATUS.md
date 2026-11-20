# SahiScan status

## Done and verified
- Five lazy page chunks verified by Frontend npm run build (1.01s). Lint and all four verification scripts exited 0. Browser checks: UNTESTED.
- History report links open Result. Breadcrumbs link only to configured pages. Browser checks: UNTESTED.
- Removed 44 unreferenced pages from the approved inventory. Frontend lint/build and all four verification scripts exited 0.
- Router exposes Auth, Scan, Result, History and Admin. Root/login/signup redirect to Auth; unknown paths render inline.
- Backend `npm run test:core` passed for OCR word offsets, quantity selection and unresolved quantity/font checks.
- Offline Gits label replay with seed rules: netQuantity and fontSize both null, needs-review.
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
- Phase 2 Task 2 stopped: Python cp1252 decode error reading Header.jsx.
- Partial navigation edits are uncommitted and UNTESTED; no page files deleted.
- Task 2 role test, lint/build and regression scripts were not run.
- Task 2 browser checks: UNTESTED.
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

## Phase 2 Task 2 — navigation
- Active user/company/inspector login paths now open /scan; admin opens /admin/dashboard.
- Pending/rejected inspector accounts see a blocked state; unauthenticated returns to /auth.
- Sidebar and page metadata now describe the five kept screens; removed notification and result complaint/case actions.
- Role test: node scripts/verifyFiveScreenRoles.mjs PASS.
- Frontend npm run lint: exit 0 with existing warnings. npm run build: 2935 modules, built in 1.75s (large bundle warning).
- verifyScanAdapter.mjs, verifyScanRendering.mjs, verifyReportDownload.mjs: PASS.
- Browser checks: UNTESTED. Old page files retained. No scans or uploads.

## Rule 26 exemption fix
- Exemption now requires parsed quantity >0 and <=10 g/ml; 0 and missing proceed to review.
- Required declarations must be verified before a normal path can report compliant.
- Backend npm run test:core: Offline core verification PASSED; four Rule 26 quantity cases passed.
- No scan or upload run.
