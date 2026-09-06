require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const { Rule } = require('../src/models');

const RULES = [
  { ruleNumber: 'Rule 6(e)', description: 'MRP inclusive of all taxes', fieldName: 'mrp', category: 'all', validationType: 'regex', validationPattern: '(?:mrp|maximum retail price)[^\\d₹]*(?:₹|rs\\.?)\\s?\\d+(?:\\.\\d{1,2})?' },
  { ruleNumber: 'Rule 6(c)', description: 'Net quantity declaration', fieldName: 'netQuantity', category: 'all', validationType: 'regex', validationPattern: '\\d+(\\.\\d+)?\\s?(g|kg|ml|l|gm|gms)\\b' },
  { ruleNumber: 'Rule 6(d)', description: 'Manufacture date', fieldName: 'mfgDate', category: 'all', validationType: 'regex', validationPattern: '(?:mfg|manufactured|packed)[^\\d]*(\\d{1,2}[\\/\\-]?\\d{2,4}|[a-z]{3,9}\\s?\\d{4})' },
  { ruleNumber: 'Rule 6(2)', description: 'Consumer care contact', fieldName: 'consumerCare', category: 'all', validationType: 'regex', validationPattern: '[\\w.+-]+@[\\w-]+\\.[a-z]{2,}|(?:\\+?\\d[\\d\\s-]{8,12}\\d)' },
  { ruleNumber: 'Rule 6(a)', description: 'Manufacturer address', fieldName: 'manufacturer', category: 'all', validationType: 'regex', validationPattern: '(?:mfg|manufactured|marketed|packed)\\s*(?:by|:)' },
  { ruleNumber: 'Rule 6(aa)', description: 'Country of origin', fieldName: 'countryOfOrigin', category: 'all', validationType: 'regex', validationPattern: '(?:country of origin|made in|product of)\\s*[:\\s]*([a-z\\s]+)' },
];

const seed = async () => {
  await mongoose.connect(config.mongodbUri, { dbName: 'lm_compliance' });
  for (const r of RULES) {
    await Rule.updateOne({ fieldName: r.fieldName, ruleNumber: r.ruleNumber }, { $set: r }, { upsert: true });
  }
  console.log(`Seeded ${RULES.length} rules`);
  await mongoose.disconnect();
};

seed().catch((e) => { console.error(e); process.exit(1); });
