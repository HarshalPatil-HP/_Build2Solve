// Metadata for the five retained screens. Old routes remain until Task 3.
export const ALL_PAGE_META = [
  { id: 2, route: '/auth', title: 'Sign in / Sign up', purpose: 'Single sliding login and role-aware signup page.', roles: 'public', file: 'auth/AuthPage.jsx' },
  { id: 8, route: '/scan', title: 'Scan a product', purpose: 'Upload or capture 1–4 label images and run a compliance scan.', roles: ['user', 'company', 'inspector'], file: 'scan/ScanPage.jsx' },
  { id: 9, route: '/scan/:id/result', title: 'Scan result', purpose: 'Field-by-field pass/fail/exempt/needs-review result.', roles: ['user', 'company', 'inspector'], file: 'scan/ScanResultPage.jsx' },
  { id: 11, route: '/history', title: 'Scan history', purpose: 'Own past scans, paginated and filterable.', roles: ['user', 'company', 'inspector'], file: 'shared/HistoryPage.jsx' },
  { id: 33, route: '/admin/dashboard', title: 'Admin dashboard', purpose: 'Analytics: stats, charts, top-risk companies.', roles: ['admin'], file: 'admin/AdminDashboardPage.jsx' },
];
