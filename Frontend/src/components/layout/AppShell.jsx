import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import OfflineBanner from './OfflineBanner';
import PreviewRoleSwitcher from './PreviewRoleSwitcher';

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <PreviewRoleSwitcher />
      <OfflineBanner />
      <Header showUserChrome onMenuClick={() => setMenuOpen(true)} />
      <div className="flex min-h-[calc(100vh-7.5rem)]">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
