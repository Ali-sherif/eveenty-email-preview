/** Owner-authorized 20-template batch — Level A Chromium + structural QA. */
import { chromium } from 'playwright';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTraceabilityIndex } from '../../.agents/scripts/lib/catalog.mjs';
import { BATCH20_EMAIL_IDS } from '../../shared/batch20-definitions.js';
import { renderEmail } from '../../shared/render-emails.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const backendRoot = resolve(root, '..', 'rescounts-backend');
const outDir = join(root, 'qa-output', 'batch-20');
const shotDir = join(outDir, 'screenshots');
const rtlShotDir = join(shotDir, 'rtl');
mkdirSync(rtlShotDir, { recursive: true });

const widths = Object.freeze([800, 768, 414, 375, 320]);
const expectedIds = Object.freeze([
  'refund_receipt_organizer',
  'refund_receipt_admin',
  'festival_ticket_registration',
  'festival_ticket_registration_deadline_exceeded',
  'festival_ticket_registration_payment_deadline_exceeded',
  'registration_approval_status_changed',
  'festival_update_request_approved',
  'festival_update_request_rejected',
  'festival_vendor_sale_rejection',
  'needs_response_dispute_reminder',
  'festival_update_request_issued',
  'festival_created',
  'festival_marketing_approval',
  'festival_marketing_approval_sms',
  'festival_sale_installment_paid',
  'second_payment_reminder',
  'first_payment_refund',
  'sponsor_installment_paid',
  'sponsor_installment_second_payment_reminder',
  'sponsor_first_payment_refund',
]);
const rtlVisualCases = Object.freeze([
  { id: 'refund_receipt_organizer', variant: 'refundAndCanceled' },
  { id: 'festival_ticket_registration_deadline_exceeded', variant: 'user' },
  { id: 'festival_update_request_rejected', variant: 'withNote' },
  { id: 'needs_response_dispute_reminder', variant: 'organizerStripeConnectLastReminder' },
  { id: 'festival_sale_installment_paid', variant: 'vendorDiscountCardFees' },
  { id: 'first_payment_refund', variant: 'vendor' },
]);
const disputePaymentVariants = new Set([
  'organizerWithPaymentLink',
  'organizerStripeConnect',
  'organizerStripeConnectLastReminder',
  'adminWithPaymentLink',
  'adminStripeConnect',
  'adminStripeConnectLastReminder',
]);
const disputeTrackingVariants = new Set([
  ...disputePaymentVariants,
  'organizerTrackingOnly',
]);

if (
  BATCH20_EMAIL_IDS.length !== 20 ||
  new Set(BATCH20_EMAIL_IDS.map(({ id }) => id)).size !== 20 ||
  JSON.stringify(BATCH20_EMAIL_IDS.map(({ id }) => id)) !== JSON.stringify(expectedIds)
) {
  throw new Error('QA scope must be the exact authorized 20-template list and order');
}

const mime = Object.freeze({
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
});

