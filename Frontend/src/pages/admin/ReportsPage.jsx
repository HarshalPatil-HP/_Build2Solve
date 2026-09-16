import { useState } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
  const [formatType, setFormatType] = useState('pdf');
  const [dateRange, setDateRange] = useState('30days');

  const handleExport = () => {
    alert(`Bulk statutory report export (${formatType.toUpperCase()}) triggered for timeframe: ${dateRange}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Bulk Statutory Compliance Reports</h1>
        <p className="text-xs text-text-secondary">
          Generate regional and national compliance dockets for official gazette publication.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-text-primary mb-1">Timeframe Selection</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg p-2.5 font-semibold text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days (Monthly Docket)</option>
            <option value="quarter">Current Quarter (Q3 2026)</option>
            <option value="annual">Annual Gazette Summary 2026</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-text-primary mb-1">Export File Format</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormatType('pdf')}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-bold transition-all ${
                formatType === 'pdf' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-bg text-text-secondary'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>PDF Format</span>
            </button>
            <button
              type="button"
              onClick={() => setFormatType('docx')}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-bold transition-all ${
                formatType === 'docx' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-bg text-text-secondary'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>DOCX Editable</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="w-full rounded-xl bg-primary py-3 font-bold text-white shadow-md hover:bg-primary-light transition-colors"
        >
          Generate & Download Bulk Summary Docket
        </button>
      </div>
    </div>
  );
}
