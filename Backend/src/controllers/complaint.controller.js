const complaintService = require('../services/complaint.service');
const { ApiResponse, asyncHandler } = require('../utils');

const create = asyncHandler(async (req, res) => {
  const complaint = await complaintService.createComplaint(req.user.userId, req.body);
  res.status(201).json(new ApiResponse(201, complaint, 'Complaint filed'));
});

const list = asyncHandler(async (req, res) => {
  const result = await complaintService.listComplaints(req.user, req.query);
  res.status(200).json(new ApiResponse(200, result));
});

const update = asyncHandler(async (req, res) => {
  const complaint = await complaintService.updateComplaint(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, complaint, 'Complaint updated'));
});

module.exports = { create, list, update };
