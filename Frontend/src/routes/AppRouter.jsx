import { lazy, Suspense } from 'react';
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PublicShell from '../components/layout/PublicShell';
import RequireRole from './RequireRole';
import RedirectIfAuthed from './RedirectIfAuthed';

const AuthPage = lazy(() => import('../pages/auth/AuthPage'));
const ScanPage = lazy(() => import('../pages/scan/ScanPage'));
const ScanResultPage = lazy(() => import('../pages/scan/ScanResultPage'));
const HistoryPage = lazy(() => import('../pages/shared/HistoryPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicShell />}>
        <Route index element={<Navigate to="/auth" replace />} />
        <Route path="auth" element={<RedirectIfAuthed><AuthPage /></RedirectIfAuthed>} />
        <Route path="login" element={<Navigate to="/auth" replace />} />
        <Route path="signup" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<section><h1>Page not found</h1><p>This address does not match a SahiScan page.</p></section>} />
      </Route>
      <Route element={<AppShell />}>
        <Route path="scan" element={<RequireRole roles={["user","company","inspector"]}><ScanPage /></RequireRole>} />
        <Route path="scan/:id/result" element={<RequireRole roles={["user","company","inspector"]}><ScanResultPage /></RequireRole>} />
        <Route path="history" element={<RequireRole roles={["user","company","inspector"]}><HistoryPage /></RequireRole>} />
        <Route path="admin/dashboard" element={<RequireRole roles={["admin"]}><AdminDashboardPage /></RequireRole>} />
      </Route>
    </>
  )
);

export default function AppRouter() {
  return (
    <Suspense fallback={<p role="status">Loading page…</p>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
