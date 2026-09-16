/**
 * Single source of truth for sidebar links.
 * Sidebar renders NAV_CONFIG[role] — never scatter role === 'admin' checks in JSX.
 * Visibility is not access control: pair this with <RequireRole />.
 */
export const NAV_CONFIG = {
  user: [
    { label: 'Dashboard', to: '/dashboard', icon: 'home' },
    { label: 'Scan a Product', to: '/scan', icon: 'scan' },
    { label: 'My History', to: '/history', icon: 'clock' },
    { label: 'My Complaints', to: '/complaints', icon: 'flag' },
    { label: 'Notifications', to: '/notifications', icon: 'bell' },
    { label: 'Profile', to: '/profile', icon: 'user' },
  ],
  company: [
    { label: 'Dashboard', to: '/company/dashboard', icon: 'home' },
    { label: 'Scan a Product', to: '/scan', icon: 'scan' },
    { label: 'Products', to: '/company/products', icon: 'box' },
    { label: 'History', to: '/history', icon: 'clock' },
    { label: 'Team', to: '/company/team', icon: 'users' },
    { label: 'Company Profile', to: '/company/profile', icon: 'building' },
    { label: 'Notifications', to: '/notifications', icon: 'bell' },
    { label: 'Account', to: '/profile', icon: 'user' },
  ],
  inspector: [
    { label: 'Dashboard', to: '/inspector/dashboard', icon: 'home' },
    { label: 'Field Scan', to: '/inspector/scan', icon: 'scan' },
    { label: 'Companies', to: '/inspector/companies', icon: 'building' },
    { label: 'Cases', to: '/inspector/cases', icon: 'folder' },
    { label: 'Assigned Complaints', to: '/inspector/complaints', icon: 'flag' },
    { label: 'Field Map', to: '/inspector/map', icon: 'map' },
    { label: 'Offline Queue', to: '/inspector/offline-queue', icon: 'cloud' },
    { label: 'History', to: '/history', icon: 'clock' },
    { label: 'Notifications', to: '/notifications', icon: 'bell' },
    { label: 'Profile', to: '/inspector/profile', icon: 'user' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: 'home' },
    { label: 'Companies', to: '/admin/companies', icon: 'building' },
    { label: 'Complaints', to: '/admin/complaints', icon: 'flag' },
    { label: 'Cases', to: '/admin/cases', icon: 'folder' },
    { label: 'Inspectors', to: '/admin/inspectors', icon: 'badge' },
    { label: 'Pending Approvals', to: '/admin/inspectors/pending', icon: 'clock' },
    { label: 'Rules', to: '/admin/rules', icon: 'scale' },
    { label: 'Users', to: '/admin/users', icon: 'users' },
    { label: 'Reports', to: '/admin/reports', icon: 'file' },
    { label: 'Audit Log', to: '/admin/audit-log', icon: 'list' },
    { label: 'Notifications', to: '/notifications', icon: 'bell' },
    { label: 'Profile', to: '/admin/profile', icon: 'user' },
  ],
};
