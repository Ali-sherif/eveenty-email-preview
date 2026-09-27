import {
  wrapEmailDocument,
  brandedHeader,
  brandedFooter,
  statusAlert,
  sectionTitle,
  primaryCtaYellow,
  fixtureUrl,
  esc,
} from './email-kit.js';
import { TOKENS as T } from './tokens.js';

const SAMPLE = Object.freeze({
  person: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 416 555 0199',
  address: '12 King St W, Toronto, ON',
  business: 'North Shore Events',
  description: 'Independent event services and festival retail partner.',
  festival: 'Summer Music Festival 2026',
  invoice: 'MP-90421',
  date: 'September 27, 2026',
});

const PACKAGE_COPY = Object.freeze({
  en: { title: 'Marketing package purchase', organizerIntro: `Thank you, ${SAMPLE.person}, for purchasing marketing package(s). Below is your invoice.`, adminIntro: `${SAMPLE.person} purchased marketing package(s). Below is the invoice.`, clientName: 'Client name:', clientAddress: 'Client address:', clientPhone: 'Client phone:', clientEmail: 'Client email:', invoice: 'Invoice ID:', business: 'Business name:', description: 'Business description:', date: 'Date:', item: 'Item ID', name: 'Name', quota: 'Quota', valid: 'Valid for', expiry: 'Expiry date', amount: 'Amount', subtotal: 'Subtotal:', tax: 'Tax:', total: 'Grand total:', days: '90 days', quotaText: '10,000 emails, 2,000 SMS, 500 notifications' },
  fr: { title: 'Achat de forfait marketing', organizerIntro: `Merci ${SAMPLE.person} pour l’achat d’un ou plusieurs forfaits marketing. Voici votre facture.`, adminIntro: `${SAMPLE.person} a acheté un ou des forfaits marketing. Voici la facture.`, clientName: 'Nom du client :', clientAddress: 'Adresse du client :', clientPhone: 'Téléphone du client :', clientEmail: 'E-mail du client :', invoice: 'N° de facture :', business: 'Nom de l’entreprise :', description: 'Description de l’entreprise :', date: 'Date :', item: 'N° d’article', name: 'Nom', quota: 'Quota', valid: 'Valable pour', expiry: 'Date d’expiration', amount: 'Montant', subtotal: 'Sous-total :', tax: 'Taxe :', total: 'Total général :', days: '90 jours', quotaText: '10 000 e-mails, 2 000 SMS, 500 notifications' },
  es: { title: 'Compra de paquete de marketing', organizerIntro: `Gracias, ${SAMPLE.person}, por comprar paquete(s) de marketing. A continuación su factura.`, adminIntro: `${SAMPLE.person} compró paquete(s) de marketing. A continuación la factura.`, clientName: 'Nombre del cliente:', clientAddress: 'Dirección del cliente:', clientPhone: 'Teléfono del cliente:', clientEmail: 'Correo del cliente:', invoice: 'ID de factura:', business: 'Nombre del negocio:', description: 'Descripción del negocio:', date: 'Fecha:', item: 'ID de artículo', name: 'Nombre', quota: 'Cupo', valid: 'Válido por', expiry: 'Fecha de vencimiento', amount: 'Importe', subtotal: 'Subtotal:', tax: 'Impuesto:', total: 'Total general:', days: '90 días', quotaText: '10 000 correos, 2 000 SMS, 500 notificaciones' },
  ar: { title: 'شراء حزمة تسويق', organizerIntro: `شكرًا لك ${SAMPLE.person} على شراء حزمة (حزم) تسويق. أدناه فاتورتك.`, adminIntro: `${SAMPLE.person} قام بشراء حزمة (حزم) تسويق. أدناه الفاتورة.`, clientName: 'اسم العميل:', clientAddress: 'عنوان العميل:', clientPhone: 'هاتف العميل:', clientEmail: 'البريد الإلكتروني للعميل:', invoice: 'رقم الفاتورة:', business: 'اسم النشاط:', description: 'وصف النشاط:', date: 'التاريخ:', item: 'رقم الصنف', name: 'الاسم', quota: 'الباقة المتاحة', valid: 'صالح لمدة', expiry: 'تاريخ الانتهاء', amount: 'المبلغ', subtotal: 'المجموع الفرعي:', tax: 'الضريبة:', total: 'الإجمالي:', days: '90 يومًا', quotaText: '10,000 بريد إلكتروني، 2,000 رسالة نصية، 500 إشعارًا' },
  fa: { title: 'خرید بسته بازاریابی', organizerIntro: `از خرید بسته(های) بازاریابی متشکریم، ${SAMPLE.person}. در ادامه صورتحساب شماست.`, adminIntro: `${SAMPLE.person} بسته(های) بازاریابی خریداری کرد. در ادامه صورتحساب است.`, clientName: 'نام مشتری:', clientAddress: 'آدرس مشتری:', clientPhone: 'تلفن مشتری:', clientEmail: 'ایمیل مشتری:', invoice: 'شناسه صورتحساب:', business: 'نام کسب‌وکار:', description: 'توضیحات کسب‌وکار:', date: 'تاریخ:', item: 'شناسه قلم', name: 'نام', quota: 'سهمیه', valid: 'اعتبار', expiry: 'تاریخ انقضا', amount: 'مبلغ', subtotal: 'جمع جزء:', tax: 'مالیات:', total: 'جمع کل:', days: '90 روز', quotaText: '10,000 ایمیل، 2,000 پیامک، 500 اعلان' },
});

