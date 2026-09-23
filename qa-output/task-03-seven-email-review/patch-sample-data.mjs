/**
 * Patch sample-data.js: add FR/ES donation + regApproval from YAML extract,
 * expand EMAIL_IDS locales, fix marketing label.
 */
import fs from 'fs';

const yaml = JSON.parse(
  fs.readFileSync(
    'D:/last/eveenty-email-preview/qa-output/task-03-seven-email-review/donation-reg-yaml.json',
    'utf8'
  )
);

function donationFrom(lang) {
  const d = yaml.donation[lang];
  const pre = {
    en: 'Your donation payment receipt for Summer Music Festival 2026',
    fr: 'Votre reçu de paiement de don pour Summer Music Festival 2026',
    es: 'Su recibo de pago de donación para Summer Music Festival 2026',
    ar: 'إيصال دفع التبرع لـ Summer Music Festival 2026',
    fa: 'رسید پرداخت کمک مالی برای Summer Music Festival 2026',
  };
  return {
    title: d.DonationEmailTitle,
    preheader: pre[lang],
    notTax: d.DonationEmailNotTaxReceiptNote,
    thankYouPrefix: d.DonationEmailThankYouPrefix,
    thankYouSuffix: d.DonationEmailThankYouSuffix,
    donatedTo: d.DonationEmailDonatedTo,
    clientName: d.DonationEmailClientName,
    clientAddress: d.DonationEmailClientAddress,
    clientPhone: d.DonationEmailClientPhone,
    clientEmail: d.DonationEmailClientEmail,
    invoiceId: d.DonationEmailInvoiceID,
    date: d.DonationEmailDate,
  };
}

function regFrom(lang) {
  const r = yaml.reg[lang];
  const footerTag = {
    en: 'Make your event  ·  Eveenty',
    fr: 'Créez votre événement  ·  Eveenty',
    es: 'Haz tu evento  ·  Eveenty',
    ar: 'اصنع فعاليتك  ·  إيفينتي',
    fa: 'رویداد خود را بسازید  ·  Eveenty',
  };
  const copyright = {
    en: '© Eveenty. All rights reserved.',
    fr: '© Eveenty. Tous droits réservés.',
    es: '© Eveenty. Todos los derechos reservados.',
    ar: '© إيفينتي. جميع الحقوق محفوظة.',
    fa: '© Eveenty. تمامی حقوق محفوظ است.',
  };
  const contactShort = {
    en: 'Contact Us',
    fr: 'Contactez-nous',
    es: 'Contáctenos',
    ar: 'تواصل معنا',
    fa: 'تماس با ما',
  };
  return {
    title:
      lang === 'en'
        ? 'Ticket registration approved'
        : lang === 'fr'
          ? 'Inscription de billet approuvée'
          : lang === 'es'
            ? 'Inscripción de entrada aprobada'
            : lang === 'ar'
              ? 'تمت الموافقة على التسجيل'
              : 'ثبت‌نام بلیت تأیید شد',
    preheader: r.FestivalTicketRegistrationAlertApprovalUser,
    alert: r.FestivalTicketRegistrationAlertApprovalUser,
    greetingTemplate: r.FestivalTicketRegistrationGreetingUserApprovalWithDeadline,
    summarySubtitle: r.FestivalTicketRegistrationSummarySubtitle,
    completeOrder: r.FestivalTicketRegistrationCompleteOrderButton,
    summaryTitle: r.FestivalTicketRegistrationSummaryTitle,
    buyerTitle: r.FestivalTicketRegistrationBuyerInfoTitle,
    ticketsTitle: r.FestivalTicketRegistrationTicketsTitle,
    ticketsSubtitle: r.FestivalTicketRegistrationTicketsSubtitle,
    eventTitle: r.FestivalTicketRegistrationEventDetailsTitle,
    eventSubtitle: r.FestivalTicketRegistrationEventDetailsSubtitle,
    viewMap: r.FestivalTicketRegistrationLabelViewMap,
    footerTag: footerTag[lang],
    contactUs: contactShort[lang],
    autoNote: r.FestivalTicketRegistrationAutomatedNotice,
    help: `${r.FestivalTicketRegistrationContactUs} info@eveenty.com`,
    copyright: copyright[lang],
  };
}

