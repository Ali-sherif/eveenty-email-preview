/**
 * Renders the five Phase-1 Eveenty reference emails as standalone HTML strings.
 * Annotations from Figma are omitted — production-representative content only.
 */
import {
  wrapEmailDocument,
  visiblePreheaderBar,
  brandedHeader,
  brandedFooter,
  totalsBox,
  primaryCtaYellow,
  primaryCtaMagenta,
  sectionTitle,
  kvRow,
  esc,
  setAssetBase,
  fixtureUrl,
} from './email-kit.js';
import { SAMPLE, LOCALES } from './sample-data.js';
import { TOKENS as T } from './tokens.js';

export function renderEmail(emailId, options = {}) {
  setAssetBase(options.assetBase ?? './');
  const locale = options.locale || 'en';
  const variant = options.variant || 'default';
  const longContent = !!options.longContent;
  const L = LOCALES[locale] || LOCALES.en;
  const dir = L.dir;
  const lang = L.lang;

  switch (emailId) {
    case 'activate_email':
      return renderActivate(L, dir, lang, longContent);
    case 'festival_donation':
      return renderDonation(L, dir, lang, variant, longContent);
    case 'festival_ticket_sale':
      return renderTicketSale(L, dir, lang, variant, longContent);
    case 'festival_ticket_registration_approval':
      return renderRegApproval(L, dir, lang, variant, longContent);
    case 'support':
      return renderSupport(LOCALES.en, 'ltr', 'en', variant, longContent);
    default:
      throw new Error(`Unknown email id: ${emailId}`);
  }
}

function renderActivate(L, dir, lang, longContent) {
  const a = L.activate;
  const name = longContent ? `${SAMPLE.user.displayName} ${'VeryLongMiddleName '.repeat(4).trim()}` : SAMPLE.user.displayName;
  const body = longContent
    ? `${a.body} ${'Additional onboarding guidance for preview wrapping. '.repeat(6)}`
    : a.body;
  const bodyFont = dir === 'rtl' ? T.fontBodyRtl : T.fontBody;
  const headingFont = dir === 'rtl' ? T.fontBodyRtl : T.fontHeading;
  const rows = `
    ${brandedHeader({ locale: L.logo, dir })}
    <tr>
      <td align="center" class="stack-pad" style="padding:40px 30px 30px 30px;background-color:${T.surface};">
        <h1 style="margin:0 0 20px 0;font-family:${headingFont};font-size:24px;font-weight:700;line-height:1.3;color:${T.heading};text-align:center;">${esc(a.welcome)}</h1>
        <p style="margin:0 0 20px 0;font-family:${bodyFont};font-size:16px;line-height:1.6;color:${T.body};text-align:center;">${esc(a.greeting)} <bdi>${esc(name)}</bdi> 👋,</p>
        <p style="margin:0;font-family:${bodyFont};font-size:16px;line-height:1.6;color:${T.body};text-align:center;">${esc(body)}</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:0 30px 30px 30px;background-color:${T.surface};">
        ${primaryCtaYellow({ href: SAMPLE.activate.activateUrl, label: a.button, fontFamily: bodyFont })}
      </td>
    </tr>
    ${brandedFooter({ email: SAMPLE.user.email, copyright: a.copyright, dir, fontFamily: bodyFont })}
  `;
  return wrapEmailDocument({
    lang,
    dir,
    title: a.title,
    preheader: SAMPLE.activate.preheader,
    bodyRows: rows,
    fontFamily: bodyFont,
  });
}

