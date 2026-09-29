package email

// legacy_snapshot_p3_cases_test.go — P3 verification cases appended to allSnapshotCases.
// Covers: wallet (1/3 tickets), extended locales (fr/es/fa/xx), edge fixtures.
// TestKitLegacyParity and TestKitOutputSnapshots automatically pick these up.

import (
	"context"

	"zemind.ca/rescounts/model"
)

func init() {
	allSnapshotCases = append(allSnapshotCases, p3WalletCases()...)
	allSnapshotCases = append(allSnapshotCases, p3LocaleCases()...)
	allSnapshotCases = append(allSnapshotCases, p3EdgeCases()...)
}

// p3ExtendedLocales are additional locales for GetValidProfileLanguage templates.
// "xx" is unsupported → en fallback.
var p3ExtendedLocales = []struct {
	locale string
	user   func() *model.User
}{
	{"fr", fixedUserFR},
	{"es", fixedUserES},
	{"fa", fixedUserFA},
	{"xx", fixedUserUnknown},
}

func p3WalletCases() []snapshotCase {
	return []snapshotCase{
		{
			templateID: "festival_ticket_sale",
			persona:    "buyer_user_wallet1",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendFestivalTicketSaleToBuyerUser(ctx, fixedFestivalTicketSaleWithWallet(1))
			},
		},
		{
			templateID: "festival_ticket_sale",
			persona:    "buyer_user_wallet3",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendFestivalTicketSaleToBuyerUser(ctx, fixedFestivalTicketSaleWithWallet(3))
			},
		},
		{
			templateID: "festival_ticket_sale",
			persona:    "buyer_user_wallet1",
			locale:     "fa",
			invoke: func(ctx context.Context, c *smtpClient) error {
				sale := fixedFestivalTicketSaleWithWallet(1)
				sale.User = fixedUserFA()
				return c.SendFestivalTicketSaleToBuyerUser(ctx, sale)
			},
		},
	}
}

