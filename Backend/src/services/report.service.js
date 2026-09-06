const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const { uploadRaw } = require('../config/cloudinary');
const { Report } = require('../models');

const buildContent = (scan, violations) => {
  const lines = [
    `Scan ID: ${scan._id}`,
    `Date: ${scan.createdAt?.toISOString?.() || new Date().toISOString()}`,
    `Overall Status: ${scan.overallStatus}`,
    `Product: ${scan.productId?.name || 'N/A'}`,
    `Category: ${scan.productId?.category || 'N/A'}`,
    '',
    'Extracted Fields:',
    `  Manufacturer: ${scan.extractedFields?.manufacturer || '—'}`,
    `  MRP: ${scan.extractedFields?.mrp || '—'}`,
    `  Net Quantity: ${scan.extractedFields?.netQuantity || '—'}`,
    `  Mfg Date: ${scan.extractedFields?.mfgDate || '—'}`,
    `  Generic Name: ${scan.extractedFields?.genericName || '—'}`,
    `  Consumer Care: ${scan.extractedFields?.consumerCare || '—'}`,
    `  Country of Origin: ${scan.extractedFields?.countryOfOrigin || '—'}`,
    '',
    'Violations:',
    ...(violations.length
      ? violations.map((v) => `  • [${v.severity}] ${v.fieldName}: ${v.reason}`)
      : ['  None']),
    '',
    'Note: Font-size and placement checks marked as estimates require physical dimensions for precision.',
  ];
  return lines;
};

const generatePdf = async (scan, violations, generatedBy) => {
  const lines = buildContent(scan, violations);
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];

  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on('end', resolve));

  doc.fontSize(16).text('Legal Metrology Compliance Report', { underline: true });
  doc.moveDown();
  doc.fontSize(10);
  lines.forEach((line) => doc.text(line));
  doc.moveDown();
  doc.fontSize(8).fillColor('gray').text('Estimated values are flagged as such and are not laboratory measurements.');
  doc.end();
  await done;

  const buffer = Buffer.concat(chunks);
  const filename = `report-${scan._id}-${Date.now()}`;
  const result = await uploadRaw(buffer, filename);
  const report = await Report.create({
    scanId: scan._id,
    fileUrl: result.secure_url,
    format: 'pdf',
    generatedBy,
  });
  return report;
};

const generateDocx = async (scan, violations, generatedBy) => {
  const lines = buildContent(scan, violations);
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: 'Legal Metrology Compliance Report', heading: HeadingLevel.HEADING_1 }),
          ...lines.map((line) => new Paragraph({ children: [new TextRun(line)] })),
          new Paragraph({
            children: [new TextRun({ text: 'Estimated values are not laboratory measurements.', italics: true })],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filename = `report-${scan._id}-${Date.now()}.docx`;
  const result = await uploadRaw(buffer, filename);
  const report = await Report.create({
    scanId: scan._id,
    fileUrl: result.secure_url,
    format: 'docx',
    generatedBy,
  });
  return report;
};

module.exports = { generatePdf, generateDocx };
