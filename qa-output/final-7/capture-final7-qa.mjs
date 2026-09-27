import { chromium } from 'playwright';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTraceabilityIndex } from '../../.agents/scripts/lib/catalog.mjs';
import { FINAL7_EMAIL_IDS } from '../../shared/final7-definitions.js';
import { renderEmail } from '../../shared/render-emails.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const backendRoot = resolve(root, '..', 'rescounts-backend');
const outDir = join(root, 'qa-output', 'final-7');
const shotDir = join(outDir, 'screenshots');
const rtlDir = join(shotDir, 'rtl');
const widths = Object.freeze([800, 768, 414, 375, 320]);
const expectedIds = Object.freeze(['marketing_package_sale', 'festival_payout', 'partner_coupons', 'partner_coupons_partner', 'bad_content_alert', 'book_demo_admin', 'extra_service_request']);
if (JSON.stringify(FINAL7_EMAIL_IDS.map(({ id }) => id)) !== JSON.stringify(expectedIds)) throw new Error('QA scope differs from the locked final seven IDs');

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
  const unsafe = hrefs.find((href) => { if (/^(mailto:|tel:|#|\.\.?\/)/.test(href)) return false; try { return !['example.com', '127.0.0.1'].includes(new URL(href).hostname); } catch { return true; } });
  add('html-under-102kb', bytes < 102 * 1024, `${bytes} bytes`);
  add('table-layout', /<table role="presentation"/i.test(html));
  add('max-width-600', /max-width:600px/i.test(html));
  add('approved-header', /#fefdf4/i.test(html));
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
  const footer = html.match(/This message was sent to <a href="mailto:([^"]*)"[^>]*>([^<]*)<\/a>/i);
  add('footer-recipient-present', Boolean(footer && footer[1] && footer[1] === footer[2] && /@example\.com$/i.test(footer[1])), footer ? footer[1] : 'missing');
  return { id: definition.id, locale, variant, bytes, checks, failCount: checks.filter(({ status }) => status === 'FAIL').length };
}
function blocked(html) { return html.replace(/(<img\b[^>]*?)\bsrc=(?:"[^"]*"|'[^']*')/gi, '$1src="about:blank#blocked"'); }
async function measure(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const bad = [...document.querySelectorAll('body *')].filter((element) => {
      const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && (rect.left < -1 || rect.right > width + 1);
    }).slice(0, 5).map((element) => ({ tag: element.tagName, left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right) }));
    return { dir: document.documentElement.dir, scrollWidth: document.documentElement.scrollWidth, clientWidth: width, documentOverflow: document.documentElement.scrollWidth > width + 1, elementOverflow: bad.length > 0, overflowingElements: bad };
  });
}
function luminance(hex) { const rgb = [0, 2, 4].map((index) => { const c = Number.parseInt(hex.slice(1 + index, 3 + index), 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; }
function ratio(a, b) { const x = luminance(a); const y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const contrast = [['heading', '#2b2a28', '#ffffff'], ['body', '#4d4c49', '#ffffff'], ['success', '#166534', '#f0fdf4'], ['warning', '#92400e', '#fffbeb'], ['cta', '#4d4c49', '#e9d023']].map(([name, foreground, background]) => ({ name, foreground, background, ratio: Number(ratio(foreground, background).toFixed(2)), status: ratio(foreground, background) >= 4.5 ? 'PASS' : 'FAIL' }));

const catalog = JSON.parse(readFileSync(join(root, 'catalog', 'email-catalog.json'), 'utf8'));
const trace = loadTraceabilityIndex();
const catalogChecks = { physical: catalog.emails.length, excluded: catalog.emails.filter((x) => x.scope === 'EXCLUDED').length, inScope: catalog.emails.filter((x) => x.scope === 'IN_SCOPE').length, designed: catalog.emails.filter((x) => x.design_status === 'DESIGNED').length, undesigned: catalog.emails.filter((x) => x.scope === 'IN_SCOPE' && x.design_status === 'UNDESIGNED').length, exactBatch: expectedIds.every((id) => { const x = catalog.emails.find((email) => email.id === id); return x?.design_status === 'DESIGNED' && x.preview === `emails/${id}.html` && x.preview_selectable === true && existsSync(join(root, x.preview)); }) };
const traceability = expectedIds.map((id) => { const c = catalog.emails.find((x) => x.id === id); const t = trace.get(id); const source = c ? resolve(backendRoot, c.production_path) : ''; const ok = Boolean(c && t && t.phase1_scope_status === 'IN_SCOPE' && t.current_design_status === 'DESIGNED' && t.preview_reference === `emails/${id}.html` && existsSync(source)); return { id, status: ok ? 'PASS' : 'FAIL', source }; });
const staticAudits = [];
for (const definition of FINAL7_EMAIL_IDS) for (const variant of definition.variants) for (const locale of localesFor(definition, variant)) staticAudits.push(structural(definition, locale, variant, renderEmail(definition.id, { locale, variant })));
const financialFixtures = [
  ['marketing_package_sale', 'organizer', ['CA$250.00', 'CA$32.50', 'CA$282.50']],
  ['festival_payout', 'organizer', ['CA$4,820.75']],
  ['partner_coupons', 'withMap', ['CA$40.00', 'CA$5.20', 'CA$2.00', 'CA$0.26', 'CA$47.46']],
  ['partner_coupons_partner', 'withMap', ['CA$40.00', 'CA$5.20', 'CA$45.20']],
].map(([id, variant, required]) => { const html = renderEmail(id, { locale: 'en', variant }); const missing = required.filter((value) => !html.includes(value)); return { id, variant, required, missing, status: missing.length ? 'FAIL' : 'PASS' }; });
const conditionChecks = [
  { id: 'marketing_package_sale', detail: 'admin forced EN', status: localesFor(FINAL7_EMAIL_IDS[0], 'admin').length === 1 ? 'PASS' : 'FAIL' },
  { id: 'partner_coupons', detail: 'optional map omitted', status: !renderEmail('partner_coupons', { variant: 'withoutMap' }).includes('partner-map') ? 'PASS' : 'FAIL' },
  { id: 'partner_coupons_partner', detail: 'partner excludes processing fee', status: !renderEmail('partner_coupons_partner', { variant: 'withMap' }).includes('Processing fees') ? 'PASS' : 'FAIL' },
  { id: 'extra_service_request', detail: 'optional business omitted', status: !renderEmail('extra_service_request', { variant: 'withoutBusinessName' }).includes('Business name') ? 'PASS' : 'FAIL' },
];

const { server, origin } = await startServer();
const browser = await chromium.launch(); const page = await browser.newPage();
await page.route('https://example.com/**', (route) => route.fulfill({ status: 204, body: '' }));
const responsive = []; const stress = []; const blockedImages = []; const screenshots = []; const rtlVisual = [];
try {
  for (const definition of FINAL7_EMAIL_IDS) {
    const variant = definition.variants[0];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 }); await page.setContent(renderEmail(definition.id, { locale: 'en', variant, assetBase: origin }), { waitUntil: 'load' });
      const result = await measure(page); responsive.push({ id: definition.id, locale: 'en', variant, width, status: !result.documentOverflow && !result.elementOverflow ? 'PASS' : 'FAIL', ...result });
      if ([800, 320].includes(width)) { const name = `${definition.id}--${width === 800 ? 'desktop-800' : 'mobile-320'}.png`; await page.screenshot({ path: join(shotDir, name), fullPage: true }); screenshots.push(`screenshots/${name}`); }
    }
    await page.setViewportSize({ width: 320, height: 1000 }); await page.setContent(renderEmail(definition.id, { locale: 'en', variant, longContent: true, assetBase: origin })); const long = await measure(page); stress.push({ id: definition.id, status: !long.documentOverflow && !long.elementOverflow ? 'PASS' : 'FAIL', ...long });
    await page.setContent(blocked(renderEmail(definition.id, { locale: 'en', variant, assetBase: origin }))); const off = await measure(page); blockedImages.push({ id: definition.id, status: !off.documentOverflow && !off.elementOverflow ? 'PASS' : 'FAIL', ...off });
  }
  for (const locale of ['ar', 'fa']) for (const width of [800, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await page.setContent(renderEmail('marketing_package_sale', { locale, variant: 'organizer', assetBase: origin })); const result = await measure(page); const name = `marketing_package_sale--${locale}--${width === 800 ? 'desktop-800' : 'mobile-320'}.png`; await page.screenshot({ path: join(rtlDir, name), fullPage: true }); rtlVisual.push({ id: 'marketing_package_sale', locale, width, screenshot: `screenshots/rtl/${name}`, status: result.dir === 'rtl' && !result.documentOverflow && !result.elementOverflow ? 'PASS' : 'FAIL', ...result });
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
const report = { generatedAt: new Date().toISOString(), scope: 'Exact owner-authorized final-seven HTML Preview batch', widths, catalogChecks, summaries, contrast, screenshots, staticAudits, responsive, stress, blockedImages, rtlVisual, traceability, financialFixtures, conditionChecks, levelB: { gmail: 'NOT RUN', outlook: 'NOT RUN', appleMail: 'NOT RUN' } };
writeFileSync(join(outDir, 'final7-qa-results.json'), `${JSON.stringify(report, null, 2)}\n`);
const failed = !catalogChecks.exactBatch || catalogChecks.physical !== 59 || catalogChecks.excluded !== 11 || catalogChecks.inScope !== 48 || catalogChecks.designed !== 48 || catalogChecks.undesigned !== 0 || Object.values(summaries).some((x) => (x.failed || x.failedChecks || x.failedRenders) > 0) || contrast.some((x) => x.status === 'FAIL');
console.log(JSON.stringify({ catalogChecks, summaries, contrast, screenshots: screenshots.length, rtlScreenshots: rtlVisual.length, status: failed ? 'FAIL' : 'PASS' }, null, 2));
process.exit(failed ? 1 : 0);
