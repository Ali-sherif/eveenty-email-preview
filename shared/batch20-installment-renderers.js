import { BATCH20_LOCALES } from './batch20-locales.generated.js';
import {
  brandedFooter,
  brandedHeader,
  esc,
  kvRow,
  sectionTitle,
  statusAlert,
  wrapEmailDocument,
} from './email-kit.js';
import { LOCALES, SAMPLE } from './sample-data.js';
import { TOKENS as T } from './tokens.js';

const FIVE_LOCALES = Object.freeze(['en', 'fr', 'es', 'ar', 'fa']);
/** Inert preview stand-in for the production user-profile destination. */
const PROFILE_URL = 'https://example.com/preview/user-profile';

const BOOTH_PAID_VARIANTS = Object.freeze({
  vendor: Object.freeze({ audience: 'vendor', discount: false, cardFees: false }),
  vendorDiscountCardFees: Object.freeze({ audience: 'vendor', discount: true, cardFees: true }),
  admin: Object.freeze({ audience: 'admin', discount: false, cardFees: false }),
  adminDiscountCardFees: Object.freeze({ audience: 'admin', discount: true, cardFees: true }),
  organizer: Object.freeze({ audience: 'organizer', discount: false, cardFees: false }),
  organizerDiscountCardFees: Object.freeze({ audience: 'organizer', discount: true, cardFees: true }),
});

const SPONSOR_PAID_VARIANTS = Object.freeze({
  sponsor: Object.freeze({ audience: 'sponsor', discount: false, cardFees: false }),
  sponsorDiscountCardFees: Object.freeze({ audience: 'sponsor', discount: true, cardFees: true }),
  admin: Object.freeze({ audience: 'admin', discount: false, cardFees: false }),
  adminDiscountCardFees: Object.freeze({ audience: 'admin', discount: true, cardFees: true }),
  organizer: Object.freeze({ audience: 'organizer', discount: false, cardFees: false }),
  organizerDiscountCardFees: Object.freeze({ audience: 'organizer', discount: true, cardFees: true }),
});

const BOOTH_AUDIENCE_VARIANTS = Object.freeze({
  vendor: Object.freeze({ audience: 'vendor' }),
  admin: Object.freeze({ audience: 'admin' }),
  organizer: Object.freeze({ audience: 'organizer' }),
});

const SPONSOR_AUDIENCE_VARIANTS = Object.freeze({
  sponsor: Object.freeze({ audience: 'sponsor' }),
  admin: Object.freeze({ audience: 'admin' }),
  organizer: Object.freeze({ audience: 'organizer' }),
});
const EN_ONLY = Object.freeze(['en']);
const variantLocales = (variants) => Object.freeze(Object.fromEntries(
  Object.entries(variants).map(([name, config]) => [
    name,
    config.audience === 'admin' ? EN_ONLY : FIVE_LOCALES,
  ]),
));

/** Explicit integration metadata for the owner-authorized B2 installment slice. */
export const BATCH20_INSTALLMENT_EMAILS = Object.freeze({
  festival_sale_installment_paid: Object.freeze({
    id: 'festival_sale_installment_paid',
    locales: FIVE_LOCALES,
    variants: Object.freeze(Object.keys(BOOTH_PAID_VARIANTS)),
    variantLocales: variantLocales(BOOTH_PAID_VARIANTS),
  }),
  second_payment_reminder: Object.freeze({
    id: 'second_payment_reminder',
    locales: FIVE_LOCALES,
    variants: Object.freeze(Object.keys(BOOTH_AUDIENCE_VARIANTS)),
    variantLocales: variantLocales(BOOTH_AUDIENCE_VARIANTS),
  }),
  first_payment_refund: Object.freeze({
    id: 'first_payment_refund',
    locales: FIVE_LOCALES,
    variants: Object.freeze(Object.keys(BOOTH_AUDIENCE_VARIANTS)),
    variantLocales: variantLocales(BOOTH_AUDIENCE_VARIANTS),
  }),
  sponsor_installment_paid: Object.freeze({
    id: 'sponsor_installment_paid',
    locales: FIVE_LOCALES,
    variants: Object.freeze(Object.keys(SPONSOR_PAID_VARIANTS)),
    variantLocales: variantLocales(SPONSOR_PAID_VARIANTS),
  }),
  sponsor_installment_second_payment_reminder: Object.freeze({
    id: 'sponsor_installment_second_payment_reminder',
    locales: FIVE_LOCALES,
    variants: Object.freeze(Object.keys(SPONSOR_AUDIENCE_VARIANTS)),
    variantLocales: variantLocales(SPONSOR_AUDIENCE_VARIANTS),
  }),
  sponsor_first_payment_refund: Object.freeze({
    id: 'sponsor_first_payment_refund',
    locales: FIVE_LOCALES,
    variants: Object.freeze(Object.keys(SPONSOR_AUDIENCE_VARIANTS)),
    variantLocales: variantLocales(SPONSOR_AUDIENCE_VARIANTS),
  }),
});

