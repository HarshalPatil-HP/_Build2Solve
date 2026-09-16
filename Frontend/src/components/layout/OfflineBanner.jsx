import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="border-b border-status-needs-review/30 bg-status-needs-review/10 px-4 py-2 text-center text-sm font-medium text-text-primary" role="status">
      You are offline. Cached pages still work; scan uploads will wait until connectivity returns.
    </div>
  );
}
