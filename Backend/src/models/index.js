// Barrel export for all Mongoose models.

const User = require('./User');
const Company = require('./Company');
const Product = require('./Product');
const Rule = require('./Rule');
const Scan = require('./Scan');
const Violation = require('./Violation');
const Complaint = require('./Complaint');
const Case = require('./Case');
const Report = require('./Report');

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
