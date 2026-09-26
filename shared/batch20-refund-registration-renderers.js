import { BATCH20_LOCALES } from './batch20-locales.generated.js';
import {
  brandedFooter,
  brandedHeader,
  esc,
  fixtureUrl,
  kvRow,
  sectionTitle,
  statusAlert,
  wrapEmailDocument,
} from './email-kit.js';
import { LOCALES, SAMPLE } from './sample-data.js';
import { TOKENS as T } from './tokens.js';

const FIVE_LOCALES = Object.freeze(['en', 'fr', 'es', 'ar', 'fa']);
const REFUND_VARIANTS = Object.freeze([
  'refundAndCanceled',
  'refundOnly',
  'canceledOnly',
  'externalPayment',
  'noProcessingFees',
  'adjustmentsAndProof',
  'refundedBankFees',
]);
const REGISTRATION_VARIANTS = Object.freeze(['user', 'organizer', 'admin']);
const REGISTRATION_VARIANT_LOCALES = Object.freeze({
  user: FIVE_LOCALES,
  organizer: FIVE_LOCALES,
  admin: Object.freeze(['en']),
});
const APPROVAL_VARIANTS = Object.freeze([
  'artistApproved',
  'artistApprovedWithNote',
  'artistRejected',
  'artistRejectedWithNote',
  'speakerApproved',
  'speakerApprovedWithNote',
  'speakerRejected',
  'speakerRejectedWithNote',
  'volunteerApproved',
  'volunteerApprovedWithNote',
  'volunteerRejected',
  'volunteerRejectedWithNote',
]);

/** Exact locale and variant coverage for this B3 + B5 renderer slice. */
export const BATCH20_REFUND_REGISTRATION_EMAILS = Object.freeze({
  refund_receipt_organizer: Object.freeze({
    locales: FIVE_LOCALES,
    variants: REFUND_VARIANTS,
  }),
  refund_receipt_admin: Object.freeze({
    locales: Object.freeze(['en']),
    variants: REFUND_VARIANTS,
  }),
  festival_ticket_registration: Object.freeze({
    locales: FIVE_LOCALES,
    variants: REGISTRATION_VARIANTS,
    variantLocales: REGISTRATION_VARIANT_LOCALES,
  }),
  festival_ticket_registration_deadline_exceeded: Object.freeze({
    locales: FIVE_LOCALES,
    variants: REGISTRATION_VARIANTS,
    variantLocales: REGISTRATION_VARIANT_LOCALES,
  }),
  festival_ticket_registration_payment_deadline_exceeded: Object.freeze({
    locales: FIVE_LOCALES,
    variants: REGISTRATION_VARIANTS,
    variantLocales: REGISTRATION_VARIANT_LOCALES,
  }),
  registration_approval_status_changed: Object.freeze({
    locales: FIVE_LOCALES,
    variants: APPROVAL_VARIANTS,
  }),
});

const REFUND_VARIANT_ALIASES = Object.freeze({
  default: 'refundAndCanceled',
  combined: 'refundAndCanceled',
  cardPayment: 'refundAndCanceled',
  refundAndCanceled: 'refundAndCanceled',
  refundOnly: 'refundOnly',
  canceledOnly: 'canceledOnly',
  external: 'externalPayment',
  externalPayment: 'externalPayment',
  noProcessingFees: 'noProcessingFees',
  refundWithAdjustments: 'adjustmentsAndProof',
  adjustmentsAndProof: 'adjustmentsAndProof',
  refundedFeesAndProof: 'refundedBankFees',
  refundedBankFees: 'refundedBankFees',
});

const REFUND_CONFIG = Object.freeze({
  refundAndCanceled: Object.freeze({ refund: true, canceled: true, processing: true }),
  refundOnly: Object.freeze({ refund: true, canceled: false, processing: true }),
  canceledOnly: Object.freeze({ refund: false, canceled: true }),
  externalPayment: Object.freeze({ refund: true, canceled: false, external: true, processing: false }),
  noProcessingFees: Object.freeze({ refund: true, canceled: false, processing: false }),
  adjustmentsAndProof: Object.freeze({
    refund: true,
    canceled: true,
    processing: true,
    adjustments: true,
    proof: true,
    bankMode: 'deducted',
  }),
  refundedBankFees: Object.freeze({
    refund: true,
    canceled: false,
    processing: true,
    adjustments: true,
    proof: true,
    bankMode: 'refunded',
  }),
});

const APPROVAL_CONFIG = Object.freeze({
  artistApproved: Object.freeze({ persona: 'artist', status: 'approved', note: false }),
  artistApprovedWithNote: Object.freeze({ persona: 'artist', status: 'approved', note: true }),
  artistRejected: Object.freeze({ persona: 'artist', status: 'rejected', note: false }),
  artistRejectedWithNote: Object.freeze({ persona: 'artist', status: 'rejected', note: true }),
  speakerApproved: Object.freeze({ persona: 'speaker', status: 'approved', note: false }),
  speakerApprovedWithNote: Object.freeze({ persona: 'speaker', status: 'approved', note: true }),
  speakerRejected: Object.freeze({ persona: 'speaker', status: 'rejected', note: false }),
  speakerRejectedWithNote: Object.freeze({ persona: 'speaker', status: 'rejected', note: true }),
  volunteerApproved: Object.freeze({ persona: 'volunteer', status: 'approved', note: false }),
  volunteerApprovedWithNote: Object.freeze({ persona: 'volunteer', status: 'approved', note: true }),
  volunteerRejected: Object.freeze({ persona: 'volunteer', status: 'rejected', note: false }),
  volunteerRejectedWithNote: Object.freeze({ persona: 'volunteer', status: 'rejected', note: true }),
});

