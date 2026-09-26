import { BATCH20_LOCALES } from './batch20-locales.generated.js';
import {
  brandedFooter,
  brandedHeader,
  detailsTable,
  esc,
  fixtureUrl,
  kvRow,
  nextStepsPanel,
  primaryCtaYellow,
  sectionTitle,
  statusAlert,
  wrapEmailDocument,
} from './email-kit.js';
import { LOCALES, SAMPLE } from './sample-data.js';
import { TOKENS as T } from './tokens.js';

const ALL_LOCALES = Object.freeze(['en', 'fr', 'es', 'ar', 'fa']);
const EN_ONLY = Object.freeze(['en']);
const DISPUTE_VARIANTS = Object.freeze({
  organizer: Object.freeze({ audience: 'organizer', stripeConnect: false, lastReminder: false, paymentLink: false, trackingPixel: false }),
  organizerWithPaymentLink: Object.freeze({ audience: 'organizer', stripeConnect: false, lastReminder: false, paymentLink: true, trackingPixel: true }),
  organizerTrackingOnly: Object.freeze({ audience: 'organizer', stripeConnect: false, lastReminder: false, paymentLink: false, trackingPixel: true }),
  organizerLastReminder: Object.freeze({ audience: 'organizer', stripeConnect: false, lastReminder: true, paymentLink: false, trackingPixel: false }),
  organizerStripeConnect: Object.freeze({ audience: 'organizer', stripeConnect: true, lastReminder: false, paymentLink: true, trackingPixel: true }),
  organizerStripeConnectLastReminder: Object.freeze({ audience: 'organizer', stripeConnect: true, lastReminder: true, paymentLink: true, trackingPixel: true }),
  admin: Object.freeze({ audience: 'admin', stripeConnect: false, lastReminder: false, paymentLink: false, trackingPixel: false }),
  adminWithPaymentLink: Object.freeze({ audience: 'admin', stripeConnect: false, lastReminder: false, paymentLink: true, trackingPixel: true }),
  adminLastReminder: Object.freeze({ audience: 'admin', stripeConnect: false, lastReminder: true, paymentLink: false, trackingPixel: false }),
  adminStripeConnect: Object.freeze({ audience: 'admin', stripeConnect: true, lastReminder: false, paymentLink: true, trackingPixel: true }),
  adminStripeConnectLastReminder: Object.freeze({ audience: 'admin', stripeConnect: true, lastReminder: true, paymentLink: true, trackingPixel: true }),
});
const DISPUTE_VARIANT_LOCALES = Object.freeze(Object.fromEntries(
  Object.entries(DISPUTE_VARIANTS).map(([name, config]) => [
    name,
    config.audience === 'admin' ? EN_ONLY : ALL_LOCALES,
  ]),
));

/**
 * Explicit renderer coverage for Preview controls and focused QA.
 * Admin dispute variants force English even if a caller passes another locale.
 */
export const BATCH20_WORKFLOW_EMAILS = Object.freeze({
  festival_update_request_approved: Object.freeze({
    locales: ALL_LOCALES,
    variants: Object.freeze(['all', 'allWithNote', 'partial', 'partialWithNote']),
  }),
  festival_update_request_rejected: Object.freeze({
    locales: ALL_LOCALES,
    variants: Object.freeze(['default', 'withNote']),
  }),
  festival_vendor_sale_rejection: Object.freeze({
    locales: ALL_LOCALES,
    variants: Object.freeze(['default', 'reasonOnly', 'noteOnly', 'noReasonOrNote', 'noBankFees', 'noOptionalFees']),
  }),
  needs_response_dispute_reminder: Object.freeze({
    locales: ALL_LOCALES,
    variants: Object.freeze(Object.keys(DISPUTE_VARIANTS)),
    variantLocales: DISPUTE_VARIANT_LOCALES,
  }),
  festival_update_request_issued: Object.freeze({
    locales: EN_ONLY,
    variants: Object.freeze(['default']),
  }),
  festival_created: Object.freeze({
    locales: EN_ONLY,
    variants: Object.freeze(['default']),
  }),
  festival_marketing_approval: Object.freeze({
    locales: EN_ONLY,
    variants: Object.freeze(['default', 'withoutLogo', 'withoutImage', 'withoutImages']),
  }),
  festival_marketing_approval_sms: Object.freeze({
    locales: EN_ONLY,
    variants: Object.freeze(['default']),
  }),
});

const COPY_PREFIX = Object.freeze({
  updateRequest: 'FestivalUpdateRequest',
  vendorRejection: 'FestivalVendorSaleRejection',
  disputeReminder: 'DisputeReminder',
});

const FIXTURE = Object.freeze({
  organizerName: 'Morgan Organizer',
  submitterOrganizerName: 'Taylor Organizer',
  adminName: 'Eveenty Admin',
  adminEmail: 'admin@example.com',
  businessName: 'Harbour Market Collective',
  boothName: 'Harbour Snacks Booth',
  orderNumber: 'VS-20418',
  updateDescription: 'Festival dates, venue access notes, and ticket-map image',
  reviewNote: 'The requested venue and schedule details were reviewed against the submitted event plan.',
  rejectionNote: 'The seasonal item is unavailable. Please place a new order from the updated booth menu.',
  deadline: 'Oct 5, 2026 · 5:00 PM America/Toronto',
  daysRemaining: '2',
  transactionType: 'Tickets · Add-Ons',
  marketingSubject: 'Summer Music Festival 2026 — weekend update',
  festivalEmail: 'hello@festival.example.com',
  approveEmailUrl: 'https://example.com/festivals/marketing/email/request/sample-request/approve',
  declineEmailUrl: 'https://example.com/festivals/marketing/email/request/sample-request/decline',
  approveSmsUrl: 'https://example.com/festivals/marketing/sms/request/sample-request/approve',
  declineSmsUrl: 'https://example.com/festivals/marketing/sms/request/sample-request/decline',
  paymentUrl: 'https://example.com/preview/disputes/sample/payment',
  trackingUrl: 'https://example.com/preview/disputes/sample/open.gif',
  smsMessage: 'Reminder: Summer Music Festival 2026 opens at 6:00 PM. Bring your digital ticket to the east entrance.',
});

