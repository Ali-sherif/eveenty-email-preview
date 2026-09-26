import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BATCH20_EMAIL_IDS } from '../../shared/batch20-definitions.js';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)));
const screenshotDir = join(outDir, 'screenshots');
const contactSheetDir = join(outDir, 'contact-sheets');
mkdirSync(contactSheetDir, { recursive: true });

function pngDataUrl(path) {
  return `data:image/png;base64,${readFileSync(path).toString('base64')}`;
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const viewport of ['desktop-800', 'mobile-320']) {
    const entries = BATCH20_EMAIL_IDS.map(({ id }) => ({
      id,
      src: pngDataUrl(join(screenshotDir, `${id}--${viewport}.png`)),
    }));
    for (let offset = 0; offset < entries.length; offset += 10) {
      const group = entries.slice(offset, offset + 10);
      const cardWidth = viewport === 'desktop-800' ? 250 : 190;
      const columns = viewport === 'desktop-800' ? 2 : 5;
      const cards = group.map(({ id, src }) => `
        <figure>
          <figcaption>${id}</figcaption>
          <img src="${src}" alt="${id} ${viewport}" />
        </figure>`).join('');
      await page.setViewportSize({ width: columns * (cardWidth + 24) + 24, height: 1000 });
      await page.setContent(`<!doctype html><html><head><style>
        *{box-sizing:border-box}body{margin:0;padding:12px;background:#e8e8e8;font:12px Arial,sans-serif}
        main{display:grid;grid-template-columns:repeat(${columns},${cardWidth}px);gap:12px;align-items:start}
        figure{margin:0;background:#fff;border:1px solid #bbb;border-radius:5px;overflow:hidden}
        figcaption{padding:7px 8px;background:#2b2a28;color:#fff;font-weight:700;overflow-wrap:anywhere}
        img{display:block;width:100%;height:auto}
      </style></head><body><main>${cards}</main></body></html>`, { waitUntil: 'load' });
      const part = (offset / 10) + 1;
      await page.screenshot({
        path: join(contactSheetDir, `${viewport}-part-${part}.png`),
        fullPage: true,
      });
    }
  }
} finally {
  await browser.close();
}