const APPROVAL_VARIANT_ALIASES = Object.freeze({
  default: 'artistApproved',
  approved: 'artistApproved',
  approvedWithNote: 'artistApprovedWithNote',
  rejected: 'artistRejected',
  rejectedWithNote: 'artistRejectedWithNote',
  ...Object.fromEntries(APPROVAL_VARIANTS.map((name) => [name, name])),
});

const REGISTRATION_COPY = Object.freeze({
  new: Object.freeze({
    subject: Object.freeze({
      user: 'FestivalTicketRegistrationUserSubject',
      organizer: 'FestivalTicketRegistrationOrganizerSubject',
      admin: 'FestivalTicketRegistrationAdminSubject',
    }),
    greeting: Object.freeze({
      user: 'FestivalTicketRegistrationGreetingUserNew',
      organizer: 'FestivalTicketRegistrationGreetingOrganizerNew',
      admin: 'FestivalTicketRegistrationGreetingAdminNew',
    }),
    status: 'FestivalTicketRegistrationStatusPendingReview',
  }),
  reviewDeadline: Object.freeze({
    subject: Object.freeze({
      user: 'FestivalTicketRegistrationReviewDeadlineUserSubject',
      organizer: 'FestivalTicketRegistrationReviewDeadlineOrganizerSubject',
      admin: 'FestivalTicketRegistrationReviewDeadlineAdminSubject',
    }),
    greeting: Object.freeze({
      user: 'FestivalTicketRegistrationGreetingUserReviewDeadline',
      organizer: 'FestivalTicketRegistrationGreetingOrganizerReviewDeadline',
      admin: 'FestivalTicketRegistrationGreetingAdminReviewDeadline',
    }),
    status: 'FestivalTicketRegistrationStatusReviewDeadlineExceeded',
    alertBody: 'FestivalTicketRegistrationAlertReviewBody',
  }),
  paymentDeadline: Object.freeze({
    subject: Object.freeze({
      user: 'FestivalTicketRegistrationPaymentDeadlineUserSubject',
      organizer: 'FestivalTicketRegistrationPaymentDeadlineOrganizerSubject',
      admin: 'FestivalTicketRegistrationPaymentDeadlineAdminSubject',
    }),
    greeting: Object.freeze({
      user: 'FestivalTicketRegistrationGreetingUserPaymentDeadline',
      organizer: 'FestivalTicketRegistrationGreetingOrganizerPaymentDeadline',
      admin: 'FestivalTicketRegistrationGreetingAdminPaymentDeadline',
    }),
    status: 'FestivalTicketRegistrationStatusPaymentDeadlineExceeded',
    userStatus: 'FestivalTicketRegistrationStatusCancelled',
    alertBody: 'FestivalTicketRegistrationAlertPaymentBody',
  }),
});

const REFUND_SAMPLE = Object.freeze({
  organizer: Object.freeze({ name: 'Morgan Organizer', email: 'organizer@example.com' }),
  admin: Object.freeze({ name: 'Eveenty Admin', email: 'admin@example.com' }),
  items: Object.freeze([
    Object.freeze({
      id: 'RF-18402',
      name: 'General Admission',
      typeKey: 'RefundItemsItemTypeTicket',
      quantity: '2',
      cost: 'CA$60.00',
      processing: 'CA$2.00',
      tax: 'CA$7.80',
      gratuity: 'CA$4.00',
      facility: 'CA$1.00',
      totalWithoutProcessing: 'CA$67.80',
      totalStandard: 'CA$69.80',
      totalAdjusted: 'CA$74.80',
    }),
    Object.freeze({
      id: 'RF-18403',
      name: 'Accessibility Add-on',
      typeKey: 'RefundItemsItemTypeAddOn',
      quantity: '1',
      cost: 'CA$20.00',
      processing: 'CA$0.50',
      tax: 'CA$2.60',
      gratuity: 'CA$1.00',
      facility: 'CA$0.50',
      totalWithoutProcessing: 'CA$22.60',
      totalStandard: 'CA$23.10',
      totalAdjusted: 'CA$24.60',
    }),
  ]),
  canceled: Object.freeze([
    Object.freeze({ id: 'CN-20818', name: 'Community Workshop Pass', typeKey: 'RefundItemsItemTypeTicket', quantity: '1' }),
  ]),
});

function fonts(dir) {
  return {
    body: dir === 'rtl' ? T.fontBodyRtl : T.fontBody,
    heading: dir === 'rtl' ? T.fontBodyRtl : T.fontHeading,
  };
}

