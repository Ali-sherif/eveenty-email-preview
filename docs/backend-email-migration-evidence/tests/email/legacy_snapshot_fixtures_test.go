package email

// legacy_snapshot_fixtures_test.go — fixed fixture builders for all model types
// used by the snapshot test cases.
//
// All time values use fixedTime (2026-03-15 12:00:00 UTC) so golden files are
// fully deterministic.  All IDs use human-readable sentinel strings.
// No database or network calls are made.

import (
	"database/sql"
	"time"

	"zemind.ca/rescounts/model"
)

// ── Fixed time anchor ────────────────────────────────────────────────────────

// fixedTime is the canonical timestamp used across all fixtures.
var fixedTime = time.Date(2026, 3, 15, 12, 0, 0, 0, time.UTC)

// fixedDueDate is used for installment due dates (one month after fixedTime).
var fixedDueDate = fixedTime.Add(30 * 24 * time.Hour)

// ── User fixtures ─────────────────────────────────────────────────────────────

func fixedUser() *model.User {
	return &model.User{
		ID:              model.UserID("user-fixed-001"),
		FirstName:       "Alice",
		LastName:        "Snapshot",
		Email:           "buyer@snapshot.invalid",
		PhoneNumber:     "+15550001001",
		ProfileLanguage: model.UserProfileLanguageEnglish,
	}
}

func fixedUserAR() *model.User {
	u := fixedUser()
	u.ProfileLanguage = model.UserProfileLanguageArabic
	u.Email = "buyer-ar@snapshot.invalid"
	return u
}

// ── Festival fixtures ─────────────────────────────────────────────────────────

func fixedFestival() *model.Festival {
	addr := "100 Snap Street, Toronto ON M5H 2N2"
	desc := "Snapshot festival description"
	logo := "logo-fixed-001"
	phone := "+14160000001"
	place := "Snapshot Arena"
	return &model.Festival{
		FestivalID:  "festival-fixed-001",
		Name:        "Snapshot Festival 2026",
		Description: &desc,
		StartTime:   fixedTime,
		EndTime:     fixedTime.Add(48 * time.Hour),
		TimeZone:    "America/Toronto",
		Address:     &addr,
		PhoneNumber: &phone,
		PlaceName:   &place,
		LogoImage:   &logo,
		Currency:    "CAD",
		Latitude:    43.6532,
		Longitude:   -79.3832,
		Organizers:  []*model.FestivalOrganizer{fixedOrganizer()},
		Published:   true,
	}
}

// ── Organizer fixtures ────────────────────────────────────────────────────────

func fixedOrganizer() *model.FestivalOrganizer {
	biz := "Snapshot Events Inc."
	addr := "200 Snap Ave, Toronto ON M5B 2K3"
	return &model.FestivalOrganizer{
		OrganizerID:        "organizer-fixed-001",
		BusinessName:       &biz,
		Address:            &addr,
		PrimaryOrganizer:   true,
		ReceiveSalesEmails: true,
		User: &model.User{
			ID:              model.UserID("organizer-user-001"),
			FirstName:       "Bob",
			LastName:        "Organizer",
			Email:           "organizer@snapshot.invalid",
			PhoneNumber:     "+14161000001",
			ProfileLanguage: model.UserProfileLanguageEnglish,
		},
	}
}

// ── Vendor fixtures ───────────────────────────────────────────────────────────

func fixedVendor() *model.FestivalVendor {
	biz := "Snap Foods Co."
	addr := "300 Vendor Lane, Toronto ON M4C 1A1"
	return &model.FestivalVendor{
		VendorID:     "vendor-fixed-001",
		BusinessName: &biz,
		Address:      &addr,
		User: &model.User{
			ID:              model.UserID("vendor-user-001"),
			FirstName:       "Charlie",
			LastName:        "Vendor",
			Email:           "vendor@snapshot.invalid",
			PhoneNumber:     "+14162000001",
			ProfileLanguage: model.UserProfileLanguageEnglish,
		},
	}
}

// ── Restaurant fixtures ───────────────────────────────────────────────────────

