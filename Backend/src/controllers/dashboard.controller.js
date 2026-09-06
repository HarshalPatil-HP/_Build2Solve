const dashboardService = require('../services/dashboard.service');
const { ApiResponse, asyncHandler } = require('../utils');

const summary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();
  res.status(200).json(new ApiResponse(200, data));
});

module.exports = { summary };
