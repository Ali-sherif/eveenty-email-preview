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
      <td align="${dir === 'rtl' ? 'right' : 'left'}" style="background-color:${T.light100};padding:8px 24px 4px 24px;font-family:${T.fontStack};font-size:11px;line-height:1.4;color:${T.dark500};">
        ${esc(text)}
      </td>
    </tr>`;
}

const STATUS_ALERT_THEMES = {
  warning: {
    bg: T.warningSurface,
    border: T.warningBorder,
    title: T.warningFg,
    body: T.warningBody,
    /** Text prefix communicates status when icons/images are blocked */
    statusLabel: 'Warning',
  },
  error: {
    bg: T.errorSurface,
    border: T.errorBorder,
    title: T.errorFg,
    body: T.errorBody,
    statusLabel: 'Error',
  },
  success: {
    bg: T.successSurface,
    border: T.successBorder,
    title: T.successFg,
    body: T.successBody,
    statusLabel: 'Success',
  },
  info: {
    bg: T.infoSurface,
    border: T.infoBorder,
    title: T.infoFg,
    body: T.infoBody,
    statusLabel: 'Info',
  },
};

/**
 * Shared Email Status Alert — Warning / Error / Success / Info.
 * Owner-approved: 16px pad, 16px radius, 8px title↔body gap; variant colors only.
 * No dismiss control. Status communicated via visible title text (icon optional).
 */
export function statusAlert({
  variant = 'warning',
  title,
  bodyHtml = '',
  dir = 'ltr',
  showIcon = false,
  titleFontFamily = T.fontHeading,
  bodyFontFamily = T.fontBody,
} = {}) {
  const theme = STATUS_ALERT_THEMES[variant] || STATUS_ALERT_THEMES.warning;
  const align = dir === 'rtl' ? 'right' : 'left';
  const pad = T.statusAlertPadding;
  const gap = T.statusAlertGap;
  const hasBody = bodyHtml != null && String(bodyHtml).trim() !== '';
  const titleMargin = hasBody ? `0 0 ${gap}px 0` : '0';
  const iconPad = dir === 'rtl' ? '4px 0 4px 8px' : '4px 8px 4px 0';
  const iconCell = showIcon
    ? `<td valign="top" width="28" style="padding:${iconPad};font-family:${bodyFontFamily};font-size:14px;line-height:1.2;color:${theme.title};" aria-hidden="true">&#9679;</td>`
    : '';
  const bodyBlock = hasBody
    ? `<p style="margin:0;font-family:${bodyFontFamily};font-size:16px;font-weight:400;line-height:1.4;color:${theme.body};">${bodyHtml}</p>`
    : '';
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${theme.bg};border:1px solid ${theme.border};border-radius:${T.statusAlertRadius}px;">
      <tr>
        <td align="${align}" style="padding:${pad}px;font-family:${bodyFontFamily};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${iconCell}
              <td align="${align}" style="font-family:${bodyFontFamily};">
                <h2 style="margin:${titleMargin};font-family:${titleFontFamily};font-size:16px;font-weight:600;line-height:1.3;color:${theme.title};">${esc(title)}</h2>
                ${bodyBlock}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

/** @deprecated Prefer statusAlert({ variant: 'warning', ... }) */
export function statusAlertWarning(opts = {}) {
  return statusAlert({ ...opts, variant: 'warning' });
}

