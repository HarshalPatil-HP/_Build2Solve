// Company model — represents registered businesses subject to Legal Metrology compliance.
// Reasoning: riskScore is indexed to power prioritized inspection queues for inspectors.
// Violations increase riskScore, while clean scans decay it over time.

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  riskScore: {
    type: Number,
    default: 0,
    index: true,
  },
  totalScans: {
    type: Number,
    default: 0,
  },
  totalViolations: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