function localeCode(locale) {
  return BATCH20_LOCALES[locale] && LOCALES[locale] ? locale : 'en';
}

function fonts(dir) {
  return {
    body: dir === 'rtl' ? T.fontBodyRtl : T.fontBody,
    heading: dir === 'rtl' ? T.fontBodyRtl : T.fontHeading,
  };
}

function copy(locale, group, suffix) {
  const code = localeCode(locale);
  const key = `${COPY_PREFIX[group]}${suffix}`;
  const value = BATCH20_LOCALES[code]?.[group]?.[key];
  if (value == null) {
    throw new Error(`Missing batch-20 locale copy: ${code}.${group}.${key}`);
  }
  return value;
}

function replaceLocalePlaceholders(value, data, escapeValues) {
  return String(value ?? '').replace(/\{\{\s*\.([A-Za-z0-9_]+)\s*\}\}/g, (_match, key) => {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      throw new Error(`Missing localized placeholder value: ${key}`);
    }
    return escapeValues ? esc(data[key]) : String(data[key] ?? '');
  });
}

/** Trusted static markup comes only from the generated production locale packs. */
function localeHtml(value, data = {}) {
  return replaceLocalePlaceholders(value, data, true).replaceAll('#E8CF21', T.primary);
}

function localeText(value, data = {}) {
  return esc(replaceLocalePlaceholders(value, data, false));
}

function footer(locale, email = 'info@eveenty.com') {
  const L = LOCALES[localeCode(locale)] || LOCALES.en;
  const generic = L.activate || LOCALES.en.activate;
  return brandedFooter({
    email,
    copyright: generic.copyright,
    dir: L.dir,
    fontFamily: fonts(L.dir).body,
    footerLead: generic.footerLead,
    footerSuffix: generic.footerSuffix,
  });
}

function moneySummary(rows, dir, fontFamily) {
  const align = dir === 'rtl' ? 'right' : 'left';
  const valueAlign = dir === 'rtl' ? 'left' : 'right';
  return `
    <table role="presentation" width="350" cellpadding="0" cellspacing="0" border="0" style="width:350px;max-width:100%;border-collapse:collapse;background-color:${T.primary};border-radius:8px;">
      <tr>
        <td style="padding:18px 18px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            ${rows.map(({ label, value }, index) => `
              <tr>
                <td align="${align}" style="padding:0 0 10px;font-family:${fontFamily};font-size:${index === rows.length - 1 ? 16 : 14}px;line-height:1.4;font-weight:${index === rows.length - 1 ? 700 : 500};color:${T.heading};">${esc(label)}</td>
                <td align="${valueAlign}" dir="ltr" style="padding:0 0 10px;font-family:${fontFamily};font-size:${index === rows.length - 1 ? 16 : 14}px;line-height:1.4;font-weight:${index === rows.length - 1 ? 700 : 500};color:${T.heading};white-space:nowrap;">${esc(value)}</td>
              </tr>`).join('')}
          </table>
        </td>
      </tr>
    </table>`;
}

function safeMailto(email) {
  return `<a href="mailto:${esc(email)}" dir="ltr" style="color:${T.secondary};text-decoration:underline;unicode-bidi:embed;">${esc(email)}</a>`;
}

function cad(value) {
  return `CA$${Number(value).toFixed(2)}`;
}

