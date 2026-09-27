import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FINAL7_EMAIL_IDS } from '../../shared/final7-definitions.js';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)));
const screenshotDir = join(outDir, 'screenshots');
const contactSheetDir = join(outDir, 'contact-sheets');
mkdirSync(contactSheetDir, { recursive: true });
const pngDataUrl = (path) => `data:image/png;base64,${readFileSync(path).toString('base64')}`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const viewport of ['desktop-800', 'mobile-320']) {
    const entries = FINAL7_EMAIL_IDS.map(({ id }) => ({ id, src: pngDataUrl(join(screenshotDir, `${id}--${viewport}.png`)) }));
    const cardWidth = viewport === 'desktop-800' ? 330 : 210;
    const columns = viewport === 'desktop-800' ? 2 : 4;
    await page.setViewportSize({ width: columns * (cardWidth + 24) + 24, height: 1000 });
    await page.setContent(`<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;padding:12px;background:#e8e8e8;font:12px Arial,sans-serif}main{display:grid;grid-template-columns:repeat(${columns},${cardWidth}px);gap:12px;align-items:start}figure{margin:0;background:#fff;border:1px solid #bbb;border-radius:5px;overflow:hidden}figcaption{padding:7px 8px;background:#2b2a28;color:#fff;font-weight:700;overflow-wrap:anywhere}img{display:block;width:100%;height:auto}</style></head><body><main>${entries.map(({ id, src }) => `<figure><figcaption>${id}</figcaption><img src="${src}" alt="${id} ${viewport}"></figure>`).join('')}</main></body></html>`, { waitUntil: 'load' });
    await page.screenshot({ path: join(contactSheetDir, `${viewport}.png`), fullPage: true });
  }
} finally { await browser.close(); }