func p3LocaleCases() []snapshotCase {
	var out []snapshotCase

	// Templates that already have ar: add fr/es/fa/xx
	for _, loc := range p3ExtendedLocales {
		loc := loc
		out = append(out,
			snapshotCase{
				templateID: "password_reset",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendPasswordReset(ctx, loc.user(), "RESET-TOKEN-FIXED")
				},
			},
			snapshotCase{
				templateID: "activate_email",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendActivateEmail(ctx, loc.user(), "snapshot-activate-token")
				},
			},
			snapshotCase{
				templateID: "festival_donation",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendUserDonationReceipt(ctx, *loc.user(), *fixedFestival(), fixedDonation())
				},
			},
			snapshotCase{
				templateID: "festival_ticket_sale",
				persona:    "buyer_user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					sale := fixedFestivalTicketSale()
					sale.User = loc.user()
					return c.SendFestivalTicketSaleToBuyerUser(ctx, sale)
				},
			},
			snapshotCase{
				templateID: "refund_receipt_user",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					ru := fixedRefundUser()
					ru.ProfileLanguage = loc.locale
					email := loc.user().Email
					ru.UserEmail = &email
					return c.SendRefundItemsToTargetUser(ctx, ru, fixedFestival(), fixedRefundParams())
				},
			},
			snapshotCase{
				templateID: "registration_approval_status_changed",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					req := fixedRegistrationRequest()
					req.ProfileLanguage = loc.locale
					req.UserEmail = loc.user().Email
					return c.SendRegistrationApprovalStatusChangedToUser(ctx, req)
				},
			},
			snapshotCase{
				templateID: "festival_ticket_registration",
				persona:    "buyer_user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					reg := fixedTicketRegistration()
					reg.User = loc.user()
					return c.SendTicketRegistrationToBuyerUser(ctx, reg)
				},
			},
		)
	}

	// Buyer-facing templates missing ar: full ar+fr+es+fa+xx
	buyerLocales := append([]struct {
		locale string
		user   func() *model.User
	}{
		{"ar", fixedUserAR},
	}, p3ExtendedLocales...)

	for _, loc := range buyerLocales {
		loc := loc
		out = append(out,
			snapshotCase{
				templateID: "festival_add_on_sale",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					sale := fixedAddOnSale()
					sale.User = loc.user()
					return c.SendFestivalAddOnSaleToUser(ctx, sale, true)
				},
			},
			snapshotCase{
				templateID: "festival_activity_sale",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					sale := fixedActivitySale()
					sale.User = loc.user()
					return c.SendActivitySaleToUser(ctx, sale)
				},
			},
			snapshotCase{
				templateID: "festival_ticket_registration_approval",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					reg := fixedTicketRegistration()
					reg.User = loc.user()
					return c.SendFestivalTicketRegistrationApprovalToUser(ctx, reg)
				},
			},
			snapshotCase{
				templateID: "festival_ticket_registration_reject",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					reg := fixedTicketRegistration()
					reg.User = loc.user()
					return c.SendFestivalTicketRegistrationRejectToUser(ctx, reg)
				},
			},
			snapshotCase{
				templateID: "festival_ticket_registration_deadline_exceeded",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					reg := fixedTicketRegistration()
					reg.User = loc.user()
					return c.SendFestivalTicketRegistrationReviewDeadlineExceededToUser(ctx, reg)
				},
			},
			snapshotCase{
				templateID: "festival_ticket_registration_payment_deadline_exceeded",
				persona:    "user",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					reg := fixedTicketRegistration()
					reg.User = loc.user()
					return c.SendFestivalTicketRegistrationPaymentDeadlineExceededToUser(ctx, reg)
				},
			},
			snapshotCase{
				templateID: "festival_vendor_sale",
				persona:    "buyer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					sale := fixedVendorSale()
					sale.User = loc.user()
					booth := fixedBooth()
					return c.SendVendorSaleEmail(ctx, booth, *fixedFestival(), sale)
				},
			},
		)
	}

	// Organizer GetValidProfileLanguage templates
	type orgLoc struct {
		locale string
		org    func() *model.FestivalOrganizer
	}
	orgLocales := []orgLoc{
		{"fr", func() *model.FestivalOrganizer { return fixedOrganizerWithLang(model.UserProfileLanguageFrench) }},
		{"es", func() *model.FestivalOrganizer { return fixedOrganizerWithLang(model.UserProfileLanguageSpanish) }},
		{"fa", func() *model.FestivalOrganizer { return fixedOrganizerWithLang(model.UserProfileLanguageFarsi) }},
		{"xx", func() *model.FestivalOrganizer {
			o := fixedOrganizer()
			o.User.ProfileLanguage = model.UserProfileLanguage("xx")
			o.User.Email = "organizer-xx@snapshot.invalid"
			return o
		}},
	}

	for _, loc := range orgLocales {
		loc := loc
		out = append(out,
			snapshotCase{
				templateID: "festival_approval_status_changed",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendFestivalApprovalStatusChangedToOrganizer(fixedFestival(), loc.org())
				},
			},
			snapshotCase{
				templateID: "festival_update_request_approved",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					req := fixedUpdateRequest()
					req.Status = model.FestivalUpdateRequestTotallyApproved
					return c.SendApprovedUpdateRequestToOrganizer(ctx, req, loc.org())
				},
			},
			snapshotCase{
				templateID: "festival_update_request_rejected",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					req := fixedUpdateRequest()
					req.Status = model.FestivalUpdateRequestRejected
					req.ReviewNote = "The proposed changes do not meet our guidelines."
					return c.SendRejectedUpdateRequestToOrganizer(ctx, req, loc.org())
				},
			},
			snapshotCase{
				templateID: "festival_donation",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendOrganizerDonation(ctx, *fixedUser(), *fixedFestival(), fixedDonation(), *loc.org())
				},
			},
			snapshotCase{
				templateID: "festival_ticket_sale",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendFestivalTicketSaleToOrganizer(ctx, fixedFestivalTicketSale(), loc.org())
				},
			},
			snapshotCase{
				templateID: "festival_add_on_sale",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendFestivalAddOnSaleToOrganizer(ctx, fixedAddOnSale(), loc.org(), true)
				},
			},
			snapshotCase{
				templateID: "festival_activity_sale",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendActivitySaleToOrganizer(ctx, *loc.org(), fixedActivitySale())
				},
			},
			snapshotCase{
				templateID: "festival_sales",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendFestivalSaleToOrganizer(ctx, fixedFestivalSale(), *loc.org())
				},
			},
			snapshotCase{
				templateID: "festival_sponsor_sale",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendSponsorSaleToOrganizer(ctx, *loc.org(), fixedSponsorSale())
				},
			},
			snapshotCase{
				templateID: "festival_payout",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendPayoutEmailToOrganizer(fixedFestival(), fixedWeeklyFinance(), loc.org())
				},
			},
			snapshotCase{
				templateID: "dispute_notification",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendDisputeNotificationToOrganizer(ctx, loc.org(), fixedDisputeNotificationData())
				},
			},
			snapshotCase{
				templateID: "needs_response_dispute_reminder",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendNeedsResponseDisputeReminderToOrganizer(ctx, loc.org(), fixedDisputeReminderData())
				},
			},
			snapshotCase{
				templateID: "marketing_package_sale",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					sale := fixedMarketingPackageSale()
					sale.Organizer = loc.org()
					return c.SendMarketingPackageSaleToOrganizer(ctx, sale)
				},
			},
			snapshotCase{
				templateID: "refund_receipt_organizer",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendRefundItemsToOrganizer(ctx, fixedRefundUser(), loc.org(), fixedFestival(), fixedRefundParams())
				},
			},
			snapshotCase{
				templateID: "festival_ticket_registration",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendTicketRegistrationToOrganizer(ctx, fixedTicketRegistration(), loc.org())
				},
			},
			snapshotCase{
				templateID: "festival_sale_installment_paid",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					sale := fixedFestivalSale()
					item := fixedSaleItemWithInstallment()
					booth := fixedBooth()
					return c.SendOrganizerPaidInstallment(ctx, &sale, fixedVendor(), fixedFestival(), item.Installment, fixedInstallmentMethod(), loc.org(), &booth)
				},
			},
			snapshotCase{
				templateID: "second_payment_reminder",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					booth := fixedBooth()
					item := fixedSaleItemWithInstallment()
					return c.SendOrganizerSecondPaymentReminder(ctx, fixedVendor(), fixedFestival(), fixedInstallmentMethod(), &booth, item, loc.org())
				},
			},
			snapshotCase{
				templateID: "first_payment_refund",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					booth := fixedBooth()
					item := fixedSaleItemWithInstallment()
					return c.SendOrganizerFirstPaymentRefund(ctx, fixedVendor(), loc.org(), fixedFestival(), fixedInstallmentMethod(), &booth, item)
				},
			},
			snapshotCase{
				templateID: "sponsor_installment_paid",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendSponsorInstallmentPaidToOrganizer(ctx, fixedSponsorInstallment(), loc.org())
				},
			},
			snapshotCase{
				templateID: "sponsor_installment_second_payment_reminder",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendInstallmentSecondPaymentReminderToOrganizer(ctx, fixedSponsorInstallment(), loc.org())
				},
			},
			snapshotCase{
				templateID: "sponsor_first_payment_refund",
				persona:    "organizer",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					return c.SendSponsorFirstPaymentRefundToOrganizer(ctx, fixedSponsorInstallment(), loc.org())
				},
			},
		)
	}

	// Vendor GetValidProfileLanguage templates
	type vendorLoc struct {
		locale string
		vendor func() *model.FestivalVendor
	}
	vendorLocales := []vendorLoc{
		{"fr", func() *model.FestivalVendor { return fixedVendorWithLang(model.UserProfileLanguageFrench) }},
		{"es", func() *model.FestivalVendor { return fixedVendorWithLang(model.UserProfileLanguageSpanish) }},
		{"fa", func() *model.FestivalVendor { return fixedVendorWithLang(model.UserProfileLanguageFarsi) }},
		{"xx", func() *model.FestivalVendor {
			v := fixedVendor()
			v.User.ProfileLanguage = model.UserProfileLanguage("xx")
			v.User.Email = "vendor-xx@snapshot.invalid"
			return v
		}},
	}

	for _, loc := range vendorLocales {
		loc := loc
		out = append(out,
			snapshotCase{
				templateID: "festival_sales",
				persona:    "vendor",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					sale := fixedFestivalSale()
					sale.Vendor = loc.vendor()
					return c.SendFestivalSaleToVendor(ctx, sale)
				},
			},
			snapshotCase{
				templateID: "festival_sale_installment_paid",
				persona:    "vendor",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					sale := fixedFestivalSale()
					item := fixedSaleItemWithInstallment()
					booth := fixedBooth()
					return c.SendVendorPaidInstallment(ctx, &sale, loc.vendor(), fixedFestival(), item.Installment, fixedInstallmentMethod(), &booth)
				},
			},
			snapshotCase{
				templateID: "second_payment_reminder",
				persona:    "vendor",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					booth := fixedBooth()
					item := fixedSaleItemWithInstallment()
					return c.SendVendorSecondPaymentReminder(ctx, loc.vendor(), fixedFestival(), fixedInstallmentMethod(), &booth, item)
				},
			},
			snapshotCase{
				templateID: "first_payment_refund",
				persona:    "vendor",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					booth := fixedBooth()
					item := fixedSaleItemWithInstallment()
					return c.SendVendorFirstPaymentRefund(ctx, loc.vendor(), fixedFestival(), fixedInstallmentMethod(), &booth, item)
				},
			},
			snapshotCase{
				templateID: "festival_vendor_sale",
				persona:    "vendor",
				locale:     loc.locale,
				invoke: func(ctx context.Context, c *smtpClient) error {
					booth := fixedBooth()
					return c.SendVendorSaleEmailToVendor(ctx, *loc.vendor(), booth, *fixedFestival(), fixedVendorSale())
				},
			},
		)
	}

	return out
}

