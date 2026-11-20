import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { getPostLoginPath, isBlockedInspector } from '../utils/roleGuards';

/** Logged-in visitors should not sit on public marketing/auth pages. */
export default function RedirectIfAuthed({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && isBlockedInspector(user)) {
    return <section role="alert"><h1>Account unavailable</h1><p>Your inspector account is {user.status}. Contact the project administrator.</p></section>;
  }
  if (isAuthenticated && user) {
    const targetPath = getPostLoginPath(user);
    return <Navigate to={targetPath} replace />;
  }
  return children;
}

RedirectIfAuthed.propTypes = {
  children: PropTypes.node.isRequired,
};
