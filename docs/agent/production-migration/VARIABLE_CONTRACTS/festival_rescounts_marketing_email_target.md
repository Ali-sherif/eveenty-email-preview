# VARIABLE CONTRACT - `festival_rescounts_marketing_email_target`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `RescountsFestivalMarketingParams`
- **Note:** Heuristic match score=8 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
Subject       string
FromEmail     string
TargetEmail   string
TargetName    string
Logo          string
Image         string
SubjectText   string
BodyText      string
UnsubsribeURl string
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_rescounts_marketing_email_target.template` (comments excluded):

- `{{ .FromEmail }}`
- `{{ .TargetName }}`
- `{{ .TargetEmail }}`
- `{{ .Subject }}`
- `{{ .Logo }}`
- `{{ .BodyText }}`
- `{{ .Image }}`
- `{{ .UnsubsribeURl }}`

### Dynamic Go field names referenced

- `BodyText`
- `FromEmail`
- `Image`
- `Logo`
- `Subject`
- `TargetEmail`
- `TargetName`
- `UnsubsribeURl`

### Partials invoked

- _(none)_

## 3. Approved preview visual slots

Source: `emails/festival_rescounts_marketing_email_target.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `primary_cta`
- `wallet_badges`
- `organizer_or_festival_logo`
- `marketing_campaign_chrome`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/batch8-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| organizer_or_festival_logo | - | DESIGN SLOT WITHOUT DATA |
| marketing_campaign_chrome | Subject, UnsubsribeURl | MAPPED |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | - | DESIGN SLOT WITHOUT DATA - YAML-backed via emailLocales builders |

### DESIGN SLOT WITHOUT DATA

- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **organizer_or_festival_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **localized_copy_strings**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. YAML-backed via emailLocales builders

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `BodyText`
- `Image`
- `Logo`
- `TargetEmail`
- `TargetName`

## 5. Locale & direction

- **Locales (from backend evidence / CSV, NOT Wallet badge locales):** UNKNOWN - verify Send* language selection
- **Locale builder notes:** UNKNOWN
- Registration templates use `Dir` (not only `HTMLDir`); others typically use `HTMLDir` via `utils.HTMLDirForLang`.

## 6. MIME / attachments

- **Structure:** RFC822 headers + text/html body (single part); no text/plain VERIFIED absence in template
- **Attachments:** none

## 7. Security handoff

`festival_rescounts_marketing_email_target`

## 8. Port batch

`9-security-handoff`
