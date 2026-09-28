# VARIABLE CONTRACT - `festival_ticket_sale`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `festivalTicketSaleTemplateParams`
- **Note:** Heuristic match score=21 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName                 string
FromEmail                string
ToName                   string
ToEmail                  string
Subject                  string
BrandLogoURL             string
SendTo                   string
BuyerUserIdentifier      string // BuyerUserIdentifier is the buyer user name or email
TicketUserIdentifier     string // TicketUserIdentifier is the ticket user name or email
UserName                 string
UserEmail                string
UserPhoneNumber          string
UsingGuestFlow           bool
FestivalName             string
OrganizerBusinessName    string
OrganizerLogo            string
FestivalStartDateTime    string
FestivalEndDateTime      string
FestivalStartDate        string
FestivalEndDate          string
FestivalStartTime        string
FestivalEndTime          string
FestivalMap              string
FestivalPlaceName        string
FestivalAddress          string
FestivalDoorsOpenAt      string
Tickets                  []*utils.TicketInfo
Cost                     string
PromoCode                string
PromoCodeDiscount        string
GratuityFees             string
FacilityFees             string
ProcessingFees           string
ShowProcessingFees       bool
Tax                      string
Total                    string
UserCreditCardFees       string
PurchaseProtectionAmount string
SaleDate                 string
ContractLink             string
TermsAndConditions       []*model.FestivalTerm
SendingFees              string
ShowTicketPrice          bool
GoogleCalendarLink string
AppleCalendarLink  string
YahooCalendarLink  string
FestivalICSData    string
SponsoredImages      []SponsoredImage
SponsoredImagesLeft  []SponsoredImage
SponsoredImagesRight []SponsoredImage
RoomBooking *RoomBookingInfo
AddOns []*AddOnItemDisplayInfo
Donation *donationWithTicketInfo
HTMLLang string
HTMLDir  string // "ltr" or "rtl" - drives dir= attributes and text-align throughout the template
Locales  emailLocales.FestivalTicketEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_ticket_sale.template` (comments excluded):

- `{{ .FromName }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ template "header_4_localized" . }}`
- `{{ if eq .SendTo "buyerUser" }}`
- `{{ else }}`
- `{{ .Locales.Hello }}`
- `{{ .BuyerUserIdentifier }}`
- `{{ .Locales.BuyerRegistrationNote }}`
- `{{ .FestivalName }}`
- `{{ .Locales.CarryReceiptNote }}`
- `{{ else if eq .SendTo "guestUser" }}`
- `{{ .TicketUserIdentifier }}`
- `{{ .Locales.GuestBoughtNote }}`
- `{{ if .UsingGuestFlow }}`
- `{{ .Locales.AsGuestPrefix }}`
- `{{ .UserEmail }}`
- `{{ .Locales.AsUserPrefix }}`
- `{{ .UserName }}`
- `{{ .Locales.BoughtForNote }}`
- `{{ if .RoomBooking }}`
- `{{ .Locales.LabelEventName }}`
- `{{ .Locales.RoomPackageLabel }}`
- `{{ .RoomBooking.RoomPackageName }}`
- `{{ .Locales.RoomPackagePriceLabel }}`
- `{{ .RoomBooking.Price }}`
- `{{ .Locales.RoomAdultsCountLabel }}`
- `{{ .RoomBooking.NumberOfAdultGuests }}`
- `{{ .Locales.RoomChildrenCountLabel }}`
- `{{ .RoomBooking.NumberOfChildGuests }}`
- `{{ if .RoomBooking.CommaSeparatedAdultsNames }}`
- `{{ .Locales.RoomAdultNamesLabel }}`
- `{{ .RoomBooking.CommaSeparatedAdultsNames }}`
- `{{ if .RoomBooking.CommaSeparatedChildrenNames }}`
- `{{ .Locales.RoomChildrenNamesLabel }}`
- `{{ .RoomBooking.CommaSeparatedChildrenNames }}`
- `{{ if .Donation }}`
- `{{ .Locales.DonationAmountLabel }}`
- `{{ .Donation.DonationAmount }}`
- `{{ if gt (len .AddOns) 0 }}`
- `{{ .Locales.AddOnsLabel }}`
- `{{ .Locales.AddOnNameLabel }}`
- `{{ .Locales.AddOnPriceLabel }}`
- `{{ .Locales.AddOnQuantityLabel }}`
- `{{ range .AddOns }}`
- `{{ if eq $.HTMLDir "rtl" }}`
- `{{ .AddOnName }}`
- `{{ .AddOnPrice }}`
- `{{ .AddOnQuantity }}`
- `{{ $NumberOfTickets := len .Tickets }}`
- `{{ range $index, $ticket := .Tickets }}`
- `{{ $.Locales.LabelEventName }}`
- `{{ $.FestivalName }}`
- `{{ $ticket.QRCodeImageLink }}`
- `{{ $ticket.Code }}`
- `{{ $.Locales.TicketNumberLabel }}`
- `{{ inc $index }}`
- `{{ $NumberOfTickets }}`
- `{{ if $ticket.GoogleWalletPassLink }}`
- `{{ $ticket.GoogleWalletPassLink }}`
- `{{ if $ticket.AppleWalletPassFile }}`
- `{{ $.Locales.LabelName }}`
- `{{ $ticket.Name }}`
- `{{ if $.ShowTicketPrice }}`
- `{{ $.Locales.LabelPrice }}`
- `{{ $ticket.PricePerOne }}`
- `{{ $.Locales.LabelTicketType }}`
- `{{ $ticket.TicketType }}`
- `{{ $.Locales.LabelQuantity }}`
- `{{ $ticket.Quantity }}`
- `{{ if $.FestivalDoorsOpenAt }}`
- `{{ $.Locales.LabelDoorsOpenAt }}`
- `{{ $.FestivalDoorsOpenAt }}`
- `{{ $.Locales.LabelEventStart }}`
- `{{ $.FestivalStartDateTime }}`
- `{{ if $.FestivalEndDateTime }}`
- `{{ $.Locales.LabelEventEnd }}`
- `{{ $.FestivalEndDateTime }}`
- `{{ if $.FestivalPlaceName }}`
- `{{ $.Locales.LabelVenue }}`
- `{{ $.FestivalPlaceName }}`
- `{{ $.Locales.LabelLocation }}`
- `{{ $.FestivalAddress }}`
- `{{ if ne $.FestivalMap "" }}`
- `{{ $.FestivalMap }}`
- `{{ $.Locales.LabelViewMap }}`
- `{{ if .ShowTicketPrice }}`
- `{{ .Locales.OrderSummaryTitle }}`
- `{{ .Locales.OrderBookingDate }}`
- `{{ .SaleDate }}`
- `{{ .Locales.OrderNumTickets }}`
- `{{ .Locales.OrderRoomPackage }}`
- `{{ .Locales.OrderCost }}`
- `{{ .Cost }}`
- `{{ if .PromoCode }}`
- `{{ .Locales.OrderPromoCode }}`
- `{{ .PromoCode }}`
- `{{ .Locales.OrderPromoDiscount }}`
- `{{ .PromoCodeDiscount }}`
- `{{ if .GratuityFees }}`
- `{{ .Locales.OrderGratuityFees }}`
- `{{ .GratuityFees }}`
- `{{ if .FacilityFees }}`
- `{{ .Locales.OrderFacilityFees }}`
- `{{ .FacilityFees }}`
- `{{ if .ShowProcessingFees }}`
- `{{ .Locales.OrderProcessingFees }}`
- `{{ .ProcessingFees }}`
- `{{ .Locales.OrderTax }}`
- `{{ .Tax }}`
- `{{ if .UserCreditCardFees }}`
- `{{ .Locales.OrderCreditCardFees }}`
- `{{ .UserCreditCardFees }}`
- `{{ if .PurchaseProtectionAmount }}`
- `{{ .Locales.OrderPurchaseProtection }}`
- `{{ .PurchaseProtectionAmount }}`
- `{{ if .SendingFees }}`
- `{{ .Locales.OrderSMSDeliveryFee }}`
- `{{ .SendingFees }}`
- `{{ .Locales.OrderPaymentStatus }}`
- `{{ .Locales.OrderPaymentCompleted }}`
- `{{ .Locales.OrderTransactionTotal }}`
- `{{ .Locales.OrderTicketsTotal }}`
- `{{ .Total }}`
- `{{ .Locales.OrderStatementNote }}`
- `{{ if .OrganizerLogo }}`
- `{{ .OrganizerLogo }}`
- `{{ if .OrganizerBusinessName }}`
- `{{ .Locales.InfoPresentedBy }}`
- `{{ .OrganizerBusinessName }}`
- `{{ .Locales.InfoEventName }}`
- `{{ .Locales.InfoEventDate }}`
- `{{ .FestivalStartDate }}`
- `{{ if .FestivalEndDate }}`
- `{{ .FestivalEndDate }}`
- `{{ .Locales.InfoAddTo }}`
- `{{ .GoogleCalendarLink }}`
- `{{ .Locales.InfoGoogleCalendar }}`
- `{{ .AppleCalendarLink }}`
- `{{ .Locales.InfoAppleCalendar }}`
- `{{ .YahooCalendarLink }}`
- `{{ .Locales.InfoYahooCalendar }}`
- `{{ .Locales.InfoEventTime }}`
- `{{ .FestivalStartTime }}`
- `{{ if .FestivalEndTime }}`
- `{{ .FestivalEndTime }}`
- `{{ .Locales.InfoBuyerEmail }}`
- `{{ .Locales.InfoBuyerName }}`
- `{{ .Locales.InfoBuyerPhone }}`
- `{{ .UserPhoneNumber }}`
- `{{ if .SponsoredImages }}`
- `{{ $currentCategory := "" }}`
- `{{ range .SponsoredImages }}`
- `{{ if ne $currentCategory .Category }}`
- `{{ $currentCategory = .Category }}`
- `{{ .Category }}`
- `{{ range .Image }}`
- `{{ if .Link }}`
- `{{ .Link }}`
- `{{ .ImageURL }}`
- `{{ if .SponsoredImagesLeft }}`
- `{{ range .SponsoredImagesLeft }}`
- `{{ if .SponsoredImagesRight }}`
- `{{ range .SponsoredImagesRight }}`
- `{{ if gt (len .TermsAndConditions) 0 }}`
- `{{ .Locales.TermsTitle }}`
- `{{ range $i, $term := .TermsAndConditions }}`
- `{{ $.HTMLDir }}`
- `{{ inc $i }}`
- `{{ $term.Txt }}`
- `{{ if .ContractLink }}`
- `{{ .Locales.TermsDownloadLabel }}`
- `{{ .ContractLink }}`
- `{{ .Locales.TermsClickHere }}`
- `{{ template "contact_container_both_dirs" . }}`
- `{{ .Locales.PolicyNote }}`
- `{{ template "footer_with_icons_both_dirs" . }}`
- `{{ $ticket.AppleWalletPassFile }}`
- `{{ .FestivalICSData }}`

### Dynamic Go field names referenced

- `AddOnName`
- `AddOnNameLabel`
- `AddOnPrice`
- `AddOnPriceLabel`
- `AddOnQuantity`
- `AddOnQuantityLabel`
- `AddOns`
- `AddOnsLabel`
- `AppleCalendarLink`
- `AppleWalletPassFile`
- `AsGuestPrefix`
- `AsUserPrefix`
- `BoughtForNote`
- `BuyerRegistrationNote`
- `BuyerUserIdentifier`
- `CarryReceiptNote`
- `Category`
- `Code`
- `CommaSeparatedAdultsNames`
- `CommaSeparatedChildrenNames`
- `ContractLink`
- `Cost`
- `Donation`
- `DonationAmount`
- `DonationAmountLabel`
- `FacilityFees`
- `FestivalAddress`
- `FestivalDoorsOpenAt`
- `FestivalEndDate`
- `FestivalEndDateTime`
- `FestivalEndTime`
- `FestivalICSData`
- `FestivalMap`
- `FestivalName`
- `FestivalPlaceName`
- `FestivalStartDate`
- `FestivalStartDateTime`
- `FestivalStartTime`
- `FromEmail`
- `FromName`
- `GoogleCalendarLink`
- `GoogleWalletPassLink`
- `GratuityFees`
- `GuestBoughtNote`
- `HTMLDir`
- `HTMLLang`
- `Hello`
- `Image`
- `ImageURL`
- `InfoAddTo`
- `InfoAppleCalendar`
- `InfoBuyerEmail`
- `InfoBuyerName`
- `InfoBuyerPhone`
- `InfoEventDate`
- `InfoEventName`
- `InfoEventTime`
- `InfoGoogleCalendar`
- `InfoPresentedBy`
- `InfoYahooCalendar`
- `LabelDoorsOpenAt`
- `LabelEventEnd`
- `LabelEventName`
- `LabelEventStart`
- `LabelLocation`
- `LabelName`
- `LabelPrice`
- `LabelQuantity`
- `LabelTicketType`
- `LabelVenue`
- `LabelViewMap`
- `Link`
- `Locales`
- `Name`
- `NumberOfAdultGuests`
- `NumberOfChildGuests`
- `OrderBookingDate`
- `OrderCost`
- `OrderCreditCardFees`
- `OrderFacilityFees`
- `OrderGratuityFees`
- `OrderNumTickets`
- `OrderPaymentCompleted`
- `OrderPaymentStatus`
- `OrderProcessingFees`
- `OrderPromoCode`
- `OrderPromoDiscount`
- `OrderPurchaseProtection`
- `OrderRoomPackage`
- `OrderSMSDeliveryFee`
- `OrderStatementNote`
- `OrderSummaryTitle`
- `OrderTax`
- `OrderTicketsTotal`
- `OrderTransactionTotal`
- `OrganizerBusinessName`
- `OrganizerLogo`
- `PolicyNote`
- `Price`
- `PricePerOne`
- `ProcessingFees`
- `PromoCode`
- `PromoCodeDiscount`
- `PurchaseProtectionAmount`
- `QRCodeImageLink`
- `Quantity`
- `RoomAdultNamesLabel`
- `RoomAdultsCountLabel`
- `RoomBooking`
- `RoomChildrenCountLabel`
- `RoomChildrenNamesLabel`
- `RoomPackageLabel`
- `RoomPackageName`
- `RoomPackagePriceLabel`
- `SaleDate`
- `SendTo`
- `SendingFees`
- `ShowProcessingFees`
- `ShowTicketPrice`
- `SponsoredImages`
- `SponsoredImagesLeft`
- `SponsoredImagesRight`
- `Subject`
- `Tax`
- `TermsAndConditions`
- `TermsClickHere`
- `TermsDownloadLabel`
- `TermsTitle`
- `TicketNumberLabel`
- `TicketType`
- `TicketUserIdentifier`
- `Tickets`
- `ToEmail`
- `ToName`
- `Total`
- `Txt`
- `UserCreditCardFees`
- `UserEmail`
- `UserName`
- `UserPhoneNumber`
- `UsingGuestFlow`
- `YahooCalendarLink`

### Partials invoked

- `header_4_localized`
- `contact_container_both_dirs`
- `footer_with_icons_both_dirs`

## 3. Approved preview visual slots

Source: `emails/festival_ticket_sale.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `totals`
- `qr_image`
- `wallet_badges`
- `calendar_links`
- `tracking_pixel`
- `greeting_and_body_copy`
- `localized_copy_strings`

