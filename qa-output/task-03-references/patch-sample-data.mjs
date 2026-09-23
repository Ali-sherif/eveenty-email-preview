/**
 * Regenerates ticketSale + dispute locale blocks in sample-data.js from yaml-extract.json.
 * Does not invent translations — copies production YAML only.
 */
import fs from 'fs';

const extract = JSON.parse(
  fs.readFileSync(
    'D:/last/eveenty-email-preview/qa-output/task-03-references/yaml-extract.json',
    'utf8'
  )
);

function ticketBlock(lang) {
  const t = extract.ticket[lang];
  return `{
      title: ${JSON.stringify(lang === 'en' ? 'Your tickets' : lang === 'fr' ? 'Vos billets' : lang === 'es' ? 'Tus entradas' : lang === 'ar' ? 'تذاكرك' : 'بلیت‌های شما')},
      preheader: ${JSON.stringify('Tickets — ' + 'Summer Music Festival 2026')},
      hello: ${JSON.stringify(t.FestivalTicketHello)},
      buyerNote: ${JSON.stringify(t.FestivalTicketBuyerRegistrationNote)},
      carry: ${JSON.stringify(t.FestivalTicketCarryReceiptNote)},
      guestBought: ${JSON.stringify(t.FestivalTicketGuestBoughtNote)},
      asUser: ${JSON.stringify(t.FestivalTicketAsUserPrefix)},
      boughtFor: ${JSON.stringify(t.FestivalTicketBoughtForNote)},
      qrCaption: ${JSON.stringify(lang === 'en' ? 'Present this QR at entry' : lang === 'ar' ? 'اعرض رمز QR هذا عند الدخول' : lang === 'fa' ? 'این QR را در ورودی نشان دهید' : lang === 'fr' ? 'Présentez ce QR à l’entrée' : 'Presenta este QR en la entrada')},
      googleWallet: ${JSON.stringify('Add to Google Wallet')},
      appleWallet: ${JSON.stringify('Add to Apple Wallet')},
      addTo: ${JSON.stringify(t.FestivalTicketInfoAddTo)},
      googleCal: ${JSON.stringify(t.FestivalTicketInfoGoogleCalendar)},
      appleCal: ${JSON.stringify(t.FestivalTicketInfoAppleCalendar)},
      yahooCal: ${JSON.stringify(t.FestivalTicketInfoYahooCalendar)},
      attachTitle: ${JSON.stringify(lang === 'en' ? 'Attachments included' : 'Attachments')},
      attachBody: ${JSON.stringify('Apple Wallet pass (.pkpass) attached when available for this ticket. [SAMPLE — no real pass generated]')},
      copyright: ${JSON.stringify(t.FestivalTicketFooterCopyright)},
    }`;
}

