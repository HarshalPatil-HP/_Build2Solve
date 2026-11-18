import { useState } from 'react';
import PropTypes from 'prop-types';
import FieldStatusRow from './FieldStatusRow';
import FontCalibratorBox from './FontCalibratorBox';
import VegDotConfirmBox from './VegDotConfirmBox';
import { ShieldCheck, AlertTriangle, XCircle, FileText, Download, AlertCircle, Lock, Building } from 'lucide-react';
import { adaptScanResponse, getScanField, getFontMeasurement } from '../../services/scanAdapter';
import { scanService } from '../../services/scanService';

export default function ScanResultCard({ scanData, role, onFileComplaint, onLockCase }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!scanData) return null;

  const {
    scanId,
    overallStatus,
    category,
    images = [],
    fields = [],
    estimatedValues = [],
    violations = [],
    supplementaryMetadata = {},
  } = adaptScanResponse(scanData);

  const fontField = getScanField(fields, 'fontSize');

  const getStatusBanner = () => {
    switch (overallStatus) {
      case 'compliant':
      case 'pass':
        return {
          bg: 'bg-status-compliant text-white',
          icon: <ShieldCheck className="h-6 w-6" />,
          title: 'Automated checks passed',
          subtitle: 'Verify these automated findings before relying on them.',
        };
      case 'non-compliant':
      case 'fail':
        return {
          bg: 'bg-status-non-compliant text-white',
          icon: <XCircle className="h-6 w-6" />,
          title: 'Statutory Non-Compliance Flagged',
          subtitle: `${violations.length} recorded violation(s); inspect the field findings below.`,
        };
      case 'needs-review':
      default:
        return {
          bg: 'bg-status-needs-review text-white',
          icon: <AlertTriangle className="h-6 w-6" />,
          title: 'Manual Visual Review Required',
          subtitle: 'Certain label declarations require visual verification or physical dimensions.',
        };
    }
  };

  const banner = getStatusBanner();
  const pdfUrl = scanService.getReportUrl(scanId, 'pdf');
  const docxUrl = scanService.getReportUrl(scanId, 'docx');

  return (
    <div className="space-y-6 font-sans">
      <h1 className="text-xl font-extrabold text-primary">SahiScan | सही स्कैन</h1>
      {/* Top Banner */}
      <div className={`rounded-2xl p-6 shadow-md flex items-center justify-between gap-4 ${banner.bg}`}>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white/20 p-3 backdrop-blur-xs">
            {banner.icon}
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{banner.title}</h2>
            <p className="text-xs text-white/90">{banner.subtitle}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/20 hover:bg-white/30 px-3 py-2 text-xs font-bold backdrop-blur-xs transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>PDF Docket</span>
          </a>
          <a
            href={docxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/20 hover:bg-white/30 px-3 py-2 text-xs font-bold backdrop-blur-xs transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>DOCX</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Label Image Viewer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center justify-between">
              <span>Evidence Image Docket</span>
              <span className="text-xs font-normal text-text-secondary">
                {images.length} panel(s)
              </span>
            </h3>

            {/* Main Preview */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border bg-black/5">
              {images.length > 0 ? (
                <img
                  src={typeof images[activeImageIdx] === 'string' ? images[activeImageIdx] : images[activeImageIdx]?.url}
                  alt="Label Panel"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-text-secondary">
                  No image preview available
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      activeImageIdx === idx ? 'border-primary shadow-xs' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={typeof img === 'string' ? img : img?.url} alt={`Panel ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FSSAI Supplementary Info Box */}
          {supplementaryMetadata?.fssaiLicenseNumbers?.length > 0 && (
            <div className="rounded-2xl border border-border bg-blue-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Building className="h-4 w-4" />
                <span>Supplementary FSSAI Food License Data</span>
              </div>
              <p className="text-xs text-text-secondary leading-normal">
                FSSAI License: <span className="font-mono font-bold text-text-primary">{supplementaryMetadata.fssaiLicenseNumbers.join(', ')}</span>
              </p>
              <p className="text-[10px] text-text-secondary italic">
                Note: Food manufacturer address is governed by FSSA 2006 (Exempt under LM Rule 6(a)).
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Field-by-Field Pass/Fail Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <h3 className="text-base font-bold text-text-primary">
              Mandatory Declarations Checklist (Rule 6)
            </h3>

            <div className="space-y-2.5">
              {[
                ...['genericName', 'netQuantity', 'mrp', 'mfgDate', 'manufacturer', 'consumerCare']
                  .map(name => getScanField(fields, name)),
                ...fields.filter(field => !['genericName', 'netQuantity', 'mrp', 'mfgDate', 'manufacturer', 'consumerCare'].includes(field.fieldName)),
              ].map((field, index) => (
                <FieldStatusRow key={field.fieldName + index} title={field.fieldName}
                  ruleRef={field.ruleRef} status={field.status} ruleStatus={field.ruleStatus}
                  extractedValue={field.value == null ? null : String(field.value)}
                  reason={field.reason} />
              ))}
            </div>
          </div>

          <FontCalibratorBox {...getFontMeasurement(fontField)}
            isEstimated={estimatedValues.includes('fontSize')} />

          {/* Rule 6(8) Veg/Non-Veg Visual Verification Box */}
          {category === 'food' && (
            <VegDotConfirmBox />
          )}

          {/* User & Inspector Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-bold text-text-primary hover:bg-bg transition-colors"
              >
                <Download className="h-4 w-4 text-primary" />
                <span>PDF Docket</span>
              </a>
              <a
                href={docxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-bold text-text-primary hover:bg-bg transition-colors"
              >
                <FileText className="h-4 w-4 text-primary" />
                <span>DOCX Docket</span>
              </a>
            </div>

            {role === 'user' && overallStatus === 'non-compliant' && onFileComplaint && (
              <button
                type="button"
                onClick={onFileComplaint}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
              >
                <AlertCircle className="h-4 w-4" />
                <span>File Consumer Complaint</span>
              </button>
            )}

            {role === 'inspector' && onLockCase && (
              <button
                type="button"
                onClick={onLockCase}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Formalize & Lock Inspection Case</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <footer className="border-t border-border pt-4 text-center text-sm text-text-secondary">AI findings are advisory and must be verified by an inspector.</footer>
    </div>
  );
}

ScanResultCard.propTypes = {
  scanData: PropTypes.object.isRequired,
  role: PropTypes.string,
  onFileComplaint: PropTypes.func,
  onLockCase: PropTypes.func,
};
