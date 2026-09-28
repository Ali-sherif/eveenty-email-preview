# VARIABLE CONTRACT - `festival_sponsor_sale`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `sponsorSaleParams`
- **Note:** Heuristic match score=12 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
From                      string
FromEmail                 string
Subject                   string
ToName                    string
ToEmail                   string
Title                     string
ParagraphText             string
RejectionReason           string
RejectionImage            string // Rejection image is an image that can be used in the case of reject sale
ShowEventButton           bool
FestivalName              string
ContractLink              string
InvoiceID                 string
VendorName                string
VendorAddress             string
VendorPhoneNumber         string
VendorEmail               string
VendorBusinessName        string
VendorBusinessDescription string
Date                      string
Time                      string
ShowProcessingFees        bool
TotalCost                 string
TotalTax                  string
TotalProcessingFees       string
UserCreditCardFees        string
TotalAmount               string
PromoCode                 string
PromoCodeDiscount         string
Items                     []vendorPruchase
InstallmentItems          []installmentItemDetails
IsSalePaid                bool
PaymentMethod             string
GoogleCalendarLink        string
AppleCalendarLink         string
YahooCalendarLink         string
FestivalICSData           string
HTMLLang     string
HTMLDir      string
BrandLogoURL string
Locales      emailLocales.FestivalSponsorSaleEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_sponsor_sale.template` (comments excluded):

- `{{ .From }}`
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
- `{{ template "header_2_localized" . }}`
- `{{ .Title }}`
- `{{ .Locales.AddToLabel }}`
- `{{ .GoogleCalendarLink }}`
- `{{ else }}`
- `{{ .Locales.GoogleCalendar }}`
- `{{ .AppleCalendarLink }}`
- `{{ .Locales.AppleCalendar }}`
- `{{ .YahooCalendarLink }}`
- `{{ .Locales.YahooCalendar }}`
- `{{ if .ParagraphText }}`
- `{{ .ParagraphText }}`
- `{{ if .RejectionReason }}`
- `{{ .RejectionReason }}`
- `{{ if .ShowEventButton }}`
- `{{ .Locales.CheckEvents }}`
- `{{ if .ContractLink }}`
- `{{ .Locales.ContractPrefix }}`
- `{{ .ContractLink }}`
- `{{ .Locales.ContractClickHere }}`
- `{{ .Locales.ClientName }}`
- `{{ .VendorName }}`
- `{{ .Locales.ClientAddress }}`
- `{{ .VendorAddress }}`
- `{{ .Locales.ClientPhone }}`
- `{{ .VendorPhoneNumber }}`
- `{{ .Locales.ClientEmail }}`
- `{{ .VendorEmail }}`
- `{{ if .PaymentMethod }}`
- `{{ .Locales.PaymentMethodLabel }}`
- `{{ .PaymentMethod }}`
- `{{ .Locales.InvoiceIDLabel }}`
- `{{ .InvoiceID }}`
- `{{ .Locales.BusinessName }}`
- `{{ .VendorBusinessName }}`
- `{{ .Locales.BusinessDescription }}`
- `{{ .VendorBusinessDescription }}`
- `{{ .Locales.DateLabel }}`
- `{{ .Date }}`
- `{{ .Time }}`
- `{{ if .InstallmentItems }}`
- `{{ .Locales.PurchaseDetails }}`
- `{{ .Locales.TableNo }}`
- `{{ .Locales.TableName }}`
- `{{ .Locales.TableFullPrice }}`
- `{{ .Locales.TableReceivedPercentage }}`
- `{{ .Locales.TablePendingAmount }}`
- `{{ .Locales.TableDiscountAmount }}`
- `{{ .Locales.TableTotal }}`
- `{{ range $i, $item := .InstallmentItems }}`
- `{{ inc $i }}`
- `{{ $item.Name }}`
- `{{ $item.FullPrice }}`
- `{{ $item.ReceievedPrecentage }}`
- `{{ if $item.HasPromoCodeDiscount }}`
- `{{ $item.PendingAmount }}`
- `{{ $item.PromoCodeCostDiscount }}`
- `{{ $item.PendingAmountAfterPromoCodeDiscount }}`
- `{{ .Locales.TodaysPayments }}`
- `{{ .Locales.TableItemId }}`
- `{{ .Locales.TableType }}`
- `{{ .Locales.TablePrice }}`
- `{{ .Locales.TableQuantity }}`
- `{{ .Locales.TableAmount }}`
- `{{ range $i, $item := .Items }}`
- `{{ $item.ItemID }}`
- `{{ $item.Type }}`
- `{{ $item.Cost }}`
- `{{ $item.Quantity }}`
- `{{ $item.Subtotal }}`
- `{{ if .IsSalePaid }}`
- `{{ .Locales.Subtotal }}`
- `{{ .TotalCost }}`
- `{{ if .PromoCode }}`
- `{{ .Locales.PromoCode }}`
- `{{ .PromoCode }}`
- `{{ .Locales.PromoCodeDiscount }}`
- `{{ .PromoCodeDiscount }}`
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
- `{{ $showProcessingFees := .ShowProcessingFees }}`
- `{{ $saleUserCreditCardFees := .UserCreditCardFees }}`
- `{{ .Locales.DueOnHeading }}`
- `{{ .Locales.DueTableCost }}`
- `{{ if $showProcessingFees }}`
- `{{ $.Locales.DueTableProcessingFees }}`
- `{{ .Locales.DueTableTax }}`
- `{{ if $saleUserCreditCardFees }}`
- `{{ $.Locales.DueTableCreditCardFees }}`
- `{{ .Locales.DueTableTotalPending }}`
- `{{ .Locales.DueTableDueOn }}`
- `{{ $item.ProcessingFees }}`
- `{{ $item.Tax }}`
- `{{ $item.UserCreditCardFees }}`
- `{{ $item.Total }}`
- `{{ $item.DueDate }}`
- `{{ if .RejectionImage }}`
- `{{ .RejectionImage }}`
- `{{ template "footer_branded_both_dirs" . }}`
- `{{ .FestivalICSData }}`

### Dynamic Go field names referenced

- `AddToLabel`
- `AppleCalendar`
- `AppleCalendarLink`
- `BusinessDescription`
- `BusinessName`
- `CheckEvents`
- `ClientAddress`
- `ClientEmail`
- `ClientName`
- `ClientPhone`
- `ContractClickHere`
- `ContractLink`
- `ContractPrefix`
- `Cost`
- `CreditCardFees`
- `Date`
- `DateLabel`
- `DueDate`
- `DueOnHeading`
- `DueTableCost`
- `DueTableCreditCardFees`
- `DueTableDueOn`
- `DueTableProcessingFees`
- `DueTableTax`
- `DueTableTotalPending`
- `FestivalICSData`
- `FestivalName`
- `From`
- `FromEmail`
- `FullPrice`
- `GoogleCalendar`
- `GoogleCalendarLink`
- `GrandTotal`
- `HTMLDir`
- `HTMLLang`
- `HasPromoCodeDiscount`
- `HtmlDocumentTitle`
- `InstallmentItems`
- `InvoiceID`
- `InvoiceIDLabel`
- `IsSalePaid`
- `ItemID`
- `Items`
- `Locales`
- `Name`
- `ParagraphText`
- `PaymentMethod`
- `PaymentMethodLabel`
- `PendingAmount`
- `PendingAmountAfterPromoCodeDiscount`
- `ProcessingFees`
- `PromoCode`
- `PromoCodeCostDiscount`
- `PromoCodeDiscount`
- `PurchaseDetails`
- `Quantity`
- `ReceievedPrecentage`
- `RejectionImage`
- `RejectionReason`
- `ShowEventButton`
- `ShowProcessingFees`
- `Subject`
- `Subtotal`
- `TableAmount`
- `TableDiscountAmount`
- `TableFullPrice`
- `TableItemId`
- `TableName`
- `TableNo`
- `TablePendingAmount`
- `TablePrice`
- `TableQuantity`
- `TableReceivedPercentage`
- `TableTotal`
- `TableType`
- `Tax`
- `Time`
- `Title`
- `ToEmail`
- `ToName`
- `TodaysPayments`
- `Total`
- `TotalAmount`
- `TotalCost`
- `TotalProcessingFees`
- `TotalTax`
- `Type`
- `UserCreditCardFees`
- `VendorAddress`
- `VendorBusinessDescription`
- `VendorBusinessName`
- `VendorEmail`
- `VendorName`
- `VendorPhoneNumber`
- `YahooCalendar`
- `YahooCalendarLink`

### Partials invoked

- `header_2_localized`
- `footer_branded_both_dirs`

## 3. Approved preview visual slots

Source: `emails/festival_sponsor_sale.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `totals`
- `wallet_badges`
- `calendar_links`
- `organizer_or_festival_logo`
- `tracking_pixel`
- `approval_actions`
- `ics_note_or_calendar`
- `localized_copy_strings`

