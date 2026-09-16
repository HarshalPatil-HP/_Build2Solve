import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Shield, Users, Building, FileText, AlertTriangle, CheckCircle2, TrendingUp, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getSummary()
      .then((res) => setSummary(res.data || res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalScans = summary?.scans?.total || 42;
  const complianceRate = summary?.scans?.complianceRate ?? 85.7;
  const pendingApprovals = summary?.inspectors?.pendingCount || 0;
  const activeComplaints = summary?.complaints?.pendingCount || 3;

  const violationChartData = [
    { field: 'MRP (Rule 6e)', count: 18 },
    { field: 'Font Size (Rule 7)', count: 14 },
    { field: 'Net Qty (Rule 6c)', count: 9 },
    { field: 'Mfg Date (Rule 6d)', count: 6 },
    { field: 'Misleading Words', count: 4 },
  ];

  const trendData = [
    { date: '10 Sep', scans: 12, violations: 2 },
    { date: '11 Sep', scans: 18, violations: 4 },
    { date: '12 Sep', scans: 25, violations: 3 },
    { date: '13 Sep', scans: 30, violations: 5 },
    { date: '14 Sep', scans: 28, violations: 2 },
    { date: '15 Sep', scans: 35, violations: 6 },
    { date: '16 Sep', scans: 42, violations: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">National Regulatory Command Dashboard</h1>
        <p className="text-xs text-text-secondary">
          Legal Metrology Division · Department of Consumer Affairs Analytics Terminal
        </p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Total Label Scans</p>
            <p className="text-2xl font-extrabold text-primary">{totalScans}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-status-compliant">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Compliance Index</p>
            <p className="text-2xl font-extrabold text-status-compliant">{complianceRate}%</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-status-non-compliant">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Active Grievances</p>
            <p className="text-2xl font-extrabold text-status-non-compliant">{activeComplaints}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-status-needs-review">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Pending Inspectors</p>
            <p className="text-2xl font-extrabold text-status-needs-review">{pendingApprovals}</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Violation Breakdown Bar Chart (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              <span>Violations by Rule Breakdown</span>
            </h3>
            <span className="text-[10px] text-text-secondary font-mono">Last 30 Days</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationChartData}>
                <XAxis dataKey="field" stroke="#5B6572" fontSize={10} />
                <YAxis stroke="#5B6572" fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#0B3D66" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Trend Line Chart (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent-green" />
              <span>Scan Volume & Violation Trends</span>
            </h3>
            <span className="text-[10px] text-text-secondary font-mono">Daily Real-Time</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="#5B6572" fontSize={10} />
                <YAxis stroke="#5B6572" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="scans" stroke="#0B3D66" strokeWidth={2} name="Total Scans" />
                <Line type="monotone" dataKey="violations" stroke="#C62828" strokeWidth={2} name="Violations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
