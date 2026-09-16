import { useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

export default function PendingInspectorsPage() {
  const [pendingInspectors, setPendingInspectors] = useState([
    { id: '1', name: 'Inspector Vikram Singh', email: 'vikram.singh@doca.gov.in', badgeId: 'DL-LM-8891', jurisdiction: 'Delhi Zone 2' },
    { id: '2', name: 'Inspector Meera Patel', email: 'meera.patel@doca.gov.in', badgeId: 'GJ-LM-4420', jurisdiction: 'Ahmedabad South' },
  ]);

  const handleApprove = (id) => {
    setPendingInspectors((prev) => prev.filter((i) => i.id !== id));
    alert('Inspector account approved and activated.');
  };

  const handleReject = (id) => {
    setPendingInspectors((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Inspector Verification Queue</h1>
        <p className="text-xs text-text-secondary">
          Review badge credentials and department jurisdictions before granting enforcement access.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        {pendingInspectors.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-secondary space-y-2">
            <CheckCircle2 className="h-8 w-8 text-status-compliant mx-auto" />
            <p className="font-bold text-text-primary">No pending inspector signups</p>
            <p>All departmental officer credentials have been processed.</p>
          </div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
            {pendingInspectors.map((i) => (
              <div key={i.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface hover:bg-bg/50">
                <div className="space-y-1">
                  <p className="font-bold text-text-primary text-sm">{i.name}</p>
                  <p className="text-text-secondary">{i.email}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">Badge: {i.badgeId}</span>
                    <span className="text-text-secondary">Jurisdiction: {i.jurisdiction}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(i.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve Officer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(i.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 font-bold text-status-non-compliant hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
