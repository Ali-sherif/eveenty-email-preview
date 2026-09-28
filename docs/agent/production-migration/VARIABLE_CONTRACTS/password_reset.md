# VARIABLE CONTRACT - `password_reset`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `passwordResetTemplateParams`
- **Note:** Heuristic match score=8 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
UserEmail    string
Code         string
FullName     string
FromEmail    string
HTMLLang     string
HTMLDir      string
BrandLogoURL string
Locales      emailLocales.PasswordResetEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/password_reset.template` (comments excluded):

- `{{ .FromEmail }}`
- `{{ .FullName }}`
- `{{ .UserEmail }}`
- `{{ .Locales.Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.Title }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ .BrandLogoURL }}`
- `{{ .Locales.Heading }}`
- `{{ .Locales.GreetingHello }}`
- `{{ else }}`
- `{{ .Locales.Body }}`
- `{{ .Code }}`
- `{{ .Locales.IgnoreBefore }}`
- `{{ .Locales.IgnoreLinkText }}`
- `{{ .Locales.IgnoreAfter }}`
- `{{ .Locales.FooterSentTo }}`
- `{{ .Locales.Copyright }}`

### Dynamic Go field names referenced

- `Body`
- `BrandLogoURL`
- `Code`
- `Copyright`
- `FooterSentTo`
- `FromEmail`
- `FullName`
- `GreetingHello`
- `HTMLDir`
- `HTMLLang`
- `Heading`
- `IgnoreAfter`
- `IgnoreBefore`
- `IgnoreLinkText`
- `Locales`
- `Subject`
- `Title`
- `UserEmail`

### Partials invoked

- _(none)_

## 3. Approved preview visual slots

Source: `emails/password_reset.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `wallet_badges`
- `tracking_pixel`
- `greeting_and_body_copy`
- `localized_copy_strings`

Preview renderer: `shared/pilot-renderers.js#renderPasswordReset`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | BrandLogoURL | MAPPED |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| greeting_and_body_copy | Locales, Body | MAPPED |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `Code`
- `Copyright`
- `FooterSentTo`
- `FullName`
- `GreetingHello`
- `HTMLLang`
- `Heading`
- `IgnoreAfter`
- `IgnoreBefore`
- `IgnoreLinkText`
- `Title`
- `UserEmail`

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

`1-transactional`
