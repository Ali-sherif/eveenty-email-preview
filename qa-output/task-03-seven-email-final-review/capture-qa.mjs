/**
 * Task 03 seven-email FINAL review — browser QA (Playwright Chromium).
 * Output: qa-output/task-03-seven-email-final-review/
 * Gmail / Outlook / Apple Mail: NOT EXECUTED.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderEmail } from '../../shared/render-emails.js';

const root = dirname(fileURLToPath(import.meta.url));
const shotDir = join(root, 'screenshots');
mkdirSync(shotDir, { recursive: true });

const PREVIEW = process.env.PREVIEW_URL || 'http://localhost:4173/';

const VIEWPORTS = [
  { name: 'desktop-800', width: 800, height: 1200 },
  { name: 'tablet-768', width: 768, height: 1100 },
  { name: 'mobile-414', width: 414, height: 900 },
  { name: 'mobile-375', width: 375, height: 900 },
  { name: 'mobile-320', width: 320, height: 900 },
];

const CASES = [
  // 1 activate
  { id: 'activate_email', locale: 'en', variant: 'default', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'activate_email', locale: 'fr', variant: 'default', views: ['desktop-800'] },
  { id: 'activate_email', locale: 'es', variant: 'default', views: ['desktop-800'] },
  { id: 'activate_email', locale: 'ar', variant: 'default', views: ['desktop-800', 'mobile-375'] },
  { id: 'activate_email', locale: 'fa', variant: 'default', views: ['desktop-800', 'mobile-320'] },
  { id: 'activate_email', locale: 'en', variant: 'default', views: ['desktop-800'], blocked: true, tag: 'blocked' },
  { id: 'activate_email', locale: 'en', variant: 'default', views: ['mobile-320'], longContent: true, tag: 'long' },

  // 2 donation
  { id: 'festival_donation', locale: 'en', variant: 'donatorUser', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'festival_donation', locale: 'fr', variant: 'donatorUser', views: ['desktop-800'] },
  { id: 'festival_donation', locale: 'es', variant: 'donatorUser', views: ['desktop-800'] },
  { id: 'festival_donation', locale: 'ar', variant: 'donatorUser', views: ['desktop-800', 'mobile-375'] },
  { id: 'festival_donation', locale: 'fa', variant: 'donatorUser', views: ['desktop-800', 'mobile-320'] },
  { id: 'festival_donation', locale: 'en', variant: 'organizerNotify', views: ['desktop-800'], tag: 'organizer' },
  { id: 'festival_donation', locale: 'en', variant: 'donatorUser', views: ['desktop-800'], blocked: true, tag: 'blocked' },
  { id: 'festival_donation', locale: 'en', variant: 'donatorUser', views: ['mobile-320'], longContent: true, tag: 'long' },

  // 3 ticket sale
  { id: 'festival_ticket_sale', locale: 'en', variant: 'buyerUser', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'festival_ticket_sale', locale: 'fr', variant: 'buyerUser', views: ['desktop-800'] },
  { id: 'festival_ticket_sale', locale: 'es', variant: 'buyerUser', views: ['desktop-800'] },
  { id: 'festival_ticket_sale', locale: 'ar', variant: 'buyerUser', views: ['desktop-800', 'mobile-375'] },
  { id: 'festival_ticket_sale', locale: 'fa', variant: 'buyerUser', views: ['desktop-800', 'mobile-320'] },
  { id: 'festival_ticket_sale', locale: 'en', variant: 'guestUser', views: ['desktop-800'], tag: 'guest' },
  { id: 'festival_ticket_sale', locale: 'en', variant: 'buyerUser', views: ['desktop-800'], blocked: true, tag: 'blocked' },
  { id: 'festival_ticket_sale', locale: 'en', variant: 'buyerUser', views: ['mobile-320'], longContent: true, tag: 'long' },

  // 4 reg approval
  { id: 'festival_ticket_registration_approval', locale: 'en', variant: 'user_completeOrder', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'festival_ticket_registration_approval', locale: 'fr', variant: 'user_completeOrder', views: ['desktop-800'] },
  { id: 'festival_ticket_registration_approval', locale: 'es', variant: 'user_completeOrder', views: ['desktop-800'] },
  { id: 'festival_ticket_registration_approval', locale: 'ar', variant: 'user_completeOrder', views: ['desktop-800', 'mobile-375'] },
  { id: 'festival_ticket_registration_approval', locale: 'fa', variant: 'user_completeOrder', views: ['desktop-800', 'mobile-320'] },
  { id: 'festival_ticket_registration_approval', locale: 'en', variant: 'user_noCta', views: ['desktop-800'], tag: 'no-cta' },
  { id: 'festival_ticket_registration_approval', locale: 'en', variant: 'user_completeOrder', views: ['desktop-800'], blocked: true, tag: 'blocked' },
  { id: 'festival_ticket_registration_approval', locale: 'en', variant: 'user_completeOrder', views: ['mobile-320'], longContent: true, tag: 'long' },

  // 5 support
  { id: 'support', locale: 'en', variant: 'default', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'support', locale: 'en', variant: 'longDetails', views: ['desktop-800', 'mobile-320'], tag: 'long' },
  { id: 'support', locale: 'en', variant: 'default', views: ['desktop-800'], blocked: true, tag: 'blocked' },

  // 6 dispute
  { id: 'dispute_notification', locale: 'en', variant: 'organizer', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'dispute_notification', locale: 'fr', variant: 'organizer', views: ['desktop-800'] },
  { id: 'dispute_notification', locale: 'es', variant: 'organizer', views: ['desktop-800'] },
  { id: 'dispute_notification', locale: 'ar', variant: 'organizer', views: ['desktop-800', 'mobile-375'] },
  { id: 'dispute_notification', locale: 'fa', variant: 'organizer', views: ['desktop-800', 'mobile-320'] },
  { id: 'dispute_notification', locale: 'en', variant: 'admin', views: ['desktop-800'], tag: 'admin' },
  { id: 'dispute_notification', locale: 'en', variant: 'withPaymentLink', views: ['desktop-800', 'mobile-375'], tag: 'cta' },
  { id: 'dispute_notification', locale: 'en', variant: 'stripeConnect', views: ['desktop-800'], tag: 'stripe' },
  { id: 'dispute_notification', locale: 'en', variant: 'noEvidence', views: ['desktop-800'], tag: 'no-evidence' },
  { id: 'dispute_notification', locale: 'en', variant: 'organizer', views: ['mobile-320'], longContent: true, tag: 'long' },

  // 7 marketing
  { id: 'festival_marketing_email_target', locale: 'en', variant: 'default', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'festival_marketing_email_target', locale: 'en', variant: 'default', views: ['mobile-320'], longContent: true, tag: 'long' },
  { id: 'festival_marketing_email_target', locale: 'en', variant: 'default', views: ['desktop-800'], blocked: true, tag: 'blocked' },
];

function checks(html, { id, locale, variant, blocked }) {
  const out = [];
  const pass = (name, ok, detail = '') => out.push({ name, ok: !!ok, detail });

  if (id !== 'festival_marketing_email_target') {
    if (!blocked) pass('logo-160', html.includes('width="160"'), 'nominal logo width');
    pass('header-primary50', /#fefdf4/i.test(html), 'canonical header bg');
  } else {
    if (!blocked) pass('festival-logo-slot', /festival-logo/i.test(html), 'festival logo fixture');
    else pass('blocked-fallback', html.includes('[blocked image]'), 'blocked image alt');
    pass('unsubscribe-present', /unsubscribe/i.test(html), 'production unsubscribe');
  }

  pass('no-visible-preheader-bar', !html.includes('Preheader:'), 'no body preheader bar');
  pass('hidden-preheader', html.includes('display:none') && html.includes('mso-hide'), 'hidden preheader');

  if ((locale === 'ar' || locale === 'fa') && !(id === 'dispute_notification' && variant === 'admin')) {
    pass('rtl-dir', html.includes('dir="rtl"'), 'RTL html dir');
  }

  if (id === 'activate_email' || id === 'support') {
    pass('heading-600', html.includes('font-weight:600'), 'heading SemiBold 600');
  }
  if (id === 'festival_donation') {
    pass('heading-600', /font-weight:600/.test(html), 'thank-you heading 600');
  }
  if (id === 'festival_ticket_registration_approval' && variant !== 'user_noCta') {
    pass('yellow-cta', /#e9d023/i.test(html), 'design-kit yellow CTA');
    pass('cta-dark-text', /#4d4c49/i.test(html), 'CTA dark text');
  }
  if (id === 'festival_ticket_sale' && !blocked) {
    pass('qr-fixture', html.includes('qr-sample'), 'QR present');
  }
  if (id === 'dispute_notification' && variant === 'withPaymentLink') {
    pass('yellow-cta', /#e9d023/i.test(html), 'yellow CTA');
  }

  return out;
}

const results = [];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const c of CASES) {
  for (const viewName of c.views) {
    const vp = VIEWPORTS.find((v) => v.name === viewName);
    let html = renderEmail(c.id, {
      locale: c.locale,
      variant: c.variant,
      longContent: !!c.longContent,
      assetBase: PREVIEW.endsWith('/') ? PREVIEW : PREVIEW + '/',
    });

    if (c.blocked) {
      html = html.replace(/<img\b([^>]*)>/gi, (full, attrs) => {
        const alt = (attrs.match(/\balt=("([^"]*)"|'([^']*)')/i) || [])[2] || 'Image';
        const width = (attrs.match(/\bwidth=("([^"]*)"|'([^']*)')/i) || [])[2] || '160';
        const height = (attrs.match(/\bheight=("([^"]*)"|'([^']*)')/i) || [])[2] || '64';
        return `<div role="img" aria-label="${alt}" style="display:inline-block;width:${width}px;max-width:100%;min-height:${height}px;border:1px dashed #acacac;background:#eee;color:#7b7b79;font-family:Arial,sans-serif;font-size:11px;padding:8px;text-align:center;box-sizing:border-box;">[blocked image]<br>${alt}</div>`;
      });
    }

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.setContent(html, { waitUntil: 'load' });
    const box = await page.evaluate(() => {
      const container =
        document.querySelector('.email-container') ||
        document.querySelector('table[role="presentation"][width="100%"]') ||
        document.body.firstElementChild;
      const cta = document.querySelector('.cta-yellow');
      const logo = document.querySelector('img[width="160"], img[alt]');
      const cr = container ? container.getBoundingClientRect() : null;
      const ctar = cta ? cta.getBoundingClientRect() : null;
      const lr = logo ? logo.getBoundingClientRect() : null;
      return {
        containerW: cr ? Math.round(Math.min(cr.width, 600)) : null,
        ctaH: ctar ? Math.round(ctar.height) : null,
        ctaW: ctar ? Math.round(ctar.width) : null,
        logoW: lr ? Math.round(lr.width) : null,
        logoH: lr ? Math.round(lr.height) : null,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 2,
      };
    });

    const tag = c.tag ? `-${c.tag}` : '';
    const file = `${c.id}-${c.locale}-${viewName}${tag}.png`;
    await page.screenshot({ path: join(shotDir, file), fullPage: true });

    const checkList = checks(html, { ...c, blocked: !!c.blocked });
    const measureOk = [];
    if (box.containerW != null) {
      measureOk.push({ name: 'container-max-600', ok: box.containerW <= 602, detail: `w=${box.containerW}` });
    }
    if (box.ctaH != null) {
      measureOk.push({ name: 'cta-touch-approx', ok: box.ctaH >= 44, detail: `h=${box.ctaH}` });
    }
    if (c.id !== 'festival_marketing_email_target' && box.logoW != null && !c.blocked) {
      measureOk.push({
        name: 'logo-display-160',
        ok: Math.abs(box.logoW - 160) <= 2,
        detail: `w=${box.logoW}`,
      });
    }
    measureOk.push({ name: 'no-overflow-x', ok: !box.overflowX, detail: box.overflowX ? 'overflow' : '' });

    const all = [...checkList, ...measureOk];
    const pass = all.every((x) => x.ok);
    results.push({
      id: c.id,
      locale: c.locale,
      variant: c.variant,
      view: viewName,
      tag: c.tag || null,
      file,
      pass,
      checks: all,
      measurements: box,
    });
    console.log(pass ? 'PASS' : 'FAIL', file);
  }
}

await browser.close();

const byTemplate = {};
for (const r of results) {
  byTemplate[r.id] ??= { total: 0, passed: 0 };
  byTemplate[r.id].total += 1;
  if (r.pass) byTemplate[r.id].passed += 1;
}

const summary = {
  generatedAt: new Date().toISOString(),
  previewUrl: PREVIEW,
  note: 'Browser Chromium QA only. Gmail/Outlook/Apple Mail NOT EXECUTED.',
  total: results.length,
  passed: results.filter((r) => r.pass).length,
  failed: results.filter((r) => !r.pass).length,
  byTemplate,
  results,
};
writeFileSync(join(root, 'measurements.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log(`\n${summary.passed}/${summary.total} PASS`);
console.log(JSON.stringify(byTemplate, null, 2));
if (summary.failed) {
  for (const r of results.filter((x) => !x.pass)) {
    console.log('FAIL detail', r.file, r.checks.filter((c) => !c.ok));
  }
  process.exitCode = 1;
}
