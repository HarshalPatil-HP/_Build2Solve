const { uploadImage } = require('../config/cloudinary');
const { Scan, Product, Violation, User, Report, Rule } = require('../models');
const { ApiError } = require('../utils');
const { getPagination, paginatedResponse } = require('../utils/pagination.util');
const { runOcr } = require('./ocr.service');
const { extractFields } = require('./extraction.service');
const { runRuleEngine } = require('./ruleEngine.service');
const { updateRiskScore } = require('./riskScore.service');
const reportService = require('./report.service');

const resolveCompanyId = async (reqUser, bodyCompanyId) => {
  if (reqUser.role === 'company') {
    const user = await User.findById(reqUser.userId);
    if (!user?.companyId) throw new ApiError(403, 'Company account not linked to a company', 'FORBIDDEN');
    return user.companyId.toString();
  }
  return bodyCompanyId || null;
};

const resolveMode = (role) => {
  if (role === 'inspector') return 'field-inspection';
  if (role === 'company') return 'self-check';
  return 'public-check';
};

const createScan = async (req) => {
  if (!req.file) throw new ApiError(400, 'Image file is required (field: image)', 'VALIDATION_ERROR');

  const {
    productName,
    category,
    productId,
    packageWidthCm,
    packageHeightCm,
    isMolded,
    isTobacco,
    isRestaurantFastFood,
    isImported,
    location,
  } = req.body;

  if (!productName || !category) {
    throw new ApiError(400, 'productName and category are required', 'VALIDATION_ERROR');
  }

  const companyId = await resolveCompanyId(req.user, req.body.companyId);

  let product;
  if (productId) {
    product = await Product.findById(productId);
    if (!product) throw new ApiError(404, 'Product not found', 'NOT_FOUND');
  } else {
    product = await Product.create({ name: productName, category, companyId });
  }

  const cloudResult = await uploadImage(req.file.buffer);
  const { rawText, blocks } = await runOcr(req.file.buffer);
  const extracted = await extractFields(rawText, blocks);

  const imageHeightPx = Math.max(...blocks.map((b) => b.y + b.height), req.file.buffer ? 800 : 800);

  const analysis = await runRuleEngine({
    category: product.category,
    extracted,
    matchedBlocks: extracted.matchedBlocks,
    rawText,
    packageWidthCm: packageWidthCm ? parseFloat(packageWidthCm) : null,
    packageHeightCm: packageHeightCm ? parseFloat(packageHeightCm) : null,
    imageHeightPx,
    isMolded: isMolded === 'true' || isMolded === true,
    isTobacco: isTobacco === 'true' || isTobacco === true,
    isRestaurantFastFood: isRestaurantFastFood === 'true' || isRestaurantFastFood === true,
    isImported: isImported === 'true' || isImported === true,
  });

  const scan = await Scan.create({
    scannedBy: req.user.userId,
    scannerRole: req.user.role,
    companyId,
    productId: product._id,
    imageUrls: [cloudResult.secure_url],
    ocrRawText: rawText,
    extractedFields: {
      manufacturer: extracted.fields.manufacturer,
      mrp: extracted.fields.mrp,
      netQuantity: extracted.fields.netQuantity,
      mfgDate: extracted.fields.mfgDate,
      genericName: extracted.fields.genericName || productName,
      consumerCare: extracted.fields.consumerCare,
      countryOfOrigin: extracted.fields.countryOfOrigin,
    },
    mode: resolveMode(req.user.role),
    location: location ? JSON.parse(typeof location === 'string' ? location : JSON.stringify(location)) : undefined,
    overallStatus: analysis.overallStatus,
  });

  const violations = [];
  for (const field of analysis.fields.filter((f) => f.status === 'fail')) {
    let rule = await Rule.findOne({ fieldName: field.fieldName, isActive: true });
    if (!rule) rule = await Rule.findOne({ isActive: true });
    if (!rule) {
      rule = await Rule.create({
        ruleNumber: field.ruleReference || 'General',
        description: field.reason,
        fieldName: field.fieldName,
        category: 'all',
        validationType: 'presence',
        isActive: true,
      });
    }
    const v = await Violation.create({
      scanId: scan._id,
      companyId,
      ruleId: rule._id,
      fieldName: field.fieldName,
      reason: field.reason,
      severity: ['mrp', 'netQuantity', 'manufacturer'].includes(field.fieldName) ? 'major' : 'minor',
    });
    violations.push(v);
  }

  if (companyId) await updateRiskScore(companyId, violations);

  product.lastScanStatus = analysis.overallStatus === 'compliant' ? 'compliant' : 'non-compliant';
  product.lastScannedAt = new Date();
  product.scanCount += 1;
  await product.save();

  return { scan, analysis, violations, product };
};

const buildScanFilter = (user) => {
  if (user.role === 'admin') return {};
  if (user.role === 'inspector') return {};
  if (user.role === 'company') return { companyId: user.companyId };
  return { scannedBy: user.userId };
};

const getScans = async (user, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildScanFilter(user);
  const [data, totalCount] = await Promise.all([
    Scan.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('productId', 'name category'),
    Scan.countDocuments(filter),
  ]);
  return paginatedResponse(data, totalCount, page, limit);
};

const getScanById = async (user, scanId) => {
  const scan = await Scan.findById(scanId).populate('productId', 'name category');
  if (!scan) throw new ApiError(404, 'Scan not found', 'NOT_FOUND');

  if (user.role === 'user' && scan.scannedBy.toString() !== user.userId) {
    throw new ApiError(403, 'Forbidden', 'FORBIDDEN');
  }
  if (user.role === 'company' && scan.companyId?.toString() !== user.companyId) {
    throw new ApiError(403, 'Forbidden', 'FORBIDDEN');
  }

  const violations = await Violation.find({ scanId: scan._id });
  return { scan, violations };
};

const getScanReport = async (user, scanId, format = 'pdf') => {
  const { scan } = await getScanById(user, scanId);
  const violations = await Violation.find({ scanId: scan._id });

  const existing = await Report.findOne({ scanId: scan._id, format }).sort({ generatedAt: -1 });
  if (existing) return existing;

  const fileUrl =
    format === 'docx'
      ? await reportService.generateDocx(scan, violations, user.userId)
      : await reportService.generatePdf(scan, violations, user.userId);

  return { fileUrl, format, scanId: scan._id };
};

module.exports = { createScan, getScans, getScanById, getScanReport };