function startAssetServer() {
  const server = createServer((request, response) => {
    const relative = decodeURIComponent((request.url || '/').split('?')[0]).replace(/^\/+/, '');
    const filePath = resolve(root, relative);
    if (!filePath.startsWith(`${root}\\`) || !existsSync(filePath)) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200, {
      'Content-Type': mime[extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    response.end(readFileSync(filePath));
  });
  return new Promise((resolveServer) => {
    server.listen(0, '127.0.0.1', () => {
      resolveServer({
        server,
        origin: `http://127.0.0.1:${server.address().port}/`,
      });
    });
  });
}

function luminance(hex) {
  const normalized = hex.replace('#', '');
  const rgb = [0, 2, 4].map((index) => {
    const channel = Number.parseInt(normalized.slice(index, index + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrast(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const contrastResults = [
  ['heading/white', '#2b2a28', '#ffffff'],
  ['body/white', '#4d4c49', '#ffffff'],
  ['secondary/white', '#d80073', '#ffffff'],
  ['success/surface', '#166534', '#f0fdf4'],
  ['error-title/surface', '#991b1b', '#fef2f2'],
  ['error-body/surface', '#4d4c49', '#fef2f2'],
  ['warning/surface', '#92400e', '#fffbeb'],
  ['cta/primary', '#4d4c49', '#e9d023'],
].map(([name, foreground, background]) => {
  const ratio = contrast(foreground, background);
  return {
    name,
    foreground,
    background,
    ratio: Number(ratio.toFixed(2)),
    status: ratio >= 4.5 ? 'PASS' : 'FAIL',
  };
});

function localesFor(definition, variant) {
  return definition.variantLocales?.[variant] || definition.locales;
}

function structuralAudit(definition, locale, variant, html) {
  const findings = [];
  const add = (name, ok, detail = '') => {
    findings.push({ name, status: ok ? 'PASS' : 'FAIL', detail });
  };
  const bytes = Buffer.byteLength(html, 'utf8');
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map((match) => match[1]);
  const unsafeHref = hrefs.find((href) => {
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return false;
    try {
      const url = new URL(href);
      return !['example.com', 'maps.example.com', '127.0.0.1'].includes(url.hostname);
    } catch {
      return !href.startsWith('./') && !href.startsWith('../');
    }
  });
  const missingAlt = images.find((attributes) => {
    const width = attributes.match(/\bwidth=["']?(\d+)/i)?.[1];
    if (width === '1') return false;
    return !/\balt=["'][^"']+["']/i.test(attributes);
  });

  add('html-under-102kb', bytes < 102 * 1024, `${bytes} bytes`);
  add('table-layout', /<table role="presentation"/i.test(html));
  add('container-max-600', /max-width:600px/i.test(html));
  add('localized-logo-160', /width="160"/i.test(html));
  add('meaningful-emphasis-token', /#(?:2b2a28|166534|991b1b|92400e|1e40af)/i.test(html));
  add('approved-body-token', /#4d4c49/i.test(html));
  add('approved-divider-token', /#ebebeb/i.test(html));
  add('approved-header-token', /#fefdf4/i.test(html));
  add('no-go-template-placeholders', !/\{\{\s*\.[A-Za-z0-9_]+/i.test(html));
  add('no-forbidden-elements', !/<(?:script|form|iframe|video|audio|link)\b/i.test(html));
  add('no-unsafe-layout-css', !/\b(?:display:flex|display:grid|gap:|object-fit:|position:fixed|calc\(|var\()/.test(html));
  add('no-base64-images', !/src=["']data:/i.test(html));
  add('no-svg-images', !images.some((attributes) => /\bsrc=["'][^"']+\.svg(?:[?#][^"']*)?["']/i.test(attributes)));
  add('no-unsafe-hrefs', !unsafeHref, unsafeHref || `${hrefs.length} hrefs checked`);
  add('meaningful-image-alt', !missingAlt, missingAlt || `${images.length} images checked`);
  add('lang', new RegExp(`<html lang="${locale}"`, 'i').test(html), locale);
  add('dir', new RegExp(`<html[^>]+dir="${['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr'}"`, 'i').test(html));
  add('synthetic-author-content-escaped', !/<sample(?:\s|>)/i.test(html));

  if (definition.id === 'festival_marketing_approval' || definition.id === 'festival_marketing_approval_sms') {
    const actionLinks = [...new Set(hrefs.filter((href) => /\/(?:approve|decline)$/.test(href)))];
    add('inert-approval-links', actionLinks.length === 2 && actionLinks.every((href) => href.startsWith('https://example.com/')));
  }
  if (definition.id === 'needs_response_dispute_reminder') {
    const shouldShowPayment = disputePaymentVariants.has(variant);
    const shouldShowTracking = disputeTrackingVariants.has(variant);
    add('payment-link-condition', html.includes('https://example.com/preview/disputes/sample/payment') === shouldShowPayment, shouldShowPayment ? 'present' : 'omitted');
    add('tracking-pixel-condition', html.includes('https://example.com/preview/disputes/sample/open.gif') === shouldShowTracking, shouldShowTracking ? 'present and inert' : 'omitted');
  }
  if (definition.id === 'second_payment_reminder') {
    add('profile-link-condition', html.includes('https://example.com/preview/user-profile') === (variant === 'vendor'));
  }

  return {
    id: definition.id,
    locale,
    variant,
    bytes,
    findings,
    failCount: findings.filter(({ status }) => status === 'FAIL').length,
  };
}

function blockedImagesHtml(html) {
  return html.replace(/(<img\b[^>]*?)\bsrc=(?:"[^"]*"|'[^']*')/gi, '$1src="about:blank#blocked-image"');
}

async function measurePage(page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const overflowingElements = [...document.querySelectorAll('body *')]
      .filter((element) => {
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = element.getBoundingClientRect();
        return rect.right > viewportWidth + 1 || rect.left < -1;
      })
      .slice(0, 5)
      .map((element) => ({
        tag: element.tagName,
        className: element.className || '',
        left: Math.round(element.getBoundingClientRect().left),
        right: Math.round(element.getBoundingClientRect().right),
      }));
    return {
      dir: document.documentElement.dir,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: viewportWidth,
      documentOverflow: document.documentElement.scrollWidth > viewportWidth + 1,
      elementOverflow: overflowingElements.length > 0,
      overflowingElements,
    };
  });
}

const catalog = JSON.parse(readFileSync(join(root, 'catalog', 'email-catalog.json'), 'utf8'));
const traceability = loadTraceabilityIndex();
const catalogChecks = {
  physical: catalog.emails.length,
  excluded: catalog.emails.filter(({ scope }) => scope === 'EXCLUDED').length,
  inScope: catalog.emails.filter(({ scope }) => scope === 'IN_SCOPE').length,
  designed: catalog.emails.filter(({ design_status }) => design_status === 'DESIGNED').length,
  undesigned: catalog.emails.filter(({ scope, design_status }) => scope === 'IN_SCOPE' && design_status === 'UNDESIGNED').length,
  exactBatch: expectedIds.every((id) => {
    const record = catalog.emails.find((email) => email.id === id);
    return record?.scope === 'IN_SCOPE'
      && record.design_status === 'DESIGNED'
      && record.preview_selectable === true
      && record.preview === `emails/${id}.html`
      && existsSync(join(root, record.preview));
  }),
};

const traceabilityChecks = expectedIds.map((id) => {
  const catalogEntry = catalog.emails.find((email) => email.id === id);
  const traceRow = traceability.get(id);
  const productionPath = catalogEntry ? resolve(backendRoot, catalogEntry.production_path) : '';
  const ok = Boolean(
    catalogEntry
      && traceRow
      && traceRow.phase1_scope_status === 'IN_SCOPE'
      && traceRow.current_design_status === 'DESIGNED'
      && traceRow.preview_reference === `emails/${id}.html`
      && existsSync(productionPath),
  );
  return {
    id,
    status: ok ? 'PASS' : 'FAIL',
    productionPath,
    traceabilityPresent: Boolean(traceRow),
  };
});

const { server, origin: assetBase } = await startAssetServer();
const staticAudits = [];
for (const definition of BATCH20_EMAIL_IDS) {
  for (const variant of definition.variants) {
    for (const locale of localesFor(definition, variant)) {
      const html = renderEmail(definition.id, { locale, variant, assetBase });
      staticAudits.push(structuralAudit(definition, locale, variant, html));
    }
  }
}

const financialFixtureSpecs = [
  {
    name: 'refund-standard',
    id: 'refund_receipt_organizer',
    variant: 'refundAndCanceled',
    required: ['CA$69.80', 'CA$23.10', 'CA$90.40', 'CA$2.50', 'CA$92.90'],
  },
  {
    name: 'refund-no-processing-fees',
    id: 'refund_receipt_organizer',
    variant: 'noProcessingFees',
    required: ['CA$67.80', 'CA$22.60', 'CA$90.40'],
    forbidden: ['CA$2.50', 'CA$92.90'],
  },
  {
    name: 'refund-bank-fee-deducted',
    id: 'refund_receipt_organizer',
    variant: 'adjustmentsAndProof',
    required: ['CA$74.80', 'CA$24.60', 'CA$99.40', 'CA$2.50', 'CA$3.10', 'CA$96.30'],
  },
  {
    name: 'refund-bank-fee-refunded',
    id: 'refund_receipt_organizer',
    variant: 'refundedBankFees',
    required: ['CA$74.80', 'CA$24.60', 'CA$99.40', 'CA$2.50', 'CA$3.10', 'CA$102.50'],
  },
  {
    name: 'vendor-standard',
    id: 'festival_vendor_sale_rejection',
    variant: 'default',
    required: ['CA$80.00', 'CA$2.50', 'CA$10.40', 'CA$1.75', 'CA$94.65'],
  },
  {
    name: 'vendor-no-bank-fees',
    id: 'festival_vendor_sale_rejection',
    variant: 'noBankFees',
    required: ['CA$80.00', 'CA$2.50', 'CA$10.40', 'CA$92.90'],
    forbidden: ['CA$1.75', 'CA$94.65'],
  },
  {
    name: 'vendor-no-optional-fees',
    id: 'festival_vendor_sale_rejection',
    variant: 'noOptionalFees',
    required: ['CA$80.00', 'CA$10.40', 'CA$90.40'],
    forbidden: ['CA$2.50', 'CA$1.75', 'CA$94.65'],
  },
  {
    name: 'vendor-long-content-recalculation',
    id: 'festival_vendor_sale_rejection',
    variant: 'default',
    longContent: true,
    required: ['CA$116.00', 'CA$2.50', 'CA$15.08', 'CA$1.75', 'CA$135.33'],
  },
];
const financialFixtures = financialFixtureSpecs.map((spec) => {
  const html = renderEmail(spec.id, {
    locale: 'en',
    variant: spec.variant,
    longContent: Boolean(spec.longContent),
    assetBase,
  });
  const missing = spec.required.filter((value) => !html.includes(value));
  const unexpected = (spec.forbidden || []).filter((value) => html.includes(value));
  return {
    name: spec.name,
    id: spec.id,
    variant: spec.variant,
    longContent: Boolean(spec.longContent),
    required: spec.required,
    forbidden: spec.forbidden || [],
    missing,
    unexpected,
    status: missing.length === 0 && unexpected.length === 0 ? 'PASS' : 'FAIL',
  };
});

const browser = await chromium.launch();
const page = await browser.newPage();
await page.route('https://example.com/**', async (route) => {
  await route.fulfill({ status: 204, body: '' });
});
const responsive = [];
const stress = [];
const blockedImages = [];
const screenshots = [];
const rtlVisual = [];

try {
  for (const definition of BATCH20_EMAIL_IDS) {
    const defaultVariant = definition.variants[0];
    const allowedLocales = localesFor(definition, defaultVariant);
    const responsiveLocales = allowedLocales.includes('ar') ? ['en', 'ar'] : ['en'];
    for (const locale of responsiveLocales) {
      for (const width of widths) {
        const html = renderEmail(definition.id, {
          locale,
          variant: defaultVariant,
          assetBase,
        });
        await page.setViewportSize({ width, height: 1000 });
        await page.setContent(html, { waitUntil: 'load' });
        const measurement = await measurePage(page);
        responsive.push({
          id: definition.id,
          locale,
          variant: defaultVariant,
          width,
          status: !measurement.documentOverflow && !measurement.elementOverflow ? 'PASS' : 'FAIL',
          ...measurement,
        });
        if (locale === 'en' && [800, 320].includes(width)) {
          const filename = `${definition.id}--${width === 800 ? 'desktop-800' : 'mobile-320'}.png`;
          const filePath = join(shotDir, filename);
          await page.screenshot({ path: filePath, fullPage: true });
          screenshots.push(`screenshots/${filename}`);
        }
      }
    }

    const longHtml = renderEmail(definition.id, {
      locale: 'en',
      variant: defaultVariant,
      longContent: true,
      assetBase,
    });
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.setContent(longHtml, { waitUntil: 'load' });
    const longMeasurement = await measurePage(page);
    stress.push({
      id: definition.id,
      locale: 'en',
      variant: defaultVariant,
      width: 320,
      status: !longMeasurement.documentOverflow && !longMeasurement.elementOverflow ? 'PASS' : 'FAIL',
      ...longMeasurement,
    });

    const blockedHtml = blockedImagesHtml(renderEmail(definition.id, {
      locale: 'en',
      variant: defaultVariant,
      assetBase,
    }));
    await page.setContent(blockedHtml, { waitUntil: 'load' });
    const blockedMeasurement = await measurePage(page);
    blockedImages.push({
      id: definition.id,
      locale: 'en',
      variant: defaultVariant,
      width: 320,
      status: !blockedMeasurement.documentOverflow && !blockedMeasurement.elementOverflow ? 'PASS' : 'FAIL',
      ...blockedMeasurement,
    });
  }

  for (const testCase of rtlVisualCases) {
    for (const locale of ['ar', 'fa']) {
      for (const width of [800, 320]) {
        const html = renderEmail(testCase.id, {
          locale,
          variant: testCase.variant,
          assetBase,
        });
        await page.setViewportSize({ width, height: 1000 });
        await page.setContent(html, { waitUntil: 'load' });
        const measurement = await measurePage(page);
        const filename = `${testCase.id}--${locale}--${width === 800 ? 'desktop-800' : 'mobile-320'}.png`;
        await page.screenshot({ path: join(rtlShotDir, filename), fullPage: true });
        rtlVisual.push({
          ...testCase,
          locale,
          width,
          screenshot: `screenshots/rtl/${filename}`,
          status: measurement.dir === 'rtl' && !measurement.documentOverflow && !measurement.elementOverflow ? 'PASS' : 'FAIL',
          ...measurement,
        });
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

const summaries = {
  structural: {
    renders: staticAudits.length,
    failedRenders: staticAudits.filter(({ failCount }) => failCount > 0).length,
    failedChecks: staticAudits.reduce((total, audit) => total + audit.failCount, 0),
  },
  responsive: {
    checks: responsive.length,
    failed: responsive.filter(({ status }) => status === 'FAIL').length,
  },
  stress: {
    checks: stress.length,
    failed: stress.filter(({ status }) => status === 'FAIL').length,
  },
  blockedImages: {
    checks: blockedImages.length,
    failed: blockedImages.filter(({ status }) => status === 'FAIL').length,
  },
  rtlVisual: {
    checks: rtlVisual.length,
    failed: rtlVisual.filter(({ status }) => status === 'FAIL').length,
  },
  traceability: {
    checks: traceabilityChecks.length,
    failed: traceabilityChecks.filter(({ status }) => status === 'FAIL').length,
  },
  financialFixtures: {
    checks: financialFixtures.length,
    failed: financialFixtures.filter(({ status }) => status === 'FAIL').length,
  },
};

const report = {
  generatedAt: new Date().toISOString(),
  scope: 'Exact owner-authorized 20-template HTML Preview batch',
  widths,
  catalogChecks,
  summaries,
  contrastResults,
  screenshots,
  staticAudits,
  responsive,
  stress,
  blockedImages,
  rtlVisual,
  traceabilityChecks,
  financialFixtures,
  levelB: {
    gmail: 'NOT RUN',
    outlook: 'NOT RUN',
    appleMail: 'NOT RUN',
  },
};
writeFileSync(join(outDir, 'batch20-qa-results.json'), `${JSON.stringify(report, null, 2)}\n`);

const failed = !catalogChecks.exactBatch
  || catalogChecks.physical !== 59
  || catalogChecks.excluded !== 11
  || catalogChecks.inScope !== 48
  || catalogChecks.designed !== 33
  || catalogChecks.undesigned !== 15
  || Object.values(summaries).some(({ failed, failedChecks, failedRenders }) => (failed || failedChecks || failedRenders) > 0)
  || contrastResults.some(({ status }) => status === 'FAIL');

console.log(JSON.stringify({
  catalogChecks,
  summaries,
  contrastResults,
  screenshots: screenshots.length,
  rtlScreenshots: rtlVisual.length,
  status: failed ? 'FAIL' : 'PASS',
}, null, 2));
process.exit(failed ? 1 : 0);
