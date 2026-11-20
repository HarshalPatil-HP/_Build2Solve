export const ROLES = {
  USER: 'user',
  COMPANY: 'company',
  INSPECTOR: 'inspector',
  ADMIN: 'admin',
};

export const ALL_AUTH_ROLES = [ROLES.USER, ROLES.COMPANY, ROLES.INSPECTOR, ROLES.ADMIN];

export const POST_LOGIN_PATH = {
  user: '/scan',
  company: '/scan',
  inspector: '/scan',
  admin: '/admin/dashboard',
};

/**
 * Inspector accounts that are not yet active never reach a dashboard.
 * @param {{ role?: string, status?: string }} session
 */
export function getPostLoginPath(session) {
  if (!session?.role) return '/auth';
  if (session.role === ROLES.INSPECTOR && session.status === 'pending') {
    return '/auth';
  }
  if (session.role === ROLES.INSPECTOR && session.status === 'rejected') {
    return '/auth';
  }
  return POST_LOGIN_PATH[session.role] || '/auth';
}

export function canAccessRoles(userRole, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
}

// Pending and rejected inspectors must never enter protected screens.
export function isBlockedInspector(user) {
  return user?.role === ROLES.INSPECTOR && ['pending', 'rejected'].includes(user.status);
}
