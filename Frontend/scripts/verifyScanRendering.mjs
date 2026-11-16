import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

// Use the same JSX transform as the app without starting an HTTP server.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: Row } = await server.ssrLoadModule('/src/components/scan/FieldStatusRow.jsx');
  const { default: Font } = await server.ssrLoadModule('/src/components/scan/FontCalibratorBox.jsx');
  for (const status of [undefined, null, '', 'unknown', 'exempt']) {
    const html = renderToStaticMarkup(createElement(Row, { title: 'MRP', status }));
    assert.match(html, />needs-review</);
    assert.doesNotMatch(html, />pass</);
  }
  const missing = renderToStaticMarkup(createElement(Font));
  assert.match(missing, /Measurement unavailable/);
  assert.doesNotMatch(missing, /2\.8|4\.0|330/);
  const measured = renderToStaticMarkup(createElement(Font, { measuredMm: 1.25, reqMinMm: 1.5 }));
  assert.match(measured, /1\.25/);
  assert.match(measured, /1\.5/);
  console.log('PASS: rendered unknown statuses need review; missing font stays unavailable; real measurements render');
} finally {
  await server.close();
}