function serializeDonation(obj) {
  // thankYou as function using prefix/suffix from YAML
  return `{
      title: ${JSON.stringify(obj.title)},
      preheader: ${JSON.stringify(obj.preheader)},
      notTax: ${JSON.stringify(obj.notTax)},
      donatedTo: ${JSON.stringify(obj.donatedTo)},
      thankYou: (name, fest) => \`${'${'}${JSON.stringify(obj.thankYouPrefix).slice(1, -1)} \${name} ${JSON.stringify(obj.thankYouSuffix).slice(1, -1)} \${fest}\`},
      clientName: ${JSON.stringify(obj.clientName)},
      clientAddress: ${JSON.stringify(obj.clientAddress)},
      clientPhone: ${JSON.stringify(obj.clientPhone)},
      clientEmail: ${JSON.stringify(obj.clientEmail)},
      invoiceId: ${JSON.stringify(obj.invoiceId)},
      date: ${JSON.stringify(obj.date)},
    }`;
}

function serializeReg(obj) {
  // Convert {{.FestivalName}} / {{.PaymentDeadline}} template to JS function
  const g = obj.greetingTemplate
    .replace(/\{\{\.FestivalName\}\}/g, '${fest}')
    .replace(/\{\{\.PaymentDeadline\}\}/g, '${deadline}');
  return `{
      title: ${JSON.stringify(obj.title)},
      preheader: ${JSON.stringify(obj.preheader)},
      alert: ${JSON.stringify(obj.alert)},
      greeting: (fest, deadline) => \`${g.replace(/`/g, '\\`')}\`,
      summarySubtitle: ${JSON.stringify(obj.summarySubtitle)},
      completeOrder: ${JSON.stringify(obj.completeOrder)},
      summaryTitle: ${JSON.stringify(obj.summaryTitle)},
      buyerTitle: ${JSON.stringify(obj.buyerTitle)},
      ticketsTitle: ${JSON.stringify(obj.ticketsTitle)},
      ticketsSubtitle: ${JSON.stringify(obj.ticketsSubtitle)},
      eventTitle: ${JSON.stringify(obj.eventTitle)},
      eventSubtitle: ${JSON.stringify(obj.eventSubtitle)},
      viewMap: ${JSON.stringify(obj.viewMap)},
      footerTag: ${JSON.stringify(obj.footerTag)},
      contactUs: ${JSON.stringify(obj.contactUs)},
      autoNote: ${JSON.stringify(obj.autoNote)},
      help: ${JSON.stringify(obj.help)},
      copyright: ${JSON.stringify(obj.copyright)},
    }`;
}

// Fix the thankYou serialization properly
function serializeDonationFixed(obj) {
  const prefix = obj.thankYouPrefix;
  const suffix = obj.thankYouSuffix;
  return `{
      title: ${JSON.stringify(obj.title)},
      preheader: ${JSON.stringify(obj.preheader)},
      notTax: ${JSON.stringify(obj.notTax)},
      donatedTo: ${JSON.stringify(obj.donatedTo)},
      thankYou: (name, fest) => ${JSON.stringify(prefix)} + ' ' + name + ' ' + ${JSON.stringify(suffix)} + ' ' + fest,
      clientName: ${JSON.stringify(obj.clientName)},
      clientAddress: ${JSON.stringify(obj.clientAddress)},
      clientPhone: ${JSON.stringify(obj.clientPhone)},
      clientEmail: ${JSON.stringify(obj.clientEmail)},
      invoiceId: ${JSON.stringify(obj.invoiceId)},
      date: ${JSON.stringify(obj.date)},
    }`;
}

