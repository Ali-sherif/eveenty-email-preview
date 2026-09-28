# VARIABLE CONTRACT - `festival_ticket_registration_payment_deadline_exceeded`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `ticketRegistrationEmailParams`
- **Note:** Heuristic match score=14 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromEmail string
ToEmail   string
ToName    string
Subject   string
Lang string
Dir string
BrandLogoURL string
Locales emailLocales.FestivalTicketRegistrationEmailLocales
RecipientType       string
GreetingMessage     string
GreetingMessageHTML string // HTML greeting (e.g. for approval with colored spans); when set, used instead of GreetingMessage
FestivalName          string
FestivalStartDateTime string
FestivalEndDateTime   string
FestivalAddress       string
FestivalMap           string
FestivalTimeZone      string
FestivalPlaceName     string
DoorsOpenAt           string
OrganizerLogo         string // for header_4_localized partial
RegistrationID string // first 5 chars
RegistrationDateTime string
CurrentStatus        string
ReviewDeadline       string
PaymentDeadline      string
TimezoneNote string
BuyerName        string
BuyerEmail       string
BuyerPhoneNumber string
TicketItems []*TicketRegistrationItemDisplay
ShowCompleteOrderButton  bool   // true when RecipientType == "user" in approval email
CompleteRegistrationLink string // e.g. https://eveenty.com/ticket-registration/{id
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_ticket_registration_payment_deadline_exceeded.template` (comments excluded):

- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .Subject }}`
- `{{ .Lang }}`
- `{{ .Dir }}`
- `{{ template "header_4_localized" . }}`
- `{{ .Locales.AlertPaymentBody }}`
- `{{ if eq .RecipientType "user" }}`
- `{{ .GreetingMessage }}`
- `{{ else if eq .RecipientType "admin" }}`
- `{{ .Locales.AlertAdminAction }}`
- `{{ else }}`
- `{{ .Locales.AlertOrganizerAction }}`
- `{{ end }}`
- `{{ if ne .RecipientType "user" }}`
- `{{ .Locales.SummarySubtitle }}`
- `{{ if eq .Dir "rtl" }}`
- `{{ .Locales.SummaryTitle }}`
- `{{ .Locales.LabelEvent }}`
- `{{ .FestivalName }}`
- `{{ .Locales.LabelRegistrationID }}`
- `{{ .RegistrationID }}`
- `{{ .Locales.LabelRegistrationDate }}`
- `{{ .RegistrationDateTime }}`
- `{{ .Locales.LabelCurrentStatus }}`
- `{{ .CurrentStatus }}`
- `{{ .Locales.LabelReviewDeadline }}`
- `{{ .ReviewDeadline }}`
- `{{ if .PaymentDeadline }}`
- `{{ .Locales.LabelPaymentDeadline }}`
- `{{ .PaymentDeadline }}`
- `{{ .Locales.BuyerInfoTitle }}`
- `{{ .Locales.LabelName }}`
- `{{ .BuyerName }}`
- `{{ .Locales.LabelEmail }}`
- `{{ .BuyerEmail }}`
- `{{ if .BuyerPhoneNumber }}`
- `{{ .Locales.LabelPhone }}`
- `{{ .BuyerPhoneNumber }}`
- `{{ .Locales.TicketsTitle }}`
- `{{ len .TicketItems }}`
- `{{ .Locales.TicketsSubtitle }}`
- `{{ range $index, $item := .TicketItems }}`
- `{{ inc $index }}`
- `{{ len $.TicketItems }}`
- `{{ $.Locales.LabelTicketType }}`
- `{{ $item.TicketTypeName }}`
- `{{ $.Locales.LabelTicketHolder }}`
- `{{ $item.HolderFullName }}`
- `{{ if $item.HolderEmail }}`
- `{{ $.Locales.LabelEmail }}`
- `{{ $item.HolderEmail }}`
- `{{ if $item.HolderPhoneNumber }}`
- `{{ $.Locales.LabelPhone }}`
- `{{ $item.HolderPhoneNumber }}`
- `{{ if $item.QuestionAnswers }}`
- `{{ $.Locales.LabelAnswers }}`
- `{{ range $qa := $item.QuestionAnswers }}`
- `{{ $qa.Question }}`
- `{{ $qa.Answer }}`
- `{{ .Locales.EventDetailsTitle }}`
- `{{ .Locales.EventDetailsSubtitle }}`
- `{{ if .DoorsOpenAt }}`
- `{{ .Locales.LabelDoorsOpenAt }}`
- `{{ .DoorsOpenAt }}`
- `{{ if .FestivalStartDateTime }}`
- `{{ .Locales.LabelEventStart }}`
- `{{ .FestivalStartDateTime }}`
- `{{ if .FestivalEndDateTime }}`
- `{{ .Locales.LabelEventEnd }}`
- `{{ .FestivalEndDateTime }}`
- `{{ if .FestivalPlaceName }}`
- `{{ .Locales.LabelVenue }}`
- `{{ .FestivalPlaceName }}`
- `{{ if .FestivalAddress }}`
- `{{ .Locales.LabelLocation }}`
- `{{ .FestivalAddress }}`
- `{{ if .FestivalMap }}`
- `{{ .FestivalMap }}`
- `{{ .Locales.LabelViewMap }}`
- `{{ if .TimezoneNote }}`
- `{{ .TimezoneNote }}`
- `{{ template "footer_ticket_registration" . }}`

