import { useAuth } from '../../context/AuthContext';
import { Building, ShieldCheck, FileText } from 'lucide-react';

export default function CompanyProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Legal Metrology Entity Profile</h1>
        <p className="text-xs text-text-secondary">
          Registered manufacturer / packer registration under Legal Metrology Act, 2009.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6 text-xs">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <Building className="h-7 w-7 text-accent-saffron" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">{user?.name || 'Company Name'}</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-compliant">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Metrology License Active</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-bg p-3.5 space-y-1">
            <span className="text-text-secondary">Registration Number (Rule 27)</span>
            <p className="font-mono font-bold text-text-primary">REG/LMPC/DL/2024/0921</p>
          </div>

          <div className="rounded-xl border border-border bg-bg p-3.5 space-y-1">
            <span className="text-text-secondary">Assigned Mongo Entity ID</span>
            <p className="font-mono font-bold text-text-primary">{user?.companyId || '64b8f1a2c9e7d40012a3b4c5'}</p>
          </div>

          <div className="sm:col-span-2 rounded-xl border border-border bg-bg p-3.5 space-y-1">
            <span className="text-text-secondary">Official Registered Unit Address</span>
            <p className="font-bold text-text-primary">Plot 45, GIDC Industrial Estate, Naroda, Ahmedabad, Gujarat - 382330</p>
          </div>
        </div>
      </div>
    </div>
  );
}
