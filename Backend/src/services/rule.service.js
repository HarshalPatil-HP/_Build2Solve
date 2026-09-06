const { Rule } = require('../models');
const { ApiError } = require('../utils');
const { getPagination, paginatedResponse } = require('../utils/pagination.util');

const listRules = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = query.includeInactive === 'true' ? {} : { isActive: true };
  const [data, totalCount] = await Promise.all([
    Rule.find(filter).sort({ effectiveFrom: -1 }).skip(skip).limit(limit),
    Rule.countDocuments(filter),
  ]);
  return paginatedResponse(data, totalCount, page, limit);
};

const createRule = async (payload) => {
  const rule = await Rule.create(payload);
  return rule;
};

const deactivateRule = async (id) => {
  const rule = await Rule.findById(id);
  if (!rule) throw new ApiError(404, 'Rule not found', 'NOT_FOUND');
  rule.isActive = false;
  rule.effectiveTo = new Date();
  await rule.save();
  return rule;
};

module.exports = { listRules, createRule, deactivateRule };
