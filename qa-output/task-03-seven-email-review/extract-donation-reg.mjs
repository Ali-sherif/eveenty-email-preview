import fs from 'fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

function pick(path, keys) {
  const t = fs.readFileSync(path, 'utf8');
  const out = {};
  for (const k of keys) {
    const reDq = new RegExp(k + ':\\s*\\n\\s*other:\\s*"([^"]*)"');
    const reSq = new RegExp(k + ":\\s*\\n\\s*other:\\s*'([^']*)'");
    const m = t.match(reDq) || t.match(reSq);
    out[k] = m ? m[1] : null;
  }
  return out;
}

const donationKeys = [
  'DonationEmailTitle',
  'DonationEmailNotTaxReceiptNote',
  'DonationEmailThankYouPrefix',
  'DonationEmailThankYouSuffix',
  'DonationEmailDonatedTo',
  'DonationEmailClientName',
  'DonationEmailClientAddress',
  'DonationEmailClientPhone',
  'DonationEmailClientEmail',
  'DonationEmailInvoiceID',
  'DonationEmailDate',
];

const regKeys = [
  'FestivalTicketRegistrationAlertApprovalUser',
  'FestivalTicketRegistrationGreetingUserApprovalWithDeadline',
  'FestivalTicketRegistrationSummarySubtitle',
  'FestivalTicketRegistrationCompleteOrderButton',
  'FestivalTicketRegistrationSummaryTitle',
  'FestivalTicketRegistrationBuyerInfoTitle',
  'FestivalTicketRegistrationTicketsTitle',
  'FestivalTicketRegistrationTicketsSubtitle',
  'FestivalTicketRegistrationEventDetailsTitle',
  'FestivalTicketRegistrationEventDetailsSubtitle',
  'FestivalTicketRegistrationLabelViewMap',
  'FestivalTicketRegistrationAutomatedNotice',
  'FestivalTicketRegistrationContactUs',
];

const result = { donation: {}, reg: {} };
for (const lang of ['en', 'fr', 'es', 'ar', 'fa']) {
  const p = `D:/last/rescounts-backend/pkg/locales/translations/email/${lang}.yaml`;
  result.donation[lang] = pick(p, donationKeys);
  result.reg[lang] = pick(p, regKeys);
}

const out = join(root, 'donation-reg-yaml.json');
fs.writeFileSync(out, JSON.stringify(result, null, 2), 'utf8');
console.log('wrote', out);
for (const lang of ['fr', 'es']) {
  console.log(lang, 'donation title', result.donation[lang].DonationEmailTitle);
  console.log(lang, 'reg CTA', result.reg[lang].FestivalTicketRegistrationCompleteOrderButton);
}
