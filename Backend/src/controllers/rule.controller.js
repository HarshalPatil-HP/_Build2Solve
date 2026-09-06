const ruleService = require('../services/rule.service');
const { ApiResponse, asyncHandler } = require('../utils');

const list = asyncHandler(async (req, res) => {
  const result = await ruleService.listRules(req.query);
  res.status(200).json(new ApiResponse(200, result));
});

const create = asyncHandler(async (req, res) => {
  const rule = await ruleService.createRule(req.body);
  res.status(201).json(new ApiResponse(201, rule, 'Rule created'));
});

const deactivate = asyncHandler(async (req, res) => {
  const rule = await ruleService.deactivateRule(req.params.id);
  res.status(200).json(new ApiResponse(200, rule, 'Rule deactivated'));
});

module.exports = { list, create, deactivate };
