package email

// legacy_snapshot_cases_test.go — snapshot test case table for all legacy templates.
//
// Each snapshotCase represents one golden file:
//   testdata/legacy_snapshots/<templateID>/<persona>__<locale>.eml
//
// Coverage strategy:
//   - Every template has at least one case.
//   - Multi-persona templates (admin/organizer/vendor/user) have one case per
//     meaningful recipient persona.
//   - Locale coverage:
//       "en"     — all templates (default)
//       "ar"     — templates that use GetValidProfileLanguage (buyer-facing Send*s)
//   - For admin/internal Send* that always use lang="en" only "en" is tested.
//
// LOCALE NOTE: Backend-verified locales for Send* methods that use
// GetValidProfileLanguage are: "en", "ar". All other locales are not
// independently verified for this test suite and are not tested here.
//
// SKIPPED CASES: any case whose skip field is non-empty is skipped with that
// message as the reason. This is documented inline where applicable.

import (
	"context"

	"zemind.ca/rescounts/model"
)

type snapshotCase struct {
	// templateID maps to the template file name (e.g. "password_reset").
	templateID string
	// persona identifies the email recipient role (e.g. "user", "admin", "organizer").
	persona string
	// locale is the BCP-47 language tag for this case (e.g. "en", "ar").
	// Document: these are backend-verified locales, not exhaustive i18n checks.
	locale string
	// skip, if non-empty, causes t.Skip to be called with this message.
	skip string
	// invoke calls the Send* method under test.
	invoke func(ctx context.Context, c *smtpClient) error
}

