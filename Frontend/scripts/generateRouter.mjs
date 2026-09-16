import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_PAGE_META } from '../src/routes/pageMeta.js';

function exportName(file) {
  return path.basename(file, '.jsx');
}

const imports = ALL_PAGE_META.map(
  (p) => `import ${exportName(p.file)} from '../pages/${p.file.replace('.jsx', '')}';`
).join('\n');

function jsxFor(page) {
  const name = exportName(page.file);
  if (page.roles === 'public') {
    if (page.route === '/') {
      return `<Route index element={<RedirectIfAuthed><${name} /></RedirectIfAuthed>} />`;
    }
    if (page.route === '/auth') {
      return `<Route path="auth" element={<RedirectIfAuthed><${name} /></RedirectIfAuthed>} />`;
    }
    if (page.route === '/auth/forgot-password') {
      return `<Route path="auth/forgot-password" element={<RedirectIfAuthed><${name} /></RedirectIfAuthed>} />`;
    }
    if (page.route === '/auth/reset-password/:token') {
      return `<Route path="auth/reset-password/:token" element={<${name} />} />`;
    }
    if (page.route === '/404') {
      return `<Route path="404" element={<${name} />} />`;
    }
    if (page.route === '/offline') {
      return `<Route path="offline" element={<${name} />} />`;
    }
  }
  if (page.route === '/pending-approval') {
    return `<Route path="pending-approval" element={<RequireRole roles={['inspector']} allowPendingInspector><${name} /></RequireRole>} />`;
  }
  const roles = JSON.stringify(page.roles);
  const pathAttr = page.route.replace(/^\//, '');
  return `<Route path="${pathAttr}" element={<RequireRole roles={${roles}}><${name} /></RequireRole>} />`;
}

const publicPages = ALL_PAGE_META.filter((p) => p.roles === 'public' || p.route === '/pending-approval');
const appPages = ALL_PAGE_META.filter((p) => p.roles !== 'public' && p.route !== '/pending-approval');

const source = `import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PublicShell from '../components/layout/PublicShell';
import RequireRole from './RequireRole';
import RedirectIfAuthed from './RedirectIfAuthed';
${imports}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicShell />}>
${publicPages.map((p) => `        ${jsxFor(p)}`).join('\n')}
        <Route path="login" element={<Navigate to="/auth" replace />} />
        <Route path="signup" element={<Navigate to="/auth" replace />} />
      </Route>
      <Route element={<AppShell />}>
${appPages.map((p) => `        ${jsxFor(p)}`).join('\n')}
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </>
  )
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
`;

const dest = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'routes', 'AppRouter.jsx');
fs.writeFileSync(dest, source, 'utf8');
console.log('Wrote', dest);
