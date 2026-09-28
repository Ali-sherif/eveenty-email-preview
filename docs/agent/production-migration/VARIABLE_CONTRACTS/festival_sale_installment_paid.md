# VARIABLE CONTRACT - `festival_sale_installment_paid`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `festivalSaleInstallmentPaidParams`
- **Note:** Heuristic match score=13 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromEmail            string
FromDisplayName      string
ToName               string
ToEmail              string
SubjectLine          string
TopText              string
FestivalName         string
VendorName           string
VendorEmail          string
VendorBusinessName   string
VendorPhoneNumber    string
Date                 string
Time                 string
AmountPaid           string
PaidPercentage       string
ItemDetails          ItemDetails
TotalCost            string
TotalProcessingFees  string
TotalTax             string
UserCreditCardFees   string
TotalAmount          string
ShowProcessingFees   bool
ShowObserverSections bool
HTMLLang             string
HTMLDir              string
BrandLogo            string
Locales              emailLocales.FestivalSaleInstallmentPaidEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_sale_installment_paid.template` (comments excluded):

- `{{ .FromDisplayName }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .SubjectLine }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.HtmlDocumentTitle }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ template "header_3_both_dirs" . }}`
- `{{ else }}`
- `{{ .TopText }}`
- `{{ if .ShowObserverSections }}`
- `{{ .Locales.LabelVendorName }}`
- `{{ .VendorName }}`
- `{{ .Locales.LabelBusinessName }}`
- `{{ .VendorBusinessName }}`
- `{{ .Locales.LabelPhoneNumber }}`
- `{{ .VendorPhoneNumber }}`
- `{{ .Locales.LabelDate }}`
- `{{ .Date }}`
- `{{ .Locales.LabelTime }}`
- `{{ .Time }}`
- `{{ .Locales.TableNo }}`
- `{{ .Locales.TableName }}`
- `{{ .Locales.TableType }}`
- `{{ .Locales.TableQuantity }}`
- `{{ .Locales.TableCost }}`
- `{{ if .ItemDetails.PromoCodeDiscount }}`
- `{{ .Locales.TableDiscount }}`
- `{{ .Locales.TableCostAfterDiscount }}`
- `{{ if .ShowProcessingFees }}`
- `{{ .Locales.TableProcessingFees }}`
- `{{ .Locales.TableTax }}`
- `{{ if .UserCreditCardFees }}`
- `{{ .Locales.TableCreditCardFees }}`
- `{{ .Locales.TableTotal }}`
- `{{ .ItemDetails.Name }}`
- `{{ .ItemDetails.Type }}`
- `{{ .ItemDetails.Quantity }}`
- `{{ .ItemDetails.Cost }}`
- `{{ .ItemDetails.PromoCodeDiscount }}`
- `{{ .ItemDetails.CostAfterPromoCodeDiscount }}`
- `{{ .ItemDetails.ProcessingFees }}`
- `{{ .ItemDetails.Tax }}`
- `{{ .ItemDetails.UserCreditCardFees }}`
- `{{ .ItemDetails.Total }}`
- `{{ .Locales.Subtotal }}`
- `{{ .TotalCost }}`
- `{{ .Locales.ProcessingFees }}`
- `{{ .TotalProcessingFees }}`
- `{{ .Locales.Tax }}`
- `{{ .TotalTax }}`
- `{{ .Locales.CreditCardFees }}`
- `{{ .UserCreditCardFees }}`
- `{{ .Locales.GrandTotal }}`
- `{{ .TotalAmount }}`
- `{{ .BrandLogo }}`

### Dynamic Go field names referenced

- `BrandLogo`
- `Cost`
- `CostAfterPromoCodeDiscount`
- `CreditCardFees`
- `Date`
- `FromDisplayName`
- `FromEmail`
- `GrandTotal`
- `HTMLDir`
- `HTMLLang`
- `HtmlDocumentTitle`
- `ItemDetails`
- `LabelBusinessName`
- `LabelDate`
- `LabelPhoneNumber`
- `LabelTime`
- `LabelVendorName`
- `Locales`
- `Name`
- `ProcessingFees`
- `PromoCodeDiscount`
- `Quantity`
- `ShowObserverSections`
- `ShowProcessingFees`
- `SubjectLine`
- `Subtotal`
- `TableCost`
- `TableCostAfterDiscount`
- `TableCreditCardFees`
- `TableDiscount`
- `TableName`
- `TableNo`
- `TableProcessingFees`
- `TableQuantity`
- `TableTax`
- `TableTotal`
- `TableType`
- `Tax`
- `Time`
- `ToEmail`
- `ToName`
- `TopText`
- `Total`
- `TotalAmount`
- `TotalCost`
- `TotalProcessingFees`
- `TotalTax`
- `Type`
- `UserCreditCardFees`
- `VendorBusinessName`
- `VendorName`
- `VendorPhoneNumber`

### Partials invoked

- `header_3_both_dirs`

## 3. Approved preview visual slots

Source: `emails/festival_sale_installment_paid.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `totals`
- `wallet_badges`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/batch20-installment-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | BrandLogo | MAPPED |
| totals | Total, Subtotal, Tax | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `Cost`
- `CostAfterPromoCodeDiscount`
- `CreditCardFees`
- `Date`
- `FromDisplayName`
- `GrandTotal`
- `HTMLLang`
- `HtmlDocumentTitle`
- `ItemDetails`
- `Name`
- `ProcessingFees`
- `PromoCodeDiscount`
- `Quantity`
- `ShowObserverSections`
- `ShowProcessingFees`
- `SubjectLine`
- `TableCost`
- `TableCostAfterDiscount`
- `TableCreditCardFees`
- `TableDiscount`
- `TableName`
- `TableNo`
- `TableProcessingFees`
- `TableQuantity`
- `TableTax`
- `TableTotal`
- `TableType`
- `Time`
- `TopText`
- `TotalAmount`

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

`3-installments-refunds`
