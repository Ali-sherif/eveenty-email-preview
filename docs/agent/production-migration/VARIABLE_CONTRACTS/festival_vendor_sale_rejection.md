# VARIABLE CONTRACT - `festival_vendor_sale_rejection`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `festivalVendorSaleRejectionTemplateParams`
- **Note:** Heuristic match score=18 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
From                string
FromEmail           string
Subject             string
ToName              string
ToEmail             string
ClientName          string
ClientEmail         string
ClientPhoneNumber   string
OrderNumber         string
FestivalName        string
BoothName           string
BusinessName        string
Date                string
Time                string
TotalCost           string
TotalTax            string
TotalProcessingFees string
UserCreditCardFees  string
TotalAmount         string
Items               []model.VendorSaleItem
ShowProcessingFees  bool
RejectionReason     string
RejectionNote       string
HTMLLang     string
HTMLDir      string
BrandLogoURL string
Locales      emailLocales.FestivalVendorSaleRejectionEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_vendor_sale_rejection.template` (comments excluded):

- `{{ .From }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.HtmlDocumentTitle }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ else }}`
- `{{ template "header_2_localized" . }}`
- `{{ .Locales.AlertBody }}`
- `{{ .Locales.MoneyReleaseNotice }}`
- `{{ .Locales.OrderTitle }}`
- `{{ .Locales.SummarySubtitle }}`
- `{{ .FestivalName }}`
- `{{ .BoothName }}`
- `{{ .BusinessName }}`
- `{{ if or .RejectionReason .RejectionNote }}`
- `{{ if .RejectionReason }}`
- `{{ if .RejectionNote }}`
- `{{ .Locales.ReasonLabel }}`
- `{{ .RejectionReason }}`
- `{{ .Locales.NoteLabel }}`
- `{{ .RejectionNote }}`
- `{{ .Locales.OrderDetails }}`
- `{{ .Locales.ClientName }}`
- `{{ .ClientName }}`
- `{{ .Locales.ClientPhone }}`
- `{{ .ClientPhoneNumber }}`
- `{{ .Locales.ClientEmail }}`
- `{{ .ClientEmail }}`
- `{{ .Locales.OrderNumber }}`
- `{{ .OrderNumber }}`
- `{{ .Locales.SubmittedAt }}`
- `{{ .Date }}`
- `{{ .Time }}`
- `{{ .Locales.TableItemId }}`
- `{{ .Locales.TableName }}`
- `{{ .Locales.TableType }}`
- `{{ .Locales.TablePrice }}`
- `{{ .Locales.TableQuantity }}`
- `{{ .Locales.TableAmount }}`
- `{{ range $i, $item := .Items }}`
- `{{ $item.ItemID }}`
- `{{ $item.Name }}`
- `{{ $item.Type }}`
- `{{ $item.Cost }}`
- `{{ $item.Quantity }}`
- `{{ $item.Subtotal }}`
- `{{ .Locales.Subtotal }}`
- `{{ .TotalCost }}`
- `{{ if .ShowProcessingFees }}`
- `{{ .Locales.ProcessingFees }}`
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

- `AlertBody`
- `BoothName`
- `BusinessName`
- `ClientEmail`
- `ClientName`
- `ClientPhone`
- `ClientPhoneNumber`
- `Cost`
- `CreditCardFees`
- `Date`
- `FestivalName`
- `From`
- `FromEmail`
- `GrandTotal`
- `HTMLDir`
- `HTMLLang`
- `HtmlDocumentTitle`
- `ItemID`
- `Items`
- `Locales`
- `MoneyReleaseNotice`
- `Name`
- `NoteLabel`
- `OrderDetails`
- `OrderNumber`
- `OrderTitle`
- `ProcessingFees`
- `Quantity`
- `ReasonLabel`
- `RejectionNote`
- `RejectionReason`
- `ShowProcessingFees`
- `Subject`
- `SubmittedAt`
- `Subtotal`
- `SummarySubtitle`
- `TableAmount`
- `TableItemId`
- `TableName`
- `TablePrice`
- `TableQuantity`
- `TableType`
- `Tax`
- `Time`
- `ToEmail`
- `ToName`
- `TotalAmount`
- `TotalCost`
- `TotalProcessingFees`
- `TotalTax`
- `Type`
- `UserCreditCardFees`

### Partials invoked

- `header_2_localized`
- `footer_branded_both_dirs`

## 3. Approved preview visual slots

Source: `emails/festival_vendor_sale_rejection.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `totals`
- `wallet_badges`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/batch20-workflow-renderers.js`

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

- `AlertBody`
- `BoothName`
- `BusinessName`
- `ClientEmail`
- `ClientName`
- `ClientPhone`
- `ClientPhoneNumber`
- `Cost`
- `CreditCardFees`
- `Date`
- `FestivalName`
- `From`
- `GrandTotal`
- `HTMLLang`
- `HtmlDocumentTitle`
- `ItemID`
- `Items`
- `MoneyReleaseNotice`
- `Name`
- `NoteLabel`
- `OrderDetails`
- `OrderNumber`
- `OrderTitle`
- `ProcessingFees`
- `Quantity`
- `ReasonLabel`
- `RejectionNote`
- `RejectionReason`
- `ShowProcessingFees`
- `SubmittedAt`

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
