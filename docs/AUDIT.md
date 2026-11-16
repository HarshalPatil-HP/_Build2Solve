# Sahi Scan repository audit

Audit date: 2026-11-15. This was a read-only audit. The only file created was
this file. Environment values were never read or printed.

## 1. Repo map

Top-level tree (excluding `node_modules`):

```text
.
├── Backend/                 Express/Mongoose API
├── Frontend/                Vite/React application
├── FRONTEND_PROGRESS.md
├── SIH26034_PRODUCTION_PRD.md
└── SIH26034_Technical_PRD.pdf
```

Text line counts (actual text files only; excluding `node_modules`, lockfiles,
build output, and binary traineddata/images): Backend 2,641; Frontend 5,277.
Largest source folders: `Backend/src/services` 1,016; `Backend/src/models` 440;
`Frontend/src/components/scan` 672; `Frontend/src/pages/admin` 703;
`Frontend/src/pages/inspector` 545. The command was the PowerShell recursive
`Get-ChildItem`/`Get-Content | Measure-Object -Line` command restricted to
`.js,.jsx,.json,.md,.html,.css,.mjs,.svg,.txt`; output included
`Backend/src/services: 1016` and `Frontend/src/pages/admin: 703`.

Git history: 14 commits, from 2026-09-06 to 2026-09-19. Commands:
`git log --format=%H | Measure-Object` and `git log --format=%ad --date=short`.
Output: `14`, first `2026-09-06`, last `2026-09-19`.

Important baseline: `git status --short` before this audit already reported
`M Backend/src/app.js` (a removed comment). It is pre-existing and was not
changed by this audit.

## 2. Backend

Run commands: `cd Backend; npm run test:core`, `npm run test:models`, and
`npm start`. `npm run test:core` **WORKS**: output `Offline core verification
PASSED`. The model test started (`--- Starting MongoDB & Models Verification ---`)
but did not connect/finish within 30 seconds. `npm start` loaded `.env` but
did not log MongoDB connection or HTTP listener within 30 seconds. Therefore DB
connection and API boot are **UNTESTED**, not proven broken.

Every route is listed below. Controller/service links are from static imports.
All data routes are **UNTESTED** because the server did not become available;
their shared evidence is the timed command above. No route was called with curl.

| Method | Path | Middleware | Controller → service | Status/evidence |
|---|---|---|---|---|
| GET | `/api/health` | none | `health.getHealth` → none | UNTESTED — listener absent in 30s |
| POST | `/api/auth/signup` | validate signup | `auth.signup` → `auth.signup` | UNTESTED |
| POST | `/api/auth/login` | validate login | `auth.login` → `auth.login` | UNTESTED |
| POST | `/api/auth/staff` | authenticate, admin, validate | `auth.createStaff` → `auth.createStaff` | UNTESTED |
| POST | `/api/scans` | authenticate, user/company/inspector, multer, validate | `scan.createScan` → `scan.createScan` | UNTESTED |
| GET | `/api/scans` | authenticate | `scan.getScans` → `scan.getScans` | UNTESTED |
| GET | `/api/scans/:id` | authenticate | `scan.getScanById` → `scan.getScanById` | UNTESTED |
| GET | `/api/scans/:id/report` | authenticate | `scan.getScanReport` → `scan.getScanReport` | UNTESTED |
| POST | `/api/complaints` | authenticate, user, validate | `complaint.create` → `createComplaint` | UNTESTED |
| GET | `/api/complaints` | authenticate | `complaint.list` → `listComplaints` | UNTESTED |
| PATCH | `/api/complaints/:id` | authenticate, admin, validate | `complaint.update` → `updateComplaint` | UNTESTED |
| POST | `/api/cases` | authenticate, inspector, validate | `case.create` → `createCase` | UNTESTED |
| GET | `/api/cases` | authenticate, inspector/admin | `case.list` → `listCases` | UNTESTED |
| GET | `/api/cases/:id` | authenticate, inspector/admin | `case.getOne` → `getCaseById` | UNTESTED |
| PATCH | `/api/cases/:id` | authenticate, inspector, validate | `case.update` → `updateCase` | UNTESTED |
| POST | `/api/cases/:id/lock` | authenticate, inspector | `case.lock` → `lockCase` | UNTESTED |
| POST | `/api/cases/:id/addendum` | authenticate, inspector, validate | `case.addendum` → `addAddendum` | UNTESTED |
| GET | `/api/companies` | authenticate, inspector/admin | `company.list` → `listCompanies` | UNTESTED |
| GET | `/api/companies/:id/history` | authenticate, inspector/admin | `company.history` → `getCompanyHistory` | UNTESTED |
| GET | `/api/rules` | authenticate, admin | `rule.list` → `listRules` | UNTESTED |
| POST | `/api/rules` | authenticate, admin, validate | `rule.create` → `createRule` | UNTESTED |
| PATCH | `/api/rules/:id/deactivate` | authenticate, admin | `rule.deactivate` → `deactivateRule` | UNTESTED |
| GET | `/api/dashboard/summary` | authenticate, admin | `dashboard.summary` → `getSummary` | UNTESTED |

