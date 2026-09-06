// Case model — formal legal evidence and inspection case file.
// Reasoning: Serves as an immutable chain-of-custody evidence record. Once 'locked',
// amendments must be filed as separate addendum records referencing parentCaseId.

const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    unique: true,
    index: true,
    required: true,
    trim: true,
  },
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true,
  },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    default: null,
  },
  inspectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'locked', 'resolved'],
    default: 'draft',
  },
  parentCaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