Preview renderer: `shared/batch8-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| totals | Total, Subtotal, Tax | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| calendar_links | GoogleCalendarLink, YahooCalendarLink, AppleCalendarLink, FestivalICSData | MAPPED |
| organizer_or_festival_logo | - | DESIGN SLOT WITHOUT DATA |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| approval_actions | - | DESIGN SLOT WITHOUT DATA |
| ics_note_or_calendar | FestivalICSData, GoogleCalendarLink, YahooCalendarLink, AppleCalendarLink | MAPPED |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **organizer_or_festival_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **approval_actions**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `AddToLabel`
- `AppleCalendar`
- `BusinessDescription`
- `BusinessName`
- `CheckEvents`
- `ClientAddress`
- `ClientEmail`
- `ClientName`
- `ClientPhone`
- `ContractClickHere`
- `ContractLink`
- `ContractPrefix`
- `Cost`
- `CreditCardFees`
- `Date`
- `DateLabel`
- `DueDate`
- `DueOnHeading`
- `DueTableCost`
- `DueTableCreditCardFees`
- `DueTableDueOn`
- `DueTableProcessingFees`
- `DueTableTax`
- `DueTableTotalPending`
- `FestivalName`
- `From`
- `FullPrice`
- `GoogleCalendar`
- `GrandTotal`
- `HTMLLang`

## 5. Locale & direction

- **Locales (from backend evidence / CSV, NOT Wallet badge locales):** UNKNOWN - verify Send* language selection
- **Locale builder notes:** UNKNOWN
- Registration templates use `Dir` (not only `HTMLDir`); others typically use `HTMLDir` via `utils.HTMLDirForLang`.

## 6. MIME / attachments

- **Structure:** multipart/mixed boundary="boundary-string" | part: text/html; charset="utf-8" | part: text/calendar attachment filename="event.ics" body {{.FestivalICSData}}
- **Attachments:** event.ics (FestivalICSData)

## 7. Security handoff

`none`

## 8. Port batch

`7-ics-sales`
