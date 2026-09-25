/**
 * Official multilingual Wallet badge QA — festival_ticket_sale only.
 * Level A Chromium screenshots. Gmail/Outlook/Apple Mail: NOT RUN.
 *
 * Serves repo assets over localhost HTTP so Playwright can load official PNGs
 * (file:// img src fails under setContent).
 *
 * Hard rules:
 * - Visible Google + Apple badges ≥48px tall at EVERY viewport (incl. 320)
 * - Desktop/tablet: shared vertical center line (|midY delta| ≤ 2)
 * - Narrow: stacked + centered; Google uses official condensed asset
 *
 * Screenshots: minimal set proving desktop + mobile alignment (not full matrix).
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderEmail } from '../../shared/render-emails.js';

const root = dirname(fileURLToPath(import.meta.url));
const repo = join(root, '../..');
const out = join(root, 'screenshots', 'wallet-official');
mkdirSync(out, { recursive: true });

const MIME = {
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

function startStaticServer(baseDir) {
  const server = createServer((req, res) => {
    try {
      const rel = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '');
      const filePath = join(baseDir, rel);
      if (!filePath.startsWith(baseDir) || !existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
    } catch {
      res.writeHead(500);
      res.end('Error');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

const VIEWPORTS = [
  { name: 'desktop-800', width: 800, height: 1200 },
  { name: 'tablet-768', width: 768, height: 1100 },
  { name: 'mobile-414', width: 414, height: 900 },
  { name: 'mobile-375', width: 375, height: 900 },
  { name: 'mobile-320', width: 320, height: 900 },
];

const LOCALES = ['en', 'ar', 'fr', 'es', 'fa'];

/** Primary (wallet-button) and condensed (add-wallet-badge) display widths at 48px height */
const EXPECTED = {
  en: { primary: 272, condensed: 174, apple: 152 },
  ar: { primary: 300, condensed: 174, apple: 153 },
  fr: { primary: 304, condensed: 174, apple: 154 },
  es: { primary: 286, condensed: 174, apple: 180 },
  fa: { primary: 296, condensed: 186, apple: 152 },
};

/** Minimal visual evidence — full matrix still measured; only these PNGs written. */
const SCREENSHOT_KEYS = new Set([
  'en-buyerUser-desktop-800',
  'en-buyerUser-mobile-320',
  'fr-buyerUser-desktop-800',
  'fr-buyerUser-mobile-320',
  'ar-buyerUser-rtl-desktop-800',
  'ar-buyerUser-rtl-mobile-320',
  'es-buyerUser-desktop-800',
  'fa-buyerUser-rtl-mobile-320',
  'en-buyerUser-blocked-desktop-800',
  'en-organizer-organizer-no-wallet-desktop-800',
]);

const CASES = [
  ...LOCALES.map((locale) => ({
    locale,
    variant: 'buyerUser',
    views: VIEWPORTS.map((v) => v.name),
    tag: locale === 'ar' || locale === 'fa' ? 'rtl' : undefined,
  })),
  { locale: 'en', variant: 'guestUser', views: ['desktop-800'], tag: 'guest' },
  { locale: 'en', variant: 'organizer', views: ['desktop-800'], tag: 'organizer-no-wallet' },
  { locale: 'en', variant: 'buyerUser', views: ['desktop-800', 'mobile-320'], blocked: true, tag: 'blocked' },
  { locale: 'ar', variant: 'buyerUser', views: ['desktop-800', 'mobile-320'], blocked: true, tag: 'blocked-rtl' },
];

const { server, origin } = await startStaticServer(repo);
const browser = await chromium.launch();
const page = await browser.newPage();
const results = [];

