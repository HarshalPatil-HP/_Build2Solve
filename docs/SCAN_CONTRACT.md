# Scan API contract

Status: proposed compatibility contract for `POST /api/scans` and
`GET /api/scans/:id`. This document does not change the rule engine.

## Canonical response

Both endpoints should return the same scan-result object inside the existing API
envelope (`{ statusCode, data, message, success }`). `data` should contain:

```json
{
  "scanId": "MongoDB ObjectId string",
  "isLabel": true,
  "unreadable": false,
  "overallStatus": "compliant | non-compliant | needs-review",
  "images": [
    {
      "url": "https://...",
      "imageIndex": 0,
      "width": 460,
      "height": 1024
    }
  ],
  "fields": [
    {
      "fieldName": "mrp",
      "value": "Rs 36.00",
      "status": "pass | fail | needs-review",
      "confidence": 62.5,
      "box": { "x": 144, "y": 104, "width": 27, "height": 10 },
      "imageIndex": 0,
      "ruleRef": "Rule 6(e)"
    }
  ]
}
```

`url` may be `null` while an upload has not produced a public URL. `box` is
`null` when there is no reliable field location. `imageIndex` is zero-based.
`status` must use the exact hyphenated values shown above.

## Current-to-contract mapping

| Contract field | Current backend source | Mapping / compatibility note |
|---|---|---|
| `scanId` | `scan._id` | Add `scanId: scan._id.toString()`; retain `_id` and `id`. |
| `isLabel` | none | New gate decision. `false` when the request is rejected for low OCR evidence. |
| `unreadable` | none | New gate decision. `true` when OCR text, blocks, or confidence are below the named threshold. |
| `overallStatus` | `scan.overallStatus` | Keep current enum spelling; do not convert to UI-only aliases. |
| `images[]` | `scan.imageUrls` | Map each URL to `{url, imageIndex, width, height}`. Keep `imageUrls`. |
| `fields[].fieldName` | `scan.analysis.fields[].fieldName` | Copy unchanged. |
| `fields[].value` | `scan.analysis.fields[].value` | Copy unchanged; may be null. |
| `fields[].status` | `scan.analysis.fields[].status` | Copy unchanged; allowed contract values only. |
| `fields[].confidence` | `extracted.fieldConfidence[fieldName]` | Add at response construction; Rule Engine does not currently attach it to each result. |
| `fields[].box` | `extracted.matchedBlocks[fieldName]` | Map word box to `{x,y,width,height}` or null. |
| `fields[].imageIndex` | matched block `imageIndex` | Use matched block index; null if no box. |
| `fields[].ruleRef` | `scan.analysis.fields[].ruleReference` | Rename only in the new top-level list; retain old nested field. |

The current persisted scan stores `analysis.fields`, `analysis.estimatedValues`,
`analysis.exemptionsApplied`, `extractedFields`, `imageUrls`,
`supplementaryMetadata`, `ocrRawText`, and `overallStatus`. These old fields
should remain during migration so existing pages and reports do not break.

## Frontend readers of the old shape

| File:line | Current read | Contract migration impact |
|---|---|---|
| `Frontend/src/pages/scan/ScanResultPage.jsx:15-31` | receives/loads old scan object | Can pass `data` directly once the API keeps compatibility fields. |
| `Frontend/src/components/scan/ScanResultCard.jsx:14-26` | `_id`, `overallStatus`, `images`, `analysis.fields`, `supplementaryMetadata` | Must eventually read `scanId`, `images`, and contract `fields[]`; currently treats old fields array as an object. |
| `Frontend/src/components/scan/ScanResultCard.jsx:219-223` | nonexistent `analysis.pdpAreaCm2`, `requiredFontMm`, `measuredFontMm`, `fontIsEstimated` | Must derive the Rule 7 row from contract `fields[]`; no fallback measurement. |
| `Frontend/src/components/scan/ScanResultCard.jsx:254` | `overallStatus === 'non_compliant'` | Backend uses `non-compliant`; normalize in one client adapter later. |
| `Frontend/src/pages/shared/HistoryPage.jsx:147,166` | `imageUrls`, `overallStatus` | Old fields remain during migration. |
| `Frontend/src/pages/company/CompanyDashboardPage.jsx:25,116-127` | `overallStatus`, `imageUrls` | Old fields remain during migration. |
| `Frontend/src/pages/user/UserDashboardPage.jsx:109` | `overallStatus` | Old field remains during migration. |

## Gate response

For a rejected input, return HTTP 422 with an API error code such as
`UNREADABLE_OR_NON_LABEL_IMAGE`. The success contract above does not apply
because no scan should be persisted. The error should identify the image index
and say that a clear packaged-product label is required; it must not claim a
legal compliance result.

## Design notes

OPINION: add a client-side adapter only after the backend emits this contract,
then remove old-shape reads in one focused frontend task. Keeping both response
shapes temporarily is safer for the viva than changing the frontend and backend
at once.