Models: all requested nine are present: users (`user.model.js`), companies,
products, rules, scans, violations, complaints, cases, and reports. This is
presence only; persistence was UNTESTED.

## 3. Scan pipeline

Tesseract is wired: `Backend/src/services/ocr.service.js` imports
`tesseract.js`, creates an `eng+hin` worker, calls `recognize(...,
{rotateAuto:true}, {blocks:true})`, and terminates it. Regex extraction is in
`Backend/src/services/extraction.service.js`; rule evaluation is in
`Backend/src/services/ruleEngine.service.js`. Active DB rules are queried by
both services; code supplies fallback OCR regexes, exemptions, thresholds,
placement logic and font calculation. Thus rules are mixed: legal-rule records
come from MongoDB, while important behaviour is hardcoded.

Rule 7 uses the **area-based** `FONT_TABLE`: PDP area bands 50, 100, 500,
2,500, and infinity cm² with normal/molded minimum millimetres. It is not an
old weight-based table.

A real sample-image scan is **UNTESTED**: it requires a booted DB-backed API,
valid auth, and Cloudinary upload. The only executable core check was
`npm run test:core` → `Offline core verification PASSED`; it does not prove an
OCR image run.

## 4. Frontend

Framework: React 19 + Vite + React Router 7, Axios, Tailwind. `npm run lint`
**WORKS** (exit 0), but emitted many warnings, e.g. `InspectorMapPage.jsx:1`
unused `Building` and `AuditLogPage.jsx` impure `Date.now` render. No browser
render or console test was possible because the app/API were not running;
every render and console result is **UNTESTED**.

Router declares 45 paths. Page/API wiring classification is static, not proof:

| Paths/pages | API call present? | Button handlers / status |
|---|---|---|
| `/`, `/auth` — Landing, Auth | Auth yes; landing has alert-only product search | UNTESTED render; search is STUB |
| forgot/reset/pending, offline/404 | no / reset is placeholder | UNTESTED; reset/404/offline STUB |
| scan, result, report, history | scan service yes | UNTESTED; handlers exist |
| profile, notifications | no; both placeholder | STUB |
| user dashboard, complaints/new/list/detail | dashboard/complaint/scan calls except detail | UNTESTED; detail has no API call |
| company dashboard/products/history/team/profile | dashboard/products calls; history is placeholder | UNTESTED; team invite has no API |
| inspector dashboard/scan/companies/history/cases/detail/complaints/map/offline/profile | several dashboard/scan/company/case calls; history, complaints, profile, offline are placeholders | map uses hardcoded pins; UNTESTED |
| admin dashboard/companies/detail/complaints/cases/inspectors/pending/performance/rules/users/reports/audit/profile | dashboard, staff, rules calls; eight listed placeholder pages | pending approval and report export are alert-only STUB; audit log is hardcoded |

Reusable: `services/apiClient.js` (base URL, JWT interceptor/error handling),
the service modules, `AuthContext`, role guards, and scan UI components.
Replace or complete: `AuthPreviewContext`/`PreviewRoleSwitcher` explicitly say
they are temporary preview auth; placeholder pages; alert-only workflows;
hardcoded charts/pins/logs. Root cause of apparently non-working buttons is
not one proven defect: static evidence shows multiple buttons deliberately only
show `alert`, preview state, or no API integration, while runtime clicking is
UNTESTED.