func fixedRestaurant() *model.Restaurant {
	return &model.Restaurant{
		ID:          model.RestaurantID("restaurant-fixed-001"),
		Name:        "Snap Kitchen",
		Address:     "400 Main St, Toronto ON M5T 1Z5",
		PhoneNumber: "+14163000001",
		Currency:    "CAD",
		Thumbnail:   "https://cdn.snapshot.invalid/restaurant-thumb.jpg",
	}
}

// ── FestivalSale fixtures ─────────────────────────────────────────────────────

func fixedBoothName() string { return "Snap Booth A1" }

func fixedFestivalSale() model.FestivalSale {
	boothName := fixedBoothName()
	boothPrice := int64(50000) // $500.00 CAD
	booth := &model.FestivalBooth{
		BoothID:    "booth-fixed-001",
		FestivalID: "festival-fixed-001",
		Name:       &boothName,
		Price:      boothPrice,
	}
	return model.FestivalSale{
		SaleID:        "sale-fixed-001",
		FestivalID:    "festival-fixed-001",
		UserID:        "vendor-user-001",
		Cost:          50000,
		CostTax:       6500,
		Currency:      "CAD",
		SaleStatus:    model.SaleStatusApproved,
		SoldAt:        fixedTime,
		PaymentMethod: model.PaymentMethodCreditCard,
		Festival:      fixedFestival(),
		Vendor:        fixedVendor(),
		SaleItems: []*model.FestivalSaleItem{
			{
				SaleItemID: "sale-item-fixed-001",
				SaleID:     "sale-fixed-001",
				ItemType:   "booth",
				Quantity:   1,
				Cost:       50000,
				CostTax:    6500,
				ItemBooth:  booth,
			},
		},
	}
}

// ── FestivalTicketSale fixtures ───────────────────────────────────────────────

func fixedFestivalTicketSale() *model.FestivalTicketSale {
	paidAt := fixedTime
	user := fixedUser()
	festival := fixedFestival()
	firstName := "Alice"
	lastName := "Snapshot"
	email := "buyer@snapshot.invalid"

	ticketType := &model.FestivalTicketType{
		TicketTypeID: "ticket-type-fixed-001",
		FestivalID:   "festival-fixed-001",
		Name:         "General Admission",
// Upstream FestivalTicketType.Price removed; purchase Cost fixture retained.
	}

	return &model.FestivalTicketSale{
		SaleID:     "ticket-sale-fixed-001",
		UserID:     model.UserID("user-fixed-001"),
		FestivalID: "festival-fixed-001",
		Paid:       true,
		PaidAt:     &paidAt,
		Cost:       3000, // $30.00
		CostTax:    390,
		Currency:   "CAD",
		FirstName:  &firstName,
		LastName:   &lastName,
		Email:      &email,
		User:       user,
		Festival:   festival,
		DisplaySettings: &model.FestivalTicketDisplaySettings{
			FestivalID: "festival-fixed-001",
			ShowPrices: true,
		},
		Tickets: []*model.FestivalTicket{
			{
				TicketID:           "ticket-fixed-001",
				TicketTypeID:       "ticket-type-fixed-001",
				SaleID:             "ticket-sale-fixed-001",
				Cost:               3000,
				CostTax:            390,
				Quantity:           1,
				FirstName:          sql.NullString{String: firstName, Valid: true},
				LastName:           sql.NullString{String: lastName, Valid: true},
				Email:              sql.NullString{String: email, Valid: true},
				FestivalTicketType: ticketType,
			},
		},
	}
}

// ── FestivalTicket fixture ────────────────────────────────────────────────────

func fixedFestivalTicket() *model.FestivalTicket {
	firstName := "Alice"
	lastName := "Snapshot"
	email := "buyer@snapshot.invalid"
	return &model.FestivalTicket{
		TicketID:     "ticket-fixed-001",
		TicketTypeID: "ticket-type-fixed-001",
		SaleID:       "ticket-sale-fixed-001",
		Cost:         3000,
		CostTax:      390,
		Quantity:     1,
		FirstName:    sql.NullString{String: firstName, Valid: true},
		LastName:     sql.NullString{String: lastName, Valid: true},
		Email:        sql.NullString{String: email, Valid: true},
		FestivalTicketType: &model.FestivalTicketType{
			TicketTypeID: "ticket-type-fixed-001",
			FestivalID:   "festival-fixed-001",
			Name:         "General Admission",
// Upstream FestivalTicketType.Price removed; purchase Cost fixture retained.
		},
	}
}

