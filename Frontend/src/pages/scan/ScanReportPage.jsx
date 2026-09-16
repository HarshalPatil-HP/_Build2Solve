import { useParams, useNavigate } from 'react';
import { scanService } from '../../services/scanService';
import { Download, FileText, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';

export default function ScanReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const pdfUrl = scanService.getReportUrl(id, 'pdf');
  const docxUrl = scanService.getReportUrl(id, 'docx');

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Scan Result</span>
      </button>

      <div className="rounded-2xl border border-border bg-surface p-8 shadow-xl text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
          <Shield className="h-8 w-8 text-accent-saffron" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Official Compliance Docket & Report
          </h2>
          <p className="text-xs text-text-secondary">
            Generated under Legal Metrology (Packaged Commodities) Rules, 2011 · Docket ID: <span className="font-mono font-bold text-text-primary">{id}</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg p-4 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-primary">
            <CheckCircle2 className="h-4 w-4 text-status-compliant" />
            <span>Evidentiary Chain & Authenticity Guarantee</span>
          </div>
          <p className="text-text-secondary leading-normal">
            This document contains extracted label declarations, bounding box OCR coordinates, Rule 7 font ratio calculations, and violation summaries formatted for official statutory submission.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-primary-light transition-all"
          >
            <Download className="h-5 w-5 text-accent-saffron" />
            <span>Download PDF Docket</span>
          </a>

          <a
            href={docxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-surface py-3.5 px-4 text-sm font-bold text-primary hover:bg-primary/5 transition-all"
          >
            <FileText className="h-5 w-5" />
            <span>Download Editable DOCX</span>
          </a>
        </div>
      </div>
    </div>
  );
}
