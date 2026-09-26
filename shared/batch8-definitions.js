const FIVE = Object.freeze(['en', 'fr', 'es', 'ar', 'fa']);
const EN = Object.freeze(['en']);

function definition({ id, master, backendFamily, subfolder, locales, variants, variantLocales }) {
  return Object.freeze({
    id,
    label: `${master === 'COMMERCE' ? '02-Commerce' : master === 'NOTIFICATION' ? '03-Notification' : '04-Marketing'} / ${subfolder} — ${id} [BATCH 8]`,
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

const addOnVariants = Object.freeze(['user', 'userGuest', 'userNoSummary', 'organizerDormant', 'adminDormant']);
const activityVariants = Object.freeze(['user', 'organizer', 'admin']);
const sponsorVariants = Object.freeze(['sponsorPending', 'sponsorApproved', 'organizerPending', 'organizerApproved', 'organizerRejected', 'organizerClosed', 'adminPending', 'adminApproved', 'adminRejected', 'adminClosed']);
const saleVariants = Object.freeze(['vendorPending', 'vendorApproved', 'vendorRejected', 'organizerPending', 'organizerApproved', 'organizerRejected', 'organizerClosed', 'adminPending', 'adminApproved', 'adminRejected', 'adminClosed']);
const adminEnglish = (variants) => Object.freeze(Object.fromEntries(variants.map((variant) => [variant, variant.startsWith('admin') ? EN : FIVE])));

export const BATCH8_EMAIL_IDS = Object.freeze([
  definition({ id: 'festival_add_on_sale', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Ticket-Sales', locales: FIVE, variants: addOnVariants, variantLocales: Object.freeze({ user: FIVE, userGuest: FIVE, userNoSummary: FIVE, organizerDormant: FIVE, adminDormant: EN }) }),
  definition({ id: 'festival_activity_sale', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Ticket-Sales', locales: FIVE, variants: activityVariants, variantLocales: Object.freeze({ user: FIVE, organizer: FIVE, admin: EN }) }),
  definition({ id: 'festival_sponsor_sale', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Sponsor-Sales', locales: FIVE, variants: sponsorVariants, variantLocales: adminEnglish(sponsorVariants) }),
  definition({ id: 'festival_sales', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Booth-Vendor-Sales', locales: FIVE, variants: saleVariants, variantLocales: adminEnglish(saleVariants) }),
  definition({ id: 'festival_vendor_sale', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Booth-Vendor-Sales', locales: FIVE, variants: Object.freeze(['buyer', 'vendor', 'vendorReceived']) }),
  definition({ id: 'organizer_festival_marketing_email_receipt', master: 'NOTIFICATION', backendFamily: 'Internal/Operational', subfolder: 'Organizer-Campaign-Receipts', locales: EN, variants: Object.freeze(['default']) }),
  definition({ id: 'organizer_festival_marketing_sms_receipt', master: 'NOTIFICATION', backendFamily: 'Internal/Operational', subfolder: 'Organizer-Campaign-Receipts', locales: EN, variants: Object.freeze(['default']) }),
  definition({ id: 'festival_rescounts_marketing_email_target', master: 'MARKETING', backendFamily: 'Campaign/Announcement', subfolder: 'Campaigns', locales: EN, variants: Object.freeze(['default', 'withoutLogo', 'withoutImage', 'bodyOnly']) }),
]);

if (BATCH8_EMAIL_IDS.length !== 8 || new Set(BATCH8_EMAIL_IDS.map(({ id }) => id)).size !== 8) {
  throw new Error('Batch-8 definitions must contain exactly eight distinct IDs');
}
