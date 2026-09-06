const caseService = require('../services/case.service');
const { ApiResponse, asyncHandler } = require('../utils');

const create = asyncHandler(async (req, res) => {
  const doc = await caseService.createCase({ ...req.body, inspectorId: req.user.userId });
  res.status(201).json(new ApiResponse(201, doc, 'Case created'));
});

const list = asyncHandler(async (req, res) => {
  const result = await caseService.listCases(req.user, req.query);
  res.status(200).json(new ApiResponse(200, result));
});

const getOne = asyncHandler(async (req, res) => {
  const doc = await caseService.getCaseById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, doc));
});

const update = asyncHandler(async (req, res) => {
  const doc = await caseService.updateCase(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, doc, 'Case updated'));
});

const lock = asyncHandler(async (req, res) => {
  const doc = await caseService.lockCase(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, doc, 'Case locked'));
});

const addendum = asyncHandler(async (req, res) => {
  const doc = await caseService.addAddendum(req.params.id, { ...req.body, inspectorId: req.user.userId }, req.user);
  res.status(201).json(new ApiResponse(201, doc, 'Addendum created'));
});

module.exports = { create, list, getOne, update, lock, addendum };
