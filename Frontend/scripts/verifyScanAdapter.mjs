import assert from 'node:assert/strict';
import { fieldDisplayStatus } from '../src/services/scanAdapter.js';
import { adaptScanResponse, getScanField, getFontMeasurement, normalizeFieldStatus, scanErrorMessage } from '../src/services/scanAdapter.js';

for (const status of [undefined, null, '', 'unknown', 'exempt', 'warning', 'needs_review']) {
  assert.equal(normalizeFieldStatus(status), 'needs-review');
}
const scan = adaptScanResponse({ data: {
  scanId: 'sample-id', overallStatus: 'non_compliant',
  fields: [{ fieldName: 'mrp', value: 'Rs 50', status: 'fail', ruleRef: 'Rule 6' },
    { fieldName: 'genericName', value: 'Soap' }],
  scan: { analysis: { fields: [{ fieldName: 'mrp', status: 'pass' }] } },
} });
assert.equal(scan.scanId, 'sample-id');
assert.equal(scan.overallStatus, 'non-compliant');
assert.equal(getScanField(scan.fields, 'mrp').status, 'fail');
assert.equal(getScanField(scan.fields, 'genericName').status, 'needs-review');
assert.equal(getScanField(scan.fields, 'netQuantity').status, 'needs-review');
assert.deepEqual(getFontMeasurement({ value: null }), { measuredMm: null, reqMinMm: null });
assert.deepEqual(getFontMeasurement({ value: '1.25mm (min 1.5mm)' }), { measuredMm: 1.25, reqMinMm: 1.5 });
assert.match(scanErrorMessage({ code: 'UNREADABLE_OR_NON_LABEL_IMAGE' }), /clear, well-lit/);
console.log('PASS: unknown/missing statuses need review; contract ID, fields, font and 422 mapping');
for (const [ruleStatus, expected] of [
  ['exempt', 'exempt'], ['warning', 'needs-review'],
  ['requires-visual-verification', 'needs-review'], ['unknown', 'needs-review'],
  [undefined, 'needs-review'], [null, 'needs-review'], ['pass', 'pass'], ['fail', 'fail'],
]) {
  const field = adaptScanResponse({ fields: [{ fieldName: 'manufacturer',
    status: 'pass', ruleStatus, reason: 'Engine reason' }] }).fields[0];
  assert.equal(fieldDisplayStatus(field.ruleStatus), expected);
  assert.equal(field.reason, 'Engine reason');
}
console.log('PASS: exempt, warning, visual verification and unknown ruleStatus preserve safe display and reason');
