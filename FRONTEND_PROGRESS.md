# Frontend progress — SIH26034 Legal Metrology Compliance Portal

This file is the handoff for whoever builds the UI next. Read this before the full frontend spec or the codebase.

**Current checkpoint:** 1 complete. Next is **Checkpoint 2** (`AuthContext` + `apiClient.js` with JWT).

Do not start Checkpoint 2 until Harshal confirms Checkpoint 1 (open `http://localhost:3000`, switch preview roles, confirm nav + guards).

---

## Where the project actually is (verified in repo, 16 Sep 2026)

The old chat handoff was stale. **Backend is already built and wired**, not just models.

| Area | Status |
|---|---|
| Backend folder | `Backend/` — Express app, JWT auth middleware, role authorize, Cloudinary, Tesseract, rule engine, PDF/DOCX reports |
| Models | `*.model.js` naming is done; `models/index.js` exports all 9 collections |
| API mount | `/api/health`, `/auth`, `/scans`, `/complaints`, `/cases`, `/companies`, `/rules`, `/dashboard` |
| Frontend | **Did not exist.** Checkpoint 1 created `frontend/` (Vite + React 19 + Tailwind v4 + React Router v6) |
| `FRONTEND_PROGRESS.md` | This file, created at project root as required by the spec |

**How to run**

- API: `cd Backend` then `npm start` (default port **5000**)
- UI: `cd frontend` then `npm install` then `npm run dev` (locked to port **3000** so it matches backend CORS default `http://localhost:3000`)

---

## API contract vs frontend spec (backend wins)

Logged here so Checkpoint 2–3 do not invent fields. Verify again against live responses when wiring `apiClient`.

Envelope: success `{ success, data, message, statusCode }` · error `{ success: false, message, code }`. Lists: `?page=1&limit=20` (max 100).

| Spec assumption | What the backend actually does today |
|---|---|
| Public inspector signup + `status: pending/active/rejected` | **Missing.** `POST /api/auth/signup` allows only `user` \| `company`. Inspectors/admins are created by admin via `POST /api/auth/staff`. User model has **no** `status` or rejection-reason field. |
| Company signup sends name, registration number, address | Signup for `role: company` requires an **existing** Mongo `companyId` (24-char hex). There is **no** public “create company” endpoint. |
| Forgot / reset password | **No endpoints.** |
| `GET /api/auth/me` | **None.** JWT payload is `{ userId, role, companyId }` only. |
| Notifications | **No collection / routes.** |
| Consumer + company dashboards | `GET /api/dashboard/summary` is **admin-only**. |
| Company products, team invite, company self-profile | **No** `/api/products` or team routes. Company API is list + `:id/history` for inspector/admin. |
| Inspector complaint actions | `PATCH /api/complaints/:id` is **admin-only**. |
| Veg/non-veg attestation click | Scan stores analysis; **no** “mark present/absent” endpoint yet. Veg/non-veg is correctly `requires-visual-verification` in the rule engine. |
| FSSAI | Present as `supplementaryMetadata.fssaiLicenseNumbers` — show separately, never as pass/fail. |
| Multi-image scans | **Ready.** `POST /api/scans` accepts 1–4 files under `images` / `images[]`. |
| Audit log, inspector performance, map pins, bulk reports UI | No dedicated APIs yet. |
| Pending inspector approval queue | No pending inspectors until signup contract changes. |

**Decision needed before Checkpoint 3 (auth page):** keep the production PRD (staff-provisioned inspectors — more secure, already built) **or** add backend `status` + public inspector signup to match the UI spec. Do not fake an approval workflow against APIs that cannot persist it.

Production PRD (`SIH26034_PRODUCTION_PRD.md`) already chose staff provisioning. Recommend keeping that, and changing the frontend signup to **Consumer + Company only**, with inspector accounts created on `/admin/inspectors` (admin-created, immediately active). Call this out in the PPT as the honest verification path.

---

## Done

- **CP1** Vite + React scaffold in `frontend/`, Tailwind design tokens (navy / saffron / status colours, Noto Sans)
- **CP1** Env: `frontend/.env.example` (`VITE_API_BASE_URL=http://localhost:5000/api`)
- **CP1** Config-driven nav: `src/routes/navConfig.js` — sidebar reads `NAV_CONFIG[role]` only
- **CP1** `RequireRole` on every authenticated route **and** role-filtered sidebar
- **CP1** `PublicShell` vs `AppShell` (header, sidebar, breadcrumbs, offline banner)
- **CP1** All **45** routes as placeholder pages (titles + purpose only) plus `/login` and `/signup` → `/auth`
- **CP1** Preview role switcher (top bar) so navigation/guards can be tested **without** JWT — marked `TODO(checkpoint-2)` to remove

## In Progress

- None. Waiting on Checkpoint 1 confirmation.

## Remaining

- **CP2** `AuthContext` + `apiClient.js` (JWT header, 401 → `/auth`, base URL from env). Remove preview switcher.
- **CP3** Sliding `/auth` login/signup (role-aware fields). Align with real signup contract (see table).
- **CP4** `/pending-approval` real page — only if backend gets pending inspector status; otherwise skip or show “account disabled”.
- **CP5** Scan flow: 1–4 images, cycling loader, result checklist, estimated labels, veg visual-confirm row, FSSAI extra box
- **CP6** `/history`, `/scan/:id/report`
- **CP7** Company pages (keep light: last scanned products, not charts)
- **CP8** User complaints + `/dashboard` + `/complaints/:id`
- **CP9** Inspector dashboards, field scan + GPS, companies-by-risk, cases lock/addendum
- **CP10** Offline queue (IndexedDB) + Leaflet map
- **CP11** Admin dashboard, companies, complaints triage, cases, inspectors, rules (deactivate only)
- **CP12** Inspector performance, audit log, bulk reports
- **CP13** PWA (`vite-plugin-pwa`)
- **CP14** Empty / error / skeleton states on every list

---

## How to verify Checkpoint 1

1. `cd frontend` → `npm run dev` → http://localhost:3000
2. Use the **Preview role** bar: `user` / `company` / `inspector` / `admin`
3. Sidebar links must change with role; a `user` opening `/admin/dashboard` should land on `/404`
4. `inspector pending` should bounce dashboard routes to `/pending-approval`
5. Logged-out users hitting `/scan` go to `/auth`

Placeholder pages are **not** features. Do not mark later checkpoints Done while these still show “Checkpoint 1 · placeholder”.
