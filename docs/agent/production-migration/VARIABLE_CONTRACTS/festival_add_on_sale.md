# VARIABLE CONTRACT - `festival_add_on_sale`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `festivalAddOnSaleTemplateParams`
- **Note:** Heuristic match score=17 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName              string
FromEmail             string
ToName                string
ToEmail               string
Subject               string
BrandLogoURL          string
SendTo                string
UserName              string
UserEmail             string
UserPhoneNumber       string
UsingGuestFlow        bool
FestivalName          string
OrganizerBusinessName string
OrganizerLogo         string
FestivalStartDateTime string
FestivalEndDateTime   string
FestivalStartDate     string
FestivalEndDate       string
FestivalStartTime     string
FestivalEndTime       string
FestivalMap           string
FestivalPlaceName     string
FestivalAddress       string
FestivalDoorsOpenAt   string
AddOnItems []*AddOnSaleItemDisplayInfo
Cost                     string
PromoCode                string
PromoCodeDiscount        string
ProcessingFees           string
ShowProcessingFees       bool
Tax                      string
Total                    string
UserCreditCardFees       string
PurchaseProtectionAmount string
SaleDate                 string
ShowSummary              bool
GoogleCalendarLink string
AppleCalendarLink  string
YahooCalendarLink  string
FestivalICSData    string
HTMLLang string
HTMLDir  string
Locales  emailLocales.FestivalAddOnEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_add_on_sale.template` (comments excluded):

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
- `{{ if eq .SendTo "user" }}`
- `{{ else }}`
- `{{ .Locales.Hello }}`
- `{{ .UserName }}`
- `{{ .Locales.UserGreeting }}`
- `{{ .FestivalName }}`
- `{{ .Locales.CarryReceiptNote }}`
- `{{ if .UsingGuestFlow }}`
- `{{ .UserEmail }}`
- `{{ .Locales.OrganizerNote }}`
- `{{ range $index, $item := .AddOnItems }}`
- `{{ $.HTMLDir }}`
- `{{ $.Locales.EventName }}`
- `{{ $.FestivalName }}`
- `{{ $.Locales.ItemsTitle }}`
- `{{ if $item.AddOnImageURL }}`
- `{{ $item.AddOnImageURL }}`
- `{{ $item.QRCodeImageURL }}`
- `{{ $.Locales.ScanInstructions }}`
- `{{ $.Locales.ItemID }}`
- `{{ $item.ItemID }}`
- `{{ if eq $.HTMLDir "rtl" }}`
- `{{ $.Locales.ItemName }}`
- `{{ $item.AddOnName }}`
- `{{ if $item.AddOnDescription }}`
- `{{ $.Locales.ItemDescription }}`
- `{{ $item.AddOnDescription }}`
- `{{ $.Locales.ItemPrice }}`
- `{{ $item.AddOnPrice }}`
- `{{ $.Locales.ItemQuantity }}`
- `{{ $item.AddOnQuantity }}`
- `{{ if $.FestivalDoorsOpenAt }}`
- `{{ $.Locales.DoorsOpenAt }}`
- `{{ $.FestivalDoorsOpenAt }}`
- `{{ $.Locales.EventStart }}`
- `{{ $.FestivalStartDateTime }}`
- `{{ if $.FestivalEndDateTime }}`
- `{{ $.Locales.EventEnd }}`
- `{{ $.FestivalEndDateTime }}`
- `{{ if $.FestivalPlaceName }}`
- `{{ $.Locales.Venue }}`
- `{{ $.FestivalPlaceName }}`
- `{{ $.Locales.Location }}`
- `{{ $.FestivalAddress }}`
- `{{ if ne $.FestivalMap "" }}`
- `{{ $.FestivalMap }}`
- `{{ $.Locales.ViewMap }}`
- `{{ if .ShowSummary }}`
- `{{ .Locales.OrderSummary }}`
- `{{ .Locales.PurchaseDate }}`
- `{{ .SaleDate }}`
- `{{ .Locales.Subtotal }}`
- `{{ .Cost }}`
- `{{ if .PromoCode }}`
- `{{ .Locales.PromoCode }}`
- `{{ .PromoCode }}`
- `{{ .Locales.PromoDiscount }}`
- `{{ .PromoCodeDiscount }}`
- `{{ if .ShowProcessingFees }}`
- `{{ .Locales.ProcessingFees }}`
- `{{ .ProcessingFees }}`
- `{{ .Locales.Tax }}`
- `{{ .Tax }}`
- `{{ if .UserCreditCardFees }}`
- `{{ .Locales.BankFees }}`
- `{{ .UserCreditCardFees }}`
- `{{ if .PurchaseProtectionAmount }}`
- `{{ .Locales.PurchaseProtection }}`
- `{{ .PurchaseProtectionAmount }}`
- `{{ .Locales.Total }}`
- `{{ .Total }}`
- `{{ if .OrganizerLogo }}`
- `{{ .OrganizerLogo }}`
- `{{ if .OrganizerBusinessName }}`
- `{{ .Locales.PresentedBy }}`
- `{{ .OrganizerBusinessName }}`
- `{{ .Locales.EventName }}`
- `{{ .Locales.EventDate }}`
- `{{ .FestivalStartDate }}`
- `{{ if .FestivalEndDate }}`
- `{{ .FestivalEndDate }}`
- `{{ .Locales.AddToCalendar }}`
- `{{ .GoogleCalendarLink }}`
- `{{ .Locales.GoogleCalendar }}`
- `{{ .AppleCalendarLink }}`
- `{{ .Locales.AppleCalendar }}`
- `{{ .YahooCalendarLink }}`
- `{{ .Locales.YahooCalendar }}`
- `{{ .Locales.EventTime }}`
- `{{ .FestivalStartTime }}`
- `{{ if .FestivalEndTime }}`
- `{{ .FestivalEndTime }}`
- `{{ .Locales.BuyerInfo }}`
- `{{ .Locales.BuyerName }}`
- `{{ .Locales.BuyerEmail }}`
- `{{ if .UserPhoneNumber }}`
- `{{ .Locales.BuyerPhone }}`
- `{{ .UserPhoneNumber }}`
- `{{ .Locales.ContactQuestion }}`
- `{{ .Locales.ContactEmail }}`
- `{{ .Locales.ContactCall }}`
- `{{ template "footer_branded_both_dirs" . }}`
- `{{ .FestivalICSData }}`

### Dynamic Go field names referenced

- `AddOnDescription`
- `AddOnImageURL`
- `AddOnItems`
- `AddOnName`
- `AddOnPrice`
- `AddOnQuantity`
- `AddToCalendar`
- `AppleCalendar`
- `AppleCalendarLink`
- `BankFees`
- `BuyerEmail`
- `BuyerInfo`
- `BuyerName`
- `BuyerPhone`
- `CarryReceiptNote`
- `ContactCall`
- `ContactEmail`
- `ContactQuestion`
- `Cost`
- `DoorsOpenAt`
- `EventDate`
- `EventEnd`
- `EventName`
- `EventStart`
- `EventTime`
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
- `GoogleCalendar`
- `GoogleCalendarLink`
- `HTMLDir`
- `HTMLLang`
- `Hello`
- `ItemDescription`
- `ItemID`
- `ItemName`
- `ItemPrice`
- `ItemQuantity`
- `ItemsTitle`
- `Locales`
- `Location`
- `OrderSummary`
- `OrganizerBusinessName`
- `OrganizerLogo`
- `OrganizerNote`
- `PresentedBy`
- `ProcessingFees`
- `PromoCode`
- `PromoCodeDiscount`
- `PromoDiscount`
- `PurchaseDate`
- `PurchaseProtection`
- `PurchaseProtectionAmount`
- `QRCodeImageURL`
- `SaleDate`
- `ScanInstructions`
- `SendTo`
- `ShowProcessingFees`
- `ShowSummary`
- `Subject`
- `Subtotal`
- `Tax`
- `ToEmail`
- `ToName`
- `Total`
- `UserCreditCardFees`
- `UserEmail`
- `UserGreeting`
- `UserName`
- `UserPhoneNumber`
- `UsingGuestFlow`
- `Venue`
- `ViewMap`
- `YahooCalendar`
- `YahooCalendarLink`

### Partials invoked

- `header_4_localized`
- `footer_branded_both_dirs`

## 3. Approved preview visual slots

Source: `emails/festival_add_on_sale.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `totals`
- `qr_image`
- `wallet_badges`
- `calendar_links`
- `tracking_pixel`
- `greeting_and_body_copy`
- `ics_note_or_calendar`
- `localized_copy_strings`