function normalizeLocale(locale) {
  return Object.hasOwn(BATCH20_LOCALES, locale) ? locale : 'en';
}

function interpolate(value, replacements) {
  return Object.entries(replacements).reduce(
    (text, [key, replacement]) => text.replaceAll(`{{.${key}}}`, String(replacement)),
    String(value ?? ''),
  );
}

function localizedCopyright(locale) {
  return LOCALES[locale]?.regApproval?.copyright || '© Eveenty. All rights reserved.';
}

function borderedTable(bodyRows, extraStyle = '') {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid ${T.border};border-radius:8px;${extraStyle}">${bodyRows}</table>`;
}

function localizedTotals(rows, total, dir, fontFamily) {
  const align = dir === 'rtl' ? 'right' : 'left';
  const valueAlign = dir === 'rtl' ? 'left' : 'right';
  const bodyRows = rows
    .map(({ label, value }) => `<tr>
      <td align="${align}" style="padding:0 0 12px;font-family:${fontFamily};font-size:14px;font-weight:500;color:${T.heading};">${esc(label)}</td>
      <td align="${valueAlign}" dir="ltr" style="padding:0 0 12px;font-family:${fontFamily};font-size:14px;font-weight:600;color:${T.heading};">${esc(value)}</td>
    </tr>`)
    .join('');

  return `<table role="presentation" width="300" cellpadding="0" cellspacing="0" border="0" style="width:300px;max-width:100%;border-collapse:collapse;background-color:${T.primary};border-radius:8px;">
    <tr><td style="padding:20px 20px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${bodyRows}</table>
    </td></tr>
    <tr><td style="padding:15px 20px;background-color:${T.primary50};border-radius:0 0 8px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tr>
        <td align="${align}" style="font-family:${fontFamily};font-size:16px;font-weight:700;color:${T.heading};">${esc(total.label)}</td>
        <td align="${valueAlign}" dir="ltr" style="font-family:${fontFamily};font-size:16px;font-weight:700;color:${T.heading};">${esc(total.value)}</td>
      </tr></table>
    </td></tr>
  </table>`;
}

function refundItemRows(items, R, config, dir, fontFamily) {
  const rows = [];
  for (const item of items) {
    rows.push(`<tr><td colspan="2" align="${dir === 'rtl' ? 'right' : 'left'}" style="padding:12px 14px;background-color:${T.primary50};border-top:1px solid ${T.border};font-family:${fontFamily};font-size:15px;font-weight:600;line-height:1.4;color:${T.heading};">
      <span dir="ltr">#${esc(item.id)}</span> · <bdi>${esc(item.name)}</bdi>
    </td></tr>`);
    rows.push(kvRow(R.RefundItemsColType, `<bdi>${esc(R[item.typeKey])}</bdi>`, dir));
    rows.push(kvRow(R.RefundItemsColQuantity, `<span dir="ltr">${esc(item.quantity)}</span>`, dir));
    rows.push(kvRow(R.RefundItemsColCost, `<span dir="ltr">${esc(item.cost)}</span>`, dir));
    if (config.processing) {
      rows.push(kvRow(R.RefundItemsColProcessingFees, `<span dir="ltr">${esc(item.processing)}</span>`, dir));
    }
    rows.push(kvRow(R.RefundItemsColTax, `<span dir="ltr">${esc(item.tax)}</span>`, dir));
    if (config.adjustments) {
      rows.push(kvRow(R.RefundItemsColGratuityFee, `<span dir="ltr">${esc(item.gratuity)}</span>`, dir));
      rows.push(kvRow(R.RefundItemsColFacilityFee, `<span dir="ltr">${esc(item.facility)}</span>`, dir));
    }
    const total = config.adjustments
      ? item.totalAdjusted
      : config.processing
        ? item.totalStandard
        : item.totalWithoutProcessing;
    rows.push(kvRow(R.RefundItemsColTotal, `<strong dir="ltr">${esc(total)}</strong>`, dir));
  }
  return rows.join('');
}

function canceledItemRows(items, R, dir, fontFamily) {
  const rows = [];
  for (const item of items) {
    rows.push(`<tr><td colspan="2" align="${dir === 'rtl' ? 'right' : 'left'}" style="padding:12px 14px;background-color:${T.light100};border-top:1px solid ${T.border};font-family:${fontFamily};font-size:15px;font-weight:600;line-height:1.4;color:${T.heading};">
      <span dir="ltr">#${esc(item.id)}</span> · <bdi>${esc(item.name)}</bdi>
    </td></tr>`);
    rows.push(kvRow(R.RefundItemsColType, `<bdi>${esc(R[item.typeKey])}</bdi>`, dir));
    rows.push(kvRow(R.RefundItemsColQuantity, `<span dir="ltr">${esc(item.quantity)}</span>`, dir));
  }
  return rows.join('');
}

