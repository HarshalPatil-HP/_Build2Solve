const { Company } = require('../models');

const WEIGHTS = { major: 10, minor: 3 };

const updateRiskScore = async (companyId, overallStatus, violations = []) => {
  if (!companyId) return null;

  // A review result is uncertainty, not evidence of a violation. Count the
  // inspection, but do not reward or penalise a company until it is resolved.
  if (overallStatus === 'needs-review') {
    return Company.findByIdAndUpdate(companyId, { $inc: { totalScans: 1 } }, { new: true });
  }

  if (overallStatus === 'non-compliant' && violations.length > 0) {
    const increment = violations.reduce((sum, v) => sum + (WEIGHTS[v.severity] || WEIGHTS.minor), 0);
    return Company.findByIdAndUpdate(
      companyId,
      { $inc: { totalScans: 1, totalViolations: violations.length, riskScore: increment } },
      { new: true }
    );
  }

  // Only a confirmed compliant scan decays risk. Use a pipeline so simultaneous
  // clean scans cannot drive the score below zero.
  // below zero through a read-modify-write race.
  return Company.findByIdAndUpdate(
    companyId,
    [{ $set: {
      totalScans: { $add: [{ $ifNull: ['$totalScans', 0] }, 1] },
      riskScore: { $max: [0, { $subtract: [{ $ifNull: ['$riskScore', 0] }, 1] }] },
    } }],
    { new: true }
  );
};

module.exports = { updateRiskScore, WEIGHTS };