// ── FestivalAddOnSale fixtures ────────────────────────────────────────────────

func fixedAddOnSale() *model.FestivalAddOnSale {
	user := fixedUser()
	festival := fixedFestival()
	addOnID := model.FestivalAddOnID("addon-fixed-001")
	addOnName := "VIP Parking Pass"
	return &model.FestivalAddOnSale{
		SaleID:     "addon-sale-fixed-001",
		FestivalID: "festival-fixed-001",
		UserID:     model.UserID("user-fixed-001"),
		CreatedAt:  fixedTime,
		Cost:       2000,
		CostTax:    260,
		Currency:   "CAD",
		User:       user,
		Festival:   festival,
		Items: []*model.FestivalAddOnSaleItem{
			{
				ItemID:   "addon-item-fixed-001",
				SaleID:   "addon-sale-fixed-001",
				AddOnID:  addOnID,
				Quantity: 1,
				Cost:     2000,
				CostTax:  260,
				AddOnSnapshot: &model.FestivalAddOnSnapshot{
					ID:    addOnID,
					Name:  addOnName,
					Price: 2000,
				},
			},
		},
	}
}

// ── FestivalActivitySale fixtures ─────────────────────────────────────────────

func fixedActivitySale() model.FestivalActivitySale {
	user := fixedUser()
	festival := fixedFestival()
	soldAt := fixedTime
	return model.FestivalActivitySale{
		SaleID:     "activity-sale-fixed-001",
		FestivalID: "festival-fixed-001",
		UserID:     "user-fixed-001",
		SoldAt:     &soldAt,
		Cost:       1500,
		CostTax:    195,
		Currency:   "CAD",
		User:       user,
		Festival:   festival,
		SaleItems: []*model.FestivalActivitySaleItem{
			{
				SaleItemID: "activity-item-fixed-001",
				SaleID:     "activity-sale-fixed-001",
				SlotID:     "slot-fixed-001",
				KidName:    "Tommy Snapshot",
				KidAge:     7,
				Cost:       1500,
				CostTax:    195,
				WaiverID:   ptrStr("waiver-fixed-001"),
				Slot: &model.FestivalKidsActivitySlot{
					SlotID:    "slot-fixed-001",
					StartTime: fixedTime,
					EndTime:   fixedTime.Add(2 * time.Hour),
					Activity: &model.FestivalKidsActivity{
						ActivityID:  "activity-fixed-001",
						FestivalID:  "festival-fixed-001",
						Name:        "Art Workshop",
						Description: "Creative art for kids",
						Price:       1500,
					},
				},
			},
		},
	}
}

// ── FestivalSponsorSale fixtures ──────────────────────────────────────────────

func fixedSponsorSale() model.FestivalSponsorSale {
	vendor := fixedVendor()
	festival := fixedFestival()
	soldAt := fixedTime
	pkgName := "Gold Sponsor Package"
	pkgDesc := "Premium sponsor placement"
	return model.FestivalSponsorSale{
		SaleID:        "sponsor-sale-fixed-001",
		FestivalID:    "festival-fixed-001",
		UserID:        "vendor-user-001",
		SoldAt:        &soldAt,
		Cost:          200000,
		CostTax:       26000,
		Currency:      "CAD",
		SaleStatus:    model.SaleStatusApproved,
		PaymentMethod: model.PaymentMethodCreditCard,
		Festival:      festival,
		Vendor:        vendor,
		SaleItems: []*model.FestivalSponsorSaleItem{
			{
				ItemID:    "sponsor-item-fixed-001",
				SaleID:    "sponsor-sale-fixed-001",
				PackageID: "sponsor-pkg-fixed-001",
				Quantity:  1,
				Cost:      200000,
				CostTax:   26000,
				Package: &model.FestivalSponsorPackage{
					PackageID:          "sponsor-pkg-fixed-001",
					FestivalID:         "festival-fixed-001",
					PackageName:        pkgName,
					PackageDescription: pkgDesc,
					PackagePrice:       200000,
				},
			},
		},
	}
}

// ── SponsorSaleItemInstallment fixtures ──────────────────────────────────────

