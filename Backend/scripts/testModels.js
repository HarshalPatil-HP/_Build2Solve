// Verification script to test MongoDB Atlas connection and insert/read back a document for each of the 9 models.

require('dotenv').config();

const mongoose = require('mongoose');
const config = require('../src/config');
const {
  User,
  Company,
  Product,
  Rule,
  Scan,
  Violation,
  Complaint,
  Case,
  Report,
} = require('../src/models');

const runTest = async () => {
  console.log('--- Starting MongoDB & Models Verification ---');
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      dbName: 'lm_compliance',
    });
    console.log(`[✓] Connected to MongoDB Atlas successfully (${conn.connection.host}/${conn.connection.name}).`);

    // 1. Company
    const company = await Company.create({
      name: 'Test Agro Foods Ltd',
      registrationNumber: 'LM-REG-2026-9999',
      address: 'Plot 42, Industrial Area, Pune, Maharashtra',
      riskScore: 15,
      totalScans: 10,
      totalViolations: 2,
    });
    console.log(`[✓] Inserted Company: ${company._id}`);

    // 2. User
    const user = await User.create({
      name: 'Test Inspector Sharma',
      email: `test.inspector.${Date.now()}@example.com`,
      passwordHash: '$2b$10$hashedpasswordforexampletestpurposes',
      role: 'inspector',
      companyId: null,
    });
    console.log(`[✓] Inserted User: ${user._id}`);

    // 3. Product
    const product = await Product.create({
      companyId: company._id,
      name: 'Organic Wheat Flour 5kg',
      category: 'food',
      lastScanStatus: 'non-compliant',
      lastScannedAt: new Date(),
      scanCount: 1,
    });
    console.log(`[✓] Inserted Product: ${product._id}`);

    // 4. Rule
    const rule = await Rule.create({
      ruleNumber: 'Rule 6(e)',
      description: 'Retail sale price declaration (MRP inclusive of all taxes)',
      fieldName: 'mrp',
      category: 'all',
      validationType: 'regex',
      validationPattern: 'MRP\\s*(?:Rs\\.?|₹)\\s*\\d+(?:\\.\\d{2})?\\s*(?:incl\\.|inclusive)\\s*of\\s*all\\s*taxes',
      isActive: true,
      effectiveFrom: new Date('2011-01-01'),
    });
    console.log(`[✓] Inserted Rule: ${rule._id}`);

    // 5. Scan
    const scan = await Scan.create({
      scannedBy: user._id,
      scannerRole: 'inspector',
      companyId: company._id,
      productId: product._id,
      imageUrls: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      ocrRawText: 'Sample label text with missing MRP declaration',
      extractedFields: {
        manufacturer: 'Test Agro Foods Ltd',
        mrp: null,
        netQuantity: '5 kg',
        mfgDate: '01/2026',
        genericName: 'Wheat Flour',
        consumerCare: 'care@testagro.com',
        countryOfOrigin: 'India',
      },
      mode: 'field-inspection',
      location: { lat: 18.5204, lng: 73.8567 },
      overallStatus: 'non-compliant',
    });
    console.log(`[✓] Inserted Scan: ${scan._id}`);

    // 6. Violation
    const violation = await Violation.create({
      scanId: scan._id,
      companyId: company._id,
      ruleId: rule._id,
      fieldName: 'mrp',
      reason: 'Mandatory inclusive of all taxes wording missing on MRP declaration',
      severity: 'major',
    });
    console.log(`[✓] Inserted Violation: ${violation._id}`);

    // 7. Complaint
    const complaint = await Complaint.create({
      raisedBy: user._id,
      scanId: scan._id,
      description: 'Store sold packaged commodity without compliant MRP label',
      status: 'submitted',
      assignedInspectorId: user._id,
    });
    console.log(`[✓] Inserted Complaint: ${complaint._id}`);

    // 8. Case
    const testCaseId = `LM-TEST-${Date.now()}`;
    const testCase = await Case.create({
      caseId: testCaseId,
      scanId: scan._id,
      complaintId: complaint._id,
      inspectorId: user._id,
      status: 'draft',
      notes: 'Initial inspection notes recorded on site.',
    });
    console.log(`[✓] Inserted Case: ${testCase._id} (caseId: ${testCase.caseId})`);

    // 9. Report
    const report = await Report.create({
      caseId: testCase._id,
      scanId: scan._id,
      fileUrl: 'https://res.cloudinary.com/demo/raw/upload/report.pdf',
      format: 'pdf',
      generatedBy: user._id,
    });
    console.log(`[✓] Inserted Report: ${report._id}`);

    console.log('\n--- Reading back documents from all 9 collections ---');

    const readCompany = await Company.findById(company._id);
    const readUser = await User.findById(user._id);
    const readProduct = await Product.findById(product._id);
    const readRule = await Rule.findById(rule._id);
    const readScan = await Scan.findById(scan._id);
    const readViolation = await Violation.findById(violation._id);
    const readComplaint = await Complaint.findById(complaint._id);
    const readCase = await Case.findById(testCase._id);
    const readReport = await Report.findById(report._id);

    if (
      readCompany &&
      readUser &&
      readProduct &&
      readRule &&
      readScan &&
      readViolation &&
      readComplaint &&
      readCase &&
      readReport
    ) {
      console.log('[✓] All 9 documents successfully retrieved and verified from MongoDB Atlas.');
    } else {
      throw new Error('Failed to retrieve one or more documents from MongoDB Atlas.');
    }

    console.log('\n--- Cleaning up test records ---');
    await Report.findByIdAndDelete(report._id);
    await Case.findByIdAndDelete(testCase._id);
    await Complaint.findByIdAndDelete(complaint._id);
    await Violation.findByIdAndDelete(violation._id);
    await Scan.findByIdAndDelete(scan._id);
    await Rule.findByIdAndDelete(rule._id);
    await Product.findByIdAndDelete(product._id);
    await User.findByIdAndDelete(user._id);
    await Company.findByIdAndDelete(company._id);
    console.log('[✓] Cleanup complete.');

    await mongoose.disconnect();
    console.log('[✓] Disconnected from MongoDB Atlas. Verification PASSED.\n');
    process.exit(0);
  } catch (err) {
    console.error('[✗] Test failed with error:', err);
    process.exit(1);
  }
};

runTest();