/** Magenta-accent “what happens next” panel for Notification emails. */
export function nextStepsPanel({ title, bodyHtml, dir = 'ltr' } = {}) {
  const align = dir === 'rtl' ? 'right' : 'left';
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdf2f8;border:1px solid #fbcfe8;border-radius:8px;">
      <tr>
        <td align="${align}" style="padding:20px;font-family:${T.fontStack};">
          <h3 style="margin:0 0 12px 0;font-size:17px;font-weight:600;line-height:1.3;color:${T.secondary};">${esc(title)}</h3>
          <p style="margin:0;font-size:15px;line-height:1.5;color:${T.secondary};">${bodyHtml}</p>
        </td>
      </tr>
    </table>`;
}

/** Two-column details table (dispute / notification). */
export function detailsTable({ headers, rows, dir = 'ltr' } = {}) {
  const align = dir === 'rtl' ? 'right' : 'left';
  const [hField, hDetails] = headers;
  const body = rows
    .map(
      ([label, valueHtml], i) => `
    <tr style="border-bottom:1px solid ${T.border};">
      <td align="${align}" style="padding:14px 16px;font-family:${T.fontStack};font-size:14px;font-weight:600;color:${T.heading};background-color:${T.light100};width:35%;border-bottom:1px solid ${T.border};">${esc(label)}</td>
      <td align="${align}" style="padding:14px 16px;font-family:${T.fontStack};font-size:14px;color:${T.body};border-bottom:1px solid ${T.border};">${valueHtml}</td>
    </tr>`
    )
    .join('');
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:100%;border:1px solid ${T.border};border-radius:8px;overflow:hidden;">
      <tr>
        <th align="${align}" style="padding:14px 16px;font-family:${T.fontStack};font-size:14px;font-weight:600;color:${T.heading};background-color:${T.primary};border-bottom:2px solid ${T.border};">${esc(hField)}</th>
        <th align="${align}" style="padding:14px 16px;font-family:${T.fontStack};font-size:14px;font-weight:600;color:${T.heading};background-color:${T.primary};border-bottom:2px solid ${T.border};">${esc(hDetails)}</th>
      </tr>
      ${body}
    </table>`;
}

/**
 * Marketing campaign header — production uses festival logo, not Eveenty brand header.
 * Keep Eveenty localized logos out of this slot.
 */
export function marketingFestivalHeader({ logoSrc, alt = 'Festival logo' } = {}) {
  return `
    <tr>
      <td align="center" style="background-color:${T.surface};padding:28px 24px 12px 24px;">
        <img src="${logoSrc}" alt="${esc(alt)}" width="200" height="80" style="display:block;width:200px;max-width:70%;height:auto;border:0;outline:none;margin:0 auto;" />
      </td>
    </tr>`;
}

/**
 * Marketing footer matching festival_marketing_email_target.template fields:
 * Powered by Eveenty + preferences + existing unsubscribe link.
 * Do not invent additional legal slots beyond the production template.
 */
export function marketingCampaignFooter({ unsubscribeUrl } = {}) {
  return `
    <tr>
      <td align="center" style="background-color:#777777;padding:20px 24px;font-family:${T.fontStack};">
        <p style="margin:0 0 10px 0;font-size:14px;font-weight:700;color:#ffffff;">Powered by Eveenty</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#ffffff;">
          Want to change how you receive these emails?<br>
          You can update your preferences<br>
          or <a href="${esc(unsubscribeUrl)}" style="color:#ffffff;text-decoration:underline;">unsubscribe</a> from this list.
        </p>
      </td>
    </tr>`;
}

/**
 * Branded header band (canonical primary-50 #FEFDF4).
 * logoWidth: Account Activation owner-approved nominal width is 160px.
 * Task 03 seven-email set passes logoWidth:160 explicitly on each branded template.
 * Default 200 retained only for any future deferred catalog templates.
 */
export function brandedHeader({ locale = 'en', dir = 'ltr', logoWidth = 200 } = {}) {
  const src = logoUrl(locale);
  const alt = LOGO_ALT[locale] || LOGO_ALT.en;
  const w = Number(logoWidth) || 200;
  // Proportional height from owner PNG canvas (EN/FR/AR/FA 3014×1208; ES 2958×1208)
  const h = locale === 'es' ? Math.round((w * 1208) / 2958) : Math.round((w * 1208) / 3014);
  return `
    <tr>
      <td align="center" style="background-color:${T.primary50};padding:32px 24px 16px 24px;">
        <img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" style="display:block;width:${w}px;max-width:${w}px;height:auto;border:0;outline:none;text-decoration:none;" />
        <!--[if mso]><p style="font-family:Arial,sans-serif;font-size:12px;color:${T.dark500};">Eveenty</p><![endif]-->
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
      <td align="${align}" class="stack-pad" style="background-color:${T.surface};padding:24px 30px;border-top:1px solid ${T.border};font-family:${fontFamily};">
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
 * Primary yellow CTA — owner-approved Original DS Large button:
 * bg #E9D023 · text #4D4C49 · Roboto Medium 16/1.4 · pad 13×24 · radius 12 · ~48px single-line.
 * Expands safely for long translated labels. Outlook VML fallback included.
 * Client Level B (Gmail/Outlook/Apple Mail): NOT EXECUTED in this kit.
 */
export function primaryCtaYellow({ href, label, fontFamily = T.fontBody }) {
  const padY = T.ctaPaddingY;
  const padX = T.ctaPaddingX;
  const radius = T.ctaRadius;
  const vmlArc = Math.round((radius / 48) * 10000) / 10000;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${esc(href)}" style="height:${T.ctaMinHeight}px;v-text-anchor:middle;width:auto;" arcsize="${vmlArc}" stroke="f" fillcolor="${T.primary}">
            <w:anchorlock/>
            <center style="color:${T.body};font-family:Arial,sans-serif;font-size:${T.ctaFontSize}px;font-weight:${T.ctaFontWeight};">${esc(label)}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a class="cta-yellow" href="${esc(href)}" target="_blank" style="display:inline-block;padding:${padY}px ${padX}px;font-family:${fontFamily};font-size:${T.ctaFontSize}px;font-weight:${T.ctaFontWeight};color:${T.body};text-decoration:none;border-radius:${radius}px;background-color:${T.primary};line-height:${T.ctaLineHeight};mso-hide:all;text-align:center;vertical-align:middle;box-sizing:border-box;min-height:${T.ctaMinHeight}px;">${esc(label)}</a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>`;
}

