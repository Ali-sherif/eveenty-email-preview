# VARIABLE CONTRACT - `contact_submission`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `contactSubmissionParanms`
- **Note:** Heuristic match score=11 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName         string
FromEmail        string
ToName           string
ToEmail          string
Subject          string
UserName         string
UserEmail        string
UserPhoneNumber  string
UserBusinessName string
Topic            model.ContactSubmissionSubject
Message          string
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/contact_submission.template` (comments excluded):

- `{{ .FromName }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .Subject }}`
- `{{ .UserName }}`
- `{{ .UserEmail }}`
- `{{ .UserPhoneNumber }}`
- `{{ .UserBusinessName }}`
- `{{ .Topic }}`
- `{{ .Message }}`

### Dynamic Go field names referenced

- `FromEmail`
- `FromName`
- `Message`
- `Subject`
- `ToEmail`
- `ToName`
- `Topic`
- `UserBusinessName`
- `UserEmail`
- `UserName`
- `UserPhoneNumber`

### Partials invoked

- _(none)_

## 3. Approved preview visual slots

Source: `emails/contact_submission.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `wallet_badges`
- `tracking_pixel`
- `greeting_and_body_copy`
- `localized_copy_strings`

Preview renderer: `shared/pilot-renderers.js#renderContact`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| greeting_and_body_copy | UserName, ToName, Message | MAPPED |
| localized_copy_strings | - | DESIGN SLOT WITHOUT DATA - YAML-backed via emailLocales builders |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **localized_copy_strings**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. YAML-backed via emailLocales builders

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `Topic`
- `UserBusinessName`
- `UserEmail`
- `UserPhoneNumber`

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

`5-en-only-internal`
