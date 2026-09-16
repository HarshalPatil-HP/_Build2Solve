import { Link } from 'react-router-dom';
import { Clock, ShieldAlert, ArrowLeft, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PendingApprovalPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-xl text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-status-needs-review">
          <Clock className="h-8 w-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Inspector Account Pending Approval
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Welcome, <span className="font-semibold text-text-primary">{user?.name || 'Officer'}</span>. Your inspector account details have been registered and are currently awaiting administrative credential verification.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg p-4 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <ShieldAlert className="h-4 w-4" />
            <span>Verification Process Notice:</span>
          </div>
          <p className="text-text-secondary leading-normal">
            Legal Metrology Enforcement access is restricted to verified departmental officers. An administrator will review your badge ID and departmental jurisdiction before activating your account.
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-border text-xs text-text-secondary">
          <p className="font-medium text-text-primary">Need urgent activation for field inspection?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-primary font-medium">
            <a href="tel:1800114000" className="flex items-center gap-1.5 hover:underline">
              <Phone className="h-3.5 w-3.5" />
              <span>1800-11-4000 (Toll Free)</span>
            </a>
            <a href="mailto:support@consumeraffairs.gov.in" className="flex items-center gap-1.5 hover:underline">
              <Mail className="h-3.5 w-3.5" />
              <span>support@consumeraffairs.gov.in</span>
            </a>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Sign in with another account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
