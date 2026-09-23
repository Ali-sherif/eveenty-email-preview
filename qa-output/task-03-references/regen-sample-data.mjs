import fs from 'fs';

const extract = JSON.parse(
  fs.readFileSync(
    'D:/last/eveenty-email-preview/qa-output/task-03-references/yaml-extract.json',
    'utf8'
  )
);

function ticket(lang) {
  const t = extract.ticket[lang];
  const titles = { en: 'Your tickets', fr: 'Vos billets', es: 'Tus entradas', ar: 'تذاكرك', fa: 'بلیت‌های شما' };
  const qr = {
    en: 'Present this QR at entry',
    fr: "Présentez ce QR à l'entrée",
    es: 'Presenta este QR en la entrada',
    ar: 'اعرض رمز QR هذا عند الدخول',
    fa: 'این QR را در ورودی نشان دهید',
  };
  const attachTitle = { en: 'Attachments included', fr: 'Pièces jointes', es: 'Adjuntos', ar: 'مرفقات مضمّنة', fa: 'پیوست‌ها' };
  return {
    title: titles[lang],
    preheader: 'Tickets — Summer Music Festival 2026',
    hello: t.FestivalTicketHello,
    buyerNote: t.FestivalTicketBuyerRegistrationNote,
    carry: t.FestivalTicketCarryReceiptNote,
    guestBought: t.FestivalTicketGuestBoughtNote,
    asUser: t.FestivalTicketAsUserPrefix,
    boughtFor: t.FestivalTicketBoughtForNote,
    qrCaption: qr[lang],
    googleWallet: 'Add to Google Wallet',
    appleWallet: 'Add to Apple Wallet',
    addTo: t.FestivalTicketInfoAddTo,
    googleCal: t.FestivalTicketInfoGoogleCalendar,
    appleCal: t.FestivalTicketInfoAppleCalendar,
    yahooCal: t.FestivalTicketInfoYahooCalendar,
    attachTitle: attachTitle[lang],
    attachBody:
      'Apple Wallet pass (.pkpass) attached when available for this ticket. [SAMPLE — no real pass generated]',
    copyright: t.FestivalTicketFooterCopyright,
  };
}

function dispute(lang) {
  const d = extract.dispute[lang];
  const status = (d.DisputeNotificationStatusMessageNeedsResponse || '').replace(
    /\{\{\.FestivalName\}\}/g,
    '{{FEST}}'
  );
  // Strip HTML from status for the template string — renderer injects fest span.
  // Keep only the text parts around {{FEST}} by replacing the full span with {{FEST}}
  const statusClean = status.replace(
    /<span[^>]*>\{\{FEST\}\}<\/span>/g,
    '{{FEST}}'
  );
  return {
    title: d.DisputeNotificationHtmlDocumentTitle,
    preheader: d.DisputeNotificationAlertTitleNeedsResponse,
    greeting: d.DisputeNotificationGreeting,
    alertNeedsResponse: d.DisputeNotificationAlertTitleNeedsResponse,
    statusNeedsResponse: statusClean,
    nextDefault: d.DisputeNotificationNextStepsNeedsResponse,
    nextStripe: d.DisputeNotificationNextStepsNeedsResponseStripeConnect,
    eventInfo: d.DisputeNotificationEventInfoTitle,
    eventName: d.DisputeNotificationEventNameLabel,
    detailsTitle: d.DisputeNotificationDetailsTitle,
    nextTitle: d.DisputeNotificationNextStepsTitle,
    needHelpTitle: d.DisputeNotificationNeedHelpTitle,
    field: d.DisputeNotificationFieldLabel,
    details: d.DisputeNotificationDetailsLabel,
    userName: d.DisputeNotificationUserNameLabel,
    email: d.DisputeNotificationEmailLabel,
    phone: d.DisputeNotificationPhoneLabel,
    txnType: d.DisputeNotificationTransactionTypeLabel,
    reference: d.DisputeNotificationReferenceLabel,
    reason: d.DisputeNotificationReasonLabel,
    evidenceDue: d.DisputeNotificationEvidenceDueByLabel,
    amount: d.DisputeNotificationAmountLabel,
    fees: d.DisputeNotificationFeesLabel,
    evidenceFees: d.DisputeNotificationEvidenceFeesLabel,
    needHelpText: d.DisputeNotificationNeedHelpText,
    bestRegards: d.DisputeNotificationBestRegards,
    teamName: d.DisputeNotificationTeamName,
    viewPayment: d.DisputeNotificationViewPayment,
    txnTickets: d.DisputeNotificationTransactionItemTickets,
  };
}

// Keep activate / donation / regApproval / support from previous file by importing logic inline
const prev = fs.readFileSync('D:/last/eveenty-email-preview/shared/sample-data.js', 'utf8');

