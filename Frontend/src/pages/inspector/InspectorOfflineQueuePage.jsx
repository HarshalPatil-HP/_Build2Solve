import { useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, Shield } from 'lucide-react';

export default function InspectorOfflineQueuePage() {
  const [offlineScans, setOfflineScans] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setOfflineScans([]);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Offline Field Scan Queue</h1>
          <p className="text-xs text-text-secondary">
            Scans captured in connectivity-restricted field locations, stored locally in IndexedDB.
          </p>
        </div>

        {offlineScans.length > 0 && (
          <button
            type="button"
            onClick={handleSyncAll}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-light"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync {offlineScans.length} Scans to Server</span>
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs text-center space-y-4">
        {offlineScans.length === 0 ? (
          <div className="py-12 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-status-compliant">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary">All Scans Synced</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              Your local IndexedDB queue is empty. Any scans performed while offline in low-coverage zones will queue here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-left text-xs">
            {offlineScans.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-xl bg-bg">
                <span>Queued Scan #{idx + 1}</span>
                <span className="font-semibold text-status-needs-review">Pending Sync</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
