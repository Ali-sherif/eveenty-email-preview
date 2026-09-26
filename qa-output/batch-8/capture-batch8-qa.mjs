/** Owner-authorized eight-template batch — fresh Level A QA. */
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTraceabilityIndex } from '../../.agents/scripts/lib/catalog.mjs';
import { BATCH8_EMAIL_IDS } from '../../shared/batch8-definitions.js';
import { renderEmail } from '../../shared/render-emails.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const backendRoot = resolve(root, '..', 'rescounts-backend');
const outDir = join(root, 'qa-output', 'batch-8');
const shotDir = join(outDir, 'screenshots');
const rtlDir = join(shotDir, 'rtl');
mkdirSync(rtlDir, { recursive: true });
const widths = Object.freeze([800, 768, 414, 375, 320]);
const expectedIds = Object.freeze(['festival_add_on_sale', 'festival_activity_sale', 'festival_sponsor_sale', 'festival_sales', 'festival_vendor_sale', 'organizer_festival_marketing_email_receipt', 'organizer_festival_marketing_sms_receipt', 'festival_rescounts_marketing_email_target']);
if (BATCH8_EMAIL_IDS.length !== 8 || JSON.stringify(BATCH8_EMAIL_IDS.map(({ id }) => id)) !== JSON.stringify(expectedIds)) throw new Error('QA scope differs from the locked eight IDs');