function actionPair(approveUrl, declineUrl, fontFamily) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;">
      <tr>
        <td valign="top" style="padding:0 6px 12px;">${primaryCtaYellow({ href: approveUrl, label: 'Approve', fontFamily })}</td>
        <td valign="top" style="padding:0 6px 12px;">${primaryCtaYellow({ href: declineUrl, label: 'Decline', fontFamily })}</td>
      </tr>
    </table>`;
}

export function renderBatch20WorkflowEmail(
  emailId,
  { locale = 'en', variant = 'default', longContent = false } = {},
) {
  const metadata = BATCH20_WORKFLOW_EMAILS[emailId];
  if (!metadata) throw new Error(`Unknown batch-20 workflow email id: ${emailId}`);
  const normalizedVariant = variant === 'default' && !metadata.variants.includes('default')
    ? metadata.variants[0]
    : variant;
  if (!metadata.variants.includes(normalizedVariant)) {
    throw new Error(`Unknown ${emailId} variant: ${variant}`);
  }
  switch (emailId) {
    case 'festival_update_request_approved':
      return renderUpdateRequest({ approved: true, locale, variant: normalizedVariant, longContent });
    case 'festival_update_request_rejected':
      return renderUpdateRequest({ approved: false, locale, variant: normalizedVariant, longContent });
    case 'festival_vendor_sale_rejection':
      return renderVendorRejection({ locale, variant: normalizedVariant, longContent });
    case 'needs_response_dispute_reminder':
      return renderDisputeReminder({ locale, variant: normalizedVariant, longContent });
    case 'festival_update_request_issued':
      return renderUpdateRequestIssued({ longContent });
    case 'festival_created':
      return renderFestivalCreated({ longContent });
    case 'festival_marketing_approval':
      return renderMarketingApproval({ variant: normalizedVariant, longContent });
    case 'festival_marketing_approval_sms':
      return renderMarketingSmsApproval({ longContent });
    default:
      throw new Error(`Unknown batch-20 workflow email id: ${emailId}`);
  }
}

function renderUpdateRequest({ approved, locale, variant, longContent }) {
  const code = localeCode(locale);
  const L = LOCALES[code] || LOCALES.en;
  const { body, heading } = fonts(L.dir);
  const partial = approved && String(variant).startsWith('partial');
  const withNote = String(variant).endsWith('WithNote') || variant === 'withNote';
  const recipientName = longContent ? `${SAMPLE.user.fullName} ${'Extended Recipient Name '.repeat(2).trim()}` : SAMPLE.user.fullName;
  const festivalName = longContent ? `${SAMPLE.festival.name} — ${'Community Arts and Culture Weekend '.repeat(2).trim()}` : SAMPLE.festival.name;
  const submitterName = longContent ? `${FIXTURE.submitterOrganizerName} ${'Extended Organizer Name '.repeat(2).trim()}` : FIXTURE.submitterOrganizerName;
  const values = {
    ToName: recipientName,
    FestivalName: festivalName,
    SubmitterOrganizerName: submitterName,
  };
  const title = copy(code, 'updateRequest', approved ? 'HtmlDocumentTitleApproved' : 'HtmlDocumentTitleRejected');
  const bodyFirstKey = approved
    ? partial ? 'ApprovedBodyFirstPartial' : 'ApprovedBodyFirstAll'
    : 'RejectedBodyFirst';
  const bodySecondKey = approved ? 'ApprovedBodySecond' : 'RejectedBodySecond';
  const reviewHeading = copy(code, 'updateRequest', 'ReviewNotesHeading');
  const reviewIntro = copy(code, 'updateRequest', approved ? 'ReviewNotesIntroApproved' : 'ReviewNotesIntroRejected');
  const note = longContent
    ? `${FIXTURE.reviewNote} ${'Additional synthetic review context for wrapping and bidi verification. '.repeat(4).trim()}`
    : FIXTURE.reviewNote;
  const rows = `
    ${brandedHeader({ locale: L.logo, dir: L.dir, logoWidth: 160 })}
    <tr>
      <td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">
        ${statusAlert({
          variant: approved ? 'success' : 'error',
          title,
          bodyHtml: '',
          dir: L.dir,
          titleFontFamily: heading,
          bodyFontFamily: body,
        })}
      </td>
    </tr>
    <tr>
      <td align="${L.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:8px 30px 22px;background-color:${T.surface};font-family:${body};">
        <p style="margin:0 0 16px;font-size:18px;line-height:1.5;font-weight:600;color:${T.heading};">${localeText(copy(code, 'updateRequest', 'Greeting'), values)}</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${T.body};">${localeHtml(copy(code, 'updateRequest', bodyFirstKey), values)}</p>
        <p style="margin:0;font-size:16px;line-height:1.65;color:${T.body};">${localeHtml(copy(code, 'updateRequest', bodySecondKey), values)}</p>
      </td>
    </tr>
    ${withNote ? `
      <tr>
        <td class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
          ${sectionTitle({ title: reviewHeading, dir: L.dir, fontFamily: heading, fontWeight: 600 })}
          <p style="margin:0 0 10px;font-family:${body};font-size:14px;line-height:1.6;color:${T.body};">${esc(reviewIntro)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${T.primary50};border:1px solid ${T.border};border-radius:8px;">
            <tr>
              <td dir="auto" style="padding:16px;font-family:${body};font-size:14px;line-height:1.6;color:${T.body};white-space:pre-wrap;word-break:break-word;unicode-bidi:plaintext;text-align:start;">${esc(note)}</td>
            </tr>
          </table>
        </td>
      </tr>` : ''}
    ${footer(code, SAMPLE.user.email)}`;
  return wrapEmailDocument({
    lang: L.lang,
    dir: L.dir,
    title,
    preheader: title,
    bodyRows: rows,
    fontFamily: body,
  });
}

function renderVendorRejection({ locale, variant, longContent }) {
  const code = localeCode(locale);
  const L = LOCALES[code] || LOCALES.en;
  const { body, heading } = fonts(L.dir);
  const showReason = !['noteOnly', 'noReasonOrNote'].includes(variant);
  const showNote = !['reasonOnly', 'noReasonOrNote'].includes(variant);
  const showProcessingFees = variant !== 'noOptionalFees';
  const showBankFees = !['noBankFees', 'noOptionalFees'].includes(variant);
  const businessName = longContent
    ? `${FIXTURE.businessName} ${'International Artisan Cooperative '.repeat(2).trim()}`
    : FIXTURE.businessName;
  const festivalName = longContent ? `${SAMPLE.festival.name} — Extended Community Edition` : SAMPLE.festival.name;
  const clientName = longContent ? `${SAMPLE.user.fullName} Extended Customer Name` : SAMPLE.user.fullName;
  const note = longContent
    ? `${FIXTURE.rejectionNote} ${'This is synthetic long-content text for responsive review. '.repeat(5).trim()}`
    : FIXTURE.rejectionNote;
  const values = { BusinessName: businessName, OrderNumber: FIXTURE.orderNumber };
  const title = copy(code, 'vendorRejection', 'HtmlDocumentTitle');
  const orderTitle = localeText(copy(code, 'vendorRejection', 'OrderTitle'), values);
  const alertBody = localeHtml(copy(code, 'vendorRejection', 'AlertBody'), values);
  const releaseNotice = localeHtml(copy(code, 'vendorRejection', 'MoneyReleaseNotice'), values);
  const reason = copy(code, 'vendorRejection', 'ReasonOutOfStock');
  const baseItems = [
    { id: 'VD-1042', name: 'Festival picnic set', priceValue: 18, quantity: 2 },
    { id: 'VD-1088', name: 'Reusable drink bottle', priceValue: 22, quantity: 2 },
  ];
  const items = longContent
    ? baseItems.concat([
        { id: 'VD-1124-LONG', name: 'Limited-edition locally made festival keepsake with extended sample name', priceValue: 12, quantity: 1 },
        { id: 'VD-1199', name: 'Community supporter bundle', priceValue: 8, quantity: 3 },
      ])
    : baseItems;
  const itemCards = items.map((item) => {
    const amount = item.priceValue * item.quantity;
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid ${T.border};border-radius:8px;margin:0 0 12px;">
        <tr>
          <td colspan="2" align="${L.dir === 'rtl' ? 'right' : 'left'}" style="padding:12px 14px;background-color:${T.primary50};border-bottom:1px solid ${T.border};font-family:${body};font-size:15px;line-height:1.45;font-weight:600;color:${T.heading};">
            <span dir="ltr">#${esc(item.id)}</span> · <bdi>${esc(item.name)}</bdi>
          </td>
        </tr>
        ${kvRow(copy(code, 'vendorRejection', 'TableType'), `<bdi>${esc(copy(code, 'vendorRejection', 'ItemTypeProduct'))}</bdi>`, L.dir)}
        ${kvRow(copy(code, 'vendorRejection', 'TablePrice'), `<span dir="ltr">${esc(cad(item.priceValue))}</span>`, L.dir)}
        ${kvRow(copy(code, 'vendorRejection', 'TableQuantity'), `<span dir="ltr">${esc(item.quantity)}</span>`, L.dir)}
        ${kvRow(copy(code, 'vendorRejection', 'TableAmount'), `<strong dir="ltr">${esc(cad(amount))}</strong>`, L.dir)}
      </table>`;
  }).join('');
  const subtotal = items.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
  const processingFees = showProcessingFees ? 2.5 : 0;
  const tax = Number((subtotal * 0.13).toFixed(2));
  const bankFees = showBankFees ? 1.75 : 0;
  const grandTotal = subtotal + processingFees + tax + bankFees;
  const totals = [
    { label: copy(code, 'vendorRejection', 'Subtotal'), value: cad(subtotal) },
    ...(showProcessingFees ? [{ label: copy(code, 'vendorRejection', 'ProcessingFees'), value: cad(processingFees) }] : []),
    { label: copy(code, 'vendorRejection', 'Tax'), value: cad(tax) },
    ...(showBankFees ? [{ label: copy(code, 'vendorRejection', 'CreditCardFees'), value: cad(bankFees) }] : []),
    { label: copy(code, 'vendorRejection', 'GrandTotal'), value: cad(grandTotal) },
  ];
  const reasonPanel = showReason || showNote
    ? `
      <tr>
        <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${T.light100};border:1px solid ${T.border};border-radius:8px;">
            <tr>
              <td align="${L.dir === 'rtl' ? 'right' : 'left'}" style="padding:16px 18px;font-family:${body};font-size:14px;line-height:1.6;color:${T.body};">
                ${showReason ? `<p style="margin:0 ${showNote ? '0 10px' : '0'};"><strong>${esc(copy(code, 'vendorRejection', 'ReasonLabel'))}</strong> <bdi>${esc(reason)}</bdi></p>` : ''}
                ${showNote ? `<p style="margin:0;"><strong>${esc(copy(code, 'vendorRejection', 'NoteLabel'))}</strong><br><span dir="auto" style="unicode-bidi:isolate;">${esc(note)}</span></p>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : '';
  const rows = `
    ${brandedHeader({ locale: L.logo, dir: L.dir, logoWidth: 160 })}
    <tr>
      <td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">
        ${statusAlert({
          variant: 'error',
          title,
          bodyHtml: `${alertBody}<br><span style="display:inline-block;margin-top:8px;">${releaseNotice}</span>`,
          dir: L.dir,
          titleFontFamily: heading,
          bodyFontFamily: body,
        })}
      </td>
    </tr>
    <tr>
      <td align="center" class="stack-pad" style="padding:10px 30px 8px;background-color:${T.surface};font-family:${body};">
        <h1 style="margin:0 0 8px;font-family:${heading};font-size:22px;line-height:1.4;font-weight:600;color:${T.heading};">${orderTitle}</h1>
        <p style="margin:0;font-size:14px;line-height:1.55;color:${T.body};">${esc(copy(code, 'vendorRejection', 'SummarySubtitle'))}</p>
      </td>
    </tr>
    <tr>
      <td align="center" class="stack-pad" dir="auto" style="padding:8px 30px 20px;background-color:${T.surface};font-family:${heading};font-size:17px;line-height:1.5;font-weight:600;color:${T.secondary};word-break:break-word;">
        ${esc(festivalName)} <span aria-hidden="true">|</span> ${esc(FIXTURE.boothName)} <span aria-hidden="true">|</span> ${esc(businessName)}
      </td>
    </tr>
    ${reasonPanel}
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${sectionTitle({ title: copy(code, 'vendorRejection', 'OrderDetails'), dir: L.dir, fontFamily: heading, fontWeight: 600 })}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
          ${kvRow(copy(code, 'vendorRejection', 'ClientName'), `<bdi>${esc(clientName)}</bdi>`, L.dir)}
          ${kvRow(copy(code, 'vendorRejection', 'ClientPhone'), `<span dir="ltr">${esc(SAMPLE.user.phone)}</span>`, L.dir)}
          ${kvRow(copy(code, 'vendorRejection', 'ClientEmail'), `<span dir="ltr">${esc(SAMPLE.user.email)}</span>`, L.dir)}
          ${kvRow(copy(code, 'vendorRejection', 'OrderNumber'), `<span dir="ltr">#${esc(FIXTURE.orderNumber)}</span>`, L.dir)}
          ${kvRow(copy(code, 'vendorRejection', 'SubmittedAt'), `<span dir="ltr">${esc(SAMPLE.money.date)} ${esc(SAMPLE.money.time)}</span>`, L.dir)}
        </table>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${itemCards}
      </td>
    </tr>
    <tr>
      <td align="${L.dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
        ${moneySummary(totals, L.dir, body)}
      </td>
    </tr>
    ${footer(code, SAMPLE.user.email)}`;
  return wrapEmailDocument({
    lang: L.lang,
    dir: L.dir,
    title,
    preheader: replaceLocalePlaceholders(copy(code, 'vendorRejection', 'SubjectBuyerEmail'), values, false),
    bodyRows: rows,
    fontFamily: body,
  });
}

function renderDisputeReminder({ locale, variant, longContent }) {
  const normalizedVariant = !variant || variant === 'default' ? 'organizer' : variant;
  const config = DISPUTE_VARIANTS[normalizedVariant];
  if (!config) throw new Error(`Unknown dispute-reminder variant: ${variant}`);
  const admin = config.audience === 'admin';
  const code = admin ? 'en' : localeCode(locale);
  const L = LOCALES[code] || LOCALES.en;
  const { body, heading } = fonts(L.dir);
  const stripeConnect = config.stripeConnect;
  const lastReminder = config.lastReminder;
  const showPaymentLink = config.paymentLink;
  const showTrackingPixel = config.trackingPixel;
  const recipientName = admin
    ? FIXTURE.adminName
    : longContent ? `${FIXTURE.organizerName} ${'Extended Organizer Name '.repeat(2).trim()}` : FIXTURE.organizerName;
  const festivalName = longContent
    ? `${SAMPLE.festival.name} — ${'International Community Celebration '.repeat(2).trim()}`
    : SAMPLE.festival.name;
  const disputeReason = longContent
    ? `${SAMPLE.dispute.reason} — ${'synthetic supporting context for dynamic-content wrapping '.repeat(4).trim()}`
    : SAMPLE.dispute.reason;
  const values = { FestivalName: festivalName, Days: FIXTURE.daysRemaining };
  const title = copy(code, 'disputeReminder', 'HtmlDocumentTitle');
  const statusMessage = localeHtml(copy(code, 'disputeReminder', 'StatusMessage'), values);
  const actionContent = localeHtml(
    copy(code, 'disputeReminder', stripeConnect ? 'ActionRequiredStripeConnect' : 'ActionRequiredNonConnect'),
  );
  const transactionType = [
    copy(code, 'disputeReminder', 'TransactionItemTickets'),
    copy(code, 'disputeReminder', 'TransactionItemAddOns'),
  ].join(' · ');
  const details = detailsTable({
    headers: [
      copy(code, 'disputeReminder', 'FieldLabel'),
      copy(code, 'disputeReminder', 'DetailsLabel'),
    ],
    rows: [
      [copy(code, 'disputeReminder', 'UserNameLabel'), `<bdi>${esc(SAMPLE.user.fullName)}</bdi>`],
      [copy(code, 'disputeReminder', 'EmailLabel'), `<span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.user.email)}</span>`],
      [copy(code, 'disputeReminder', 'PhoneLabel'), `<span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.user.phone)}</span>`],
      [copy(code, 'disputeReminder', 'TransactionTypeLabel'), `<bdi>${esc(transactionType)}</bdi>`],
      [copy(code, 'disputeReminder', 'ReferenceLabel'), `<span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.dispute.reference)}</span>`],
      [copy(code, 'disputeReminder', 'ReasonLabel'), `<bdi>${esc(disputeReason)}</bdi>`],
      [copy(code, 'disputeReminder', 'AmountLabel'), `<span dir="ltr" style="unicode-bidi:embed;font-weight:600;">${esc(SAMPLE.dispute.amount)}</span>`],
      [copy(code, 'disputeReminder', 'FeesLabel'), `<span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.dispute.fees)}</span>`],
      [copy(code, 'disputeReminder', 'EvidenceFeesLabel'), `<span dir="ltr" style="unicode-bidi:embed;">${esc(SAMPLE.dispute.evidenceFees)}</span>`],
    ],
    dir: L.dir,
  });
  const deadlineRows = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${T.surface};border:1px solid ${T.border};border-radius:8px;">
      <tr>
        <td style="padding:16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            ${kvRow(copy(code, 'disputeReminder', 'DeadlineLabel'), `<span dir="ltr">${esc(FIXTURE.deadline)}</span>`, L.dir)}
            ${kvRow(copy(code, 'disputeReminder', 'DaysRemainingLabel'), `<strong>${localeText(copy(code, 'disputeReminder', 'DaysRemainingText'), values)}</strong>`, L.dir)}
          </table>
          <p style="margin:12px 0 0;font-family:${body};font-size:14px;line-height:1.55;font-weight:600;color:${T.warningFg};">${esc(copy(code, 'disputeReminder', 'UrgentWarning'))}</p>
        </td>
      </tr>
    </table>`;
  const rows = `
    ${brandedHeader({ locale: L.logo, dir: L.dir, logoWidth: 160 })}
    <tr>
      <td align="${L.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};font-family:${body};">
        <p style="margin:0;font-size:18px;line-height:1.5;font-weight:600;color:${T.heading};">${esc(copy(code, 'disputeReminder', 'Greeting'))} <bdi>${esc(recipientName)}</bdi>,</p>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 16px;background-color:${T.surface};">
        ${statusAlert({
          variant: 'warning',
          title: copy(code, 'disputeReminder', 'AlertTitle'),
          bodyHtml: statusMessage,
          dir: L.dir,
          titleFontFamily: heading,
          bodyFontFamily: body,
        })}
      </td>
    </tr>
    ${lastReminder ? `
      <tr>
        <td class="stack-pad" style="padding:0 30px 16px;background-color:${T.surface};">
          ${statusAlert({
            variant: 'error',
            title: copy(code, 'disputeReminder', 'LastReminderWarning'),
            bodyHtml: '',
            dir: L.dir,
            titleFontFamily: heading,
            bodyFontFamily: body,
          })}
        </td>
      </tr>` : ''}
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${sectionTitle({ title: copy(code, 'disputeReminder', 'DeadlineTitle'), dir: L.dir, fontFamily: heading, fontWeight: 600 })}
        ${deadlineRows}
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${nextStepsPanel({
          title: copy(code, 'disputeReminder', 'ActionRequiredTitle'),
          bodyHtml: actionContent,
          dir: L.dir,
        })}
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${sectionTitle({ title: copy(code, 'disputeReminder', 'EventInfoTitle'), dir: L.dir, fontFamily: heading, fontWeight: 600 })}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${T.light100};border:1px solid ${T.border};border-radius:8px;">
          <tr>
            <td align="${L.dir === 'rtl' ? 'right' : 'left'}" style="padding:18px;font-family:${body};font-size:15px;line-height:1.55;color:${T.body};">
              <strong>${esc(copy(code, 'disputeReminder', 'EventNameLabel'))}:</strong>
              <bdi style="font-weight:600;color:${T.heading};">${esc(festivalName)}</bdi>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${sectionTitle({ title: copy(code, 'disputeReminder', 'DetailsTitle'), dir: L.dir, fontFamily: heading, fontWeight: 600 })}
        ${details}
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${nextStepsPanel({
          title: copy(code, 'disputeReminder', 'NextStepsTitle'),
          bodyHtml: esc(copy(code, 'disputeReminder', 'NextStepsMessage')),
          dir: L.dir,
        })}
      </td>
    </tr>
    ${showPaymentLink ? `
      <tr>
        <td align="center" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
          ${primaryCtaYellow({
            href: FIXTURE.paymentUrl,
            label: copy(code, 'disputeReminder', 'ViewPayment'),
            fontFamily: body,
          })}
        </td>
      </tr>` : ''}
    <tr>
      <td align="${L.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};font-family:${body};">
        <h2 style="margin:0 0 8px;font-family:${heading};font-size:17px;line-height:1.4;font-weight:600;color:${T.heading};">${esc(copy(code, 'disputeReminder', 'NeedHelpTitle'))}</h2>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:${T.body};">${esc(copy(code, 'disputeReminder', 'NeedHelpText'))} ${safeMailto('info@eveenty.com')}.</p>
        <p style="margin:0 0 4px;font-size:15px;line-height:1.5;color:${T.body};">${esc(copy(code, 'disputeReminder', 'BestRegards'))}</p>
        <p style="margin:0;font-size:15px;line-height:1.5;font-weight:600;color:${T.heading};">${esc(copy(code, 'disputeReminder', 'TeamName'))}</p>
      </td>
    </tr>
    ${footer(code, admin ? FIXTURE.adminEmail : 'organizer@example.com')}
    ${showTrackingPixel ? `<tr>
      <td style="font-size:0;line-height:0;height:1px;">
        <img src="${esc(FIXTURE.trackingUrl)}" alt="" width="1" height="1" style="display:block;width:1px;height:1px;border:0;margin:0;padding:0;visibility:hidden;" />
      </td>
    </tr>` : ''}`;
  return wrapEmailDocument({
    lang: L.lang,
    dir: L.dir,
    title,
    preheader: copy(code, 'disputeReminder', 'Subject'),
    bodyRows: rows,
    fontFamily: body,
  });
}

