# VARIABLE CONTRACT - `marketing_package_sale`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `festivalVendorSaleTemplateParams`
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
ClientAddress       string
OrderNumber         string
QRCodeImageLink     string
FestivalName        string
BoothName           string
BusinessName        string
Date                string
Time                string
OrderCompletionDate string
OrderCompletionTime string
TotalCost           string
TotalTax            string
TotalProcessingFees string
UserCreditCardFees  string
TotalAmount         string
Items               []model.VendorSaleItem
ShowProcessingFees  bool
HTMLLang     string
HTMLDir      string
BrandLogoURL string
Locales      emailLocales.FestivalVendorSaleEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/marketing_package_sale.template` (comments excluded):

- `{{ .From }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .UserName }}`
- `{{ .Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.HtmlDocumentTitle }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ template "header_2_localized" . }}`
- `{{ .Locales.PurchaseTitle }}`
- `{{ else }}`
- `{{ .IntroParagraph }}`
- `{{ .Locales.ClientName }}`
- `{{ .Locales.ClientAddress }}`
- `{{ .UserAddress }}`
- `{{ .Locales.ClientPhone }}`
- `{{ .UserPhoneNumber }}`
- `{{ .Locales.ClientEmail }}`
- `{{ .UserEmail }}`
- `{{ .Locales.InvoiceID }}`
- `{{ .InvoiceID }}`
- `{{ .Locales.BusinessName }}`
- `{{ .UserBusinessName }}`
- `{{ .Locales.BusinessDescription }}`
- `{{ .UserBusinessDescription }}`
- `{{ .Locales.DateLabel }}`
- `{{ .Date }}`
- `{{ .Time }}`
- `{{ .Locales.TableItemID }}`
- `{{ .Locales.TableName }}`
- `{{ .Locales.TableQuota }}`
- `{{ .Locales.TableValidFor }}`
- `{{ .Locales.TableExpiryDate }}`
- `{{ .Locales.TableAmount }}`
- `{{ range $i, $item := .Items }}`
- `{{ $item.ItemID }}`
- `{{ $item.Name }}`
- `{{ $item.QuotaDescription }}`
- `{{ $item.ValidForDays }}`
- `{{ $item.ExpiryDate }}`
- `{{ $item.Cost }}`
- `{{ .Locales.Subtotal }}`
- `{{ .TotalCost }}`
- `{{ .Locales.Tax }}`
- `{{ .TotalTax }}`
- `{{ .Locales.GrandTotal }}`
- `{{ .TotalAmount }}`
- `{{ template "footer_branded_both_dirs" . }}`

### Dynamic Go field names referenced

- `BusinessDescription`
- `BusinessName`
- `ClientAddress`
- `ClientEmail`
- `ClientName`
- `ClientPhone`
- `Cost`
- `Date`
- `DateLabel`
- `ExpiryDate`
- `From`
- `FromEmail`
- `GrandTotal`
- `HTMLDir`
- `HTMLLang`
- `HtmlDocumentTitle`
- `IntroParagraph`
- `InvoiceID`
- `ItemID`
- `Items`
- `Locales`
- `Name`
- `PurchaseTitle`
- `QuotaDescription`
- `Subject`
- `Subtotal`
- `TableAmount`
- `TableExpiryDate`
- `TableItemID`
- `TableName`
- `TableQuota`
- `TableValidFor`
- `Tax`
- `Time`
- `ToEmail`
- `ToName`
- `TotalAmount`
- `TotalCost`
- `TotalTax`
- `UserAddress`
- `UserBusinessDescription`
- `UserBusinessName`
- `UserEmail`
- `UserName`
- `UserPhoneNumber`
- `ValidForDays`

### Partials invoked

- `header_2_localized`
- `footer_branded_both_dirs`

## 3. Approved preview visual slots

Source: `emails/marketing_package_sale.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `totals`
- `wallet_badges`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/final7-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| totals | Subtotal, Tax | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `BusinessDescription`
- `BusinessName`
- `ClientAddress`
- `ClientEmail`
- `ClientName`
- `ClientPhone`
- `Cost`
- `Date`
- `DateLabel`
- `ExpiryDate`
- `From`
- `GrandTotal`
- `HTMLLang`
- `HtmlDocumentTitle`
- `IntroParagraph`
- `InvoiceID`
- `ItemID`
- `Items`
- `Name`
- `PurchaseTitle`
- `QuotaDescription`
- `TableAmount`
- `TableExpiryDate`
- `TableItemID`
- `TableName`
- `TableQuota`
- `TableValidFor`
- `Time`
- `TotalAmount`
- `TotalCost`

## 5. Locale & direction

- **Locales (from backend evidence / CSV, NOT Wallet badge locales):** UNKNOWN - verify Send* language selection
- **Locale builder notes:** UNKNOWN
- Registration templates use `Dir` (not only `HTMLDir`); others typically use `HTMLDir` via `utils.HTMLDirForLang`.

## 6. MIME / attachments

- **Structure:** RFC822 headers + text/html body (single part); no text/plain VERIFIED absence in template
- **Attachments:** none

## 7. Security handoff

`Final Seven - Backend/Security Review`

## 8. Port batch

`9-security-handoff`
