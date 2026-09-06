const { Complaint } = require('../models');
const { ApiError } = require('../utils');
const { getPagination, paginatedResponse } = require('../utils/pagination.util');

const createComplaint = async (userId, { scanId, description }) => {
  const complaint = await Complaint.create({ raisedBy: userId, scanId, description });
  return complaint;
};

const listComplaints = async (user, query) => {
  const { page, limit, skip } = getPagination(query);
  let filter = {};

  if (user.role === 'user') filter = { raisedBy: user.userId };
  else if (user.role === 'inspector') filter = { assignedInspectorId: user.userId };
  // admin sees all

  const [data, totalCount] = await Promise.all([
    Complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);
  return paginatedResponse(data, totalCount, page, limit);
};

const updateComplaint = async (id, { assignedInspectorId, status }) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new ApiError(404, 'Complaint not found', 'NOT_FOUND');

  if (assignedInspectorId) complaint.assignedInspectorId = assignedInspectorId;
  if (status) complaint.status = status;
  await complaint.save();
  return complaint;
};

module.exports = { createComplaint, listComplaints, updateComplaint };
