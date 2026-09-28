# VARIABLE CONTRACT - `dispute_notification`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `disputeNotificationTemplateParams`
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
Locales   emailLocales.DisputeNotificationEmailLocales
FestivalName         string
UserName             string
UserPhoneNumber      string
UserEmail            string
TransactionType      string
DisputeReference     string
DisputedAmount       string
DisputeFees          string
DisputeEvidenceFees  string
DisputeStatus        string
DisputeReason        string
EvidenceDateDeadline string
AlertColor string
ViewPaymentLink string
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/dispute_notification.template` (comments excluded):

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
- `{{ if .EvidenceDateDeadline }}`
- `{{ .Locales.EvidenceDueByLabel }}`
- `{{ .EvidenceDateDeadline }}`
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

### Dynamic Go field names referenced

- `AlertColor`
- `AlertTitle`
- `AmountLabel`
- `BestRegards`
- `BrandLogo`
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
- `EvidenceDateDeadline`
- `EvidenceDueByLabel`
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
- `TransactionType`
- `TransactionTypeLabel`
- `UserEmail`
- `UserName`
- `UserNameLabel`
- `UserPhoneNumber`
- `ViewPayment`
- `ViewPaymentLink`

### Partials invoked

- _(none)_

## 3. Approved preview visual slots

Source: `emails/dispute_notification.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `wallet_badges`
- `tracking_pixel`
- `dispute_details`
- `localized_copy_strings`

Preview renderer: `shared/render-emails.js#renderDispute`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | BrandLogo | MAPPED |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| dispute_details | DisputeReason | MAPPED |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `AlertColor`
- `AlertTitle`
- `AmountLabel`
- `BestRegards`
- `DetailsLabel`
- `DetailsTitle`
- `DisputeEvidenceFees`
- `DisputeFees`
- `DisputeReference`
- `DisputedAmount`
- `EmailLabel`
- `EventInfoTitle`
- `EventNameLabel`
- `EvidenceDateDeadline`
- `EvidenceDueByLabel`
- `EvidenceFeesLabel`
- `FeesLabel`
- `FestivalName`
- `FieldLabel`
- `Greeting`
- `HTMLLang`
- `HtmlDocumentTitle`
- `NeedHelpText`
- `NeedHelpTitle`
- `NextStepsMessage`
- `NextStepsTitle`
- `PhoneLabel`
- `ReasonLabel`
- `ReferenceLabel`
- `StatusMessage`

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
