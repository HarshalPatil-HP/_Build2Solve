import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NAV_CONFIG } from '../../routes/navConfig';
import { useAuthPreview } from '../../context/AuthPreviewContext';
import NavIcon from '../common/NavIcon';

export default function Sidebar({ open, onClose }) {
  const { user } = useAuthPreview();
  const items = NAV_CONFIG[user?.role] || [];

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-text-primary/40 md:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface pt-[7.5rem] transition-transform md:static md:z-0 md:translate-x-0 md:pt-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3" aria-label="Primary">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'border-l-4 border-accent-saffron bg-primary/5 text-primary'
                    : 'border-l-4 border-transparent text-text-secondary hover:bg-bg'
                }`
              }
            >
              <NavIcon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
          <Link to="/scan" onClick={onClose} className="mt-4 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary-light">
            Scan a product
          </Link>
        </nav>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