func p3EdgeCases() []snapshotCase {
	return []snapshotCase{
		{
			templateID: "festival_ticket_sale",
			persona:    "buyer_user_edge_long",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendFestivalTicketSaleToBuyerUser(ctx, fixedFestivalTicketSaleEdgeLongNames())
			},
		},
		{
			templateID: "festival_ticket_sale",
			persona:    "buyer_user_edge_10tickets",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendFestivalTicketSaleToBuyerUser(ctx, fixedFestivalTicketSaleEdge10Tickets())
			},
		},
		{
			templateID: "festival_ticket_sale",
			persona:    "buyer_user_edge_noimages",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendFestivalTicketSaleToBuyerUser(ctx, fixedFestivalTicketSaleMissingImages())
			},
		},
		{
			templateID: "festival_ticket_sale",
			persona:    "buyer_user_edge_zero",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendFestivalTicketSaleToBuyerUser(ctx, fixedFestivalTicketSaleZeroAmount())
			},
		},
		{
			templateID: "refund_receipt_user",
			persona:    "user_edge_20items",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendRefundItemsToTargetUser(ctx, fixedRefundUser(), fixedFestival(), fixedRefundParamsEmptyNote20Items())
			},
		},
		{
			templateID: "festival_ticket_registration",
			persona:    "buyer_user_edge_noimages",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendTicketRegistrationToBuyerUser(ctx, fixedTicketRegistrationMissingOrganizerLogo())
			},
		},
		{
			templateID: "registration_approval_status_changed",
			persona:    "user_edge_emptynote",
			locale:     "en",
			invoke: func(ctx context.Context, c *smtpClient) error {
				return c.SendRegistrationApprovalStatusChangedToUser(ctx, fixedRegistrationRequestEmptyNote())
			},
		},
	}
}
