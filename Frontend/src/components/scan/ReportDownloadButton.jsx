import { useState } from 'react';
import PropTypes from 'prop-types';
import { scanService } from '../../services/scanService';

export default function ReportDownloadButton({ scanId, format, children, className }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const url = await scanService.getReportFile(scanId, format);
      // The API authorizes the scan before returning its generated file URL.
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } catch (err) {
      setError(err.message || 'Report unavailable. Please try again.');
    } finally { setBusy(false); }
  };
  return <span><button type="button" className={className} disabled={busy || !scanId}
    onClick={download}>{busy ? 'Preparing report…' : children}</button>
    {error && <span role="alert" className="block text-sm text-red-700">{error}</span>}</span>;
}
ReportDownloadButton.propTypes = {
  scanId: PropTypes.string, format: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired, className: PropTypes.string,
};
