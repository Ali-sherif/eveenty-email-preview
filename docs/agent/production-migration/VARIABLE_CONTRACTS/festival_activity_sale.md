# VARIABLE CONTRACT - `festival_activity_sale`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `activitySaleEmailParams`
- **Note:** Heuristic match score=14 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName    string
FromEmail   string
TargetName  string
TargetEmail string
UserName string
PromoCode         string
PromoCodeDiscount string
Subject         string
FirstParagraph  htmltemplate.HTML
SecondParagraph htmltemplate.HTML
FestivalName    string
FestivalMap     string
FestivalAddress string
OrganizerLogo   string
Tickets []*model.ActivityTicketInfo
BookingDate        string
Cost               string
ProcessingFees     string
UserCreditCardFees string
Tax                string
TicketTotal        string
GoogleCalendarLink string
AppleCalendarLink  string
YahooCalendarLink  string
FestivalICSData    string
BrandLogoURL string
HTMLLang     string
HTMLDir      string // "ltr" or "rtl" - drives dir= attributes and text-align in the template
Locales      emailLocales.FestivalActivityEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_activity_sale.template` (comments excluded):

- `{{ .FromName }}`
- `{{ .FromEmail }}`
- `{{ .TargetName }}`
- `{{ .TargetEmail }}`
- `{{ .Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.PageTitle }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ template "header_4_localized" . }}`
- `{{ else }}`
- `{{ .Locales.Hello }}`
- `{{ if .FirstParagraph }}`
- `{{ .FirstParagraph }}`
- `{{ if .SecondParagraph }}`
- `{{ .SecondParagraph }}`
- `{{ $NumberOfTickets := len .Tickets }}`
- `{{ range $index, $ticket := .Tickets }}`
- `{{ $.Locales.LabelEventName }}`
- `{{ $.FestivalName }}`
- `{{ $ticket.QRCodeImage }}`
- `{{ $.Locales.TicketNumberLabel }}`
- `{{ inc $index }}`
- `{{ $NumberOfTickets }}`
- `{{ if eq $.HTMLDir "rtl" }}`
- `{{ $.Locales.LabelPlayerName }}`
- `{{ $ticket.KidName }}`
- `{{ $.Locales.LabelPlayerAge }}`
- `{{ $ticket.KidAge }}`
- `{{ $.Locales.LabelActivityName }}`
- `{{ $ticket.ActivityName }}`
- `{{ $ticket.ActivityDay }}`
- `{{ $.Locales.LabelActivityWaiver }}`
- `{{ $ticket.ActivityWaiver }}`
- `{{ $.Locales.TermsClickHere }}`
- `{{ $.Locales.LabelActivityDate }}`
- `{{ $ticket.ActivityDate }}`
- `{{ $.Locales.LabelLocation }}`
- `{{ $.FestivalAddress }}`
- `{{ if ne $.FestivalMap "" }}`
- `{{ $.FestivalMap }}`
- `{{ $.Locales.LabelViewMap }}`
- `{{ .Locales.OrderSummaryTitle }}`
- `{{ .Locales.OrderBookingDate }}`
- `{{ .BookingDate }}`
- `{{ .Locales.OrderNumTickets }}`
- `{{ .Locales.OrderCost }}`
- `{{ .Cost }}`
- `{{ if .PromoCode }}`
- `{{ .Locales.OrderPromoCode }}`
- `{{ .PromoCode }}`
- `{{ .Locales.OrderPromoDiscount }}`
- `{{ .PromoCodeDiscount }}`
- `{{ if .ProcessingFees }}`
- `{{ .Locales.OrderProcessingFees }}`
- `{{ .ProcessingFees }}`
- `{{ .Locales.OrderTax }}`
- `{{ .Tax }}`
- `{{ if .UserCreditCardFees }}`
- `{{ .Locales.OrderCreditCardFees }}`
- `{{ .UserCreditCardFees }}`
- `{{ .Locales.OrderPaymentStatus }}`
- `{{ .Locales.OrderPaymentCompleted }}`
- `{{ .Locales.OrderTicketsTotal }}`
- `{{ .TicketTotal }}`
- `{{ .Locales.InfoAddTo }}`
- `{{ .GoogleCalendarLink }}`
- `{{ .Locales.InfoGoogleCalendar }}`
- `{{ .AppleCalendarLink }}`
- `{{ .Locales.InfoAppleCalendar }}`
- `{{ .YahooCalendarLink }}`
- `{{ .Locales.InfoYahooCalendar }}`
- `{{ template "contact_container_both_dirs" . }}`
- `{{ .Locales.PolicyNote }}`
- `{{ template "footer_with_icons_both_dirs" . }}`
- `{{ .FestivalICSData }}`

### Dynamic Go field names referenced

- `ActivityDate`
- `ActivityDay`
- `ActivityName`
- `ActivityWaiver`
- `AppleCalendarLink`
- `BookingDate`
- `Cost`
- `FestivalAddress`
- `FestivalICSData`
- `FestivalMap`
- `FestivalName`
- `FirstParagraph`
- `FromEmail`
- `FromName`
- `GoogleCalendarLink`
- `HTMLDir`
- `HTMLLang`
- `Hello`
- `InfoAddTo`
- `InfoAppleCalendar`
- `InfoGoogleCalendar`
- `InfoYahooCalendar`
- `KidAge`
- `KidName`
- `LabelActivityDate`
- `LabelActivityName`
- `LabelActivityWaiver`
- `LabelEventName`
- `LabelLocation`
- `LabelPlayerAge`
- `LabelPlayerName`
- `LabelViewMap`
- `Locales`
- `OrderBookingDate`
- `OrderCost`
- `OrderCreditCardFees`
- `OrderNumTickets`
- `OrderPaymentCompleted`
- `OrderPaymentStatus`
- `OrderProcessingFees`
- `OrderPromoCode`
- `OrderPromoDiscount`
- `OrderSummaryTitle`
- `OrderTax`
- `OrderTicketsTotal`
- `PageTitle`
- `PolicyNote`
- `ProcessingFees`
- `PromoCode`
- `PromoCodeDiscount`
- `QRCodeImage`
- `SecondParagraph`
- `Subject`
- `TargetEmail`
- `TargetName`
- `Tax`
- `TermsClickHere`
- `TicketNumberLabel`
- `TicketTotal`
- `Tickets`
- `UserCreditCardFees`
- `YahooCalendarLink`

### Partials invoked

- `header_4_localized`
- `contact_container_both_dirs`
- `footer_with_icons_both_dirs`

## 3. Approved preview visual slots

Source: `emails/festival_activity_sale.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

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
| totals | Tax | MAPPED |
| qr_image | QRCodeImage | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| calendar_links | GoogleCalendarLink, YahooCalendarLink, AppleCalendarLink, FestivalICSData | MAPPED |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| greeting_and_body_copy | Locales | MAPPED |
| ics_note_or_calendar | FestivalICSData, GoogleCalendarLink, YahooCalendarLink, AppleCalendarLink | MAPPED |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `ActivityDate`
- `ActivityDay`
- `ActivityName`
- `ActivityWaiver`
- `BookingDate`
- `Cost`
- `FestivalAddress`
- `FestivalMap`
- `FestivalName`
- `FirstParagraph`
- `HTMLLang`
- `Hello`
- `InfoAddTo`
- `InfoAppleCalendar`
- `InfoGoogleCalendar`
- `InfoYahooCalendar`
- `KidAge`
- `KidName`
- `OrderBookingDate`
- `OrderCost`
- `OrderCreditCardFees`
- `OrderNumTickets`
- `OrderPaymentCompleted`
- `OrderPaymentStatus`
- `OrderProcessingFees`
- `OrderPromoCode`
- `OrderPromoDiscount`
- `OrderSummaryTitle`
- `OrderTax`
- `OrderTicketsTotal`

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