func fixedSponsorInstallment() *model.SponsorSaleItemInstallment {
	dueDate := fixedDueDate
	vendor := fixedVendor()
	festival := fixedFestival()
	sale := fixedSponsorSale()
	saleItem := sale.SaleItems[0]

	installmentMethod := &model.FestivalInstallmentMethod{
		InstallmentMethodID:   "installment-method-fixed-001",
		DownPaymentPrecentage: 0.5, // 50% down payment
		DueDate:               &dueDate,
	}

	saleItem.Sale = &sale

	return &model.SponsorSaleItemInstallment{
		SaleItemInstallmentID: "sponsor-installment-fixed-001",
		UserID:                "vendor-user-001",
		FestivalID:            "festival-fixed-001",
		Cost:                  100000,
		CostTax:               13000,
		ProcessingFeesAmount:  3000,
		ProcessingFeesTax:     390,
		Vendor:                vendor,
		Festival:              festival,
		SaleItem:              saleItem,
		InstallmentMethod:     installmentMethod,
	}
}

// ── FestivalSaleItemInstallment fixtures ─────────────────────────────────────

func fixedVendorInstallment() *model.FestivalSaleItemInstallment {
	dueDate := fixedDueDate
	return &model.FestivalSaleItemInstallment{
		SaleItemInstallmentID: "vendor-installment-fixed-001",
		UserID:                "vendor-user-001",
		Cost:                  25000,
		CostTax:               3250,
		ProcessingFeesAmount:  750,
		ProcessingFeesTax:     98,
		Paid:                  true,
		PaidAt:                &fixedTime,
		InstallmentMethod: &model.FestivalInstallmentMethod{
			InstallmentMethodID:   "installment-method-fixed-001",
			DownPaymentPrecentage: 0.5,
			DueDate:               &dueDate,
		},
	}
}

// ── FestivalBooth fixtures ────────────────────────────────────────────────────

func fixedBooth() model.FestivalBooth {
	boothName := fixedBoothName()
	return model.FestivalBooth{
		BoothID:    "booth-fixed-001",
		FestivalID: "festival-fixed-001",
		Name:       &boothName,
		Price:      50000,
		Vendor:     fixedVendor(),
	}
}

// ── FestivalInstallmentMethod fixtures ───────────────────────────────────────

func fixedInstallmentMethod() *model.FestivalInstallmentMethod {
	dueDate := fixedDueDate
	return &model.FestivalInstallmentMethod{
		InstallmentMethodID:   "installment-method-fixed-001",
		DownPaymentPrecentage: 0.5,
		DueDate:               &dueDate,
	}
}

// ── FestivalSaleItem with installment ────────────────────────────────────────

func fixedSaleItemWithInstallment() *model.FestivalSaleItem {
	boothName := fixedBoothName()
	booth := &model.FestivalBooth{
		BoothID:    "booth-fixed-001",
		FestivalID: "festival-fixed-001",
		Name:       &boothName,
		Price:      50000,
	}
	return &model.FestivalSaleItem{
		SaleItemID:  "sale-item-fixed-inst-001",
		SaleID:      "sale-fixed-inst-001",
		ItemType:    "booth",
		Quantity:    1,
		Cost:        25000,
		CostTax:     3250,
		ItemBooth:   booth,
		Installment: fixedVendorInstallment(),
	}
}

// ── DonationDetails fixtures ──────────────────────────────────────────────────

func fixedDonation() *model.DonationDetails {
	return &model.DonationDetails{
		DonationID: "donation-fixed-001",
		UserID:     "user-fixed-001",
		FestivalID: "festival-fixed-001",
		Cost:       5000,
		Tax:        650,
		TotalPaid:  5650,
		DonatedAt:  fixedTime,
		Currency:   "CAD",
	}
}

// ── Partner / Coupon fixtures ─────────────────────────────────────────────────

func fixedPartner() model.Partner {
	lat := "43.6532"
	lon := "-79.3832"
	return model.Partner{
		PartnerID: model.PartnerID("partner-fixed-001"),
		Name:      "Snap Partners",
		Address:   "500 Partner Blvd, Toronto ON M5V 1A1",
		Phone:     "+14164000001",
		Latitude:  &lat,
		Longitude: &lon,
	}
}

func fixedCouponItems() []model.CouponItem {
	return []model.CouponItem{
		{
			FirstName: "Alice",
			LastName:  "Snapshot",
			Quantity:  2,
		},
	}
}

