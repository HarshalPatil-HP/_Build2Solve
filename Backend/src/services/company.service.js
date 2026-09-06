const { Company, Scan, Violation } = require('../models');
const { ApiError } = require('../utils');
const { getPagination, paginatedResponse } = require('../utils/pagination.util');

const listCompanies = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const sort = query.sortByRisk !== 'false' ? { riskScore: -1 } : { createdAt: -1 };
  const [data, totalCount] = await Promise.all([
    Company.find().sort(sort).skip(skip).limit(limit),
    Company.countDocuments(),
  ]);
  return paginatedResponse(data, totalCount, page, limit);
};

const getCompanyHistory = async (companyId, query) => {
  const company = await Company.findById(companyId);
  if (!company) throw new ApiError(404, 'Company not found', 'NOT_FOUND');

  const { page, limit, skip } = getPagination(query);
  const [scans, totalCount] = await Promise.all([
    Scan.find({ companyId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Scan.countDocuments({ companyId }),
  ]);

  const scanIds = scans.map((s) => s._id);
  const violations = await Violation.find({ scanId: { $in: scanIds } });

  return {
    company,
    ...paginatedResponse(
      scans.map((s) => ({
        scan: s,
        violations: violations.filter((v) => v.scanId.toString() === s._id.toString()),
      })),
      totalCount,
      page,
      limit
    ),
  };
};

module.exports = { listCompanies, getCompanyHistory };
