# VARIABLE CONTRACT - `sponsor_first_payment_refund`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `salesFirstPaymentRefund`
- **Note:** Heuristic match score=12 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromEmail       string
FromDisplayName string
ToName          string
ToEmail         string
Subject         string
VendorName      string
VendorEmail     string
FestivalName    string
BoothName       string
DueDate         string
FirstPayment    string
SendTo          string
BodyHTML        string
HTMLLang        string
HTMLDir         string
BrandLogo       string
Locales         emailLocales.FestivalSaleFirstPaymentRefundEmailLocales
RefundItem      model.InstallmentBoothRefundItem
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/sponsor_first_payment_refund.template` (comments excluded):

- `{{ .FromDisplayName }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .FestivalName }}`
- `{{ .Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.HtmlDocumentTitle }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ template "header_3_both_dirs" . }}`
- `{{ else }}`
- `{{ .BodyHTML }}`
- `{{ .Locales.TableID }}`
- `{{ .Locales.TableName }}`
- `{{ .Locales.TablePenaltyAmount }}`
- `{{ .Locales.TableRefundedCost }}`
- `{{ .Locales.TableRefundedTax }}`
- `{{ .Locales.TableCreditCardFees }}`
- `{{ .Locales.TableTotalRefundedForItem }}`
- `{{ .RefundItem.ID }}`
- `{{ .RefundItem.Name }}`
- `{{ .RefundItem.PenaltyAmount }}`
- `{{ .RefundItem.RefundedCost }}`
- `{{ .RefundItem.RefundedCostTax }}`
- `{{ .RefundItem.RefundDeductedCreditCardFees }}`
- `{{ .RefundItem.TotalRefundedForItem }}`
- `{{ .BrandLogo }}`

### Dynamic Go field names referenced

- `BodyHTML`
- `BrandLogo`
- `FestivalName`
- `FromDisplayName`
- `FromEmail`
- `HTMLDir`
- `HTMLLang`
- `HtmlDocumentTitle`
- `ID`
- `Locales`
- `Name`
- `PenaltyAmount`
- `RefundDeductedCreditCardFees`
- `RefundItem`
- `RefundedCost`
- `RefundedCostTax`
- `Subject`
- `TableCreditCardFees`
- `TableID`
- `TableName`
- `TablePenaltyAmount`
- `TableRefundedCost`
- `TableRefundedTax`
- `TableTotalRefundedForItem`
- `ToEmail`
- `ToName`
- `TotalRefundedForItem`

### Partials invoked

- `header_3_both_dirs`

## 3. Approved preview visual slots

Source: `emails/sponsor_first_payment_refund.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

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
| totals | - | DESIGN SLOT WITHOUT DATA |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **totals**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `BodyHTML`
- `FestivalName`
- `FromDisplayName`
- `HTMLLang`
- `HtmlDocumentTitle`
- `ID`
- `Name`
- `PenaltyAmount`
- `RefundDeductedCreditCardFees`
- `RefundItem`
- `RefundedCost`
- `RefundedCostTax`
- `TableCreditCardFees`
- `TableID`
- `TableName`
- `TablePenaltyAmount`
- `TableRefundedCost`
- `TableRefundedTax`
- `TableTotalRefundedForItem`
- `TotalRefundedForItem`

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