function renderRefund(emailId, locale, variant, longContent) {
  const isAdmin = emailId === 'refund_receipt_admin';
  const effectiveLocale = isAdmin ? 'en' : normalizeLocale(locale);
  const E = LOCALES[effectiveLocale] || LOCALES.en;
  const R = BATCH20_LOCALES[effectiveLocale].refundItems;
  const requestedVariant = variant || 'default';
  if (!Object.hasOwn(REFUND_VARIANT_ALIASES, requestedVariant)) {
    throw new Error(`Unknown refund variant: ${variant}`);
  }
  const normalizedVariant = REFUND_VARIANT_ALIASES[requestedVariant];
  if (!Object.hasOwn(REFUND_CONFIG, normalizedVariant)) {
    throw new Error(`Unknown refund variant: ${variant}`);
  }
  const config = REFUND_CONFIG[normalizedVariant];
  const { body, heading } = fonts(E.dir);
  const recipient = isAdmin ? REFUND_SAMPLE.admin : REFUND_SAMPLE.organizer;
  const userName = longContent
    ? `${SAMPLE.user.fullName} — International Accessibility & Community Programs`
    : SAMPLE.user.fullName;
  const festivalName = longContent
    ? `${SAMPLE.festival.name} — Waterfront Community Edition`
    : SAMPLE.festival.name;
  const headline = interpolate(R.RefundItemsHeadlinePurchasesRefunded, {
    UserName: userName,
    FestivalName: festivalName,
  });
  const refundItems = [
    ...REFUND_SAMPLE.items,
    ...(longContent
      ? [{
        id: 'RF-18404',
        name: 'VIP <Preview> Experience & Community Dinner',
        typeKey: 'RefundItemsItemTypeService',
        quantity: '1',
        cost: 'CA$0.00',
        processing: 'CA$0.00',
        tax: 'CA$0.00',
        gratuity: 'CA$0.00',
        facility: 'CA$0.00',
        totalWithoutProcessing: 'CA$0.00',
        totalStandard: 'CA$0.00',
        totalAdjusted: 'CA$0.00',
      }]
      : []),
  ];
  const canceledItems = [
    ...REFUND_SAMPLE.canceled,
    ...(longContent
      ? [{ id: 'CN-20819', name: 'Youth Arts Lab — Saturday Session', typeKey: 'RefundItemsItemTypeKidsActivity', quantity: '2' }]
      : []),
  ];
  const paymentMethod = config.external
    ? R.RefundItemsPaymentMethodETransfer
    : R.RefundItemsPaymentMethodCreditCard;
  const successMessage = config.external
    ? R.RefundItemsStaffRefundSuccessExternal
    : R.RefundItemsStaffRefundSuccessCard;
  const recipientEmail = recipient.email;
  const totalsRows = [{
    label: R.RefundItemsSummaryAmount,
    value: config.adjustments ? 'CA$99.40' : 'CA$90.40',
  }];
  if (config.processing) {
    totalsRows.push({ label: R.RefundItemsSummaryProcessingFees, value: 'CA$2.50' });
  }
  if (config.adjustments) {
    if (config.bankMode === 'deducted') {
      totalsRows.push({ label: R.RefundItemsSummaryBankFees, value: '− CA$3.10' });
    } else if (config.bankMode === 'refunded') {
      totalsRows.push({ label: R.RefundItemsSummaryBankFees, value: 'CA$3.10' });
    }
  }
  const totalValue = config.adjustments
    ? config.bankMode === 'deducted' ? 'CA$96.30' : 'CA$102.50'
    : config.processing ? 'CA$92.90' : 'CA$90.40';

  const rows = `
    ${brandedHeader({ locale: E.logo, dir: E.dir, logoWidth: 160 })}
    <tr><td align="center" class="stack-pad" style="padding:28px 30px 10px;background-color:${T.surface};font-family:${body};">
      <p style="margin:0 0 8px;font-size:15px;line-height:1.5;font-weight:600;color:${T.secondary};"><bdi>${esc(festivalName)}</bdi></p>
      <h1 style="margin:0;font-family:${heading};font-size:22px;line-height:1.4;font-weight:600;color:${T.heading};">${esc(headline)}</h1>
    </td></tr>
    <tr><td class="stack-pad" style="padding:12px 30px 22px;background-color:${T.surface};">
      ${borderedTable(`
        ${kvRow(R.RefundItemsClientNameLabel, `<bdi>${esc(userName)}</bdi>`, E.dir)}
        ${kvRow(R.RefundItemsClientAddressLabel, `<bdi>${esc(SAMPLE.user.address)}</bdi>`, E.dir)}
        ${kvRow(R.RefundItemsClientPhoneLabel, `<span dir="ltr">${esc(SAMPLE.user.phone)}</span>`, E.dir)}
        ${kvRow(R.RefundItemsClientEmailLabel, `<a href="mailto:${esc(SAMPLE.user.email)}" dir="ltr" style="color:${T.secondary};text-decoration:none;unicode-bidi:embed;">${esc(SAMPLE.user.email)}</a>`, E.dir)}
        ${kvRow(R.RefundItemsDateLabel, `<span dir="ltr">${esc(SAMPLE.money.date)} · ${esc(SAMPLE.money.time)}</span>`, E.dir)}
        ${config.refund ? kvRow(R.RefundItemsPaymentMethodLabel, `<bdi>${esc(paymentMethod)}</bdi>`, E.dir) : ''}
      `)}
    </td></tr>
    ${config.refund ? `<tr><td class="stack-pad" style="padding:0 30px 18px;background-color:${T.surface};">
      ${statusAlert({
        variant: 'success',
        title: R.RefundItemsHeadingRefundedItems,
        bodyHtml: esc(successMessage),
        dir: E.dir,
        titleFontFamily: heading,
        bodyFontFamily: body,
      })}
    </td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
      ${sectionTitle({ title: R.RefundItemsHeadingRefundedItems, dir: E.dir, fontFamily: heading, fontWeight: 600 })}
      ${borderedTable(refundItemRows(refundItems, R, config, E.dir, body))}
    </td></tr>
    <tr><td align="${E.dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
      ${localizedTotals(totalsRows, { label: R.RefundItemsSummaryTotalRefunded, value: totalValue }, E.dir, body)}
    </td></tr>` : ''}
    ${config.canceled ? `<tr><td class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
      ${sectionTitle({ title: R.RefundItemsHeadingCanceledItems, dir: E.dir, fontFamily: heading, fontWeight: 600 })}
      <p style="margin:0 0 12px;font-family:${body};font-size:14px;line-height:1.6;color:${T.body};">${esc(R.RefundItemsCanceledIntro)}</p>
      ${borderedTable(canceledItemRows(canceledItems, R, E.dir, body))}
    </td></tr>` : ''}
    ${config.proof ? `<tr><td align="center" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};font-size:0;line-height:0;">
      <img src="${esc(fixtureUrl('festival-image-sample.png'))}" alt="Sample refund proof image" width="400" height="210" style="display:block;width:400px;max-width:100%;height:auto;margin:0 auto;border:1px solid ${T.border};border-radius:8px;" />
    </td></tr>` : ''}
    ${brandedFooter({
      email: recipientEmail,
      copyright: localizedCopyright(effectiveLocale),
      dir: E.dir,
      fontFamily: body,
    })}`;

  return wrapEmailDocument({
    lang: E.lang,
    dir: E.dir,
    title: R.RefundItemsHtmlDocumentTitle,
    preheader: headline,
    bodyRows: rows,
    fontFamily: body,
  });
}

