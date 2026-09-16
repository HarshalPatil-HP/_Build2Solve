import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Mail, UserPlus, Shield } from 'lucide-react';

export default function CompanyTeamPage() {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [invited, setInvited] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteEmail) setInvited(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Company Quality Audit Team</h1>
          <p className="text-xs text-text-secondary">
            Manage sub-logins authorized to perform pre-market compliance label scans under your company registration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Active Team Members</span>
          </h3>

          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
            <div className="flex items-center justify-between p-3.5 bg-surface">
              <div>
                <p className="font-bold text-text-primary">{user?.name || 'Primary Admin'}</p>
                <p className="text-[10px] text-text-secondary">{user?.email}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                Account Owner
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            <span>Invite Team Member</span>
          </h3>

          <form onSubmit={handleInvite} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="quality@company.com"
                  className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-2 text-xs focus:border-primary focus:bg-surface focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2 font-bold text-white shadow-xs hover:bg-primary-light"
            >
              Send Invite Link
            </button>

            {invited && (
              <p className="text-[11px] text-status-compliant font-semibold text-center">
                Invitation sent to {inviteEmail}!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
