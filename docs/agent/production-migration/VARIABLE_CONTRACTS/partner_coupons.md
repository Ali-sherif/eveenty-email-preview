# VARIABLE CONTRACT - `partner_coupons`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `partnerCouponsTemplateParamsCopy`
- **Note:** Heuristic match score=15 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromEmail         string
UserEmail         string
UserName          string
PartnerName       string
PartnerID         string
CouponDate        string
PartnerMap        string
PartnerAddress    string
PurchaseDate      string
Coupons           []model.CouponItem
Cost              string
CostTax           string
ProcessingFees    string
ProcessingFeesTax string
CouponTotal       string
SupportNumber     string
Support           bool
Quantity          int64
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/partner_coupons.template` (comments excluded):

- `{{ .FromEmail }}`
- `{{ .UserName }}`
- `{{ .UserEmail }}`
- `{{ .PartnerName }}`
- `{{ template "header_1" }}`
- `{{ $NumberOfCoupons := len .Coupons }}`
- `{{ range $index, $coupon := .Coupons }}`
- `{{ $.PartnerName }}`
- `{{ $coupon.ImageEmail }}`
- `{{ $coupon.Code }}`
- `{{ inc $index }}`
- `{{ $NumberOfCoupons }}`
- `{{ $coupon.Name }}`
- `{{ $coupon.Description }}`
- `{{ $coupon.Quantity }}`
- `{{ $coupon.CouponDate }}`
- `{{ $.PartnerAddress }}`
- `{{ if ne $.PartnerMap "" }}`
- `{{ $.PartnerMap }}`
- `{{ end }}`
- `{{ .PurchaseDate }}`
- `{{ .Cost }}`
- `{{ .CostTax }}`
- `{{ .ProcessingFees }}`
- `{{ .ProcessingFeesTax }}`
- `{{ .CouponTotal }}`

### Dynamic Go field names referenced

- `Code`
- `Cost`
- `CostTax`
- `CouponDate`
- `CouponTotal`
- `Coupons`
- `Description`
- `FromEmail`
- `ImageEmail`
- `Name`
- `PartnerAddress`
- `PartnerMap`
- `PartnerName`
- `ProcessingFees`
- `ProcessingFeesTax`
- `PurchaseDate`
- `Quantity`
- `UserEmail`
- `UserName`

### Partials invoked

- `header_1`

## 3. Approved preview visual slots

Source: `emails/partner_coupons.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `totals`
- `qr_image`
- `wallet_badges`
- `tracking_pixel`
- `greeting_and_body_copy`
- `localized_copy_strings`

Preview renderer: `shared/final7-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| totals | - | DESIGN SLOT WITHOUT DATA |
| qr_image | - | DESIGN SLOT WITHOUT DATA |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| greeting_and_body_copy | UserName | MAPPED |
| localized_copy_strings | - | DESIGN SLOT WITHOUT DATA - YAML-backed via emailLocales builders |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **totals**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **qr_image**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **localized_copy_strings**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. YAML-backed via emailLocales builders

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `Code`
- `Cost`
- `CostTax`
- `CouponDate`
- `CouponTotal`
- `Coupons`
- `Description`
- `ImageEmail`
- `Name`
- `PartnerAddress`
- `PartnerMap`
- `PartnerName`
- `ProcessingFees`
- `ProcessingFeesTax`
- `PurchaseDate`
- `Quantity`
- `UserEmail`

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
