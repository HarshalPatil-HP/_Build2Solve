// Barrel export for all Mongoose models.

const User = require('./user.model');
const Company = require('./company.model');
const Product = require('./product.model');
const Rule = require('./rule.model');
const Scan = require('./scan.model');
const Violation = require('./violation.model');
const Complaint = require('./complaint.model');
const Case = require('./case.model');
const Report = require('./report.model');

module.exports = {
  User,
  Company,
  Product,
  Rule,
  Scan,
  Violation,
  Complaint,
  Case,
  Report,
};
