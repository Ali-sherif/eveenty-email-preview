/**
 * Build side-by-side Figma vs browser comparison PNGs.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, 'comparisons');
mkdirSync(outDir, { recursive: true });

const pairs = [
  { id: 'en-desktop-800', figma: 'figma/activate-en-desktop-800.png', browser: 'screenshots/desktop-en-800-email.png' },
  { id: 'fr-desktop-800', figma: 'figma/activate-fr-desktop-800.png', browser: 'screenshots/desktop-fr-800-email.png' },
  { id: 'es-desktop-800', figma: 'figma/activate-es-desktop-800.png', browser: 'screenshots/desktop-es-800-email.png' },
  { id: 'ar-desktop-800', figma: 'figma/activate-ar-desktop-800.png', browser: 'screenshots/desktop-ar-800-email.png' },
  { id: 'fa-desktop-800', figma: 'figma/activate-fa-desktop-800.png', browser: 'screenshots/desktop-fa-800-email.png' },
  { id: 'en-mobile-320', figma: 'figma/activate-en-mobile-320.png', browser: 'screenshots/mobile-en-320-email.png' },
  { id: 'ar-mobile-375', figma: 'figma/activate-ar-mobile-375.png', browser: 'screenshots/mobile-ar-375-email.png' },
  { id: 'fa-mobile-320', figma: 'figma/activate-fa-mobile-320.png', browser: 'screenshots/mobile-fa-320-email.png' },
];

function toDataUri(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) throw new Error('missing ' + p);
  const b = readFileSync(p);
  return 'data:image/png;base64,' + b.toString('base64');
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 1 });

for (const pair of pairs) {
  const left = toDataUri(pair.figma);
  const right = toDataUri(pair.browser);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;font-family:Segoe UI,Arial,sans-serif;background:#f0f0f0;color:#2b2a28}
    .wrap{display:flex;gap:16px;padding:16px;align-items:flex-start}
    .col{flex:1;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden}
    .label{padding:10px 12px;font-size:13px;font-weight:600;background:#fefdf4;border-bottom:1px solid #e5e5e5}
    img{display:block;width:100%;height:auto}
  </style></head><body>
  <div class="wrap">
    <div class="col"><div class="label">Figma — ${pair.id}</div><img src="${left}" /></div>
    <div class="col"><div class="label">Browser preview — ${pair.id}</div><img src="${right}" /></div>
  </div></body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  const out = join(outDir, `compare-${pair.id}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log('wrote', out);
}

await browser.close();
writeFileSync(join(outDir, 'index.json'), JSON.stringify({ pairs, generatedAt: new Date().toISOString() }, null, 2));
