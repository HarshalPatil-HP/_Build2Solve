const companyService = require('../services/company.service');
const { ApiResponse, asyncHandler } = require('../utils');

const list = asyncHandler(async (req, res) => {
  const result = await companyService.listCompanies(req.query);
  res.status(200).json(new ApiResponse(200, result));
});

const history = asyncHandler(async (req, res) => {
  const result = await companyService.getCompanyHistory(req.params.id, req.query);
  res.status(200).json(new ApiResponse(200, result));
});

module.exports = { list, history };