function renderUpdateRequestIssued({ longContent }) {
  const organizerName = longContent
    ? `${FIXTURE.organizerName} ${'Extended Organizer Name '.repeat(3).trim()}`
    : FIXTURE.organizerName;
  const festivalName = longContent
    ? `${SAMPLE.festival.name} — ${'Extended Community Arts and Culture Edition '.repeat(2).trim()}`
    : SAMPLE.festival.name;
  const updateDescription = longContent
    ? `${FIXTURE.updateDescription}; ${'additional synthetic request context for responsive wrapping and review. '.repeat(5).trim()}`
    : FIXTURE.updateDescription;
  const rows = `
    ${brandedHeader({ locale: 'en', dir: 'ltr', logoWidth: 160 })}
    <tr>
      <td class="stack-pad" style="padding:28px 30px 10px;background-color:${T.surface};font-family:${T.fontBody};">
        <h1 style="margin:0;font-family:${T.fontHeading};font-size:24px;line-height:1.35;font-weight:600;color:${T.heading};">New Festival Changes Requested</h1>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:8px 30px 18px;background-color:${T.surface};font-family:${T.fontBody};font-size:16px;line-height:1.65;color:${T.body};">
        <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:${T.heading};">Dear ${esc(FIXTURE.adminName)},</p>
        <p style="margin:0;">The organizer, <bdi style="font-weight:600;color:${T.heading};">${esc(organizerName)}</bdi>, has requested some changes for the festival <bdi style="font-weight:600;color:${T.heading};">${esc(festivalName)}</bdi>. The following updates have been submitted and are now awaiting your review:</p>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 18px;background-color:${T.surface};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${T.primary50};border:1px solid ${T.border};border-radius:8px;">
          <tr>
            <td dir="auto" style="padding:18px;font-family:${T.fontBody};font-size:15px;line-height:1.6;color:${T.body};word-break:break-word;"><strong>Updated Item:</strong> ${esc(updateDescription)}.</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 28px;background-color:${T.surface};font-family:${T.fontBody};font-size:16px;line-height:1.65;color:${T.body};">
        <p style="margin:0;">You can review and approve the changes directly from the admin panel at your convenience.</p>
      </td>
    </tr>
    ${footer('en', FIXTURE.adminEmail)}`;
  return wrapEmailDocument({
    lang: 'en',
    dir: 'ltr',
    title: 'New Festival Changes Requested',
    preheader: `${festivalName} | New Festival Changes Requested | Admin Email`,
    bodyRows: rows,
    fontFamily: T.fontBody,
  });
}