func fixedCoupons() []model.Coupon {
	validFrom := fixedTime
	validTo := fixedTime.Add(30 * 24 * time.Hour)
	return []model.Coupon{
		{
			CouponID:    "coupon-fixed-001",
			Description: "Snapshot coupon - 10% Off",
			ValidFrom:   &validFrom,
			ValidTo:     &validTo,
		},
	}
}

func fixedCouponPaymentDetails() []model.CouponPaymentDetails {
	return []model.CouponPaymentDetails{
		{
			Cost:           1000,
			CostTax:        130,
			ProcessingFees: 30,
		},
	}
}

// ── FestivalVendorSale fixtures ───────────────────────────────────────────────

func fixedVendorSale() model.FestivalVendorSale {
	user := fixedUser()
	festival := fixedFestival()
	booth := fixedBooth()
	expectedCompletion := fixedTime.Add(30 * time.Minute)
	return model.FestivalVendorSale{
		SaleID:                 "vendor-sale-fixed-001",
		UserID:                 "user-fixed-001",
		BoothID:                "booth-fixed-001",
		SoldAt:                 fixedTime,
		Cost:                   800,
		CostTax:                104,
		Currency:               "CAD",
		FirstName:              "Alice",
		LastName:               "Snapshot",
		Email:                  "buyer@snapshot.invalid",
		ExpectedCompletionTime: expectedCompletion,
		User:                   user,
		Festival:               festival,
		Booth:                  &booth,
		SaleItems: []*model.FestivalVendorSaleProduct{
			{
				SaleProductID: "vendor-product-fixed-001",
				SaleID:        "vendor-sale-fixed-001",
				ProductID:     "product-fixed-001",
				Quantity:      2,
				Cost:          400,
				CostTax:       52,
				Product: &model.FestivalVendorProduct{
					ProductID:               "product-fixed-001",
					Name:                    "Snap Burger",
					Price:                   200,
					PrepartionTimeInSeconds: 300,
				},
			},
		},
	}
}

// ── FestivalVendorSaleRejection fixtures ──────────────────────────────────────

func fixedVendorSaleRejection() *model.FestivalVendorSaleRejection {
	reason := model.VendorSaleRejectionReasonOutOfStock
	return &model.FestivalVendorSaleRejection{
		ID:     "rejection-fixed-001",
		Reason: &reason,
		Note:   "Item ran out of stock during the event",
	}
}

// ── MarketingPackageSale fixtures ─────────────────────────────────────────────

func fixedMarketingPackageSale() *model.MarketingPackageSale {
	organizer := fixedOrganizer()
	pkgName := "Social Blast Package"
	return &model.MarketingPackageSale{
		SaleID:    "mkt-sale-fixed-001",
		SoldAt:    fixedTime,
		UserID:    model.UserID("organizer-user-001"),
		Cost:      15000,
		CostTax:   1950,
		Currency:  "CAD",
		Organizer: organizer,
		SaleItems: []*model.MarketingPackageSaleItem{
			{
				SaleItemID: "mkt-item-fixed-001",
				SaleID:     "mkt-sale-fixed-001",
				PackageID:  "mkt-pkg-fixed-001",
				Cost:       15000,
				CostTax:    1950,
				MarketingPackage: &model.MarketingPackage{
					PackageID: "mkt-pkg-fixed-001",
					Name:      pkgName,
					Price:     15000,
				},
			},
		},
	}
}

// ── FestivalUpdateRequest fixtures ───────────────────────────────────────────

func fixedUpdateRequest() *model.FestivalUpdateRequest {
	festival := fixedFestival()
	organizer := fixedOrganizer()
	return &model.FestivalUpdateRequest{
		RequestID:          "update-req-fixed-001",
		FestivalID:         "festival-fixed-001",
		SubmittedBy:        model.UserID("organizer-user-001"),
		CreatedAt:          fixedTime,
		UpdatedAt:          fixedTime,
		Status:             model.FestivalUpdateRequestPending,
		Festival:           festival,
		SubmitterOrganizer: organizer,
		Updates: model.FestivalUpdateItems{
			{
				ItemKey:     "festival_name",
				Description: "Festival name changed to Snapshot Festival 2026",
				Accepted:    true,
			},
		},
	}
}

