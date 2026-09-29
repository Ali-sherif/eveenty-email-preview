# Visual fix — four approved-design ports (2026-09-29)

Owner-authorized Kit visual parity fixes in `rescounts-backend` against owner-approved HTML Preview designs. Analysis-only comparison first; then implementation; then re-render compare. **No** approved Preview HTML redesign; **no** subject/recipient/link/attachment/business-logic changes.

## Templates

| ID | Approved Preview | Fix |
|---|---|---|
| `registration_approval_status_changed` | `emails/registration_approval_status_changed.html` | Green/red status alert from `.Subject` + `IsApproved`; placement matches approved |
| `festival_approval_status_changed` | `emails/festival_approval_status_changed.html` | Status alert (`AlertTitleApproved` / `AlertTitleRejected`) + branded footer; review-note still `{{ if .ReviewNote }}` |
| `organizer_festival_marketing_email_receipt` | `emails/organizer_festival_marketing_email_receipt.html` | “Emails campaign receipt” alert title + “Campaign receipt” heading; neutral TOTAL; Twitter removed |
| `organizer_festival_marketing_sms_receipt` | `emails/organizer_festival_marketing_sms_receipt.html` | Same SMS equivalents |

## Backend files changed (source of truth)

- `email/templates/kit/registration_approval_status_changed.template`
- `email/templates/kit/festival_approval_status_changed.template`
- `email/templates/kit/organizer_festival_marketing_email_receipt.template`
- `email/templates/kit/organizer_festival_marketing_sms_receipt.template`
- `email/smtp_model.go` — `IsApproved` on both status-changed params
- `email/smtp_user_emails.go` / `email/smtp_organizer_emails.go` — set `IsApproved` in existing branches
- `email/emailLocales/festival_approval_status_change_email_locales.go` — alert title fields
- `pkg/locales/translations/email/festival_approval_status_change_locales/{en,fr,es,ar,fa}.yaml` — alert titles only (email **Subject** strings unchanged)

## Verification

- `go build ./email/...` PASS after edits.
- Re-rendered Kit HTML for all four vs approved Preview (600px browser screenshots).
- Post-fix compare images (temp only): `C:\Users\Ali\AppData\Local\Temp\eveenty-4tpl-fix\compare-*.png`
- Fixture name/amount differences ignored (not defects).

## Match verdict (structure/styling)

| Template | Matches approved design for requested sections? |
|---|---|
| `registration_approval_status_changed` | **Yes** |
| `festival_approval_status_changed` | **Yes** |
| `organizer_festival_marketing_email_receipt` | **Yes** |
| `organizer_festival_marketing_sms_receipt` | **Yes** |

Does **not** close: Level B, DEV/Production deploy, CDN logo identity, security handoff disposition, remaining FINAL_PRE_MERGE items 4–5 (final-seven / registration chrome), or kit golden refresh for these four IDs in `docs/backend-email-migration-evidence/goldens/`.
