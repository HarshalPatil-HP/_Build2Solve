// Report model — generated compliance inspection documents (PDF/DOCX).
// Reasoning: Maintained independently of Case to allow re-generation and versioning
// of legal violation notices without overwriting previous exports.

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    default: null,
  },
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true,
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
