/**
 * Shared email HTML fragments for Eveenty Email Design Kit previews.
 * Table-based, inline CSS, no JS dependence inside returned fragments.
 */
import { TOKENS as T } from './tokens.js';

/** assetBase: '' or './' for preview root; '../' for emails/*.html standalone files */
let assetBase = './';

export function setAssetBase(base) {
  assetBase = base.endsWith('/') ? base : `${base}/`;
}

export function logoUrl(locale = 'en') {
  const map = {
    en: 'assets/logos/eveenty-logo-en.png',
    fr: 'assets/logos/eveenty-logo-fr.png',
    es: 'assets/logos/eveenty-logo-es.png',
    ar: 'assets/logos/eveenty-logo-ar.png',
    fa: 'assets/logos/eveenty-logo-fa.png',
  };
  return `${assetBase}${map[locale] || map.en}`;
}

/** Locale-appropriate logo alt (manifest guidance; not a production YAML key). */
const LOGO_ALT = {
  en: 'Eveenty',
  fr: 'Eveenty',
  es: 'Eveenty',
  ar: 'إيفينتي',
  fa: 'ایوینتی',
};

export function fixtureUrl(name) {
  return `${assetBase}assets/fixtures/${name}`;
}

export function hiddenPreheader(text) {
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${esc(text)}</div>`;
}

export function visiblePreheaderBar(text, dir = 'ltr') {
  return `
    <tr>
      <td align="${dir === 'rtl' ? 'right' : 'left'}" style="background-color:${T.light100};padding:8px 24px 4px 24px;font-family:${T.fontStack};font-size:11px;line-height:1.4;color:${T.muted};">
        ${esc(text)}
      </td>
    </tr>`;
}

export function brandedHeader({ locale = 'en', dir = 'ltr' } = {}) {
  const src = logoUrl(locale);
  const alt = LOGO_ALT[locale] || LOGO_ALT.en;
  return `
    <tr>
      <td align="center" style="background-color:${T.primary50};padding:32px 24px 16px 24px;">
        <img src="${src}" alt="${esc(alt)}" width="200" height="80" style="display:block;width:200px;max-width:200px;height:auto;border:0;outline:none;text-decoration:none;" />
        <!--[if mso]><p style="font-family:Arial,sans-serif;font-size:12px;color:${T.muted};">Eveenty</p><![endif]-->
      </td>
    </tr>`;
}

/**
 * Branded footer matching production activate_email.template:
 *   {{ FooterLead }} <a dir=ltr>email</a>{{ FooterSuffix }}
 * Pass footerLead / footerSuffix from locale YAML; defaults keep EN for other templates.
 */
export function brandedFooter({
  email,
  copyright,
  dir = 'ltr',
  fontFamily = T.fontStack,
  footerLead = 'This message was sent to',
  footerSuffix = '.',
} = {}) {
  const align = dir === 'rtl' ? 'right' : 'left';
  return `
    <tr>
      <td align="${align}" class="stack-pad" style="background-color:${T.surface};padding:24px 30px;border-top:1px solid #e5e5e5;font-family:${fontFamily};">
        <p style="margin:0 0 10px 0;color:${T.dark500};font-size:13px;line-height:1.6;">
          ${esc(footerLead)} <a href="mailto:${esc(email)}" dir="ltr" style="color:${T.secondary};text-decoration:none;unicode-bidi:embed;">${esc(email)}</a>${esc(footerSuffix)}
        </p>
        <p style="margin:0;color:${T.footerMuted};font-size:12px;line-height:1.6;">${esc(copyright || '© Eveenty. All rights reserved.')}</p>
      </td>
    </tr>`;
}

export function totalsBox({ subtotal, tax, processingFee, grandTotal, dir = 'ltr' } = {}) {
  const align = dir === 'rtl' ? 'right' : 'left';
  const row = (label, value) => `
    <tr>
      <td align="${align}" style="padding:0 0 12px 0;font-family:${T.fontStack};font-size:14px;font-weight:500;color:${T.heading};">${esc(label)}</td>
      <td align="${dir === 'rtl' ? 'left' : 'right'}" style="padding:0 0 12px 0;font-family:${T.fontStack};font-size:14px;font-weight:500;color:${T.heading};" dir="ltr">${esc(value)}</td>
    </tr>`;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="280" style="width:280px;max-width:100%;background-color:${T.primary};border-radius:8px;">
      <tr>
        <td style="padding:20px 20px 8px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${row('Subtotal', subtotal)}
            ${row('Tax', tax)}
            ${row('Processing fee', processingFee)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="background-color:${T.primary50};padding:16px 20px;border-radius:0 0 8px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td align="${align}" style="font-family:${T.fontStack};font-size:16px;font-weight:700;color:${T.heading};">Grand total</td>
              <td align="${dir === 'rtl' ? 'left' : 'right'}" style="font-family:${T.fontStack};font-size:16px;font-weight:700;color:${T.heading};" dir="ltr">${esc(grandTotal)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

/**
 * Yellow primary CTA (Account Activation / TRANSACTIONAL).
 * Target ~48–51px height via anchor padding (16+16) + 16px/1.2 line — do not
 * rely on td min-height (Outlook often ignores it). Full VML/bulletproof Outlook
 * button suite remains DEFERRED — no production engineering in Task 02.
 * Client rendering tests: NOT EXECUTED.
 */
export function primaryCtaYellow({ href, label, fontFamily = T.fontStack }) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="${T.primary}" style="background-color:${T.primary};border-radius:12px;">
          <a class="cta-yellow" href="${esc(href)}" target="_blank" style="display:inline-block;padding:16px 40px;font-family:${fontFamily};font-size:16px;font-weight:700;color:${T.body};text-decoration:none;border-radius:12px;min-width:44px;line-height:1.2;">${esc(label)}</a>
        </td>
      </tr>
    </table>`;
}

