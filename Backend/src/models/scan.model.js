// Scan model — primary record of packaging label analysis.
// Reasoning: scannerRole is intentionally denormalized from User to avoid joins on list views.
// Indexes on scannedBy, companyId, mode, overallStatus, and createdAt optimize filtering and aggregations.

const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  scannerRole: {
    type: String,
    enum: ['user', 'company', 'inspector'],
    required: true,
    index: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true,
    default: null,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  imageUrls: [
    {
      type: String,
    },
  ],
  ocrRawText: {
    type: String,
    default: '',
  },
  extractedFields: {
    manufacturer: { type: String, default: null },
    mrp: { type: String, default: null },
    netQuantity: { type: String, default: null },
    mfgDate: { type: String, default: null },
    genericName: { type: String, default: null },
    consumerCare: { type: String, default: null },
    countryOfOrigin: { type: String, default: null },
  },
  // Context only: these fields never participate in Legal Metrology failures.
  supplementaryMetadata: {
    fssaiLicenseNumbers: { type: [String], default: [] },
  },
  mode: {
    type: String,
    enum: ['self-check', 'field-inspection', 'public-check'],
    required: true,
    index: true,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  overallStatus: {
    type: String,
    enum: ['compliant', 'non-compliant', 'needs-review'],
    required: true,
    index: true,
  },
  // Persist the complete decision trail. A report can then be regenerated later
  // without rerunning OCR against evidence that may have changed or expired.
  analysis: {
    fields: { type: [mongoose.Schema.Types.Mixed], default: [] },
    estimatedValues: { type: [String], default: [] },
    exemptionsApplied: { type: [String], default: [] },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

scanSchema.index({ companyId: 1, createdAt: -1 });
scanSchema.index({ scannedBy: 1, createdAt: -1 });

const Scan = mongoose.model('Scan', scanSchema);

module.exports = Scan;
