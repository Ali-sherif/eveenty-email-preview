const FIVE = Object.freeze(['en', 'fr', 'es', 'ar', 'fa']);
const EN = Object.freeze(['en']);

function definition({ id, master, backendFamily, subfolder, locales, variants, variantLocales }) {
  return Object.freeze({
    id,
    label: `${master === 'COMMERCE' ? '02-Commerce' : '03-Notification'} / ${subfolder} — ${id} [FINAL 7]`,
    master,
    backendFamily,
    subfolder,
    designStatus: 'DESIGNED',
    reviewStatus: 'AWAITING OWNER REVIEW',
    figma: 'HTML only',
    locales,
    variants,
    ...(variantLocales ? { variantLocales } : {}),
  });
}

export const FINAL7_EMAIL_IDS = Object.freeze([
  definition({
    id: 'marketing_package_sale',
    master: 'COMMERCE',
    backendFamily: 'Financial/Receipt',
    subfolder: 'Marketing-Package',
    locales: FIVE,
    variants: Object.freeze(['organizer', 'admin']),
    variantLocales: Object.freeze({ organizer: FIVE, admin: EN }),
  }),
  definition({ id: 'festival_payout', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Payouts', locales: EN, variants: Object.freeze(['organizer', 'admin']) }),
  definition({ id: 'partner_coupons', master: 'COMMERCE', backendFamily: 'Ticket/Pass', subfolder: 'Partner-Coupons', locales: EN, variants: Object.freeze(['withMap', 'withoutMap']) }),
  definition({ id: 'partner_coupons_partner', master: 'COMMERCE', backendFamily: 'Ticket/Pass', subfolder: 'Partner-Coupons', locales: EN, variants: Object.freeze(['withMap', 'withoutMap']) }),
  definition({ id: 'bad_content_alert', master: 'NOTIFICATION', backendFamily: 'Internal/Operational', subfolder: 'Support-Ops', locales: EN, variants: Object.freeze(['default']) }),
  definition({ id: 'book_demo_admin', master: 'NOTIFICATION', backendFamily: 'Internal/Operational', subfolder: 'Support-Ops', locales: EN, variants: Object.freeze(['default']) }),
  definition({ id: 'extra_service_request', master: 'NOTIFICATION', backendFamily: 'Internal/Operational', subfolder: 'Support-Ops', locales: EN, variants: Object.freeze(['withBusinessName', 'withoutBusinessName']) }),
]);

if (FINAL7_EMAIL_IDS.length !== 7 || new Set(FINAL7_EMAIL_IDS.map(({ id }) => id)).size !== 7) {
  throw new Error('Final-7 definitions must contain exactly seven distinct IDs');
}
