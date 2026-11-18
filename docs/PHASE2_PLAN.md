# Phase 2: five-screen proposal

Status: proposal only; approval required. Inspected task/clean-reliability on 2026-11-18.
Only this document was created. No scans or implementation tests ran.

## 1. Routes to keep

- /auth: Frontend/src/pages/auth/AuthPage.jsx; SlidingAuthPanel handles login/signup.
- /scan: Frontend/src/pages/scan/ScanPage.jsx.
- /scan/:id/result: Frontend/src/pages/scan/ScanResultPage.jsx; retain ScanResultCard and ReportDownloadButton.
- /history: Frontend/src/pages/shared/HistoryPage.jsx.
- /admin/dashboard: Frontend/src/pages/admin/AdminDashboardPage.jsx; retain admin-only guard.

OPINION: root, /login and /signup redirect to /auth; unknown routes show an inline not-found state inside the shared shell (no sixth page). Result owns report downloads; retire /scan/:id/report and change History links first.
Keep real AuthContext, RequireRole, RedirectIfAuthed, roleGuards, apiClient, scanAdapter, scanService, dashboardService, shared shells and their live component dependencies.
Keep current user/company/inspector permissions on scan/history/result; admin remains dashboard-only. Pending/rejected inspector behavior must stay blocked by an inline account-status state, not a deleted route. Do not silently broaden permissions.

## 2. Proposed deletions and direct importers

All paths below are repository-relative. This inventory resolves relative static imports in Frontend/src; route strings are addressed separately below. Remove imports/routes before deleting files. Do not delete other shared components or services merely because a page is deleted.

- DELETE Frontend/src/pages/admin/AdminAuditLogPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminCasesPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminCompaniesPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminCompanyDetailPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminComplaintsPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminInspectorsPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminProfilePage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminReportsPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminRulesPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AdminUsersPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/AuditLogPage.jsx; direct importers: none found.
- DELETE Frontend/src/pages/admin/InspectorPerformancePage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/PendingInspectorsPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/admin/ReportsPage.jsx; direct importers: none found.
- DELETE Frontend/src/pages/auth/ForgotPasswordPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/auth/PendingApprovalPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/auth/ResetPasswordPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/company/CompanyDashboardPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/company/CompanyProductHistoryPage.jsx; direct importers: none found.
- DELETE Frontend/src/pages/company/CompanyProductsPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/company/CompanyProfilePage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/company/CompanyTeamPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/company/ProductHistoryPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/CaseDetailPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/CompanyAuditHistoryPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/InspectorCasesPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/InspectorCompaniesPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/InspectorComplaintsPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/InspectorDashboardPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/InspectorMapPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/InspectorOfflineQueuePage.jsx; direct importers: none found.
- DELETE Frontend/src/pages/inspector/InspectorProfilePage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/InspectorScanPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/inspector/OfflineQueuePage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/public/LandingPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/public/NotFoundPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/public/OfflinePage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/scan/ScanReportPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/shared/NotificationsPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/shared/ProfilePage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/user/ComplaintDetailPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/user/ComplaintsPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/user/NewComplaintPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.
- DELETE Frontend/src/pages/user/UserDashboardPage.jsx; direct importers: Frontend/src/routes/AppRouter.jsx.

Breakage checks required before deletion:
- AppRouter imports most deleted pages; remove their Route elements in the same commit.
- routes/navConfig.js and routes/pageMeta.js retain old destinations; Sidebar and Breadcrumbs consume them.
- utils/roleGuards.js sends user/company/inspector to deleted dashboards; SlidingAuthPanel and RedirectIfAuthed consume getPostLoginPath. Point active roles to /scan and admin to /admin/dashboard.
- RequireRole redirects to /pending-approval and /404; replace these with inline blocked/not-found states.
- Header links /notifications; remove that link before deleting NotificationsPage.
- ScanResultPage imports caseService and navigates to complaints/new/:id and inspector/cases/:id. Remove complaint/lock handlers and omit corresponding ScanResultCard callbacks; preserve report buttons.
- HistoryPage links /scan/:id/report; replace with existing authenticated report button or link to result.
- PublicShell/Header/Breadcrumbs link root; keep root redirect to avoid dead navigation.
- Retain services unless a separate reverse-import check proves them unused. No backend routes/models are proposed for deletion.

## 3. Preview authentication removal

