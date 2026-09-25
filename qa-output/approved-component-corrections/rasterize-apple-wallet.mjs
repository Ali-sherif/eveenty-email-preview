/**
 * One-shot: rasterize official Apple Wallet RGB SVGs → PNG for email use.
 * Does not alter artwork; scales uniformly for email delivery.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const srcDir = join(root, 'assets/wallet/official/source/apple');
const outDir = join(root, 'assets/wallet/official/apple');
mkdirSync(outDir, { recursive: true });

const map = {
  en: 'US-UK_Add_to_Apple_Wallet_RGB_101421.svg',
  ar: 'AR_Add_to_Apple_Wallet_RGB_101421.svg',
  fr: 'FR_Add_to_Apple_Wallet_RGB_102921.svg',
  es: 'ES_Add_to_Apple_Wallet_RGB_101921.svg',
};

const browser = await chromium.launch();
const page = await browser.newPage();

for (const [locale, file] of Object.entries(map)) {
  const svg = readFileSync(join(srcDir, file), 'utf8');
  const vb = svg.match(/viewBox="([^"]+)"/i);
  let w = 156;
  let h = 48;
  if (vb) {
    const parts = vb[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      w = parts[2];
      h = parts[3];
    }
  }
  // ~2× retina at ~50px display height
  const scale = 100 / h;
  const outW = Math.round(w * scale);
  const outH = Math.round(h * scale);
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  await page.setViewportSize({ width: outW, height: outH });
  await page.setContent(
    `<!DOCTYPE html><html><head><style>
      html,body{margin:0;padding:0;background:transparent;width:${outW}px;height:${outH}px;overflow:hidden}
      img{display:block;width:${outW}px;height:${outH}px}
    </style></head><body><img src="${dataUri}" alt="" /></body></html>`,
    { waitUntil: 'load' },
  );
  await page.waitForTimeout(150);
  const buf = await page.screenshot({ type: 'png', omitBackground: true });
  const outPath = join(outDir, `${locale}.png`);
  writeFileSync(outPath, buf);
  console.log(`${locale}: viewBox ${w}x${h} → ${outW}x${outH}`);
}

// Persian: no official Apple badge in kit → English fallback (copy, document)
copyFileSync(join(outDir, 'en.png'), join(outDir, 'fa.png'));
console.log('fa: copied from en (no official Persian Apple badge in download)');

await browser.close();
