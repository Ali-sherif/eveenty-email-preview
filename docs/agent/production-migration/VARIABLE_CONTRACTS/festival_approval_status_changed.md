# VARIABLE CONTRACT - `festival_approval_status_changed`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `festivalApprovalStatusChangedParams`
- **Note:** Heuristic match score=13 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
FromName     string
FromEmail    string
ToName       string
ToEmail      string
Subject      string
FestivalName string
ReviewNote   string
HTMLLang  string
HTMLDir   string
BrandLogo string
GreetingHTML string
BodyHTML     string
Locales emailLocales.FestivalApprovalStatusChangedEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/festival_approval_status_changed.template` (comments excluded):

- `{{ .FromName }}`
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
- `{{ .GreetingHTML }}`
- `{{ .BodyHTML }}`
- `{{ if .ReviewNote }}`
- `{{ .Locales.ReviewNotesHeading }}`
- `{{ .Locales.ReviewNotesIntro }}`
- `{{ .ReviewNote }}`
- `{{ .BrandLogo }}`

### Dynamic Go field names referenced

- `BodyHTML`
- `BrandLogo`
- `FestivalName`
- `FromEmail`
- `FromName`
- `GreetingHTML`
- `HTMLDir`
- `HTMLLang`
- `HtmlDocumentTitle`
- `Locales`
- `ReviewNote`
- `ReviewNotesHeading`
- `ReviewNotesIntro`
- `Subject`
- `ToEmail`
- `ToName`

### Partials invoked

- `header_3_both_dirs`

## 3. Approved preview visual slots

Source: `emails/festival_approval_status_changed.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `status_alert`
- `wallet_badges`
- `tracking_pixel`
- `approval_actions`
- `localized_copy_strings`

Preview renderer: `shared/pilot-renderers.js#renderFestivalApproval`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | BrandLogo | MAPPED |
| status_alert | ReviewNote | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| approval_actions | - | DESIGN SLOT WITHOUT DATA |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 
- **approval_actions**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `BodyHTML`
- `FestivalName`
- `GreetingHTML`
- `HTMLLang`
- `HtmlDocumentTitle`
- `ReviewNotesHeading`
- `ReviewNotesIntro`

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

`2-localized-notifications`
