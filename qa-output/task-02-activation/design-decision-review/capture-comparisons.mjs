/**
 * Task 02 design-decision-review — isolated comparison captures + live preview shots.
 * READ-ONLY for production/source; writes only under design-decision-review/.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = dirname(fileURLToPath(import.meta.url));
const shotDir = join(root, 'screenshots');
mkdirSync(shotDir, { recursive: true });

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://localhost:54701/';
const COMP_URL = `file:///${join(root, 'comparisons.html').replace(/\\/g, '/')}`;

function contrastRatio(hex1, hex2) {
  const lum = (hex) => {
    const n = hex.replace('#', '');
    const r = parseInt(n.slice(0, 2), 16) / 255;
    const g = parseInt(n.slice(2, 4), 16) / 255;
    const b = parseInt(n.slice(4, 6), 16) / 255;
    const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const L1 = lum(hex1);
  const L2 = lum(hex2);
  const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const measurements = {
  testedAt: new Date().toISOString(),
  previewUrl: PREVIEW_URL,
  contrasts: {
    whiteOnMagenta: contrastRatio('#FFFFFF', '#D80073'),
    darkOnYellow: contrastRatio('#4D4C49', '#E9D023'),
    headingOnWhite: contrastRatio('#2B2A28', '#FFFFFF'),
  },
  logoSizes: {},
  preview: {},
  shots: [],
};

// --- Isolated comparisons ---
await page.goto(COMP_URL, { waitUntil: 'networkidle' });

const regions = [
  ['cta-magenta', 'compare-cta-magenta.png'],
  ['cta-yellow', 'compare-cta-yellow.png'],
  ['logo-120', 'compare-logo-120-desktop.png'],
  ['logo-160', 'compare-logo-160-desktop.png'],
  ['logo-200', 'compare-logo-200-desktop.png'],
  ['logo-120-m', 'compare-logo-120-mobile320.png'],
  ['logo-160-m', 'compare-logo-160-mobile320.png'],
  ['logo-200-m', 'compare-logo-200-mobile320.png'],
  ['hdr-primary50', 'compare-header-primary50.png'],
  ['hdr-white', 'compare-header-white.png'],
  ['hdr-legacy', 'compare-header-legacy-fcf9df.png'],
  ['weight-600', 'compare-heading-weight-600.png'],
  ['weight-700', 'compare-heading-weight-700.png'],
  ['logo-locales', 'compare-logo-locales-200.png'],
];

for (const [id, file] of regions) {
  const el = page.locator(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  const path = join(shotDir, file);
  await el.screenshot({ path });
  measurements.shots.push(path);
}

for (const w of [120, 160, 200]) {
  const box = await page.locator(`#img-${w}`).boundingBox();
  const hdr = await page.locator(`#logo-${w} .hdr`).boundingBox();
  measurements.logoSizes[`w${w}`] = {
    img: box,
    headerBand: hdr,
    headerHeightPx: hdr ? Math.round(hdr.height * 100) / 100 : null,
    imgHeightPx: box ? Math.round(box.height * 100) / 100 : null,
  };
}

await page.screenshot({ path: join(shotDir, 'compare-full-page.png'), fullPage: true });
measurements.shots.push(join(shotDir, 'compare-full-page.png'));

// --- Live preview Activation EN @ 800 ---
await page.setViewportSize({ width: 900, height: 1100 });
await page.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
await page.selectOption('#emailSelect', 'activate_email').catch(() => {});
await page.selectOption('select[name="email"], #templateSelect, #emailSelect', 'activate_email').catch(() => {});
// Try common control ids from prior capture
const emailSel = page.locator('select').nth(0);
const localeSel = page.locator('select').nth(1);
const viewportSel = page.locator('select').nth(3);
await emailSel.selectOption({ label: /activate_email/i }).catch(async () => {
  await emailSel.selectOption('activate_email').catch(() => {});
});
await localeSel.selectOption('en').catch(() => {});
await viewportSel.selectOption('800').catch(() => {});
await page.waitForTimeout(500);

const stage = page.locator('#emailStage, .email-stage, iframe, [data-email-stage]').first();
const container = page.locator('.email-container, #emailContainer, table[role="presentation"]').first();

// Prefer measuring inside iframe if present
let frame = page.frameLocator('iframe').first();
let hasIframe = false;
try {
  await frame.locator('body').waitFor({ timeout: 1500 });
  hasIframe = true;
} catch {
  hasIframe = false;
}

const ctx = hasIframe ? frame : page;
const logo = ctx.locator('img[alt*="Eveenty"], img[src*="logo"]').first();
const h1 = ctx.locator('h1').first();
const cta = ctx.locator('a.cta-yellow, a[href*="activate"]').first();
const headerTd = ctx.locator('td').filter({ has: logo }).first();

const logoBox = await logo.boundingBox().catch(() => null);
const h1Styles = await h1.evaluate((el) => {
  const s = getComputedStyle(el);
  return { fontWeight: s.fontWeight, fontSize: s.fontSize, fontFamily: s.fontFamily, color: s.color };
}).catch(() => null);
const ctaStyles = await cta.evaluate((el) => {
  const s = getComputedStyle(el);
  const parent = el.parentElement ? getComputedStyle(el.parentElement) : null;
  return {
    color: s.color,
    fontWeight: s.fontWeight,
    bgSelf: s.backgroundColor,
    bgParent: parent ? parent.backgroundColor : null,
  };
}).catch(() => null);
const headerBg = await headerTd.evaluate((el) => getComputedStyle(el).backgroundColor).catch(() => null);

measurements.preview = {
  hasIframe,
  logoBox,
  h1Styles,
  ctaStyles,
  headerBg,
};

await page.screenshot({ path: join(shotDir, 'preview-activation-en-800-fullui.png'), fullPage: true });
const stageEl = page.locator('#stage, .stage, .preview-stage, main').first();
if (await stageEl.count()) {
  await stageEl.screenshot({ path: join(shotDir, 'preview-activation-en-800-stage.png') }).catch(() => {});
}
// Also capture email root if measurable
const emailRoot = hasIframe
  ? page.locator('iframe').first()
  : page.locator('table[style*="max-width: 600"]').first();
if (await emailRoot.count()) {
  await emailRoot.screenshot({ path: join(shotDir, 'preview-activation-en-800-email.png') }).catch(() => {});
}

writeFileSync(join(root, 'comparison-measurements.json'), JSON.stringify(measurements, null, 2));
console.log(JSON.stringify(measurements, null, 2));
await browser.close();
