import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import OfflineBanner from './OfflineBanner';

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans text-text-primary antialiased">
      <OfflineBanner />
      <Header showUserChrome onMenuClick={() => setMenuOpen(true)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
