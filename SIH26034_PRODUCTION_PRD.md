# SIH26034 - Legal Metrology Packaged Commodities Compliance System

## 1. Product purpose

Build a web/PWA system that accepts a photograph of a physical product label or a manually supplied e-commerce listing screenshot, extracts declarations using OCR, evaluates them against the Legal Metrology (Packaged Commodities) Rules, 2011, and produces an explainable compliance decision.

The system supports field inspection and desk-based review. It does **not** crawl marketplaces, make legal determinations without evidence, or claim laboratory-accurate font measurements from an uncalibrated photograph.

## 2. Users and permissions

- **User:** scans a product, sees only own scans, files complaints for own non-compliant/review-required scans.
- **Company:** self-checks products connected to its verified company account; sees only its company data.
- **Inspector:** performs field scans, manages only assigned official cases, views company audit history and assigned complaints.
- **Admin:** manages rules, provisions staff accounts, views dashboard analytics, all companies, and all cases/complaints.

Public signup permits only `user` and `company`. This prevents privilege escalation. An authenticated admin creates inspectors or additional admins through `POST /api/auth/staff`.

## 3. Required capabilities

1. Multi-image upload/camera capture of 1-4 JPEG/PNG label panels, maximum 5 MB per image.
2. Cloudinary evidence storage.
3. English + Hindi Tesseract OCR with text blocks, bounding boxes, and confidence values.
4. Regex extraction of manufacturer, generic name, net quantity, MRP, manufacture date, consumer care, and country of origin.
5. DB-driven, versioned rule evaluation with effective dates and category applicability.
6. Explainable result: field status, rule reference, reason, exemptions, and estimated values.
7. Scan repository/history, pagination, search-ready indexes, and role-based access.
8. Complaint workflow, inspector assignment, and an evidence-preserving case workflow.
9. PDF and editable DOCX reports.
10. Admin dashboard: scans, compliance rate, violation breakdown, 30-day trend, and company risk ranking.

## 4. Legal rules implemented

- **Rule 6(a):** manufacturer/packer/importer declaration; food is handled as an exemption under the product rules.
- **Rule 6(aa):** country of origin for imported products.
- **Rule 6(b)-(e), 6(2):** generic name, net quantity, manufacture date, MRP inclusive of all taxes, consumer care.
- **Rule 7:** PDP-area-based font-size estimate. It is marked as estimated unless physical dimensions are supplied.
- **Rule 8:** PDP placement clustering heuristic. A warning requires human review; it is not presented as a conclusive legal finding.
- **Rule 9:** readability uses OCR-confidence as a review proxy.
- **Rule 12(6):** misleading quantity phrases near the quantity declaration.
- **Rule 6(7):** GM label check for food.
- **Rule 6(8):** veg/non-veg dot is returned as `requires-visual-verification`; OCR must never pretend it detected a colour dot.
- **Rule 26:** restaurant fast-food and qualifying small-package exemptions are applied before declaration failures.

Rules are seeded from `Backend/scripts/seedRules.js`; amendments are handled by adding/versioning rule documents rather than redeploying code.

## 5. Architecture

```text
React PWA / mobile camera / supplied screenshot
  -> Express API (JWT + RBAC + Joi validation)
  -> Cloudinary (original evidence image)
  -> Tesseract OCR (text + bounding boxes)
  -> extraction service + dynamic MongoDB rules
  -> rule engine + risk-score service
  -> MongoDB Atlas (scan, violations, cases, reports)
  -> Cloudinary PDF/DOCX report storage
```

The frontend must treat `needs-review`, placement warnings, and `requires-visual-verification` as distinct from a confirmed pass/fail result.

## 6. Backend API

- `POST /api/auth/signup`, `POST /api/auth/login`
- `POST /api/auth/staff` (admin only)
- `POST /api/scans`, `GET /api/scans`, `GET /api/scans/:id`, `GET /api/scans/:id/report?format=pdf|docx`
- `POST /api/complaints`, `GET /api/complaints`, `PATCH /api/complaints/:id`
- `POST /api/cases`, `GET /api/cases`, `GET /api/cases/:id`, `PATCH /api/cases/:id`, `POST /api/cases/:id/lock`, `POST /api/cases/:id/addendum`
- `GET /api/companies`, `GET /api/companies/:id/history`
- `GET /api/rules`, `POST /api/rules`, `PATCH /api/rules/:id/deactivate`
- `GET /api/dashboard/summary`
- `GET /api/health`

All list routes use `?page=1&limit=20`; the maximum limit is 100. Error responses use `{ success: false, message, code }` and successful responses use `{ success: true, data, message }`.

## 7. Data integrity and security

