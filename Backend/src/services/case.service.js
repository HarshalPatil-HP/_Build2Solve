const { Case: CaseModel } = require('../models');
const { ApiError } = require('../utils');
const { getPagination, paginatedResponse } = require('../utils/pagination.util');

const generateCaseId = () => `LM-2026-${Date.now().toString().slice(-6)}`;

const createCase = async ({ scanId, inspectorId, complaintId, notes }) => {
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

const getCaseById = async (id) => {
  const doc = await CaseModel.findById(id);
  if (!doc) throw new ApiError(404, 'Case not found', 'NOT_FOUND');
  return doc;
};

const updateCase = async (id, updates) => {
  const doc = await getCaseById(id);
  if (doc.status === 'locked') {
    throw new ApiError(403, 'Case is locked, use addendum endpoint instead', 'CASE_LOCKED');
  }
  if (updates.notes !== undefined) doc.notes = updates.notes;
  if (updates.status && updates.status !== 'locked') doc.status = updates.status;
  await doc.save();
  return doc;
};

const lockCase = async (id) => {
  const doc = await getCaseById(id);
  doc.status = 'locked';
  await doc.save();
  return doc;
};

const addAddendum = async (id, { notes, inspectorId, scanId }) => {
  const parent = await getCaseById(id);
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