const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
function startServer() {
  const server = createServer((request, response) => {
    const relative = decodeURIComponent((request.url || '/').split('?')[0]).replace(/^\/+/, '');
    const file = resolve(root, relative);
    if (!file.startsWith(`${root}\\`) || !existsSync(file)) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream' });
    response.end(readFileSync(file));
  });
  return new Promise((done) => server.listen(0, '127.0.0.1', () => done({ server, origin: `http://127.0.0.1:${server.address().port}/` })));
}
function localesFor(definition, variant) { return definition.variantLocales?.[variant] || definition.locales; }
function structural(definition, locale, variant, html) {
  const checks = [];
  const add = (name, ok, detail = '') => checks.push({ name, status: ok ? 'PASS' : 'FAIL', detail });
  const bytes = Buffer.byteLength(html, 'utf8');
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map((match) => match[1]);
  const unsafe = hrefs.find((href) => {
    if (/^(mailto:|tel:|#|\.\.?\/)/.test(href)) return false;
    try { return !['example.com', '127.0.0.1'].includes(new URL(href).hostname); } catch { return true; }
  });
  add('html-under-102kb', bytes < 102 * 1024, `${bytes} bytes`);
  add('table-layout', /<table role="presentation"/i.test(html));
  add('max-width-600', /max-width:600px/i.test(html));
  add('approved-header', /#fefdf4/i.test(html) || definition.master === 'MARKETING');
  add('approved-body', /#4d4c49/i.test(html));
  add('approved-divider', /#ebebeb/i.test(html));
  add('no-template-placeholders', !/\{\{\s*\.[A-Za-z0-9_]+/.test(html));
  add('no-forbidden-elements', !/<(?:script|form|iframe|video|audio|link)\b/i.test(html));
  add('no-unsafe-css', !/\b(?:display:flex|display:grid|gap:|object-fit:|position:fixed|calc\(|var\()/.test(html));
  add('no-base64-or-svg-images', !images.some((attributes) => /src=["'](?:data:|[^"']+\.svg)/i.test(attributes)));
  add('image-dimensions-and-alt', images.every((attributes) => /\bwidth=["']?\d+/i.test(attributes) && /\bheight=["']?\d+/i.test(attributes) && /\balt=["'][^"']+["']/i.test(attributes)), `${images.length} images`);
  add('safe-preview-hrefs', !unsafe, unsafe || `${hrefs.length} checked`);
  add('lang', new RegExp(`<html lang="${locale}"`, 'i').test(html));
  add('dir', new RegExp(`<html[^>]+dir="${['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr'}"`, 'i').test(html));
  if (definition.id === 'festival_rescounts_marketing_email_target') {
    add('author-content-escaped', !/<sample(?:\s|>)/i.test(html));
    add('inert-unsubscribe', html.includes('https://example.com/preview/unsubscribe'));
  }
  if (definition.id === 'festival_add_on_sale' || definition.id === 'festival_activity_sale' || definition.id === 'festival_vendor_sale') add('synthetic-qr-raster', /qr-sample\.png/i.test(html));
  return { id: definition.id, locale, variant, bytes, checks, failCount: checks.filter(({ status }) => status === 'FAIL').length };
}
function blocked(html) { return html.replace(/(<img\b[^>]*?)\bsrc=(?:"[^"]*"|'[^']*')/gi, '$1src="about:blank#blocked"'); }
async function measure(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const bad = [...document.querySelectorAll('body *')].filter((element) => {
      const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && (rect.left < -1 || rect.right > width + 1);
    }).slice(0, 5).map((element) => ({ tag: element.tagName, className: element.className || '', left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right) }));
    return { dir: document.documentElement.dir, scrollWidth: document.documentElement.scrollWidth, clientWidth: width, documentOverflow: document.documentElement.scrollWidth > width + 1, elementOverflow: bad.length > 0, overflowingElements: bad };
  });
}
function luminance(hex) { const rgb = [0, 2, 4].map((index) => { const c = Number.parseInt(hex.slice(1 + index, 3 + index), 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; }
function ratio(a, b) { const x = luminance(a); const y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const contrast = [['heading/white', '#2b2a28', '#ffffff'], ['body/white', '#4d4c49', '#ffffff'], ['success', '#166534', '#f0fdf4'], ['error-title', '#991b1b', '#fef2f2'], ['error-body', '#4d4c49', '#fef2f2'], ['warning', '#92400e', '#fffbeb'], ['cta', '#4d4c49', '#e9d023'], ['marketing-footer', '#ffffff', '#4d4c49']].map(([name, fg, bg]) => ({ name, foreground: fg, background: bg, ratio: Number(ratio(fg, bg).toFixed(2)), status: ratio(fg, bg) >= 4.5 ? 'PASS' : 'FAIL' }));

const catalog = JSON.parse(readFileSync(join(root, 'catalog', 'email-catalog.json'), 'utf8'));
const trace = loadTraceabilityIndex();
const catalogChecks = { physical: catalog.emails.length, excluded: catalog.emails.filter((x) => x.scope === 'EXCLUDED').length, inScope: catalog.emails.filter((x) => x.scope === 'IN_SCOPE').length, designed: catalog.emails.filter((x) => x.design_status === 'DESIGNED').length, undesigned: catalog.emails.filter((x) => x.scope === 'IN_SCOPE' && x.design_status === 'UNDESIGNED').length, exactBatch: expectedIds.every((id) => { const x = catalog.emails.find((email) => email.id === id); return x?.design_status === 'DESIGNED' && x.preview === `emails/${id}.html` && x.preview_selectable === true && existsSync(join(root, x.preview)); }) };
const traceability = expectedIds.map((id) => { const c = catalog.emails.find((x) => x.id === id); const t = trace.get(id); const source = c ? resolve(backendRoot, c.production_path) : ''; const ok = Boolean(c && t && t.phase1_scope_status === 'IN_SCOPE' && t.current_design_status === 'DESIGNED' && t.preview_reference === `emails/${id}.html` && existsSync(source)); return { id, status: ok ? 'PASS' : 'FAIL', source }; });

const { server, origin } = await startServer();
const staticAudits = [];
for (const definition of BATCH8_EMAIL_IDS) for (const variant of definition.variants) for (const locale of localesFor(definition, variant)) staticAudits.push(structural(definition, locale, variant, renderEmail(definition.id, { locale, variant, assetBase: origin })));

const financialCases = [
  ['festival_add_on_sale', 'user', ['CA$80.00', 'CA$2.50', 'CA$10.40', 'CA$1.75', 'CA$128.65']],
  ['festival_activity_sale', 'user', ['CA$80.00', 'CA$2.50', 'CA$10.40', 'CA$1.75', 'CA$92.90']],
  ['festival_sponsor_sale', 'sponsorApproved', ['CA$1,200.00', 'CA$180.00', 'CA$1,397.65']],
  ['festival_sales', 'vendorApproved', ['CA$1,200.00', 'CA$180.00', 'CA$1,397.65']],
  ['festival_vendor_sale', 'buyer', ['CA$48.00', 'CA$32.00', 'CA$94.65']],
];
const financialFixtures = financialCases.map(([id, variant, required]) => { const html = renderEmail(id, { locale: 'en', variant, assetBase: origin }); const missing = required.filter((value) => !html.includes(value)); return { id, variant, required, missing, status: missing.length ? 'FAIL' : 'PASS' }; });
const conditionChecks = [
  { id: 'festival_add_on_sale', status: !renderEmail('festival_add_on_sale', { locale: 'en', variant: 'userNoSummary', assetBase: origin }).includes('CA$128.65') ? 'PASS' : 'FAIL', detail: 'summary omitted' },
  { id: 'festival_sponsor_sale', status: !renderEmail('festival_sponsor_sale', { locale: 'en', variant: 'organizerApproved', assetBase: origin }).includes('CA$2.50') ? 'PASS' : 'FAIL', detail: 'organizer processing fees omitted' },
  { id: 'festival_sales', status: renderEmail('festival_sales', { locale: 'en', variant: 'vendorRejected', assetBase: origin }).includes('synthetic preview note') ? 'PASS' : 'FAIL', detail: 'rejection note present' },
  { id: 'festival_rescounts_marketing_email_target', status: !renderEmail('festival_rescounts_marketing_email_target', { locale: 'en', variant: 'bodyOnly', assetBase: origin }).includes('festival-logo-sample.png') ? 'PASS' : 'FAIL', detail: 'optional logo omitted' },
];

const browser = await chromium.launch(); const page = await browser.newPage();
await page.route('https://example.com/**', (route) => route.fulfill({ status: 204, body: '' }));
const responsive = []; const stress = []; const blockedImages = []; const screenshots = []; const rtlVisual = [];
try {
  for (const definition of BATCH8_EMAIL_IDS) {
    const variant = definition.variants[0]; const allowed = localesFor(definition, variant); const locales = allowed.includes('ar') ? ['en', 'ar'] : ['en'];
    for (const locale of locales) for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 }); await page.setContent(renderEmail(definition.id, { locale, variant, assetBase: origin }), { waitUntil: 'load' });
      const result = await measure(page); responsive.push({ id: definition.id, locale, variant, width, status: !result.documentOverflow && !result.elementOverflow ? 'PASS' : 'FAIL', ...result });
      if (locale === 'en' && [800, 320].includes(width)) { const name = `${definition.id}--${width === 800 ? 'desktop-800' : 'mobile-320'}.png`; await page.screenshot({ path: join(shotDir, name), fullPage: true }); screenshots.push(`screenshots/${name}`); }
    }
    await page.setViewportSize({ width: 320, height: 1000 }); await page.setContent(renderEmail(definition.id, { locale: 'en', variant, longContent: true, assetBase: origin })); const long = await measure(page); stress.push({ id: definition.id, width: 320, status: !long.documentOverflow && !long.elementOverflow ? 'PASS' : 'FAIL', ...long });
    await page.setContent(blocked(renderEmail(definition.id, { locale: 'en', variant, assetBase: origin }))); const off = await measure(page); blockedImages.push({ id: definition.id, width: 320, status: !off.documentOverflow && !off.elementOverflow ? 'PASS' : 'FAIL', ...off });
  }
  for (const test of [{ id: 'festival_add_on_sale', variant: 'user' }, { id: 'festival_sponsor_sale', variant: 'sponsorApproved' }, { id: 'festival_vendor_sale', variant: 'buyer' }]) for (const locale of ['ar', 'fa']) for (const width of [800, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await page.setContent(renderEmail(test.id, { locale, variant: test.variant, assetBase: origin })); const result = await measure(page); const name = `${test.id}--${locale}--${width === 800 ? 'desktop-800' : 'mobile-320'}.png`; await page.screenshot({ path: join(rtlDir, name), fullPage: true }); rtlVisual.push({ ...test, locale, width, screenshot: `screenshots/rtl/${name}`, status: result.dir === 'rtl' && !result.documentOverflow && !result.elementOverflow ? 'PASS' : 'FAIL', ...result });
  }
} finally { await browser.close(); server.close(); }

const summaries = {
  structural: { renders: staticAudits.length, failedRenders: staticAudits.filter((x) => x.failCount).length, failedChecks: staticAudits.reduce((n, x) => n + x.failCount, 0) },
  responsive: { checks: responsive.length, failed: responsive.filter((x) => x.status === 'FAIL').length },
  stress: { checks: stress.length, failed: stress.filter((x) => x.status === 'FAIL').length },
  blockedImages: { checks: blockedImages.length, failed: blockedImages.filter((x) => x.status === 'FAIL').length },
  rtlVisual: { checks: rtlVisual.length, failed: rtlVisual.filter((x) => x.status === 'FAIL').length },
  traceability: { checks: traceability.length, failed: traceability.filter((x) => x.status === 'FAIL').length },
  financialFixtures: { checks: financialFixtures.length, failed: financialFixtures.filter((x) => x.status === 'FAIL').length },
  conditions: { checks: conditionChecks.length, failed: conditionChecks.filter((x) => x.status === 'FAIL').length },
};
const report = { generatedAt: new Date().toISOString(), scope: 'Exact owner-authorized eight-template HTML Preview batch', widths, catalogChecks, summaries, contrast, screenshots, staticAudits, responsive, stress, blockedImages, rtlVisual, traceability, financialFixtures, conditionChecks, levelB: { gmail: 'NOT RUN', outlook: 'NOT RUN', appleMail: 'NOT RUN' } };
writeFileSync(join(outDir, 'batch8-qa-results.json'), `${JSON.stringify(report, null, 2)}\n`);
const failed = !catalogChecks.exactBatch || catalogChecks.physical !== 59 || catalogChecks.excluded !== 11 || catalogChecks.inScope !== 48 || catalogChecks.designed !== 41 || catalogChecks.undesigned !== 7 || Object.values(summaries).some((x) => (x.failed || x.failedChecks || x.failedRenders) > 0) || contrast.some((x) => x.status === 'FAIL');
console.log(JSON.stringify({ catalogChecks, summaries, contrast, screenshots: screenshots.length, rtlScreenshots: rtlVisual.length, status: failed ? 'FAIL' : 'PASS' }, null, 2));
process.exit(failed ? 1 : 0);
