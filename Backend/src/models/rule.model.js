// Rule model — dynamic Legal Metrology Packaged Commodities rules.
// Reasoning: Storing rules in MongoDB allows amendments to be added as new documents
// without redeploying code. Temporal fields (effectiveFrom/To) preserve historical auditability.

const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  ruleNumber: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['food', 'cosmetics', 'electronics', 'all'],
    required: true,
  },
  validationType: {
    type: String,
    enum: ['regex', 'presence', 'conditional'],
    required: true,
  },
  validationPattern: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  effectiveFrom: {
    type: Date,
    default: Date.now,
  },
  effectiveTo: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;
