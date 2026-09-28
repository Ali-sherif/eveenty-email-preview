# VARIABLE CONTRACT - `bad_content_alert`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `badContentAlertTemplateParams`
- **Note:** Heuristic match score=12 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName        string
FromEmail       string
ToName          string
ToEmail         string
Subject         string
FestivalName    string
UserName        string
UserEmail       string
RequestedAt     string
Action          string
Data            string
ResponseMessage string
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/bad_content_alert.template` (comments excluded):

- `{{ .FromName }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .Subject }}`
- `{{ .FestivalName }}`
- `{{ template "header_3" }}`
- `{{ .UserName }}`
- `{{ .UserEmail }}`
- `{{ .RequestedAt }}`
- `{{ .Action }}`
- `{{ .ResponseMessage }}`
- `{{ .Data }}`

### Dynamic Go field names referenced

- `Action`
- `Data`
- `FestivalName`
- `FromEmail`
- `FromName`
- `RequestedAt`
- `ResponseMessage`
- `Subject`
- `ToEmail`
- `ToName`
- `UserEmail`
- `UserName`

### Partials invoked

- `header_3`

## 3. Approved preview visual slots

Source: `emails/bad_content_alert.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `wallet_badges`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/final7-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | - | DESIGN SLOT WITHOUT DATA - YAML-backed via emailLocales builders |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **localized_copy_strings**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. YAML-backed via emailLocales builders

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `Action`
- `Data`
- `FestivalName`
- `RequestedAt`
- `ResponseMessage`
- `UserEmail`
- `UserName`

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
