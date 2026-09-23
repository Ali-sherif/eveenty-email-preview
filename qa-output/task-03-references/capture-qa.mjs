/**
 * Task 03 — Browser QA capture for three additional references + Activation spot-check.
 * Uses Playwright Chromium. Does NOT claim Gmail/Outlook/Apple Mail parity.
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
  // Activation regression spot-check
  { id: 'activate_email', locale: 'en', variant: 'default', views: ['desktop-800', 'mobile-375'] },
  // Commerce ticket sale
  { id: 'festival_ticket_sale', locale: 'en', variant: 'buyerUser', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'festival_ticket_sale', locale: 'fr', variant: 'buyerUser', views: ['desktop-800'] },
  { id: 'festival_ticket_sale', locale: 'es', variant: 'buyerUser', views: ['desktop-800'] },
  { id: 'festival_ticket_sale', locale: 'ar', variant: 'buyerUser', views: ['desktop-800', 'mobile-375'] },
  { id: 'festival_ticket_sale', locale: 'fa', variant: 'guestUser', views: ['desktop-800', 'mobile-320'] },
  { id: 'festival_ticket_sale', locale: 'en', variant: 'guestUser', views: ['desktop-800'], tag: 'guest' },
  { id: 'festival_ticket_sale', locale: 'en', variant: 'buyerUser', views: ['mobile-320'], longContent: true, tag: 'long' },
  { id: 'festival_ticket_sale', locale: 'en', variant: 'buyerUser', views: ['desktop-800'], blocked: true, tag: 'blocked' },
  // Dispute
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
  // Marketing
  { id: 'festival_marketing_email_target', locale: 'en', variant: 'default', views: ['desktop-800', 'tablet-768', 'mobile-414', 'mobile-375', 'mobile-320'] },
  { id: 'festival_marketing_email_target', locale: 'en', variant: 'default', views: ['mobile-320'], longContent: true, tag: 'long' },
  { id: 'festival_marketing_email_target', locale: 'en', variant: 'default', views: ['desktop-800'], blocked: true, tag: 'blocked' },
];

function checks(html, { id, locale, variant, blocked }) {
  const out = [];
  const pass = (name, ok, detail = '') => out.push({ name, ok: !!ok, detail });

  if (id !== 'festival_marketing_email_target') {
    if (!blocked) {
      pass('logo-160', html.includes('width="160"'), 'nominal logo width');
    }
    pass('header-primary50', /#fefdf4/i.test(html), 'canonical header bg');
  } else {
    if (!blocked) {
      pass('festival-logo-slot', html.includes('festival-logo-sample'), 'festival logo fixture');
    } else {
      pass('blocked-fallback', html.includes('[blocked image]'), 'blocked image alt');
    }
    pass('unsubscribe-present', html.includes('unsubscribe'), 'production unsubscribe');
    pass('no-invented-legal', !/CAN-SPAM|GDPR legal footer/i.test(html), 'no invented legal');
  }

  pass('no-visible-preheader-bar', !html.includes('Preheader:'), 'no body preheader bar');
  pass('hidden-preheader', html.includes('display:none') && html.includes('mso-hide'), 'hidden preheader present');

  if (locale === 'ar' || locale === 'fa') {
    if (!(id === 'dispute_notification' && variant === 'admin')) {
      pass('rtl-dir', html.includes('dir="rtl"'), 'RTL html dir');
    }
  }

  if (id === 'festival_ticket_sale') {
    if (!blocked) pass('qr-fixture', html.includes('qr-sample'), 'QR present');
    pass('wallet-links', /Wallet|google-wallet|apple-wallet/i.test(html), 'wallet');
    pass('totals', html.includes('Grand total') || html.includes('CA$'), 'totals');
  }

  if (id === 'dispute_notification') {
    pass(
      'details-table',
      /Field|Campo|Champ|الحقل|فیلد|Details|Detalles|Détails|التفاصيل|جزئیات/i.test(html),
      'details'
    );
    if (variant === 'withPaymentLink') {
      pass('yellow-cta', /#e9d023/i.test(html), 'yellow CTA');
    }
  }

  if (id === 'activate_email') {
    pass('heading-600', html.includes('font-weight:600'), 'Activation heading weight');
  }

  return out;
}

const results = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

for (const c of CASES) {
  for (const viewName of c.views) {
    const vp = VIEWPORTS.find((v) => v.name === viewName);
    let html = renderEmail(c.id, {
      locale: c.locale,
      variant: c.variant,
      longContent: !!c.longContent,
      assetBase: PREVIEW.endsWith('/') ? PREVIEW : PREVIEW + '/',
    });

    // For blocked images: strip img src like preview.js
    if (c.blocked) {
      html = html.replace(/<img\b([^>]*)>/gi, (full, attrs) => {
        const alt = (attrs.match(/\balt=("([^"]*)"|'([^']*)')/i) || [])[2] || 'Image';
        const width = (attrs.match(/\bwidth=("([^"]*)"|'([^']*)')/i) || [])[2] || '160';
        const height = (attrs.match(/\bheight=("([^"]*)"|'([^']*)')/i) || [])[2] || '64';
        return `<div role="img" aria-label="${alt}" style="display:inline-block;width:${width}px;max-width:100%;min-height:${height}px;border:1px dashed #acacac;background:#eee;color:#7b7b79;font-family:Arial,sans-serif;font-size:11px;padding:8px;text-align:center;box-sizing:border-box;">[blocked image]<br>${alt}</div>`;
      });
    }

    // Measure against isolated email document (not preview chrome)
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.setContent(html, { waitUntil: 'load' });
    const box = await page.evaluate(() => {
      const container = document.querySelector('.email-container') || document.querySelector('table[width=\"600\"]');
      const cta = document.querySelector('.cta-yellow') || document.querySelector('a[style*=\"padding:16px\"]');
      const logo = document.querySelector('img[alt]');
      const cr = container ? container.getBoundingClientRect() : null;
      const ctar = cta ? cta.getBoundingClientRect() : null;
      const lr = logo ? logo.getBoundingClientRect() : null;
      return {
        containerW: cr ? Math.round(cr.width) : null,
        ctaH: ctar ? Math.round(ctar.height) : null,
        ctaW: ctar ? Math.round(ctar.width) : null,
        logoW: lr ? Math.round(lr.width) : null,
        logoH: lr ? Math.round(lr.height) : null,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 2,
        bodyTextSample: (document.body.innerText || '').slice(0, 120),
      };
    });

    const tag = c.tag ? `-${c.tag}` : '';
    const file = `${c.id}-${c.locale}-${viewName}${tag}.png`;
    const path = join(shotDir, file);
    await page.screenshot({ path, fullPage: true });

    const checkList = checks(html, { ...c, blocked: !!c.blocked });
    const measureOk = [];
    if (box.containerW != null) {
      // Fluid hybrid: container must not exceed 600, and should fit viewport (allow outer chrome).
      measureOk.push({
        name: 'container-max-600',
        ok: box.containerW <= 602,
        detail: `w=${box.containerW}`,
      });
    }
    if (box.ctaH != null) {
      measureOk.push({
        name: 'cta-touch-approx',
        ok: box.ctaH >= 44,
        detail: `h=${box.ctaH}`,
      });
    }
    if (c.id !== 'festival_marketing_email_target' && box.logoW != null && !c.blocked) {
      measureOk.push({
        name: 'logo-display-160',
        ok: Math.abs(box.logoW - 160) <= 2,
        detail: `w=${box.logoW}`,
      });
    }
    // Allow 1–2px subpixel; flag true horizontal clip beyond that.
    measureOk.push({
      name: 'no-overflow-x',
      ok: !box.overflowX,
      detail: box.overflowX ? 'scrollWidth>innerWidth' : '',
    });

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

const summary = {
  generatedAt: new Date().toISOString(),
  previewUrl: PREVIEW,
  note: 'Browser Chromium QA only. Gmail/Outlook/Apple Mail NOT EXECUTED.',
  total: results.length,
  passed: results.filter((r) => r.pass).length,
  failed: results.filter((r) => !r.pass).length,
  results,
};
writeFileSync(join(root, 'measurements.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log(`\n${summary.passed}/${summary.total} PASS`);
if (summary.failed) {
  for (const r of results.filter((x) => !x.pass)) {
    console.log('FAIL detail', r.file, r.checks.filter((c) => !c.ok));
  }
  process.exitCode = 1;
}
