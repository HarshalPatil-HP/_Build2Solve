import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { message: 'Uploading label images to Cloudinary evidence repository...', duration: 1800 },
  { message: 'Initializing Tesseract.js OCR (English + Devanagari models)...', duration: 2000 },
  { message: 'Detecting text blocks & computing per-glyph bounding boxes...', duration: 2000 },
  { message: 'Extracting mandatory declarations under Rule 6 (MRP, Net Qty, Date)...', duration: 2000 },
  { message: 'Calculating PDP area ratios & font height thresholds (Rule 7)...', duration: 1800 },
  { message: 'Executing dynamic Legal Metrology Rule Engine (2011/2024 Amendments)...', duration: 2000 },
  { message: 'Checking misleading quantity terms & placement spacing (Rule 8 & 12)...', duration: 1800 },
  { message: 'Finalizing statutory compliance docket & risk assessment...', duration: 1500 },
];

export default function ScanLoadingState() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 max-w-md mx-auto">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-xl">
          <Shield className="h-10 w-10 text-accent-saffron animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent-saffron text-white shadow-md">
          <Sparkles className="h-4 w-4 animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-text-primary">Executing Label Scan</h3>
        <p className="text-xs text-text-secondary">Statutory Compliance Verification Pipeline</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary via-primary-light to-accent-saffron h-full transition-all duration-500"
          style={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }}
        />
      </div>

      {/* Stage Text List */}
      <div className="w-full space-y-2 text-left bg-surface rounded-xl border border-border p-4 text-xs">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 transition-opacity ${
                isDone
                  ? 'text-status-compliant opacity-90'
                  : isCurrent
                  ? 'text-primary font-bold'
                  : 'text-text-secondary/40'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-status-compliant" />
                ) : isCurrent ? (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-border ml-1" />
                )}
              </div>
              <span className="truncate">{stage.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
