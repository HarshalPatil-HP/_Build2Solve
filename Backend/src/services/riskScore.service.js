const { Company } = require('../models');

const WEIGHTS = { major: 10, minor: 3 };

const updateRiskScore = async (companyId, violations = []) => {
  if (!companyId) return null;

  if (violations.length > 0) {
    const increment = violations.reduce((sum, v) => sum + (WEIGHTS[v.severity] || WEIGHTS.minor), 0);
    return Company.findByIdAndUpdate(
      companyId,
      { $inc: { totalScans: 1, totalViolations: violations.length, riskScore: increment } },
      { new: true }
    );
  }

  // Use an update pipeline so simultaneous clean scans cannot drive the score
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
