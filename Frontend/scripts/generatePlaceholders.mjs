import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_PAGE_META } from '../src/routes/pageMeta.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'pages');

function toExportName(file) {
  return path.basename(file, '.jsx');
}

for (const page of ALL_PAGE_META) {
  const dest = path.join(root, page.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const name = toExportName(page.file);
  const source = `import PlaceholderPage from '../../components/common/PlaceholderPage';

export default function ${name}() {
  return (
    <PlaceholderPage
      title="${page.title.replace(/"/g, '\\"')}"
      route="${page.route}"
      purpose="${page.purpose.replace(/"/g, '\\"').replace(/’/g, "'")}"
    />
  );
}
`;
  fs.writeFileSync(dest, source, 'utf8');
}

console.log(`Wrote ${ALL_PAGE_META.length} placeholder pages`);