let src = fs.readFileSync('D:/last/eveenty-email-preview/shared/sample-data.js', 'utf8');

// Replace fr donation: null
src = src.replace(
  /(fr: \{[\s\S]*?activate: \{[\s\S]*?\},)\s*donation: null,/,
  `$1\n    donation: ${serializeDonationFixed(donationFrom('fr'))},`
);

// Replace es donation: null
src = src.replace(
  /(es: \{[\s\S]*?activate: \{[\s\S]*?\},)\s*donation: null,/,
  `$1\n    donation: ${serializeDonationFixed(donationFrom('es'))},`
);

// Replace fr regApproval: null
src = src.replace(
  /(fr: \{[\s\S]*?dispute: \{[\s\S]*?\},)\s*regApproval: null,/,
  `$1\n    regApproval: ${serializeReg(regFrom('fr'))},`
);

// Replace es regApproval: null
src = src.replace(
  /(es: \{[\s\S]*?dispute: \{[\s\S]*?\},)\s*regApproval: null,/,
  `$1\n    regApproval: ${serializeReg(regFrom('es'))},`
);

// Add donatedTo to en/ar/fa donation objects if missing
for (const lang of ['en', 'ar', 'fa']) {
  const d = donationFrom(lang);
  const re = new RegExp(
    `(${lang}: \\{[\\s\\S]*?donation: \\{[\\s\\S]*?notTax: [^\\n]+\\n)`,
    'm'
  );
  if (src.includes(`donatedTo:`) && lang === 'en') {
    // may already have after first patch attempt — skip careful
  }
  if (!new RegExp(`${lang}: \\{[\\s\\S]*?donation: \\{[\\s\\S]*?donatedTo:`).test(src)) {
    src = src.replace(re, `$1      donatedTo: ${JSON.stringify(d.donatedTo)},\n`);
  }
}

// EMAIL_IDS updates
src = src.replace(
  /id: 'festival_donation',\s*label: 'Financial \/ Receipt — festival_donation',\s*master: 'COMMERCE',\s*figma: '21:2',\s*locales: \['en', 'ar', 'fa'\],/,
  `id: 'festival_donation',
    label: 'Financial / Receipt — festival_donation',
    master: 'COMMERCE',
    figma: '21:2',
    locales: ['en', 'fr', 'es', 'ar', 'fa'],`
);

src = src.replace(
  /id: 'festival_ticket_registration_approval',\s*label: 'Workflow \/ Status — registration_approval',\s*master: 'COMMERCE \/ Ticket-Pass',\s*figma: '48:45',\s*locales: \['en', 'ar', 'fa'\],/,
  `id: 'festival_ticket_registration_approval',
    label: 'Workflow / Status — registration_approval',
    master: 'COMMERCE / Ticket-Pass',
    figma: '48:45',
    locales: ['en', 'fr', 'es', 'ar', 'fa'],`
);

src = src.replace(
  /label: 'Campaign — festival_marketing_email_target'/,
  `label: 'Campaign / Announcement — festival_marketing_email_target'`
);

fs.writeFileSync('D:/last/eveenty-email-preview/shared/sample-data.js', src, 'utf8');
console.log('patched sample-data.js');

// Verify parse
await import('D:/last/eveenty-email-preview/shared/sample-data.js').then((m) => {
  console.log('EMAIL_IDS', m.EMAIL_IDS.map((e) => `${e.id}:${e.locales.join(',')}`).join(' | '));
  console.log('fr donation', !!m.LOCALES.fr.donation, m.LOCALES.fr.donation?.title);
  console.log('es reg', !!m.LOCALES.es.regApproval, m.LOCALES.es.regApproval?.completeOrder);
  console.log('en donatedTo', m.LOCALES.en.donation?.donatedTo);
});