function renderDonation(L, dir, lang, variant, longContent) {
  const d = L.donation;
  const name = SAMPLE.user.fullName;
  const fest = longContent ? `${SAMPLE.festival.name} — Extended Preview Title With Extra Words` : SAMPLE.festival.name;
  const thankYou =
    variant === 'organizerNotify'
      ? `<bdi>${esc(name)}</bdi> donated to <bdi>${esc(fest)}</bdi>`
      : esc(d.thankYou(name, fest));
  const address = longContent
    ? `${SAMPLE.user.address}, Suite 2400, Financial District Tower, Additional Address Line for Wrap Testing`
    : SAMPLE.user.address;

  const rows = `
    ${visiblePreheaderBar(`Preheader: ${d.preheader}`, dir)}
    ${brandedHeader({ locale: L.logo, dir })}
    <tr>
      <td align="center" class="stack-pad" style="padding:32px 30px 24px 30px;background-color:${T.surface};">
        ${variant !== 'organizerNotify' ? `<p style="margin:0 0 16px 0;font-family:${T.fontStack};font-size:14px;font-weight:500;color:${T.muted};text-align:center;">${esc(d.notTax)}</p>` : ''}
        <p style="margin:0;font-family:${T.fontStack};font-size:20px;font-weight:700;line-height:1.4;color:${T.heading};text-align:center;">${thankYou}</p>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 16px 30px;background-color:${T.surface};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${kvRow(d.clientName, `<bdi>${esc(name)}</bdi>`, dir)}
          ${kvRow(d.clientAddress, `<bdi>${esc(address)}</bdi>`, dir)}
          ${kvRow(d.clientPhone, `<span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.user.phone)}</span>`, dir)}
          ${kvRow(d.clientEmail, `<a href="mailto:${esc(SAMPLE.user.email)}" dir="ltr" style="color:${T.body};text-decoration:none;unicode-bidi:embed;font-weight:700;">${esc(SAMPLE.user.email)}</a>`, dir)}
          ${kvRow(d.invoiceId, `#${esc(SAMPLE.money.invoiceId)}`, dir)}
          ${kvRow(d.date, `<span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.money.date)}&nbsp;&nbsp;${esc(SAMPLE.money.time)}</span>`, dir)}
        </table>
      </td>
    </tr>
    <tr>
      <td align="${dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:8px 30px 24px 30px;background-color:${T.surface};">
        ${totalsBox({ ...SAMPLE.money, dir })}
      </td>
    </tr>
    ${brandedFooter({ email: SAMPLE.user.email, dir })}
  `;
  return wrapEmailDocument({
    lang,
    dir,
    title: d.title,
    preheader: d.preheader,
    bodyRows: rows,
  });
}

function renderTicketSale(L, dir, lang, variant, longContent) {
  const t = L.ticketSale;
  const isGuest = variant === 'guestUser';
  const greetName = isGuest ? SAMPLE.guest.fullName : SAMPLE.user.fullName;
  const intro = isGuest
    ? `<bdi>${esc(SAMPLE.user.fullName)}</bdi> bought tickets for you for <span style="color:${T.secondary};"><bdi>${esc(SAMPLE.festival.name)}</bdi></span>.`
    : esc(t.received(SAMPLE.festival.name));

  const ticketCard = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;border:1px solid ${T.border};border-radius:12px;">
      <tr>
        <td style="padding:24px;font-family:${T.fontStack};">
          <p style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:${T.heading};">${esc(SAMPLE.festival.name)}</p>
          <p style="margin:0 0 12px 0;font-size:14px;font-weight:500;color:${T.secondary};">${esc(SAMPLE.ticket.type)}</p>
          <p style="margin:0 0 12px 0;font-size:14px;color:${T.body};"><bdi>${esc(greetName)}</bdi></p>
          <p style="margin:0 0 12px 0;font-size:13px;color:${T.muted};">${esc(SAMPLE.ticket.indexLabel)}&nbsp;&nbsp;·&nbsp;&nbsp;#${esc(SAMPLE.ticket.id)}</p>
          <p style="margin:0 0 12px 0;font-size:13px;color:${T.body};">${esc(SAMPLE.festival.start)}</p>
          <p style="margin:0;font-size:13px;color:${T.body};">${esc(SAMPLE.festival.place)}, Toronto</p>
          ${longContent ? `<p style="margin:12px 0 0 0;font-size:13px;color:${T.muted};">Seat notes / accessibility: aisle preferred · companion seating request on file (preview long-content).</p>` : ''}
        </td>
      </tr>
    </table>`;

  const walletBtns = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="wallet-btn" style="padding:0 6px 0 0;">
          <a href="https://example.com/preview/google-wallet" target="_blank" style="display:inline-block;padding:10px 16px;font-family:${T.fontStack};font-size:12px;font-weight:500;color:${T.secondary};text-decoration:none;border:1px solid ${T.secondary};border-radius:8px;background-color:${T.light100};">${esc(t.googleWallet)}</a>
        </td>
        <td class="wallet-btn" style="padding:0 0 0 6px;">
          <a href="https://example.com/preview/apple-wallet" target="_blank" style="display:inline-block;padding:10px 16px;font-family:${T.fontStack};font-size:12px;font-weight:500;color:${T.secondary};text-decoration:none;border:1px solid ${T.secondary};border-radius:8px;background-color:${T.light100};">${esc(t.appleWallet)}</a>
        </td>
      </tr>
    </table>`;

  const rows = `
    ${visiblePreheaderBar(`Preheader: ${t.preheader}`, dir)}
    ${brandedHeader({ locale: L.logo, dir })}
    <tr>
      <td align="${dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:32px 30px 16px 30px;background-color:${T.surface};font-family:${T.fontStack};font-size:16px;color:${T.body};">
        <p style="margin:0 0 12px 0;">${esc(t.hello)} <bdi>${esc(greetName)}</bdi>${dir === 'rtl' ? '،' : ','}</p>
        <p style="margin:0 0 12px 0;line-height:1.5;">${intro}</p>
        <p style="margin:0;line-height:1.5;">${esc(t.carry)}</p>
      </td>
    </tr>
    <tr>
      <td align="center" class="stack-pad" style="padding:8px 30px 16px 30px;background-color:${T.surface};">
        ${ticketCard}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0 auto;">
          <tr>
            <td align="center" style="background-color:${T.light100};border:1px solid ${T.border};border-radius:8px;width:180px;height:180px;">
              <img src="${fixtureUrl('qr-sample.svg')}" alt="SAMPLE QR CODE — not a live ticket credential" width="180" height="180" style="display:block;width:180px;height:180px;border:0;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:8px;font-family:${T.fontStack};font-size:12px;color:${T.muted};">${esc(t.qrCaption)}</td>
          </tr>
        </table>
        <div style="margin-top:16px;">${walletBtns}</div>
        <p style="margin:16px 0 0 0;font-family:${T.fontStack};font-size:13px;color:${T.secondary};">
          <a href="https://example.com/preview/cal-google" style="color:${T.secondary};text-decoration:none;">${esc(t.calendar)}</a>
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;background-color:${T.primary50};border:1px solid ${T.border};border-radius:8px;">
          <tr>
            <td style="padding:12px 16px;font-family:${T.fontStack};">
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:${T.heading};">${esc(t.attachTitle)}</p>
              <p style="margin:0;font-size:12px;color:${T.body};">${esc(t.attachBody)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="${dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:8px 30px 16px 30px;background-color:${T.surface};">
        ${totalsBox({ ...SAMPLE.money, dir })}
      </td>
    </tr>
    ${brandedFooter({ email: SAMPLE.user.email, dir })}
  `;
  return wrapEmailDocument({
    lang,
    dir,
    title: t.title,
    preheader: t.preheader,
    bodyRows: rows,
  });
}

function renderRegApproval(L, dir, lang, variant, longContent) {
  const r = L.regApproval;
  const showCta = variant !== 'user_noCta';
  const fest = SAMPLE.festival.name;
  const deadline = SAMPLE.registration.paymentDeadline;
  const greeting = longContent
    ? `${r.greeting(fest, deadline)} Extra reminder copy for wrap testing: please review each ticket holder and answers before paying.`
    : r.greeting(fest, deadline);

  const ctaRow = showCta
    ? `<tr><td align="center" style="padding:16px 30px;background-color:${T.surface};">${primaryCtaMagenta({ href: SAMPLE.registration.completeOrderUrl, label: r.completeOrder })}</td></tr>`
    : '';

  const qaBox = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;background-color:${T.light100};border:1px solid ${T.border};border-radius:8px;">
      <tr>
        <td style="padding:12px;font-family:${T.fontStack};font-size:13px;color:${T.body};">
          <p style="margin:0 0 6px 0;font-weight:700;color:${T.muted};">Answers:</p>
          <p style="margin:0 0 6px 0;line-height:1.4;">Dietary requirements: Vegetarian</p>
          <p style="margin:0;line-height:1.4;">T-shirt size: M</p>
          ${longContent ? `<p style="margin:6px 0 0 0;line-height:1.4;">Accessibility notes: Prefers quiet entry lane; companion seat requested for preview long-content mode.</p>` : ''}
        </td>
      </tr>
    </table>`;

  const ticketItem = (n, total, type, holder, email, phone, withQa) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px 0;border:1px solid ${T.border};border-radius:12px;">
      <tr>
        <td style="padding:24px;font-family:${T.fontStack};">
          <p style="margin:0 0 6px 0;font-size:15px;font-weight:700;color:${T.secondary};">${n} / ${total}</p>
          <p style="margin:0 0 12px 0;font-size:14px;color:${T.body};">Ticket Type: <bdi>${esc(type)}</bdi></p>
          <div style="height:2px;background-color:${T.secondary};margin:0 0 12px 0;line-height:2px;font-size:0;">&nbsp;</div>
          <p style="margin:0 0 8px 0;font-size:14px;color:${T.body};">Ticket Holder: <bdi>${esc(holder)}</bdi></p>
          <p style="margin:0 0 8px 0;font-size:14px;color:${T.body};">Email: <span dir="ltr" style="unicode-bidi:embed;">${esc(email)}</span></p>
          ${phone ? `<p style="margin:0 0 8px 0;font-size:14px;color:${T.body};">Phone: <span dir="ltr" style="unicode-bidi:embed;">${esc(phone)}</span></p>` : ''}
          ${withQa ? qaBox : ''}
        </td>
      </tr>
    </table>`;

  const rows = `
    ${visiblePreheaderBar(`Preheader: ${r.preheader}`, dir)}
    ${brandedHeader({ locale: L.logo, dir })}
    <tr>
      <td class="stack-pad" style="padding:16px 30px 8px 30px;background-color:${T.surface};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.successSurface};border:1px solid ${T.successBorder};border-radius:12px;">
          <tr>
            <td style="padding:20px;font-family:${T.fontStack};font-size:14px;line-height:1.5;color:${T.successBody};">${esc(r.alert)}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="${dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:16px 30px 8px 30px;background-color:${T.surface};font-family:${T.fontStack};">
        <p style="margin:0 0 10px 0;font-size:16px;font-weight:500;line-height:1.5;color:${T.body};">${esc(greeting)}</p>
        <p style="margin:0;font-size:14px;color:${T.muted};">${esc(r.summarySubtitle)}</p>
      </td>
    </tr>
    ${ctaRow}
    <tr>
      <td class="stack-pad" style="padding:8px 30px 16px 30px;background-color:${T.surface};">
        ${sectionTitle({ title: r.summaryTitle, dir })}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:12px;">
          <tr>
            <td style="padding:24px;font-family:${T.fontStack};">
              <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:${T.secondary};text-align:center;">🎫 Event: <bdi>${esc(fest)}</bdi></p>
              <p style="margin:0 0 16px 0;font-size:14px;color:${T.muted};text-align:center;">Registration ID: <span dir="ltr">${esc(SAMPLE.registration.id)}</span></p>
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:500;color:${T.muted};letter-spacing:0.5px;">REGISTRATION DATE &amp; TIME</p>
              <p style="margin:0 0 12px 0;font-size:15px;font-weight:500;color:${T.secondary};">${esc(SAMPLE.registration.dateTime)}</p>
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:500;color:${T.muted};letter-spacing:0.5px;">CURRENT STATUS</p>
              <p style="margin:0 0 12px 0;font-size:15px;font-weight:500;color:${T.secondary};">${esc(SAMPLE.registration.status)}</p>
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:500;color:${T.muted};letter-spacing:0.5px;">PAYMENT DEADLINE</p>
              <p style="margin:0;font-size:15px;font-weight:500;color:${T.body};">${esc(SAMPLE.registration.paymentDeadline)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:8px 30px 16px 30px;background-color:${T.surface};">
        ${sectionTitle({ title: r.buyerTitle, dir })}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:12px;">
          <tr>
            <td style="padding:24px;font-family:${T.fontStack};font-size:15px;color:${T.body};">
              <p style="margin:0 0 8px 0;">Name: <bdi>${esc(SAMPLE.user.fullName)}</bdi></p>
              <p style="margin:0 0 8px 0;">Email: <span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.user.email)}</span></p>
              <p style="margin:0;">Phone: <span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.user.phone)}</span></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:8px 30px 16px 30px;background-color:${T.surface};">
        ${sectionTitle({ title: `${r.ticketsTitle} (2)`, dir })}
        <p style="margin:0 0 12px 0;font-family:${T.fontStack};font-size:14px;color:${T.muted};">${esc(r.ticketsSubtitle)}</p>
        ${ticketItem(1, 2, 'General Admission', SAMPLE.user.fullName, SAMPLE.user.email, SAMPLE.user.phone, true)}
        ${ticketItem(2, 2, 'VIP', SAMPLE.guest.fullName, SAMPLE.guest.email, null, false)}
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:8px 30px 16px 30px;background-color:${T.surface};">
        ${sectionTitle({ title: r.eventTitle, dir })}
        <p style="margin:0 0 12px 0;font-family:${T.fontStack};font-size:14px;color:${T.muted};">${esc(r.eventSubtitle)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:12px;">
          <tr>
            <td style="padding:24px;font-family:${T.fontStack};">
              <p style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:${T.secondary};text-align:center;"><bdi>${esc(fest)}</bdi></p>
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:${T.body};">🚪 Doors Open At</p>
              <p style="margin:0 0 12px 0;font-size:14px;color:${T.body};">${esc(SAMPLE.festival.doorsOpen)}</p>
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:${T.body};">Event Start Date</p>
              <p style="margin:0 0 12px 0;font-size:14px;color:${T.body};">${esc(SAMPLE.festival.start)}</p>
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:${T.body};">Event End Date</p>
              <p style="margin:0 0 12px 0;font-size:14px;color:${T.body};">${esc(SAMPLE.festival.end)}</p>
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:${T.body};">Venue</p>
              <p style="margin:0 0 12px 0;font-size:14px;color:${T.body};"><bdi>${esc(SAMPLE.festival.place)}</bdi></p>
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:${T.body};">Location</p>
              <p style="margin:0 0 12px 0;font-size:14px;color:${T.body};"><bdi>${esc(SAMPLE.festival.address)}</bdi></p>
              <p style="margin:0;font-size:14px;font-weight:700;"><a href="${esc(SAMPLE.festival.mapUrl)}" style="color:${T.secondary};text-decoration:none;">${esc(r.viewMap)}</a></p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-family:${T.fontStack};font-size:12px;color:${T.muted};text-align:center;">${esc(SAMPLE.festival.timezoneNote)}</p>
      </td>
    </tr>
    ${ctaRow}
    <tr>
      <td align="center" class="stack-pad" style="padding:16px 30px 24px 30px;background-color:${T.surface};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:8px;">
          <tr>
            <td align="center" style="padding:20px 24px;font-family:${T.fontStack};">
              <p style="margin:0 0 10px 0;font-size:14px;font-weight:700;color:${T.body};">${esc(r.footerTag)}</p>
              <p style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:${T.body};">${esc(r.contactUs)}</p>
              <p style="margin:0 0 10px 0;font-size:12px;color:${T.muted};">[WA]&nbsp;&nbsp;[LI]&nbsp;&nbsp;[FB]&nbsp;&nbsp;[X]&nbsp;&nbsp;[IG]</p>
              <p style="margin:0;font-size:13px;color:${T.body};">${esc(r.copyright)}</p>
            </td>
          </tr>
        </table>
        <p style="margin:10px 0 0 0;font-family:${T.fontStack};font-size:12px;color:${T.muted};text-align:center;">${esc(r.autoNote)}</p>
        <p style="margin:6px 0 0 0;font-family:${T.fontStack};font-size:12px;color:${T.muted};text-align:center;">${esc(r.help)}</p>
      </td>
    </tr>
  `;
  return wrapEmailDocument({
    lang,
    dir,
    title: r.title,
    preheader: r.preheader,
    bodyRows: rows,
  });
}

function renderSupport(L, dir, lang, variant, longContent) {
  const s = L.support;
  const details =
    variant === 'longDetails' || longContent
      ? SAMPLE.support.detailsLong
      : SAMPLE.support.detailsDefault;

  const rows = `
    ${visiblePreheaderBar(`Preheader: ${s.preheader}`, dir)}
    ${brandedHeader({ locale: 'en', dir })}
    <tr>
      <td class="stack-pad" style="padding:24px 30px 8px 30px;background-color:${T.surface};">
        <h1 style="margin:0;font-family:${T.fontStack};font-size:20px;font-weight:700;color:${T.heading};">${esc(s.heading)}</h1>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:8px 30px;background-color:${T.surface};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.errorSurface};border:1px solid ${T.errorBorder};border-radius:8px;">
          <tr>
            <td style="padding:16px;font-family:${T.fontStack};font-size:14px;font-weight:700;color:${T.errorFg};">Environment: ${esc(SAMPLE.support.environment)}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:16px 30px;background-color:${T.surface};font-family:${T.fontStack};">
        <p style="margin:0 0 10px 0;font-size:16px;font-weight:500;color:${T.body};">${esc(s.intro)}</p>
        <p style="margin:0 0 12px 0;font-size:13px;color:${T.muted};">${esc(s.hint)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.light100};border:1px solid ${T.border};border-radius:8px;">
          <tr>
            <td style="padding:16px;font-family:${T.fontMono};font-size:13px;line-height:1.45;color:${T.body};white-space:pre-wrap;word-break:break-word;">${esc(details)}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:20px 30px 24px 30px;background-color:${T.surface};font-family:${T.fontStack};font-size:12px;">
        <p style="margin:0 0 8px 0;color:${T.muted};">${esc(s.footer1)}</p>
        <p style="margin:0;color:${T.muted};">${esc(s.footer2)}</p>
      </td>
    </tr>
  `;
  return wrapEmailDocument({
    lang,
    dir,
    title: s.title,
    preheader: s.preheader,
    bodyRows: rows,
  });
}
