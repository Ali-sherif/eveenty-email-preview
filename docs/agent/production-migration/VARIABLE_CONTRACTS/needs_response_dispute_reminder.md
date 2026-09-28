# VARIABLE CONTRACT - `needs_response_dispute_reminder`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `disputeReminderTemplateParams`
- **Note:** Heuristic match score=17 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName  string
FromEmail string
ToName    string
ToEmail   string
Subject   string
Lang      string // BCP-47 language code: "en", "ar", "es", "fa", "fr"
HTMLDir   string // "ltr" or "rtl"
HTMLLang  string // same as Lang, used on <html> tag
BrandLogo string // language-specific Eveenty logo URL
Locales   emailLocales.DisputeReminderEmailLocales
FestivalName        string
UserName            string
UserPhoneNumber     string
UserEmail           string
TransactionType     string
DisputeReference    string
DisputedAmount      string
DisputeFees         string
DisputeEvidenceFees string
DisputeStatus       string
DisputeReason       string
IsLastReminder        bool
DeadlineDate          string // Formatted date
DaysRemainingText     string // e.g., "3 days remaining"
IsUsingStripeConnect  bool
ActionRequiredContent string // Pre-localized HTML content
AlertColor string
TrackingPixelURL string
ViewPaymentLink string
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/needs_response_dispute_reminder.template` (comments excluded):

- `{{ .FromName }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.HtmlDocumentTitle }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ else }}`
- `{{ end }}`
- `{{ .BrandLogo }}`
- `{{ .Locales.Greeting }}`
- `{{ .AlertColor }}`
- `{{ .Locales.AlertTitle }}`
- `{{ .Locales.StatusMessage }}`
- `{{ if .IsLastReminder }}`
- `{{ .Locales.LastReminderWarning }}`
- `{{ .Locales.DeadlineTitle }}`
- `{{ .Locales.DeadlineLabel }}`
- `{{ .DeadlineDate }}`
- `{{ .Locales.DaysRemainingLabel }}`
- `{{ .DaysRemainingText }}`
- `{{ .Locales.UrgentWarning }}`
- `{{ .Locales.ActionRequiredTitle }}`
- `{{ .ActionRequiredContent }}`
- `{{ .Locales.EventInfoTitle }}`
- `{{ .Locales.EventNameLabel }}`
- `{{ .FestivalName }}`
- `{{ .Locales.DetailsTitle }}`
- `{{ .Locales.FieldLabel }}`
- `{{ .Locales.DetailsLabel }}`
- `{{ .Locales.UserNameLabel }}`
- `{{ .UserName }}`
- `{{ .Locales.EmailLabel }}`
- `{{ .UserEmail }}`
- `{{ .Locales.PhoneLabel }}`
- `{{ .UserPhoneNumber }}`
- `{{ .Locales.TransactionTypeLabel }}`
- `{{ .TransactionType }}`
- `{{ .Locales.ReferenceLabel }}`
- `{{ .DisputeReference }}`
- `{{ .Locales.ReasonLabel }}`
- `{{ .DisputeReason }}`
- `{{ .Locales.AmountLabel }}`
- `{{ .DisputedAmount }}`
- `{{ .Locales.FeesLabel }}`
- `{{ .DisputeFees }}`
- `{{ .Locales.EvidenceFeesLabel }}`
- `{{ .DisputeEvidenceFees }}`
- `{{ .Locales.NextStepsTitle }}`
- `{{ .Locales.NextStepsMessage }}`
- `{{ if .ViewPaymentLink }}`
- `{{ .ViewPaymentLink }}`
- `{{ .Locales.ViewPayment }}`
- `{{ .Locales.NeedHelpTitle }}`
- `{{ .Locales.NeedHelpText }}`
- `{{ .Locales.BestRegards }}`
- `{{ .Locales.TeamName }}`
- `{{ if .TrackingPixelURL }}`
- `{{ .TrackingPixelURL }}`

### Dynamic Go field names referenced

- `ActionRequiredContent`
- `ActionRequiredTitle`
- `AlertColor`
- `AlertTitle`
- `AmountLabel`
- `BestRegards`
- `BrandLogo`
- `DaysRemainingLabel`
- `DaysRemainingText`
- `DeadlineDate`
- `DeadlineLabel`
- `DeadlineTitle`
- `DetailsLabel`
- `DetailsTitle`
- `DisputeEvidenceFees`
- `DisputeFees`
- `DisputeReason`
- `DisputeReference`
- `DisputedAmount`
- `EmailLabel`
- `EventInfoTitle`
- `EventNameLabel`
- `EvidenceFeesLabel`
- `FeesLabel`
- `FestivalName`
- `FieldLabel`
- `FromEmail`
- `FromName`
- `Greeting`
- `HTMLDir`
- `HTMLLang`
- `HtmlDocumentTitle`
- `IsLastReminder`
- `LastReminderWarning`
- `Locales`
- `NeedHelpText`
- `NeedHelpTitle`
- `NextStepsMessage`
- `NextStepsTitle`
- `PhoneLabel`
- `ReasonLabel`
- `ReferenceLabel`
- `StatusMessage`
- `Subject`
- `TeamName`
- `ToEmail`
- `ToName`
- `TrackingPixelURL`
- `TransactionType`
- `TransactionTypeLabel`
- `UrgentWarning`
- `UserEmail`
- `UserName`
- `UserNameLabel`
- `UserPhoneNumber`
- `ViewPayment`
- `ViewPaymentLink`

### Partials invoked

- _(none)_

## 3. Approved preview visual slots

Source: `emails/needs_response_dispute_reminder.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `wallet_badges`
- `organizer_or_festival_logo`
- `tracking_pixel`
- `dispute_details`
- `localized_copy_strings`

Preview renderer: `shared/batch20-workflow-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | BrandLogo | MAPPED |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| organizer_or_festival_logo | - | DESIGN SLOT WITHOUT DATA |
| tracking_pixel | TrackingPixelURL | MAPPED |
| dispute_details | DisputeReason, TrackingPixelURL | MAPPED |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **organizer_or_festival_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `ActionRequiredContent`
- `ActionRequiredTitle`
- `AlertColor`
- `AlertTitle`
- `AmountLabel`
- `BestRegards`
- `DaysRemainingLabel`
- `DaysRemainingText`
- `DeadlineDate`
- `DeadlineLabel`
- `DeadlineTitle`
- `DetailsLabel`
- `DetailsTitle`
- `DisputeEvidenceFees`
- `DisputeFees`
- `DisputeReference`
- `DisputedAmount`
- `EmailLabel`
- `EventInfoTitle`
- `EventNameLabel`
- `EvidenceFeesLabel`
- `FeesLabel`
- `FestivalName`
- `FieldLabel`
- `Greeting`
- `HTMLLang`
- `HtmlDocumentTitle`
- `IsLastReminder`
- `LastReminderWarning`
- `NeedHelpText`

## 5. Locale & direction

- **Locales (from backend evidence / CSV, NOT Wallet badge locales):** UNKNOWN - verify Send* language selection
- **Locale builder notes:** UNKNOWN
- Registration templates use `Dir` (not only `HTMLDir`); others typically use `HTMLDir` via `utils.HTMLDirForLang`.

## 6. MIME / attachments

- **Structure:** RFC822 headers + text/html body (single part); no text/plain VERIFIED absence in template
- **Attachments:** none

## 7. Security handoff

`none`

## 8. Port batch

`2-localized-notifications`
