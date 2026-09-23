/**
 * Task 02 — Independent visual QA capture for Account Activation.
 * Read-only: drives the running preview at localhost:54701; does not modify templates.
 * Output: screenshots + measurements JSON under this directory.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = dirname(fileURLToPath(import.meta.url));
const shotDir = join(root, 'screenshots');
mkdirSync(shotDir, { recursive: true });

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://localhost:54701/';

/** Required matrix from Task 02 brief */
const matrix = [
  { id: 'desktop-en-800', locale: 'en', viewport: '800', long: false, blocked: false },
  { id: 'desktop-fr-800', locale: 'fr', viewport: '800', long: false, blocked: false },
  { id: 'desktop-es-800', locale: 'es', viewport: '800', long: false, blocked: false },
  { id: 'desktop-ar-800', locale: 'ar', viewport: '800', long: false, blocked: false },
  { id: 'desktop-fa-800', locale: 'fa', viewport: '800', long: false, blocked: false },
  { id: 'tablet-en-768', locale: 'en', viewport: '768', long: false, blocked: false },
  { id: 'mobile-en-414', locale: 'en', viewport: '414', long: false, blocked: false },
  { id: 'mobile-en-375', locale: 'en', viewport: '375', long: false, blocked: false },
  { id: 'mobile-en-320', locale: 'en', viewport: '320', long: false, blocked: false },
  { id: 'mobile-ar-375', locale: 'ar', viewport: '375', long: false, blocked: false },
  { id: 'mobile-fa-320', locale: 'fa', viewport: '320', long: false, blocked: false },
  { id: 'images-blocked-en-600', locale: 'en', viewport: '600', long: false, blocked: true },
  { id: 'long-copy-en-320', locale: 'en', viewport: '320', long: true, blocked: false },
];

const results = [];

