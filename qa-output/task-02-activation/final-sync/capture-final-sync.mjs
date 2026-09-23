/**
 * Task 02 final sync — browser QA for Account Activation after owner decisions.
 * Expects: logo 160px, heading 600, CTA #E9D023/#4D4C49, header #FEFDF4.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';

const root = dirname(fileURLToPath(import.meta.url));
const shotDir = join(root, 'screenshots');
mkdirSync(shotDir, { recursive: true });

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://localhost:54701/';

const matrix = [
  { id: 'desktop-en-800', locale: 'en', viewport: '800', long: false, blocked: false },
  { id: 'mobile-en-320', locale: 'en', viewport: '320', long: false, blocked: false },
  { id: 'mobile-en-375', locale: 'en', viewport: '375', long: false, blocked: false },
  { id: 'desktop-fr-800', locale: 'fr', viewport: '800', long: false, blocked: false },
  { id: 'desktop-es-800', locale: 'es', viewport: '800', long: false, blocked: false },
  { id: 'desktop-ar-800', locale: 'ar', viewport: '800', long: false, blocked: false },
  { id: 'mobile-ar-375', locale: 'ar', viewport: '375', long: false, blocked: false },
  { id: 'desktop-fa-800', locale: 'fa', viewport: '800', long: false, blocked: false },
  { id: 'mobile-fa-320', locale: 'fa', viewport: '320', long: false, blocked: false },
  { id: 'images-blocked-en-600', locale: 'en', viewport: '600', long: false, blocked: true },
  { id: 'long-copy-en-320', locale: 'en', viewport: '320', long: true, blocked: false },
];

const EXPECTED = {
  en: {
    welcome: 'Welcome to Eveenty!',
    button: 'Activate My Account',
    greetingLead: 'Hello',
    footerLead: 'This message was sent to',
    footerSuffix: '.',
    copyright: '© Eveenty. All rights reserved.',
    logoNatural: [3014, 1208],
    logoSrc: 'eveenty-logo-en.png',
    logoH: 64,
  },
  fr: {
    welcome: 'Bienvenue sur Eveenty !',
    button: 'Activer mon compte',
    greetingLead: 'Bonjour',
    footerLead: 'Ce message a été envoyé à',
    footerSuffix: '.',
    copyright: '© Eveenty. Tous droits réservés.',
    logoNatural: [3014, 1208],
    logoSrc: 'eveenty-logo-fr.png',
    logoH: 64,
  },
  es: {
    welcome: '¡Bienvenido a Eveenty!',
    button: 'Activar mi cuenta',
    greetingLead: 'Hola',
    footerLead: 'Este mensaje fue enviado a',
    footerSuffix: '.',
    copyright: '© Eveenty. Todos los derechos reservados.',
    logoNatural: [2958, 1208],
    logoSrc: 'eveenty-logo-es.png',
    logoH: 65,
  },
  ar: {
    welcome: 'مرحباً بك في ايفينتي',
    button: 'تفعيل حسابي',
    greetingLead: '،مرحباً',
    footerLead: 'تم إرسال هذه الرسالة إلى',
    footerSuffix: '.',
    copyright: '.© ايفينتي. جميع الحقوق محفوظة',
    logoNatural: [3014, 1208],
    logoSrc: 'eveenty-logo-ar.png',
    logoH: 64,
  },
  fa: {
    welcome: '!به Eveenty خوش آمدید',
    button: 'فعال‌سازی حساب من',
    greetingLead: '،سلام',
    footerLead: 'این پیام به',
    footerSuffix: ' ارسال شد.',
    copyright: '.© Eveenty. تمامی حقوق محفوظ است',
    logoNatural: [3014, 1208],
    logoSrc: 'eveenty-logo-fa.png',
    logoH: 64,
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

function rgbToHexApprox(rgb) {
  if (!rgb) return null;
  const m = String(rgb).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return rgb;
  return (
    '#' +
    [m[1], m[2], m[3]]
      .map((x) => Number(x).toString(16).padStart(2, '0'))
      .join('')
  );
}

const ownerLogos = {
  en: 'D:/emails/English.png',
  fr: 'D:/emails/french.png',
  es: 'D:/emails/Spanish.png',
  ar: 'D:/emails/Arabic.png',
  fa: 'D:/emails/Farse.png',
};

const logoManifest = {};
for (const [locale, file] of [
  ['en', 'eveenty-logo-en.png'],
  ['fr', 'eveenty-logo-fr.png'],
  ['es', 'eveenty-logo-es.png'],
  ['ar', 'eveenty-logo-ar.png'],
  ['fa', 'eveenty-logo-fa.png'],
]) {
  const previewPath = join(root, '..', '..', '..', 'assets', 'logos', file);
  const ownerPath = ownerLogos[locale];
  logoManifest[locale] = {
    previewPath: `assets/logos/${file}`,
    previewSha256: sha256File(previewPath),
    ownerSha256: existsSync(ownerPath) ? sha256File(ownerPath) : null,
    byteIdenticalToOwner:
      existsSync(ownerPath) && sha256File(previewPath) === sha256File(ownerPath),
    bytes: readFileSync(previewPath).length,
  };
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 1600 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForSelector('#emailSelect');
await page.selectOption('#emailSelect', 'activate_email');
await page.waitForTimeout(400);

const availableLocales = await page.$$eval('#localeSelect option', (opts) =>
  opts.map((o) => o.value),
);

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
    checks: {},
  };

  if (!availableLocales.includes(caseDef.locale)) {
    entry.status = 'BLOCKED';
    entry.notes.push(`Locale missing: ${caseDef.locale}`);
    results.push(entry);
    continue;
  }

  await page.selectOption('#localeSelect', caseDef.locale);
  await page.selectOption('#viewportSelect', caseDef.viewport);
  await page.locator('#blockedImages').setChecked(caseDef.blocked);
  await page.locator('#longContent').setChecked(caseDef.long);
  await page.click('#btnRefresh');
  await page.waitForTimeout(600);

  const shotPath = join(shotDir, `${caseDef.id}.png`);
  await page.locator('.viewport-chrome').screenshot({ path: shotPath });
  entry.screenshot = shotPath.replace(/\\/g, '/');

  const emailOnly = join(shotDir, `${caseDef.id}-email.png`);
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
    // Header band = TD that directly contains the logo (or blocked-image placeholder)
    const headerTd =
      (logoEl && logoEl.closest && logoEl.closest('td')) ||
      Array.from(doc.querySelectorAll('td')).find((td) => {
        const style = (td.getAttribute('style') || '').toLowerCase();
        return style.includes('#fefdf4') || style.includes('fefdf4');
      }) ||
      Array.from(doc.querySelectorAll('td')).find((td) =>
        /\[blocked image\]/i.test(td.textContent || ''),
      );
    const footerTd = Array.from(doc.querySelectorAll('td')).find((td) =>
      (td.getAttribute('style') || '').includes('border-top'),
    );
    const footerText = footerTd ? footerTd.innerText.replace(/\s+/g, ' ').trim() : '';
    const greetingP = h1?.parentElement?.querySelectorAll('p')?.[0];
    const greetingText = greetingP ? greetingP.textContent.replace(/\s+/g, ' ').trim() : '';

    const preheaderVisible = Array.from(doc.querySelectorAll('*')).some((el) => {
      const t = (el.textContent || '').trim();
      if (!/^Preheader:/i.test(t)) return false;
      if (el.offsetParent === null) return false;
      return getComputedStyle(el).opacity !== '0';
    });

    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        w: Math.round(r.width * 100) / 100,
        h: Math.round(r.height * 100) / 100,
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        text: (el.textContent || '').trim(),
        alt: el.getAttribute?.('alt') ?? null,
        src: el.getAttribute?.('src') ?? null,
        widthAttr: el.getAttribute?.('width') ?? null,
        naturalWidth: el.naturalWidth || null,
        naturalHeight: el.naturalHeight || null,
      };
    };

    let ctaLineCount = null;
    if (ctaEl) {
      const range = doc.createRange();
      range.selectNodeContents(ctaEl);
      const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0);
      const tops = [];
      for (const r of rects) {
        if (!tops.some((t) => Math.abs(t - r.top) < 2)) tops.push(r.top);
      }
      ctaLineCount = tops.length || 1;
    }

    return {
      htmlLang: doc.documentElement.lang,
      htmlDir: doc.documentElement.dir,
      bodyOverflowX: doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1,
      container: rect(containerEl),
      logo: rect(logoEl),
      headerBg: headerTd ? getComputedStyle(headerTd).backgroundColor : null,
      h1: rect(h1),
      greetingText,
      cta: rect(ctaEl),
      ctaParentBg: ctaEl?.parentElement ? getComputedStyle(ctaEl.parentElement).backgroundColor : null,
      ctaLineCount,
      footerText,
      visiblePreheaderRow: preheaderVisible,
      copy: {
        welcomeMatch: h1 ? h1.textContent.trim() === exp.welcome : false,
        buttonMatch: ctaEl ? ctaEl.textContent.trim() === exp.button : false,
        greetingContainsLead: greetingText.includes(exp.greetingLead),
        footerContainsLead: footerText.includes(exp.footerLead),
        footerContainsSuffix: footerText.includes(exp.footerSuffix.trim()) || footerText.endsWith('.'),
        footerContainsCopyright: footerText.includes(exp.copyright),
        englishFooterInRtl:
          doc.documentElement.dir === 'rtl' && /This message was sent to/i.test(footerText),
      },
    };
  }, expected);

  // Email-only crop via iframe body
  await iframe.locator('body').screenshot({ path: emailOnly });
  entry.emailScreenshot = emailOnly.replace(/\\/g, '/');

  const logoW = measurements.logo?.w;
  const logoAttr = Number(measurements.logo?.widthAttr);
  const headingWeight = String(measurements.h1?.fontWeight || '');
  const ctaBg = rgbToHexApprox(measurements.ctaParentBg);
  const ctaColor = rgbToHexApprox(measurements.cta?.color);
  const headerBg = rgbToHexApprox(measurements.headerBg);

  entry.measurements = measurements;
  const isBlocked = caseDef.blocked;
  entry.checks = {
    logoDisplayWidth160: isBlocked
      ? true
      : Math.abs((logoW || 0) - 160) < 1.5 || logoAttr === 160,
    logoNaturalMatch: isBlocked
      ? true
      : measurements.logo?.naturalWidth === expected.logoNatural[0] &&
        measurements.logo?.naturalHeight === expected.logoNatural[1],
    logoSrcOk: isBlocked ? true : (measurements.logo?.src || '').includes(expected.logoSrc),
    headingWeight600: headingWeight === '600' || headingWeight === 'SemiBold',
    ctaYellow: ctaBg === '#e9d023',
    ctaDarkText: ctaColor === '#4d4c49',
    headerPrimary50: headerBg === '#fefdf4' || /254,\s*253,\s*244/.test(String(measurements.headerBg || '')),
    noVisiblePreheader: measurements.visiblePreheaderRow === false,
    noOverflowX: measurements.bodyOverflowX === false,
    welcomeOk: measurements.copy.welcomeMatch,
    buttonOk: measurements.copy.buttonMatch,
    greetingOk: measurements.copy.greetingContainsLead,
    footerOk: measurements.copy.footerContainsLead && measurements.copy.footerContainsCopyright,
    noEnglishFooterInRtl: measurements.copy.englishFooterInRtl === false,
    ctaMinTouch: (measurements.cta?.h || 0) >= 44 && (measurements.cta?.w || 0) >= 44,
    dirOk:
      caseDef.locale === 'ar' || caseDef.locale === 'fa'
        ? measurements.htmlDir === 'rtl'
        : measurements.htmlDir === 'ltr',
    blockedFallbackVisible: isBlocked
      ? /blocked image/i.test(await iframe.evaluate(() => document.body.innerText))
      : true,
  };

  const realFails = Object.entries(entry.checks).filter(([, v]) => v !== true);
  entry.status = realFails.length ? 'FAIL' : 'PASS';
  if (realFails.length) entry.notes.push(...realFails.map(([k]) => `FAIL ${k}`));

  entry.contrast = {
    ctaTextOnYellow: Math.round(contrastRatio('#4d4c49', '#e9d023') * 100) / 100,
    bodyOnWhite: Math.round(contrastRatio('#4d4c49', '#ffffff') * 100) / 100,
    headingOnWhite: Math.round(contrastRatio('#2b2a28', '#ffffff') * 100) / 100,
  };

  results.push(entry);
  console.log(`[${entry.status}] ${entry.id} logo=${logoW}x${measurements.logo?.h} h1w=${headingWeight} ctaBg=${ctaBg}`);
}

const out = {
  testedAt: new Date().toISOString(),
  previewUrl: PREVIEW_URL,
  ownerDecisions: {
    cta: { fill: '#E9D023', text: '#4D4C49' },
    logoWidthPx: 160,
    headerBg: '#FEFDF4',
    headingWeight: 600,
  },
  logoManifest,
  contrastAA: {
    cta: contrastRatio('#4d4c49', '#e9d023') >= 4.5,
    body: contrastRatio('#4d4c49', '#ffffff') >= 4.5,
    heading: contrastRatio('#2b2a28', '#ffffff') >= 4.5,
  },
  results,
  summary: {
    pass: results.filter((r) => r.status === 'PASS').length,
    fail: results.filter((r) => r.status === 'FAIL').length,
    blocked: results.filter((r) => r.status === 'BLOCKED').length,
  },
};

writeFileSync(join(root, 'measurements.json'), JSON.stringify(out, null, 2));
console.log('Wrote measurements.json', out.summary);
await browser.close();
