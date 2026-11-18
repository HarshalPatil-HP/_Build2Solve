// Normalize API responses in one place. Unknown evidence must never pass.
export function normalizeFieldStatus(status) {
  return status === 'pass' || status === 'fail' ? status : 'needs-review';
}
// Display original rule evidence; never promote a missing rule status to pass.
export function fieldDisplayStatus(ruleStatus) {
  return ruleStatus === 'exempt' ? 'exempt' : normalizeFieldStatus(ruleStatus);
}
export function normalizeOverallStatus(status) {
  const value = typeof status === 'string' ? status.replaceAll('_', '-') : '';
  if (value === 'compliant' || value === 'pass') return 'compliant';
  if (value === 'non-compliant' || value === 'fail') return 'non-compliant';
  return 'needs-review';
}
export function adaptScanResponse(response) {
  const data = response?.data ?? response ?? {};
  const legacy = data.scan ?? data;
  const legacyFields = Array.isArray(legacy.analysis?.fields) ? legacy.analysis.fields : [];
  const fields = Array.isArray(data.fields) ? data.fields : legacyFields;
  return {
    scanId: data.scanId ?? legacy._id ?? legacy.id ?? null,
    overallStatus: normalizeOverallStatus(data.overallStatus ?? legacy.overallStatus),
    category: legacy.productId?.category ?? legacy.category ?? null,
    images: (Array.isArray(data.images) ? data.images : legacy.imageUrls ?? [])
      .map((image, imageIndex) => typeof image === 'string' ? { url: image, imageIndex } : image),
    fields: fields.map(field => ({ ...field, value: field.value ?? null,
      status: normalizeFieldStatus(field.status), ruleStatus: field.ruleStatus ?? null,
      ruleRef: field.ruleRef ?? field.ruleReference ?? null,
      reason: field.reason ?? legacyFields.find(row => row.fieldName === field.fieldName)?.reason ?? null,
    })),
    estimatedValues: legacy.analysis?.estimatedValues ?? data.estimatedValues ?? [],
    supplementaryMetadata: legacy.supplementaryMetadata ?? data.supplementaryMetadata ?? {},
    violations: data.violations ?? [],
  };
}
export function getScanField(fields, fieldName) {
  const field = fields.find(row => row.fieldName === fieldName);
  return { fieldName, value: null, ruleRef: null, ...field, status: normalizeFieldStatus(field?.status) };
}
// Only parse the backend's known font format; never infer millimetres from pixels.
export function getFontMeasurement(field) {
  const match = typeof field?.value === 'string'
    ? field.value.match(/^(\d+(?:\.\d+)?)mm \(min (\d+(?:\.\d+)?)mm\)$/) : null;
  return match ? { measuredMm: Number(match[1]), reqMinMm: Number(match[2]) }
    : { measuredMm: null, reqMinMm: null };
}
export function scanErrorMessage(error) {
  return error?.code === 'UNREADABLE_OR_NON_LABEL_IMAGE'
    ? 'Not enough readable text was found. Upload a clear, well-lit photo of the label and try again.'
    : error?.message || 'Scan failed. Please check your connection and try again.';
}