- Frontend/src/context/AuthPreviewContext.jsx imports roleGuards; creates fake user/token values, role/status setters and logout. Reads/writes sessionStorage key lmcp.previewSession.
- Frontend/src/components/layout/PreviewRoleSwitcher.jsx imports useAuthPreview and ROLES; buttons simulate active roles or pending inspector and call preview logout.
- rg across Frontend/src found no consumer importing PreviewRoleSwitcher and no AuthPreviewProvider mounting site. Only the switcher imports the preview context. App and real guards use AuthContext.
- Safe order: confirm those searches again, delete PreviewRoleSwitcher, then AuthPreviewContext. Keep roleGuards and real AuthContext. Do not clear real localStorage credentials. The unused sessionStorage key may remain inert.

## 4. Admin widgets and real API mapping

Source: Frontend/src/pages/admin/AdminDashboardPage.jsx:17-39; dashboardService.getSummary calls GET /api/dashboard/summary. Backend route authenticates and authorizes admin. Backend/src/services/dashboard.service.js returns top-level data, not summary.scans or summary.inspectors.
- Total Label Scans: current summary.scans.total || 42 is wrong and replaces genuine zero. Read data.totalScans.
- Compliance Index: current summary.scans.complianceRate ?? 85.7 is wrong. Read data.complianceRate; zero is valid.
- Active Grievances: current pendingCount || 3 is invented. Summary endpoint has NO complaint count; remove widget for minimal scope, or approve backend extension separately.
- Pending Inspectors: current pendingCount || 0 has NO summary API source. Remove widget; do not present zero as fetched evidence.
- Violations by Rule: all five counts are hardcoded. Use data.violationsByField [{field,count}]. These are grouped by field across all time, not rule number or last 30 days; relabel honestly.
- Scan Volume & Violation Trends: all seven dated rows are hardcoded. Use data.scansOverTime [{_id: date,count}] for scan volume only (last 30 days). Endpoint provides no daily violations; remove that series. Do not claim real-time or seven-day coverage.
- data.topCompaniesByRisk exists but is not required by these widgets; do not add a new feature.
- Render explicit loading/error/empty states; replace silent catch. Missing data is unavailable, not a fabricated number.

## 5. Ordered small tasks (one commit per task)

All tasks below are proposals. Use only a user-named branch. Update STATUS.md after each approved task.
1. Remove preview switcher then context after repeating reverse-import checks. Verify rg has no remaining consumers; npm run lint and npm run build.
2. Prepare five-screen navigation: update role landing paths, pending/denied states, navConfig/pageMeta, notification links and result complaint/case actions. Keep old page files temporarily. Verify role redirect cases (all roles, pending/rejected, unauthenticated) and no removed-path links; lint/build.
3. Prune AppRouter to five page routes plus redirects/inline fallback, then delete the exact page inventory above. Verify relative import resolution, direct URL refresh, result report buttons, and deleted URLs do not redirect in loops; lint/build.
4. Lazy-load ONLY the five kept page imports with React.lazy and Suspense. Verify npm run build emits separate chunks and direct auth/result/admin navigation renders; lint. No dependency changes needed.
5. Align History with existing API pagination/fields: backend paginatedResponse uses data.data, totalCount, totalPages; productId is populated. Replace object-style analysis.fields lookup and snake_case status filters. Verify mocked empty/two-page/error data, product name, status filters, result links and authenticated report action; adapter/render/report scripts plus lint/build.
6. Replace Admin hardcoded widgets using the mappings above; remove unsupported widgets/series and Department branding. Verify mocked real-shape summary with all zeros, missing values and request failure; test access denied for non-admin; lint/build.
7. Final five-screen regression and status update. Verify frontend adapter/render/report scripts, backend npm run test:core, lint/build and browser routes with existing records. Any new scan/upload needs separate authorization. Record commands and observed output; mark unavailable checks UNTESTED.

## Other issues found; no fixes applied

- History currently fails the nested paginated data shape, uses old object-style fields and snake_case statuses, and may call substring on an absent ID.
- Admin silently swallows errors and leaves loading unused; government/department wording remains in that page.
- ScanLoadingState uses a timer to imply backend stages rather than actual server progress.
- Live report opening and scan latency remain UNTESTED; this plan does not resolve them.
- No legal rule engine, backend endpoint or package changes are part of this proposal.

Evidence commands: git branch --show-current; Get-Content of AppRouter and all five pages; Get-Content of preview files, RequireRole, roleGuards, dashboard service/route and pagination util; rg reverse-reference searches; Python relative-import inventory. These are source inspections, not runtime verification.
