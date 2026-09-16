import PropTypes from 'prop-types';
import { STATUS_LABEL, STATUS_PILL_CLASS } from '../../utils/statusColors';

export default function StatusPill({ status }) {
  const label = STATUS_LABEL[status] || status;
  const className = STATUS_PILL_CLASS[status] || STATUS_PILL_CLASS.exempt;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

StatusPill.propTypes = {
  status: PropTypes.string.isRequired,
};