function registrationVariant(variant) {
  const normalized = variant === 'default' ? 'user' : variant;
  if (!REGISTRATION_VARIANTS.includes(normalized)) {
    throw new Error(`Unknown ticket-registration variant: ${variant}`);
  }
  return normalized;
}

function registrationKind(emailId) {
  if (emailId === 'festival_ticket_registration') return 'new';
  if (emailId === 'festival_ticket_registration_deadline_exceeded') return 'reviewDeadline';
  return 'paymentDeadline';
}

function registrationTickets(longContent) {
  const first = {
    type: SAMPLE.ticket.type,
    holder: SAMPLE.user.fullName,
    email: SAMPLE.user.email,
    phone: longContent ? SAMPLE.user.phone : '',
    answers: longContent
      ? [
        ['Dietary requirements', 'Vegetarian — no shellfish'],
        ['Accessibility notes', 'Quiet entrance requested; contact before arrival <sample>.'],
      ]
      : [],
  };
  if (!longContent) return [first];
  return [
    first,
    {
      type: 'Weekend Community Pass — Extended Access',
      holder: SAMPLE.guest.fullName,
      email: SAMPLE.guest.email,
      phone: '',
      answers: [['Workshop choice', 'Community stage production & lighting lab']],
    },
  ];
}

function ticketCards(tickets, R, dir, fontFamily) {
  return tickets.map((ticket, index) => {
    const counter = interpolate(R.FestivalTicketRegistrationTicketCounter, {
      Current: String(index + 1),
      Total: String(tickets.length),
    });
    const answers = ticket.answers.length
      ? `<tr><td colspan="2" style="padding:14px 16px;background-color:${T.light100};border-top:1px solid ${T.border};">
          <p style="margin:0 0 8px;font-family:${fontFamily};font-size:14px;font-weight:600;line-height:1.4;color:${T.heading};">${esc(R.FestivalTicketRegistrationLabelAnswers)}</p>
          ${ticket.answers.map(([question, answer]) => `<p dir="auto" style="margin:0 0 6px;font-family:${fontFamily};font-size:14px;line-height:1.5;color:${T.body};unicode-bidi:plaintext;text-align:start;"><strong><bdi>${esc(question)}</bdi>:</strong> <bdi>${esc(answer)}</bdi></p>`).join('')}
        </td></tr>`
      : '';
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid ${T.border};border-radius:8px;margin:0 0 12px;">
      <tr><td colspan="2" align="${dir === 'rtl' ? 'right' : 'left'}" style="padding:13px 16px;background-color:${T.primary50};border-bottom:2px solid ${T.secondary};font-family:${fontFamily};font-size:15px;font-weight:700;line-height:1.4;color:${T.secondary};">${esc(counter)}</td></tr>
      ${kvRow(R.FestivalTicketRegistrationLabelTicketType, `<bdi>${esc(ticket.type)}</bdi>`, dir)}
      ${kvRow(R.FestivalTicketRegistrationLabelTicketHolder, `<bdi>${esc(ticket.holder)}</bdi>`, dir)}
      ${ticket.email ? kvRow(R.FestivalTicketRegistrationLabelEmail, `<a href="mailto:${esc(ticket.email)}" dir="ltr" style="color:${T.secondary};text-decoration:none;unicode-bidi:embed;">${esc(ticket.email)}</a>`, dir) : ''}
      ${ticket.phone ? kvRow(R.FestivalTicketRegistrationLabelPhone, `<span dir="ltr">${esc(ticket.phone)}</span>`, dir) : ''}
      ${answers}
    </table>`;
  }).join('');
}

function registrationFooter(R, E, dir, fontFamily) {
  const align = dir === 'rtl' ? 'right' : 'left';
  return `<tr><td align="${align}" class="stack-pad" style="padding:22px 30px;background-color:${T.surface};border-top:1px solid ${T.border};font-family:${fontFamily};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
      <tr><td align="center" style="padding:0 0 8px;font-family:${fontFamily};font-size:13px;line-height:1.6;color:${T.body};">${esc(R.FestivalTicketRegistrationAutomatedNotice)}</td></tr>
      <tr><td align="center" style="padding:0 0 8px;font-family:${fontFamily};font-size:13px;line-height:1.6;color:${T.body};">${esc(R.FestivalTicketRegistrationContactUs)} <a href="mailto:info@eveenty.com" dir="ltr" style="color:${T.secondary};text-decoration:underline;unicode-bidi:embed;">info@eveenty.com</a></td></tr>
      <tr><td align="center" dir="${dir}" style="padding:0;font-family:${fontFamily};font-size:12px;line-height:1.6;color:${T.footerMuted};">${esc(E.regApproval?.copyright || '© Eveenty. All rights reserved.')}</td></tr>
    </table>
  </td></tr>`;
}

function renderRegistration(emailId, locale, variant, longContent) {
  const persona = registrationVariant(variant);
  const effectiveLocale = persona === 'admin' ? 'en' : normalizeLocale(locale);
  const E = LOCALES[effectiveLocale] || LOCALES.en;
  const source = BATCH20_LOCALES[effectiveLocale];
  const R = source.registration;
  const S = source.registrationStatus;
  const kind = registrationKind(emailId);
  const copy = REGISTRATION_COPY[kind];
  const { body, heading } = fonts(E.dir);
  const name = persona === 'organizer'
    ? longContent ? 'Morgan Organizer — Community Programming Team' : REFUND_SAMPLE.organizer.name
    : longContent ? `${SAMPLE.user.displayName} & Family` : SAMPLE.user.displayName;
  const festivalName = longContent
    ? `${SAMPLE.festival.name} — International Waterfront Community Edition`
    : SAMPLE.festival.name;
  const subject = interpolate(R[copy.subject[persona]], { FestivalName: festivalName });
  const greeting = interpolate(R[copy.greeting[persona]], {
    Name: name,
    FestivalName: festivalName,
  });
  const statusKey = kind === 'paymentDeadline' && persona === 'user' ? copy.userStatus : copy.status;
  const currentStatus = S[statusKey];
  const tickets = registrationTickets(longContent);
  const showReviewDeadline = persona !== 'user';
  const showPaymentDeadline = kind === 'paymentDeadline' || (kind === 'new' && longContent);
  const summaryRows = `
    ${kvRow(R.FestivalTicketRegistrationLabelEvent, `<bdi>${esc(festivalName)}</bdi>`, E.dir)}
    ${kvRow(R.FestivalTicketRegistrationLabelRegistrationID, `<span dir="ltr">${esc(SAMPLE.registration.id)}</span>`, E.dir)}
    ${kvRow(R.FestivalTicketRegistrationLabelRegistrationDate, `<span dir="auto">${esc(SAMPLE.registration.dateTime)}</span>`, E.dir)}
    ${kvRow(R.FestivalTicketRegistrationLabelCurrentStatus, `<strong><bdi>${esc(currentStatus)}</bdi></strong>`, E.dir)}
    ${showReviewDeadline ? kvRow(R.FestivalTicketRegistrationLabelReviewDeadline, '<span dir="auto">Sep 24, 2026 · 5:00 PM</span>', E.dir) : ''}
    ${showPaymentDeadline ? kvRow(R.FestivalTicketRegistrationLabelPaymentDeadline, `<span dir="auto">${esc(SAMPLE.registration.paymentDeadline)}</span>`, E.dir) : ''}`;

  let alertRow = '';
  let greetingRow = `<tr><td align="${E.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:20px 30px 8px;background-color:${T.surface};font-family:${body};">
    <p style="margin:0;font-size:16px;line-height:1.65;color:${T.body};">${esc(greeting)}</p>
    <p style="margin:10px 0 0;font-size:14px;line-height:1.55;color:${T.body};">${esc(R.FestivalTicketRegistrationSummarySubtitle)}</p>
  </td></tr>`;

  if (kind !== 'new') {
    let alertBody = R[copy.alertBody];
    if (kind === 'reviewDeadline' && persona !== 'user') {
      alertBody = `${alertBody} ${R[persona === 'admin' ? 'FestivalTicketRegistrationAlertAdminAction' : 'FestivalTicketRegistrationAlertOrganizerAction']}`;
    }
    if (kind === 'paymentDeadline') {
      alertBody = persona === 'user'
        ? `${alertBody} ${greeting}`
        : `${alertBody} ${R[persona === 'admin' ? 'FestivalTicketRegistrationAlertAdminAction' : 'FestivalTicketRegistrationAlertOrganizerAction']}`;
      if (persona === 'user') {
        greetingRow = `<tr><td align="${E.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:8px 30px;background-color:${T.surface};font-family:${body};font-size:14px;line-height:1.55;color:${T.body};">${esc(R.FestivalTicketRegistrationSummarySubtitle)}</td></tr>`;
      }
    }
    alertRow = `<tr><td class="stack-pad" style="padding:22px 30px 4px;background-color:${T.surface};">
      ${statusAlert({
        variant: kind === 'reviewDeadline' && persona === 'user' ? 'error' : 'warning',
        title: currentStatus,
        bodyHtml: esc(alertBody),
        dir: E.dir,
        titleFontFamily: heading,
        bodyFontFamily: body,
      })}
    </td></tr>`;
  }

  const eventRows = `
    ${kvRow(R.FestivalTicketRegistrationLabelEventStart, `<span dir="auto">${esc(SAMPLE.festival.start)}</span>`, E.dir)}
    ${longContent ? kvRow(R.FestivalTicketRegistrationLabelDoorsOpenAt, `<span dir="auto">${esc(SAMPLE.festival.doorsOpen)}</span>`, E.dir) : ''}
    ${longContent ? kvRow(R.FestivalTicketRegistrationLabelEventEnd, `<span dir="auto">${esc(SAMPLE.festival.end)}</span>`, E.dir) : ''}
    ${kvRow(R.FestivalTicketRegistrationLabelVenue, `<bdi>${esc(SAMPLE.festival.place)}</bdi>`, E.dir)}
    ${kvRow(R.FestivalTicketRegistrationLabelLocation, `<bdi>${esc(SAMPLE.festival.address)}</bdi>`, E.dir)}
    ${kvRow(R.FestivalTicketRegistrationLabelViewMap, `<a href="${esc(SAMPLE.festival.mapUrl)}" target="_blank" dir="auto" style="color:${T.secondary};text-decoration:underline;unicode-bidi:isolate;">${esc(R.FestivalTicketRegistrationLabelViewMap)}</a>`, E.dir)}`;

  const rows = `
    ${brandedHeader({ locale: E.logo, dir: E.dir, logoWidth: 160 })}
    ${alertRow}
    ${greetingRow}
    <tr><td class="stack-pad" style="padding:14px 30px 20px;background-color:${T.surface};">
      ${sectionTitle({ title: R.FestivalTicketRegistrationSummaryTitle, dir: E.dir, fontFamily: heading, fontWeight: 600 })}
      ${borderedTable(summaryRows)}
    </td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
      ${sectionTitle({ title: R.FestivalTicketRegistrationBuyerInfoTitle, dir: E.dir, fontFamily: heading, fontWeight: 600 })}
      ${borderedTable(`
        ${kvRow(R.FestivalTicketRegistrationLabelName, `<bdi>${esc(longContent ? `${SAMPLE.user.fullName} — Community Programs` : SAMPLE.user.fullName)}</bdi>`, E.dir)}
        ${kvRow(R.FestivalTicketRegistrationLabelEmail, `<a href="mailto:${esc(SAMPLE.user.email)}" dir="ltr" style="color:${T.secondary};text-decoration:none;unicode-bidi:embed;">${esc(SAMPLE.user.email)}</a>`, E.dir)}
        ${longContent ? kvRow(R.FestivalTicketRegistrationLabelPhone, `<span dir="ltr">${esc(SAMPLE.user.phone)}</span>`, E.dir) : ''}
      `)}
    </td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
      ${sectionTitle({ title: `${R.FestivalTicketRegistrationTicketsTitle} (${tickets.length})`, dir: E.dir, fontFamily: heading, fontWeight: 600 })}
      <p style="margin:0 0 12px;font-family:${body};font-size:14px;line-height:1.55;color:${T.body};">${esc(R.FestivalTicketRegistrationTicketsSubtitle)}</p>
      ${ticketCards(tickets, R, E.dir, body)}
    </td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
      ${sectionTitle({ title: R.FestivalTicketRegistrationEventDetailsTitle, dir: E.dir, fontFamily: heading, fontWeight: 600 })}
      <p style="margin:0 0 12px;font-family:${body};font-size:14px;line-height:1.55;color:${T.body};">${esc(R.FestivalTicketRegistrationEventDetailsSubtitle)}</p>
      ${borderedTable(eventRows)}
      ${longContent ? `<p style="margin:10px 0 0;font-family:${body};font-size:13px;line-height:1.5;color:${T.body};text-align:center;"><bdi>${esc(interpolate(R.FestivalTicketRegistrationTimezoneNote, { Timezone: 'America/Toronto' }))}</bdi></p>` : ''}
    </td></tr>
    ${registrationFooter(R, E, E.dir, body)}`;

  return wrapEmailDocument({
    lang: E.lang,
    dir: E.dir,
    title: subject,
    preheader: subject,
    bodyRows: rows,
    fontFamily: body,
  });
}

function renderApprovalStatus(locale, variant, longContent) {
  const effectiveLocale = normalizeLocale(locale);
  const E = LOCALES[effectiveLocale] || LOCALES.en;
  const A = BATCH20_LOCALES[effectiveLocale].registrationApproval;
  const requestedVariant = variant || 'default';
  if (!Object.hasOwn(APPROVAL_VARIANT_ALIASES, requestedVariant)) {
    throw new Error(`Unknown registration-approval variant: ${variant}`);
  }
  const normalizedVariant = APPROVAL_VARIANT_ALIASES[requestedVariant];
  if (!Object.hasOwn(APPROVAL_CONFIG, normalizedVariant)) {
    throw new Error(`Unknown registration-approval variant: ${variant}`);
  }
  const config = APPROVAL_CONFIG[normalizedVariant];
  const { body, heading } = fonts(E.dir);
  const personaKey = `RegistrationApprovalPersona${config.persona[0].toUpperCase()}${config.persona.slice(1)}`;
  const persona = A[personaKey];
  const userName = longContent
    ? `${SAMPLE.user.fullName} — International Community Programs`
    : SAMPLE.user.fullName;
  const festivalName = longContent
    ? `${SAMPLE.festival.name} — Waterfront International Edition`
    : SAMPLE.festival.name;
  const approved = config.status === 'approved';
  const subject = interpolate(
    A[approved ? 'RegistrationApprovalSubjectApproved' : 'RegistrationApprovalSubjectRejected'],
    { Persona: persona },
  );
  const greetingHtml = interpolate(A.RegistrationApprovalGreetingHTML, {
    UserName: esc(userName),
  });
  const bodyHtml = interpolate(
    A[approved ? 'RegistrationApprovalBodyApproved' : 'RegistrationApprovalBodyRejected'],
    {
      UserName: esc(userName),
      Persona: esc(persona),
      FestivalName: esc(festivalName),
    },
  );
  const reviewNote = longContent
    ? `Programming fit: strong. Please confirm arrival access, dietary needs & stage timing.\nSynthetic preview marker: <sample — not executable>.`
    : 'Please confirm your availability and arrival time with the event team.';

  const rows = `
    ${brandedHeader({ locale: E.logo, dir: E.dir, logoWidth: 160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 10px;background-color:${T.surface};">
      ${statusAlert({
        variant: approved ? 'success' : 'error',
        title: subject,
        bodyHtml: '',
        dir: E.dir,
        titleFontFamily: heading,
        bodyFontFamily: body,
      })}
    </td></tr>
    <tr><td align="${E.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:12px 30px 22px;background-color:${T.surface};font-family:${body};">
      <p style="margin:0 0 14px;font-size:18px;font-weight:600;line-height:1.5;color:${T.heading};">${greetingHtml}</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:${T.body};">${bodyHtml}</p>
    </td></tr>
    ${config.note ? `<tr><td class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">
      ${sectionTitle({ title: A.RegistrationApprovalReviewNotesHeading, dir: E.dir, fontFamily: heading, fontWeight: 600 })}
      <p style="margin:0 0 10px;font-family:${body};font-size:14px;line-height:1.55;color:${T.body};">${esc(A.RegistrationApprovalReviewNotesIntro)}</p>
      ${borderedTable(`<tr><td dir="auto" style="padding:16px;font-family:${body};font-size:14px;line-height:1.6;color:${T.body};white-space:pre-wrap;word-break:break-word;unicode-bidi:plaintext;text-align:start;">${esc(reviewNote)}</td></tr>`, `background-color:${T.primary50};`)}
    </td></tr>` : ''}
    ${brandedFooter({
      email: SAMPLE.user.email,
      copyright: localizedCopyright(effectiveLocale),
      dir: E.dir,
      fontFamily: body,
    })}`;

  return wrapEmailDocument({
    lang: E.lang,
    dir: E.dir,
    title: A.RegistrationApprovalHtmlDocumentTitle,
    preheader: `${festivalName} | ${subject}`,
    bodyRows: rows,
    fontFamily: body,
  });
}

/**
 * Render one owner-authorized B3/B5 email preview.
 * Admin variants deliberately force the production EN/LTR behavior.
 */
export function renderBatch20RefundRegistrationEmail(
  emailId,
  { locale = 'en', variant = 'default', longContent = false } = {},
) {
  switch (emailId) {
    case 'refund_receipt_organizer':
    case 'refund_receipt_admin':
      return renderRefund(emailId, locale, variant, longContent);
    case 'festival_ticket_registration':
    case 'festival_ticket_registration_deadline_exceeded':
    case 'festival_ticket_registration_payment_deadline_exceeded':
      return renderRegistration(emailId, locale, variant, longContent);
    case 'registration_approval_status_changed':
      return renderApprovalStatus(locale, variant, longContent);
    default:
      throw new Error(`Unknown B3/B5 email id: ${emailId}`);
  }
}
