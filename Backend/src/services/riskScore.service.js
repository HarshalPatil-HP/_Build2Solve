const { Company } = require('../models');

const WEIGHTS = { major: 10, minor: 3 };

const updateRiskScore = async (companyId, violations = []) => {
  if (!companyId) return null;

  const company = await Company.findById(companyId);
  if (!company) return null;

  company.totalScans += 1;

  if (violations.length > 0) {
    company.totalViolations += violations.length;
    const increment = violations.reduce((sum, v) => sum + (WEIGHTS[v.severity] || WEIGHTS.minor), 0);
    company.riskScore += increment;
  } else {
    company.riskScore = Math.max(0, company.riskScore - 1);
  }

  await company.save();
  return company;
};

module.exports = { updateRiskScore, WEIGHTS };