function textBlock(html, { align = 'left', pre = false } = {}) {
  return `<tr><td style="padding:0 0 16px;font-family:${T.fontStack};font-size:16px;line-height:1.6;color:${T.text};text-align:${align};${pre ? 'white-space:pre-wrap;word-break:break-word;' : ''}">${html}</td></tr>`;
}

function card(body, { background = '#ffffff', border = T.border } = {}) {
  return `<tr><td style="padding:20px;background:${background};border:1px solid ${border};border-radius:16px;">${body}</td></tr><tr><td height="16" style="height:16px;line-height:16px;font-size:1px;">&nbsp;</td></tr>`;
}

function keyValues(rows) {
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows.map(([label, value, ltr = false]) => `<tr><td style="padding:7px 10px 7px 0;font-family:${T.fontStack};font-size:14px;line-height:1.45;color:${T.text};font-weight:600;vertical-align:top;">${esc(label)}</td><td ${ltr ? 'dir="ltr"' : 'dir="auto"'} style="padding:7px 0;font-family:${T.fontStack};font-size:14px;line-height:1.45;color:${T.text};text-align:right;word-break:break-word;">${esc(value)}</td></tr>`).join('')}</table>`;
}

function shell({ title, dir = 'ltr', lang = 'en', rows, preheader, email = SAMPLE.email }) {
  return wrapEmailDocument({
    lang,
    dir,
    title,
    preheader,
    // Design Kit brandedFooter expects a synthetic recipient (activate-style "sent to" component).
    // Final-7 previously omitted email, which rendered as "This message was sent to .".
    bodyRows: `${brandedHeader({ locale: lang, dir, logoWidth: 160 })}${rows}${brandedFooter({ email, dir })}`,
  });
}

function renderMarketingPackage({ locale, variant, longContent }) {
  const copy = PACKAGE_COPY[locale] || PACKAGE_COPY.en;
  const dir = locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr';
  const intro = variant === 'admin' ? copy.adminIntro : copy.organizerIntro;
  const description = longContent ? `${SAMPLE.description} ${'Regional campaigns and audience engagement services. '.repeat(5)}` : SAMPLE.description;
  const rows = [
    sectionTitle({ title: copy.title, dir }),
    textBlock(esc(intro), { align: dir === 'rtl' ? 'right' : 'left' }),
    card(keyValues([
      [copy.clientName, SAMPLE.person], [copy.clientAddress, SAMPLE.address], [copy.clientPhone, SAMPLE.phone, true], [copy.clientEmail, SAMPLE.email, true],
      [copy.invoice, SAMPLE.invoice, true], [copy.business, SAMPLE.business], [copy.description, description], [copy.date, '2026-09-27 · 14:32', true],
    ])),
    card(`${sectionTitle({ title: copy.name, dir })}${keyValues([[copy.item, '#MP-01', true], [copy.name, 'Audience Boost'], [copy.quota, copy.quotaText], [copy.valid, copy.days], [copy.expiry, '2026-12-26', true], [copy.amount, 'CA$250.00', true]])}`),
    card(keyValues([[copy.subtotal, 'CA$250.00', true], [copy.tax, 'CA$32.50', true], [copy.total, 'CA$282.50', true]]), { background: T.headerBg }),
  ].join('');
  const footerEmail = variant === 'admin' ? 'admin@example.com' : SAMPLE.email;
  return shell({ title: copy.title, dir, lang: locale, preheader: copy.title, rows, email: footerEmail });
}

function renderPayout({ variant, longContent }) {
  const recipient = variant === 'admin' ? 'Eveenty Admin' : 'Alex Morgan';
  const footerEmail = variant === 'admin' ? 'admin@example.com' : SAMPLE.email;
  const rows = [
    sectionTitle({ title: 'Festival payout processed', dir: 'ltr' }),
    textBlock(`Dear ${esc(recipient)},`),
    statusAlert({ kind: 'success', title: 'Payout processed', bodyHtml: `A payout of <strong>CA$4,820.75</strong> for <strong>${esc(SAMPLE.festival)}</strong> has been processed.`, dir: 'ltr' }),
    card(keyValues([['Period from', '2026-09-14', true], ['Period to', '2026-09-21', true], ['Payout amount', 'CA$4,820.75', true], ['Recipient', recipient]])),
    textBlock(longContent ? 'The settlement covers the completed reporting period. Review the detailed transaction breakdown and reconcile it with your internal records before closing the period.' : 'Review the payout details for the completed reporting period.'),
    `<tr><td align="center" style="padding:4px 0 24px;">${primaryCtaYellow({ href: fixtureUrl('payout-details'), label: 'View payout details' })}</td></tr>`,
  ].join('');
  return shell({ title: 'Festival payout', preheader: 'Festival payout processed', rows, email: footerEmail });
}

function couponCard(index, longContent) {
  const description = longContent ? `Save on your next visit with this partner offer. ${'Terms apply to participating locations and eligible menu items. '.repeat(4)}` : 'Save on your next visit with this partner offer.';
  return card(`<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td align="center" style="padding:0 0 16px;"><img src="${fixtureUrl('qr-sample.png')}" width="160" height="160" alt="Coupon QR code ${index}" style="display:block;width:160px;height:160px;max-width:100%;background:#f4f4f4;border:1px solid ${T.border};"></td></tr><tr><td>${keyValues([['Coupon', `Partner offer ${index}`], ['Code', `EVEENTY-${index}A9X`, true], ['Quantity', '1', true], ['Valid', 'Sep 27–Dec 31, 2026'], ['Description', description]])}</td></tr></table>`);
}

function renderCoupons({ partner, variant, longContent }) {
  const map = variant !== 'withoutMap';
  const title = partner ? 'New partner coupon purchase' : 'Your partner coupons';
  const intro = partner
    ? `${SAMPLE.person} purchased coupons from Harbour Bistro. Keep this notice for your records.`
    : `Hello ${SAMPLE.person}, we received your coupon purchase from Harbour Bistro. Keep a copy of each coupon.`;
  const rows = [
    sectionTitle({ title, dir: 'ltr' }),
    textBlock(esc(intro)),
    couponCard(1, longContent),
    couponCard(2, false),
    map ? `<tr><td align="center" style="padding:0 0 20px;">${primaryCtaYellow({ href: fixtureUrl('partner-map'), label: 'View partner map' })}</td></tr>` : '',
    card(keyValues([
      ['Purchase date', SAMPLE.date], ['Subtotal', 'CA$40.00', true], ['Tax', 'CA$5.20', true],
      ...(partner ? [] : [['Processing fees', 'CA$2.00', true], ['Processing fee tax', 'CA$0.26', true]]),
      ['Coupon total', partner ? 'CA$45.20' : 'CA$47.46', true], ['Payment status', 'COMPLETED'],
    ]), { background: T.headerBg }),
  ].join('');
  const footerEmail = partner ? 'partner@example.com' : SAMPLE.email;
  return shell({ title, preheader: title, rows, email: footerEmail });
}

function renderBadContent({ longContent }) {
  const data = longContent ? `{"ticketType":"VIP Balcony","description":"${'Flagged sample content '.repeat(18).trim()}","price":12500}` : '{"ticketType":"VIP Balcony","description":"Synthetic flagged content sample","price":12500}';
  const rows = [
    sectionTitle({ title: 'Content moderation alert', dir: 'ltr' }),
    statusAlert({ kind: 'warning', title: 'Potentially inappropriate content detected', bodyHtml: 'Automated moderation blocked an attempted content change. Review the synthetic request details below.', dir: 'ltr' }),
    card(keyValues([['Requested at', 'September 27, 2026 · 2:32 PM'], ['Festival', SAMPLE.festival], ['User', SAMPLE.person], ['User email', SAMPLE.email, true], ['Action', 'CREATE TICKET TYPE'], ['Response', 'Content requires review.']])),
    card(`<div style="font-family:Consolas,'Courier New',monospace;font-size:13px;line-height:1.55;color:${T.text};white-space:pre-wrap;word-break:break-word;">${esc(data)}</div>`, { background: '#f8f8f8' }),
  ].join('');
  return shell({ title: 'Bad content alert', preheader: 'Content moderation alert', rows, email: 'admin@example.com' });
}

function renderBookDemo({ longContent }) {
  const message = longContent ? `We need help planning a multi-day conference. ${'Please include guidance for registration, sponsor inventory, reporting, and attendee communications. '.repeat(5)}` : 'We need help planning a multi-day conference and managing attendee registration.';
  const rows = [
    sectionTitle({ title: 'New demo booking request', dir: 'ltr' }),
    statusAlert({ kind: 'success', title: 'Demo scheduled', bodyHtml: 'A prospective customer booked a demo. Follow up at the scheduled time.', dir: 'ltr' }),
    card(keyValues([['Full name', SAMPLE.person], ['Email', SAMPLE.email, true], ['Phone', SAMPLE.phone, true], ['Business', SAMPLE.business], ['Needs help with', 'Event registration and operations'], ['Meeting from', 'Oct 2, 2026 · 10:00 AM ET'], ['Meeting to', 'Oct 2, 2026 · 10:30 AM ET']])),
    card(`<div style="font-family:${T.fontStack};font-size:14px;line-height:1.6;color:${T.text};"><strong style="color:${T.strong};">Message</strong><br>${esc(message)}</div>`),
    `<tr><td align="center" style="padding:0 0 12px;">${primaryCtaYellow({ href: fixtureUrl('demo-meeting'), label: 'Open Google Meet' })}</td></tr>`,
    `<tr><td align="center" style="padding:0 0 24px;"><a href="${fixtureUrl('demo-calendar')}" style="font-family:${T.fontStack};font-size:15px;line-height:1.4;color:${T.text};text-decoration:underline;">Open calendar event</a></td></tr>`,
  ].join('');
  return shell({ title: 'Book demo request', preheader: 'New demo booking request', rows, email: 'admin@example.com' });
}

function renderExtraService({ variant, longContent }) {
  const rows = [
    sectionTitle({ title: 'New extra service request', dir: 'ltr' }),
    textBlock('An organizer submitted a request for additional Eveenty services.'),
    card(keyValues([
      ['Organizer', SAMPLE.person], ['Organizer email', SAMPLE.email, true], ['Organizer phone', SAMPLE.phone, true],
      ...(variant === 'withoutBusinessName' ? [] : [['Business name', SAMPLE.business]]),
      ['Request email', 'operations@example.com', true], ['Request phone', '+1 416 555 0128', true],
      ['Requested services', 'On-site check-in, badge printing, attendee support'],
    ])),
    card(`<div style="font-family:${T.fontStack};font-size:14px;line-height:1.6;color:${T.text};"><strong style="color:${T.strong};">Special request</strong><br>${esc(longContent ? `Please provide a detailed staffing proposal. ${'The organizer expects multiple entrances and staggered arrival windows. '.repeat(5)}` : 'Please provide an on-site staffing proposal for the main entrance.')}</div>`),
  ].join('');
  return shell({ title: 'Extra service request', preheader: 'New extra service request', rows, email: 'admin@example.com' });
}

export function renderFinal7Email(emailId, options = {}) {
  const locale = options.locale || 'en';
  const variant = options.variant || 'default';
  const longContent = !!options.longContent;
  switch (emailId) {
    case 'marketing_package_sale': return renderMarketingPackage({ locale, variant, longContent });
    case 'festival_payout': return renderPayout({ variant, longContent });
    case 'partner_coupons': return renderCoupons({ partner: false, variant, longContent });
    case 'partner_coupons_partner': return renderCoupons({ partner: true, variant, longContent });
    case 'bad_content_alert': return renderBadContent({ longContent });
    case 'book_demo_admin': return renderBookDemo({ longContent });
    case 'extra_service_request': return renderExtraService({ variant, longContent });
    default: throw new Error(`Unknown final-7 email id: ${emailId}`);
  }
}
