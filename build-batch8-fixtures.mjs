import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 220, height: 220 } });
  const svg = readFileSync(join(root, 'assets', 'fixtures', 'qr-sample.svg'), 'utf8');
  await page.setContent(`<style>html,body{margin:0;width:220px;height:220px;overflow:hidden}svg{display:block;width:220px;height:220px}</style>${svg}`);
  await page.screenshot({ path: join(root, 'assets', 'fixtures', 'qr-sample.png'), type: 'png' });
  console.log('generated qr-sample.png');
} finally {
  await browser.close();
}