export function primaryCtaMagenta({ href, label }) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="${T.secondary}" style="background-color:${T.secondary};border-radius:8px;">
          <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:16px 40px;font-family:${T.fontStack};font-size:17px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;min-width:44px;line-height:1.2;">${esc(label)}</a>
        </td>
      </tr>
    </table>`;
}

export function sectionTitle({ title, dir = 'ltr' }) {
  const borderSide = dir === 'rtl' ? 'border-right' : 'border-left';
  const padSide = dir === 'rtl' ? 'padding-right' : 'padding-left';
  return `<p style="margin:0 0 12px 0;font-family:${T.fontStack};font-size:18px;font-weight:700;color:${T.heading};${borderSide}:4px solid ${T.secondary};${padSide}:12px;line-height:1.3;">${esc(title)}</p>`;
}

export function kvRow(label, value, dir = 'ltr') {
  return `
    <tr>
      <td align="${dir === 'rtl' ? 'right' : 'left'}" style="padding:6px 0;font-family:${T.fontStack};font-size:14px;color:${T.muted};">${esc(label)}</td>
      <td align="${dir === 'rtl' ? 'left' : 'right'}" style="padding:6px 0;font-family:${T.fontStack};font-size:14px;font-weight:700;color:${T.body};">${value}</td>
    </tr>`;
}

export function wrapEmailDocument({ lang, dir, title, bodyRows, preheader, fontFamily = T.fontStack }) {
  return `<!DOCTYPE html>
<html lang="${esc(lang)}" dir="${esc(dir)}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${esc(title)}</title>
  <!--[if mso]>
  <style type="text/css">
    table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .stack-col { display: block !important; width: 100% !important; max-width: 100% !important; }
      .stack-pad { padding-left: 16px !important; padding-right: 16px !important; }
      .wallet-btn { display: block !important; width: 100% !important; margin: 0 0 8px 0 !important; text-align: center !important; }
      /* Narrow viewports: keep Activation CTA on one line without shrinking below 16px */
      .cta-yellow { padding-left: 24px !important; padding-right: 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${T.viewport};font-family:${fontFamily};${dir === 'rtl' ? 'direction:rtl;' : ''}">
  ${hiddenPreheader(preheader)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.viewport};margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${T.surface};border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          ${bodyRows}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export { esc };
