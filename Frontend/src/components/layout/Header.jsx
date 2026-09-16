import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import StatusPill from '../common/StatusPill';
import { Menu, Bell, LogOut, Shield, User } from 'lucide-react';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Legal Metrology Compliance Portal';

export default function Header({ onMenuClick, showUserChrome }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface shadow-xs">
      <div className="flex items-center gap-3 px-4 py-3">
        {showUserChrome ? (
          <button
            type="button"
            className="rounded-md border border-border p-2 text-text-secondary hover:bg-bg md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}

        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
            <Shield className="h-6 w-6 text-accent-saffron" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold tracking-tight text-primary md:text-base">
              {APP_NAME}
            </p>
            <p className="truncate text-xs font-medium text-text-secondary">
              Department of Consumer Affairs · SIH26034
            </p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {showUserChrome && user ? (
            <>
              <Link
                to="/notifications"
                className="relative rounded-lg border border-border p-2 text-text-secondary hover:bg-bg hover:text-primary transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-saffron opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-saffron"></span>
                </span>
              </Link>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-text-primary leading-tight">{user.name}</p>
                <div className="flex justify-end gap-1 mt-0.5">
                  <StatusPill status={user.role === 'inspector' ? (user.status || 'active') : user.role} />
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-status-non-compliant transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-light transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onMenuClick: PropTypes.func,
  showUserChrome: PropTypes.bool,
};

Header.defaultProps = {
  onMenuClick: undefined,
  showUserChrome: false,
};