const PREVIEW = Object.freeze({
  boothName: 'Corner Booth B-12',
  businessName: 'North Shore Events & Exhibits',
  sponsorPackage: 'Presenting Sponsor Package',
  vendorPhone: SAMPLE.user.phone,
  organizerName: 'Taylor Organizer',
  organizerEmail: 'taylor.organizer@example.com',
  adminName: 'Eveenty Admin',
  adminEmail: 'admin.preview@example.com',
  reminderNumber: '2',
  dueDate: '2026-10-01',
  refundDate: '2026-10-08',
  paidPercentage: '50.00',
  amountPaid: 'CA$800.00',
  itemCost: 'CA$800.00',
  itemCostBeforeDiscount: 'CA$880.00',
  discount: 'CA$80.00',
  processingFees: 'CA$25.00',
  taxWithProcessing: 'CA$107.25',
  taxWithoutProcessing: 'CA$104.00',
  cardFees: 'CA$18.00',
  totalWithProcessing: 'CA$932.25',
  totalWithProcessingAndCardFees: 'CA$950.25',
  totalWithoutProcessing: 'CA$904.00',
  totalWithoutProcessingAndCardFees: 'CA$922.00',
  firstPayment: 'CA$500.00',
  penalty: 'CA$50.00',
  refundedCost: 'CA$400.00',
  refundedTax: 'CA$50.00',
  refundedBankFees: 'CA$12.00',
  totalRefunded: 'CA$438.00',
  boothRefundId: 'BOOTH-18402',
  sponsorRefundId: 'SPONSOR-18402',
});

function fonts(dir) {
  return {
    body: dir === 'rtl' ? T.fontBodyRtl : T.fontBody,
    heading: dir === 'rtl' ? T.fontBodyRtl : T.fontHeading,
  };
}

function resolveVariant(emailId, requested, variants, defaultVariant) {
  const normalized = !requested || requested === 'default' ? defaultVariant : requested;
  const definition = variants[normalized];
  if (!definition) {
    throw new Error(`Unknown ${emailId} variant: ${requested}`);
  }
  return { name: normalized, ...definition };
}

function localeContext(requestedLocale, audience) {
  const normalized = String(requestedLocale || 'en').toLowerCase();
  const effectiveLocale = audience === 'admin' ? 'en' : FIVE_LOCALES.includes(normalized) ? normalized : 'en';
  const display = LOCALES[effectiveLocale] || LOCALES.en;
  return {
    locale: effectiveLocale,
    lang: display.lang,
    dir: display.dir,
    logo: display.logo,
    ...fonts(display.dir),
  };
}

/**
 * Locale strings are trusted, repository-generated HTML. Every synthetic value is
 * escaped before replacing its Go-template placeholder; no caller HTML is accepted.
 */
