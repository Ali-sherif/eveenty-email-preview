# VARIABLE CONTRACT - `book_demo_admin`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `bookDemoAdminEmailParams`
- **Note:** Heuristic match score=15 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName          string
FromEmail         string
ToName            string
ToEmail           string
Subject           string
UserFullName      string
Email             string
PhoneNumber       string
BusinessName      string
NeedHelpWith      string
Message           string
MeetFromTime      string
MeetToTime        string
MeetLink          string
EventCalendarLink string
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/book_demo_admin.template` (comments excluded):

- `{{ .FromName }}`
- `{{ .FromEmail }}`
- `{{ .ToName }}`
- `{{ .ToEmail }}`
- `{{ .Subject }}`
- `{{ .UserFullName }}`
- `{{ .Email }}`
- `{{ .PhoneNumber }}`
- `{{ .BusinessName }}`
- `{{ .NeedHelpWith }}`
- `{{ .Message }}`
- `{{ .MeetFromTime }}`
- `{{ .MeetToTime }}`
- `{{ .MeetLink }}`
- `{{ .EventCalendarLink }}`

### Dynamic Go field names referenced

- `BusinessName`
- `Email`
- `EventCalendarLink`
- `FromEmail`
- `FromName`
- `MeetFromTime`
- `MeetLink`
- `MeetToTime`
- `Message`
- `NeedHelpWith`
- `PhoneNumber`
- `Subject`
- `ToEmail`
- `ToName`
- `UserFullName`

### Partials invoked

- _(none)_

## 3. Approved preview visual slots

Source: `emails/book_demo_admin.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `wallet_badges`
- `calendar_links`
- `tracking_pixel`
- `localized_copy_strings`

Preview renderer: `shared/final7-renderers.js`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | - | DESIGN SLOT WITHOUT DATA - Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host) |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| calendar_links | - | DESIGN SLOT WITHOUT DATA |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | - | DESIGN SLOT WITHOUT DATA - YAML-backed via emailLocales builders |

### DESIGN SLOT WITHOUT DATA

- **branded_header_logo**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Kit uses logo_* manifest assets; legacy uses GetLocalizedLogoURL (obsolete host)
- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **calendar_links**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **localized_copy_strings**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. YAML-backed via emailLocales builders

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `BusinessName`
- `Email`
- `EventCalendarLink`
- `MeetFromTime`
- `MeetLink`
- `MeetToTime`
- `Message`
- `NeedHelpWith`
- `PhoneNumber`
- `UserFullName`

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
