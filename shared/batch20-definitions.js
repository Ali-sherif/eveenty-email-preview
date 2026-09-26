const FIVE_LOCALES = Object.freeze(['en', 'fr', 'es', 'ar', 'fa']);
const EN_ONLY = Object.freeze(['en']);

function definition({ id, master, backendFamily, subfolder, locales, variants, variantLocales }) {
  return Object.freeze({
    id,
    label: `${master === 'COMMERCE' ? '02-Commerce' : '03-Notification'} / ${subfolder} — ${id} [BATCH 20]`,
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

const refundVariants = Object.freeze([
  'refundAndCanceled',
  'refundOnly',
  'canceledOnly',
  'externalPayment',
  'noProcessingFees',
  'adjustmentsAndProof',
  'refundedBankFees',
]);
const registrationVariants = Object.freeze(['user', 'organizer', 'admin']);
const registrationVariantLocales = Object.freeze({
  user: FIVE_LOCALES,
  organizer: FIVE_LOCALES,
  admin: EN_ONLY,
});
const approvalVariants = Object.freeze([
  'artistApproved',
  'artistApprovedWithNote',
  'artistRejected',
  'artistRejectedWithNote',
  'speakerApproved',
  'speakerApprovedWithNote',
  'speakerRejected',
  'speakerRejectedWithNote',
  'volunteerApproved',
  'volunteerApprovedWithNote',
  'volunteerRejected',
  'volunteerRejectedWithNote',
]);
const boothPaidVariants = Object.freeze([
  'vendor',
  'vendorDiscountCardFees',
  'admin',
  'adminDiscountCardFees',
  'organizer',
  'organizerDiscountCardFees',
]);
const sponsorPaidVariants = Object.freeze([
  'sponsor',
  'sponsorDiscountCardFees',
  'admin',
  'adminDiscountCardFees',
  'organizer',
  'organizerDiscountCardFees',
]);
const boothAudienceVariants = Object.freeze(['vendor', 'admin', 'organizer']);
const sponsorAudienceVariants = Object.freeze(['sponsor', 'admin', 'organizer']);
const boothVariantLocales = Object.freeze({
  vendor: FIVE_LOCALES,
  vendorDiscountCardFees: FIVE_LOCALES,
  admin: EN_ONLY,
  adminDiscountCardFees: EN_ONLY,
  organizer: FIVE_LOCALES,
  organizerDiscountCardFees: FIVE_LOCALES,
});
const sponsorVariantLocales = Object.freeze({
  sponsor: FIVE_LOCALES,
  sponsorDiscountCardFees: FIVE_LOCALES,
  admin: EN_ONLY,
  adminDiscountCardFees: EN_ONLY,
  organizer: FIVE_LOCALES,
  organizerDiscountCardFees: FIVE_LOCALES,
});
const disputeVariantLocales = Object.freeze({
  organizer: FIVE_LOCALES,
  organizerWithPaymentLink: FIVE_LOCALES,
  organizerTrackingOnly: FIVE_LOCALES,
  organizerLastReminder: FIVE_LOCALES,
  organizerStripeConnect: FIVE_LOCALES,
  organizerStripeConnectLastReminder: FIVE_LOCALES,
  admin: EN_ONLY,
  adminWithPaymentLink: EN_ONLY,
  adminLastReminder: EN_ONLY,
  adminStripeConnect: EN_ONLY,
  adminStripeConnectLastReminder: EN_ONLY,
});

/** Exact preview-control metadata for the owner-authorized 20-template batch. */
export const BATCH20_EMAIL_IDS = Object.freeze([
  definition({ id: 'refund_receipt_organizer', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Refunds', locales: FIVE_LOCALES, variants: refundVariants }),
  definition({ id: 'refund_receipt_admin', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Refunds', locales: EN_ONLY, variants: refundVariants }),
  definition({ id: 'festival_ticket_registration', master: 'COMMERCE', backendFamily: 'Ticket/Pass', subfolder: 'Registration', locales: FIVE_LOCALES, variants: registrationVariants, variantLocales: registrationVariantLocales }),
  definition({ id: 'festival_ticket_registration_deadline_exceeded', master: 'COMMERCE', backendFamily: 'Ticket/Pass', subfolder: 'Registration', locales: FIVE_LOCALES, variants: registrationVariants, variantLocales: registrationVariantLocales }),
  definition({ id: 'festival_ticket_registration_payment_deadline_exceeded', master: 'COMMERCE', backendFamily: 'Ticket/Pass', subfolder: 'Registration', locales: FIVE_LOCALES, variants: registrationVariants, variantLocales: registrationVariantLocales }),
  definition({ id: 'registration_approval_status_changed', master: 'COMMERCE', backendFamily: 'Ticket/Pass', subfolder: 'Registration', locales: FIVE_LOCALES, variants: approvalVariants }),
  definition({ id: 'festival_update_request_approved', master: 'NOTIFICATION', backendFamily: 'Workflow/Status', subfolder: 'Approvals-Status', locales: FIVE_LOCALES, variants: Object.freeze(['all', 'allWithNote', 'partial', 'partialWithNote']) }),
  definition({ id: 'festival_update_request_rejected', master: 'NOTIFICATION', backendFamily: 'Workflow/Status', subfolder: 'Approvals-Status', locales: FIVE_LOCALES, variants: Object.freeze(['default', 'withNote']) }),
  definition({ id: 'festival_vendor_sale_rejection', master: 'NOTIFICATION', backendFamily: 'Workflow/Status', subfolder: 'Approvals-Status', locales: FIVE_LOCALES, variants: Object.freeze(['default', 'reasonOnly', 'noteOnly', 'noReasonOrNote', 'noBankFees', 'noOptionalFees']) }),
  definition({ id: 'needs_response_dispute_reminder', master: 'NOTIFICATION', backendFamily: 'Workflow/Status', subfolder: 'Disputes', locales: FIVE_LOCALES, variants: Object.freeze(Object.keys(disputeVariantLocales)), variantLocales: disputeVariantLocales }),
  definition({ id: 'festival_update_request_issued', master: 'NOTIFICATION', backendFamily: 'Workflow/Status', subfolder: 'Approvals-Status', locales: EN_ONLY, variants: Object.freeze(['default']) }),
  definition({ id: 'festival_created', master: 'NOTIFICATION', backendFamily: 'Workflow/Status', subfolder: 'Approvals-Status', locales: EN_ONLY, variants: Object.freeze(['default']) }),
  definition({ id: 'festival_marketing_approval', master: 'NOTIFICATION', backendFamily: 'Workflow/Status', subfolder: 'Approvals-Status', locales: EN_ONLY, variants: Object.freeze(['default', 'withoutLogo', 'withoutImage', 'withoutImages']) }),
  definition({ id: 'festival_marketing_approval_sms', master: 'NOTIFICATION', backendFamily: 'Workflow/Status', subfolder: 'Approvals-Status', locales: EN_ONLY, variants: Object.freeze(['default']) }),
  definition({ id: 'festival_sale_installment_paid', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Installments', locales: FIVE_LOCALES, variants: boothPaidVariants, variantLocales: boothVariantLocales }),
  definition({ id: 'second_payment_reminder', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Installments', locales: FIVE_LOCALES, variants: boothAudienceVariants, variantLocales: boothVariantLocales }),
  definition({ id: 'first_payment_refund', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Installments', locales: FIVE_LOCALES, variants: boothAudienceVariants, variantLocales: boothVariantLocales }),
  definition({ id: 'sponsor_installment_paid', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Installments', locales: FIVE_LOCALES, variants: sponsorPaidVariants, variantLocales: sponsorVariantLocales }),
  definition({ id: 'sponsor_installment_second_payment_reminder', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Installments', locales: FIVE_LOCALES, variants: sponsorAudienceVariants, variantLocales: sponsorVariantLocales }),
  definition({ id: 'sponsor_first_payment_refund', master: 'COMMERCE', backendFamily: 'Financial/Receipt', subfolder: 'Installments', locales: FIVE_LOCALES, variants: sponsorAudienceVariants, variantLocales: sponsorVariantLocales }),
]);

if (BATCH20_EMAIL_IDS.length !== 20 || new Set(BATCH20_EMAIL_IDS.map(({ id }) => id)).size !== 20) {
  throw new Error('Batch-20 preview definitions must contain exactly 20 distinct IDs');
}
