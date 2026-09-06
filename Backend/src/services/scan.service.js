const { uploadImage } = require('../config/cloudinary');
const { Scan, Product, Violation, User, Company, Report, Rule } = require('../models');
const { ApiError, getImageDimensions } = require('../utils');
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
  if (reqUser.role === 'user') {
    if (bodyCompanyId) throw new ApiError(403, 'Public scans cannot be attributed to a company', 'FORBIDDEN');
    return null;
  }
  if (reqUser.role === 'inspector' && bodyCompanyId) {
    const company = await Company.findById(bodyCompanyId);
    if (!company) throw new ApiError(404, 'Company not found', 'NOT_FOUND');
    return company._id.toString();
  }
  return null;
};

const resolveMode = (role) => {
  if (role === 'inspector') return 'field-inspection';
  if (role === 'company') return 'self-check';
  return 'public-check';
};

const createScan = async (req) => {
  const files = req.scanFiles || [];
  if (!files.length) throw new ApiError(400, 'At least one image is required (field: images)', 'VALIDATION_ERROR');

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
    if (req.user.role === 'company' && product.companyId?.toString() !== companyId) {
      throw new ApiError(403, 'You can only scan products owned by your company', 'FORBIDDEN');
    }
    if (companyId && product.companyId && product.companyId.toString() !== companyId) {
      throw new ApiError(409, 'Product is linked to a different company', 'PRODUCT_COMPANY_MISMATCH');
    }
  }

  const effectiveCategory = product?.category || category;
  const ocrResults = [];
  // OCR is intentionally sequential: four simultaneous Tesseract workers can
  // exhaust a small hosted instance and cause a scan request to crash.
  for (const [imageIndex, file] of files.entries()) {
    const dimensions = getImageDimensions(file.buffer);
    if (!dimensions?.height) throw new ApiError(400, `Could not read dimensions for image ${imageIndex + 1}`, 'INVALID_IMAGE');
    const { rawText, blocks } = await runOcr(file.buffer);
    ocrResults.push({
      rawText,
      imageIndex,
      blocks: blocks.map((block) => ({ ...block, imageIndex, imageHeightPx: dimensions.height })),
    });
  }
  const cloudResults = await Promise.all(files.map((file) => uploadImage(file.buffer)));
  const rawText = ocrResults.map((result, index) => `--- Image ${index + 1} ---\n${result.rawText}`).join('\n\n');
  const extracted = await extractFields(ocrResults, effectiveCategory);

  if (!product) product = await Product.create({ name: productName, category, companyId });

  const analysis = await runRuleEngine({
    category: effectiveCategory,
    extracted,
    matchedBlocks: extracted.matchedBlocks,
    rawText,
    packageWidthCm: packageWidthCm ? parseFloat(packageWidthCm) : null,
    packageHeightCm: packageHeightCm ? parseFloat(packageHeightCm) : null,
    imageHeightPx: ocrResults[0].blocks[0]?.imageHeightPx || 1,
    isMolded: isMolded === 'true' || isMolded === true,
    isTobacco: isTobacco === 'true' || isTobacco === true,
    isRestaurantFastFood: isRestaurantFastFood === 'true' || isRestaurantFastFood === true,
    isImported: isImported === 'true' || isImported === true,
    categoryMismatchHint: effectiveCategory !== 'food' && /\b(ingredients|nutrition(?:al)?\s*(?:information|facts)?|fssai)\b/i.test(rawText),
  });

  const scan = await Scan.create({
    scannedBy: req.user.userId,
    scannerRole: req.user.role,
    companyId,
    productId: product._id,
    imageUrls: cloudResults.map((result) => result.secure_url),
    ocrRawText: rawText,
    extractedFields: {
      manufacturer: extracted.fields.manufacturer,
      mrp: extracted.fields.mrp,
      netQuantity: extracted.fields.netQuantity,
      mfgDate: extracted.fields.mfgDate,
      genericName: extracted.fields.genericName,
      consumerCare: extracted.fields.consumerCare,
      countryOfOrigin: extracted.fields.countryOfOrigin,
    },
    supplementaryMetadata: extracted.supplementaryMetadata,
    mode: resolveMode(req.user.role),
    location: parseLocation(location),
    overallStatus: analysis.overallStatus,
    analysis: {
      fields: analysis.fields,
      estimatedValues: analysis.estimatedValues,
      exemptionsApplied: analysis.exemptionsApplied,
    },
  });

  const violations = [];
  for (const field of analysis.fields.filter((f) => f.status === 'fail')) {
    let rule = await Rule.findOne({ ruleNumber: field.ruleReference, fieldName: field.fieldName, isActive: true });
    if (!rule) rule = await Rule.findOne({ fieldName: field.fieldName, isActive: true });
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

  const report =
    format === 'docx'
      ? await reportService.generateDocx(scan, violations, user.userId)
      : await reportService.generatePdf(scan, violations, user.userId);

  return report;
};

const parseLocation = (location) => {
  if (!location) return undefined;
  if (typeof location === 'object') return location;
  try {
    const parsed = JSON.parse(location);
    if (typeof parsed?.lat !== 'number' || typeof parsed?.lng !== 'number') throw new Error('invalid coordinates');
    return parsed;
  } catch {
    throw new ApiError(400, 'location must be JSON with numeric lat and lng', 'VALIDATION_ERROR');
  }
};

module.exports = { createScan, getScans, getScanById, getScanReport };