function contrastRatio(fg, bg) {
  const lum = (hex) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    const f = (x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const L1 = lum(fg);
  const L2 = lum(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 1400 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForSelector('#emailSelect');

// Ensure activate_email is selected
await page.selectOption('#emailSelect', 'activate_email');
await page.waitForTimeout(200);

const availableLocales = await page.$$eval('#localeSelect option', (opts) =>
  opts.map((o) => o.value),
);
const availableViewports = await page.$$eval('#viewportSelect option', (opts) =>
  opts.map((o) => o.value),
);

console.log('Available locales:', availableLocales.join(', '));
console.log('Available viewports:', availableViewports.join(', '));

for (const caseDef of matrix) {
  const entry = {
    id: caseDef.id,
    locale: caseDef.locale,
    viewport: Number(caseDef.viewport),
    longContent: caseDef.long,
    blockedImages: caseDef.blocked,
    status: 'PENDING',
    screenshot: null,
    notes: [],
    measurements: null,
  };

  if (!availableLocales.includes(caseDef.locale)) {
    entry.status = 'BLOCKED';
    entry.notes.push(
      `Locale "${caseDef.locale}" is not present in preview #localeSelect (available: ${availableLocales.join(', ')}). Cannot visually QA this variant.`,
    );
    results.push(entry);
    console.log(`[BLOCKED] ${caseDef.id} — locale missing`);
    continue;
  }

  await page.selectOption('#localeSelect', caseDef.locale);
  await page.selectOption('#viewportSelect', caseDef.viewport);
  await page.locator('#blockedImages').setChecked(caseDef.blocked);
  await page.locator('#longContent').setChecked(caseDef.long);
  // Change events fire on select; ensure render
  await page.click('#btnRefresh');
  await page.waitForTimeout(500);

  // Wait for iframe srcdoc content
  const frame = page.frameLocator('#previewFrame');
  await frame.locator('body').waitFor({ timeout: 10000 });
  await page.waitForTimeout(400);

  const shotPath = join(shotDir, `${caseDef.id}.png`);
  // Capture the viewport chrome + email frame area
  const chrome = page.locator('.viewport-chrome');
  await chrome.screenshot({ path: shotPath });
  entry.screenshot = shotPath.replace(/\\/g, '/');

  // Full-page stage screenshot as secondary evidence
  const stagePath = join(shotDir, `${caseDef.id}-stage.png`);
  await page.locator('main.stage').screenshot({ path: stagePath });
  entry.stageScreenshot = stagePath.replace(/\\/g, '/');

  // Measurements inside iframe
  const iframeEl = await page.$('#previewFrame');
  const iframe = await iframeEl.contentFrame();
  const measurements = await iframe.evaluate(() => {
    const doc = document;
    const container = doc.querySelector('.email-container') || doc.querySelector('table[width="600"]') || doc.querySelector('table');
    const logo = doc.querySelector('img');
    const cta = doc.querySelector('a[href]');
    const h1 = doc.querySelector('h1');
    const preheaderVisible = Array.from(doc.querySelectorAll('*')).some(
      (el) => el.textContent && /^Preheader:/i.test(el.textContent.trim()) && el.offsetParent !== null && getComputedStyle(el).opacity !== '0',
    );
    // Hidden preheader: look for display:none / max-height:0 pattern
    const hiddenPre = Array.from(doc.querySelectorAll('div')).find((el) => {
      const s = getComputedStyle(el);
      return (
        (s.display === 'none' || s.maxHeight === '0px' || s.opacity === '0') &&
        el.textContent &&
        /activate/i.test(el.textContent)
      );
    });

    const bodyScrollW = doc.documentElement.scrollWidth;
    const bodyClientW = doc.documentElement.clientWidth;
    const bodyOverflowX = bodyScrollW > bodyClientW + 1;

    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        w: Math.round(r.width * 100) / 100,
        h: Math.round(r.height * 100) / 100,
        x: Math.round(r.x * 100) / 100,
        y: Math.round(r.y * 100) / 100,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        textAlign: cs.textAlign,
        direction: cs.direction || doc.documentElement.dir,
        alt: el.getAttribute('alt'),
        src: el.getAttribute('src'),
        href: el.getAttribute('href'),
        naturalWidth: el.naturalWidth || null,
        naturalHeight: el.naturalHeight || null,
        complete: el.complete ?? null,
      };
    };

    // Find CTA by yellow-ish parent or button text
    let ctaEl = null;
    for (const a of doc.querySelectorAll('a')) {
      const t = (a.textContent || '').toLowerCase();
      if (/activate|تفعيل|فعال/.test(t) || a.href.includes('activate')) {
        ctaEl = a;
        break;
      }
    }
    if (!ctaEl) ctaEl = cta;

    const logoEl = logo;
    const containerEl =
      doc.querySelector('table.email-container') ||
      Array.from(doc.querySelectorAll('table')).find((t) => {
        const w = t.getAttribute('width') || t.style.maxWidth;
        return w === '600' || String(w).includes('600');
      });

    return {
      htmlLang: doc.documentElement.lang,
      htmlDir: doc.documentElement.dir,
      bodyScrollWidth: bodyScrollW,
      bodyClientWidth: bodyClientW,
      bodyOverflowX,
      iframeInnerWidth: window.innerWidth,
      container: rect(containerEl),
      containerMaxWidthStyle: containerEl ? getComputedStyle(containerEl).maxWidth : null,
      containerWidthAttr: containerEl?.getAttribute('width') || null,
      logo: rect(logoEl),
      logoBroken: logoEl ? !logoEl.complete || logoEl.naturalWidth === 0 : true,
      h1: rect(h1),
      cta: rect(ctaEl),
      ctaParentBg: ctaEl?.parentElement ? getComputedStyle(ctaEl.parentElement).backgroundColor : null,
      visiblePreheaderLabel: preheaderVisible,
      hasHiddenPreheader: !!hiddenPre,
      hiddenPreheaderText: hiddenPre ? hiddenPre.textContent.trim().slice(0, 120) : null,
      title: doc.title,
    };
  });

  // Also check frame wrap overflow vs page
  const chromeMetrics = await page.evaluate(() => {
    const wrap = document.getElementById('frameWrap');
    const frame = document.getElementById('previewFrame');
    const annotation = document.getElementById('previewAnnotation');
    return {
      wrapWidth: wrap?.getBoundingClientRect().width ?? null,
      wrapScrollWidth: wrap?.scrollWidth ?? null,
      wrapOverflowX: wrap ? wrap.scrollWidth > wrap.clientWidth + 1 : null,
      frameWidth: frame?.getBoundingClientRect().width ?? null,
      annotationOutside: annotation ? !annotation.hidden : null,
      annotationText: annotation && !annotation.hidden ? annotation.textContent.trim().slice(0, 160) : null,
    };
  });

  entry.measurements = { ...measurements, chrome: chromeMetrics };
  entry.contrast = {
    ctaTextOnYellow: contrastRatio('#4d4c49', '#e9d023'),
    bodyOnWhite: contrastRatio('#4d4c49', '#ffffff'),
    headingOnWhite: contrastRatio('#2b2a28', '#ffffff'),
  };

  // Heuristic status
  const issues = [];
  if (measurements.bodyOverflowX) issues.push('Horizontal overflow inside email iframe');
  if (chromeMetrics.wrapOverflowX) issues.push('Horizontal overflow on frame wrap');
  if (measurements.logoBroken && !caseDef.blocked) issues.push('Logo image appears broken');
  if (measurements.cta && (measurements.cta.h < 44 || measurements.cta.w < 44)) {
    issues.push(`CTA clickable area below 44px (got ${measurements.cta.w}x${measurements.cta.h})`);
  }
  if (measurements.visiblePreheaderLabel) issues.push('Visible "Preheader:" row found inside email');
  if (!measurements.hasHiddenPreheader) issues.push('Hidden inbox preheader not detected');
  if (measurements.container && measurements.container.w > 601) {
    issues.push(`Container wider than 600px (${measurements.container.w})`);
  }

  entry.notes.push(...issues);
  entry.status = issues.length ? 'FAIL' : 'PASS';
  results.push(entry);
  console.log(`[${entry.status}] ${caseDef.id} → ${shotPath}`);
}

// Additional EN desktop deep dump: font stacks + footer + CTA href
await page.selectOption('#localeSelect', 'en');
await page.selectOption('#viewportSelect', '800');
await page.locator('#blockedImages').setChecked(false);
await page.locator('#longContent').setChecked(false);
await page.click('#btnRefresh');
await page.waitForTimeout(400);
const iframeEl = await page.$('#previewFrame');
const iframe = await iframeEl.contentFrame();
const deep = await iframe.evaluate(() => {
  const css = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight,
      color: s.color,
      textAlign: s.textAlign,
    };
  };
  const links = Array.from(document.querySelectorAll('a')).map((a) => ({
    href: a.href,
    text: a.textContent.trim(),
  }));
  return {
    h1: css(document.querySelector('h1')),
    bodyP: css(document.querySelector('p')),
    cta: (() => {
      const a = document.querySelector('a[href*="activate"]');
      return a ? { ...css(a), href: a.href, box: a.getBoundingClientRect().toJSON() } : null;
    })(),
    links,
    footerHtml: document.querySelector('td[style*="border-top"]')?.innerText || null,
    logoAlt: document.querySelector('img')?.alt || null,
    logoSrc: document.querySelector('img')?.getAttribute('src') || null,
  };
});

const summary = {
  testedAt: new Date().toISOString(),
  previewUrl: PREVIEW_URL,
  browser: 'Playwright Chromium (headless)',
  availableLocales,
  availableViewports,
  cases: results,
  deepEnDesktop800: deep,
  contrastNotes: {
    formula: 'WCAG relative luminance',
    ctaDarkOnYellow: contrastRatio('#4d4c49', '#e9d023'),
    bodyOnWhite: contrastRatio('#4d4c49', '#ffffff'),
    headingOnWhite: contrastRatio('#2b2a28', '#ffffff'),
  },
};

writeFileSync(join(root, 'measurements.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log('Wrote measurements.json');
await browser.close();
