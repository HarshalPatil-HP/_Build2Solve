import { Outlet } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';

export default function PublicShell() {
  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans text-text-primary antialiased">
      <OfflineBanner />
      <Header showUserChrome={false} />
      <main className="mx-auto max-w-6xl px-4 py-8 flex-1 w-full">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface px-4 py-6 text-center text-xs text-text-secondary">
        Legal Metrology Compliance Portal · Ministry of Consumer Affairs, Food & Public Distribution (SIH26034)
      </footer>
    </div>
  );
}
