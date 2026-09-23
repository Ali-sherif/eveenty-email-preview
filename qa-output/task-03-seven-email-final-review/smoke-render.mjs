import { renderEmail } from '../../shared/render-emails.js';
import { EMAIL_IDS } from '../../shared/sample-data.js';

const defaults = {
  activate_email: { locale: 'en', variant: 'default' },
  festival_donation: { locale: 'en', variant: 'donatorUser' },
  festival_ticket_sale: { locale: 'en', variant: 'buyerUser' },
  festival_ticket_registration_approval: { locale: 'en', variant: 'user_completeOrder' },
  support: { locale: 'en', variant: 'default' },
  dispute_notification: { locale: 'en', variant: 'organizer' },
  festival_marketing_email_target: { locale: 'en', variant: 'default' },
};

console.log('Selector count:', EMAIL_IDS.length);
for (const e of EMAIL_IDS) {
  console.log('-', e.id, '|', e.label, '| locales:', e.locales.join(','));
}

for (const id of Object.keys(defaults)) {
  const html = renderEmail(id, defaults[id]);
  const logo =
    id === 'festival_marketing_email_target'
      ? html.includes('festival-logo')
      : html.includes('width="160"');
  const noPre = !html.includes('Preheader:');
  const header = /#fefdf4/i.test(html) || id === 'festival_marketing_email_target';
  let cta = true;
  if (id === 'festival_ticket_registration_approval' || id === 'activate_email') {
    cta = /#e9d023/i.test(html) && /#4d4c49/i.test(html);
  }
  if (id === 'dispute_notification') {
    const withCta = renderEmail(id, { locale: 'en', variant: 'withPaymentLink' });
    cta = /#e9d023/i.test(withCta);
  }
  console.log(
    id,
    'PASS=' + (logo && noPre && header && cta),
    { logo, noPre, header, cta, len: html.length }
  );
}

const frDon = renderEmail('festival_donation', { locale: 'fr', variant: 'donatorUser' });
const esReg = renderEmail('festival_ticket_registration_approval', {
  locale: 'es',
  variant: 'user_completeOrder',
});
const arDon = renderEmail('festival_donation', { locale: 'ar', variant: 'donatorUser' });
console.log('fr donation Merci', frDon.includes('Merci'), 'rtl', arDon.includes('dir="rtl"'));
console.log('es reg Completar', esReg.includes('Completar'), 'yellow', /#e9d023/i.test(esReg));
