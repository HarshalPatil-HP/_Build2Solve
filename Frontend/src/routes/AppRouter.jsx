import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PublicShell from '../components/layout/PublicShell';
import RequireRole from './RequireRole';
import RedirectIfAuthed from './RedirectIfAuthed';
import LandingPage from '../pages/public/LandingPage';
import AuthPage from '../pages/auth/AuthPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import PendingApprovalPage from '../pages/auth/PendingApprovalPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import OfflinePage from '../pages/public/OfflinePage';
import ScanPage from '../pages/scan/ScanPage';
import ScanResultPage from '../pages/scan/ScanResultPage';
import ScanReportPage from '../pages/scan/ScanReportPage';
import HistoryPage from '../pages/shared/HistoryPage';
import ProfilePage from '../pages/shared/ProfilePage';
import NotificationsPage from '../pages/shared/NotificationsPage';
import UserDashboardPage from '../pages/user/UserDashboardPage';
import NewComplaintPage from '../pages/user/NewComplaintPage';
import ComplaintsPage from '../pages/user/ComplaintsPage';
import ComplaintDetailPage from '../pages/user/ComplaintDetailPage';
import CompanyDashboardPage from '../pages/company/CompanyDashboardPage';
import CompanyProductsPage from '../pages/company/CompanyProductsPage';
import ProductHistoryPage from '../pages/company/ProductHistoryPage';
import CompanyTeamPage from '../pages/company/CompanyTeamPage';
import CompanyProfilePage from '../pages/company/CompanyProfilePage';
import InspectorDashboardPage from '../pages/inspector/InspectorDashboardPage';
import InspectorScanPage from '../pages/inspector/InspectorScanPage';
import InspectorCompaniesPage from '../pages/inspector/InspectorCompaniesPage';
import CompanyAuditHistoryPage from '../pages/inspector/CompanyAuditHistoryPage';
import InspectorCasesPage from '../pages/inspector/InspectorCasesPage';
import CaseDetailPage from '../pages/inspector/CaseDetailPage';
import InspectorComplaintsPage from '../pages/inspector/InspectorComplaintsPage';
import InspectorMapPage from '../pages/inspector/InspectorMapPage';
import OfflineQueuePage from '../pages/inspector/OfflineQueuePage';
import InspectorProfilePage from '../pages/inspector/InspectorProfilePage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminCompaniesPage from '../pages/admin/AdminCompaniesPage';
import AdminCompanyDetailPage from '../pages/admin/AdminCompanyDetailPage';
import AdminComplaintsPage from '../pages/admin/AdminComplaintsPage';
import AdminCasesPage from '../pages/admin/AdminCasesPage';
import AdminInspectorsPage from '../pages/admin/AdminInspectorsPage';
import PendingInspectorsPage from '../pages/admin/PendingInspectorsPage';
import InspectorPerformancePage from '../pages/admin/InspectorPerformancePage';
import AdminRulesPage from '../pages/admin/AdminRulesPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminAuditLogPage from '../pages/admin/AdminAuditLogPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicShell />}>
        <Route index element={<RedirectIfAuthed><LandingPage /></RedirectIfAuthed>} />
        <Route path="auth" element={<RedirectIfAuthed><AuthPage /></RedirectIfAuthed>} />
        <Route path="auth/forgot-password" element={<RedirectIfAuthed><ForgotPasswordPage /></RedirectIfAuthed>} />
        <Route path="auth/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="pending-approval" element={<RequireRole roles={['inspector']} allowPendingInspector><PendingApprovalPage /></RequireRole>} />
        <Route path="404" element={<NotFoundPage />} />
        <Route path="offline" element={<OfflinePage />} />
        <Route path="login" element={<Navigate to="/auth" replace />} />
        <Route path="signup" element={<Navigate to="/auth" replace />} />
      </Route>
      <Route element={<AppShell />}>
        <Route path="scan" element={<RequireRole roles={["user","company","inspector"]}><ScanPage /></RequireRole>} />
        <Route path="scan/:id/result" element={<RequireRole roles={["user","company","inspector"]}><ScanResultPage /></RequireRole>} />
        <Route path="scan/:id/report" element={<RequireRole roles={["user","company","inspector"]}><ScanReportPage /></RequireRole>} />
        <Route path="history" element={<RequireRole roles={["user","company","inspector"]}><HistoryPage /></RequireRole>} />
        <Route path="profile" element={<RequireRole roles={["user","company","inspector","admin"]}><ProfilePage /></RequireRole>} />
        <Route path="notifications" element={<RequireRole roles={["user","company","inspector","admin"]}><NotificationsPage /></RequireRole>} />
        <Route path="dashboard" element={<RequireRole roles={["user"]}><UserDashboardPage /></RequireRole>} />
        <Route path="complaints/new/:scanId" element={<RequireRole roles={["user"]}><NewComplaintPage /></RequireRole>} />
        <Route path="complaints" element={<RequireRole roles={["user"]}><ComplaintsPage /></RequireRole>} />
        <Route path="complaints/:id" element={<RequireRole roles={["user"]}><ComplaintDetailPage /></RequireRole>} />
        <Route path="company/dashboard" element={<RequireRole roles={["company"]}><CompanyDashboardPage /></RequireRole>} />
        <Route path="company/products" element={<RequireRole roles={["company"]}><CompanyProductsPage /></RequireRole>} />
        <Route path="company/products/:id/history" element={<RequireRole roles={["company"]}><ProductHistoryPage /></RequireRole>} />
        <Route path="company/team" element={<RequireRole roles={["company"]}><CompanyTeamPage /></RequireRole>} />
        <Route path="company/profile" element={<RequireRole roles={["company"]}><CompanyProfilePage /></RequireRole>} />
        <Route path="inspector/dashboard" element={<RequireRole roles={["inspector"]}><InspectorDashboardPage /></RequireRole>} />
        <Route path="inspector/scan" element={<RequireRole roles={["inspector"]}><InspectorScanPage /></RequireRole>} />
        <Route path="inspector/companies" element={<RequireRole roles={["inspector"]}><InspectorCompaniesPage /></RequireRole>} />
        <Route path="inspector/companies/:id/history" element={<RequireRole roles={["inspector"]}><CompanyAuditHistoryPage /></RequireRole>} />
        <Route path="inspector/cases" element={<RequireRole roles={["inspector"]}><InspectorCasesPage /></RequireRole>} />
        <Route path="inspector/cases/:id" element={<RequireRole roles={["inspector"]}><CaseDetailPage /></RequireRole>} />
        <Route path="inspector/complaints" element={<RequireRole roles={["inspector"]}><InspectorComplaintsPage /></RequireRole>} />
        <Route path="inspector/map" element={<RequireRole roles={["inspector"]}><InspectorMapPage /></RequireRole>} />
        <Route path="inspector/offline-queue" element={<RequireRole roles={["inspector"]}><OfflineQueuePage /></RequireRole>} />
        <Route path="inspector/profile" element={<RequireRole roles={["inspector"]}><InspectorProfilePage /></RequireRole>} />
        <Route path="admin/dashboard" element={<RequireRole roles={["admin"]}><AdminDashboardPage /></RequireRole>} />
        <Route path="admin/companies" element={<RequireRole roles={["admin"]}><AdminCompaniesPage /></RequireRole>} />
        <Route path="admin/companies/:id" element={<RequireRole roles={["admin"]}><AdminCompanyDetailPage /></RequireRole>} />
        <Route path="admin/complaints" element={<RequireRole roles={["admin"]}><AdminComplaintsPage /></RequireRole>} />
        <Route path="admin/cases" element={<RequireRole roles={["admin"]}><AdminCasesPage /></RequireRole>} />
        <Route path="admin/inspectors" element={<RequireRole roles={["admin"]}><AdminInspectorsPage /></RequireRole>} />
        <Route path="admin/inspectors/pending" element={<RequireRole roles={["admin"]}><PendingInspectorsPage /></RequireRole>} />
        <Route path="admin/inspectors/:id/performance" element={<RequireRole roles={["admin"]}><InspectorPerformancePage /></RequireRole>} />
        <Route path="admin/rules" element={<RequireRole roles={["admin"]}><AdminRulesPage /></RequireRole>} />
        <Route path="admin/users" element={<RequireRole roles={["admin"]}><AdminUsersPage /></RequireRole>} />
        <Route path="admin/reports" element={<RequireRole roles={["admin"]}><AdminReportsPage /></RequireRole>} />
        <Route path="admin/audit-log" element={<RequireRole roles={["admin"]}><AdminAuditLogPage /></RequireRole>} />
        <Route path="admin/profile" element={<RequireRole roles={["admin"]}><AdminProfilePage /></RequireRole>} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </>
  )
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
