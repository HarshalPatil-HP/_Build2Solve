import { Outlet } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import PreviewRoleSwitcher from './PreviewRoleSwitcher';

export default function PublicShell() {
  return (
    <div className="min-h-screen bg-bg">
      <PreviewRoleSwitcher />
      <OfflineBanner />
      <Header showUserChrome={false} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface px-4 py-6 text-center text-xs text-text-secondary">
        Legal Metrology Compliance Portal · Ministry of Consumer Affairs (demo)
      </footer>
    </div>
  );
}
