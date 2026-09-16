import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthPreview } from '../context/AuthPreviewContext';
import { canAccessRoles, ROLES } from '../utils/roleGuards';

/**
 * Route-level access control. Hide-a-link in the sidebar is not enough.
 */
export default function RequireRole({ roles, children, allowPendingInspector = false }) {
  const { user, isAuthenticated } = useAuthPreview();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  const isPendingInspector = user.role === ROLES.INSPECTOR && user.status !== 'active';

  if (isPendingInspector && !allowPendingInspector) {
    return <Navigate to="/pending-approval" replace />;
  }

  if (!canAccessRoles(user.role, roles)) {
    return <Navigate to="/404" replace />;
  }

  return children;
}

RequireRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
  allowPendingInspector: PropTypes.bool,
};
