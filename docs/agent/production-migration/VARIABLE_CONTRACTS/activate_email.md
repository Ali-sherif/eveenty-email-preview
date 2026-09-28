# VARIABLE CONTRACT - `activate_email`

> Phase 0 migration preparation. **Does not** mark production-ready.
> Escaping: Go `text/template` does **not** HTML-escape. VERIFIED: `email/smtp_render_template.go:7` (`text/template` import) and `ParseFiles` at `:104`.

## 1. Params struct (production)

- **Best-match type:** `RestaurantEmailTemplateParams`
- **Note:** Heuristic match score=8 against smtp_model.go
- **Struct fields (smtp_model.go excerpt or template-derived):**

```
UserEmail       string
UserID          model.UserID
DisplayName     string
FromEmail       string
ActivateBaseURL string
HTMLLang        string
HTMLDir         string
BrandLogoURL    string
Locales         emailLocales.ActivateEmailLocales
```

Send path(s) populate these in `email/smtp_*` before `Execute`. See matrix `send_functions`.

## 2. Legacy template actions (`{{ … }}`)

Every distinct action found in `email/templates/activate_email.template` (comments excluded):

- `{{ .FromEmail }}`
- `{{ .DisplayName }}`
- `{{ .UserEmail }}`
- `{{ .Locales.Subject }}`
- `{{ .HTMLLang }}`
- `{{ .HTMLDir }}`
- `{{ .Locales.Title }}`
- `{{ if eq .HTMLDir "rtl" }}`
- `{{ end }}`
- `{{ .BrandLogoURL }}`
- `{{ .Locales.WelcomeHeading }}`
- `{{ .Locales.GreetingLead }}`
- `{{ .Locales.BodyText }}`
- `{{ .ActivateBaseURL }}`
- `{{ .Locales.ButtonText }}`
- `{{ .Locales.FooterLead }}`
- `{{ .Locales.FooterSuffix }}`
- `{{ .Locales.Copyright }}`

### Dynamic Go field names referenced

- `ActivateBaseURL`
- `BodyText`
- `BrandLogoURL`
- `ButtonText`
- `Copyright`
- `DisplayName`
- `FooterLead`
- `FooterSuffix`
- `FromEmail`
- `GreetingLead`
- `HTMLDir`
- `HTMLLang`
- `Locales`
- `Subject`
- `Title`
- `UserEmail`
- `WelcomeHeading`

### Partials invoked

- _(none)_

## 3. Approved preview visual slots

Source: `emails/activate_email.html` (owner-approved HTML Preview). Slots are structural/visual regions inferred from markup (not inventing Go fields):

- `branded_header_logo`
- `primary_cta`
- `wallet_badges`
- `tracking_pixel`
- `greeting_and_body_copy`
- `localized_copy_strings`

Preview renderer: `shared/render-emails.js#renderActivate`

## 4. Slot -> Go-field mapping

| Visual slot | Go field(s) | Status |
|---|---|---|
| branded_header_logo | BrandLogoURL | MAPPED |
| primary_cta | - | DESIGN SLOT WITHOUT DATA - CTA may be locale-built URL field - verify Send* params |
| wallet_badges | - | DESIGN SLOT WITHOUT DATA - Badge images are static kit assets (Condensed/Apple); link fields remain backend |
| tracking_pixel | - | DESIGN SLOT WITHOUT DATA |
| greeting_and_body_copy | GreetingLead, DisplayName, Locales | MAPPED |
| localized_copy_strings | Locales | MAPPED |

### DESIGN SLOT WITHOUT DATA

- **primary_cta**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. CTA may be locale-built URL field - verify Send* params
- **wallet_badges**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. Badge images are static kit assets (Condensed/Apple); link fields remain backend
- **tracking_pixel**: no exact matching Go field found in legacy template actions. Backend/owner must confirm intended data source before inventing fields. 

### LEGACY DATA NOT RENDERED (candidates)

Fields present in the legacy template that are not clearly consumed by a mapped preview slot (may still appear via nested `Locales` or partials - Backend to confirm):

- `ActivateBaseURL`
- `BodyText`
- `ButtonText`
- `Copyright`
- `FooterLead`
- `FooterSuffix`
- `HTMLLang`
- `Title`
- `UserEmail`
- `WelcomeHeading`

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
