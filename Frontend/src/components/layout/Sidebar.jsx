import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NAV_CONFIG } from '../../routes/navConfig';
import { useAuth } from '../../context/AuthContext';
import NavIcon from '../common/NavIcon';
import { Camera } from 'lucide-react';

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const items = NAV_CONFIG[user?.role] || NAV_CONFIG.user || [];

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-text-primary/40 md:hidden backdrop-blur-xs"
          aria-label="Close navigation"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface transition-transform duration-200 md:static md:z-0 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <nav className="flex flex-col gap-1.5 overflow-y-auto" aria-label="Primary navigation">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
              {user?.role ? `${user.role} workspace` : 'Navigation'}
            </div>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-l-4 border-accent-saffron bg-primary/10 font-semibold text-primary'
                      : 'border-l-4 border-transparent text-text-secondary hover:bg-bg hover:text-text-primary'
                  }`
                }
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-border">
            <Link
              to="/scan"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-light active:scale-[0.99] transition-all"
            >
              <Camera className="h-4 w-4" />
              <span>Scan Product Label</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