### Dynamic Go field names referenced

- `AlertAdminAction`
- `AlertOrganizerAction`
- `AlertPaymentBody`
- `Answer`
- `BuyerEmail`
- `BuyerInfoTitle`
- `BuyerName`
- `BuyerPhoneNumber`
- `CurrentStatus`
- `Dir`
- `DoorsOpenAt`
- `EventDetailsSubtitle`
- `EventDetailsTitle`
- `FestivalAddress`
- `FestivalEndDateTime`
- `FestivalMap`
- `FestivalName`
- `FestivalPlaceName`
- `FestivalStartDateTime`
- `FromEmail`
- `GreetingMessage`
- `HolderEmail`
- `HolderFullName`
- `HolderPhoneNumber`
- `LabelAnswers`
- `LabelCurrentStatus`
- `LabelDoorsOpenAt`
- `LabelEmail`
- `LabelEvent`
- `LabelEventEnd`
- `LabelEventStart`
- `LabelLocation`
- `LabelName`
- `LabelPaymentDeadline`
- `LabelPhone`
- `LabelRegistrationDate`
- `LabelRegistrationID`
- `LabelReviewDeadline`
- `LabelTicketHolder`
- `LabelTicketType`
- `LabelVenue`
- `LabelViewMap`
- `Lang`
- `Locales`
- `PaymentDeadline`
- `Question`
- `QuestionAnswers`
- `RecipientType`
- `RegistrationDateTime`
- `RegistrationID`
- `ReviewDeadline`
- `Subject`
- `SummarySubtitle`
- `SummaryTitle`
- `TicketItems`
- `TicketTypeName`
- `TicketsSubtitle`
- `TicketsTitle`
- `TimezoneNote`
- `ToEmail`
- `ToName`

### Partials invoked

- `header_4_localized`
- `footer_ticket_registration`

## 3. Approved preview visual slots

Source: `emails/festival_ticket_registration_payment_deadline_exceeded.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `wallet_badges`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/batch20-refund-registration-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `AlertAdminAction`
- `AlertOrganizerAction`
- `AlertPaymentBody`
- `Answer`
- `BuyerEmail`
- `BuyerInfoTitle`
- `BuyerName`
- `BuyerPhoneNumber`
- `CurrentStatus`
- `DoorsOpenAt`
- `EventDetailsSubtitle`
- `EventDetailsTitle`
- `FestivalAddress`
- `FestivalEndDateTime`
- `FestivalMap`
- `FestivalName`
- `FestivalPlaceName`
- `FestivalStartDateTime`
- `GreetingMessage`
- `HolderEmail`
- `HolderFullName`
- `HolderPhoneNumber`
- `PaymentDeadline`
- `Question`
- `QuestionAnswers`
- `RecipientType`
- `RegistrationDateTime`
- `RegistrationID`
- `ReviewDeadline`
- `SummarySubtitle`

## 5. Locale & direction

- **Locales (from backend evidence / CSV, NOT Wallet badge locales):** UNKNOWN - verify Send* language selection
- **Locale builder notes:** UNKNOWN
- Registration templates use `Dir` (not only `HTMLDir`); others typically use `HTMLDir` via `utils.HTMLDirForLang`.

## 6. MIME / attachments

- **Structure:** multipart/mixed; boundary="boundary-string"; single text/html part only; closing --boundary-string--
- **Attachments:** none (multipart wrapper only; no file parts VERIFIED)

## 7. Security handoff

`none`

## 8. Port batch

`6-registration-multipart`
