/**
 * Task 02 remediation — retest Account Activation after preview fixes.
 * Writes screenshots + measurements under this remediation/ folder.
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const root = dirname(fileURLToPath(import.meta.url));
const shotDir = join(root, 'screenshots');
const beforeDir = join(root, 'before');
mkdirSync(shotDir, { recursive: true });
mkdirSync(beforeDir, { recursive: true });

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://localhost:4173/';
const priorShotRoot = join(root, '..', 'screenshots');

/** Copy prior QA shots as before/ evidence when available */
const beforeMap = [
  'desktop-en-800',
  'desktop-ar-800',
  'desktop-fa-800',
  'mobile-en-320',
  'mobile-ar-375',
  'mobile-fa-320',
];
for (const id of beforeMap) {
  const src = join(priorShotRoot, `${id}.png`);
  if (existsSync(src)) copyFileSync(src, join(beforeDir, `${id}.png`));
}

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

const EXPECTED = {
  en: {
    welcome: 'Welcome to Eveenty!',
    button: 'Activate My Account',
    footerLead: 'This message was sent to',
    copyright: '© Eveenty. All rights reserved.',
    logoNatural: [3014, 1208],
    logoSrc: 'eveenty-logo-en.png',
  },
  fr: {
    welcome: 'Bienvenue sur Eveenty !',
    button: 'Activer mon compte',
    footerLead: 'Ce message a été envoyé à',
    copyright: '© Eveenty. Tous droits réservés.',
    logoNatural: [3014, 1208],
    logoSrc: 'eveenty-logo-fr.png',
  },
  es: {
    welcome: '¡Bienvenido a Eveenty!',
    button: 'Activar mi cuenta',
    footerLead: 'Este mensaje fue enviado a',
    copyright: '© Eveenty. Todos los derechos reservados.',
    logoNatural: [2958, 1208],
    logoSrc: 'eveenty-logo-es.png',
  },
  ar: {
    welcome: 'مرحباً بك في ايفينتي',
    button: 'تفعيل حسابي',
    footerLead: 'تم إرسال هذه الرسالة إلى',
    copyright: '.© ايفينتي. جميع الحقوق محفوظة',
    logoNatural: [3014, 1208],
    logoSrc: 'eveenty-logo-ar.png',
  },
  fa: {
    welcome: '!به Eveenty خوش آمدید',
    button: 'فعال‌سازی حساب من',
    footerLead: 'این پیام به',
    copyright: '.© Eveenty. تمامی حقوق محفوظ است',
    logoNatural: [3014, 1208],
    logoSrc: 'eveenty-logo-fa.png',
  },
};

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
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();
}

