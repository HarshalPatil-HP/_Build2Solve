const { Complaint, Scan, User } = require('../models');
const { ApiError } = require('../utils');
const { getPagination, paginatedResponse } = require('../utils/pagination.util');

const createComplaint = async (userId, { scanId, description }) => {
  const scan = await Scan.findById(scanId);
  if (!scan) throw new ApiError(404, 'Scan not found', 'NOT_FOUND');
  if (scan.scannedBy.toString() !== userId) throw new ApiError(403, 'You can only complain about your own scan', 'FORBIDDEN');
  if (scan.overallStatus === 'compliant') {
    throw new ApiError(409, 'A complaint can only be filed for a non-compliant or review-required scan', 'SCAN_NOT_ACTIONABLE');
  }
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

  if (assignedInspectorId) {
    const inspector = await User.findOne({ _id: assignedInspectorId, role: 'inspector' });
    if (!inspector) throw new ApiError(400, 'assignedInspectorId must belong to an inspector', 'VALIDATION_ERROR');
    complaint.assignedInspectorId = assignedInspectorId;
  }
  if (status) complaint.status = status;
  await complaint.save();
  return complaint;
};

module.exports = { createComplaint, listComplaints, updateComplaint };