## 5. Dead/duplicate files, broken imports, mocks, TODOs

No broken import was proven (lint exited 0). Duplicate/likely obsolete:
`CompanyProductHistoryPage.jsx` is not imported by the router while
`ProductHistoryPage.jsx` is; `InspectorOfflineQueuePage.jsx` exists but router
uses `OfflineQueuePage.jsx`; `ReportsPage.jsx` exists but router uses
`AdminReportsPage.jsx`; `AuditLogPage.jsx` exists but router uses
`AdminAuditLogPage.jsx`.

Mocks/stubs: Landing `sampleProducts`; Inspector Map `pins`; Admin Dashboard
`violationChartData`/`trendData`; Audit Log `logs`; Pending Inspectors seeded
state; report export and approval alerts. TODOs explicitly say to replace
`AuthPreviewContext` and remove `PreviewRoleSwitcher` once JWT auth is wired.

## 6. Quick security check

- Password hashing: static **WORKS-by-code-review only** — bcrypt hash with 10
  rounds and compare are used. Runtime UNTESTED.
- JWT: `JWT_SECRET` is set in `Backend/.env` [REDACTED]; it is read directly
  from `process.env` for signing and verification. No startup validation for a
  missing/weak secret was found.
- Route roles: static inspection finds `authenticate`/`authorize` on all
  non-health backend routes as listed in section 2. Runtime enforcement is
  UNTESTED.
- `.env` is ignored by `**/.env`; `Backend/.env` is present and its 10 named
  variables are set [REDACTED].

## 7. Gap list against minimal scope

| Scope | Audit result |
|---|---|
| Auth | Backend exists; frontend retains preview auth; end-to-end UNTESTED |
| Scan | Code exists; no real upload/OCR/API run completed |
| Result | Pages/components exist; end-to-end UNTESTED |
| History | API/page exist; runtime UNTESTED |
| Admin dashboard | Page/API exist, but charts and several admin pages are placeholders/stubs |

## 8. Top 10 risks (ranked)

1. DB/API did not demonstrate a connection/listener within 30 seconds.
2. Frontend has preview authentication alongside real JWT code, risking role/UI mismatch.
3. Many promised pages are placeholders or alert-only workflows.
4. No automated end-to-end scan test proves auth, Cloudinary, OCR, DB, or report generation together.
5. Rule decisions are split across DB and code, making legal-rule changes hard to audit.
6. Font measurement is an estimated photo calculation, not a reliable physical measurement.
7. Scan endpoint permits any authenticated user to read scans; ownership filtering depends on untested service logic.
8. JWT secret has no visible fail-fast validation for missing/weak configuration.
9. Frontend lint has widespread warnings, including state-effect and render-purity warnings.
10. Pre-existing uncommitted backend change means the repository has no clean baseline.

OPINION: first make DB boot, health, signup/login, and one real scan reproducible
with scripted smoke tests; then remove preview auth and replace placeholder pages
only within the five-screen scope.

## 9. 10-line summary

1. This is a React/Vite frontend with an Express/Mongoose backend.
2. There are 14 commits between 2026-09-06 and 2026-09-19.
3. All nine requested data models exist.
4. Offline backend core verification passed.
5. MongoDB connection and HTTP boot were not demonstrated within 30 seconds.
6. Therefore every HTTP route remains UNTESTED, not certified working.
7. Tesseract, regex extraction, and a DB-backed rule engine are present in code.
8. Rule 7 uses an area-based font table.
9. The frontend has many real handlers but also placeholders, mocks, alerts, and preview auth.
10. The priority is a small, reproducible end-to-end path before adding more UI.

## Task 2 runtime follow-up (2026-11-15)

### A. Backend boot and database

Command: `cd Backend; npm start`.

Result: the API booted. There was no error class/message to report. Sanitized
output: `[database] Connected to MongoDB Atlas ([REDACTED])` and
`[server] development | port 5000 | http://localhost:5000/api/health`.
MongoDB is **Atlas**, not local MongoDB, and was reachable from the backend
process. No DB fix is needed. If it had not been available, the smallest
non-applied fix would be either starting a local `mongod` and setting
`MONGODB_URI` to its local address, or `docker run -p 27017:27017 mongo` and
the same local URI. No configuration was changed.

