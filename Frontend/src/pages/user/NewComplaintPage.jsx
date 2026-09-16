import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { scanService } from '../../services/scanService';
import { complaintService } from '../../services/complaintService';
import { AlertCircle, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function NewComplaintPage() {
  const { scanId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [scan, setScan] = useState(location.state?.scan || null);
  const [loading, setLoading] = useState(!location.state?.scan);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    sellerName: '',
    sellerAddress: '',
    violationType: 'missing_declaration',
    description: '',
  });

  useEffect(() => {
    if (!scan && scanId) {
      setLoading(true);
      scanService.getScanById(scanId)
        .then((res) => setScan(res.data || res))
        .catch(() => setError('Failed to load associated scan.'))
        .finally(() => setLoading(false));
    }
  }, [scanId, scan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) {
      setError('Please provide a brief description of the violation.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        scanId,
        sellerName: formData.sellerName || 'Unspecified Retailer',
        sellerAddress: formData.sellerAddress,
        violationType: formData.violationType,
        description: formData.description,
      };

      await complaintService.createComplaint(payload);
      navigate('/complaints');
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-text-secondary">Loading scan details...</div>;
  }

  const productName = scan?.productName || scan?.analysis?.fields?.genericName?.value || 'Packaged Commodity';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-status-non-compliant">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">File Consumer Grievance</h1>
            <p className="text-xs text-text-secondary">
              Escalate statutory label non-compliance to Legal Metrology Enforcement Officers.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-status-non-compliant flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Linked Scan Summary Box */}
        <div className="rounded-xl border border-border bg-bg p-4 text-xs space-y-1">
          <span className="font-semibold text-text-secondary">Linked Evidentiary Scan Docket:</span>
          <p className="font-bold text-text-primary">{productName}</p>
          <p className="font-mono text-[10px] text-text-secondary">ID: {scanId}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Store / E-Commerce Retailer Name
            </label>
            <input
              type="text"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              placeholder="e.g. Reliance Fresh / Amazon India seller"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 focus:border-primary focus:bg-surface focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Store Location / Address
            </label>
            <input
              type="text"
              name="sellerAddress"
              value={formData.sellerAddress}
              onChange={handleChange}
              placeholder="e.g. Sector 18, Noida, Uttar Pradesh"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 focus:border-primary focus:bg-surface focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Violation Type
            </label>
            <select
              name="violationType"
              value={formData.violationType}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 focus:border-primary focus:bg-surface focus:outline-none font-semibold text-text-primary"
            >
              <option value="missing_declaration">Missing Mandatory Declaration (Rule 6)</option>
              <option value="mrp_overcharge">MRP Overcharging / Smudged Price</option>
              <option value="font_size_deficit">Illegible / Small Font Size (Rule 7)</option>
              <option value="misleading_quantity">Misleading Weight Phrase ("approx", "net weight")</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Grievance Description & Observations
            </label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe where the product was purchased and specific label deficiencies..."
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 focus:border-primary focus:bg-surface focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white shadow-xs hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            {submitting ? 'Submitting...' : 'Submit Grievance to Controller'}
          </button>
        </form>
      </div>
    </div>
  );
}
