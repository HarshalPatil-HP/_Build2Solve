import PropTypes from 'prop-types';
import { Ruler } from 'lucide-react';

export default function FontCalibratorBox({ measuredMm, reqMinMm, isEstimated }) {
  const available = Number.isFinite(measuredMm) && Number.isFinite(reqMinMm);
  return (
    <section className="rounded-card border border-border bg-surface p-4 space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
        <Ruler className="h-5 w-5" /> Rule 7 font measurement
      </h3>
      {available ? (
        <p className="text-sm text-text-primary">
          Measured height: {measuredMm} mm · Required minimum: {reqMinMm} mm
        </p>
      ) : <p className="text-sm text-text-secondary">Measurement unavailable</p>}
      {available && isEstimated && (
        <p className="text-xs text-status-needs-review">Estimated from the image; verify the physical measurement.</p>
      )}
    </section>
  );
}
FontCalibratorBox.propTypes = {
  measuredMm: PropTypes.number, reqMinMm: PropTypes.number, isEstimated: PropTypes.bool,
};