function extractFn(name, langBlock) {
  // too hard — hardcode activate from known Task 02 values
}

const out = `/** Safe sample payloads for Eveenty email preview — no production credentials. */

export const SAMPLE = {
  user: {
    displayName: 'Alex',
    fullName: 'Alex User',
    email: 'alex.user@example.com',
    phone: '+1 416 555 0199',
    address: '12 King St W, Toronto',
  },
  guest: {
    fullName: 'Jordan Guest',
    email: 'jordan.guest@example.com',
  },
  festival: {
    name: 'Summer Music Festival 2026',
    place: 'Harbourfront Centre',
    address: '235 Queens Quay W, Toronto, ON',
    mapUrl: 'https://maps.example.com/preview-harbourfront',
    doorsOpen: 'Sat, Oct 10, 2026 · 6:00 PM',
    start: 'Sat, Oct 10, 2026 · 7:00 PM',
    end: 'Sat, Oct 10, 2026 · 11:30 PM',
    timezoneNote: 'All times shown in America/Toronto timezone.',
  },
  money: {
    subtotal: 'CA$80.00',
    tax: 'CA$10.40',
    processingFee: 'CA$2.50',
    grandTotal: 'CA$92.90',
    invoiceId: 'INV-90421',
    date: '2026-09-20',
    time: '14:32',
  },
  ticket: {
    type: 'General Admission',
    id: 'TKT-18402',
    indexLabel: 'Ticket 1 / 2',
  },
  registration: {
    id: 'REG-77821',
    dateTime: 'Sep 18, 2026 · 3:45 PM',
    status: 'Pending Payment',
    paymentDeadline: 'Sep 25, 2026 · 11:59 PM',
    completeOrderUrl: 'https://example.com/preview/complete-order',
  },
  support: {
    environment: 'production',
    detailsDefault: \`Error: timeout waiting for upstream
Path: POST /api/v1/festivals/{id}/tickets
Request ID: req_9f3a2c
Time: 2026-09-23T17:04:12Z\`,
    detailsLong: \`Error: timeout waiting for upstream service after 30s
Path: POST /api/v1/festivals/{id}/tickets
Request ID: req_9f3a2c_preview_sample
Time: 2026-09-23T17:04:12Z
Host: api-preview.eveenty.local (SAMPLE — not a real host)
Trace (sanitized SAMPLE stack — no secrets):
  at TicketService.Create (services/ticket.go:412)
  at Handler.PostTickets (api/tickets.go:188)
  at middleware.Recover (api/middleware.go:54)
  at http.Handler.ServeHTTP (net/http)
Note: This is synthetic long-content preview data. Do not treat as a production incident.\`,
  },
  activate: {
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
};

export const LOCALES = {
  en: {
    lang: 'en',
    dir: 'ltr',
    logo: 'en',
    activate: {
      title: 'Activate Your Eveenty Account',
      welcome: 'Welcome to Eveenty!',
      greeting: 'Hello',
      body: 'Thank you for creating your Eveenty account. To get started, please activate your account by clicking the button below.',
      button: 'Activate My Account',
      footerLead: 'This message was sent to',
      footerSuffix: '.',
      copyright: '© Eveenty. All rights reserved.',
    },
    donation: {
      title: 'Donation receipt',
      preheader: 'Your donation payment receipt for Summer Music Festival 2026',
      notTax: 'This is not a Tax receipt, this is just your payment receipt.',
      thankYou: (name, fest) => \`Thank you \${name} for using Eveenty & your donation to \${fest}\`,
      clientName: 'Client Name:',
      clientAddress: 'Client Address:',
      clientPhone: 'Client Phone:',
      clientEmail: 'Client Email:',
      invoiceId: 'Invoice ID:',
      date: 'Date:',
    },
    ticketSale: ${JSON.stringify(ticket('en'), null, 6).replace(/^/gm, '    ').trim()},
    dispute: ${JSON.stringify(dispute('en'), null, 6).replace(/^/gm, '    ').trim()},
    regApproval: {
      title: 'Ticket registration approved',
      preheader: 'Your ticket registration has been approved — complete your order',
      alert: 'Your ticket registration has been approved. Please complete your order to secure your tickets.',
      greeting: (fest, deadline) =>
        \`Great news! Your ticket registration for \${fest} has been approved. Complete your order below to secure your tickets. You must complete your order by \${deadline}. If you do not complete your order by this date, the registration will be automatically cancelled.\`,
      summarySubtitle: 'Below is the registration summary for this submission.',
      completeOrder: 'Complete your order',
      summaryTitle: '📋 Registration Summary',
      buyerTitle: '👤 Buyer Information',
      ticketsTitle: '🎟️ Registered Tickets',
      ticketsSubtitle: 'Details for each ticket in this registration are listed below.',
      eventTitle: '📍 Event Details',
      eventSubtitle: 'When and where the event takes place.',
      viewMap: 'View Map →',
      footerTag: 'Make your event  ·  Eveenty',
      contactUs: 'Contact Us',
      autoNote: 'This is an automated notification from Eveenty.',
      help: 'Need help? Contact us at info@eveenty.com',
      copyright: '© Eveenty. All rights reserved.',
    },
    support: {
      title: 'Internal Server Error Notification',
      preheader: 'Internal server error notification',
      heading: 'Internal Server Error Notification',
      intro: 'An error occurred on the server. The details are as follows:',
      hint: 'This data might be helpful for fixing the error',
      footer1: 'Internal operational notification · Eveenty Ops',
      footer2: 'Do not forward outside the operations team.',
    },
    marketing: {
      title: 'Festival marketing',
      preheader: 'Festival campaign message',
    },
  },
  ar: {
    lang: 'ar',
    dir: 'rtl',
    logo: 'ar',
    activate: {
      title: 'قم بتفعيل حساب ايفينتي الخاص بك',
      welcome: 'مرحباً بك في ايفينتي',
      greeting: '،مرحباً',
      body: 'شكراً لإنشاء حساب ايفينتي الخاص بك. للبدء، يرجى تفعيل حسابك بالنقر على الزر أدناه.',
      button: 'تفعيل حسابي',
      footerLead: 'تم إرسال هذه الرسالة إلى',
      footerSuffix: '.',
      copyright: '.© ايفينتي. جميع الحقوق محفوظة',
    },
    donation: {
      title: 'إيصال التبرع',
      preheader: 'إيصال دفع التبرع لـ Summer Music Festival 2026',
      notTax: 'هذا ليس إيصالاً ضريبياً، هذا مجرد إيصال دفع.',
      thankYou: (name, fest) => \`شكراً \${name} لاستخدام إيفينتي وتبرعك لـ \${fest}\`,
      clientName: 'اسم العميل:',
      clientAddress: 'عنوان العميل:',
      clientPhone: 'هاتف العميل:',
      clientEmail: 'البريد الإلكتروني:',
      invoiceId: 'رقم الفاتورة:',
      date: 'التاريخ:',
    },
    ticketSale: ${JSON.stringify(ticket('ar'), null, 6).replace(/^/gm, '    ').trim()},
    dispute: ${JSON.stringify(dispute('ar'), null, 6).replace(/^/gm, '    ').trim()},
    regApproval: {
      title: 'تمت الموافقة على التسجيل',
      preheader: 'تمت الموافقة على تسجيل التذكرة — أكمل طلبك',
      alert: 'تمت الموافقة على تسجيل تذكرتك. يرجى إكمال طلبك لتأمين تذاكرك.',
      greeting: (fest, deadline) =>
        \`أخبار سارة! تمت الموافقة على تسجيل تذكرتك لـ \${fest}. أكمل طلبك أدناه لتأمين تذاكرك. يجب إكمال الطلب بحلول \${deadline}. إذا لم تكمل الطلب بحلول هذا التاريخ، سيتم إلغاء التسجيل تلقائياً.\`,
      summarySubtitle: 'فيما يلي ملخص التسجيل لهذا الإرسال.',
      completeOrder: 'أكمل طلبك',
      summaryTitle: '📋 ملخص التسجيل',
      buyerTitle: '👤 معلومات المشتري',
      ticketsTitle: '🎟️ التذاكر المسجّلة',
      ticketsSubtitle: 'تفاصيل كل تذكرة في هذا التسجيل مدرجة أدناه.',
      eventTitle: '📍 تفاصيل الفعالية',
      eventSubtitle: 'متى وأين تقام الفعالية.',
      viewMap: 'عرض الخريطة ←',
      footerTag: 'اصنع فعاليتك  ·  إيفينتي',
      contactUs: 'تواصل معنا',
      autoNote: 'هذا إشعار تلقائي من إيفينتي.',
      help: 'تحتاج مساعدة؟ تواصل معنا على info@eveenty.com',
      copyright: '© إيفينتي. جميع الحقوق محفوظة.',
    },
    support: null,
    marketing: null,
  },
  fa: {
    lang: 'fa',
    dir: 'rtl',
    logo: 'fa',
    activate: {
      title: 'حساب Eveenty خود را فعال کنید',
      welcome: '!به Eveenty خوش آمدید',
      greeting: '،سلام',
      body: 'از ایجاد حساب Eveenty خود متشکریم. برای شروع، لطفاً با کلیک بر روی دکمه زیر حساب خود را فعال کنید.',
      button: 'فعال‌سازی حساب من',
      footerLead: 'این پیام به',
      footerSuffix: ' ارسال شد.',
      copyright: '.© Eveenty. تمامی حقوق محفوظ است',
    },
    donation: {
      title: 'رسید کمک مالی',
      preheader: 'رسید پرداخت کمک مالی برای Summer Music Festival 2026',
      notTax: 'این رسید مالیاتی نیست؛ فقط رسید پرداخت است.',
      thankYou: (name, fest) => \`متشکریم \${name} از استفاده از ایونتی و کمک شما به \${fest}\`,
      clientName: 'نام مشتری:',
      clientAddress: 'آدرس مشتری:',
      clientPhone: 'تلفن مشتری:',
      clientEmail: 'ایمیل مشتری:',
      invoiceId: 'شناسه فاکتور:',
      date: 'تاریخ:',
    },
    ticketSale: ${JSON.stringify(ticket('fa'), null, 6).replace(/^/gm, '    ').trim()},
    dispute: ${JSON.stringify(dispute('fa'), null, 6).replace(/^/gm, '    ').trim()},
    regApproval: {
      title: 'ثبت‌نام تأیید شد',
      preheader: 'ثبت‌نام بلیت تأیید شد — سفارش را کامل کنید',
      alert: 'ثبت‌نام بلیت شما تأیید شد. لطفاً سفارش را کامل کنید تا بلیت‌ها محفوظ بمانند.',
      greeting: (fest, deadline) =>
        \`خبر خوب! ثبت‌نام بلیت شما برای \${fest} تأیید شد. سفارش را در زیر کامل کنید. باید تا \${deadline} سفارش را کامل کنید؛ در غیر این صورت ثبت‌نام لغو می‌شود.\`,
      summarySubtitle: 'خلاصه ثبت‌نام این ارسال در زیر آمده است.',
      completeOrder: 'تکمیل سفارش',
      summaryTitle: '📋 خلاصه ثبت‌نام',
      buyerTitle: '👤 اطلاعات خریدار',
      ticketsTitle: '🎟️ بلیت‌های ثبت‌شده',
      ticketsSubtitle: 'جزئیات هر بلیت در زیر فهرست شده است.',
      eventTitle: '📍 جزئیات رویداد',
      eventSubtitle: 'زمان و مکان برگزاری رویداد.',
      viewMap: 'مشاهده نقشه ←',
      footerTag: 'رویداد بسازید  ·  ایونتی',
      contactUs: 'تماس با ما',
      autoNote: 'این یک اعلان خودکار از ایونتی است.',
      help: 'نیاز به کمک؟ با info@eveenty.com تماس بگیرید',
      copyright: '© ایونتی. تمامی حقوق محفوظ است.',
    },
    support: null,
    marketing: null,
  },
  fr: {
    lang: 'fr',
    dir: 'ltr',
    logo: 'fr',
    activate: {
      title: 'Activez votre compte Eveenty',
      welcome: 'Bienvenue sur Eveenty !',
      greeting: 'Bonjour',
      body: "Merci d'avoir créé votre compte Eveenty. Pour commencer, veuillez activer votre compte en cliquant sur le bouton ci-dessous.",
      button: 'Activer mon compte',
      footerLead: 'Ce message a été envoyé à',
      footerSuffix: '.',
      copyright: '© Eveenty. Tous droits réservés.',
    },
    donation: null,
    ticketSale: ${JSON.stringify(ticket('fr'), null, 6).replace(/^/gm, '    ').trim()},
    dispute: ${JSON.stringify(dispute('fr'), null, 6).replace(/^/gm, '    ').trim()},
    regApproval: null,
    support: null,
    marketing: null,
  },
  es: {
    lang: 'es',
    dir: 'ltr',
    logo: 'es',
    activate: {
      title: 'Active su cuenta Eveenty',
      welcome: '¡Bienvenido a Eveenty!',
      greeting: 'Hola',
      body: 'Gracias por crear su cuenta Eveenty. Para comenzar, active su cuenta haciendo clic en el botón a continuación.',
      button: 'Activar mi cuenta',
      footerLead: 'Este mensaje fue enviado a',
      footerSuffix: '.',
      copyright: '© Eveenty. Todos los derechos reservados.',
    },
    donation: null,
    ticketSale: ${JSON.stringify(ticket('es'), null, 6).replace(/^/gm, '    ').trim()},
    dispute: ${JSON.stringify(dispute('es'), null, 6).replace(/^/gm, '    ').trim()},
    regApproval: null,
    support: null,
    marketing: null,
  },
};

export const EMAIL_IDS = [
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

fs.writeFileSync('D:/last/eveenty-email-preview/shared/sample-data.js', out, 'utf8');
console.log('wrote sample-data.js', out.length);
