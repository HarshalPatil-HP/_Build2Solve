import { useParams, Link } from 'react';
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Building } from 'lucide-react';
import StatusPill from '../../components/common/StatusPill';

export default function ComplaintDetailPage() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/complaints"
        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Complaints List</span>
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Grievance Docket #{id?.substring(0, 8)}</h1>
            <p className="text-xs text-text-secondary">Filed under Legal Metrology Act 2009 Enforcement</p>
          </div>
          <StatusPill status="pending" />
        </div>

        {/* Stepper Status Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Statutory Escalation Timeline
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
            <div className="rounded-lg bg-primary text-white p-2 border border-primary">
              1. Submitted
            </div>
            <div className="rounded-lg bg-bg text-text-secondary p-2 border border-border">
              2. Under Review
            </div>
            <div className="rounded-lg bg-bg text-text-secondary p-2 border border-border">
              3. Inspection Assigned
            </div>
            <div className="rounded-lg bg-bg text-text-secondary p-2 border border-border">
              4. Resolved
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg p-4 space-y-2 text-xs">
          <p className="font-bold text-text-primary">Department Action Status:</p>
          <p className="text-text-secondary leading-relaxed">
            Your complaint has been logged in the State Consumer Affairs Enforcement Registry. An inspector will be assigned to visit the retail establishment or issue a statutory notice under Section 36 of the Legal Metrology Act.
          </p>
        </div>
      </div>
    </div>
  );
}