// allSnapshotCases is the full case table — original 48 Kit templates plus
// Kit #49 organizer_team_invitation, Kit #50 festival_end_of_day_report,
// plus EXCLUDED legacy stems as applicable.
var allSnapshotCases = []snapshotCase{

	// ── Auth family ───────────────────────────────────────────────────────────

	{
		templateID: "password_reset",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendPasswordReset(ctx, fixedUser(), "RESET-TOKEN-FIXED")
		},
	},
	{
		templateID: "password_reset",
		persona:    "user",
		locale:     "ar",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendPasswordReset(ctx, fixedUserAR(), "RESET-TOKEN-FIXED")
		},
	},
	{
		templateID: "activate_email",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendActivateEmail(ctx, fixedUser())
		},
	},
	{
		templateID: "activate_email",
		persona:    "user",
		locale:     "ar",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendActivateEmail(ctx, fixedUserAR())
		},
	},

	// ── Internal / Support family ─────────────────────────────────────────────

	{
		templateID: "support",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSupportEmail("Test error details for snapshot", "support@snapshot.invalid")
		},
	},

	// ── Restaurant / Receipt family ───────────────────────────────────────────

	{
		templateID: "receipt",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendReceipt(ctx, fixedUser(), fixedRestaurant(), nil, nil, nil, 0, 0, 0, nil)
		},
	},
	{
		templateID: "restaurant_decline",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.RestaurantMarketingDecline(ctx, fixedRestaurant(), "email")
		},
	},
	{
		templateID: "restaurant_approval",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.RestaurantMarektApporval(ctx, fixedRestaurant(), 10000, 200, "email")
		},
	},
	{
		templateID: "invoice",
		persona:    "restaurant",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendInvoice(ctx, fixedInvoice(), "restaurant@snapshot.invalid")
		},
	},

	// ── Marketing family ──────────────────────────────────────────────────────

	{
		templateID: "marketing",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendMarktingDeals(ctx, fixedSendingMarketingEmailParams())
		},
	},
	{
		templateID: "marketing_approval_1",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendMarktingApproval(ctx, fixedRestaurant(), fixedRestaurantMarketingEmailRequest())
		},
	},
	{
		templateID: "marketing_sms_approval",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendMarketingSMSApproval(ctx, fixedRestaurant(), fixedRestaurantMarketingSMSRequest())
		},
	},
	{
		templateID: "marketing_sms_approval",
		persona:    "admin_rescounts",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendRescountsMarketingSMSApproval(ctx, fixedRescountsMarketingSMSRequest())
		},
	},
	{
		templateID: "marketing_notification_approval",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendMarketingNotificationApproval(ctx, fixedRestaurant(), fixedRestaurantMarketingNotificationRequest())
		},
	},
	{
		templateID: "marketing_notification_approval",
		persona:    "admin_rescounts",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendRescountsMarketingNotificationApproval(ctx, fixedRescountsMarketingNotificationRequest())
		},
	},

	// ── Partner Coupons family ────────────────────────────────────────────────

	{
		templateID: "partner_coupons",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendCoupon(ctx, fixedCouponItems(), fixedCoupons(), fixedPartner(), fixedUser(), fixedCouponPaymentDetails())
		},
	},
	{
		templateID: "partner_coupons_partner",
		persona:    "partner",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendCouponToPartner(ctx, fixedCouponItems(), fixedCoupons(), fixedPartner(), fixedUser(), fixedCouponPaymentDetails())
		},
	},

	// ── Festival Marketing family ─────────────────────────────────────────────

	{
		templateID: "festival_marketing_approval",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalMarketingEmailToAdmin(ctx, *fixedFestival(), *fixedOrganizer(), fixedFestivalMarketingEmailRequest())
		},
	},
	{
		templateID: "festival_marketing_approval_sms",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalMarketingSMSToAdmin(ctx, *fixedFestival(), *fixedOrganizer(), fixedFestivalMarketingSMSRequest())
		},
	},
	{
		templateID: "festival_marketing_email_target",
		persona:    "target_user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalMarketingEmailToTarget(ctx, *fixedFestival(), fixedFestivalMarketingEmailRequest(), fixedFestivalMarketingEmailTarget())
		},
	},
	{
		templateID: "festival_rescounts_marketing_email_target",
		persona:    "target_user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalRescountsMarketingEmailToTarget(ctx, fixedFestivalMarketingEmailByRescounts(), fixedFestivalMarketingEmailTarget())
		},
	},
	{
		templateID: "organizer_festival_marketing_email_receipt",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalMarketingEmailReceipt(ctx, *fixedFestival(), *fixedOrganizer(), fixedFestivalMarketingEmailRequest())
		},
	},
	{
		templateID: "organizer_festival_marketing_sms_receipt",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalMarketingSMSReceipt(ctx, *fixedFestival(), *fixedOrganizer(), fixedFestivalMarketingSMSRequest())
		},
	},

	// ── Festival Sales (booth/service) family ─────────────────────────────────

	{
		templateID: "festival_sales",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalSaleToAdmin(ctx, fixedFestivalSale())
		},
	},
	{
		templateID: "festival_sales",
		persona:    "vendor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalSaleToVendor(ctx, fixedFestivalSale())
		},
	},
	{
		templateID: "festival_sales",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalSaleToOrganizer(ctx, fixedFestivalSale(), *fixedOrganizer())
		},
	},

	// ── Festival Sale Installment Paid family ─────────────────────────────────

	{
		templateID: "festival_sale_installment_paid",
		persona:    "vendor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			sale := fixedFestivalSale()
			item := fixedSaleItemWithInstallment()
			booth := fixedBooth()
			return c.SendVendorPaidInstallment(ctx, &sale, fixedVendor(), fixedFestival(), item.Installment, fixedInstallmentMethod(), &booth)
		},
	},
	{
		templateID: "festival_sale_installment_paid",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			sale := fixedFestivalSale()
			item := fixedSaleItemWithInstallment()
			booth := fixedBooth()
			return c.SendOrganizerPaidInstallment(ctx, &sale, fixedVendor(), fixedFestival(), item.Installment, fixedInstallmentMethod(), fixedOrganizer(), &booth)
		},
	},
	{
		templateID: "festival_sale_installment_paid",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			sale := fixedFestivalSale()
			item := fixedSaleItemWithInstallment()
			booth := fixedBooth()
			return c.SendAdminPaidInstallment(ctx, &sale, fixedVendor(), fixedFestival(), item.Installment, fixedInstallmentMethod(), &booth)
		},
	},

	// ── Second Payment Reminder (vendor installment) family ───────────────────

	{
		templateID: "second_payment_reminder",
		persona:    "vendor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			item := fixedSaleItemWithInstallment()
			return c.SendVendorSecondPaymentReminder(ctx, fixedVendor(), fixedFestival(), fixedInstallmentMethod(), &booth, item)
		},
	},
	{
		templateID: "second_payment_reminder",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			item := fixedSaleItemWithInstallment()
			return c.SendAdminSecondPaymentReminder(ctx, fixedVendor(), fixedFestival(), fixedInstallmentMethod(), &booth, item)
		},
	},
	{
		templateID: "second_payment_reminder",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			item := fixedSaleItemWithInstallment()
			return c.SendOrganizerSecondPaymentReminder(ctx, fixedVendor(), fixedFestival(), fixedInstallmentMethod(), &booth, item, fixedOrganizer())
		},
	},

	// ── First Payment Refund (vendor installment) family ──────────────────────

	{
		templateID: "first_payment_refund",
		persona:    "vendor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			item := fixedSaleItemWithInstallment()
			return c.SendVendorFirstPaymentRefund(ctx, fixedVendor(), fixedFestival(), fixedInstallmentMethod(), &booth, item)
		},
	},
	{
		templateID: "first_payment_refund",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			item := fixedSaleItemWithInstallment()
			return c.SendOrganizerFirstPaymentRefund(ctx, fixedVendor(), fixedOrganizer(), fixedFestival(), fixedInstallmentMethod(), &booth, item)
		},
	},
	{
		templateID: "first_payment_refund",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			item := fixedSaleItemWithInstallment()
			return c.SendAdminFirstPaymentRefund(ctx, fixedVendor(), fixedFestival(), fixedInstallmentMethod(), &booth, item)
		},
	},

	// ── Sponsor Installment Paid family ──────────────────────────────────────

	{
		templateID: "sponsor_installment_paid",
		persona:    "sponsor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorInstallmentPaidToSponsor(ctx, fixedSponsorInstallment())
		},
	},
	{
		templateID: "sponsor_installment_paid",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorInstallmentPaidToAdmin(ctx, fixedSponsorInstallment())
		},
	},
	{
		templateID: "sponsor_installment_paid",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorInstallmentPaidToOrganizer(ctx, fixedSponsorInstallment(), fixedOrganizer())
		},
	},

	// ── Sponsor Second Payment Reminder family ────────────────────────────────

	{
		templateID: "sponsor_installment_second_payment_reminder",
		persona:    "sponsor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendInstallmentSecondPaymentReminderToSponsor(ctx, fixedSponsorInstallment())
		},
	},
	{
		templateID: "sponsor_installment_second_payment_reminder",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendInstallmentSecondPaymentReminderToAdmin(ctx, fixedSponsorInstallment())
		},
	},
	{
		templateID: "sponsor_installment_second_payment_reminder",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendInstallmentSecondPaymentReminderToOrganizer(ctx, fixedSponsorInstallment(), fixedOrganizer())
		},
	},

	// ── Sponsor First Payment Refund family ───────────────────────────────────

	{
		templateID: "sponsor_first_payment_refund",
		persona:    "sponsor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorFirstPaymentRefundToSponsor(ctx, fixedSponsorInstallment())
		},
	},
	{
		templateID: "sponsor_first_payment_refund",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorFirstPaymentRefundToAdmin(ctx, fixedSponsorInstallment())
		},
	},
	{
		templateID: "sponsor_first_payment_refund",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorFirstPaymentRefundToOrganizer(ctx, fixedSponsorInstallment(), fixedOrganizer())
		},
	},

	// ── Donation family ────────────────────────────────────────────────────────

	{
		templateID: "festival_donation",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendUserDonationReceipt(ctx, *fixedUser(), *fixedFestival(), fixedDonation())
		},
	},
	{
		templateID: "festival_donation",
		persona:    "user",
		locale:     "ar",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendUserDonationReceipt(ctx, *fixedUserAR(), *fixedFestival(), fixedDonation())
		},
	},
	{
		templateID: "festival_donation",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendOrganizerDonation(ctx, *fixedUser(), *fixedFestival(), fixedDonation(), *fixedOrganizer())
		},
	},
	{
		templateID: "festival_donation",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendAdminDonation(ctx, *fixedUser(), *fixedFestival(), fixedDonation())
		},
	},

	// ── Festival Ticket Sale family ────────────────────────────────────────────

	{
		templateID: "festival_ticket_sale",
		persona:    "buyer_user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketSaleToBuyerUser(ctx, fixedFestivalTicketSale())
		},
	},
	{
		templateID: "festival_ticket_sale",
		persona:    "buyer_user",
		locale:     "ar",
		invoke: func(ctx context.Context, c *smtpClient) error {
			sale := fixedFestivalTicketSale()
			sale.User = fixedUserAR()
			return c.SendFestivalTicketSaleToBuyerUser(ctx, sale)
		},
	},
	{
		templateID: "festival_ticket_sale",
		persona:    "guest_user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketToGuestUser(ctx, fixedFestivalTicketSale(), fixedFestivalTicket())
		},
	},
	{
		templateID: "festival_ticket_sale",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketSaleToAdmin(ctx, fixedFestivalTicketSale())
		},
	},
	{
		templateID: "festival_ticket_sale",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketSaleToOrganizer(ctx, fixedFestivalTicketSale(), fixedOrganizer())
		},
	},

	// ── Festival Add-On Sale family ────────────────────────────────────────────

	{
		templateID: "festival_add_on_sale",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalAddOnSaleToAdmin(ctx, fixedAddOnSale(), true)
		},
	},
	{
		templateID: "festival_add_on_sale",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalAddOnSaleToUser(ctx, fixedAddOnSale(), true)
		},
	},
	{
		templateID: "festival_add_on_sale",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalAddOnSaleToOrganizer(ctx, fixedAddOnSale(), fixedOrganizer(), true)
		},
	},

	// ── Organizer Announcement ────────────────────────────────────────────────

	{
		templateID: "organizer_announcement",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendOrganizerAnnouncement(ctx, "buyer@snapshot.invalid", "Festival Announcement", "We have an important update about the event.")
		},
	},

	// ── Organizer Team Invitation (Kit #49; post-original-48 addition) ───────

	{
		templateID: "organizer_team_invitation",
		persona:    "existing_user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendOrganizerTeamInvitation(ctx, &model.OrganizerTeamInvitation{
				InvitationID:    "oti-inv-existing-001",
				OrganizerUserID: "organizer-user-001",
				Email:           "invitee-existing@snapshot.invalid",
				FestivalIDs:     `["festival-fixed-001"]`,
				Token:           "oti-token-existing-001",
				Status:          model.OrganizerTeamInvitationStatusPending,
			}, true)
		},
	},
	{
		templateID: "organizer_team_invitation",
		persona:    "new_user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendOrganizerTeamInvitation(ctx, &model.OrganizerTeamInvitation{
				InvitationID:    "oti-inv-new-001",
				OrganizerUserID: "organizer-user-001",
				Email:           "invitee-new@snapshot.invalid",
				FestivalIDs:     `["festival-fixed-001"]`,
				Token:           "oti-token-new-001",
				Status:          model.OrganizerTeamInvitationStatusPending,
			}, false)
		},
	},

	// ── Festival End of Day Report (Kit #50; post-original-48 addition) ──────

	{
		templateID: "festival_end_of_day_report",
		persona:    "multi_festival",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			festivals, report := fixedEODReportMulti()
			return c.SendOrganizerEndOfDayReportToOrganizer(ctx, fixedOrganizer(), festivals, report)
		},
	},
	{
		templateID: "festival_end_of_day_report",
		persona:    "single_festival",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			festivals, report := fixedEODReportSingle()
			return c.SendOrganizerEndOfDayReportToOrganizer(ctx, fixedOrganizer(), festivals, report)
		},
	},
	{
		templateID: "festival_end_of_day_report",
		persona:    "no_sales",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			festivals, report := fixedEODReportNoSales()
			return c.SendOrganizerEndOfDayReportToOrganizer(ctx, fixedOrganizer(), festivals, report)
		},
	},

	// ── Refund Receipt family ─────────────────────────────────────────────────

	{
		templateID: "refund_receipt_user",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendRefundItemsToTargetUser(ctx, fixedRefundUser(), fixedFestival(), fixedRefundParams())
		},
	},
	{
		templateID: "refund_receipt_user",
		persona:    "user",
		locale:     "ar",
		invoke: func(ctx context.Context, c *smtpClient) error {
			ru := fixedRefundUser()
			ru.ProfileLanguage = "ar"
			email := "buyer-ar@snapshot.invalid"
			ru.UserEmail = &email
			return c.SendRefundItemsToTargetUser(ctx, ru, fixedFestival(), fixedRefundParams())
		},
	},
	{
		templateID: "refund_receipt_organizer",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendRefundItemsToOrganizer(ctx, fixedRefundUser(), fixedOrganizer(), fixedFestival(), fixedRefundParams())
		},
	},
	{
		templateID: "refund_receipt_admin",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendRefundItemsToAdmin(ctx, fixedRefundUser(), fixedFestival(), fixedRefundParams())
		},
	},

	// ── Festival Vendor Sale (booth purchase) family ──────────────────────────

	{
		templateID: "festival_vendor_sale",
		persona:    "buyer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			return c.SendVendorSaleEmail(ctx, booth, *fixedFestival(), fixedVendorSale())
		},
	},
	{
		templateID: "festival_vendor_sale",
		persona:    "vendor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			return c.SendVendorSaleEmailToVendor(ctx, *fixedVendor(), booth, *fixedFestival(), fixedVendorSale())
		},
	},
	{
		templateID: "festival_vendor_sale",
		persona:    "received",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			return c.SendSaleReceivedEmail(ctx, booth, *fixedFestival(), fixedVendorSale())
		},
	},

	// ── Festival Vendor Sale Rejection ────────────────────────────────────────

	{
		templateID: "festival_vendor_sale_rejection",
		persona:    "buyer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			booth := fixedBooth()
			return c.SendVendorSaleRejectionEmail(ctx, booth, *fixedFestival(), fixedVendorSale(), fixedVendorSaleRejection())
		},
	},

	// ── Festival Activity Sale family ─────────────────────────────────────────

	{
		templateID: "festival_activity_sale",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendActivitySaleToAdmin(ctx, fixedActivitySale())
		},
	},
	{
		templateID: "festival_activity_sale",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendActivitySaleToUser(ctx, fixedActivitySale())
		},
	},
	{
		templateID: "festival_activity_sale",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendActivitySaleToOrganizer(ctx, *fixedOrganizer(), fixedActivitySale())
		},
	},

	// ── Festival Sponsor Sale family ──────────────────────────────────────────

	{
		templateID: "festival_sponsor_sale",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorSaleToAdmin(ctx, fixedSponsorSale())
		},
	},
	{
		templateID: "festival_sponsor_sale",
		persona:    "sponsor",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorSaleToSponsor(ctx, fixedSponsorSale())
		},
	},
	{
		templateID: "festival_sponsor_sale",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendSponsorSaleToOrganizer(ctx, *fixedOrganizer(), fixedSponsorSale())
		},
	},

	// ── Festival Update Request family ────────────────────────────────────────

	{
		templateID: "festival_update_request_issued",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			req := fixedUpdateRequest()
			return c.SendFestivalUpdateRequestIssuedToAdmin(req.Festival, req.SubmitterOrganizer.User, req)
		},
	},
	{
		templateID: "festival_update_request_approved",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			req := fixedUpdateRequest()
			req.Status = model.FestivalUpdateRequestTotallyApproved
			return c.SendApprovedUpdateRequestToOrganizer(ctx, req, fixedOrganizer())
		},
	},
	{
		templateID: "festival_update_request_rejected",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			req := fixedUpdateRequest()
			req.Status = model.FestivalUpdateRequestRejected
			req.ReviewNote = "The proposed changes do not meet our guidelines."
			return c.SendRejectedUpdateRequestToOrganizer(ctx, req, fixedOrganizer())
		},
	},

	// ── Marketing Package Sale family ─────────────────────────────────────────

	{
		templateID: "marketing_package_sale",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendMarketingPackageSaleToAdmin(ctx, fixedMarketingPackageSale())
		},
	},
	{
		templateID: "marketing_package_sale",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendMarketingPackageSaleToOrganizer(ctx, fixedMarketingPackageSale())
		},
	},

	// ── Internal Admin family ─────────────────────────────────────────────────

	{
		templateID: "bad_content_alert",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendBadContentAlert(fixedFestival(), fixedUser(), "reject", "Content violates guidelines", map[string]string{"reason": "spam"})
		},
	},
	{
		templateID: "festival_created",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalCreatedToAdmin(fixedFestival(), fixedOrganizer())
		},
	},
	{
		templateID: "festival_approval_status_changed",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalApprovalStatusChangedToOrganizer(fixedFestival(), fixedOrganizer())
		},
	},
	{
		templateID: "contact_submission",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendContactSubmission(fixedContactSubmission())
		},
	},
	{
		templateID: "book_demo_admin",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendAdminBookDemoEmail(ctx, fixedBookDemo())
		},
	},
	{
		templateID: "extra_service_request",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendExtraServiceRequestToAdmin(ctx, fixedExtraServiceRequest(), fixedOrganizer())
		},
	},

	// ── Festival Payout family ────────────────────────────────────────────────

	{
		templateID: "festival_payout",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendPayoutEmailToOrganizer(fixedFestival(), fixedWeeklyFinance(), fixedOrganizer())
		},
	},
	{
		templateID: "festival_payout",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendPayoutEmailToAdmin(fixedFestival(), fixedWeeklyFinance())
		},
	},

	// ── Dispute Notification family ───────────────────────────────────────────

	{
		templateID: "dispute_notification",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendDisputeNotificationToOrganizer(ctx, fixedOrganizer(), fixedDisputeNotificationData())
		},
	},
	{
		templateID: "dispute_notification",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendDisputeNotificationToAdmin(ctx, fixedDisputeNotificationData())
		},
	},

	// ── Dispute Reminder (needs_response) family ──────────────────────────────

	{
		templateID: "needs_response_dispute_reminder",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendNeedsResponseDisputeReminderToAdmin(ctx, fixedDisputeReminderData())
		},
	},
	{
		templateID: "needs_response_dispute_reminder",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendNeedsResponseDisputeReminderToOrganizer(ctx, fixedOrganizer(), fixedDisputeReminderData())
		},
	},

	// ── Registration Approval Status Changed ─────────────────────────────────

	{
		templateID: "registration_approval_status_changed",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendRegistrationApprovalStatusChangedToUser(ctx, fixedRegistrationRequest())
		},
	},
	{
		templateID: "registration_approval_status_changed",
		persona:    "user",
		locale:     "ar",
		invoke: func(ctx context.Context, c *smtpClient) error {
			req := fixedRegistrationRequest()
			req.ProfileLanguage = "ar"
			return c.SendRegistrationApprovalStatusChangedToUser(ctx, req)
		},
	},

	// ── Ticket Registration family ────────────────────────────────────────────

	{
		templateID: "festival_ticket_registration",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendTicketRegistrationToAdmin(ctx, fixedTicketRegistration())
		},
	},
	{
		templateID: "festival_ticket_registration",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendTicketRegistrationToOrganizer(ctx, fixedTicketRegistration(), fixedOrganizer())
		},
	},
	{
		templateID: "festival_ticket_registration",
		persona:    "buyer_user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendTicketRegistrationToBuyerUser(ctx, fixedTicketRegistration())
		},
	},
	{
		templateID: "festival_ticket_registration",
		persona:    "buyer_user",
		locale:     "ar",
		invoke: func(ctx context.Context, c *smtpClient) error {
			reg := fixedTicketRegistration()
			reg.User = fixedUserAR()
			return c.SendTicketRegistrationToBuyerUser(ctx, reg)
		},
	},

	// ── Ticket Registration Reject family ─────────────────────────────────────

	{
		templateID: "festival_ticket_registration_reject",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationRejectToUser(ctx, fixedTicketRegistration())
		},
	},
	{
		templateID: "festival_ticket_registration_reject",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationRejectToAdmin(ctx, fixedTicketRegistration())
		},
	},
	{
		templateID: "festival_ticket_registration_reject",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationRejectToOrganizer(ctx, fixedTicketRegistration(), fixedOrganizer())
		},
	},

	// ── Ticket Registration Review Deadline Exceeded family ───────────────────

	{
		templateID: "festival_ticket_registration_deadline_exceeded",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationReviewDeadlineExceededToAdmin(ctx, fixedTicketRegistration())
		},
	},
	{
		templateID: "festival_ticket_registration_deadline_exceeded",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationReviewDeadlineExceededToOrganizer(ctx, fixedTicketRegistration(), fixedOrganizer())
		},
	},
	{
		templateID: "festival_ticket_registration_deadline_exceeded",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationReviewDeadlineExceededToUser(ctx, fixedTicketRegistration())
		},
	},

	// ── Ticket Registration Payment Deadline Exceeded family ──────────────────

	{
		templateID: "festival_ticket_registration_payment_deadline_exceeded",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationPaymentDeadlineExceededToAdmin(ctx, fixedTicketRegistration())
		},
	},
	{
		templateID: "festival_ticket_registration_payment_deadline_exceeded",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationPaymentDeadlineExceededToOrganizer(ctx, fixedTicketRegistration(), fixedOrganizer())
		},
	},
	{
		templateID: "festival_ticket_registration_payment_deadline_exceeded",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationPaymentDeadlineExceededToUser(ctx, fixedTicketRegistration())
		},
	},

	// ── Ticket Registration Approval family ───────────────────────────────────

	{
		templateID: "festival_ticket_registration_approval",
		persona:    "user",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationApprovalToUser(ctx, fixedTicketRegistration())
		},
	},
	{
		templateID: "festival_ticket_registration_approval",
		persona:    "admin",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationApprovalToAdmin(ctx, fixedTicketRegistration())
		},
	},
	{
		templateID: "festival_ticket_registration_approval",
		persona:    "organizer",
		locale:     "en",
		invoke: func(ctx context.Context, c *smtpClient) error {
			return c.SendFestivalTicketRegistrationApprovalToOrganizer(ctx, fixedTicketRegistration(), fixedOrganizer())
		},
	},
}
