import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: client } = await server.ssrLoadModule('/src/services/apiClient.js');
  const { scanService } = await server.ssrLoadModule('/src/services/scanService.js');
  // Test-only token stays in memory. No network request or report upload occurs.
  globalThis.localStorage = { getItem: () => 'test-only-token' };
  let requests = 0;
  client.defaults.adapter = async (config) => {
    requests++;
    assert.equal(config.headers.Authorization, 'Bearer test-only-token');
    assert.equal(config.url, '/scans/0123456789abcdef01234567/report?format=pdf');
    return { data: { data: { fileUrl: 'https://example.com/report.pdf' } }, status: 200, headers: {}, config };
  };
  assert.equal(await scanService.getReportFile('0123456789abcdef01234567'), 'https://example.com/report.pdf');
  await assert.rejects(scanService.getReportFile(undefined), /Valid scan ID/);
  assert.equal(requests, 1);
  console.log('PASS: report request includes auth, returns file URL, and blocks undefined IDs');
} finally { await server.close(); }
