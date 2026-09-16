import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthPreview } from '../context/AuthPreviewContext';

/** Logged-in visitors should not sit on public marketing/auth pages. */
export default function RedirectIfAuthed({ children }) {
  const { isAuthenticated, user, homePath } = useAuthPreview();
  if (isAuthenticated && user?.status === 'active') {
    return <Navigate to={homePath} replace />;
  }
  return children;
}

RedirectIfAuthed.propTypes = {
  children: PropTypes.node.isRequired,
};
