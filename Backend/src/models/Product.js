// Product model — represents packaged goods scanned in the field or internally.
// Reasoning: companyId is nullable so public consumer scans can create standalone
// product entries before they are officially mapped to a registered company.

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true,
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['food', 'cosmetics', 'electronics', 'other'],
    required: true,
    index: true,
  },
  lastScanStatus: {
    type: String,
    enum: ['compliant', 'non-compliant', 'unscanned'],
    default: 'unscanned',
  },
  lastScannedAt: {
    type: Date,
  },
  scanCount: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