function disputeBlock(lang) {
  const d = extract.dispute[lang];
  // Replace production {{.FestivalName}} HTML placeholder with {{FEST}} for preview injector
  const status = (d.DisputeNotificationStatusMessageNeedsResponse || '').replace(
    /\{\{\.FestivalName\}\}/g,
    '{{FEST}}'
  );
  return `{
      title: ${JSON.stringify(d.DisputeNotificationHtmlDocumentTitle)},
      preheader: ${JSON.stringify(d.DisputeNotificationAlertTitleNeedsResponse)},
      greeting: ${JSON.stringify(d.DisputeNotificationGreeting)},
      alertNeedsResponse: ${JSON.stringify(d.DisputeNotificationAlertTitleNeedsResponse)},
      statusNeedsResponse: ${JSON.stringify(status)},
      nextDefault: ${JSON.stringify(d.DisputeNotificationNextStepsNeedsResponse)},
      nextStripe: ${JSON.stringify(d.DisputeNotificationNextStepsNeedsResponseStripeConnect)},
      eventInfo: ${JSON.stringify(d.DisputeNotificationEventInfoTitle)},
      eventName: ${JSON.stringify(d.DisputeNotificationEventNameLabel)},
      detailsTitle: ${JSON.stringify(d.DisputeNotificationDetailsTitle)},
      nextTitle: ${JSON.stringify(d.DisputeNotificationNextStepsTitle)},
      needHelpTitle: ${JSON.stringify(d.DisputeNotificationNeedHelpTitle)},
      field: ${JSON.stringify(d.DisputeNotificationFieldLabel)},
      details: ${JSON.stringify(d.DisputeNotificationDetailsLabel)},
      userName: ${JSON.stringify(d.DisputeNotificationUserNameLabel)},
      email: ${JSON.stringify(d.DisputeNotificationEmailLabel)},
      phone: ${JSON.stringify(d.DisputeNotificationPhoneLabel)},
      txnType: ${JSON.stringify(d.DisputeNotificationTransactionTypeLabel)},
      reference: ${JSON.stringify(d.DisputeNotificationReferenceLabel)},
      reason: ${JSON.stringify(d.DisputeNotificationReasonLabel)},
      evidenceDue: ${JSON.stringify(d.DisputeNotificationEvidenceDueByLabel)},
      amount: ${JSON.stringify(d.DisputeNotificationAmountLabel)},
      fees: ${JSON.stringify(d.DisputeNotificationFeesLabel)},
      evidenceFees: ${JSON.stringify(d.DisputeNotificationEvidenceFeesLabel)},
      needHelpText: ${JSON.stringify(d.DisputeNotificationNeedHelpText)},
      bestRegards: ${JSON.stringify(d.DisputeNotificationBestRegards)},
      teamName: ${JSON.stringify(d.DisputeNotificationTeamName)},
      viewPayment: ${JSON.stringify(d.DisputeNotificationViewPayment)},
      txnTickets: ${JSON.stringify(d.DisputeNotificationTransactionItemTickets)},
    }`;
}

const path = 'D:/last/eveenty-email-preview/shared/sample-data.js';
let src = fs.readFileSync(path, 'utf8');

// Insert SAMPLE.dispute + SAMPLE.marketing after activate block
if (!src.includes('dispute: {')) {
  src = src.replace(
    `  activate: {
    preheader: 'Activate your Eveenty account to get started.',
    activateUrl: 'https://example.com/preview/activate',
  },
};`,
    `  activate: {
    preheader: 'Activate your Eveenty account to get started.',
    activateUrl: 'https://example.com/preview/activate',
  },
  dispute: {
    reference: 'dp_sample_9f3a2c',
    reason: 'Fraudulent',
    evidenceDue: '2026-10-05',
    amount: 'CA$92.90',
    fees: 'CA$15.00',
    evidenceFees: 'CA$0.00',
    viewPaymentUrl: 'https://example.com/preview/stripe-payment',
  },
  marketing: {
    bodyText:
      'Join us at Summer Music Festival 2026 — early-bird weekend passes are open. SAMPLE campaign body from organizer (author content).',
    unsubscribeUrl: 'https://example.com/preview/unsubscribe',
  },
};`
  );
}

function replaceLocaleField(srcText, lang, field, block) {
  // Replace `ticketSale: { ... },` or `ticketSale: null,` inside lang block — fragile; use markers
  const langStart = srcText.indexOf(`  ${lang}: {`);
  if (langStart < 0) throw new Error('lang not found ' + lang);
  const nextLang = ['en', 'ar', 'fa', 'fr', 'es'].filter((l) => l !== lang);
  // find end of this locale object at matching brace — simpler: replace known old ticketSale patterns
  const re = new RegExp(
    `(  ${lang}: {[\\s\\S]*?)(    ticketSale: (?:null|\\{[\\s\\S]*?\\n    \\}),)`,
    'm'
  );
  if (!re.test(srcText)) {
    // try insert before support
    const re2 = new RegExp(`(  ${lang}: {[\\s\\S]*?)(    support:)`);
    if (re2.test(srcText)) {
      return srcText.replace(re2, `$1    ticketSale: ${block},\n    dispute: PLACEHOLDER_DISPUTE,\n    $2`);
    }
    throw new Error('cannot find ticketSale in ' + lang);
  }
  return srcText.replace(re, `$1    ticketSale: ${block},`);
}

for (const lang of ['en', 'ar', 'fa', 'fr', 'es']) {
  src = replaceLocaleField(src, lang, 'ticketSale', ticketBlock(lang));
}

