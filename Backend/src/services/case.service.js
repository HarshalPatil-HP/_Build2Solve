const { Case: CaseModel, Scan, Complaint } = require('../models');
const { ApiError } = require('../utils');
const { getPagination, paginatedResponse } = require('../utils/pagination.util');

const generateCaseId = () => `LM-2026-${Date.now().toString().slice(-6)}`;

const createCase = async ({ scanId, inspectorId, complaintId, notes }) => {
  const scan = await Scan.findById(scanId);
  if (!scan) throw new ApiError(404, 'Scan not found', 'NOT_FOUND');
  if (complaintId) {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new ApiError(404, 'Complaint not found', 'NOT_FOUND');
    if (complaint.scanId.toString() !== scanId) throw new ApiError(400, 'Complaint does not belong to this scan', 'VALIDATION_ERROR');
  }
  const doc = await CaseModel.create({
    caseId: generateCaseId(),
    scanId,
    inspectorId,
    complaintId: complaintId || null,
    status: 'draft',
    notes: notes || '',
  });
  return doc;
};

const getCaseById = async (id, user = null) => {
  const doc = await CaseModel.findById(id);
  if (!doc) throw new ApiError(404, 'Case not found', 'NOT_FOUND');
  if (user?.role === 'inspector' && doc.inspectorId.toString() !== user.userId) {
    throw new ApiError(403, 'You can only access cases assigned to you', 'FORBIDDEN');
  }
  return doc;
};

const updateCase = async (id, updates, user) => {
  const doc = await getCaseById(id, user);
  if (doc.status === 'locked') {
    throw new ApiError(403, 'Case is locked, use addendum endpoint instead', 'CASE_LOCKED');
  }
  if (updates.notes !== undefined) doc.notes = updates.notes;
  if (updates.status && updates.status !== 'locked') doc.status = updates.status;
  await doc.save();
  return doc;
};

const lockCase = async (id, user) => {
  const doc = await getCaseById(id, user);
  doc.status = 'locked';
  await doc.save();
  return doc;
};

const addAddendum = async (id, { notes, inspectorId, scanId }, user) => {
  const parent = await getCaseById(id, user);
  if (parent.status !== 'locked') {
    throw new ApiError(409, 'Addenda are only allowed after a case is locked', 'CASE_NOT_LOCKED');
  }
  const doc = await CaseModel.create({
    caseId: `${parent.caseId}-ADD-${Date.now().toString().slice(-4)}`,
    scanId: scanId || parent.scanId,
    inspectorId,
    status: 'draft',
    parentCaseId: parent._id,
    notes: notes || '',
  });
  return doc;
};

const listCases = async (user, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = user.role === 'admin' ? {} : { inspectorId: user.userId };
  const [data, totalCount] = await Promise.all([
    CaseModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    CaseModel.countDocuments(filter),
  ]);
  return paginatedResponse(data, totalCount, page, limit);
};

module.exports = { createCase, getCaseById, updateCase, lockCase, addAddendum, listCases };
