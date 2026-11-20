// Five-screen navigation; visibility does not grant authorization.
const scanLinks = [
  { label: 'Scan a Product', to: '/scan', icon: 'scan' },
  { label: 'History', to: '/history', icon: 'clock' },
];
export const NAV_CONFIG = {
  user: scanLinks, company: scanLinks, inspector: scanLinks,
  admin: [{ label: 'Dashboard', to: '/admin/dashboard', icon: 'home' }],
};
