// Complaint model — citizen grievance reporting for non-compliant packaged goods.
// Reasoning: Bridges consumer-facing scans to government and inspector workflows.
// Admin can monitor incoming complaints and assign inspectors for formal follow-up.

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'escalated', 'resolved'],
    default: 'submitted',
    index: true,
  },
  assignedInspectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