// ── FestivalWeeklyFinance fixtures ────────────────────────────────────────────

func fixedWeeklyFinance() *model.FestivalWeeklyFinance {
	return &model.FestivalWeeklyFinance{
		FestivalID:        "festival-fixed-001",
		WeekStart:         fixedTime.Add(-7 * 24 * time.Hour),
		WeekEnd:           fixedTime,
		TransferDate:      fixedTime.Add(2 * 24 * time.Hour),
		NetRevenue:        250000,
		TransferredAmount: 250000,
	}
}

// ── ContactSubmission fixtures ────────────────────────────────────────────────

func fixedContactSubmission() *model.ContactSubmission {
	return &model.ContactSubmission{
		SubmissionID: "contact-fixed-001",
		CreatedAt:    fixedTime,
		Name:         "Carol Contact",
		Email:        "contact@snapshot.invalid",
		PhoneNumber:  "+14165000001",
		BusinessName: "Snap Corp",
		Subject:      model.SUBJECT_GENERAL,
		Message:      "Hello, this is a snapshot contact message.",
	}
}

// ── BookDemoSubmission fixtures ───────────────────────────────────────────────

func fixedBookDemo() *model.BookDemoSubmission {
	return &model.BookDemoSubmission{
		ID:           "demo-fixed-001",
		CreatedAt:    fixedTime,
		UserFullName: "Dave Demo",
		Email:        "demo@snapshot.invalid",
		PhoneNumber:  "+14166000001",
		BusinessName: "Demo Events LLC",
		NeedHelpWith: model.NEED_HELP_EVENT_ORGANIZER,
		Message:      "We need help organizing our annual conference.",
		MeetFromTime: fixedTime.Add(24 * time.Hour),
		MeetToTime:   fixedTime.Add(25 * time.Hour),
		MeetLink:     "https://meet.snapshot.invalid/demo-fixed-001",
	}
}

// ── ExtraServiceRequest fixtures ──────────────────────────────────────────────

func fixedExtraServiceRequest() *model.ExtraServiceRequest {
	return &model.ExtraServiceRequest{
		RequestID:      "extra-svc-fixed-001",
		UserID:         "organizer-user-001",
		Email:          "organizer@snapshot.invalid",
		PhoneNumber:    "+14161000001",
		Services:       []string{"extra_tables", "stage_setup"},
		SpecialRequest: "Please set up 10 extra tables near the main stage.",
		CreatedAt:      fixedTime,
	}
}

// ── DisputeNotificationData fixtures ─────────────────────────────────────────

func fixedDisputeNotificationData() *DisputeNotificationData {
	festival := fixedFestival()
	saleUser := fixedUser()
	evidenceDue := fixedTime.Add(7 * 24 * time.Hour)
	return &DisputeNotificationData{
		Festival:         festival,
		SaleUser:         saleUser,
		DisputeReference: "dp_fixed_001",
		DisputedAmount:   3000,
		DisputeFees:      1500,
		Currency:         "CAD",
		DisputeStatus:    model.DisputeStatusNeedsResponse,
		DisputeReason:    "product_unacceptable",
		EvidenceDueBy:    &evidenceDue,
		TransactionItems: []model.DisputeTransactionTypeItem{
			model.DisputeTransactionTypeItemTickets,
		},
	}
}

// ── DisputeReminderNotificationData fixtures ──────────────────────────────────

func fixedDisputeReminderData() *DisputeReminderNotificationData {
	festival := fixedFestival()
	saleUser := fixedUser()
	evidenceDue := fixedTime.Add(2 * 24 * time.Hour)
	return &DisputeReminderNotificationData{
		Festival:         festival,
		SaleUser:         saleUser,
		DisputeReference: "dp_fixed_001",
		DisputedAmount:   3000,
		DisputeFees:      1500,
		Currency:         "CAD",
		DisputeStatus:    model.DisputeStatusNeedsResponse,
		DisputeReason:    "product_unacceptable",
		EvidenceDueBy:    evidenceDue,
		DaysRemaining:    2,
		IsLastReminder:   true,
	}
}

// ── RegistrationRequest fixtures ──────────────────────────────────────────────

