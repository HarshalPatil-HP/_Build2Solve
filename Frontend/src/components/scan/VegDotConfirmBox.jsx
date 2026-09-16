import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';

export default function VegDotConfirmBox({ initialStatus = 'requires-visual-verification', onConfirm }) {
  const [attestation, setAttestation] = useState(initialStatus);

  const handleSelect = (status) => {
    setAttestation(status);
    if (onConfirm) onConfirm(status);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <h4 className="text-sm font-bold text-text-primary">
            Rule 6(8) Veg / Non-Veg Visual Verification
          </h4>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
          Visual Check Needed
        </span>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">
        Under Legal Metrology Rule 6(8) and Food Safety Regulations, a colored dot symbol (Green for Vegetarian, Red/Brown for Non-Vegetarian) must be displayed at the top of the PDP. Per legal compliance standards, this visual symbol cannot be assumed by text OCR alone.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => handleSelect('verified-veg')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border p-2 text-xs font-bold transition-all ${
            attestation === 'verified-veg'
              ? 'border-green-600 bg-green-50 text-green-700 shadow-xs'
              : 'border-border bg-bg text-text-secondary hover:bg-surface'
          }`}
        >
          <div className="h-3.5 w-3.5 rounded-full border-2 border-green-600 bg-green-600 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          <span>Green Dot Verified (Veg)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('verified-nonveg')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border p-2 text-xs font-bold transition-all ${
            attestation === 'verified-nonveg'
              ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
              : 'border-border bg-bg text-text-secondary hover:bg-surface'
          }`}
        >
          <div className="h-3.5 w-3.5 rounded-full border-2 border-red-600 bg-red-600 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          <span>Red Dot Verified (Non-Veg)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('missing')}
          className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs font-bold transition-all ${
            attestation === 'missing'
              ? 'border-red-600 bg-red-100 text-red-800'
              : 'border-border bg-bg text-text-secondary hover:bg-surface'
          }`}
        >
          <XCircle className="h-4 w-4 text-red-600" />
          <span>Symbol Missing</span>
        </button>
      </div>
    </div>
  );
}

VegDotConfirmBox.propTypes = {
  initialStatus: PropTypes.string,
  onConfirm: PropTypes.func,
};
