import fs from 'fs';

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

const ticketKeys = [
  'FestivalTicketHello',
  'FestivalTicketBuyerRegistrationNote',
  'FestivalTicketCarryReceiptNote',
  'FestivalTicketGuestBoughtNote',
  'FestivalTicketAsUserPrefix',
  'FestivalTicketBoughtForNote',
  'FestivalTicketInfoAddTo',
  'FestivalTicketInfoGoogleCalendar',
  'FestivalTicketInfoAppleCalendar',
  'FestivalTicketInfoYahooCalendar',
  'FestivalTicketFooterCopyright',
];

const dKeys = [
  'DisputeNotificationHtmlDocumentTitle',
  'DisputeNotificationGreeting',
  'DisputeNotificationAlertTitleNeedsResponse',
  'DisputeNotificationStatusMessageNeedsResponse',
  'DisputeNotificationNextStepsNeedsResponse',
  'DisputeNotificationNextStepsNeedsResponseStripeConnect',
  'DisputeNotificationEventInfoTitle',
  'DisputeNotificationDetailsTitle',
  'DisputeNotificationNextStepsTitle',
  'DisputeNotificationNeedHelpTitle',
  'DisputeNotificationEventNameLabel',
  'DisputeNotificationFieldLabel',
  'DisputeNotificationDetailsLabel',
  'DisputeNotificationUserNameLabel',
  'DisputeNotificationEmailLabel',
  'DisputeNotificationPhoneLabel',
  'DisputeNotificationTransactionTypeLabel',
  'DisputeNotificationReferenceLabel',
  'DisputeNotificationReasonLabel',
  'DisputeNotificationEvidenceDueByLabel',
  'DisputeNotificationAmountLabel',
  'DisputeNotificationFeesLabel',
  'DisputeNotificationEvidenceFeesLabel',
  'DisputeNotificationNeedHelpText',
  'DisputeNotificationBestRegards',
  'DisputeNotificationTeamName',
  'DisputeNotificationViewPayment',
  'DisputeNotificationTransactionItemTickets',
];

const result = { ticket: {}, dispute: {} };
for (const lang of ['en', 'fr', 'es', 'ar', 'fa']) {
  result.ticket[lang] = pick(
    `D:/last/rescounts-backend/pkg/locales/translations/email/${lang}.yaml`,
    ticketKeys
  );
  result.dispute[lang] = pick(
    `D:/last/rescounts-backend/pkg/locales/translations/email/disputes/${lang}.yaml`,
    dKeys
  );
}
fs.writeFileSync(
  'D:/last/eveenty-email-preview/qa-output/task-03-references/yaml-extract.json',
  JSON.stringify(result, null, 2),
  'utf8'
);
console.log('wrote yaml-extract.json');
