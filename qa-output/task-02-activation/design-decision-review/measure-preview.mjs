import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const out = 'qa-output/task-02-activation/design-decision-review/screenshots';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
await page.goto('http://localhost:54701/', { waitUntil: 'networkidle' });
const selects = page.locator('select');
await selects.nth(0).selectOption({ value: 'activate_email' }).catch(() => {});
await selects.nth(1).selectOption('en');
await selects.nth(3).selectOption('800');
await page.waitForTimeout(800);

const frame = page.frameLocator('iframe').first();
const data = await frame.locator('body').evaluate(() => {
  const logo = document.querySelector('img');
  const hdr = logo ? logo.closest('td') : null;
  const h1 = document.querySelector('h1');
  const cta = document.querySelector('a.cta-yellow') || document.querySelector('a[href*="activate"]');
  const ctaTd = cta ? cta.closest('td') : null;
  const cs = (el) => (el ? getComputedStyle(el) : null);
  return {
    headerBg: hdr ? cs(hdr).backgroundColor : null,
    headerPad: hdr ? cs(hdr).padding : null,
    logo: logo
      ? {
          displayW: logo.getBoundingClientRect().width,
          displayH: logo.getBoundingClientRect().height,
          naturalW: logo.naturalWidth,
          naturalH: logo.naturalHeight,
          attrW: logo.getAttribute('width'),
        }
      : null,
    h1: h1
      ? {
          weight: cs(h1).fontWeight,
          size: cs(h1).fontSize,
          family: cs(h1).fontFamily,
          color: cs(h1).color,
          text: h1.textContent.trim(),
        }
      : null,
    cta:
      cta && ctaTd
        ? {
            textColor: cs(cta).color,
            weight: cs(cta).fontWeight,
            bg: cs(ctaTd).backgroundColor,
            text: cta.textContent.trim(),
          }
        : null,
  };
});

writeFileSync(
  'qa-output/task-02-activation/design-decision-review/preview-live-measurements.json',
  JSON.stringify(data, null, 2),
);
console.log(JSON.stringify(data, null, 2));

await frame.locator('body').screenshot({ path: `${out}/preview-activation-en-800-email.png` });
await selects.nth(3).selectOption('320');
await page.waitForTimeout(500);
await frame.locator('body').screenshot({ path: `${out}/preview-activation-en-320-email.png` });
await browser.close();
