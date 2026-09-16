import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseService } from '../../services/caseService';
import StatusPill from '../../components/common/StatusPill';
import { Lock, ArrowLeft, PlusCircle, ShieldAlert, FileText } from 'lucide-react';

export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addendumNote, setAddendumNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    caseService.getCaseById(id)
      .then((res) => setCaseData(res.data || res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddendumSubmit = async (e) => {
    e.preventDefault();
    if (!addendumNote) return;

    setSubmittingNote(true);
    try {
      await caseService.addAddendum(id, { note: addendumNote });
      setAddendumNote('');
      const updated = await caseService.getCaseById(id);
      setCaseData(updated.data || updated);
    } catch (err) {
      alert(err.message || 'Failed to add addendum note.');
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-xs text-text-secondary">Loading case docket...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => navigate('/inspector/cases')}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Cases</span>
      </button>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-status-non-compliant">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Immutable Legal Case Docket #{id?.substring(0, 8)}</h1>
              <p className="text-xs text-text-secondary">Section 36 Notice Generator & Evidence Locker</p>
            </div>
          </div>
          <StatusPill status={caseData?.status || 'locked'} />
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="h-4 w-4" />
            <span>Legal Evidence Protection Lock Active</span>
          </div>
          <p>
            This case docket is permanently locked to ensure chain-of-custody integrity for court submission. Direct edits to original scan data are disabled. You may append supplementary notes via the addendum log below.
          </p>
        </div>

        {/* Addendum Notes List */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-text-primary">Official Case Addendum Log</h3>

          {caseData?.addendums?.length > 0 ? (
            <div className="space-y-2 text-xs">
              {caseData.addendums.map((a, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-bg p-3 space-y-1">
                  <p className="font-semibold text-text-primary">{a.note}</p>
                  <p className="text-[10px] text-text-secondary font-mono">Appended by Inspector · {a.createdAt}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-secondary italic">No addendum notes appended yet.</p>
          )}

          {/* Add Addendum Form */}
          <form onSubmit={handleAddendumSubmit} className="space-y-2 text-xs pt-2">
            <label className="block font-semibold text-text-primary">Append Supplementary Inspector Note</label>
            <textarea
              rows={3}
              value={addendumNote}
              onChange={(e) => setAddendumNote(e.target.value)}
              placeholder="Record lab test report findings, manufacturer responses, or seizure updates..."
              className="w-full rounded-lg border border-border bg-bg p-2.5 focus:border-primary focus:bg-surface focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={submittingNote}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-white shadow-xs hover:bg-primary-light"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Append Addendum Note</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
