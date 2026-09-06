// Violation model — granular non-compliance records per scan.
// Reasoning: Maintained as a separate collection to support one-to-many scan violations.
// companyId is intentionally denormalized to enable high-performance risk-score aggregation queries.

const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true,
    index: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true,
    default: null,
  },
  ruleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule',
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['minor', 'major'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const Violation = mongoose.model('Violation', violationSchema);

module.exports = Violation;
