import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { canAccessRoles, isBlockedInspector } from '../utils/roleGuards';

/**
 * Route-level access control with real AuthContext.
 */
export default function RequireRole({ roles, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (isBlockedInspector(user)) {
    return <section role="alert"><h1>Account unavailable</h1><p>Your inspector account is {user.status}. Contact the project administrator.</p></section>;
  }
  if (!canAccessRoles(user.role, roles)) {
    return <section role="alert"><h1>Access denied</h1><p>This screen is unavailable for your role.</p></section>;
  }

  return children;
}

RequireRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
  allowPendingInspector: PropTypes.bool,
};
