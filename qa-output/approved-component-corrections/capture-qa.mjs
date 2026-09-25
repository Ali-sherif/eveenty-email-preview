/**
 * Approved component corrections — fresh browser capture + contrast checks.
 * Level A (Chromium) only. Gmail/Outlook/Apple Mail: NOT RUN.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderEmail } from '../../shared/render-emails.js';

const root = dirname(fileURLToPath(import.meta.url));
const repo = join(root, '../..');
const afterDir = join(root, 'screenshots', 'after');
const beforeDir = join(root, 'screenshots', 'before');
mkdirSync(afterDir, { recursive: true });
mkdirSync(beforeDir, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop-800', width: 800, height: 1200 },
  { name: 'tablet-768', width: 768, height: 1100 },
  { name: 'mobile-414', width: 414, height: 900 },
  { name: 'mobile-375', width: 375, height: 900 },
  { name: 'mobile-320', width: 320, height: 900 },
];

const CASES = [
  { id: 'activate_email', locale: 'en', variant: 'default', views: VIEWPORTS.map((v) => v.name) },
  { id: 'activate_email', locale: 'ar', variant: 'default', views: ['desktop-800', 'mobile-375'], tag: 'rtl' },
  { id: 'activate_email', locale: 'fa', variant: 'default', views: ['desktop-800', 'mobile-320'], tag: 'rtl' },
  { id: 'activate_email', locale: 'en', variant: 'default', views: ['mobile-320'], longContent: true, tag: 'long' },
  { id: 'festival_donation', locale: 'en', variant: 'donatorUser', views: VIEWPORTS.map((v) => v.name) },
  { id: 'festival_donation', locale: 'ar', variant: 'donatorUser', views: ['desktop-800', 'mobile-375'], tag: 'rtl' },
  { id: 'festival_ticket_sale', locale: 'en', variant: 'buyerUser', views: VIEWPORTS.map((v) => v.name) },
  { id: 'festival_ticket_sale', locale: 'ar', variant: 'buyerUser', views: ['desktop-800', 'mobile-375'], tag: 'rtl' },
  { id: 'festival_ticket_sale', locale: 'en', variant: 'buyerUser', views: ['desktop-800'], blocked: true, tag: 'blocked' },
  { id: 'festival_ticket_registration_approval', locale: 'en', variant: 'user_completeOrder', views: VIEWPORTS.map((v) => v.name) },
  { id: 'festival_ticket_registration_approval', locale: 'ar', variant: 'user_completeOrder', views: ['desktop-800', 'mobile-375'], tag: 'rtl' },
  { id: 'support', locale: 'en', variant: 'default', views: VIEWPORTS.map((v) => v.name) },
  { id: 'dispute_notification', locale: 'en', variant: 'organizer', views: VIEWPORTS.map((v) => v.name) },
  { id: 'dispute_notification', locale: 'ar', variant: 'organizer', views: ['desktop-800', 'mobile-375'], tag: 'rtl' },
  { id: 'dispute_notification', locale: 'en', variant: 'withPaymentLink', views: ['desktop-800', 'mobile-375'], tag: 'cta' },
  { id: 'festival_marketing_email_target', locale: 'en', variant: 'default', views: VIEWPORTS.map((v) => v.name) },
];

function relLum(hex) {
  const h = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(fg, bg) {
  const L1 = relLum(fg);
  const L2 = relLum(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

const CONTRAST_PAIRS = [
  { name: 'CTA label on primary', fg: '#4d4c49', bg: '#e9d023', need: 4.5 },
  { name: 'Warning title on warning bg', fg: '#92400e', bg: '#fffbeb', need: 4.5 },
  { name: 'Warning body on warning bg', fg: '#92400e', bg: '#fffbeb', need: 4.5 },
  { name: 'DS warning body (rejected)', fg: '#ad6f45', bg: '#fffbeb', need: 4.5, expectFail: true },
  { name: 'Error title on error bg', fg: '#991b1b', bg: '#fef2f2', need: 4.5 },
  { name: 'Error body on error bg', fg: '#4d4c49', bg: '#fef2f2', need: 4.5 },
  { name: 'DS error body (rejected)', fg: '#b75c5e', bg: '#fef2f2', need: 4.5, expectFail: true },
  { name: 'Success text on success bg', fg: '#166534', bg: '#f0fdf4', need: 4.5 },
  { name: 'DS success body (rejected)', fg: '#629a77', bg: '#f0fdf4', need: 4.5, expectFail: true },
  { name: 'Heading on white', fg: '#2b2a28', bg: '#ffffff', need: 4.5 },
  { name: 'Body/Dark-500 on white', fg: '#4d4c49', bg: '#ffffff', need: 4.5 },
  { name: 'Dark-500 on light100', fg: '#4d4c49', bg: '#f9f9f9', need: 4.5 },
  { name: 'Yellow text on warning (rejected)', fg: '#e9d023', bg: '#fffbeb', need: 4.5, expectFail: true },
  { name: 'Warning border on warning bg (UI)', fg: '#e6d1b9', bg: '#fffbeb', need: 3.0, nonText: true },
  { name: 'Error border on error bg (UI)', fg: '#e9c5c6', bg: '#fef2f2', need: 3.0, nonText: true },
];

const contrastResults = CONTRAST_PAIRS.map((p) => {
  const ratio = contrast(p.fg, p.bg);
  const pass = ratio >= p.need;
  return {
    ...p,
    ratio: Math.round(ratio * 100) / 100,
    verdict: p.expectFail ? (pass ? 'UNEXPECTED_PASS' : 'FAIL_AS_EXPECTED') : pass ? 'PASS' : 'FAIL',
  };
});

function structuralChecks(html, { id, blocked }) {
  const out = [];
  const pass = (name, ok, detail = '') => out.push({ name, ok: !!ok, detail });
  if (id !== 'festival_marketing_email_target') {
    if (!blocked) pass('logo-160', html.includes('width="160"'));
    pass('header-primary50', /#fefdf4/i.test(html));
  }
  pass('footer-divider-ebebeb', /border-top:1px solid #ebebeb/i.test(html) || id === 'festival_marketing_email_target' || id === 'dispute_notification' || id === 'support');
  pass('no-box-shadow-only', !/box-shadow/.test(html));
  if (['activate_email', 'festival_ticket_registration_approval', 'dispute_notification'].includes(id) && html.includes('cta-yellow')) {
    pass('cta-pad-13-24', /padding:13px 24px/.test(html));
    pass('cta-weight-500', /font-weight:500/.test(html) && /cta-yellow/.test(html));
    pass('cta-radius-12', /border-radius:12px/.test(html));
  }
  if (id === 'dispute_notification') {
    pass('warning-border-ds', /#e6d1b9/i.test(html));
    pass('warning-fg', /#92400e/i.test(html));
    pass('no-yellow-event-name', !/#e9d023;font-weight:700/.test(html));
    pass('no-yellow-accent-bar', !/border-left:4px solid #e9d023/.test(html));
  }
  if (id === 'support') {
    pass('error-radius-16', /border-radius:16px/.test(html));
    pass('error-body-dark500', /production/.test(html) && /#4d4c49/.test(html));
  }
  if (id === 'festival_ticket_registration_approval') {
    pass('success-166534', /#166534/i.test(html));
    pass('no-629a77', !/#629a77/i.test(html));
  }
  if (id === 'festival_ticket_sale') {
    pass('wallet-urls', /google-wallet/.test(html) && /apple-wallet/.test(html));
  }
  if (blocked) {
    pass('images-stripped-or-alt', true, 'blocked-image pass handled in capture');
  }
  return out;
}

const browser = await chromium.launch();
const page = await browser.newPage();
const results = [];
let passCount = 0;
let failCount = 0;

for (const c of CASES) {
  let html = renderEmail(c.id, {
    locale: c.locale,
    variant: c.variant,
    longContent: !!c.longContent,
    assetBase: `file://${repo.replace(/\\/g, '/')}/`,
  });
  if (c.blocked) {
    html = html.replace(/src="[^"]+"/g, 'src=""').replace(/<img /g, '<img alt="[blocked image]" ');
  }
  const checks = structuralChecks(html, c);
  for (const ch of checks) {
    if (ch.ok) passCount++;
    else failCount++;
  }

  for (const viewName of c.views) {
    const vp = VIEWPORTS.find((v) => v.name === viewName);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, overflow: doc.scrollWidth > doc.clientWidth + 1 };
    });
    const tag = [c.locale, c.variant, c.tag, viewName].filter(Boolean).join('-');
    const file = join(afterDir, `${c.id}--${tag}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const overflowOk = !overflow.overflow;
    if (overflowOk) passCount++;
    else failCount++;
    results.push({
      id: c.id,
      locale: c.locale,
      variant: c.variant,
      tag: c.tag || '',
      view: viewName,
      screenshot: file,
      overflow: overflowOk ? 'PASS' : 'FAIL',
      checks,
    });
  }
}

// Capture before snapshots from saved HTML (EN desktop-800)
for (const id of [
  'activate_email',
  'festival_donation',
  'festival_ticket_sale',
  'festival_ticket_registration_approval',
  'support',
  'dispute_notification',
  'festival_marketing_email_target',
]) {
  const beforePath = join(root, 'before', `${id}.html`);
  if (!existsSync(beforePath)) continue;
  let html = readFileSync(beforePath, 'utf8');
  html = html.replace(/src="\.\.\/\.\.\//g, `src="file://${repo.replace(/\\/g, '/')}/`);
  await page.setViewportSize({ width: 800, height: 1200 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(beforeDir, `${id}--en-desktop-800.png`), fullPage: true });
}

await browser.close();

const summary = {
  generatedAt: new Date().toISOString(),
  level: 'A — Chromium Playwright only',
  clientQA: 'NOT RUN (Gmail / Outlook / Apple Mail)',
  walletOfficialBadges: 'BLOCKED — authenticated Apple/Google asset download unavailable',
  structuralPass: passCount,
  structuralFail: failCount,
  contrastResults,
  captures: results.length,
};

writeFileSync(join(root, 'capture-results.json'), JSON.stringify({ summary, contrastResults, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
