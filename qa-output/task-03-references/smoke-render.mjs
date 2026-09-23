import { renderEmail } from '../../shared/render-emails.js';

const cases = [
  ['activate_email', 'en', 'default'],
  ['festival_ticket_sale', 'en', 'buyerUser'],
  ['festival_ticket_sale', 'fr', 'buyerUser'],
  ['festival_ticket_sale', 'ar', 'guestUser'],
  ['dispute_notification', 'en', 'organizer'],
  ['dispute_notification', 'ar', 'organizer'],
  ['dispute_notification', 'en', 'admin'],
  ['dispute_notification', 'en', 'withPaymentLink'],
  ['festival_marketing_email_target', 'en', 'default'],
];

for (const [id, locale, variant] of cases) {
  const html = renderEmail(id, { locale, variant });
  const logo160 = html.includes('width="160"');
  const visiblePre = html.includes('Preheader:');
  const rtl = html.includes('dir="rtl"');
  console.log(
    JSON.stringify({
      id,
      locale,
      variant,
      len: html.length,
      logo160,
      visiblePre,
      rtl,
    })
  );
}
