# VARIABLE CONTRACT - `festival_marketing_approval`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `festivalMarketingApprovalTemplateParams`
- **Note:** Heuristic match score=18 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
Subject         string
FromEmail       string
AdminName       string
AdminEmail      string
FestivalName    string
OrganizerName   string
FestivalLogo    string
FestivalImage   string
NumberOfEmails  string
TotalCost       string
CostTax         string
CreditCardFees  string
TotalPaid       string
FestivalEmail   string
BodyText        string
SubjectText     string
ApproveBaseURL  string
DecclineBaseURL string
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_marketing_approval.template` (comments excluded):

- `{{ .FromEmail }}`
- `{{ .AdminName }}`
- `{{ .AdminEmail }}`
- `{{ .Subject }}`
- `{{ .FestivalName }}`
- `{{ .NumberOfEmails }}`
- `{{ .OrganizerName }}`
- `{{ .TotalCost }}`
- `{{ .CostTax }}`
- `{{ .CreditCardFees }}`
- `{{ .TotalPaid }}`
- `{{ .SubjectText }}`
- `{{ .FestivalEmail }}`
- `{{ .FestivalLogo }}`
- `{{ .BodyText }}`
- `{{ .FestivalImage }}`
- `{{ .ApproveBaseURL }}`
- `{{ .DecclineBaseURL }}`

### Dynamic Go field names referenced

- `AdminEmail`
- `AdminName`
- `ApproveBaseURL`
- `BodyText`
- `CostTax`
- `CreditCardFees`
- `DecclineBaseURL`
- `FestivalEmail`
- `FestivalImage`
- `FestivalLogo`
- `FestivalName`
- `FromEmail`
- `NumberOfEmails`
- `OrganizerName`
- `Subject`
- `SubjectText`
- `TotalCost`
- `TotalPaid`

### Partials invoked

- _(none)_

## 3. Approved preview visual slots

Source: `emails/festival_marketing_approval.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `totals`
- `wallet_badges`
- `organizer_or_festival_logo`
- `marketing_campaign_chrome`
- `tracking_pixel`
- `greeting_and_body_copy`
- `approval_actions`
- `localized_copy_strings`

Preview renderer: `shared/batch20-workflow-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| totals | - | DESIGN SLOT WITHOUT DATA |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| organizer_or_festival_logo | FestivalLogo, FestivalImage | MAPPED |
| marketing_campaign_chrome | Subject | MAPPED |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| greeting_and_body_copy | - | DESIGN SLOT WITHOUT DATA |
| approval_actions | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | - | DESIGN SLOT WITHOUT DATA - YAML-backed via emailLocales builders |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **totals**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **greeting_and_body_copy**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **approval_actions**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **localized_copy_strings**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. YAML-backed via emailLocales builders

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `AdminEmail`
- `AdminName`
- `ApproveBaseURL`
- `BodyText`
- `CostTax`
- `CreditCardFees`
- `DecclineBaseURL`
- `FestivalEmail`
- `FestivalName`
- `NumberOfEmails`
- `OrganizerName`
- `SubjectText`
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

`Marketing Approval`

## 8. Port batch

`9-security-handoff`