- Passwords use bcrypt; credentials are never returned.
- JWT payload is restricted to `userId`, `role`, and `companyId`.
- Company scans re-check the database account-to-company link instead of trusting the token/body alone.
- Public scans cannot attribute a scan to an arbitrary company.
- Inspectors cannot read or alter another inspector's cases.
- A locked case cannot be edited. New material is an addendum linked with `parentCaseId`.
- Complaints require ownership and an actionable scan; assigned users must actually be inspectors.
- Rules are soft-deactivated, preserving historical auditability.
- Risk-score updates use atomic database operations to avoid lost updates under concurrent scans.

## 8. Verified backend status (7 September 2026)

Confirmed by local execution against MongoDB Atlas:

```text
npm run seed:rules  -> Seeded 14 rules
npm run test:models -> Connected, inserted/read all 9 models, cleaned test data
node scripts/verifyApi.js -> health, 401 guard, signup, login, authenticated scans list passed
```

Also verified offline:

```text
npm run test:core -> pagination, font thresholds, image dimensions, and public-role restriction passed
node scripts/verifyLoad.js -> Express app loaded successfully
```

The remaining required acceptance test before a teacher demo is a real-image scan: Cloudinary upload, Tesseract OCR, full rule result, and PDF/DOCX generation. This needs a genuine clear label photograph, not a synthetic test.

## 9. How to test the backend

### Startup and regression checks

From `Backend`:

```powershell
npm run seed:rules
npm run test:core
npm run test:models
npm start
```

In a second terminal:

```powershell
node scripts/verifyApi.js
```

Expected result: every command exits successfully; `/api/health` returns HTTP 200; protected endpoints return HTTP 401 without a token and HTTP 200 with a valid token.

### OCR and scan-pipeline test in Postman

1. `POST /api/auth/signup` with a normal user account; copy `data.token`.
2. `POST /api/scans` with header `Authorization: Bearer <token>`.
3. Use **Body -> form-data**. Add 1-4 files using `images` (or `images[]`) as the file key, plus:
   - `productName`: `Test Packaged Product`
   - `category`: `other` (or `food`/`cosmetics` as appropriate)
   - `packageWidthCm`: actual measured width, e.g. `10`
   - `packageHeightCm`: actual measured height, e.g. `15`
   - `isImported`: `false` or `true`
4. Use sharp, front-on, evenly lit JPEG/PNG panels. Capture whichever panels show MRP, quantity, date/batch, generic name, and consumer-care details; this is not restricted to “front/back.”
5. Expect HTTP 201. Check:
   - `data.analysis.fields` has a result and rule reference for every applicable requirement.
   - Every `data.scan.imageUrls` entry opens its Cloudinary evidence image.
   - `data.violations` contains only failed fields.
   - duplicated values across panels yield one field result; conflicting MRP/quantity/date values yield `needs-review`.
   - confidence below 60% yields `needs-review`, not a silent legal failure.
   - font size says `estimated: false` when actual dimensions were supplied.
6. Call `GET /api/scans/:id/report?format=pdf`, then repeat with `format=docx`. Confirm each returned `data.fileUrl` downloads and opens.

### Negative tests required before demo

- Upload a PDF, GIF, or file over 5 MB: expect a clean 400 response.
- Use an expired/missing token: expect 401.
- Make an MRP label without “inclusive of all taxes”: expect Rule 6(e) failure.
- Use `about 500 g`: expect Rule 12(6) failure.
- Create and lock a case, then PATCH it: expect `CASE_LOCKED`.
- Try an inspector token against another inspector's case: expect 403.
- Try public signup with `role: admin`: expect 400.

## 10. Frontend decision

**Yes: start frontend now.** Build against the verified auth, history, role, complaint, case, company, rule, and dashboard endpoints.

Keep the scan-result, report-download, and camera UX behind a short integration checklist until the real-image test in section 9 passes. Do not claim fully automated legal certainty: show `needs-review`, estimates, and visual-verification states clearly.

## 11. Frontend build order

1. Auth, token storage, protected routes, role-aware navigation.
2. Scan upload and result view.
3. Scan history and report downloads.
4. Complaints and inspector case flow.
5. Company history and admin rules.
6. Dashboard charts, accessibility states, responsive/PWA polish.

## 12. Deployment checklist

- Use production MongoDB credentials with least privilege and an IP/network policy appropriate to hosting.
- Set production `JWT_SECRET`, `CORS_ORIGINS`, Cloudinary credentials, and `NODE_ENV=production` in the host secret manager.
- Restrict CORS to the Vercel frontend URL; do not use wildcard origins with credentials.
- Seed rules once in the production database, then verify the active rule count.
- Add uptime monitoring for `/api/health`, structured logs, rate limiting, and a backup/recovery plan before public launch.
- Never commit `.env` files or Cloudinary/MongoDB/JWT secrets.