function renderFestivalCreated({ longContent }) {
  const festivalName = longContent
    ? `${SAMPLE.festival.name} — ${'International Community Celebration '.repeat(2).trim()}`
    : SAMPLE.festival.name;
  const organizerName = longContent
    ? `${FIXTURE.organizerName} ${'Extended Organizer Name '.repeat(2).trim()}`
    : FIXTURE.organizerName;
  const address = longContent
    ? `${SAMPLE.festival.address}, ${'Building C, Community Pavilion, accessible east entrance '.repeat(2).trim()}`
    : SAMPLE.festival.address;
  const rows = `
    ${brandedHeader({ locale: 'en', dir: 'ltr', logoWidth: 160 })}
    <tr>
      <td class="stack-pad" style="padding:28px 30px 10px;background-color:${T.surface};font-family:${T.fontBody};">
        <h1 style="margin:0;font-family:${T.fontHeading};font-size:24px;line-height:1.35;font-weight:600;color:${T.heading};">New Festival Has Been Created</h1>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:8px 30px 18px;background-color:${T.surface};font-family:${T.fontBody};font-size:16px;line-height:1.65;color:${T.body};">
        <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:${T.heading};">Dear ${esc(FIXTURE.adminName)},</p>
        <p style="margin:0;">A new event titled <bdi style="font-weight:600;color:${T.heading};">${esc(festivalName)}</bdi> has been created by Organizer <bdi style="font-weight:600;color:${T.heading};">${esc(organizerName)}</bdi> and is currently awaiting your review.</p>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${statusAlert({
          variant: 'warning',
          title: 'The status of the event is pending.',
          bodyHtml: 'Please take a moment to review the event details in the admin dashboard and decide whether to approve or reject it.',
          dir: 'ltr',
          titleFontFamily: T.fontHeading,
          bodyFontFamily: T.fontBody,
        })}
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        ${sectionTitle({ title: 'Organizer Details', dir: 'ltr', fontFamily: T.fontHeading, fontWeight: 600 })}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${T.light100};border:1px solid ${T.border};border-radius:8px;">
          <tbody>
            ${kvRow('Organizer Name:', `<bdi>${esc(organizerName)}</bdi>`, 'ltr')}
            ${kvRow('Organizer Email:', `<span dir="ltr">organizer@example.com</span>`, 'ltr')}
            ${kvRow('Business Name:', `<bdi>${esc(FIXTURE.businessName)}</bdi>`, 'ltr')}
            ${kvRow('Phone Number:', `<span dir="ltr">${esc(SAMPLE.user.phone)}</span>`, 'ltr')}
            ${kvRow('Address:', `<bdi>${esc(address)}</bdi>`, 'ltr')}
            ${kvRow('Currency:', '<span dir="ltr">CAD</span>', 'ltr')}
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 28px;background-color:${T.surface};font-family:${T.fontBody};font-size:16px;line-height:1.65;color:${T.body};">
        <p style="margin:0;">You can view all details and take action in your admin panel.</p>
      </td>
    </tr>
    ${footer('en', FIXTURE.adminEmail)}`;
  return wrapEmailDocument({
    lang: 'en',
    dir: 'ltr',
    title: 'New Festival Has Been Created',
    preheader: `${festivalName} | New Festival Has Been Created | Admin Email`,
    bodyRows: rows,
    fontFamily: T.fontBody,
  });
}