func fixedRegistrationRequest() RegistrationRequest {
	reviewNote := "All looks good, approved!"
	return RegistrationRequest{
		FestivalName:    "Snapshot Festival 2026",
		Persona:         "user",
		UserName:        "Alice Snapshot",
		UserEmail:       "buyer@snapshot.invalid",
		Status:          model.RegistrationRequestStatusApproved,
		ReviewNote:      &reviewNote,
		ProfileLanguage: "en",
	}
}

// ── FestivalTicketRegistration fixtures ──────────────────────────────────────

func fixedTicketRegistration() *model.FestivalTicketRegistration {
	user := fixedUser()
	festival := fixedFestival()
	paymentDeadline := fixedDueDate
	return &model.FestivalTicketRegistration{
		ID:                "ticket-reg-fixed-001",
		CreatedAt:         fixedTime,
		UpdatedAt:         fixedTime,
		FestivalID:        "festival-fixed-001",
		UserID:            model.UserID("user-fixed-001"),
		CurrentStatus:     model.FestivalTicketRegistrationStatusPendingReview,
		ReviewPeriodDays:  7,
		ReviewDeadlineAt:  fixedDueDate,
		PaymentPeriodDays: 3,
		PaymentDeadlineAt: &paymentDeadline,
		User:              user,
		Festival:          festival,
		Items: []*model.FestivalTicketRegistrationItem{
			{
				ID:                           "ticket-reg-item-fixed-001",
				FestivalTicketRegistrationID: "ticket-reg-fixed-001",
				TicketTypeID:                 "ticket-type-fixed-001",
				FirstName:                    "Alice",
				LastName:                     "Snapshot",
				Email:                        "buyer@snapshot.invalid",
				PhoneNumber:                  "+15550001001",
				TicketType: &model.FestivalTicketType{
					TicketTypeID: "ticket-type-fixed-001",
					FestivalID:   "festival-fixed-001",
					Name:         "General Admission",
				},
			},
		},
	}
}

// ── RefundUser fixtures ───────────────────────────────────────────────────────

func fixedRefundUser() model.RefundUser {
	email := "buyer@snapshot.invalid"
	phone := "+15550001001"
	addr := "100 Snap Street, Toronto ON"
	return model.RefundUser{
		UserName:        "Alice Snapshot",
		UserEmail:       &email,
		UserPhoneNumber: &phone,
		UserAddress:     &addr,
		ProfileLanguage: "en",
	}
}

// ── RefundParams fixtures ─────────────────────────────────────────────────────

func fixedRefundParams() *model.RefundParams {
	refundDate := fixedTime
	return &model.RefundParams{
		RefundEmailCategory: model.RefundEmailCategoryTickets,
		RefundDate:          &refundDate,
		PaymentMethod:       model.RefundPaymentMethodCreditCard,
		RefundedItems: []*model.RefundedItem{
			{
				ItemID:               "ticket-fixed-001",
				BaseTypeID:           "ticket-type-fixed-001",
				ItemType:             model.RefundItemTypeTicket,
				Name:                 "General Admission",
				Quantity:             1,
				Cost:                 3000,
				Tax:                  390,
				TotalRefundedForItem: 3390,
			},
		},
	}
}

// ── Invoice fixtures ──────────────────────────────────────────────────────────

func fixedInvoice() *model.Invoice {
	return &model.Invoice{
		InvoiceNumber:     1001,
		RestaurantName:    "Snap Kitchen",
		RestaurantAddress: "400 Main St, Toronto ON",
		HSTNumber:         "123456789RT0001",
		Date:              fixedTime.Format("January 02, 2006"),
		Items: []*model.InvoiceItem{
			{
				Cost:        15000,
				Quantity:    1,
				Description: "Marketing Campaign - March 2026",
			},
		},
	}
}

// ── FestivalMarketingEmailRequest fixtures ────────────────────────────────────

func fixedFestivalMarketingEmailRequest() model.FestivalMarketingEmailRequest {
	return model.FestivalMarketingEmailRequest{
		RequestID:      "mkt-email-req-fixed-001",
		FestivalID:     "festival-fixed-001",
		FestivalEmail:  "info@snapshot.invalid",
		EmailSubject:   "Come Join Snapshot Festival 2026!",
		EmailBody:      "We are excited to invite you to our annual snapshot festival.",
		NumberOfEmails: 500,
		Cost:           25000,
	}
}

