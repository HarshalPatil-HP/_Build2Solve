import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import StatusPill from '../../components/common/StatusPill';
import { AlertCircle, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintService.getComplaints({ page: 1, limit: 20 })
      .then((res) => {
        const data = res.data || res;
        setComplaints(Array.isArray(data) ? data : (data.complaints || data.docs || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Consumer Grievances & Complaints</h1>
        <p className="text-xs text-text-secondary">
          Track statutory escalation status across your filed packaged commodity complaints.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-text-secondary">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-secondary space-y-3">
            <AlertCircle className="h-8 w-8 text-text-secondary/50 mx-auto" />
            <p>No filed complaints found. You can file a grievance from any non-compliant scan docket.</p>
          </div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {complaints.map((c) => {
              const id = c._id || c.id;
              const dateStr = c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : 'Recent';

              return (
                <div key={id} className="flex items-center justify-between p-4 bg-surface hover:bg-bg/50 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">{c.sellerName || 'Retail Store'}</span>
                      <StatusPill status={c.status || 'pending'} />
                    </div>
                    <p className="text-text-secondary line-clamp-1">{c.description || 'Violation report'}</p>
                    <p className="text-[10px] text-text-secondary font-mono">Filed on {dateStr} · ID: {id.substring(0, 8)}</p>
                  </div>

                  <Link
                    to={`/complaints/${id}`}
                    className="flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <span>Track Status</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