/**
 * Official multilingual Add to Wallet badges (owner OD-W1 option B, 2026-09-25).
 * Local PNGs under assets/wallet/official/{google,apple}/{locale}.png — sourced from
 * Apple Developer / Google Wallet brand kits (unmodified artwork; Apple SVGs rasterized
 * to PNG for email). Persian Apple falls back to English official badge.
 *
 * Google “primary” = wallet-button; “condensed” = add-wallet-badge (official pack).
 * Email uses primary on wide viewports and condensed ≤620px so 48px min height fits
 * at 320px without shrinking (Google: use condensed when space is limited).
 *
 * Preview uses assetBase-relative paths. Production delivery requires CDN hosting —
 * see qa-output/.../OFFICIAL_MULTILINGUAL_WALLET_BADGES.md (do not upload without auth).
 *
 * Conditional: omit when href empty (GoogleWalletPassLink / AppleWalletPassFile).
 * Calendar remains separate text links — do not invent calendar badges here.
 * Do not mirror badges in RTL.
 */

/** Intrinsic pixel sizes of prepared official PNGs (for email width/height attrs). */
const WALLET_BADGE_INTRINSIC = {
  google: {
    // Primary: wallet-button
    en: { w: 283, h: 50 },
    ar: { w: 936, h: 150 },
    fr: { w: 317, h: 50 },
    es: { w: 298, h: 50 },
    fa: { w: 308, h: 50 },
  },
  googleCondensed: {
    // Official add-wallet-badge (narrower; use when primary cannot fit at 48px)
    en: { w: 199, h: 55 },
    ar: { w: 199, h: 55 },
    fr: { w: 199, h: 55 },
    es: { w: 199, h: 55 },
    fa: { w: 213, h: 55 },
  },
  apple: {
    en: { w: 316, h: 100 },
    ar: { w: 318, h: 100 },
    fr: { w: 321, h: 100 },
    es: { w: 376, h: 100 },
    fa: { w: 316, h: 100 }, // English artwork fallback
  },
};

const WALLET_LOCALES = ['en', 'ar', 'fr', 'es', 'fa'];

export function walletBadgeLocale(locale = 'en') {
  return WALLET_LOCALES.includes(locale) ? locale : 'en';
}

/** Relative preview path (or CDN once deployed). Never emit Windows absolute paths. */
export function walletBadgeUrl(provider, locale = 'en', { condensed = false } = {}) {
  const loc = walletBadgeLocale(locale);
  if (provider === 'google' && condensed) {
    return `${assetBase}assets/wallet/official/google/condensed/${loc}.png`;
  }
  return `${assetBase}assets/wallet/official/${provider}/${loc}.png`;
}

/**
 * Size badges by shared display height so Google/Apple look equal.
 * Width follows each asset’s intrinsic aspect ratio (never stretch/crop).
 * Default 48px matches Google Wallet minimum height (48 dp) and exceeds
 * Apple’s onscreen minimum (40 px).
 */
