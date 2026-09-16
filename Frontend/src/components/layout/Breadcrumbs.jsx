import { Link, useLocation } from 'react-router-dom';
import { ALL_PAGE_META } from '../../routes/pageMeta';

const HIDE_ON = new Set([
  '/dashboard',
  '/company/dashboard',
  '/inspector/dashboard',
  '/admin/dashboard',
]);

function titleForPath(pathname) {
  const exact = ALL_PAGE_META.find((p) => p.route === pathname);
  if (exact) return exact.title;
  const dynamic = ALL_PAGE_META.find((p) => p.route.includes(':') && matchPattern(p.route, pathname));
  return dynamic?.title || pathname;
}

function matchPattern(pattern, pathname) {
  const rx = new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}$`);
  return rx.test(pathname);
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  if (HIDE_ON.has(pathname)) return null;

  const parts = pathname.split('/').filter(Boolean);
  const crumbs = parts.map((_, i) => {
    const href = `/${parts.slice(0, i + 1).join('/')}`;
    return { href, label: titleForPath(href) };
  });

  return (
    <nav className="mb-4 text-sm text-text-secondary" aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-1">
        <li>
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex gap-1">
            <span aria-hidden="true">/</span>
            <Link to={crumb.href} className="hover:text-primary">
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
