# VARIABLE CONTRACT - `festival_donation`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `donationTemplate`
- **Note:** Heuristic match score=23 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName            string
FromEmail           string
ToName              string
ToEmail             string
Subject             string
HTMLLang            string
HTMLDir             string // "ltr" or "rtl" - drives dir= and layout in festival_donation.template
BrandLogoURL        string
Locales             emailLocales.DonationEmailLocales
InvoiceID           string
UserName            string
UserEmail           string
UserPhoneNumber     string
UserAddress         string
FestivalName        string
FestivalLogo        string
Date                string
Time                string
FestivalAddress     string
FestivalPhoneNumber string
TotalCost           string
TotalTax            string
TotalProcessingFees string
UserCreditCardFees  string
TotalAmount         string
ShowProcessingFees  bool
SendToDonatorUser   bool
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_donation.template` (comments excluded):

- `{{ .FromName }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.Title }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ else }}`
- `{{ end }}`
- `{{ template "header_2_localized" . }}`
- `{{ if .SendToDonatorUser }}`
- `{{ .Locales.NotTaxReceiptNote }}`
- `{{ .Locales.ThankYouPrefix }}`
- `{{ .UserName }}`
- `{{ .Locales.ThankYouSuffix }}`
- `{{ .FestivalName }}`
- `{{ .Locales.DonatedTo }}`
- `{{ .Locales.ClientName }}`
- `{{ .Locales.ClientAddress }}`
- `{{ .UserAddress }}`
- `{{ .Locales.ClientPhone }}`
- `{{ .UserPhoneNumber }}`
- `{{ .Locales.ClientEmail }}`
- `{{ .UserEmail }}`
- `{{ .Locales.InvoiceID }}`
- `{{ .InvoiceID }}`
- `{{ .Locales.Date }}`
- `{{ .Date }}`
- `{{ .Time }}`
- `{{ .Locales.Subtotal }}`
- `{{ .TotalCost }}`
- `{{ if .ShowProcessingFees }}`
- `{{ .Locales.ProcessingFee }}`
- `{{ .TotalProcessingFees }}`
- `{{ .Locales.Tax }}`
- `{{ .TotalTax }}`
- `{{ if .UserCreditCardFees }}`
- `{{ .Locales.CreditCardFees }}`
- `{{ .UserCreditCardFees }}`
- `{{ .Locales.GrandTotal }}`
- `{{ .TotalAmount }}`
- `{{ template "footer_branded_both_dirs" . }}`

### Dynamic Go field names referenced

- `ClientAddress`
- `ClientEmail`
- `ClientName`
- `ClientPhone`
- `CreditCardFees`
- `Date`
- `DonatedTo`
- `FestivalName`
- `FromEmail`
- `FromName`
- `GrandTotal`
- `HTMLDir`
- `HTMLLang`
- `InvoiceID`
- `Locales`
- `NotTaxReceiptNote`
- `ProcessingFee`
- `SendToDonatorUser`
- `ShowProcessingFees`
- `Subject`
- `Subtotal`
- `Tax`
- `ThankYouPrefix`
- `ThankYouSuffix`
- `Time`
- `Title`
- `ToEmail`
- `ToName`
- `TotalAmount`
- `TotalCost`
- `TotalProcessingFees`
- `TotalTax`
- `UserAddress`
- `UserCreditCardFees`
- `UserEmail`
- `UserName`
- `UserPhoneNumber`

### Partials invoked

- `header_2_localized`
- `footer_branded_both_dirs`

## 3. Approved preview visual slots

Source: `emails/festival_donation.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `totals`
- `wallet_badges`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/render-emails.js#renderDonation`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| totals | Subtotal, Tax | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `ClientAddress`
- `ClientEmail`
- `ClientName`
- `ClientPhone`
- `CreditCardFees`
- `Date`
- `DonatedTo`
- `FestivalName`
- `GrandTotal`
- `HTMLLang`
- `InvoiceID`
- `NotTaxReceiptNote`
- `ProcessingFee`
- `SendToDonatorUser`
- `ShowProcessingFees`
- `ThankYouPrefix`
- `ThankYouSuffix`
- `Time`
- `Title`
- `TotalAmount`
- `TotalCost`
- `TotalProcessingFees`
- `TotalTax`
- `UserAddress`
- `UserCreditCardFees`
- `UserEmail`
- `UserName`
- `UserPhoneNumber`

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

`4-donation-vendor`
