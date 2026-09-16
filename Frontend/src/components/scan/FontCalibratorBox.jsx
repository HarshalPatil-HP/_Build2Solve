import PropTypes from 'prop-types';
import { Ruler, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FontCalibratorBox({ pdpAreaCm2, reqMinMm, measuredMm, isEstimated }) {
  const area = pdpAreaCm2 || 330;
  const required = reqMinMm || 4.0;
  const measured = measuredMm || 2.8;
  const isDeficit = measured < required;
  const deficitMm = Math.abs(required - measured).toFixed(1);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="h-5 w-5 text-primary" />
          <h4 className="text-sm font-bold text-text-primary">
            Display Area & Font Height Calibrator
          </h4>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
          Rule 7 Compliance
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="rounded-lg bg-bg p-3 text-center border border-border">
          <p className="text-[10px] font-semibold uppercase text-text-secondary">PDP Area</p>
          <p className="text-base font-extrabold text-primary">{area} cm²</p>
          <p className="text-[10px] text-text-secondary">Package Display Area</p>
        </div>

        <div className="rounded-lg bg-bg p-3 text-center border border-border">
          <p className="text-[10px] font-semibold uppercase text-text-secondary">Req. Min Font</p>
          <p className="text-base font-extrabold text-primary">{required} mm</p>
          <p className="text-[10px] text-text-secondary">Table 1 (2018 Amend.)</p>
        </div>

        <div className={`rounded-lg p-3 text-center border ${
          isDeficit
            ? 'bg-red-50 border-red-200 text-status-non-compliant'
            : 'bg-green-50 border-green-200 text-status-compliant'
        }`}>
          <p className="text-[10px] font-semibold uppercase">Measured Height</p>
          <p className="text-base font-extrabold">{measured} mm</p>
          <p className="text-[10px] font-medium">
            {isDeficit ? `Deficit: -${deficitMm}mm` : 'Compliant'}
          </p>
        </div>
      </div>

      {isEstimated && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800 border border-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-status-needs-review" />
          <span>
            <strong>Relative Estimate:</strong> Package dimensions were not provided prior to scan. Measured font height is calculated relative to PDP bounding box.
          </span>
        </div>
      )}
    </div>
  );
}

FontCalibratorBox.propTypes = {
  pdpAreaCm2: PropTypes.number,
  reqMinMm: PropTypes.number,
  measuredMm: PropTypes.number,
  isEstimated: PropTypes.bool,
};
