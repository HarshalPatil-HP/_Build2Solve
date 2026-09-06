const { Scan, Violation, Company } = require('../models');

const getSummary = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalScans, compliantScans, violationsByField, scansOverTime, topCompanies] = await Promise.all([
    Scan.countDocuments(),
    Scan.countDocuments({ overallStatus: 'compliant' }),
    Violation.aggregate([{ $group: { _id: '$fieldName', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Scan.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Company.find().sort({ riskScore: -1 }).limit(10).select('name riskScore totalViolations totalScans'),
  ]);

  return {
    totalScans,
    complianceRate: totalScans ? Math.round((compliantScans / totalScans) * 100) : 0,
    violationsByField: violationsByField.map((v) => ({ field: v._id, count: v.count })),
    scansOverTime,
    topCompaniesByRisk: topCompanies,
  };
};

module.exports = { getSummary };
