# Pilot review pack

**Date:** 2026-09-26  
**Scope:** six HTML Preview templates only; stop for owner review.  
**Gate prerequisite:** seven-reference final technical gate **PASS**.

## Results

| Template | Traceability | Structural / contrast | Responsive / RTL | Desktop / mobile | Result |
|---|---|---|---|---|---|
| `password_reset` | PASS · profile language, en/fr/es/ar/fa | PASS | PASS · RTL checked | [800](screenshots/password_reset--desktop-800.png) · [320](screenshots/password_reset--mobile-320.png) | **PASS** |
| `refund_receipt_user` | PASS · refund locale YAML, en/fr/es/ar/fa; refund/cancel conditions | PASS | PASS · RTL checked | [800](screenshots/refund_receipt_user--desktop-800.png) · [320](screenshots/refund_receipt_user--mobile-320.png) | **PASS** |
| `festival_ticket_registration_reject` | PASS · user/organizer profile locale; admin EN; three personas | PASS | PASS · RTL checked | [800](screenshots/festival_ticket_registration_reject--desktop-800.png) · [320](screenshots/festival_ticket_registration_reject--mobile-320.png) | **PASS** |
| `festival_approval_status_changed` | PASS · organizer profile locale; approved/rejected + review-note condition | PASS | PASS · RTL checked | [800](screenshots/festival_approval_status_changed--desktop-800.png) · [320](screenshots/festival_approval_status_changed--mobile-320.png) | **PASS** |
| `contact_submission` | PASS · admin EN only | PASS | PASS | [800](screenshots/contact_submission--desktop-800.png) · [320](screenshots/contact_submission--mobile-320.png) | **PASS** |
| `organizer_announcement` | PASS · caller-supplied content, no locale | PASS (preview escapes content) | PASS | [800](screenshots/organizer_announcement--desktop-800.png) · [320](screenshots/organizer_announcement--mobile-320.png) | **PASS** preview / **BLOCKED** production migration on security findings |

## Fresh QA summary

- Catalog: **PASS** — 59 physical / 11 excluded / 48 in scope / 13 designed / 35 undesigned; all six pilot entries selectable and mapped to real preview files.
- Structural/rendering: **PASS** — 57 locale/variant renders, 0 failures; all HTML files below 102 KB.
- Responsive: **PASS** — 46 Chromium checks at 800/414/375/320, including six 320px long-content stress checks; 0 horizontal overflow.
- RTL: **PASS** — 16 Arabic checks; `dir=rtl` confirmed. Technical identifiers remain LTR.
- Contrast: **PASS** — heading 14.34:1, body 8.59:1, success 6.81:1, error 7.60:1, CTA pair 5.52:1.
- Desktop/mobile screenshots: **PASS** — 12 fresh captures, visually inspected.
- Gmail / Outlook / Apple Mail (Level B): **NOT RUN**.
- Figma: **NOT RUN / out of scope**.

Raw evidence: `pilot-qa-results.json`. Harness: `capture-pilot-qa.mjs`.

## Security note

The Preview escapes all synthetic dynamic values. Read-only backend review found a likely header-injection boundary gap and unsanitized HTML boundary in `organizer_announcement`; see `PILOT_SECURITY_REVIEW.md`. No backend fix was authorized or made.

## Owner review gate

No pilot template is marked owner visual approved. Review the 12 captures and choose whether to accept, request focused pilot changes, or authorize a named next batch. Do not start B1–B10 automatically.