func fixedFestivalMarketingEmailTarget() *model.FestivalMarketingEmailTarget {
	return &model.FestivalMarketingEmailTarget{
		TargetID:       "user-fixed-001",
		TargetFullName: "Alice Snapshot",
		TargetEmail:    "buyer@snapshot.invalid",
		TargetType:     "user",
	}
}

func fixedFestivalMarketingSMSRequest() model.FestivalMarketingSMSRequest {
	return model.FestivalMarketingSMSRequest{
		RequestID:   "mkt-sms-req-fixed-001",
		FestivalID:  "festival-fixed-001",
		Message:     "Join Snapshot Festival 2026 - get your tickets now!",
		NumberOfSMS: 300,
		Cost:        15000,
	}
}

func fixedFestivalMarketingEmailByRescounts() model.FestivalMarketingEmailByRescounts {
	return model.FestivalMarketingEmailByRescounts{
		RequestID:    "rescounts-mkt-fixed-001",
		EmailSubject: "Eveenty Presents: Snapshot Festival 2026",
		EmailBody:    "Eveenty is proud to present an amazing event.",
	}
}

// ── RestaurantMarketingEmailRequest fixtures ──────────────────────────────────

func fixedRestaurantMarketingEmailRequest() *model.RestaurantMarketingEmailRequest {
	return &model.RestaurantMarketingEmailRequest{
		RequestID:      "rest-mkt-fixed-001",
		RestaurantID:   "restaurant-fixed-001",
		EmailSubject:   "Snap Kitchen: New Menu Items!",
		EmailBody:      "Check out our delicious new menu items.",
		EmailTemplate:  "template 1",
		NumberOfEmails: 200,
		Cost:           10000,
	}
}

func fixedRestaurantMarketingSMSRequest() *model.RestaurantMarketingSMSRequest {
	return &model.RestaurantMarketingSMSRequest{
		RequestID:    "rest-sms-fixed-001",
		RestaurantID: "restaurant-fixed-001",
		Message:      "Snap Kitchen is open! Come dine with us.",
		NumberOfSMS:  150,
		Cost:         7500,
	}
}

func fixedRescountsMarketingEmailRequest() *model.RescountsMarketingEmailRequest {
	return &model.RescountsMarketingEmailRequest{
		RequestID:      "rescounts-email-mkt-fixed-001",
		EmailSubject:   "Eveenty: Discover Amazing Events",
		EmailBody:      "Browse thousands of events near you on Eveenty.",
		EmailTemplate:  "template 1",
		NumberOfEmails: 1000,
		Cost:           50000,
	}
}

func fixedRescountsMarketingSMSRequest() *model.RescountsMarketingSMSRequest {
	return &model.RescountsMarketingSMSRequest{
		RequestID:   "rescounts-sms-mkt-fixed-001",
		Message:     "Eveenty: New events near you! Check them out.",
		NumberOfSMS: 500,
		Cost:        25000,
	}
}

func fixedRescountsMarketingNotificationRequest() *model.RescountsMarketingNotificationRequest {
	return &model.RescountsMarketingNotificationRequest{
		RequestID:             "rescounts-notif-mkt-fixed-001",
		Title:                 "New Events Near You",
		Body:                  "Eveenty has great new events in your area.",
		NumberOfNotifications: 800,
		Cost:                  40000,
	}
}

func fixedRestaurantMarketingNotificationRequest() *model.RestaurantMarketingNotificationRequest {
	return &model.RestaurantMarketingNotificationRequest{
		RequestID:             "rest-notif-mkt-fixed-001",
		RestaurantID:          "restaurant-fixed-001",
		Title:                 "New Dishes at Snap Kitchen",
		Body:                  "We have exciting new dishes for you to try!",
		NumberOfNotifications: 300,
		Cost:                  15000,
	}
}

// ── SendingMarketingEmailParams fixtures ──────────────────────────────────────

func fixedSendingMarketingEmailParams() model.SendingMarketingEmailParams {
	user := fixedUser()
	return model.SendingMarketingEmailParams{
		User:           user,
		BodyText:       "Check out amazing deals at Snap Kitchen!",
		SubjectText:    "Exclusive Offers Just for You",
		EmailTemplate:  "template 1",
		MarketingReqID: "mkt-send-fixed-001",
		Restaurant:     fixedRestaurant(),
	}
}
