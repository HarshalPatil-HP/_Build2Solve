// One-time safe repair for products affected before needs-review was added to
// the Product enum. Each product is aligned with its most recent persisted scan.
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const { Product, Scan } = require('../src/models');

const run = async () => {
  await mongoose.connect(config.mongodbUri, { dbName: 'lm_compliance' });
  const products = await Product.find({}, '_id');
  let updated = 0;
  for (const product of products) {
    const latestScan = await Scan.findOne({ productId: product._id }).sort({ createdAt: -1 });
    if (!latestScan) continue;
    const result = await Product.updateOne(
      { _id: product._id, lastScanStatus: { $ne: latestScan.overallStatus } },
      { $set: { lastScanStatus: latestScan.overallStatus, lastScannedAt: latestScan.createdAt } }
    );
    updated += result.modifiedCount;
  }
  await mongoose.disconnect();
  console.log(`Repaired ${updated} product status record(s).`);
};

run().catch((error) => { console.error(error); process.exit(1); });