function localizedRichHtml(source, substitutions) {
  const ltrKeys = new Set([
    'PaidPercentage',
    'AmountPaid',
    'ReminderNumber',
    'DueDate',
    'RefundDate',
    'Penalty',
    'FirstBoothPaymentAmount',
    'FirstPayment',
  ]);
  let html = String(source || '');
  for (const [key, value] of Object.entries(substitutions)) {
    const escaped = esc(value);
    const replacement = key === 'ProfileURL'
      ? escaped
      : `<span dir="${ltrKeys.has(key) ? 'ltr' : 'auto'}" style="unicode-bidi:isolate;">${escaped}</span>`;
    html = html.replaceAll(`{{.${key}}}`, replacement);
  }
  const unresolved = html.match(/{{\.[A-Za-z0-9_]+}}/g);
  if (unresolved) {
    throw new Error(`Missing localized rich-copy substitutions: ${[...new Set(unresolved)].join(', ')}`);
  }
  return html;
}

function expanded(base, label, longContent) {
  return longContent ? `${base} — ${`${label} `.repeat(5).trim()}` : base;
}

function previewPeople(longContent) {
  return {
    vendorName: expanded(SAMPLE.user.fullName, 'Extended Vendor Preview Name', longContent),
    sponsorName: expanded(SAMPLE.user.fullName, 'Extended Sponsor Preview Name', longContent),
    organizerName: expanded(PREVIEW.organizerName, 'Extended Organizer Preview Name', longContent),
    adminName: PREVIEW.adminName,
    businessName: expanded(PREVIEW.businessName, 'Extended Business Name', longContent),
    boothName: expanded(PREVIEW.boothName, 'Extended Booth Description', longContent),
    sponsorPackage: expanded(PREVIEW.sponsorPackage, 'Extended Package Description', longContent),
    festivalName: expanded(SAMPLE.festival.name, 'Extended Festival Name', longContent),
  };
}

function recipient(audience, people) {
  switch (audience) {
    case 'admin':
      return { name: people.adminName, email: PREVIEW.adminEmail };
    case 'organizer':
      return { name: people.organizerName, email: PREVIEW.organizerEmail };
    case 'sponsor':
      return { name: people.sponsorName, email: SAMPLE.user.email };
    default:
      return { name: people.vendorName, email: SAMPLE.user.email };
  }
}

function isolated(value, { ltr = false } = {}) {
  return `<span dir="${ltr ? 'ltr' : 'auto'}" style="unicode-bidi:isolate;">${esc(value)}</span>`;
}

