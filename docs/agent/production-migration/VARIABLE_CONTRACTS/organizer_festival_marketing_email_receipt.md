# VARIABLE CONTRACT - `organizer_festival_marketing_email_receipt`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `festivalMarketingReceiptParams`
- **Note:** Heuristic match score=11 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
Subject        string
FromEmail      string
OrganizerName  string
OrganizerEmail string
FestivalName   string
FestivalLogo   string
CostPerEmail   string
NumberOfEmails string
TotalCost      string
CostTax        string
CreditCardFees string
TotalPaid      string
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/organizer_festival_marketing_email_receipt.template` (comments excluded):

- `{{ .FromEmail }}`
- `{{ .OrganizerName }}`
- `{{ .OrganizerEmail }}`
- `{{ .Subject }}`
- `{{ template "header_3" }}`
- `{{ .FestivalName }}`
- `{{ .NumberOfEmails }}`
- `{{ .CostPerEmail }}`
- `{{ .TotalCost }}`
- `{{ .CostTax }}`
- `{{ .CreditCardFees }}`
- `{{ .TotalPaid }}`

### Dynamic Go field names referenced

- `CostPerEmail`
- `CostTax`
- `CreditCardFees`
- `FestivalName`
- `FromEmail`
- `NumberOfEmails`
- `OrganizerEmail`
- `OrganizerName`
- `Subject`
- `TotalCost`
- `TotalPaid`

### Partials invoked

- `header_3`

## 3. Approved preview visual slots

Source: `emails/organizer_festival_marketing_email_receipt.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `totals`
- `wallet_badges`
- `marketing_campaign_chrome`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/batch8-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| totals | - | DESIGN SLOT WITHOUT DATA |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| marketing_campaign_chrome | Subject | MAPPED |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | - | DESIGN SLOT WITHOUT DATA - YAML-backed via emailLocales builders |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **totals**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **localized_copy_strings**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. YAML-backed via emailLocales builders

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `CostPerEmail`
- `CostTax`
- `CreditCardFees`
- `FestivalName`
- `NumberOfEmails`
- `OrganizerEmail`
- `OrganizerName`
- `TotalCost`
- `TotalPaid`

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
