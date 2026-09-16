import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { Building, Search, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function InspectorCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyService.getCompanies({ page: 1, limit: 20, sortByRisk: true })
      .then((res) => {
        const data = res.data || res;
        setCompanies(Array.isArray(data) ? data : (data.companies || data.docs || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Registered Companies (Risk-Sorted Radar)</h1>
        <p className="text-xs text-text-secondary">
          Statutory inspection targets ranked by weighted risk score and historical violation frequency.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-text-secondary">Loading company radar...</div>
        ) : companies.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-secondary">No registered companies found.</div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
            {companies.map((c) => {
              const id = c._id || c.id;
              const risk = c.riskScore ?? 0.0;

              return (
                <div key={id} className="flex items-center justify-between p-4 bg-surface hover:bg-bg/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{c.name}</p>
                      <p className="text-[10px] text-text-secondary">Reg: {c.registrationNumber || 'LMPC-REG'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] text-text-secondary uppercase">Risk Index</span>
                      <p className={`font-bold ${risk > 5 ? 'text-status-non-compliant' : 'text-status-compliant'}`}>
                        {risk.toFixed(1)} / 10.0
                      </p>
                    </div>

                    <Link
                      to={`/inspector/companies/${id}/history`}
                      className="flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <span>Full History</span>
                      <ChevronRight className="h-4 w-4" />
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