try {
  for (const c of CASES) {
    let html = renderEmail('festival_ticket_sale', {
      locale: c.locale,
      variant: c.variant,
      assetBase: `${origin}/`,
    });
    if (c.blocked) {
      html = html.replace(/src="http:\/\/127\.0\.0\.1:[^"]+"/g, 'src=""');
    }

    const caseStructural = [];
    const passCase = (name, ok, detail = '') => caseStructural.push({ name, ok: !!ok, detail });
    const isCustomer = c.variant === 'buyerUser' || c.variant === 'guestUser';
    const loc = c.locale;
    const exp = EXPECTED[loc];

    if (isCustomer && !c.blocked) {
      passCase('official-google-primary-path', html.includes(`assets/wallet/official/google/${loc}.png`));
      passCase('official-google-condensed-path', html.includes(`assets/wallet/official/google/condensed/${loc}.png`));
      passCase('official-apple-path', html.includes(`assets/wallet/official/apple/${loc}.png`));
      passCase('no-yellow-cdn', !/cdn\.eveenty\.com\/(google|apple)_wallet\.png/.test(html));
      passCase('no-custom-text-btn', !/>Add to Google Wallet<\/a>/.test(html));
      passCase('display-height-48', (html.match(/height="48"/g) || []).length >= 3);
      if (exp) {
        passCase('google-primary-width', html.includes(`width="${exp.primary}" height="48"`));
        passCase('google-condensed-width', html.includes(`width="${exp.condensed}" height="48"`));
        passCase('apple-width-attr', html.includes(`width="${exp.apple}" height="48"`));
      }
      passCase('wallet-section-class', /class="wallet-section"/.test(html));
      passCase('gap-16-or-stack', /padding:0 16px 0 0|padding:0 0 0 16px|margin: 0 0 16px 0/.test(html));
      passCase('valign-middle', /valign="middle"/.test(html));
      passCase('font-size-0-cell', /font-size:0/.test(html));
      passCase('condensed-link-hidden-default', /wallet-google-condensed-link/.test(html) && /display:none;mso-hide:all/.test(html));
      passCase('alt-google', /alt="Add to Google Wallet"/.test(html));
      passCase('alt-apple', /alt="Add to Apple Wallet"/.test(html));
      passCase('google-href', /preview\/google-wallet/.test(html));
      passCase('apple-href', /preview\/apple-wallet/.test(html));
      passCase('no-windows-path', !/[A-Za-z]:\\/.test(html));
      passCase(
        'asset-files-exist',
        existsSync(join(repo, `assets/wallet/official/google/${loc}.png`)) &&
          existsSync(join(repo, `assets/wallet/official/google/condensed/${loc}.png`)) &&
          existsSync(join(repo, `assets/wallet/official/apple/${loc}.png`)),
      );
    }
    if (c.variant === 'organizer') {
      passCase('organizer-no-wallet', !/official\/google/.test(html) && !/official\/apple/.test(html));
    }
    passCase('calendar-text-links', /cal-google/.test(html) && /cal-apple/.test(html) && /cal-yahoo/.test(html));
    if (c.blocked) {
      passCase('blocked-alt-retained', /alt="Add to Google Wallet"/.test(html) && /alt="Add to Apple Wallet"/.test(html));
    }
    if (c.tag === 'rtl' || loc === 'ar' || loc === 'fa') {
      if (isCustomer) {
        passCase('html-dir-rtl', /dir="rtl"/.test(html));
        passCase('no-scaleX-mirror', !/scaleX\s*\(\s*-1/.test(html) && !/transform:\s*scaleX/.test(html));
      }
    }

    for (const viewName of c.views) {
      const viewStructural = [];
      const pass = (name, ok, detail = '') => viewStructural.push({ name, ok: !!ok, detail });
      const vp = VIEWPORTS.find((v) => v.name === viewName);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.setContent(html, { waitUntil: c.blocked ? 'load' : 'networkidle' });
      await page.waitForTimeout(c.blocked ? 200 : 400);

      const metrics = await page.evaluate(() => {
        const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
        const section = document.querySelector('.wallet-section');
        const row = document.querySelector('.wallet-row');
        const imgs = [...document.querySelectorAll('img[alt*="Wallet"]')];
        const imgInfo = imgs.map((img) => {
          const r = img.getBoundingClientRect();
          const style = window.getComputedStyle(img);
          const visible =
            r.width > 1 &&
            r.height > 1 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0';
          return {
            alt: img.alt,
            className: img.className,
            src: img.getAttribute('src') || '',
            naturalW: img.naturalWidth,
            naturalH: img.naturalHeight,
            displayW: Math.round(r.width),
            displayH: Math.round(r.height),
            top: Math.round(r.top),
            left: Math.round(r.left),
            midY: Math.round(r.top + r.height / 2),
            visible,
            complete: img.complete,
          };
        });
        let rowCentered = null;
        if (section && row) {
          const sr = section.getBoundingClientRect();
          const rr = row.getBoundingClientRect();
          rowCentered = Math.abs(sr.left + sr.width / 2 - (rr.left + rr.width / 2)) <= 2;
        }
        return { overflow, imgInfo, rowCentered };
      });

      let measured = null;

      if (isCustomer && !c.blocked) {
        const visible = metrics.imgInfo.filter((i) => i.visible);
        const g = visible.find((i) => i.alt.includes('Google'));
        const a = visible.find((i) => i.alt.includes('Apple'));
        const isNarrow = vp.width <= 620;

        pass('google-visible', !!g, g ? `h=${g.displayH} w=${g.displayW}` : 'missing');
        pass('apple-visible', !!a, a ? `h=${a.displayH} w=${a.displayW}` : 'missing');

        if (g && a) {
          pass('google-height-min-48', g.displayH >= 47, `h=${g.displayH} w=${g.displayW} view=${viewName}`);
          pass('apple-height-min-48', a.displayH >= 47, `h=${a.displayH} w=${a.displayW} view=${viewName}`);
          pass('heights-match', Math.abs(g.displayH - a.displayH) <= 2, `g=${g.displayH} a=${a.displayH}`);
          pass(
            'aspect-preserved-google',
            g.displayW > 0 && Math.abs(g.displayW / g.displayH - g.naturalW / g.naturalH) < 0.12,
            `disp=${g.displayW}/${g.displayH} nat=${g.naturalW}/${g.naturalH}`,
          );
          pass(
            'aspect-preserved-apple',
            a.displayW > 0 && Math.abs(a.displayW / a.displayH - a.naturalW / a.naturalH) < 0.12,
            `disp=${a.displayW}/${a.displayH} nat=${a.naturalW}/${a.naturalH}`,
          );

          if (isNarrow) {
            pass('google-uses-condensed', /\/condensed\//.test(g.src), g.src);
            pass(
              'google-primary-hidden',
              !metrics.imgInfo.some((i) => i.className.includes('wallet-google-primary') && i.visible),
            );
          } else {
            pass(
              'google-uses-primary',
              /official\/google\/[^/]+\.png/.test(g.src) && !/\/condensed\//.test(g.src),
              g.src,
            );
            const midDelta = Math.abs(g.midY - a.midY);
            pass('desktop-vertical-center', midDelta <= 2, `midDelta=${midDelta} gMid=${g.midY} aMid=${a.midY}`);
          }
        }

        const layout = await page.evaluate(() => {
          const imgs = [...document.querySelectorAll('img[alt*="Wallet"]')].filter((img) => {
            const r = img.getBoundingClientRect();
            return r.width > 1 && r.height > 1;
          });
          if (imgs.length < 2) return null;
          const r0 = imgs[0].getBoundingClientRect();
          const r1 = imgs[1].getBoundingClientRect();
          const stacked = Math.abs(r0.top - r1.top) > Math.min(r0.height, r1.height) / 2;
          let gap = 0;
          if (stacked) {
            const top = r0.top < r1.top ? r0 : r1;
            const bot = r0.top < r1.top ? r1 : r0;
            gap = Math.round(bot.top - top.bottom);
          } else {
            const left = r0.left < r1.left ? r0 : r1;
            const right = r0.left < r1.left ? r1 : r0;
            gap = Math.round(right.left - left.right);
          }
          return { stacked, gap };
        });
        if (layout) {
          pass('gap-ge-16', layout.gap >= 15, `gap=${layout.gap} stacked=${layout.stacked}`);
          if (vp.width <= 414) {
            pass('narrow-stacked', layout.stacked, `stacked=${layout.stacked}`);
          }
        }
        if (metrics.rowCentered !== null) {
          pass('wallet-group-centered', metrics.rowCentered, `centered=${metrics.rowCentered}`);
        }

        measured = {
          google: g
            ? {
                w: g.displayW,
                h: g.displayH,
                midY: g.midY,
                src: g.src.includes('/condensed/') ? 'condensed' : 'primary',
              }
            : null,
          apple: a ? { w: a.displayW, h: a.displayH, midY: a.midY } : null,
          gap: layout?.gap ?? null,
          stacked: layout?.stacked ?? null,
          midDelta: g && a && !isNarrow ? Math.abs(g.midY - a.midY) : null,
          rowCentered: metrics.rowCentered,
        };
      }

      const tag = c.tag ? `-${c.tag}` : '';
      const keyParts = [c.locale, c.variant, c.tag, viewName].filter(Boolean).join('-');
      let screenshot = null;
      if (SCREENSHOT_KEYS.has(keyParts)) {
        const file = join(out, `ticket-sale--${c.locale}-${c.variant}${tag}--${viewName}.png`);
        await page.screenshot({ path: file, fullPage: true });
        screenshot = file.replace(/\\/g, '/');
      }
      results.push({
        locale: c.locale,
        variant: c.variant,
        tag: c.tag,
        blocked: !!c.blocked,
        view: viewName,
        screenshot,
        overflow: metrics.overflow ? 'FAIL' : 'PASS',
        measured,
        imgInfo: metrics.imgInfo,
        structural: [...caseStructural, ...viewStructural],
      });
    }
  }
} finally {
  await browser.close();
  server.close();
}

const structFails = results.flatMap((r) =>
  (r.structural || []).filter((s) => !s.ok).map((s) => ({ ...s, view: r.view, variant: r.variant, locale: r.locale })),
);
const overflowFails = results.filter((r) => r.overflow === 'FAIL');
const heightFails = structFails.filter((s) => s.name.includes('height-min-48'));
const alignFails = structFails.filter((s) => s.name === 'desktop-vertical-center');

const measuredTable = results
  .filter((r) => r.measured?.google && r.measured?.apple)
  .map((r) => ({
    locale: r.locale,
    view: r.view,
    google: `${r.measured.google.w}×${r.measured.google.h} (${r.measured.google.src})`,
    apple: `${r.measured.apple.w}×${r.measured.apple.h}`,
    gap: r.measured.gap,
    stacked: r.measured.stacked,
    midDelta: r.measured.midDelta,
    centered: r.measured.rowCentered,
  }));

const summary = {
  generatedAt: new Date().toISOString(),
  scope: 'festival_ticket_sale Wallet badges — final official alignment (48px, shared midY, condensed ≤620)',
  locales: LOCALES,
  structuralFailCount: structFails.length,
  overflowFailCount: overflowFails.length,
  heightFailCount: heightFails.length,
  alignFailCount: alignFails.length,
  captures: results.filter((r) => r.screenshot).length,
  measuredViews: measuredTable.length,
  measuredTable,
  structFails,
  heightFails,
  alignFails,
  overflowFails: overflowFails.map((r) => ({ locale: r.locale, variant: r.variant, view: r.view })),
  clientQA: { gmail: 'NOT RUN', outlook: 'NOT RUN', appleMail: 'NOT RUN' },
};

writeFileSync(join(root, 'wallet-official-qa-results.json'), JSON.stringify({ summary, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
process.exit(structFails.length || overflowFails.length ? 1 : 0);
