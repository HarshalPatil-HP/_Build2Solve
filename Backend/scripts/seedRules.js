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
  { ruleNumber: 'Rule 6(b)', description: 'Generic or common name', fieldName: 'genericName', category: 'all', validationType: 'regex', validationPattern: '(?:generic name|commodity|product name|item name)\\s*[:\\-]?\\s*([a-z][a-z0-9 ,&()\\-]{2,80})' },
  { ruleNumber: 'Rule 7', description: 'Minimum declaration font size based on PDP area', fieldName: 'fontSize', category: 'all', validationType: 'conditional' },
  { ruleNumber: 'Rule 8', description: 'Mandatory declarations on the Principal Display Panel', fieldName: 'placement', category: 'all', validationType: 'conditional' },
  { ruleNumber: 'Rule 9', description: 'Legibility and prominence of declarations', fieldName: 'readability', category: 'all', validationType: 'conditional' },
  { ruleNumber: 'Rule 12(6)', description: 'No misleading words near quantity declaration', fieldName: 'misleadingWords', category: 'all', validationType: 'regex', validationPattern: '\\b(minimum|not less than|average|about|approximately)\\b' },
  { ruleNumber: 'Rule 6(7)', description: 'GM food declaration at the top of PDP', fieldName: 'gmLabel', category: 'food', validationType: 'conditional' },
  { ruleNumber: 'Rule 6(8)', description: 'Vegetarian/non-vegetarian dot visual verification', fieldName: 'vegNonVegDot', category: 'food', validationType: 'conditional' },
  { ruleNumber: 'Rule 6(8)', description: 'Vegetarian/non-vegetarian dot visual verification', fieldName: 'vegNonVegDot', category: 'cosmetics', validationType: 'conditional' },
];

const seed = async () => {
  await mongoose.connect(config.mongodbUri, { dbName: 'lm_compliance' });
  for (const r of RULES) {
    await Rule.updateOne({ fieldName: r.fieldName, ruleNumber: r.ruleNumber, category: r.category }, { $set: r }, { upsert: true });
  }
  console.log(`Seeded ${RULES.length} rules`);
  await mongoose.disconnect();
};

seed().catch((e) => { console.error(e); process.exit(1); });
