package email

// legacy_snapshot_p3_fixtures_test.go — P3 verification fixtures (wallet, locales, edges).
// Test-only. Does not change production Send* behavior.

import (
	"database/sql"
	"fmt"
	"strings"

	"zemind.ca/rescounts/model"
)

// fixedPkpassBytes is deterministic Apple Wallet pass content for MIME parity.
var fixedPkpassBytes = []byte("FIXED-PKPASS-CONTENT-FOR-P3-SNAPSHOT")

const fixedGoogleWalletPassLink = "https://pay.google.com/gp/v/save/FIXED-PASS-P3-001"

// ── Locale helpers ────────────────────────────────────────────────────────────

func fixedUserWithLang(lang model.UserProfileLanguage) *model.User {
	u := fixedUser()
	u.ProfileLanguage = lang
	u.Email = fmt.Sprintf("buyer-%s@snapshot.invalid", lang)
	return u
}

func fixedUserFR() *model.User { return fixedUserWithLang(model.UserProfileLanguageFrench) }
func fixedUserES() *model.User { return fixedUserWithLang(model.UserProfileLanguageSpanish) }
func fixedUserFA() *model.User { return fixedUserWithLang(model.UserProfileLanguageFarsi) }

// fixedUserUnknown uses an unsupported profile language; GetValidProfileLanguage → en.
func fixedUserUnknown() *model.User {
	u := fixedUser()
	u.ProfileLanguage = model.UserProfileLanguage("xx")
	u.Email = "buyer-xx@snapshot.invalid"
	return u
}

func fixedOrganizerWithLang(lang model.UserProfileLanguage) *model.FestivalOrganizer {
	o := fixedOrganizer()
	o.User.ProfileLanguage = lang
	o.User.Email = fmt.Sprintf("organizer-%s@snapshot.invalid", lang)
	return o
}

func fixedVendorWithLang(lang model.UserProfileLanguage) *model.FestivalVendor {
	v := fixedVendor()
	v.User.ProfileLanguage = lang
	v.User.Email = fmt.Sprintf("vendor-%s@snapshot.invalid", lang)
	return v
}

// ── Wallet fixtures (festival_ticket_sale) ────────────────────────────────────

// fixedFestivalTicketSaleWithWallet returns a buyer ticket sale with Google + Apple
// wallet data on each ticket. nTickets must be >= 1.
func fixedFestivalTicketSaleWithWallet(nTickets int) *model.FestivalTicketSale {
	sale := fixedFestivalTicketSale()
	if nTickets < 1 {
		nTickets = 1
	}
	ticketType := sale.Tickets[0].FestivalTicketType
	tickets := make([]*model.FestivalTicket, 0, nTickets)
	for i := 0; i < nTickets; i++ {
		fn := fmt.Sprintf("Alice%d", i+1)
		ln := "Snapshot"
		em := fmt.Sprintf("buyer-wallet-%d@snapshot.invalid", i+1)
		tickets = append(tickets, &model.FestivalTicket{
			TicketID:             fmt.Sprintf("ticket-wallet-%03d", i+1),
			TicketTypeID:         ticketType.TicketTypeID,
			SaleID:               sale.SaleID,
			Cost:                 3000,
			CostTax:              390,
			Quantity:             1,
			FirstName:            sql.NullString{String: fn, Valid: true},
			LastName:             sql.NullString{String: ln, Valid: true},
			Email:                sql.NullString{String: em, Valid: true},
			Code:                 sql.NullString{String: fmt.Sprintf("CODE-W-%03d", i+1), Valid: true},
			FestivalTicketType:   ticketType,
			GoogleWalletPassLink: fmt.Sprintf("%s-%d", fixedGoogleWalletPassLink, i+1),
			AppleWalletPassFile:  append([]byte(nil), fixedPkpassBytes...),
		})
	}
	sale.Tickets = tickets
	sale.Cost = int64(3000 * nTickets)
	sale.CostTax = int64(390 * nTickets)
	return sale
}

// ── Edge fixtures ─────────────────────────────────────────────────────────────

func fixedFestivalTicketSaleEdgeLongNames() *model.FestivalTicketSale {
	sale := fixedFestivalTicketSaleWithWallet(1)
	longName := strings.Repeat("VeryLongName", 20) // 240 chars
	longTitle := strings.Repeat("FestivalTitle ", 15)
	sale.Festival.Name = longTitle
	sale.User.FirstName = longName
	sale.User.LastName = longName
	sale.Tickets[0].FirstName = sql.NullString{String: longName, Valid: true}
	sale.Tickets[0].LastName = sql.NullString{String: longName, Valid: true}
	return sale
}

func fixedFestivalTicketSaleEdge10Tickets() *model.FestivalTicketSale {
	return fixedFestivalTicketSaleWithWallet(10)
}

func fixedFestivalTicketSaleMissingImages() *model.FestivalTicketSale {
	sale := fixedFestivalTicketSale()
	// OrganizerLogo in templates is derived from Festival.LogoImage.
	sale.Festival.LogoImage = nil
	return sale
}

func fixedFestivalTicketSaleZeroAmount() *model.FestivalTicketSale {
	sale := fixedFestivalTicketSale()
	sale.Cost = 0
	sale.CostTax = 0
	sale.Tickets[0].Cost = 0
	sale.Tickets[0].CostTax = 0
	if sale.Tickets[0].FestivalTicketType != nil {
		// Price field was removed upstream; ticket Cost/CostTax above control this fixture.
	}
	return sale
}

func fixedRefundParamsEmptyNote20Items() *model.RefundParams {
	p := fixedRefundParams()
	p.RefundedItems = make([]*model.RefundedItem, 0, 20)
	for i := 0; i < 20; i++ {
		p.RefundedItems = append(p.RefundedItems, &model.RefundedItem{
			ItemID:               fmt.Sprintf("ticket-edge-%03d", i+1),
			BaseTypeID:           "ticket-type-fixed-001",
			ItemType:             model.RefundItemTypeTicket,
			Name:                 fmt.Sprintf("Edge Ticket Item %d", i+1),
			Quantity:             1,
			Cost:                 100,
			Tax:                  13,
			TotalRefundedForItem: 113,
		})
	}
	return p
}

func fixedTicketRegistrationMissingOrganizerLogo() *model.FestivalTicketRegistration {
	reg := fixedTicketRegistration()
	reg.Festival.LogoImage = nil
	return reg
}

func fixedRegistrationRequestEmptyNote() RegistrationRequest {
	req := fixedRegistrationRequest()
	req.ReviewNote = nil
	return req
}
