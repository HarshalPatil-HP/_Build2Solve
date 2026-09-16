import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { scanService } from '../../services/scanService';
import { complaintService } from '../../services/complaintService';
import StatusPill from '../../components/common/StatusPill';
import { Shield, Camera, AlertCircle, ArrowRight, History, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [recentScans, setRecentScans] = useState([]);
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      scanService.getScans({ page: 1, limit: 3 }),
      complaintService.getComplaints({ page: 1, limit: 1 }),
    ])
      .then(([scansRes, compRes]) => {
        const scansData = scansRes.data || scansRes;
        setRecentScans(Array.isArray(scansData) ? scansData : (scansData.scans || scansData.docs || []));

        const compData = compRes.data || compRes;
        setComplaintsCount(compData.total || (Array.isArray(compData) ? compData.length : 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Consumer Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-light p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-accent-saffron uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            <span>Citizen Rights & Legal Metrology Protection</span>
          </div>
          <h1 className="text-2xl font-extrabold">Welcome, {user?.name || 'Consumer'}</h1>
          <p className="text-xs text-white/80 leading-relaxed">
            Verify retail and e-commerce packaging compliance before purchasing. Citizens are protected against overcharging, missing unit sale prices, and misleading package declarations.
          </p>
        </div>

        <Link
          to="/scan"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-saffron px-5 py-3 text-sm font-bold text-slate-900 shadow-md hover:bg-amber-400 transition-all shrink-0"
        >
          <Camera className="h-5 w-5" />
          <span>Scan Product Label</span>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary">Recent Verification Scans</p>
              <p className="text-xl font-bold text-text-primary">{recentScans.length}</p>
            </div>
          </div>
          <Link to="/history" className="text-xs font-bold text-primary hover:underline">View</Link>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-status-non-compliant">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary">Filed Complaints</p>
              <p className="text-xl font-bold text-text-primary">{complaintsCount}</p>
            </div>
          </div>
          <Link to="/complaints" className="text-xs font-bold text-primary hover:underline">Track Status</Link>
        </div>
      </div>

      {/* Recent Scans List */}
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">Your Recent Product Audits</h3>
          <Link to="/history" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>All history</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentScans.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-secondary">
            No scans performed yet. Click "Scan Product Label" to verify MRP & net quantity compliance.
          </div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {recentScans.map((s) => {
              const scanId = s._id || s.id;
              const name = s.productName || s.analysis?.fields?.genericName?.value || 'Packaged Commodity';

              return (
                <div key={scanId} className="flex items-center justify-between p-3.5 bg-surface hover:bg-bg/50 text-xs">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-text-primary">{name}</p>
                    <StatusPill status={s.overallStatus} />
                  </div>
                  <Link to={`/scan/${scanId}/result`} className="font-semibold text-primary hover:underline">
                    View Docket
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
