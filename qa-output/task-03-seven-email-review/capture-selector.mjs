import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const shotDir = join(root, 'screenshots');
mkdirSync(shotDir, { recursive: true });
const PREVIEW = process.env.PREVIEW_URL || 'http://localhost:4173/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto(PREVIEW, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.querySelectorAll('#emailSelect option').length >= 7, null, {
  timeout: 15000,
});

const options = await page.$$eval('#emailSelect option', (opts) =>
  opts.map((o) => ({ value: o.value, label: o.textContent.trim() }))
);
writeFileSync(join(root, 'selector-options.json'), JSON.stringify(options, null, 2), 'utf8');
await page.screenshot({ path: join(shotDir, 'preview-selector-default.png'), fullPage: true });

for (const opt of options) {
  await page.selectOption('#emailSelect', opt.value);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(shotDir, `preview-app-${opt.value}.png`),
    fullPage: true,
  });
}

await browser.close();
console.log(JSON.stringify(options, null, 2));
