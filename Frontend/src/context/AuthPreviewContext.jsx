import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getPostLoginPath } from '../utils/roleGuards';

const STORAGE_KEY = 'lmcp.previewSession';

// TODO(checkpoint-2): replace this preview session with AuthContext + JWT from /api/auth.
function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { role: null, status: 'active', name: 'Guest' };
    return JSON.parse(raw);
  } catch {
    return { role: null, status: 'active', name: 'Guest' };
  }
}

const AuthPreviewContext = createContext(null);

export function AuthPreviewProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const persist = useCallback((next) => {
    setSession(next);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo(
    () => ({
      user: session.role
        ? {
            id: 'preview',
            name: session.name,
            email: `${session.role}@preview.local`,
            role: session.role,
            status: session.status,
            companyId: session.role === 'company' ? 'preview-company' : null,
          }
        : null,
      token: session.role ? 'preview-token' : null,
      isAuthenticated: Boolean(session.role),
      setPreviewRole: (role, status = 'active') => {
        persist({
          role,
          status,
          name: role ? `${role[0].toUpperCase()}${role.slice(1)} preview` : 'Guest',
        });
      },
      logout: () => persist({ role: null, status: 'active', name: 'Guest' }),
      homePath: getPostLoginPath(session),
    }),
    [persist, session]
  );

  return <AuthPreviewContext.Provider value={value}>{children}</AuthPreviewContext.Provider>;
}

AuthPreviewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuthPreview() {
  const ctx = useContext(AuthPreviewContext);
  if (!ctx) {
    throw new Error('useAuthPreview must be used inside AuthPreviewProvider');
  }
  return ctx;
}