function renderMarketingApproval({ variant, longContent }) {
  const showLogo = !['withoutLogo', 'withoutImages'].includes(variant);
  const showImage = !['withoutImage', 'withoutImages'].includes(variant);
  const festivalName = longContent
    ? `${SAMPLE.festival.name} — ${'International Community Weekend '.repeat(2).trim()}`
    : SAMPLE.festival.name;
  const bodyText = longContent
    ? `${SAMPLE.marketing.bodyText} ${'This synthetic organizer-authored preview copy exercises wrapping without trusting HTML. '.repeat(6).trim()}`
    : SAMPLE.marketing.bodyText;
  const subjectText = longContent
    ? `${FIXTURE.marketingSubject} — ${'schedule, artists, access details, and community announcements '.repeat(2).trim()}`
    : FIXTURE.marketingSubject;
  const rows = `
    ${brandedHeader({ locale: 'en', dir: 'ltr', logoWidth: 160 })}
    <tr>
      <td class="stack-pad" style="padding:28px 30px 12px;background-color:${T.surface};font-family:${T.fontBody};">
        <h1 style="margin:0 0 12px;font-family:${T.fontHeading};font-size:24px;line-height:1.35;font-weight:600;color:${T.heading};">Hi Hany,</h1>
        <p style="margin:0;font-size:17px;line-height:1.6;color:${T.body};"><bdi>${esc(festivalName)}</bdi> Requesting to send <strong>1,250 emails.</strong></p>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:4px 30px 20px;background-color:${T.surface};">
        ${sectionTitle({ title: `${FIXTURE.organizerName} paid the followings:`, dir: 'ltr', fontFamily: T.fontHeading, fontWeight: 600 })}
        ${moneySummary([
          { label: 'cost of', value: 'CA$100.00' },
          { label: 'the tax of', value: 'CA$13.00' },
          { label: 'the bank fees of', value: 'CA$3.25' },
          { label: 'so the total paid =', value: 'CA$116.25' },
        ], 'ltr', T.fontBody)}
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 16px;background-color:${T.surface};font-family:${T.fontBody};font-size:15px;line-height:1.6;color:${T.body};">
        <p style="margin:0 0 12px;font-weight:600;color:${T.heading};">here is how the email will look like</p>
        <p style="margin:0 0 6px;"><strong>Subject :</strong> <bdi>${esc(subjectText)}</bdi></p>
        <p style="margin:0;"><strong>FestivalEmail :</strong> <span dir="ltr">${esc(FIXTURE.festivalEmail)}</span></p>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid ${T.border};border-radius:8px;background-color:${T.primary50};">
          ${showLogo ? `
            <tr>
              <td align="center" style="padding:22px 20px 10px;font-size:0;line-height:0;">
                <img src="${esc(fixtureUrl('festival-logo-sample.png'))}" alt="SAMPLE festival logo — not production artwork" width="180" height="72" style="display:block;width:180px;max-width:100%;height:auto;border:0;" />
              </td>
            </tr>` : ''}
          <tr>
            <td align="center" style="padding:${showLogo ? '10px' : '22px'} 20px 18px;font-family:${T.fontBody};font-size:16px;line-height:1.7;color:${T.body};white-space:pre-wrap;word-break:break-word;">${esc(bodyText)}</td>
          </tr>
          ${showImage ? `
            <tr>
              <td align="center" style="padding:0 20px 20px;font-size:0;line-height:0;">
                <img src="${esc(fixtureUrl('festival-image-sample.png'))}" alt="SAMPLE festival campaign image — not production artwork" width="480" height="252" style="display:block;width:100%;max-width:480px;height:auto;border:0;" />
              </td>
            </tr>` : ''}
          <tr>
            <td align="center" style="padding:14px 20px;background-color:${T.heading};font-family:${T.fontBody};font-size:13px;line-height:1.5;font-weight:600;color:${T.primary50};">Powered by Eveenty</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
        ${actionPair(FIXTURE.approveEmailUrl, FIXTURE.declineEmailUrl, T.fontBody)}
      </td>
    </tr>
    ${footer('en', FIXTURE.adminEmail)}`;
  return wrapEmailDocument({
    lang: 'en',
    dir: 'ltr',
    title: `Festival Marketing campaign ${festivalName}`,
    preheader: `${festivalName} Requesting to send 1,250 emails.`,
    bodyRows: rows,
    fontFamily: T.fontBody,
  });
}