Preview renderer: `shared/batch8-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| totals | Total, Subtotal, Tax | MAPPED |
| qr_image | QRCodeImageURL | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| calendar_links | GoogleCalendarLink, YahooCalendarLink, AppleCalendarLink, FestivalICSData | MAPPED |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| greeting_and_body_copy | UserName, ToName, Locales | MAPPED |
| ics_note_or_calendar | FestivalICSData, GoogleCalendarLink, YahooCalendarLink, AppleCalendarLink | MAPPED |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `AddOnDescription`
- `AddOnImageURL`
- `AddOnItems`
- `AddOnName`
- `AddOnPrice`
- `AddOnQuantity`
- `AddToCalendar`
- `AppleCalendar`
- `BankFees`
- `BuyerEmail`
- `BuyerInfo`
- `BuyerName`
- `BuyerPhone`
- `CarryReceiptNote`
- `ContactCall`
- `ContactEmail`
- `ContactQuestion`
- `Cost`
- `DoorsOpenAt`
- `EventDate`
- `EventEnd`
- `EventName`
- `EventStart`
- `EventTime`
- `FestivalAddress`
- `FestivalDoorsOpenAt`
- `FestivalEndDate`
- `FestivalEndDateTime`
- `FestivalEndTime`
- `FestivalMap`

## 5. Locale & direction

- **Locales (from backend evidence / CSV, NOT Wallet badge locales):** UNKNOWN - verify Send* language selection
- **Locale builder notes:** UNKNOWN
- Registration templates use `Dir` (not only `HTMLDir`); others typically use `HTMLDir` via `utils.HTMLDirForLang`.

## 6. MIME / attachments

- **Structure:** multipart/mixed boundary="boundary-string" | part: text/html; charset="utf-8" | part: text/calendar attachment filename="event.ics" body {{.FestivalICSData}}
- **Attachments:** event.ics (FestivalICSData)

## 7. Security handoff

`none`

## 8. Port batch

`7-ics-sales`
