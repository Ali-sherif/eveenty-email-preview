import {
  wrapEmailDocument,
  brandedHeader,
  brandedFooter,
  statusAlert,
  sectionTitle,
  primaryCtaYellow,
  marketingFestivalHeader,
  marketingCampaignFooter,
  fixtureUrl,
  esc,
} from './email-kit.js';
import { TOKENS as T } from './tokens.js';
import { BATCH8_LOCALES } from './batch8-locales.generated.js';

const SAMPLE = Object.freeze({
  person: 'Alex Morgan', email: 'alex.morgan@example.com', phone: '+1 416 555 0199',
  address: '12 King St W, Toronto, ON', business: 'North Shore Events',
  description: 'Independent event services and festival retail partner.',
  festival: 'Summer Music Festival 2026', venue: 'Harbourfront Centre',
  festivalAddress: '235 Queens Quay W, Toronto, ON',
  invoice: 'INV-90421', order: 'ORD-18402', date: '2026-09-20', time: '14:32',
});

function source(locale, pack, key) {
  const value = BATCH8_LOCALES[locale]?.[pack]?.[key];
  if (value == null) throw new Error(`${pack}.${key} missing for locale=${locale}`);
  return value;
}

function copy(locale, pack, key, values = {}) {
  let value = source(locale, pack, key);
  for (const [name, replacement] of Object.entries(values)) {
    value = value.replaceAll(`{{.${name}}}`, String(replacement));
  }
  return esc(value.replace(/<br\s*\/?\s*>/gi, ' '));
}

function effectiveLocale(locale, variant) {
  return variant.startsWith('admin') || variant === 'adminDormant' || variant === 'admin' ? 'en' : locale;
}

function fonts(dir) {
  return { body: dir === 'rtl' ? T.fontBodyRtl : T.fontBody, heading: dir === 'rtl' ? T.fontBodyRtl : T.fontHeading };
}

function textRow(label, valueHtml, dir) {
  const align = dir === 'rtl' ? 'right' : 'left';
  return `<tr>
    <td align="${align}" style="padding:10px 12px;border-bottom:1px solid ${T.border};font-family:${T.fontBody};font-size:13px;font-weight:600;color:${T.body};width:42%;">${esc(label)}</td>
    <td align="${align}" style="padding:10px 12px;border-bottom:1px solid ${T.border};font-family:${T.fontBody};font-size:14px;font-weight:500;color:${T.heading};overflow-wrap:anywhere;">${valueHtml}</td>
  </tr>`;
}