function renderMarketingSmsApproval({ longContent }) {
  const festivalName = longContent
    ? `${SAMPLE.festival.name} — ${'International Community Weekend '.repeat(2).trim()}`
    : SAMPLE.festival.name;
  const message = longContent
    ? `${FIXTURE.smsMessage} ${'Synthetic follow-up text for opt-in attendees and responsive wrapping. '.repeat(6).trim()}`
    : FIXTURE.smsMessage;
  const rows = `
    ${brandedHeader({ locale: 'en', dir: 'ltr', logoWidth: 160 })}
    <tr>
      <td class="stack-pad" style="padding:28px 30px 12px;background-color:${T.surface};font-family:${T.fontBody};">
        <h1 style="margin:0 0 12px;font-family:${T.fontHeading};font-size:24px;line-height:1.35;font-weight:600;color:${T.heading};">Hi Hany,</h1>
        <p style="margin:0;font-size:17px;line-height:1.6;color:${T.body};"><bdi>${esc(festivalName)}</bdi> Requesting to send <strong>850 SMS messages.</strong></p>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:4px 30px 20px;background-color:${T.surface};">
        ${sectionTitle({ title: `${FIXTURE.organizerName} paid the followings:`, dir: 'ltr', fontFamily: T.fontHeading, fontWeight: 600 })}
        ${moneySummary([
          { label: 'cost of', value: 'CA$68.00' },
          { label: 'the tax of', value: 'CA$8.84' },
          { label: 'the bank fees of', value: 'CA$2.20' },
          { label: 'so the total paid =', value: 'CA$79.04' },
        ], 'ltr', T.fontBody)}
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 12px;background-color:${T.surface};font-family:${T.fontBody};font-size:15px;line-height:1.6;color:${T.body};">
        <p style="margin:0;font-weight:600;color:${T.heading};">here is how the Text of the SMS message</p>
      </td>
    </tr>
    <tr>
      <td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:${T.primary50};border:1px solid ${T.border};border-radius:8px;">
          <tr>
            <td dir="auto" style="padding:20px;font-family:${T.fontBody};font-size:16px;line-height:1.7;color:${T.body};white-space:pre-wrap;word-break:break-word;">${esc(message)}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
        ${actionPair(FIXTURE.approveSmsUrl, FIXTURE.declineSmsUrl, T.fontBody)}
      </td>
    </tr>
    ${footer('en', FIXTURE.adminEmail)}`;
  return wrapEmailDocument({
    lang: 'en',
    dir: 'ltr',
    title: `Festival Marketing SMS campaign ${festivalName}`,
    preheader: `${festivalName} Requesting to send 850 SMS messages.`,
    bodyRows: rows,
    fontFamily: T.fontBody,
  });
}
