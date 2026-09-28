# VARIABLE CONTRACT - `refund_receipt_organizer`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `refundItemOrganizerParams`
- **Note:** Heuristic match score=14 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromEmail                 string
OrganizerName             string
OrganizerEmail            string
UserName                  string
UserEmail                 string // raw
UserEmailDisplay          string
UserAddress               string
UserPhoneNumber           string
Subject                   string
HeadlinePurchasesRefunded string
FestivalName              string
FestivalAddress           string
FestivalPhoneNumber       string
ShowItemProccessingFees   bool
RefundDate                string
RefundTime                string
RefundItems               []*refundItem
CanceledItems             []*canceledItem
RefundedCost              string
RefundedProcessingFees    string
TotalAmountRefunded       string
DeductedCreditCardFees    string
RefundedCreditCardFees    string
ExternalPaymentMethod     bool
RefundImageURL            string
PaymentMethod             string
IsGratuityFeesRefunded    bool
IsFacilityFeesRefunded    bool
HTMLLang                  string
HTMLDir                   string
BrandLogoURL              string
Locales                   emailLocales.RefundItemsEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/refund_receipt_organizer.template` (comments excluded):

- `{{ .FromEmail }}`
- `{{ .OrganizerName }}`
- `{{ .OrganizerEmail }}`
- `{{ .Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.HtmlDocumentTitle }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ template "header_2_localized" . }}`
- `{{ .FestivalName }}`
- `{{ .HeadlinePurchasesRefunded }}`
- `{{ else }}`
- `{{ .Locales.ClientNameLabel }}`
- `{{ .UserName }}`
- `{{ .Locales.ClientAddressLabel }}`
- `{{ .UserAddress }}`
- `{{ .Locales.ClientPhoneLabel }}`
- `{{ .UserPhoneNumber }}`
- `{{ .Locales.ClientEmailLabel }}`
- `{{ if ne .UserEmail "Not Provided" }}`
- `{{ .UserEmail }}`
- `{{ .UserEmailDisplay }}`
- `{{ .Locales.DateLabel }}`
- `{{ .RefundDate }}`
- `{{ .RefundTime }}`
- `{{ if and .RefundItems .PaymentMethod }}`
- `{{ .Locales.PaymentMethodLabel }}`
- `{{ .PaymentMethod }}`
- `{{ if .RefundItems }}`
- `{{ .Locales.HeadingRefundedItems }}`
- `{{ if .ExternalPaymentMethod }}`
- `{{ .Locales.StaffRefundSuccessExternal }}`
- `{{ .Locales.StaffRefundSuccessCard }}`
- `{{ .Locales.ColID }}`
- `{{ .Locales.ColName }}`
- `{{ .Locales.ColType }}`
- `{{ .Locales.ColQuantity }}`
- `{{ .Locales.ColCost }}`
- `{{ if .ShowItemProccessingFees }}`
- `{{ .Locales.ColProcessingFees }}`
- `{{ .Locales.ColTax }}`
- `{{ if .IsGratuityFeesRefunded }}`
- `{{ .Locales.ColGratuityFee }}`
- `{{ if .IsFacilityFeesRefunded }}`
- `{{ .Locales.ColFacilityFee }}`
- `{{ .Locales.ColTotal }}`
- `{{ $ShowItemProccessingFees := .ShowItemProccessingFees }}`
- `{{ $IsGratuityFeesRefunded := .IsGratuityFeesRefunded }}`
- `{{ $IsFacilityFeesRefunded := .IsFacilityFeesRefunded }}`
- `{{ range $i, $item := .RefundItems }}`
- `{{ $item.ID }}`
- `{{ $item.Name }}`
- `{{ $item.ItemType }}`
- `{{ $item.Quantity }}`
- `{{ $item.Cost }}`
- `{{ if $ShowItemProccessingFees }}`
- `{{ $item.ProcessingFees }}`
- `{{ $item.Tax }}`
- `{{ if $IsGratuityFeesRefunded }}`
- `{{ $item.GratuityFees }}`
- `{{ if $IsFacilityFeesRefunded }}`
- `{{ $item.FacilityFees }}`
- `{{ $item.TotalRefundedForItem }}`
- `{{ if .RefundedCost }}`
- `{{ .Locales.SummaryAmount }}`
- `{{ .RefundedCost }}`
- `{{ if .RefundedProcessingFees }}`
- `{{ .Locales.SummaryProcessingFees }}`
- `{{ .RefundedProcessingFees }}`
- `{{ if .DeductedCreditCardFees }}`
- `{{ .Locales.SummaryBankFees }}`
- `{{ .DeductedCreditCardFees }}`
- `{{ if .RefundedCreditCardFees }}`
- `{{ .RefundedCreditCardFees }}`
- `{{ .Locales.SummaryTotalRefunded }}`
- `{{ .TotalAmountRefunded }}`
- `{{ if .CanceledItems }}`
- `{{ .Locales.HeadingCanceledItems }}`
- `{{ .Locales.CanceledIntro }}`
- `{{ range $i, $item := .CanceledItems }}`
- `{{ if .RefundImageURL }}`
- `{{ .RefundImageURL }}`
- `{{ template "footer_branded_both_dirs" . }}`

### Dynamic Go field names referenced

- `CanceledIntro`
- `CanceledItems`
- `ClientAddressLabel`
- `ClientEmailLabel`
- `ClientNameLabel`
- `ClientPhoneLabel`
- `ColCost`
- `ColFacilityFee`
- `ColGratuityFee`
- `ColID`
- `ColName`
- `ColProcessingFees`
- `ColQuantity`
- `ColTax`
- `ColTotal`
- `ColType`
- `Cost`
- `DateLabel`
- `DeductedCreditCardFees`
- `ExternalPaymentMethod`
- `FacilityFees`
- `FestivalName`
- `FromEmail`
- `GratuityFees`
- `HTMLDir`
- `HTMLLang`
- `HeadingCanceledItems`
- `HeadingRefundedItems`
- `HeadlinePurchasesRefunded`
- `HtmlDocumentTitle`
- `ID`
- `IsFacilityFeesRefunded`
- `IsGratuityFeesRefunded`
- `ItemType`
- `Locales`
- `Name`
- `OrganizerEmail`
- `OrganizerName`
- `PaymentMethod`
- `PaymentMethodLabel`
- `ProcessingFees`
- `Quantity`
- `RefundDate`
- `RefundImageURL`
- `RefundItems`
- `RefundTime`
- `RefundedCost`
- `RefundedCreditCardFees`
- `RefundedProcessingFees`
- `ShowItemProccessingFees`
- `StaffRefundSuccessCard`
- `StaffRefundSuccessExternal`
- `Subject`
- `SummaryAmount`
- `SummaryBankFees`
- `SummaryProcessingFees`
- `SummaryTotalRefunded`
- `Tax`
- `TotalAmountRefunded`
- `TotalRefundedForItem`
- `UserAddress`
- `UserEmail`
- `UserEmailDisplay`
- `UserName`
- `UserPhoneNumber`

### Partials invoked

- `header_2_localized`
- `footer_branded_both_dirs`

## 3. Approved preview visual slots

Source: `emails/refund_receipt_organizer.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `status_alert`
- `totals`
- `wallet_badges`
- `organizer_or_festival_logo`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/batch20-refund-registration-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| status_alert | - | DESIGN SLOT WITHOUT DATA |
| totals | Tax | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| organizer_or_festival_logo | - | DESIGN SLOT WITHOUT DATA |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **status_alert**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **organizer_or_festival_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `CanceledIntro`
- `CanceledItems`
- `ClientAddressLabel`
- `ClientEmailLabel`
- `ClientNameLabel`
- `ClientPhoneLabel`
- `ColCost`
- `ColFacilityFee`
- `ColGratuityFee`
- `ColID`
- `ColName`
- `ColProcessingFees`
- `ColQuantity`
- `ColTax`
- `ColTotal`
- `ColType`
- `Cost`
- `DateLabel`
- `DeductedCreditCardFees`
- `ExternalPaymentMethod`
- `FacilityFees`
- `FestivalName`
- `GratuityFees`
- `HTMLLang`
- `HeadingCanceledItems`
- `HeadingRefundedItems`
- `HeadlinePurchasesRefunded`
- `HtmlDocumentTitle`
- `ID`
- `IsFacilityFeesRefunded`

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
