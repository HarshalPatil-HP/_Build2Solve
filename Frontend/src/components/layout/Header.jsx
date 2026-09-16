import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthPreview } from '../../context/AuthPreviewContext';
import StatusPill from '../common/StatusPill';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Legal Metrology Compliance Portal';

export default function Header({ onMenuClick, showUserChrome }) {
  const { user, logout } = useAuthPreview();

  return (
    <header className="border-b border-border bg-surface">
      <div className="flex items-center gap-3 px-4 py-3">
        {showUserChrome ? (
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1 text-sm md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            Menu
          </button>
        ) : null}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-[10px] font-bold leading-tight text-primary" aria-hidden="true">
          Emblem
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-primary md:text-base">{APP_NAME}</p>
          <p className="truncate text-xs text-text-secondary">Department of Consumer Affairs · SIH26034</p>
        </div>

        {showUserChrome && user ? (
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative rounded-md border border-border px-2 py-1 text-sm text-text-secondary hover:bg-bg" aria-label="Notifications">
              Bell
            </Link>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-text-primary">{user.name}</p>
              <div className="flex justify-end gap-1">
                <StatusPill status={user.role === 'inspector' ? user.status : 'active'} />
              </div>
            </div>
            <button type="button" onClick={logout} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg">
              Log out
            </button>
          </div>
        ) : (
          <Link to="/auth" className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-light">
            Sign in
          </Link>
        )}
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
