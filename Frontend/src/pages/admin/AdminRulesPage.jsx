import { useState, useEffect } from 'react';
import { ruleService } from '../../services/ruleService';
import { Shield, Plus, ToggleLeft, ToggleRight, Loader2, BookOpen } from 'lucide-react';

export default function AdminRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newRule, setNewRule] = useState({
    ruleNumber: '',
    title: '',
    description: '',
    category: 'all',
  });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await ruleService.getRules();
      const data = res.data || res;
      setRules(Array.isArray(data) ? data : (data.rules || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleDeactivate = async (id) => {
    if (!window.confirm('Soft-deactivate this statutory rule? Active rule engine will stop enforcing it for future scans while preserving historical auditability.')) {
      return;
    }
    try {
      await ruleService.deactivateRule(id);
      fetchRules();
    } catch (err) {
      alert(err.message || 'Failed to deactivate rule.');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await ruleService.createRule(newRule);
      setShowAddModal(false);
      setNewRule({ ruleNumber: '', title: '', description: '', category: 'all' });
      fetchRules();
    } catch (err) {
      alert(err.message || 'Failed to add rule.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">DB-Driven Statutory Rule Repository</h1>
          <p className="text-xs text-text-secondary">
            Versioned Legal Metrology Rules, 2011 engine configurations. Amendments take effect without code redeployment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-light"
        >
          <Plus className="h-4 w-4" />
          <span>Add Amendment Rule</span>
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-text-secondary">Loading rule engine repository...</div>
        ) : rules.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-secondary">No rules found. Seed default rules using backend script.</div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
            {rules.map((r) => {
              const id = r._id || r.id;
              const isActive = r.isActive !== false;

              return (
                <div key={id} className="flex items-center justify-between p-4 bg-surface hover:bg-bg/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{r.ruleNumber || 'Rule Reference'}</span>
                      <h4 className="font-bold text-text-primary">{r.title}</h4>
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary uppercase">
                        {r.category || 'all'}
                      </span>
                    </div>
                    <p className="text-text-secondary">{r.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeactivate(id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                      isActive
                        ? 'border-green-200 bg-green-50 text-status-compliant hover:bg-red-50 hover:text-status-non-compliant hover:border-red-200'
                        : 'border-gray-200 bg-gray-100 text-status-exempt opacity-60'
                    }`}
                  >
                    {isActive ? <ToggleRight className="h-4 w-4 text-status-compliant" /> : <ToggleLeft className="h-4 w-4" />}
                    <span>{isActive ? 'Active' : 'Deactivated'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Add Gazette Statutory Rule</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Rule Reference Identifier</label>
                <input
                  type="text"
                  value={newRule.ruleNumber}
                  onChange={(e) => setNewRule({ ...newRule, ruleNumber: e.target.value })}
                  placeholder="e.g. Rule 6(1)(aa)"
                  className="w-full rounded-lg border border-border bg-bg p-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Rule Title</label>
                <input
                  type="text"
                  value={newRule.title}
                  onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                  placeholder="e.g. Mandatory Country of Origin Declaration"
                  className="w-full rounded-lg border border-border bg-bg p-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Statutory Clause Description</label>
                <textarea
                  rows={3}
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Official gazette text..."
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
                  className="rounded-lg bg-primary px-4 py-2 font-bold text-white shadow-xs hover:bg-primary-light"
                >
                  Save Rule to DB Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
