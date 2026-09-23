/**
 * Capture desktop (800) + mobile (375) screenshots of each email into screenshots/.
 * Requires: npx playwright (downloads chromium on first run)
 * Run: node capture-screenshots.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { renderEmail } from './shared/render-emails.js';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'screenshots');
mkdirSync(out, { recursive: true });

const emails = [
  { id: 'activate_email', variant: 'default' },
  { id: 'festival_donation', variant: 'donatorUser' },
  { id: 'festival_ticket_sale', variant: 'buyerUser' },
  { id: 'festival_ticket_registration_approval', variant: 'user_completeOrder' },
  { id: 'support', variant: 'default' },
];

const widths = [
  { name: 'desktop-800', width: 840, height: 1200 },
  { name: 'mobile-375', width: 395, height: 900 },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const email of emails) {
  const html = renderEmail(email.id, {
    locale: 'en',
    variant: email.variant,
    assetBase: `file://${root.replace(/\\/g, '/')}/`,
  });
  // file:// asset base for logos
  const wrapped = html.replace(/src="\.\/assets\//g, `src="file://${root.replace(/\\/g, '/')}/assets/`);

  for (const vp of widths) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.setContent(wrapped, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const file = join(out, `${email.id}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('wrote', file);
  }
}

await browser.close();
