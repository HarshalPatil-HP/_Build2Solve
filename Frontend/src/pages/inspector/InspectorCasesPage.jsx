import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { caseService } from '../../services/caseService';
import StatusPill from '../../components/common/StatusPill';
import { Lock, FileText, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function InspectorCasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    caseService.getCases({ page: 1, limit: 20 })
      .then((res) => {
        const data = res.data || res;
        setCases(Array.isArray(data) ? data : (data.cases || data.docs || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Official Inspection Cases</h1>
        <p className="text-xs text-text-secondary">
          Immutable evidentiary dockets locked under Section 36 of Legal Metrology Act, 2009.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-text-secondary">Loading official cases...</div>
        ) : cases.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-secondary">
            No official cases formalised yet. Perform a field scan and click "Lock Official Case".
          </div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
            {cases.map((c) => {
              const id = c._id || c.id;
              const dateStr = c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : 'Recent';

              return (
                <div key={id} className="flex items-center justify-between p-4 bg-surface hover:bg-bg/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">Case Docket #{id.substring(0, 8)}</p>
                      <p className="text-[10px] text-text-secondary">Opened on {dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusPill status={c.status || 'locked'} />
                    <Link
                      to={`/inspector/cases/${id}`}
                      className="flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <span>Inspect Evidence</span>
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