### B. API smoke sequence

The initial sandboxed localhost curl was blocked (`curl: (7) ... Bad access`),
so these requests were made with approved localhost access.

| Step | Command/result | Short evidence |
|---|---|---|
| Health | `curl.exe -s -i http://127.0.0.1:5000/api/health` | `HTTP/1.1 200 OK`; JSON `status: ok`, `message: Server is healthy` |
| Signup | PowerShell `Invoke-RestMethod POST /api/auth/signup` with a generated test user | `status=201 message=Account created token=[REDACTED]` |
| Login | PowerShell `Invoke-RestMethod POST /api/auth/login` for that test user | `status=200 message=Login successful token=[REDACTED]` |
| Scan | `POST /api/scans` multipart with existing `Frontend/src/assets/hero.png` (13,057 bytes), generated test user and auth header | `status=201 message=Scan completed` |

Cloudinary did not fail in this run; a scan completed. The present scan service
uploads originals to Cloudinary before OCR, so upload is **not currently
optional**. A local fallback is technically feasible (store the multer memory
buffer locally and persist a local URL/path), but that is an OPINION and would
require code, storage/security, and deployment changes; none were applied.

### C. Frontend runtime/UI checks

Command: `cd Frontend; npm run dev -- --host 127.0.0.1`.
Output: `VITE v8.3.0 ready` and `Local: http://127.0.0.1:3000/`.

I attempted to open `http://127.0.0.1:3000/auth` in the available in-app
browser. Evidence: `net::ERR_CONNECTION_TIMED_OUT`. A subsequent native-browser
inspection was stopped because the computer-use layer could not establish the
browser URL with sufficient confidence. A separate localhost HTTP attempt also
timed out. Consequently, browser rendering, console errors, and whether buttons
actually issue API requests are **UNTESTED** for all requested paths:
`/auth`, `/scan`, `/scan/:id/result`, `/history`, `/admin/dashboard`. The dev
server process reported ready, but this does not prove page rendering. Static
inspection remains as recorded in section 4.

### D. Scan ownership enforcement

This was tested at runtime. A generated User A created a scan; generated User B
then requested User A's `/api/scans/:id` with User B's valid JWT. Command:
PowerShell `Invoke-RestMethod GET /api/scans/$id` with User B's Authorization
header. Output: `OWNERSHIP status=403` with short body
`{"success":false,"message":"Forbidden","code":"FORBIDDEN"}`.
Therefore normal-user cross-owner scan reads are enforced in this test. Static
code also compares `scan.scannedBy` with `req.user.userId` in
`Backend/src/services/scan.service.js`.

### Task 2 final working-tree check

Final command: `git status --short` (recorded after this append) reports exactly
`M docs/AUDIT.md`. `git diff --name-only` and
`git ls-files --others --exclude-standard` both report only `docs/AUDIT.md`.
No other repository file differs from HEAD.

## Task 3: constant scan-result diagnosis (2026-11-16)

### 1. Three-image pipeline evidence

I ran the actual `runOcr` → `extractFields` → `checkFontSize` path against
the reachable Atlas rule data. Inputs were held in memory: one public product
label, repository asset `Frontend/src/assets/hero.png` as a random graphic, and
a public 600×400 all-white PNG. No scan record or local file was created.

Command (abbreviated): `node -e` loaded `ocr.service`, `extraction.service`,
`ruleEngine.service`, and `getImageDimensions`, then ran all three buffers.
The full captured output was:

| Image | Raw OCR text | Extracted fields | Font calculation input → output |
|---|---|---|---|
| Product label, 460×1024 | `vir Rs 36.00\nwwe 9 G0216PRD\nBatch 16.02.2016\nDate of RS 12016\nBEST BEFORE\np-\nके Nitrogen Flushed, 51076 i\n4 cool and dry place.\nhd ~ Do not buy the pack if found famperes\n\| Halal Certified Lal\namie E\nSt 2005\nA Certified\nack iron \| Company,\n- HACCP\niG PA ? )\nGown) won` | `mrp: "Rs 36.00"`; net quantity, date, consumer care, generic name, manufacturer, country: null | qty block null; dimensions omitted; image height 1024; molded false → `detected:false`, value null, `needs-review`, `estimated:true`, “Net quantity block not detected…” |
| Random graphic, 343×361 | `<` | all fields null | qty block null; dimensions omitted; image height 361; molded false → same `needs-review` output, value null |
| Blank PNG, 600×400 | empty string | all fields null | qty block null; dimensions omitted; image height 400; molded false → same `needs-review` output, value null |

OCR block counts were respectively 57, 1, and 0. The label OCR had an actual
first word box: `{text:"vir", x:144, y:104, width:27, height:10,
confidence:49}`. The backend’s three font outputs were the same **only in the
sensible “no net-quantity block” way**; none output `2.8 mm`.

### 2. Exact constant-output point

The constant visible `2.8 mm` is a frontend hardcoded fallback, not empty OCR,
regex fallback, or the backend font calculator.

- `Frontend/src/components/scan/FontCalibratorBox.jsx:5-7` sets fallback area
  `330`, required font `4.0`, and `measured = measuredMm || 2.8`.
- `Frontend/src/components/scan/ScanResultCard.jsx:219-223` passes
  `analysis.pdpAreaCm2`, `analysis.requiredFontMm`, and
  `analysis.measuredFontMm` to that component.
- Backend `runRuleEngine` returns font evidence as an item in
  `analysis.fields` (`Backend/src/services/ruleEngine.service.js:252-256`),
  with `value` such as `"2.50mm (min 1.5mm)"`; it does not return any of those
  three top-level frontend property names.
- The calculator itself uses actual matched net-quantity box height or zero:
  `Backend/src/services/ruleEngine.service.js:36-56`. In the three tests its
  result was null / `needs-review`, as above.

There is a second response-shape mismatch: `ScanResultCard.jsx:26` assigns
`analysis.fields || {}`, but the backend returns `analysis.fields` as an array.
Its later accesses such as `fields.netQuantity` cannot find array entries and
fall back to UI defaults. This explains the repeated warning as well.

### 3. Non-label/unreadable-image rejection

No. Runtime evidence: the random graphic and blank PNG completed OCR and
extraction rather than being rejected. Static evidence:
`Backend/src/services/scan.service.js:65-82` only validates image dimensions,
runs OCR, then pushes results; there is no minimum text/block/confidence or
label-likelihood gate. In the full API path, such images can proceed onward to
Cloudinary, product/scan persistence, and `needs-review` rather than receiving
an invalid/unreadable-image response.

### 4. Reusable OCR bounding boxes

Yes. `Backend/src/services/ocr.service.js:8-30` flattens Tesseract’s `blocks`
tree to word leaves, and lines 41-57 return `{text,x,y,width,height,confidence}`.
The 57 word boxes from the product-label run (example above) prove this data is
available. `extractFields` also retains selected matched boxes in
`extracted.matchedBlocks`. These coordinates can be reused to draw overlays,
provided each result is kept with its source-image index/dimensions.

### 5. Recommendations (OPINION; not applied)

Smallest fix: replace the `FontCalibratorBox` truthy defaults with an explicit
“measurement unavailable” state, and adapt the backend font result into the
props it expects (or render directly from the `analysis.fields` array). Never
substitute a measured millimetre value. At the same time, map field-result array
entries by `fieldName` before `ScanResultCard` reads them.

Hybrid extractor design: first run a vision model on each label image with a
strict JSON contract per field: `{fieldName, value, confidence, box:{x,y,width,
height}, imageIndex}` plus `isLabel`/`unreadable` confidence. Reject/retake when
label/readability confidence is below a selected threshold. Then validate boxes
against image dimensions, preserve the model/Tesseract evidence, reconcile
conflicts, and pass normalized fields plus boxes to the existing deterministic
rule engine. The vision model may propose facts; it must not decide legal
pass/fail. Keep the current rule engine as the only compliance decision-maker
and show “needs review” whenever evidence is weak or conflicting.
