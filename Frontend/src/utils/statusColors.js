/**
 * Status pill classes. Always pair with visible text — never colour alone.
 */
export const STATUS_PILL_CLASS = {
  compliant: 'bg-status-compliant/10 text-status-compliant border-status-compliant/30',
  'non-compliant': 'bg-status-non-compliant/10 text-status-non-compliant border-status-non-compliant/30',
  'needs-review': 'bg-status-needs-review/10 text-status-needs-review border-status-needs-review/30',
  exempt: 'bg-status-exempt/10 text-status-exempt border-status-exempt/30',
  pending: 'bg-status-pending/10 text-status-pending border-status-pending/30',
  active: 'bg-status-compliant/10 text-status-compliant border-status-compliant/30',
  rejected: 'bg-status-non-compliant/10 text-status-non-compliant border-status-non-compliant/30',
};

export const STATUS_LABEL = {
  compliant: 'Compliant',
  'non-compliant': 'Non-Compliant',
  'needs-review': 'Needs Review',
  exempt: 'Exempt',
  pending: 'Pending',
  active: 'Active',
  rejected: 'Rejected',
};
