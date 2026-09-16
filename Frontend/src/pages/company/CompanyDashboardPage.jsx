import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { scanService } from '../../services/scanService';
import StatusPill from '../../components/common/StatusPill';
import { Building, Camera, CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scanService.getScans({ page: 1, limit: 5 })
      .then((res) => {
        const data = res.data || res;
        setRecentScans(Array.isArray(data) ? data : (data.scans || data.docs || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = recentScans.length;
  const compliantCount = recentScans.filter((s) => s.overallStatus === 'compliant' || s.overallStatus === 'pass').length;
  const complianceRate = total > 0 ? Math.round((compliantCount / total) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-light p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-accent-saffron uppercase tracking-wider">
            <Building className="h-4 w-4" />
            <span>Enterprise Pre-Market Audit Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold">{user?.name || 'Company Portal'}</h1>
          <p className="text-xs text-white/80 leading-relaxed">
            Self-check your packaged commodities pre-launch against Legal Metrology Rules, 2011 to guarantee zero non-compliance penalties and maintain a low risk score.
          </p>
        </div>

        <Link
          to="/scan"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-saffron px-5 py-3 text-sm font-bold text-slate-900 shadow-md hover:bg-amber-400 transition-all shrink-0"
        >
          <Camera className="h-5 w-5" />
          <span>Scan New Product</span>
        </Link>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-status-compliant">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Compliance Index</p>
            <p className="text-2xl font-extrabold text-primary">{complianceRate}%</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Recent Scans</p>
            <p className="text-2xl font-extrabold text-primary">{total}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-status-needs-review">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Risk Rating</p>
            <p className="text-2xl font-extrabold text-status-compliant">Low (0.0)</p>
          </div>
        </div>
      </div>

      {/* Last Scanned Products Section */}
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary">Last Scanned Products</h3>
            <p className="text-xs text-text-secondary">Recent packaging label verification results</p>
          </div>
          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentScans.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-secondary">
            No product scans recorded yet. Click "Scan New Product" to test label artwork.
          </div>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {recentScans.map((s) => {
              const scanId = s._id || s.id;
              const name = s.productName || s.analysis?.fields?.genericName?.value || 'Packaged Commodity';
              const dateStr = s.createdAt ? format(new Date(s.createdAt), 'dd MMM, HH:mm') : 'Recent';

              return (
                <div key={scanId} className="flex items-center justify-between p-3.5 bg-surface hover:bg-bg/50 transition-colors text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-black/5">
                      {s.imageUrls ? (
                        <img src={Array.isArray(s.imageUrls) ? s.imageUrls[0] : s.imageUrls} alt={name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{name}</p>
                      <p className="text-[10px] text-text-secondary">Scanned on {dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusPill status={s.overallStatus} />
                    <Link
                      to={`/scan/${scanId}/result`}
                      className="rounded-lg border border-border bg-surface px-3 py-1 font-semibold text-text-primary hover:text-primary hover:border-primary transition-colors"
                    >
                      Audit Report
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
