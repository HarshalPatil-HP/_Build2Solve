import { History, Shield, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogPage() {
  const logs = [
    { action: 'Rule Rule 6(1)(aa) Added', user: 'Admin System Controller', time: new Date(), target: 'DB Rules Engine' },
    { action: 'Inspector Account Approved', user: 'Admin System Controller', time: new Date(Date.now() - 3600000), target: 'Officer Vikram Singh' },
    { action: 'Case Docket #64b8f1a2 Locked', user: 'Inspector Meera Patel', time: new Date(Date.now() - 7200000), target: 'Shiv Shakti Agro Foods' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Statutory System Audit Log</h1>
        <p className="text-xs text-text-secondary">
          Immutable audit trail of administrative modifications, rule versioning, and case locking events.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
          {logs.map((l, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-surface hover:bg-bg/50">
              <div className="space-y-1">
                <p className="font-bold text-text-primary">{l.action}</p>
                <p className="text-text-secondary">Actor: <span className="font-semibold text-primary">{l.user}</span> · Target: {l.target}</p>
              </div>
              <span className="font-mono text-[10px] text-text-secondary">{format(l.time, 'dd MMM yyyy, HH:mm')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
