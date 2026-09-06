const scanService = require('../services/scan.service');
const { ApiResponse, asyncHandler } = require('../utils');

const createScan = asyncHandler(async (req, res) => {
  const result = await scanService.createScan(req);
  res.status(201).json(new ApiResponse(201, result, 'Scan completed'));
});

const getScans = asyncHandler(async (req, res) => {
  const result = await scanService.getScans(req.user, req.query);
  res.status(200).json(new ApiResponse(200, result));
});

const getScanById = asyncHandler(async (req, res) => {
  const result = await scanService.getScanById(req.user, req.params.id);
  res.status(200).json(new ApiResponse(200, result));
});

const getScanReport = asyncHandler(async (req, res) => {
  const report = await scanService.getScanReport(req.user, req.params.id, req.query.format || 'pdf');
  res.status(200).json(new ApiResponse(200, report));
});

module.exports = { createScan, getScans, getScanById, getScanReport };
