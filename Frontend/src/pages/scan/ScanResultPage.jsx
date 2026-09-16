import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ScanResultCard from '../../components/scan/ScanResultCard';
import { scanService } from '../../services/scanService';
import { caseService } from '../../services/caseService';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function ScanResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [scan, setScan] = useState(location.state?.scan || null);
  const [loading, setLoading] = useState(!location.state?.scan);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scan && id) {
      setLoading(true);
      scanService.getScanById(id)
        .then((res) => {
          setScan(res.data || res);
        })
        .catch((err) => {
          setError(err.message || 'Failed to fetch scan details');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, scan]);

  const handleFileComplaint = () => {
    navigate(`/complaints/new/${id}`, { state: { scan } });
  };

  const handleLockCase = async () => {
    if (!window.confirm('Formalize this scan into an official locked inspection case? Locked evidence cannot be altered.')) {
      return;
    }
    try {
      const res = await caseService.createCase({ scanId: id });
      const newCase = res.data || res;
      navigate(`/inspector/cases/${newCase._id || newCase.id}`);
    } catch (err) {
      alert(err.message || 'Failed to create official case.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-semibold text-text-secondary">Retrieving statutory scan docket...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-status-non-compliant">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Scan Docket Not Found</h3>
        <p className="text-xs text-text-secondary">{error || 'Unable to load scan details.'}</p>
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to History</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-mono text-text-secondary">
          Docket ID: <span className="font-bold text-text-primary">{id}</span>
        </span>
      </div>

      <ScanResultCard
        scanData={scan}
        role={role}
        onFileComplaint={handleFileComplaint}
        onLockCase={handleLockCase}
      />
    </div>
  );
}
