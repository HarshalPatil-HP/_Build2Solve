import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, History } from 'lucide-react';
import StatusPill from '../../components/common/StatusPill';

export default function CompanyProductHistoryPage() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/company/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Product Portfolio</span>
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <History className="h-6 w-6 text-accent-saffron" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Product Compliance History Timeline</h1>
            <p className="text-xs text-text-secondary">SKU Reference ID: {id}</p>
          </div>
        </div>

        <div className="relative border-l-2 border-primary/20 ml-4 pl-6 space-y-6 text-xs">
          <div className="relative">
            <div className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
              1
            </div>
            <div className="rounded-xl border border-border bg-bg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary">Initial Label Artwork Scan</span>
                <StatusPill status="compliant" />
              </div>
              <p className="text-text-secondary">All 7 Rule 6 mandatory declarations passed OCR extraction.</p>
              <span className="text-[10px] text-text-secondary font-mono">Verified 16 Sep 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