Preview renderer: `shared/render-emails.js#renderTicketSale`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| totals | Total, Tax | MAPPED |
| qr_image | QRCodeImageLink | MAPPED |
| wallet_badges | GoogleWalletPassLink | MAPPED |
| calendar_links | GoogleCalendarLink, YahooCalendarLink, AppleCalendarLink, FestivalICSData | MAPPED |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| greeting_and_body_copy | UserName, ToName, Locales | MAPPED |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `AddOnName`
- `AddOnNameLabel`
- `AddOnPrice`
- `AddOnPriceLabel`
- `AddOnQuantity`
- `AddOnQuantityLabel`
- `AddOns`
- `AddOnsLabel`
- `AppleWalletPassFile`
- `AsGuestPrefix`
- `AsUserPrefix`
- `BoughtForNote`
- `BuyerRegistrationNote`
- `BuyerUserIdentifier`
- `CarryReceiptNote`
- `Category`
- `Code`
- `CommaSeparatedAdultsNames`
- `CommaSeparatedChildrenNames`
- `ContractLink`
- `Cost`
- `Donation`
- `DonationAmount`
- `DonationAmountLabel`
- `FacilityFees`
- `FestivalAddress`
- `FestivalDoorsOpenAt`
- `FestivalEndDate`
- `FestivalEndDateTime`
- `FestivalEndTime`

## 5. Locale & direction

- **Locales (from backend evidence / CSV, NOT Wallet badge locales):** UNKNOWN - verify Send* language selection
- **Locale builder notes:** UNKNOWN
- Registration templates use `Dir` (not only `HTMLDir`); others typically use `HTMLDir` via `utils.HTMLDirForLang`.

## 6. MIME / attachments

- **Structure:** multipart/mixed boundary="boundary-string" | part: text/html; charset="utf-8" | part(s): application/vnd.apple.pkpass (per ticket) Content-Disposition attachment filename ticket-N.pkpass; Content-ID <ticket-N.pkpass>; base64 {{.AppleWalletPassData}} | part: text/calendar attachment filename="event.ics" body {{.FestivalICSData}}
- **Attachments:** Apple pkpass per ticket (cid:ticket-N.pkpass) + event.ics

## 7. Security handoff

`none`

## 8. Port batch

`8-festival-ticket-sale`
