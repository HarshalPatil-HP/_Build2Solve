import PropTypes from 'prop-types';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ShieldCheck } from 'lucide-react';

export default function FieldStatusRow({ title, ruleRef, status, extractedValue, reason, isEstimated }) {
  const getStatusBadge = () => {
    switch (status) {
      case 'pass':
      case 'compliant':
        return {
          bg: 'bg-green-50 text-status-compliant border-green-200',
          icon: <CheckCircle2 className="h-4 w-4 text-status-compliant" />,
          label: 'Compliant',
        };
      case 'fail':
      case 'non_compliant':
      case 'violation':
        return {
          bg: 'bg-red-50 text-status-non-compliant border-red-200',
          icon: <XCircle className="h-4 w-4 text-status-non-compliant" />,
          label: 'Violation',
        };
      case 'exempt':
        return {
          bg: 'bg-gray-100 text-status-exempt border-gray-300',
          icon: <ShieldCheck className="h-4 w-4 text-status-exempt" />,
          label: 'Exempt',
        };
      case 'needs_review':
      default:
        return {
          bg: 'bg-amber-50 text-status-needs-review border-amber-200',
          icon: <AlertTriangle className="h-4 w-4 text-status-needs-review" />,
          label: 'Needs Review',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-surface hover:bg-bg/50 transition-colors">
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-text-primary">{title}</span>
          {ruleRef && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              {ruleRef}
            </span>
          )}
          {isEstimated && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
              Estimated
            </span>
          )}
        </div>

        <p className="text-xs font-mono text-text-secondary truncate">
          <span className="font-sans text-[11px] text-text-secondary/70">Extracted: </span>
          {extractedValue ? `"${extractedValue}"` : <span className="italic text-text-secondary/50">Not detected</span>}
        </p>

        {reason && (
          <p className="text-xs text-text-secondary/90 leading-normal">
            {reason}
          </p>
        )}
      </div>

      <div className="shrink-0 flex items-center">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${badge.bg}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </span>
      </div>
    </div>
  );
}

FieldStatusRow.propTypes = {
  title: PropTypes.string.isRequired,
  ruleRef: PropTypes.string,
  status: PropTypes.string.isRequired,
  extractedValue: PropTypes.string,
  reason: PropTypes.string,
  isEstimated: PropTypes.bool,
};
