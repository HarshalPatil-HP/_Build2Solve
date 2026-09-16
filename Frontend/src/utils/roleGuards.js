export const ROLES = {
  USER: 'user',
  COMPANY: 'company',
  INSPECTOR: 'inspector',
  ADMIN: 'admin',
};

export const ALL_AUTH_ROLES = [ROLES.USER, ROLES.COMPANY, ROLES.INSPECTOR, ROLES.ADMIN];

export const POST_LOGIN_PATH = {
  user: '/dashboard',
  company: '/company/dashboard',
  inspector: '/inspector/dashboard',
  admin: '/admin/dashboard',
};

/**
 * Inspector accounts that are not yet active never reach a dashboard.
 * @param {{ role?: string, status?: string }} session
 */
export function getPostLoginPath(session) {
  if (!session?.role) return '/auth';
  if (session.role === ROLES.INSPECTOR && session.status === 'pending') {
    return '/pending-approval';
  }
  if (session.role === ROLES.INSPECTOR && session.status === 'rejected') {
    return '/pending-approval';
  }
  return POST_LOGIN_PATH[session.role] || '/auth';
}

export function canAccessRoles(userRole, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
}
