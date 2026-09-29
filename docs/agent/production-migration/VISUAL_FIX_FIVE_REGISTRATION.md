# Visual fix — five registration approved-design ports (2026-09-29)

Owner-authorized Kit visual parity fixes in `rescounts-backend` against owner-approved HTML Preview designs (`emails/festival_ticket_registration*.html`). Analysis comparison first (`eveenty-reg5-compare`); then implementation; then re-render compare (`eveenty-reg5-fix`). **No** approved Preview HTML redesign; **no** subject/recipient/link/attachment/business-logic/data-mapping changes. Conditional fields (phone, doors/end, map where approved, payment/review deadlines, answers, complete-order CTA) remain data-gated.

## Templates

| ID | Approved Preview | Fix |
|---|---|---|
| `festival_ticket_registration` | `emails/festival_ticket_registration.html` | Remove festival-logo; Ticket N of N cream header; Event Details without centered title; simple automated/contact/© footer |
| `festival_ticket_registration_approval` | `emails/festival_ticket_registration_approval.html` | Remove festival-logo; centered magenta summary/Event Details cards; ticket Answers box + pink divider; boxed Make-your-event + `[WA][LI][FB][X][IG]` placeholders + secondary auto/help |
| `festival_ticket_registration_reject` | `emails/festival_ticket_registration_reject.html` | Keep red reject alert; simpler stacked Event Details; **no map row**; sent-to + short © footer; remove logo/social chrome |
| `festival_ticket_registration_deadline_exceeded` | `emails/festival_ticket_registration_deadline_exceeded.html` | Add “Review deadline exceeded” alert title + body hierarchy; table details + Ticket N of N; simple footer; remove logo/social |
| `festival_ticket_registration_payment_deadline_exceeded` | `emails/festival_ticket_registration_payment_deadline_exceeded.html` | Add “Cancelled” alert title + warning hierarchy; table details + Ticket N of N; simple footer; remove logo/social |

## Backend files changed (source of truth)

- `email/templates/kit/festival_ticket_registration.template`
- `email/templates/kit/festival_ticket_registration_approval.template`
- `email/templates/kit/festival_ticket_registration_reject.template`
- `email/templates/kit/festival_ticket_registration_deadline_exceeded.template`
- `email/templates/kit/festival_ticket_registration_payment_deadline_exceeded.template`
- `email/templates/kit/partials/kit_registration_details.template` — table / approval / reject layouts + simple + approval footers (legacy chrome footer removed)
- `email/smtp_kit.go` — `ticketCounter` FuncMap helper
- `email/emailLocales/festival_ticket_registration_email_locales.go` — alert titles + CopyrightShort / MessageSentTo
- `pkg/locales/translations/email/{en,ar,fr,es,fa}.yaml` — `AlertReviewTitle` / `AlertPaymentTitle` only (subjects unchanged)

## Verification

- `go build ./email/...` PASS after edits.
- Fixture render of all five Kit HTML bodies vs approved Preview (600px browser screenshots).
- Post-fix compare images (temp only): `C:\Users\Ali\AppData\Local\Temp\eveenty-reg5-fix\compare-*.png`
- Fixture name/date/ID differences ignored (not defects).

## Match verdict (structure/styling)

| Template | Matches approved design for requested sections? |
|---|---|
| `festival_ticket_registration` | **PASS** |
| `festival_ticket_registration_approval` | **PASS** |
| `festival_ticket_registration_reject` | **PASS** |
| `festival_ticket_registration_deadline_exceeded` | **PASS** |
| `festival_ticket_registration_payment_deadline_exceeded` | **PASS** |

Does **not** close: Level B, DEV/Production deploy, CDN logo identity, security handoff disposition, final-seven visual NEEDS REVIEW items, or kit golden refresh for these five IDs in `docs/backend-email-migration-evidence/goldens/`.
