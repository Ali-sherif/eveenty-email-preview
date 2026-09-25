# SEVEN_REFERENCE_MAPPING_REVIEW.md

**Date:** 2026-09-24  
**Mode:** Verify only — no redesign, no production changes  
**Status of seven:** DESIGNED · mapping PASS (this file) · historical browser/Figma parity = evidence only · **conditional owner visual approval** · **final technical gate PASS** 2026-09-26 (see `qa-output/approved-component-corrections/FINAL_SEVEN_TECHNICAL_GATE.md` / `docs/agent/PROJECT_STATE.md`)

---

## Summary

All seven completed references map to the correct original production templates. No missing production template mapping was found. Known intentional design deltas (support header, registration CTA color in kit vs production magenta) are documented — not treated as mapping failures.

| # | Template | Production path | Send functions | Preview | Figma EN | Mapping |
|--:|---|---|---|---|---|---|
| 1 | `activate_email` | `email/templates/activate_email.template` | `SendActivateEmail` | `emails/activate_email.html` | `4:2` | **PASS** |
| 2 | `festival_donation` | `email/templates/festival_donation.template` | `SendUserDonationReceipt`, `SendOrganizerDonation`, `SendAdminDonation` | `emails/festival_donation.html` | `21:2` | **PASS** |
| 3 | `festival_ticket_sale` | `email/templates/festival_ticket_sale.template` | Buyer / Guest / Organizer (+ Admin impl, API commented) | `emails/festival_ticket_sale.html` | `21:53` | **PASS** |
| 4 | `festival_ticket_registration_approval` | `email/templates/festival_ticket_registration_approval.template` | User / Admin / Organizer approval sends | `emails/festival_ticket_registration_approval.html` | `48:45` | **PASS** |
| 5 | `support` | `email/templates/support.template` | `SendSupportEmail` | `emails/support.html` | `22:113` | **PASS** (header intentional kit delta) |
| 6 | `dispute_notification` | `email/templates/dispute_notification.template` | Admin + Organizer dispute sends | `emails/dispute_notification.html` | `72:44` | **PASS** |
| 7 | `festival_marketing_email_target` | `email/templates/festival_marketing_email_target.template` | `SendFestivalMarketingEmailToTarget` | `emails/festival_marketing_email_target.html` | `72:175` | **PASS** |

---

## 1. activate_email (TRANSACTIONAL)

| Check | Result |
|---|---|
| Trigger | User registration / resend activation (`api/v1/user.go`) |
| Send | `SendActivateEmail` → `activateEmailTemplate` |
| Recipients | End user |
| Subject / locale | `BuildActivateEmailLocales`; ProfileLanguage en–fa |
| Variables | Activation URL, user name, localized copy |
| CTA | Activate account URL |
| Partials | None (inline shell) |
| Special | None |
| Preview locales | en fr es ar fa |
| Flags | None material |

---

## 2. festival_donation (COMMERCE)

| Check | Result |
|---|---|
| Trigger | Donation completed (`api/v1/festival_donation.go`) |
| Send | User / Organizer / Admin donation sends (shared template) |
| Recipients | User, organizer, admin |
| Locale | User/org PL; **admin forced EN** |
| Partials | `header_2_localized`, `footer_branded_both_dirs` |
| CTA | None (receipt) — correct |
| Flags | Preview variants cover donator + organizer; admin EN path annotated |

---

## 3. festival_ticket_sale (COMMERCE)

| Check | Result |
|---|---|
| Trigger | Ticket purchase / guest ticket / registration payment completion |
| Send | Buyer, guest, organizer; admin Send* exists but API callers commented |
| Locale | Buyer/guest/org PL; admin EN if called |
| Variables | Tickets, totals, QR image links, Wallet links, calendar links, `FestivalICSData` |
| Partials | `header_4_localized`, `contact_container_both_dirs`, `footer_with_icons_both_dirs` |
| Special | QR + Google/Apple Wallet **links** + calendar links + ICS **data in HTML params**. Observed transport: `smtp.SendMail` with single HTML body — **no MIME file attachments** in send path (preview correctly annotates SAMPLE fixtures / no real MIME) |
| Flags | Admin live caller absent (commented) — document only; buyer/guest/org production-backed |

---

## 4. festival_ticket_registration_approval (COMMERCE / Ticket-Pass)

| Check | Result |
|---|---|
| Trigger | Registration approved (`api/v1/festival_ticket_registration.go`) |
| Send | User / Admin / Organizer |
| Locale | User/org PL; admin EN |
| CTA | Complete-order URL when payment pending |
| Partials | `header_4_localized`, `footer_ticket_registration` |
| Flags | **Kit primary CTA yellow** vs **production magenta button** — intentional Phase 1 design-kit decision; production template unchanged. Secondary magenta accents retained in content chrome. |

---

## 5. support (NOTIFICATION / Internal)

| Check | Result |
|---|---|
| Trigger | Internal error reporting (`errs/errors_email_sender.go`) |
| Send | `SendSupportEmail` |
| Recipients | Internal support |
| Locale | EN-only |
| Partials | Production uses `header_3` |
| Flags | **Kit uses branded header + 160px logo**; production uses `header_3` + large CDN footer logo. Documented intentional reference delta. No primary CTA in production contract — preserved. |

---

## 6. dispute_notification (NOTIFICATION / Workflow)

| Check | Result |
|---|---|
| Trigger | Stripe dispute handlers (`api/helpers/sale_dispute_*`) |
| Send | `SendDisputeNotificationToAdmin`, `SendDisputeNotificationToOrganizer` |
| Locale | Organizer PL; **admin forced EN** |
| CTA | Optional View Payment when payment link present |
| Partials | Inline shell |
| Flags | None material; conditional CTA covered in preview variants |

---

## 7. festival_marketing_email_target (MARKETING)

| Check | Result |
|---|---|
| Trigger | Festival marketing send to targets (`api/v1/festival_marketing_emails.go`) |
| Send | `SendFestivalMarketingEmailToTarget` |
| Locale | Author subject/body; no ProfileLanguage; EN chrome PARTIAL |
| Variables | `BodyText`, festival logo/image, `UnsubsribeURl` (production spelling) |
| CTA | None required; unsubscribe in footer |
| Flags | Not `organizer_announcement` — correct marketing reference. Unsubscribe preserved; no invented legal blocks. |

---

## Cross-checks

| Item | Status |
|---|---|
| All seven still IN SCOPE | Yes |
| None marked owner-approved | Correct — pending |
| `organizer_announcement` not among seven | Correct — in-scope undesigned |
| Preview `EMAIL_IDS` still lists exactly these seven | Yes (`shared/sample-data.js`) |
| Prior Notification-layout draft of reg approval | Discarded historically; current Commerce mapping correct |

---

## Evidence

- Production templates under `email/templates/`
- Registration: `email/smtp_render_template.go`
- QA matrix: `eveenty-email-preview/qa-output/task-03-seven-email-final-review/SEVEN_EMAIL_MATRIX.md`
- Localization audit rows #1, #3, #4, #24, #35, #46, #57