const logoManifest = {};
for (const [locale, file] of [
  ['en', 'eveenty-logo-en.png'],
  ['fr', 'eveenty-logo-fr.png'],
  ['es', 'eveenty-logo-es.png'],
  ['ar', 'eveenty-logo-ar.png'],
  ['fa', 'eveenty-logo-fa.png'],
]) {
  const p = join(root, '..', '..', '..', 'assets', 'logos', file);
  logoManifest[locale] = {
    previewPath: `assets/logos/${file}`,
    sha256: sha256File(p),
    bytes: readFileSync(p).length,
  };
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 1400 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForSelector('#emailSelect');
await page.selectOption('#emailSelect', 'activate_email');
await page.waitForTimeout(300);

const availableLocales = await page.$$eval('#localeSelect option', (opts) =>
  opts.map((o) => o.value),
);
const availableViewports = await page.$$eval('#viewportSelect option', (opts) =>
  opts.map((o) => o.value),
);

console.log('Available locales:', availableLocales.join(', '));
console.log('Available viewports:', availableViewports.join(', '));

const results = [];

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
    entry.notes.push(`Locale "${caseDef.locale}" missing from #localeSelect`);
    results.push(entry);
    console.log(`[BLOCKED] ${caseDef.id}`);
    continue;
  }

  await page.selectOption('#localeSelect', caseDef.locale);
  await page.selectOption('#viewportSelect', caseDef.viewport);
  await page.locator('#blockedImages').setChecked(caseDef.blocked);
  await page.locator('#longContent').setChecked(caseDef.long);
  await page.click('#btnRefresh');
  await page.waitForTimeout(500);

  const frame = page.frameLocator('#previewFrame');
  await frame.locator('body').waitFor({ timeout: 10000 });
  await page.waitForTimeout(400);

  const shotPath = join(shotDir, `${caseDef.id}.png`);
  await page.locator('.viewport-chrome').screenshot({ path: shotPath });
  entry.screenshot = shotPath.replace(/\\/g, '/');

  const stagePath = join(shotDir, `${caseDef.id}-stage.png`);
  await page.locator('main.stage').screenshot({ path: stagePath });
  entry.stageScreenshot = stagePath.replace(/\\/g, '/');

  const iframeEl = await page.$('#previewFrame');
  const iframe = await iframeEl.contentFrame();
  const expected = EXPECTED[caseDef.locale];

  const measurements = await iframe.evaluate((exp) => {
    const doc = document;
    const containerEl =
      doc.querySelector('table.email-container') ||
      Array.from(doc.querySelectorAll('table')).find((t) => {
        const w = t.getAttribute('width') || t.style.maxWidth;
        return w === '600' || String(w).includes('600');
      });
    const logoEl = doc.querySelector('img');
    const h1 = doc.querySelector('h1');
    let ctaEl = null;
    for (const a of doc.querySelectorAll('a')) {
      const t = (a.textContent || '').toLowerCase();
      if (/activate|activer|activar|تفعيل|فعال/.test(t) || (a.href && a.href.includes('activate'))) {
        ctaEl = a;
        break;
      }
    }
    const footerTd = Array.from(doc.querySelectorAll('td')).find((td) =>
      (td.getAttribute('style') || '').includes('border-top'),
    );
    const footerText = footerTd ? footerTd.innerText.replace(/\s+/g, ' ').trim() : '';

    const preheaderVisible = Array.from(doc.querySelectorAll('*')).some((el) => {
      if (!el.textContent || !/^Preheader:/i.test(el.textContent.trim())) return false;
      if (el.offsetParent === null) return false;
      return getComputedStyle(el).opacity !== '0';
    });
    const hiddenPre = Array.from(doc.querySelectorAll('div')).find((el) => {
      const s = getComputedStyle(el);
      return (
        (s.display === 'none' || s.maxHeight === '0px' || s.opacity === '0') &&
        el.textContent &&
        /activate|eveenty/i.test(el.textContent)
      );
    });

    const bodyScrollW = doc.documentElement.scrollWidth;
    const bodyClientW = doc.documentElement.clientWidth;

    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        w: Math.round(r.width * 100) / 100,
        h: Math.round(r.height * 100) / 100,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        textAlign: cs.textAlign,
        whiteSpace: cs.whiteSpace,
        alt: el.getAttribute?.('alt') ?? null,
        src: el.getAttribute?.('src') ?? null,
        href: el.getAttribute?.('href') ?? null,
        naturalWidth: el.naturalWidth || null,
        naturalHeight: el.naturalHeight || null,
        text: (el.textContent || '').trim(),
      };
    };

    // CTA line count via Range / client rects
    let ctaLineCount = null;
    if (ctaEl) {
      const range = doc.createRange();
      range.selectNodeContents(ctaEl);
      const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0);
      // Group by top within 2px
      const tops = [];
      for (const r of rects) {
        if (!tops.some((t) => Math.abs(t - r.top) < 2)) tops.push(r.top);
      }
      ctaLineCount = tops.length || 1;
    }

    return {
      htmlLang: doc.documentElement.lang,
      htmlDir: doc.documentElement.dir,
      bodyOverflowX: bodyScrollW > bodyClientW + 1,
      bodyScrollWidth: bodyScrollW,
      bodyClientWidth: bodyClientW,
      container: rect(containerEl),
      containerMaxWidthStyle: containerEl ? getComputedStyle(containerEl).maxWidth : null,
      logo: rect(logoEl),
      logoBroken: logoEl ? !logoEl.complete || logoEl.naturalWidth === 0 : true,
      h1: rect(h1),
      cta: rect(ctaEl),
      ctaLineCount,
      ctaParentBg: ctaEl?.parentElement ? getComputedStyle(ctaEl.parentElement).backgroundColor : null,
      footerText,
      visiblePreheaderLabel: preheaderVisible,
      hasHiddenPreheader: !!hiddenPre,
      hiddenPreheaderText: hiddenPre ? hiddenPre.textContent.trim().slice(0, 120) : null,
      title: doc.title,
      copyChecks: {
        welcomeMatch: h1 ? h1.textContent.trim() === exp.welcome : false,
        buttonMatch: ctaEl ? ctaEl.textContent.trim() === exp.button : false,
        footerContainsLead: footerText.includes(exp.footerLead),
        footerContainsCopyright: footerText.includes(exp.copyright),
        englishFooterFragment:
          doc.documentElement.dir === 'rtl' && /This message was sent to/i.test(footerText),
      },
    };
  }, expected);

  const chromeMetrics = await page.evaluate(() => {
    const wrap = document.getElementById('frameWrap');
    const annotation = document.getElementById('previewAnnotation');
    return {
      wrapWidth: wrap?.getBoundingClientRect().width ?? null,
      wrapOverflowX: wrap ? wrap.scrollWidth > wrap.clientWidth + 1 : null,
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

  const issues = [];
  if (measurements.bodyOverflowX) issues.push('Horizontal overflow inside email iframe');
  if (chromeMetrics.wrapOverflowX) issues.push('Horizontal overflow on frame wrap');
  if (measurements.logoBroken && !caseDef.blocked) issues.push('Logo image appears broken');
  if (measurements.cta && (measurements.cta.h < 44 || measurements.cta.w < 44)) {
    issues.push(`CTA clickable area below 44px (got ${measurements.cta.w}x${measurements.cta.h})`);
  }
  if (measurements.visiblePreheaderLabel) issues.push('Visible "Preheader:" row found inside email');
  if (!caseDef.blocked && !measurements.hasHiddenPreheader) {
    issues.push('Hidden inbox preheader not detected');
  }
  if (measurements.container && measurements.container.w > 601) {
    issues.push(`Container wider than 600px (${measurements.container.w})`);
  }
  if (!caseDef.long && !caseDef.blocked) {
    if (!measurements.copyChecks.welcomeMatch) {
      issues.push(`Welcome mismatch (got "${measurements.h1?.text}")`);
    }
    if (!measurements.copyChecks.buttonMatch) {
      issues.push(`Button mismatch (got "${measurements.cta?.text}")`);
    }
    if (!measurements.copyChecks.footerContainsLead) {
      issues.push('Footer missing localized lead from YAML');
    }
    if (!measurements.copyChecks.footerContainsCopyright) {
      issues.push('Footer missing localized copyright from YAML');
    }
    if (measurements.copyChecks.englishFooterFragment) {
      issues.push('English footer fragment still present in RTL locale');
    }
    if (
      !caseDef.blocked &&
      measurements.logo &&
      expected.logoNatural &&
      (measurements.logo.naturalWidth !== expected.logoNatural[0] ||
        measurements.logo.naturalHeight !== expected.logoNatural[1])
    ) {
      issues.push(
        `Logo natural size ${measurements.logo.naturalWidth}x${measurements.logo.naturalHeight} ≠ owner ${expected.logoNatural[0]}x${expected.logoNatural[1]}`,
      );
    }
    if (measurements.logo?.src && !measurements.logo.src.includes(expected.logoSrc)) {
      issues.push(`Logo src unexpected: ${measurements.logo.src}`);
    }
  }
  if (caseDef.id === 'mobile-en-320' && measurements.ctaLineCount > 1) {
    issues.push(`EN CTA still wraps to ${measurements.ctaLineCount} lines at 320px`);
  }

  entry.notes.push(...issues);
  entry.status = issues.length ? 'FAIL' : 'PASS';
  results.push(entry);
  console.log(`[${entry.status}] ${caseDef.id} ctaLines=${measurements.ctaLineCount} → ${shotPath}`);
}

// Deep dump per locale at 800
const deepByLocale = {};
for (const locale of ['en', 'fr', 'es', 'ar', 'fa']) {
  if (!availableLocales.includes(locale)) continue;
  await page.selectOption('#localeSelect', locale);
  await page.selectOption('#viewportSelect', '800');
  await page.locator('#blockedImages').setChecked(false);
  await page.locator('#longContent').setChecked(false);
  await page.click('#btnRefresh');
  await page.waitForTimeout(400);
  const iframeEl = await page.$('#previewFrame');
  const iframe = await iframeEl.contentFrame();
  deepByLocale[locale] = await iframe.evaluate(() => {
    const css = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        color: s.color,
        textAlign: s.textAlign,
      };
    };
    return {
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      h1: { ...css(document.querySelector('h1')), text: document.querySelector('h1')?.textContent.trim() },
      greeting: document.querySelectorAll('p')[0]?.textContent.trim() || null,
      body: document.querySelectorAll('p')[1]?.textContent.trim() || null,
      cta: (() => {
        const a = document.querySelector('a[href*="activate"]');
        return a
          ? { ...css(a), href: a.href, text: a.textContent.trim(), box: a.getBoundingClientRect().toJSON() }
          : null;
      })(),
      footerText: Array.from(document.querySelectorAll('td'))
        .find((td) => (td.getAttribute('style') || '').includes('border-top'))
        ?.innerText.replace(/\s+/g, ' ')
        .trim(),
      logoAlt: document.querySelector('img')?.alt || null,
      logoSrc: document.querySelector('img')?.getAttribute('src') || null,
      logoNatural: {
        w: document.querySelector('img')?.naturalWidth,
        h: document.querySelector('img')?.naturalHeight,
      },
    };
  });
}

const summary = {
  testedAt: new Date().toISOString(),
  previewUrl: PREVIEW_URL,
  browser: 'Playwright Chromium (headless)',
  availableLocales,
  availableViewports,
  logoManifest,
  cases: results,
  deepByLocale,
  contrastNotes: {
    formula: 'WCAG relative luminance',
    ctaDarkOnYellow: contrastRatio('#4d4c49', '#e9d023'),
    bodyOnWhite: contrastRatio('#4d4c49', '#ffffff'),
    headingOnWhite: contrastRatio('#2b2a28', '#ffffff'),
  },
  emailClients: 'NOT EXECUTED (Gmail / Outlook / Apple Mail)',
};

writeFileSync(join(root, 'measurements.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log('Wrote measurements.json');
await browser.close();