function walletBadgeDisplaySize(providerKey, locale, displayHeight = 48) {
  const loc = walletBadgeLocale(locale);
  const intrinsic =
    WALLET_BADGE_INTRINSIC[providerKey]?.[loc] ||
    WALLET_BADGE_INTRINSIC[providerKey]?.en ||
    WALLET_BADGE_INTRINSIC.google.en;
  const width = Math.max(1, Math.round((displayHeight * intrinsic.w) / intrinsic.h));
  return { width, height: displayHeight };
}

/**
 * @param {object} opts
 * @param {string} [opts.googleHref] — empty omits Google badge
 * @param {string} [opts.appleHref] — empty omits Apple badge
 * @param {string} [opts.googleLabel] — accessible alt / text fallback
 * @param {string} [opts.appleLabel] — accessible alt / text fallback
 * @param {string} [opts.locale] — en|ar|fr|es|fa
 * @param {string} [opts.dir] — ltr|rtl (layout only; artwork not mirrored)
 * @param {number} [opts.displayHeight] — target badge height in px (default 48)
 */
export function walletActionButtons({
  googleHref = '',
  appleHref = '',
  googleLabel = 'Add to Google Wallet',
  appleLabel = 'Add to Apple Wallet',
  locale = 'en',
  dir = 'ltr',
  displayHeight = 48,
} = {}) {
  const showGoogle = !!googleHref;
  const showApple = !!appleHref;
  if (!showGoogle && !showApple) return '';

  const loc = walletBadgeLocale(locale);
  // ≥16px between badges on desktop (≥ Google 8 dp / Apple 0.1× clear space)
  const gapFirst = dir === 'rtl' ? '0 0 0 16px' : '0 16px 0 0';

  // font-size/line-height 0 + valign middle: kill anonymous text struts between
  // inline-block links so Google/Apple share one vertical center line.
  const cellBase =
    'padding:__PAD__;vertical-align:middle;font-size:0;line-height:0;mso-line-height-rule:exactly;';

  const badgeLink = ({
    href,
    src,
    label,
    width,
    height,
    imgClass = '',
    linkClass = '',
    linkStyle = '',
  }) => {
    const imgStyle = `display:block;width:${width}px;max-width:${width}px;height:${height}px;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:middle;`;
    const linkClassAttr = linkClass ? ` class="${linkClass}"` : '';
    return `<a${linkClassAttr} href="${esc(href)}" target="_blank" style="display:inline-block;line-height:0;font-size:0;text-decoration:none;border:0;vertical-align:middle;${linkStyle}"><img class="wallet-badge-img${imgClass ? ` ${imgClass}` : ''}" src="${esc(src)}" alt="${esc(label)}" width="${width}" height="${height}" style="${imgStyle}" /></a>`;
  };

  const googleCell = (padding) => {
    const primary = walletBadgeDisplaySize('google', loc, displayHeight);
    const condensed = walletBadgeDisplaySize('googleCondensed', loc, displayHeight);
    const primarySrc = walletBadgeUrl('google', loc, { condensed: false });
    const condensedSrc = walletBadgeUrl('google', loc, { condensed: true });
    // Dual official assets: primary on wide; condensed ≤620px so 48px fits at 320 without shrink.
    // Hide the unused *link* (not only the img) so empty anchors cannot skew valign.
    // Outlook ignores MQ → primary only (desktop pane is wide enough).
    return `
        <td class="wallet-btn" align="center" valign="middle" width="${primary.width}" style="${cellBase.replace('__PAD__', padding)}width:${primary.width}px;">${badgeLink({
            href: googleHref,
            src: primarySrc,
            label: googleLabel,
            width: primary.width,
            height: primary.height,
            imgClass: 'wallet-google-primary',
            linkClass: 'wallet-google-primary-link',
          })}${badgeLink({
            href: googleHref,
            src: condensedSrc,
            label: googleLabel,
            width: condensed.width,
            height: condensed.height,
            imgClass: 'wallet-google-condensed',
            linkClass: 'wallet-google-condensed-link',
            linkStyle: 'display:none;mso-hide:all;max-height:0;overflow:hidden;',
          })}</td>`;
  };

  const appleCell = (padding) => {
    const { width, height } = walletBadgeDisplaySize('apple', loc, displayHeight);
    const src = walletBadgeUrl('apple', loc);
    return `
        <td class="wallet-btn" align="center" valign="middle" width="${width}" style="${cellBase.replace('__PAD__', padding)}width:${width}px;">${badgeLink({
            href: appleHref,
            src,
            label: appleLabel,
            width,
            height,
          })}</td>`;
  };

  const cells = [];
  if (showGoogle) {
    cells.push(googleCell(showApple ? gapFirst : '0'));
  }
  if (showApple) {
    cells.push(appleCell('0'));
  }
  // dir controls cell order only — never mirror badge artwork (no scaleX / transform)
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="wallet-row" align="center" dir="${dir === 'rtl' ? 'rtl' : 'ltr'}" style="margin:0 auto;border-collapse:collapse;">
      <tr>
        ${cells.join('')}
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

export function sectionTitle({ title, dir = 'ltr', fontFamily = T.fontStack, fontWeight = 700 } = {}) {
  const borderSide = dir === 'rtl' ? 'border-right' : 'border-left';
  const padSide = dir === 'rtl' ? 'padding-right' : 'padding-left';
  return `<p style="margin:0 0 12px 0;font-family:${fontFamily};font-size:18px;font-weight:${fontWeight};color:${T.heading};${borderSide}:4px solid ${T.secondary};${padSide}:12px;line-height:1.3;">${esc(title)}</p>`;
}

export function kvRow(label, value, dir = 'ltr') {
  return `
    <tr>
      <td align="${dir === 'rtl' ? 'right' : 'left'}" style="padding:6px 0;font-family:${T.fontStack};font-size:14px;color:${T.dark500};">${esc(label)}</td>
      <td align="${dir === 'rtl' ? 'left' : 'right'}" style="padding:6px 0;font-family:${T.fontStack};font-size:14px;font-weight:700;color:${T.heading};">${value}</td>
    </tr>`;
}

export function wrapEmailDocument({ lang, dir, title, bodyRows, preheader, fontFamily = T.fontStack }) {
  return `<!DOCTYPE html>
<html lang="${esc(lang)}" dir="${esc(dir)}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${esc(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style type="text/css">
    table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
    /* Pin Wallet badge geometry — do not let global img height:auto / max-width shrink them. */
    img.wallet-badge-img {
      max-width: none !important;
      height: 48px !important;
      vertical-align: middle !important;
    }
    .email-container { width: 100% !important; max-width: 600px !important; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .stack-col { display: block !important; width: 100% !important; max-width: 100% !important; }
      .stack-pad { padding-left: 16px !important; padding-right: 16px !important; }
      /* Maximize wallet column: cancel nested stack-pad; keep 8px clear space (Google 8 dp). */
      .wallet-section {
        margin-left: -16px !important;
        margin-right: -16px !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
        box-sizing: border-box !important;
        text-align: center !important;
      }
      .wallet-btn { display: block !important; width: 100% !important; max-width: 100% !important; margin: 0 0 16px 0 !important; text-align: center !important; padding-left: 0 !important; padding-right: 0 !important; font-size: 0 !important; line-height: 0 !important; }
      .wallet-btn:last-child { margin-bottom: 0 !important; }
      .wallet-row, .wallet-row tbody, .wallet-row tr { display: block !important; width: 100% !important; }
      /* Never fluid-shrink below 48px — swap to official condensed Google asset instead.
         Hide/show the *link wrappers* so empty anchors cannot skew stack spacing. */
      .wallet-google-primary-link {
        display: none !important;
        mso-hide: all !important;
        max-height: 0 !important;
        overflow: hidden !important;
        width: 0 !important;
        height: 0 !important;
      }
      .wallet-google-condensed-link {
        display: inline-block !important;
        max-height: none !important;
        overflow: visible !important;
        width: auto !important;
        height: auto !important;
      }
      .wallet-google-primary {
        display: none !important;
      }
      .wallet-google-condensed {
        display: block !important;
      }
      .cta-yellow { padding-left: 24px !important; padding-right: 24px !important; }
      /* Flush outer pad on small screens so wallet can use full viewport width. */
      .outer-pad { padding-left: 0 !important; padding-right: 0 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;max-width:100%;overflow-x:hidden;background-color:${T.viewport};font-family:${fontFamily};${dir === 'rtl' ? 'direction:rtl;' : ''}">
  ${hiddenPreheader(preheader)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.viewport};margin:0;padding:0;width:100%;max-width:100%;table-layout:fixed;">
    <tr>
      <td align="center" class="outer-pad" style="padding:40px 16px;width:100%;max-width:100%;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${T.surface};border:1px solid ${T.border};border-radius:8px;overflow:hidden;table-layout:fixed;">
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