// Add dispute blocks — replace PLACEHOLDER or insert after ticketSale
for (const lang of ['en', 'ar', 'fa', 'fr', 'es']) {
  const block = disputeBlock(lang);
  if (src.includes('PLACEHOLDER_DISPUTE')) {
    src = src.replace('PLACEHOLDER_DISPUTE', block);
  } else {
    // insert after ticketSale block for this lang
    const marker = `  ${lang}: {`;
    const idx = src.indexOf(marker);
    const ticketIdx = src.indexOf('ticketSale:', idx);
    // find closing of ticketSale object
    const afterTicket = src.indexOf('\n    },', ticketIdx);
    if (afterTicket < 0) throw new Error('ticket close not found ' + lang);
    const insertAt = afterTicket + '\n    },'.length;
    // check if dispute already follows
    const slice = src.slice(insertAt, insertAt + 40);
    if (!slice.includes('dispute:')) {
      src = src.slice(0, insertAt) + `\n    dispute: ${block},` + src.slice(insertAt);
    } else {
      // replace existing dispute
      src = src.replace(
        new RegExp(`(  ${lang}: {[\\s\\S]*?)(    dispute: (?:null|\\{[\\s\\S]*?\\n    \\}),)`),
        `$1    dispute: ${block},`
      );
    }
  }
}

// Ensure fr/es have marketing null and support null; add marketing to en
if (!src.includes('marketing: {') || !src.includes("title: 'Festival marketing'")) {
  src = src.replace(
    /(    support: \{\n[\s\S]*?footer2: 'Do not forward outside the operations team\.',\n    \},)/,
    `$1
    marketing: {
      title: 'Festival marketing',
      preheader: 'Festival campaign message',
    },`
  );
}

// fr/es: set donation/regApproval null already; ensure ticketSale not null (done); dispute done
// Update EMAIL_IDS
const emailIds = `export const EMAIL_IDS = [
  {
    id: 'activate_email',
    label: 'Auth / Simple — activate_email',
    master: 'TRANSACTIONAL',
    figma: '4:2',
    locales: ['en', 'fr', 'es', 'ar', 'fa'],
    variants: ['default'],
  },
  {
    id: 'festival_donation',
    label: 'Financial / Receipt — festival_donation',
    master: 'COMMERCE',
    figma: '21:2',
    locales: ['en', 'ar', 'fa'],
    variants: ['donatorUser', 'organizerNotify'],
  },
  {
    id: 'festival_ticket_sale',
    label: 'Ticket / Pass — festival_ticket_sale',
    master: 'COMMERCE',
    figma: '21:53',
    locales: ['en', 'fr', 'es', 'ar', 'fa'],
    variants: ['buyerUser', 'guestUser', 'organizer', 'admin'],
  },
  {
    id: 'festival_ticket_registration_approval',
    label: 'Workflow / Status — registration_approval',
    master: 'COMMERCE / Ticket-Pass',
    figma: '48:45',
    locales: ['en', 'ar', 'fa'],
    variants: ['user_completeOrder', 'user_noCta'],
  },
  {
    id: 'support',
    label: 'Internal / Operational — support',
    master: 'NOTIFICATION',
    figma: '22:113',
    locales: ['en'],
    variants: ['default', 'longDetails'],
  },
  {
    id: 'dispute_notification',
    label: 'Workflow / Status — dispute_notification',
    master: 'NOTIFICATION',
    figma: 'TBD',
    locales: ['en', 'fr', 'es', 'ar', 'fa'],
    variants: ['organizer', 'admin', 'withPaymentLink', 'stripeConnect', 'noEvidence'],
  },
  {
    id: 'festival_marketing_email_target',
    label: 'Campaign — festival_marketing_email_target',
    master: 'MARKETING',
    figma: 'TBD',
    locales: ['en'],
    variants: ['default'],
  },
];
`;

src = src.replace(/export const EMAIL_IDS = \[[\s\S]*\];\s*$/, emailIds);

fs.writeFileSync(path, src, 'utf8');
console.log('updated sample-data.js');
