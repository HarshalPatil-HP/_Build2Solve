import { useParams, Link } from 'react';
import { ArrowLeft, Award, CheckCircle2, FileText, Clock } from 'lucide-react';

export default function InspectorPerformancePage() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/admin/inspectors" className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Inspectors</span>
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6 text-xs">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white font-bold text-xl">
            <Award className="h-7 w-7 text-accent-saffron" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Officer Performance Docket</h2>
            <p className="text-text-secondary font-mono">Inspector ID: {id}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl border border-border bg-bg p-3">
            <p className="text-text-secondary">Scans Executed</p>
            <p className="text-xl font-bold text-primary">34</p>
          </div>
          <div className="rounded-xl border border-border bg-bg p-3">
            <p className="text-text-secondary">Cases Closed</p>
            <p className="text-xl font-bold text-status-compliant">12</p>
          </div>
          <div className="rounded-xl border border-border bg-bg p-3">
            <p className="text-text-secondary">Avg Resolution</p>
            <p className="text-xl font-bold text-primary">2.4 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