function card(title, rows, dir, headingFont) {
  const align = dir === 'rtl' ? 'right' : 'left';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid ${T.border};border-radius:12px;background-color:${T.surface};">
    <tr><td align="${align}" style="padding:16px 18px 8px;font-family:${headingFont};font-size:17px;font-weight:600;color:${T.heading};">${esc(title)}</td></tr>
    <tr><td style="padding:0 6px 8px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${rows.join('')}</table></td></tr>
  </table>`;
}

function itemCards({ title, items, labels, dir, headingFont, image = false, qr = false }) {
  const align = dir === 'rtl' ? 'right' : 'left';
  return items.map((item, index) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid ${T.border};border-radius:12px;background-color:${T.surface};margin-bottom:12px;">
    <tr><td align="${align}" style="padding:18px;font-family:${T.fontBody};">
      <p style="margin:0 0 12px;font-family:${headingFont};font-size:17px;font-weight:600;color:${T.heading};">${esc(title)} ${index + 1}</p>
      ${image && index === 0 ? `<img src="${fixtureUrl('festival-image-sample.png')}" alt="Synthetic sample add-on image" width="480" height="252" style="display:block;width:100%;max-width:480px;height:auto;border:0;margin:0 auto 14px;" />` : ''}
      ${labels.map(([label, field, technical]) => `<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:${T.body};"><strong>${esc(label)}:</strong> <span ${technical ? 'dir="ltr" style="unicode-bidi:embed;"' : 'dir="auto" style="unicode-bidi:isolate;"'}>${esc(item[field])}</span></p>`).join('')}
      ${qr ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:14px auto 0;"><tr><td align="center" style="padding:10px;background-color:${T.primary50};border:1px solid ${T.border};"><img src="${fixtureUrl('qr-sample.png')}" alt="Synthetic sample QR code — not a live credential" width="160" height="160" style="display:block;width:160px;height:160px;border:0;" /></td></tr></table>` : ''}
    </td></tr>
  </table>`).join('');
}

function moneySummary({ locale, pack, prefix, dir, includePromo = true, includeFees = true, includeCard = true, total = 'CA$92.90' }) {
  const key = (suffix) => {
    const special = {
      addOn: { PromoCodeDiscount: 'FestivalAddOnPromoDiscount', CreditCardFees: 'FestivalAddOnBankFees', GrandTotal: 'FestivalAddOnTotal' },
      activity: { Subtotal: 'FestivalTicketOrderCost', PromoCodeDiscount: 'FestivalTicketOrderPromoDiscount', GrandTotal: 'FestivalTicketOrderTransactionTotal' },
    };
    return special[pack]?.[suffix] || `${prefix}${suffix}`;
  };
  const rows = [
    [source(locale, pack, key('Subtotal')), 'CA$80.00'],
    ...(includePromo ? [[source(locale, pack, key('PromoCode')), 'FEST2026'], [source(locale, pack, key('PromoCodeDiscount')), '− CA$8.00']] : []),
    ...(includeFees ? [[source(locale, pack, key('ProcessingFees')), 'CA$2.50']] : []),
    [source(locale, pack, key('Tax')), 'CA$10.40'],
    ...(includeCard ? [[source(locale, pack, key('CreditCardFees')), 'CA$1.75']] : []),
  ];
  const align = dir === 'rtl' ? 'right' : 'left';
  return `<table role="presentation" width="320" cellpadding="0" cellspacing="0" border="0" style="width:320px;max-width:100%;border-collapse:collapse;background-color:${T.primary};border-radius:8px;">
    <tr><td style="padding:18px 18px 6px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows.map(([label, value]) => `<tr><td align="${align}" style="padding:0 0 10px;font-family:${T.fontBody};font-size:13px;color:${T.heading};">${esc(label)}</td><td align="${dir === 'rtl' ? 'left' : 'right'}" dir="ltr" style="padding:0 0 10px;font-family:${T.fontBody};font-size:13px;color:${T.heading};">${esc(value)}</td></tr>`).join('')}</table></td></tr>
    <tr><td style="padding:14px 18px;background-color:${T.primary50};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td align="${align}" style="font-family:${T.fontBody};font-size:16px;font-weight:700;color:${T.heading};">${esc(source(locale, pack, key('GrandTotal')))}</td><td align="${dir === 'rtl' ? 'left' : 'right'}" dir="ltr" style="font-family:${T.fontBody};font-size:16px;font-weight:700;color:${T.heading};">${esc(total)}</td></tr></table></td></tr>
  </table>`;
}

function calendarActions(locale, pack, prefix, bodyFont) {
  const addToKey = pack === 'addOn' ? 'FestivalAddOnAddToCalendar' : pack === 'activity' ? 'FestivalTicketInfoAddTo' : `${prefix}AddToLabel`;
  return `<p style="margin:0;font-family:${bodyFont};font-size:13px;line-height:1.6;color:${T.body};">${esc(source(locale, pack, addToKey))} <a href="https://example.com/preview/calendar/google" style="color:${T.secondary};text-decoration:none;">${esc(source(locale, pack, `${prefix}GoogleCalendar`))}</a> · <a href="https://example.com/preview/calendar/apple" style="color:${T.secondary};text-decoration:none;">${esc(source(locale, pack, `${prefix}AppleCalendar`))}</a> · <a href="https://example.com/preview/calendar/yahoo" style="color:${T.secondary};text-decoration:none;">${esc(source(locale, pack, `${prefix}YahooCalendar`))}</a></p>
  <p style="margin:8px 0 0;font-family:${bodyFont};font-size:12px;color:${T.body};"><span dir="ltr">[event.ics]</span></p>`;
}

function localizedFooter(locale, dir, bodyFont) {
  return brandedFooter({ email: SAMPLE.email, dir, fontFamily: bodyFont, footerLead: source(locale, 'common', 'ActivateEmailFooterLead'), footerSuffix: source(locale, 'common', 'ActivateEmailFooterSuffix'), copyright: source(locale, 'common', 'ActivateEmailCopyright') });
}

function wrap({ locale, title, preheader, rows }) {
  const dir = ['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr';
  return wrapEmailDocument({ lang: locale, dir, title, preheader, bodyRows: rows, fontFamily: fonts(dir).body });
}

function renderAddOn(locale, variant, longContent) {
  const dir = ['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr';
  const { body, heading } = fonts(dir);
  const isObserver = variant.includes('Dormant');
  const guest = variant === 'userGuest';
  const showSummary = variant !== 'userNoSummary';
  const items = [{ name: longContent ? 'Festival merchandise bundle with an intentionally long descriptive name' : 'Festival merchandise bundle', description: 'T-shirt, reusable bottle, and event poster.', price: 'CA$42.00', quantity: '1', id: 'ADD-1042' }, { name: 'VIP lounge access', description: 'One-day lounge upgrade.', price: 'CA$38.00', quantity: '1', id: 'ADD-1043' }];
  const greeting = isObserver
    ? `${guest ? SAMPLE.email : `<bdi>${esc(SAMPLE.person)}</bdi>`} ${copy(locale, 'addOn', 'FestivalAddOnOrganizerNote')} <bdi>${esc(SAMPLE.festival)}</bdi>.`
    : `${copy(locale, 'addOn', 'FestivalAddOnHello')} <bdi>${esc(SAMPLE.person)}</bdi>${dir === 'rtl' ? '،' : ','} ${copy(locale, 'addOn', 'FestivalAddOnUserGreeting')} <bdi>${esc(SAMPLE.festival)}</bdi>. ${copy(locale, 'addOn', 'FestivalAddOnCarryReceiptNote')}`;
  const rows = `${brandedHeader({ locale, dir, logoWidth: 160 })}
    <tr><td class="stack-pad" align="${dir === 'rtl' ? 'right' : 'left'}" style="padding:28px 30px 16px;background-color:${T.surface};font-family:${body};font-size:16px;line-height:1.6;color:${T.body};"><p style="margin:0;">${greeting}</p>${isObserver ? '<p style="margin:8px 0 0;font-size:12px;color:#4d4c49;">Preview coverage: dormant production sender branch (no live caller found).</p>' : ''}</td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${sectionTitle({ title: source(locale, 'addOn', 'FestivalAddOnItemsTitle'), dir, fontFamily: heading, fontWeight: 600 })}${itemCards({ title: source(locale, 'addOn', 'FestivalAddOnItemName'), items, labels: [[source(locale, 'addOn', 'FestivalAddOnItemDescription'), 'description'], [source(locale, 'addOn', 'FestivalAddOnItemPrice'), 'price', true], [source(locale, 'addOn', 'FestivalAddOnItemQuantity'), 'quantity', true], [source(locale, 'addOn', 'FestivalAddOnItemID'), 'id', true]], dir, headingFont: heading, image: true, qr: true })}</td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${card(source(locale, 'addOn', 'FestivalAddOnEventName'), [textRow(source(locale, 'addOn', 'FestivalAddOnEventStart'), '<span dir="ltr">2026-10-10 19:00</span>', dir), textRow(source(locale, 'addOn', 'FestivalAddOnEventEnd'), '<span dir="ltr">2026-10-10 23:30</span>', dir), textRow(source(locale, 'addOn', 'FestivalAddOnVenue'), `<bdi>${esc(SAMPLE.venue)}</bdi>`, dir), textRow(source(locale, 'addOn', 'FestivalAddOnLocation'), `<bdi>${esc(SAMPLE.festivalAddress)}</bdi>`, dir)], dir, heading)}<div style="padding-top:12px;">${calendarActions(locale, 'addOn', 'FestivalAddOn', body)}</div></td></tr>
    ${showSummary ? `<tr><td align="${dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:8px 30px 20px;background-color:${T.surface};">${moneySummary({ locale, pack: 'addOn', prefix: 'FestivalAddOn', dir, total: 'CA$128.65' })}</td></tr>` : ''}
    ${localizedFooter(locale, dir, body)}`;
  return wrap({ locale, title: source(locale, 'addOn', 'FestivalAddOnItemsTitle'), preheader: source(locale, 'addOn', 'FestivalAddOnCarryReceiptNote'), rows });
}

function renderActivity(locale, variant, longContent) {
  const dir = ['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr';
  const { body, heading } = fonts(dir);
  const introKey = variant === 'user' ? 'FestivalActivitySaleUserIntroLine1' : 'FestivalActivitySaleStaffIntro';
  const intro = copy(locale, 'activity', introKey, { FestivalName: SAMPLE.festival, BuyerName: SAMPLE.person });
  const tickets = [{ name: 'Jordan Morgan', age: '9', activity: longContent ? 'Junior makers laboratory and creative robotics workshop' : 'Junior makers laboratory', date: '2026-10-10 10:00', waiver: 'Activity waiver PDF' }, { name: 'Taylor Morgan', age: '11', activity: 'Youth dance workshop', date: '2026-10-10 13:30', waiver: 'Activity waiver PDF' }];
  const rows = `${brandedHeader({ locale, dir, logoWidth: 160 })}
    <tr><td class="stack-pad" align="${dir === 'rtl' ? 'right' : 'left'}" style="padding:28px 30px 16px;background-color:${T.surface};font-family:${body};font-size:16px;line-height:1.6;color:${T.body};"><p style="margin:0 0 8px;">${copy(locale, 'activity', 'FestivalActivitySaleHello')} <bdi>${esc(variant === 'admin' ? 'Eveenty' : SAMPLE.person)}</bdi>${dir === 'rtl' ? '،' : ','}</p><p style="margin:0;">${intro}</p>${variant === 'user' ? `<p style="margin:8px 0 0;">${copy(locale, 'activity', 'FestivalActivitySaleUserIntroLine2')}</p>` : ''}</td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${itemCards({ title: source(locale, 'activity', 'FestivalActivityLabelActivityName'), items: tickets, labels: [[source(locale, 'activity', 'FestivalActivityLabelPlayerName'), 'name'], [source(locale, 'activity', 'FestivalActivityLabelPlayerAge'), 'age', true], [source(locale, 'activity', 'FestivalActivityLabelActivityDate'), 'date', true], [source(locale, 'activity', 'FestivalActivityLabelActivityWaiver'), 'waiver']], dir, headingFont: heading, qr: true })}<p style="margin:8px 0 0;font-family:${body};font-size:12px;color:${T.body};">${esc(source(locale, 'activity', 'FestivalActivityLabelActivityWaiver'))}: <a href="https://example.com/preview/activity-waiver.pdf" style="color:${T.secondary};text-decoration:none;">PDF waiver</a></p></td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${calendarActions(locale, 'activity', 'FestivalTicketInfo', body)}</td></tr>
    <tr><td align="${dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:8px 30px 20px;background-color:${T.surface};">${moneySummary({ locale, pack: 'activity', prefix: 'FestivalTicketOrder', dir, total: 'CA$92.90' })}</td></tr>
    ${localizedFooter(locale, dir, body)}`;
  return wrap({ locale, title: source(locale, 'activity', 'FestivalActivityPageTitle'), preheader: source(locale, 'activity', 'FestivalActivityPageTitle'), rows });
}

function stateFromVariant(variant) {
  if (variant.endsWith('Approved')) return 'Approved';
  if (variant.endsWith('Rejected')) return 'Rejected';
  if (variant.endsWith('Closed')) return 'Closed';
  return 'Pending';
}

function audienceFromVariant(variant, primary) {
  if (variant.startsWith('organizer')) return 'Organizer';
  if (variant.startsWith('admin')) return 'Admin';
  return primary;
}

function renderManagedSale(templateId, locale, variant, longContent) {
  const sponsor = templateId === 'festival_sponsor_sale';
  const pack = sponsor ? 'sponsorSale' : 'festivalSale';
  const prefix = sponsor ? 'FestivalSponsorSale' : 'FestivalSale';
  const state = stateFromVariant(variant);
  const audience = audienceFromVariant(variant, sponsor ? 'Sponsor' : 'Vendor');
  const dir = ['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr';
  const { body, heading } = fonts(dir);
  let paragraphKey;
  let paragraphPack = pack;
  if (audience === 'Admin') paragraphKey = `${prefix}AdminParagraph${state}`;
  else if (audience === 'Organizer') paragraphKey = `${prefix}OrganizerParagraph${state}`;
  else {
    paragraphPack = 'festivalSale';
    paragraphKey = `FestivalSaleVendorParagraph${state === 'Closed' ? 'Rejected' : state}`;
  }
  let paragraph = copy(locale, paragraphPack, paragraphKey, { SponsorName: SAMPLE.person, VendorName: SAMPLE.person, FestivalName: SAMPLE.festival });
  if (state === 'Rejected') paragraph += ` <strong>Reason:</strong> ${esc('Capacity and placement requirements could not be met (synthetic preview note).')}`;
  const alertVariant = state === 'Approved' ? 'success' : state === 'Pending' ? 'warning' : 'error';
  const titleKey = state === 'Pending' ? `${prefix}TitlePending${sponsor ? 'PackageSale' : 'Approval'}` : `${prefix}Title${state}`;
  const saleType = sponsor ? 'Sponsor package' : source(locale, pack, 'FestivalSaleTypeBooth');
  const items = [{ name: sponsor ? 'Gold Sponsor Package' : 'Main Hall Booth B-14', type: sponsor ? source(locale, pack, `${prefix}ItemTypeSponsorPackage`) : source(locale, pack, `${prefix}ItemTypeBooth`), price: 'CA$1,200.00', quantity: '1', amount: 'CA$1,200.00' }, { name: sponsor ? 'Stage mention add-on' : 'Power service', type: sponsor ? source(locale, pack, `${prefix}ItemTypeSponsorPackage`) : source(locale, pack, `${prefix}ItemTypeService`), price: 'CA$180.00', quantity: '1', amount: 'CA$180.00' }];
  const rows = `${brandedHeader({ locale, dir, logoWidth: 160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">${statusAlert({ variant: alertVariant, title: copy(locale, pack, titleKey, { SaleType: saleType }), bodyHtml: paragraph, dir, titleFontFamily: heading, bodyFontFamily: body })}</td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${card(source(locale, pack, `${prefix}InvoiceTitle`), [textRow(source(locale, pack, `${prefix}ClientName`), `<bdi>${esc(SAMPLE.person)}</bdi>`, dir), textRow(source(locale, pack, `${prefix}ClientAddress`), `<bdi>${esc(SAMPLE.address)}</bdi>`, dir), textRow(source(locale, pack, `${prefix}ClientPhone`), `<span dir="ltr">${esc(SAMPLE.phone)}</span>`, dir), textRow(source(locale, pack, `${prefix}ClientEmail`), `<a href="mailto:${esc(SAMPLE.email)}" dir="ltr" style="color:${T.secondary};text-decoration:none;">${esc(SAMPLE.email)}</a>`, dir), textRow(source(locale, pack, `${prefix}InvoiceIDLabel`), `<span dir="ltr">${esc(SAMPLE.invoice)}</span>`, dir), textRow(source(locale, pack, `${prefix}BusinessName`), `<bdi>${esc(SAMPLE.business)}</bdi>`, dir)], dir, heading)}</td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${sectionTitle({ title: source(locale, pack, `${prefix}PurchaseDetails`), dir, fontFamily: heading, fontWeight: 600 })}${itemCards({ title: source(locale, pack, `${prefix}TableName`), items: longContent ? [...items, { ...items[0], name: `${items[0].name} — extended wrap-testing description` }] : items, labels: [[source(locale, pack, `${prefix}TableType`), 'type'], [source(locale, pack, `${prefix}TablePrice`), 'price', true], [source(locale, pack, `${prefix}TableQuantity`), 'quantity', true], [source(locale, pack, `${prefix}TableAmount`), 'amount', true]], dir, headingFont: heading })}</td></tr>
    <tr><td align="${dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${moneySummary({ locale, pack, prefix, dir, includeFees: audience !== 'Organizer', total: longContent ? 'CA$1,577.65' : 'CA$1,397.65' })}</td></tr>
    ${['Pending', 'Approved'].includes(state) ? `<tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${card(source(locale, pack, `${prefix}DueOnHeading`), [textRow(source(locale, pack, `${prefix}DueTableTotalPending`), '<span dir="ltr">CA$640.00</span>', dir), textRow(source(locale, pack, `${prefix}DueTableDueOn`), '<span dir="ltr">2026-10-01</span>', dir)], dir, heading)}</td></tr>` : ''}
    <tr><td class="stack-pad" style="padding:8px 30px 20px;background-color:${T.surface};font-family:${body};">${calendarActions(locale, pack, prefix, body)}${sponsor ? `<p style="margin:10px 0 0;font-size:13px;color:${T.body};">${esc(source(locale, pack, `${prefix}ContractPrefix`))}: <a href="https://example.com/preview/sponsor-contract.pdf" style="color:${T.secondary};text-decoration:none;">${esc(source(locale, pack, `${prefix}ContractClickHere`))}</a></p>` : ''}</td></tr>
    ${localizedFooter(locale, dir, body)}`;
  return wrap({ locale, title: copy(locale, pack, titleKey, { SaleType: saleType }), preheader: paragraph, rows });
}

function renderVendorSale(locale, variant, longContent) {
  const dir = ['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr';
  const { body, heading } = fonts(dir);
  const title = variant === 'vendorReceived' ? copy(locale, 'vendorSale', 'FestivalVendorSaleOrderReceivedTitle', { OrderNumber: SAMPLE.order }) : source(locale, 'vendorSale', 'FestivalVendorSaleOrderReceiptTitle');
  const items = [{ name: longContent ? 'Handcrafted festival merchandise gift set with extended description' : 'Festival merchandise gift set', type: source(locale, 'vendorSale', 'FestivalVendorSaleItemTypeProduct'), price: 'CA$48.00', quantity: '1', amount: 'CA$48.00' }, { name: 'Reusable bottle', type: source(locale, 'vendorSale', 'FestivalVendorSaleItemTypeProduct'), price: 'CA$32.00', quantity: '1', amount: 'CA$32.00' }];
  const rows = `${brandedHeader({ locale, dir, logoWidth: 160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">${statusAlert({ variant: 'success', title, bodyHtml: variant === 'buyer' ? 'Buyer receipt copy' : 'Vendor order copy', dir, titleFontFamily: heading, bodyFontFamily: body })}</td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${card(title, [textRow(source(locale, 'vendorSale', 'FestivalVendorSaleClientName'), `<bdi>${esc(SAMPLE.person)}</bdi>`, dir), textRow(source(locale, 'vendorSale', 'FestivalVendorSaleClientPhone'), `<span dir="ltr">${esc(SAMPLE.phone)}</span>`, dir), textRow(source(locale, 'vendorSale', 'FestivalVendorSaleClientEmail'), `<span dir="ltr">${esc(SAMPLE.email)}</span>`, dir), textRow(source(locale, 'vendorSale', 'FestivalVendorSaleOrderNumber'), `<span dir="ltr">${esc(SAMPLE.order)}</span>`, dir), textRow(source(locale, 'vendorSale', 'FestivalVendorSaleSubmittedAt'), `<span dir="ltr">${SAMPLE.date} ${SAMPLE.time}</span>`, dir), textRow(source(locale, 'vendorSale', 'FestivalVendorSaleWillBeReadyAt'), '<span dir="ltr">2026-09-21 16:00</span>', dir)], dir, heading)}</td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};">${itemCards({ title: source(locale, 'vendorSale', 'FestivalVendorSaleTableName'), items, labels: [[source(locale, 'vendorSale', 'FestivalVendorSaleTableType'), 'type'], [source(locale, 'vendorSale', 'FestivalVendorSaleTablePrice'), 'price', true], [source(locale, 'vendorSale', 'FestivalVendorSaleTableQuantity'), 'quantity', true], [source(locale, 'vendorSale', 'FestivalVendorSaleTableAmount'), 'amount', true]], dir, headingFont: heading })}<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:12px auto 0;"><tr><td><img src="${fixtureUrl('qr-sample.png')}" alt="${esc(source(locale, 'vendorSale', 'FestivalVendorSaleQRCodeImageAlt'))} — synthetic sample" width="160" height="160" style="display:block;width:160px;height:160px;border:0;" /></td></tr></table></td></tr>
    <tr><td align="${dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:8px 30px 20px;background-color:${T.surface};">${moneySummary({ locale, pack: 'vendorSale', prefix: 'FestivalVendorSale', dir, includePromo: false, total: 'CA$94.65' })}</td></tr>
    ${localizedFooter(locale, dir, body)}`;
  return wrap({ locale, title, preheader: title, rows });
}

function renderCampaignReceipt(kind) {
  const emailKind = kind === 'email';
  const title = `Thank you, ${SAMPLE.person} for using Eveenty Marketing platform for your festival ${SAMPLE.festival}.`;
  const unit = emailKind ? 'Emails' : 'SMS';
  const rows = `${brandedHeader({ locale: 'en', dir: 'ltr', logoWidth: 160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">${statusAlert({ variant: 'success', title: `${unit} campaign receipt`, bodyHtml: esc(title), dir: 'ltr', titleFontFamily: T.fontHeading, bodyFontFamily: T.fontBody })}</td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 18px;background-color:${T.surface};">${card('Campaign receipt', [textRow(`Number of ${unit}`, '<span dir="ltr">2,500</span>', 'ltr'), textRow(`Cost/${emailKind ? 'Email' : 'SMS'}`, '<span dir="ltr">CA$0.04</span>', 'ltr'), textRow('Total Cost', '<span dir="ltr">CA$100.00</span>', 'ltr'), textRow('Total Tax', '<span dir="ltr">CA$13.00</span>', 'ltr'), textRow('Bank Fees', '<span dir="ltr">CA$2.50</span>', 'ltr'), textRow('TOTAL', '<span dir="ltr">CA$115.50</span>', 'ltr')], 'ltr', T.fontHeading)}</td></tr>
    <tr><td align="center" class="stack-pad" style="padding:8px 30px 22px;background-color:${T.surface};font-family:${T.fontBody};font-size:13px;line-height:1.6;color:${T.body};"><p style="margin:0 0 8px;font-weight:600;">Make sure to stay connected with us in social media to ensure you are up to date with our discounts, specials, contests, events &amp; promotions</p><p style="margin:0;"><a href="https://example.com/preview/eveenty" style="color:${T.secondary};text-decoration:none;">Eveenty</a> · <a href="https://example.com/preview/facebook" style="color:${T.secondary};text-decoration:none;">Facebook</a> · <a href="https://example.com/preview/instagram" style="color:${T.secondary};text-decoration:none;">Instagram</a> · <a href="https://example.com/preview/linkedin" style="color:${T.secondary};text-decoration:none;">LinkedIn</a></p></td></tr>
    ${brandedFooter({ email: SAMPLE.email, dir: 'ltr', fontFamily: T.fontBody, copyright: '© Eveenty, 10 - 225 The East Mall Suite #1264 - Toronto - ON - M9B 0A9' })}`;
  return wrap({ locale: 'en', title: `${unit} campaign receipt`, preheader: `${unit} campaign receipt`, rows });
}

function renderMarketingTarget(variant, longContent) {
  const showLogo = variant !== 'withoutLogo' && variant !== 'bodyOnly';
  const showImage = variant !== 'withoutImage' && variant !== 'bodyOnly';
  const authorBody = longContent
    ? 'Join us for a weekend of music, food, community workshops, family activities, and special performances. This synthetic campaign paragraph is intentionally extended to validate safe wrapping without using production recipient data.'
    : 'Join us at Summer Music Festival 2026 — early-bird weekend passes are open. SAMPLE campaign body from the organizer.';
  const rows = `${showLogo ? marketingFestivalHeader({ logoSrc: fixtureUrl('festival-logo-sample.png'), alt: 'Synthetic Summer Music Festival logo' }) : ''}
    <tr><td align="center" class="stack-pad" style="padding:28px 30px;background-color:${T.surface};font-family:${T.fontBody};"><h1 style="margin:0 0 16px;font-family:${T.fontHeading};font-size:24px;font-weight:600;line-height:1.3;color:${T.heading};"><bdi>${esc(SAMPLE.festival)}</bdi></h1><p style="margin:0;font-size:16px;line-height:1.65;color:${T.body};white-space:pre-wrap;overflow-wrap:anywhere;">${esc(authorBody)}</p></td></tr>
    ${showImage ? `<tr><td align="center" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};"><img src="${fixtureUrl('festival-image-sample.png')}" alt="Synthetic festival campaign artwork" width="540" height="284" style="display:block;width:100%;max-width:540px;height:auto;border:0;" /></td></tr>` : ''}
    <tr><td align="center" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">${primaryCtaYellow({ href: 'https://example.com/preview/festival', label: 'Explore the festival', fontFamily: T.fontBody })}</td></tr>
    <tr><td align="center" class="stack-pad" style="padding:0 30px 18px;background-color:${T.surface};font-family:${T.fontBody};font-size:13px;color:${T.body};">This message was sent to <a href="mailto:campaign.target@example.com" style="color:${T.secondary};text-decoration:none;">campaign.target@example.com</a>.</td></tr>
    ${marketingCampaignFooter({ unsubscribeUrl: 'https://example.com/preview/unsubscribe' }).replaceAll('#777777', T.body)}`;
  return wrap({ locale: 'en', title: 'Festival marketing campaign', preheader: 'Festival campaign message', rows });
}

export function renderBatch8Email(emailId, { locale = 'en', variant = 'default', longContent = false } = {}) {
  const effective = effectiveLocale(locale, variant);
  switch (emailId) {
    case 'festival_add_on_sale': return renderAddOn(effective, variant, longContent);
    case 'festival_activity_sale': return renderActivity(effective, variant, longContent);
    case 'festival_sponsor_sale': return renderManagedSale(emailId, effective, variant, longContent);
    case 'festival_sales': return renderManagedSale(emailId, effective, variant, longContent);
    case 'festival_vendor_sale': return renderVendorSale(effective, variant, longContent);
    case 'organizer_festival_marketing_email_receipt': return renderCampaignReceipt('email');
    case 'organizer_festival_marketing_sms_receipt': return renderCampaignReceipt('sms');
    case 'festival_rescounts_marketing_email_target': return renderMarketingTarget(variant, longContent);
    default: throw new Error(`Unknown batch-8 email id: ${emailId}`);
  }
}
