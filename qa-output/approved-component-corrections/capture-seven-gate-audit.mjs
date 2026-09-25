/**
 * Final technical gate — Cards/Typography + focused regression (Level A Chromium).
 * Gmail / Outlook / Apple Mail: NOT RUN.
 * Does not regenerate discarded screenshot sets.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { chromium } from 'playwright';
import { renderEmail } from '../../shared/render-emails.js';
import { TOKENS as T } from '../../shared/tokens.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = join(root, 'qa-output/approved-component-corrections');

const IDS = [
  'activate_email',
  'dispute_notification',
  'festival_donation',
  'festival_marketing_email_target',
  'festival_ticket_registration_approval',
  'festival_ticket_sale',
  'support',
];

const FORBIDDEN_TEXT_COLORS = ['#898988', '#629a77', '#ad6f45', '#b75c5e'];

function extractColors(html) {
  const set = new Set();
  for (const m of html.matchAll(/#[0-9a-fA-F]{3,8}/g)) set.add(m[0].toLowerCase());
  return [...set].sort();
}

function auditHtml(id, html, source) {
  const findings = [];
  const classify = (sev, cat, msg) => findings.push({ sev, cat, msg, source });

  for (const c of FORBIDDEN_TEXT_COLORS) {
    if (html.toLowerCase().includes(c)) {
      classify('FAIL', 'B', `Rejected/forbidden color ${c} present`);
    }
  }
  if (/color:\s*#898988/i.test(html)) {
    classify('FAIL', 'B', 'Dark-50 #898988 used as text color');
  }
  if (!/max-width:\s*600px/.test(html)) {
    classify('FAIL', 'B', 'Missing 600px container max');
  }
  if (!/#ebebeb/i.test(html)) {
    classify('FAIL', 'B', 'Missing approved border #ebebeb');
  }
  if (!/#4d4c49/i.test(html)) {
    classify('FAIL', 'B', 'Missing Dark-500 body/muted');
  }
  if (/cta-yellow|padding:13px 24px/.test(html) || /background-color:#e9d023/i.test(html)) {
    if (/class="cta-yellow"/.test(html) || /min-height:48px/.test(html)) {
      if (!/padding:13px 24px/.test(html)) {
        classify('FAIL', 'B', 'Yellow primary CTA present without DS Large pad 13×24');
      }
      if (!/border-radius:12px/.test(html)) {
        classify('FAIL', 'B', 'Yellow primary CTA missing radius 12');
      }
    }
  }
  if (/#fffbeb/i.test(html)) {
    if (!/border-radius:16px/.test(html)) classify('FAIL', 'B', 'Warning alert missing radius 16');
    if (!/#92400e/i.test(html)) classify('FAIL', 'B', 'Warning alert missing AA #92400e');
  }
  if (/#fef2f2/i.test(html)) {
    if (!/border-radius:16px/.test(html)) classify('FAIL', 'B', 'Error alert missing radius 16');
    if (!/#991b1b/i.test(html)) classify('FAIL', 'B', 'Error alert missing title #991b1b');
  }
  if (/#f0fdf4/i.test(html)) {
    if (!/border-radius:16px/.test(html)) classify('FAIL', 'B', 'Success alert missing radius 16');
    if (!/#166534/i.test(html)) classify('FAIL', 'B', 'Success alert missing #166534');
  }
  if (id === 'festival_ticket_sale') {
    if (/cdn\.eveenty\.com\/(google|apple)_wallet/.test(html)) {
      classify('FAIL', 'B', 'Yellow CDN wallet images present');
    }
    if (!/assets\/wallet\/official\/google\//.test(html)) {
      classify('FAIL', 'B', 'Official Google badge path missing');
    }
    if (!/assets\/wallet\/official\/google\/condensed\//.test(html)) {
      classify('FAIL', 'B', 'Condensed Google path missing');
    }
    if (!/assets\/wallet\/official\/apple\//.test(html)) {
      classify('FAIL', 'B', 'Official Apple badge path missing');
    }
    if (!/height="48"/.test(html)) {
      classify('FAIL', 'B', 'Wallet height 48 attrs missing');
    }
  } else if (/official\/google|official\/apple/.test(html)) {
    classify('WARN', 'C', 'Wallet badges unexpectedly present');
  }
  if (/eveenty-logo/.test(html) && !/width="160"/.test(html)) {
    classify('FAIL', 'B', 'Logo not 160px');
  }

  // Card radius inventory (informational)
  const radii = [...html.matchAll(/border-radius:(\d+)px/g)].map((m) => Number(m[1]));
  const uniqueRadii = [...new Set(radii)].sort((a, b) => a - b);

  return {
    id,
    source,
    colors: extractColors(html),
    uniqueRadii,
    hasPJS: /Plus Jakarta Sans/.test(html),
    hasRoboto: /Roboto/.test(html),
    hasArialFirst: /font-family:Arial, Helvetica, 'Roboto'/.test(html),
    htmlBytes: Buffer.byteLength(html, 'utf8'),
    findings,
    failCount: findings.filter((f) => f.sev === 'FAIL').length,
    warnCount: findings.filter((f) => f.sev === 'WARN').length,
  };
}

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
      res.writeHead(200, {
        'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      });
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

const staticAudits = [];
const liveAudits = [];
for (const id of IDS) {
  const staticHtml = readFileSync(join(root, 'emails', `${id}.html`), 'utf8');
  staticAudits.push(auditHtml(id, staticHtml, 'emails/*.html'));
  const live = renderEmail(id, {
    locale: 'en',
    variant: id === 'festival_ticket_sale' ? 'buyerUser' : undefined,
    assetBase: 'http://ASSET/',
  });
  liveAudits.push(auditHtml(id, live, 'renderEmail'));
}

const cssDrift = IDS.map((id) => {
  const html = readFileSync(join(root, 'emails', `${id}.html`), 'utf8');
  return {
    id,
    outerPad0: /\.outer-pad\s*\{[^}]*padding-left:\s*0\s*!important/.test(html),
    outerPad8: /\.outer-pad\s*\{[^}]*padding-left:\s*8px\s*!important/.test(html),
    walletGap16: /wallet-btn[^}]*margin:\s*0 0 16px 0/.test(html),
    walletGap8: /wallet-btn[^}]*margin:\s*0 0 8px 0/.test(html),
    hasWalletSection: /\.wallet-section/.test(html),
    hasBadgePin: /wallet-badge-img/.test(html),
  };
});

const RTL_IDS = new Set([
  'activate_email',
  'dispute_notification',
  'festival_donation',
  'festival_ticket_registration_approval',
  'festival_ticket_sale',
]);

const VIEWPORTS = [800, 768, 414, 375, 320];
const { server, origin } = await startStaticServer(root);
const browser = await chromium.launch();
const page = await browser.newPage();
const regression = [];

try {
  for (const id of IDS) {
    const locales = ['en'];
    if (RTL_IDS.has(id)) locales.push('ar');
    for (const locale of locales) {
      const html = renderEmail(id, {
        locale,
        variant: id === 'festival_ticket_sale' ? 'buyerUser' : undefined,
        assetBase: `${origin}/`,
      });
      for (const w of VIEWPORTS) {
        await page.setViewportSize({ width: w, height: 900 });
        await page.setContent(html, { waitUntil: 'networkidle' });
        await page.waitForTimeout(120);
        const m = await page.evaluate(() => {
          const overflow =
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
          const container = document.querySelector('.email-container');
          const cr = container ? container.getBoundingClientRect() : null;
          return {
            overflow,
            containerW: cr ? Math.round(cr.width) : null,
            dir: document.documentElement.getAttribute('dir'),
          };
        });
        regression.push({
          id,
          locale,
          width: w,
          overflow: m.overflow ? 'FAIL' : 'PASS',
          containerW: m.containerW,
          dir: m.dir,
        });
      }
    }

    if (id === 'festival_ticket_sale') {
      let blockedHtml = renderEmail(id, {
        locale: 'en',
        variant: 'buyerUser',
        assetBase: `${origin}/`,
      });
      blockedHtml = blockedHtml.replace(/src="http:\/\/127\.0\.0\.1:[^"]+"/g, 'src=""');
      await page.setViewportSize({ width: 800, height: 900 });
      await page.setContent(blockedHtml, { waitUntil: 'load' });
      const blocked = await page.evaluate(() => {
        const alts = [...document.querySelectorAll('img[alt*="Wallet"]')].map((i) => i.alt);
        return {
          alts,
          hasGoogle: alts.some((a) => /Google/.test(a)),
          hasApple: alts.some((a) => /Apple/.test(a)),
        };
      });
      regression.push({
        id,
        locale: 'en',
        width: 800,
        blockedImages: blocked,
        overflow: 'n/a',
      });
    }
  }
} finally {
  await browser.close();
  server.close();
}

const overflowFails = regression.filter((r) => r.overflow === 'FAIL');
const allFindings = [...staticAudits, ...liveAudits].flatMap((a) =>
  a.findings.map((f) => ({ id: a.id, source: a.source, ...f })),
);

const report = {
  generatedAt: new Date().toISOString(),
  tokensSnapshot: {
    heading: T.heading,
    body: T.body,
    dark500: T.dark500,
    border: T.border,
    cta: {
      bg: T.primary,
      pad: `${T.ctaPaddingY}x${T.ctaPaddingX}`,
      radius: T.ctaRadius,
      weight: T.ctaFontWeight,
    },
    alert: { radius: T.statusAlertRadius, pad: T.statusAlertPadding },
    fonts: { heading: T.fontHeading, body: T.fontBody, stack: T.fontStack },
  },
  staticAudits: staticAudits.map((a) => ({
    id: a.id,
    fail: a.failCount,
    warn: a.warnCount,
    findings: a.findings,
    bytes: a.htmlBytes,
    uniqueRadii: a.uniqueRadii,
    hasPJS: a.hasPJS,
    hasArialFirst: a.hasArialFirst,
  })),
  liveAudits: liveAudits.map((a) => ({
    id: a.id,
    fail: a.failCount,
    warn: a.warnCount,
    findings: a.findings,
    uniqueRadii: a.uniqueRadii,
  })),
  cssDrift,
  regressionSummary: {
    checks: regression.filter((r) => r.overflow !== 'n/a').length,
    overflowFailCount: overflowFails.length,
    overflowFails,
    rtlChecked: regression.filter((r) => r.dir === 'rtl').length,
    blockedImagePass:
      regression.find((r) => r.blockedImages)?.blockedImages?.hasGoogle &&
      regression.find((r) => r.blockedImages)?.blockedImages?.hasApple,
  },
  allFindings,
  clientQA: { gmail: 'NOT RUN', outlook: 'NOT RUN', appleMail: 'NOT RUN' },
};

writeFileSync(join(outDir, 'seven-gate-audit-results.json'), JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      staticFails: staticAudits.reduce((n, a) => n + a.failCount, 0),
      liveFails: liveAudits.reduce((n, a) => n + a.failCount, 0),
      staticWarns: staticAudits.reduce((n, a) => n + a.warnCount, 0),
      overflowFails: overflowFails.length,
      rtlChecked: report.regressionSummary.rtlChecked,
      blockedImagePass: report.regressionSummary.blockedImagePass,
      cssDrift,
      findings: allFindings,
    },
    null,
    2,
  ),
);
process.exit(staticAudits.some((a) => a.failCount) || liveAudits.some((a) => a.failCount) || overflowFails.length ? 1 : 0);
