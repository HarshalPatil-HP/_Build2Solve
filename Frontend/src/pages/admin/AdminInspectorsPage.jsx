import { useState } from 'react';
import { authService } from '../../services/authService';
import { UserCheck, UserPlus, Shield, CheckCircle2 } from 'lucide-react';

export default function AdminInspectorsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [staffData, setStaffData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'inspector',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.createStaff(staffData);
      setShowAddModal(false);
      setStaffData({ name: '', email: '', password: '', role: 'inspector' });
      alert('Staff officer account provisioned successfully!');
    } catch (err) {
      setError(err.message || 'Failed to create staff account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Departmental Officers & Staff</h1>
          <p className="text-xs text-text-secondary">
            Provision official Inspector and Administrator staff credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-light"
        >
          <UserPlus className="h-4 w-4" />
          <span>Provision Officer Account</span>
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
        <p className="text-xs text-text-secondary">
          Staff accounts have gazetted enforcement privileges. Provision accounts directly using official departmental email addresses.
        </p>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-lg font-bold text-text-primary">Provision Staff Credentials</h3>

            {error && <p className="text-status-non-compliant">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Officer Name</label>
                <input
                  type="text"
                  value={staffData.name}
                  onChange={(e) => setStaffData({ ...staffData, name: e.target.value })}
                  placeholder="e.g. Officer Sunita Rao"
                  className="w-full rounded-lg border border-border bg-bg p-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Official Government Email</label>
                <input
                  type="email"
                  value={staffData.email}
                  onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                  placeholder="name@doca.gov.in"
                  className="w-full rounded-lg border border-border bg-bg p-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role Assignment</label>
                <select
                  value={staffData.role}
                  onChange={(e) => setStaffData({ ...staffData, role: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg p-2 focus:border-primary focus:outline-none font-bold"
                >
                  <option value="inspector">Inspector (Field Enforcement)</option>
                  <option value="admin">Administrator (System Controller)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Initial Temporary Password (Min. 12 chars)</label>
                <input
                  type="password"
                  value={staffData.password}
                  onChange={(e) => setStaffData({ ...staffData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-border bg-bg p-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-border px-4 py-2 font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary px-4 py-2 font-bold text-white shadow-xs hover:bg-primary-light"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
