import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { caseService } from '../../services/caseService';
import { Shield, Camera, AlertCircle, Building, MapPin, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export default function InspectorDashboardPage() {
  const [topRiskCompanies, setTopRiskCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyService.getCompanies({ page: 1, limit: 5, sortByRisk: true })
      .then((res) => {
        const data = res.data || res;
        setTopRiskCompanies(Array.isArray(data) ? data : (data.companies || data.docs || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Field Officer Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-light p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-accent-saffron uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            <span>Official Gazette Enforcement Terminal</span>
          </div>
          <h1 className="text-2xl font-extrabold">Field Inspection & Seizure Radar</h1>
          <p className="text-xs text-white/80 leading-relaxed">
            Record field seizures, issue notices under Section 36 of Legal Metrology Act, and execute risk-weighted retail inspection routes.
          </p>
        </div>

        <Link
          to="/inspector/scan"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-saffron px-5 py-3 text-sm font-bold text-slate-900 shadow-md hover:bg-amber-400 transition-all shrink-0"
        >
          <Camera className="h-5 w-5" />
          <span>Launch GPS Field Scanner</span>
        </Link>
      </div>

      {/* Recommended Priority Inspection Radar */}
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-status-non-compliant" />
              <span>Recommended Priority Inspections (Risk-Weighted Radar)</span>
            </h3>
            <p className="text-xs text-text-secondary">
              Companies automatically prioritized based on statutory violation history and consumer complaints
            </p>
          </div>
          <Link to="/inspector/companies" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>Full Radar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {topRiskCompanies.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-secondary">
            No high-risk entities flagged for priority inspection today.
          </div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {topRiskCompanies.map((c) => {
              const id = c._id || c.id;
              const risk = c.riskScore ?? 0.0;

              return (
                <div key={id} className="flex items-center justify-between p-4 bg-surface hover:bg-bg/50 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-status-non-compliant font-bold">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{c.name || 'Enterprise Entity'}</p>
                      <p className="text-[10px] text-text-secondary">Registration: {c.registrationNumber || 'LMPC-REG'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-text-secondary uppercase font-semibold">Risk Index</span>
                      <p className={`font-bold ${risk > 5 ? 'text-status-non-compliant' : 'text-status-needs-review'}`}>
                        {risk.toFixed(1)} / 10.0
                      </p>
                    </div>

                    <Link
                      to={`/inspector/companies/${id}/history`}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 font-bold text-primary hover:bg-primary/20 transition-colors"
                    >
                      Audit History
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