function fieldTable(rows, dir) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:100%;border:1px solid ${T.border};border-collapse:collapse;border-radius:8px;">${rows
    .map(({ label, value, ltr = false }) => kvRow(label, isolated(value, { ltr }), dir))
    .join('')}</table>`;
}

function totalsTable(rows, dir, bodyFont) {
  const align = dir === 'rtl' ? 'right' : 'left';
  const valueAlign = dir === 'rtl' ? 'left' : 'right';
  return `<table role="presentation" width="280" cellpadding="0" cellspacing="0" border="0" style="width:280px;max-width:100%;border-collapse:collapse;background-color:${T.primary50};border:1px solid ${T.border};border-radius:8px;">
    <tr><td style="padding:18px 18px 6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
        ${rows.map((row, index) => {
          const isTotal = index === rows.length - 1;
          return `<tr>
            <td align="${align}" style="padding:0 0 12px;font-family:${bodyFont};font-size:${isTotal ? 16 : 14}px;font-weight:${isTotal ? 700 : 500};line-height:1.4;color:${T.heading};">${esc(row.label)}</td>
            <td align="${valueAlign}" dir="ltr" style="padding:0 0 12px;font-family:${bodyFont};font-size:${isTotal ? 16 : 14}px;font-weight:${isTotal ? 700 : 500};line-height:1.4;color:${T.heading};">${esc(row.value)}</td>
          </tr>`;
        }).join('')}
      </table>
    </td></tr>
  </table>`;
}

function footer({ email, dir, body }) {
  return brandedFooter({
    email,
    copyright: '© Eveenty. All rights reserved.',
    dir,
    fontFamily: body,
  });
}

function paidInvoiceRows({ loc, prefix, itemName, itemType, quantity, discount, cardFees, processingFees }) {
  const cost = discount ? PREVIEW.itemCostBeforeDiscount : PREVIEW.itemCost;
  const tax = processingFees ? PREVIEW.taxWithProcessing : PREVIEW.taxWithoutProcessing;
  const total = processingFees
    ? cardFees
      ? PREVIEW.totalWithProcessingAndCardFees
      : PREVIEW.totalWithProcessing
    : cardFees
      ? PREVIEW.totalWithoutProcessingAndCardFees
      : PREVIEW.totalWithoutProcessing;
  const rows = [
    { label: loc[`${prefix}TableNo`], value: '1', ltr: true },
    { label: loc[`${prefix}TableName`], value: itemName },
    { label: loc[`${prefix}TableType`], value: itemType },
    { label: loc[`${prefix}TableQuantity`], value: quantity, ltr: true },
    { label: loc[`${prefix}TableCost`], value: cost, ltr: true },
  ];
  if (discount) {
    rows.push(
      { label: loc[`${prefix}TableDiscount`], value: `- ${PREVIEW.discount}`, ltr: true },
      { label: loc[`${prefix}TableCostAfterDiscount`], value: PREVIEW.itemCost, ltr: true },
    );
  }
  if (processingFees) {
    rows.push({ label: loc[`${prefix}TableProcessingFees`], value: PREVIEW.processingFees, ltr: true });
  }
  rows.push({ label: loc[`${prefix}TableTax`], value: tax, ltr: true });
  if (cardFees) {
    rows.push({ label: loc[`${prefix}TableCreditCardFees`], value: PREVIEW.cardFees, ltr: true });
  }
  rows.push({ label: loc[`${prefix}TableTotal`], value: total, ltr: true });
  return rows;
}

function paidTotalsRows({ loc, prefix, processingFees, cardFees }) {
  const rows = [{ label: loc[`${prefix}Subtotal`], value: PREVIEW.itemCost }];
  if (processingFees) {
    rows.push({ label: loc[`${prefix}ProcessingFees`], value: PREVIEW.processingFees });
  }
  rows.push({
    label: loc[`${prefix}Tax`],
    value: processingFees ? PREVIEW.taxWithProcessing : PREVIEW.taxWithoutProcessing,
  });
  if (cardFees) {
    rows.push({ label: loc[`${prefix}CreditCardFees`], value: PREVIEW.cardFees });
  }
  rows.push({
    label: loc[`${prefix}GrandTotal`],
    value: processingFees
      ? cardFees
        ? PREVIEW.totalWithProcessingAndCardFees
        : PREVIEW.totalWithProcessing
      : cardFees
        ? PREVIEW.totalWithoutProcessingAndCardFees
        : PREVIEW.totalWithoutProcessing,
  });
  return rows;
}

function renderPaidInstallment({ sponsor, requestedLocale, requestedVariant, longContent }) {
  const emailId = sponsor ? 'sponsor_installment_paid' : 'festival_sale_installment_paid';
  const definition = resolveVariant(
    emailId,
    requestedVariant,
    sponsor ? SPONSOR_PAID_VARIANTS : BOOTH_PAID_VARIANTS,
    sponsor ? 'sponsor' : 'vendor',
  );
  const L = localeContext(requestedLocale, definition.audience);
  const loc = BATCH20_LOCALES[L.locale][sponsor ? 'sponsorInstallments' : 'boothInstallments'];
  const people = previewPeople(longContent);
  const to = recipient(definition.audience, people);
  const isPayer = definition.audience === (sponsor ? 'sponsor' : 'vendor');
  const processingFees = definition.audience !== 'organizer';
  const prefix = sponsor ? 'SponsorInstallmentPaid' : 'FestivalSaleInstallmentPaid';
  const itemName = sponsor ? people.sponsorPackage : people.boothName;
  const itemType = loc[`${prefix}ItemType${sponsor ? 'SponsorPackage' : 'Booth'}`];
  const title = loc[`${prefix}HtmlDocumentTitle`];
  const topSource = loc[
    sponsor
      ? isPayer
        ? 'SponsorInstallmentPaidTopTextSponsor'
        : 'SponsorInstallmentPaidTopTextAdminOrganizer'
      : isPayer
        ? 'FestivalSaleInstallmentPaidTopTextVendor'
        : 'FestivalSaleInstallmentPaidTopTextObserver'
  ];
  const topHtml = localizedRichHtml(topSource, {
    ToName: to.name,
    VendorName: sponsor ? people.sponsorName : people.vendorName,
    PaidPercentage: PREVIEW.paidPercentage,
    FestivalName: people.festivalName,
    AmountPaid: PREVIEW.amountPaid,
  });
  const showPayerMetadata = sponsor || !isPayer;
  const payerLabel = loc[`${prefix}Label${sponsor ? 'Sponsor' : 'Vendor'}Name`];
  const payerName = sponsor ? people.sponsorName : people.vendorName;
  const metadataRows = [
    { label: payerLabel, value: payerName },
    { label: loc[`${prefix}LabelBusinessName`], value: people.businessName },
    { label: loc[`${prefix}LabelPhoneNumber`], value: PREVIEW.vendorPhone, ltr: true },
    { label: loc[`${prefix}LabelDate`], value: SAMPLE.money.date, ltr: true },
    { label: loc[`${prefix}LabelTime`], value: SAMPLE.money.time, ltr: true },
  ];
  const invoiceRows = paidInvoiceRows({
    loc,
    prefix,
    itemName,
    itemType,
    quantity: sponsor ? '2' : '1',
    discount: definition.discount,
    cardFees: definition.cardFees,
    processingFees,
  });
  const totalRows = paidTotalsRows({
    loc,
    prefix,
    processingFees,
    cardFees: definition.cardFees,
  });
  const rows = `
    ${brandedHeader({ locale: L.logo, dir: L.dir, logoWidth: 160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 16px;background-color:${T.surface};">
      ${statusAlert({
        variant: 'success',
        title,
        bodyHtml: topHtml,
        dir: L.dir,
        titleFontFamily: L.heading,
        bodyFontFamily: L.body,
      })}
    </td></tr>
    ${showPayerMetadata ? `<tr><td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">${fieldTable(metadataRows, L.dir)}</td></tr>` : ''}
    <tr><td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">
      ${sectionTitle({ title, dir: L.dir, fontFamily: L.heading, fontWeight: 600 })}
      ${fieldTable(invoiceRows, L.dir)}
    </td></tr>
    <tr><td align="${L.dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:0 30px 28px;background-color:${T.surface};">
      ${totalsTable(totalRows, L.dir, L.body)}
    </td></tr>
    ${footer({ email: to.email, dir: L.dir, body: L.body })}`;
  return wrapEmailDocument({
    lang: L.lang,
    dir: L.dir,
    title,
    preheader: title,
    bodyRows: rows,
    fontFamily: L.body,
  });
}

function renderReminder({ sponsor, requestedLocale, requestedVariant, longContent }) {
  const emailId = sponsor ? 'sponsor_installment_second_payment_reminder' : 'second_payment_reminder';
  const definition = resolveVariant(
    emailId,
    requestedVariant,
    sponsor ? SPONSOR_AUDIENCE_VARIANTS : BOOTH_AUDIENCE_VARIANTS,
    sponsor ? 'sponsor' : 'vendor',
  );
  const L = localeContext(requestedLocale, definition.audience);
  const loc = BATCH20_LOCALES[L.locale][sponsor ? 'sponsorInstallments' : 'boothInstallments'];
  const people = previewPeople(longContent);
  const to = recipient(definition.audience, people);
  const isPayer = definition.audience === (sponsor ? 'sponsor' : 'vendor');
  const titleKey = sponsor
    ? 'SponsorInstallmentSecondPaymentReminderHtmlDocumentTitle'
    : 'FestivalSaleSecondPaymentReminderHtmlDocumentTitle';
  const bodyKey = sponsor
    ? isPayer
      ? 'SponsorInstallmentSecondPaymentReminderBodyVendor'
      : 'SponsorInstallmentSecondPaymentReminderBodyNonVendor'
    : isPayer
      ? 'FestivalSaleSecondPaymentReminderBodyVendor'
      : 'FestivalSaleSecondPaymentReminderBodyNonVendor';
  const title = loc[titleKey];
  const bodyHtml = localizedRichHtml(loc[bodyKey], {
    VendorName: sponsor ? people.sponsorName : people.vendorName,
    ReminderNumber: PREVIEW.reminderNumber,
    ItemType: sponsor ? loc.SponsorInstallmentPaidItemTypeSponsorPackage : '',
    ItemName: people.sponsorPackage,
    BoothName: people.boothName,
    FestivalName: people.festivalName,
    DueDate: PREVIEW.dueDate,
    RefundDate: PREVIEW.refundDate,
    Penalty: PREVIEW.penalty,
    FirstBoothPaymentAmount: PREVIEW.firstPayment,
    ProfileURL: PROFILE_URL,
  });
  const rows = `
    ${brandedHeader({ locale: L.logo, dir: L.dir, logoWidth: 160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">
      ${statusAlert({
        variant: 'warning',
        title,
        bodyHtml: '',
        dir: L.dir,
        titleFontFamily: L.heading,
        bodyFontFamily: L.body,
      })}
    </td></tr>
    <tr><td align="${L.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:8px 30px 28px;background-color:${T.surface};font-family:${L.body};font-size:16px;line-height:1.65;color:${T.body};overflow-wrap:anywhere;">
      ${bodyHtml}
    </td></tr>
    ${footer({ email: to.email, dir: L.dir, body: L.body })}`;
  return wrapEmailDocument({
    lang: L.lang,
    dir: L.dir,
    title,
    preheader: title,
    bodyRows: rows,
    fontFamily: L.body,
  });
}

function boothRefundRows(loc, people) {
  return [
    { label: loc.FestivalSaleFirstPaymentRefundTableID, value: `#${PREVIEW.boothRefundId}`, ltr: true },
    { label: loc.FestivalSaleFirstPaymentRefundTableName, value: people.boothName },
    { label: loc.FestivalSaleFirstPaymentRefundTableInitialPayment, value: PREVIEW.firstPayment, ltr: true },
    { label: loc.FestivalSaleFirstPaymentRefundTablePenaltyAmount, value: `- ${PREVIEW.penalty}`, ltr: true },
    { label: loc.FestivalSaleFirstPaymentRefundTableRefundedCost, value: PREVIEW.refundedCost, ltr: true },
    { label: loc.FestivalSaleFirstPaymentRefundTableRefundedTax, value: PREVIEW.refundedTax, ltr: true },
    { label: loc.FestivalSaleFirstPaymentRefundTableCreditCardFees, value: `- ${PREVIEW.refundedBankFees}`, ltr: true },
    { label: loc.FestivalSaleFirstPaymentRefundTableTotalRefunded, value: PREVIEW.totalRefunded, ltr: true },
  ];
}

function sponsorRefundRows(loc, people) {
  return [
    { label: loc.SponsorFirstPaymentRefundTableID, value: `#${PREVIEW.sponsorRefundId}`, ltr: true },
    { label: loc.SponsorFirstPaymentRefundTableName, value: people.sponsorPackage },
    { label: loc.SponsorFirstPaymentRefundTablePenaltyAmount, value: PREVIEW.penalty, ltr: true },
    { label: loc.SponsorFirstPaymentRefundTableRefundedCost, value: PREVIEW.refundedCost, ltr: true },
    { label: loc.SponsorFirstPaymentRefundTableRefundedTax, value: PREVIEW.refundedTax, ltr: true },
    { label: loc.SponsorFirstPaymentRefundTableCreditCardFees, value: `- ${PREVIEW.refundedBankFees}`, ltr: true },
    { label: loc.SponsorFirstPaymentRefundTableTotalRefundedForItem, value: PREVIEW.totalRefunded, ltr: true },
  ];
}

function renderFirstPaymentRefund({ sponsor, requestedLocale, requestedVariant, longContent }) {
  const emailId = sponsor ? 'sponsor_first_payment_refund' : 'first_payment_refund';
  const definition = resolveVariant(
    emailId,
    requestedVariant,
    sponsor ? SPONSOR_AUDIENCE_VARIANTS : BOOTH_AUDIENCE_VARIANTS,
    sponsor ? 'sponsor' : 'vendor',
  );
  const L = localeContext(requestedLocale, definition.audience);
  const loc = BATCH20_LOCALES[L.locale][sponsor ? 'sponsorInstallments' : 'boothInstallments'];
  const people = previewPeople(longContent);
  const to = recipient(definition.audience, people);
  const isPayer = definition.audience === (sponsor ? 'sponsor' : 'vendor');
  const titleKey = sponsor
    ? 'SponsorFirstPaymentRefundHtmlDocumentTitle'
    : 'FestivalSaleFirstPaymentRefundHtmlDocumentTitle';
  const bodyKey = sponsor
    ? isPayer
      ? 'SponsorFirstPaymentRefundBodyVendor'
      : 'SponsorFirstPaymentRefundBodyNonVendor'
    : isPayer
      ? 'FestivalSaleFirstPaymentRefundBodyVendor'
      : 'FestivalSaleFirstPaymentRefundBodyNonVendor';
  const title = loc[titleKey];
  const bodyHtml = localizedRichHtml(loc[bodyKey], {
    ToName: to.name,
    VendorName: sponsor ? people.sponsorName : people.vendorName,
    ItemType: sponsor ? loc.SponsorInstallmentPaidItemTypeSponsorPackage : '',
    ItemName: people.sponsorPackage,
    BoothName: people.boothName,
    FestivalName: people.festivalName,
    DueDate: PREVIEW.dueDate,
    FirstPayment: PREVIEW.firstPayment,
  });
  const refundRows = sponsor ? sponsorRefundRows(loc, people) : boothRefundRows(loc, people);
  const rows = `
    ${brandedHeader({ locale: L.logo, dir: L.dir, logoWidth: 160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">
      ${statusAlert({
        variant: isPayer ? 'error' : 'info',
        title,
        bodyHtml: '',
        dir: L.dir,
        titleFontFamily: L.heading,
        bodyFontFamily: L.body,
      })}
    </td></tr>
    <tr><td align="${L.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:8px 30px 24px;background-color:${T.surface};font-family:${L.body};font-size:16px;line-height:1.65;color:${T.body};overflow-wrap:anywhere;">
      ${bodyHtml}
    </td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 28px;background-color:${T.surface};">
      ${sectionTitle({ title, dir: L.dir, fontFamily: L.heading, fontWeight: 600 })}
      ${fieldTable(refundRows, L.dir)}
    </td></tr>
    ${footer({ email: to.email, dir: L.dir, body: L.body })}`;
  return wrapEmailDocument({
    lang: L.lang,
    dir: L.dir,
    title,
    preheader: title,
    bodyRows: rows,
    fontFamily: L.body,
  });
}

/** Render one of the six owner-authorized B2 installment email previews. */
export function renderBatch20InstallmentEmail(
  emailId,
  { locale = 'en', variant = 'default', longContent = false } = {},
) {
  switch (emailId) {
    case 'festival_sale_installment_paid':
      return renderPaidInstallment({
        sponsor: false,
        requestedLocale: locale,
        requestedVariant: variant,
        longContent,
      });
    case 'second_payment_reminder':
      return renderReminder({
        sponsor: false,
        requestedLocale: locale,
        requestedVariant: variant,
        longContent,
      });
    case 'first_payment_refund':
      return renderFirstPaymentRefund({
        sponsor: false,
        requestedLocale: locale,
        requestedVariant: variant,
        longContent,
      });
    case 'sponsor_installment_paid':
      return renderPaidInstallment({
        sponsor: true,
        requestedLocale: locale,
        requestedVariant: variant,
        longContent,
      });
    case 'sponsor_installment_second_payment_reminder':
      return renderReminder({
        sponsor: true,
        requestedLocale: locale,
        requestedVariant: variant,
        longContent,
      });
    case 'sponsor_first_payment_refund':
      return renderFirstPaymentRefund({
        sponsor: true,
        requestedLocale: locale,
        requestedVariant: variant,
        longContent,
      });
    default:
      throw new Error(`Unknown B2 installment email id: ${emailId}`);
  }
}
