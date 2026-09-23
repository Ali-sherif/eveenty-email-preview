# Task 03 — Phase A Inventory

**Date:** 2026-09-24  
**Authoritative scope:** `D:\emails\Eveenty-Email-Kit-Phase1\phase-1-email-scope.md`  
**Preview:** `D:\last\eveenty-email-preview`  
**Backend (READ ONLY):** `D:\last\rescounts-backend\email\templates\`  
**Email Kit Figma:** https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit

---

## 1. Discovered repositories / sources

| Role | Path / URL | Mode |
|---|---|---|
| Task 01 docs | `D:\emails\Eveenty-Email-Kit-Phase1` | Read/write Task 01 docs only as needed |
| References | `D:\emails\references` | Read only |
| Backend templates / YAML | `D:\last\rescounts-backend` | **STRICTLY READ ONLY** |
| Local email preview | `D:\last\eveenty-email-preview` | Design preview work |
| Owner logos | `D:\emails\{English,french,Spanish,Arabic,Farse}.png` | Read only / byte-verify |
| Editable Email Kit | Figma `yz7YggnG4H2RuUd23f9zPk` | Editable |
| Original Design System | Figma `DeMR3FHvQbVJYmwStKivVg` | **READ ONLY** |
| Activation final sync | `qa-output/task-02-activation/final-sync/` | Reference baseline |

Physical backend top-level `*.template` count: **59** (verified).

---

## 2. Scope conflict with Task 03 briefing (RESOLVED AGAINST AUTHORITATIVE DOC)

| Claim in Task 03 briefing | Authoritative `phase-1-email-scope.md` | Resolution for this task |
|---|---|---|
| 48 in-scope | **47** in-scope (59 − 12) | Use **47** |
| Marketing 3 | Marketing **2** | Use **2** |
| Marketing reference = `organizer_announcement.template` | `organizer_announcement` is **EXCLUDED / REMOVED 2026-09-23** | **Do not design** `organizer_announcement` |
| Exclusions = 11 | Exclusions = **12** (prior 11 + announcement) | Use **12** |
| Marketing reference alternatives in scope doc | `festival_marketing_email_target` or `festival_rescounts_marketing_email_target` | **Proceed with `festival_marketing_email_target`** |

Owner decision text (scope doc): *“Do not design unsubscribe/legal blocks or invent payload fields for [`organizer_announcement`] in Phase 1.”*

---

## 3. Approved inventory counts

| Metric | Count |
|---|--:|
| Physical templates | 59 |
| Phase 1 exclusions | 12 |
| Phase 1 in-scope | **47** |
| Transactional | 2 |
| Commerce | 26 |
| Notification | 17 |
| Marketing | 2 |

### Exclusions (12) — do not redesign

1. `restaurant_approval.template`  
2. `restaurant_decline.template`  
3. `receipt.template`  
4. `invoice.template`  
5. `marketing.template`  
6. `marketing2.template`  
7. `marketing3.template`  
8. `marketing4.template`  
9. `marketing_approval_1.template`  
10. `marketing_sms_approval.template`  
11. `marketing_notification_approval.template`  
12. `organizer_announcement.template` (**REMOVED from Phase 1**)

---

## 4. Existing local HTML preview inventory

| Preview HTML | Template | Master | HTML exists? | Editable Figma exists? | Notes |
|---|---|---|---|---|---|
| `emails/activate_email.html` | `activate_email` | TRANSACTIONAL | Yes | **Yes — synchronized** (Task 02) | Reference #1 CLOSED visually (awaiting final owner sign-off) |
| `emails/festival_donation.html` | `festival_donation` | COMMERCE | Yes | Draft frame `21:2` | Not Activation-synced (logo still default 200) |
| `emails/festival_ticket_sale.html` | `festival_ticket_sale` | COMMERCE | Yes | Draft frame `21:53` | **COMMERCE reference candidate** — needs Activation standards |
| `emails/festival_ticket_registration_approval.html` | `festival_ticket_registration_approval` | COMMERCE / Ticket-Pass | Yes | Draft `48:45` | Scope note: earlier Notification-layout draft **DISCARDED**; keep as Commerce later |
| `emails/support.html` | `support` | NOTIFICATION | Yes | Draft `22:113` | EN-only internal ops — not the Notification reference |
| — | `dispute_notification` | NOTIFICATION | **No** | **No** | **NOTIFICATION reference — create** |
| — | `festival_marketing_email_target` | MARKETING | **No** | **No** | **MARKETING reference — create** |
| — | `festival_rescounts_marketing_email_target` | MARKETING | **No** | **No** | Catalog later |
| — | remaining 40 in-scope | various | **No** | Catalog placeholders only (page 06) | Phase F after approval |

**Do not equate HTML preview with approved Figma design.** Only Activation has closed visual decisions + locale parity evidence.

Preview app registry (`EMAIL_IDS` in `shared/sample-data.js`): 5 entries matching the five HTML files above. Preview server currently running (`npm start` / serve).

---

## 5. Figma Email Kit state (editable file)

| Page | Content |
|---|---|
| `00 — Cover & Decisions` | Scope decisions + Activation CLOSED board |
| `01` Tokens | Foundations |
| `02` Shared components | Header/Footer/CTA/Typography/Shell + Commerce modules (Totals, Ticket, QR, Wallet, Calendar, Attachment) |
| `03` Master layouts | Architecture |
| `04` Templates (Draft) | Activation (full locales) + Donation EN + TicketSale EN + RegApproval EN + Support EN |
| `05` QA & stress | Stress fixtures |
| `06` Catalog — Phase 1 (48) | **Stale count label (48)** — authoritative is 47 |
| `07` QA checklist | Handoff |

Missing editable reference designs for: **dispute_notification**, **festival_marketing_email_target**.

---

## 6. Reference design plan (authorized — Phases C–E)

| # | Family | Template | Why |
|---|---|---|---|
| 1 | TRANSACTIONAL | `activate_email` | Already synchronized — preserve |
| 2 | COMMERCE | `festival_ticket_sale` | QR/Wallet/Calendar/attachments/totals; buyer/guest/org/admin |
| 3 | NOTIFICATION | `dispute_notification` | Status/workflow; organizer full locales; admin EN |
| 4 | MARKETING | `festival_marketing_email_target` | Existing unsubscribe in production template; author body contract |

**STOP after these four references for owner review. Phase F (remaining 43) requires explicit approval.**

---

## 7. Per-reference special requirements (audit)

### `festival_ticket_sale` (COMMERCE)
- Partials: `header_4_localized`, `contact_container_both_dirs`, `footer_with_icons_both_dirs`
- Audiences: buyerUser, guestUser, organizer, admin (admin EN)
- Multipart MIME + ICS/PDF attachments (preview: callout only; no real MIME)
- QR + Google/Apple Wallet + calendar links (SAMPLE fixtures / example.com)
- Totals / financial rows
- Locales: full for buyer/org; preview currently EN + limited AR/FA stubs — verify YAML coverage before claiming locales
- Gaps vs Activation standards: logoWidth 200, heading weight 700, visible preheader bar inside body (preview-only annotation risk), magenta not primary CTA pattern

### `dispute_notification` (NOTIFICATION)
- Inline shell (no shared partials)
- Status alert box, details table, optional evidence deadline, optional View Payment CTA (`#E8CF21` production)
- Organizer: full en–fa; Admin: forced EN + subject suffix
- Need Help + branded footer logo 200px in production (design: apply 160 nominal)
- No existing preview or Figma frame

### `festival_marketing_email_target` (MARKETING)
- Festival logo + author `BodyText` + festival image
- Footer: “Powered by Eveenty” + preferences + **existing** unsubscribe URL
- Localization: PARTIAL (author body); chrome largely English — design current coverage only
- Do **not** invent new legal/unsubscribe beyond what template already ships
- No Eveenty localized brand header in production (festival logo) — preserve content contract; apply Email Kit shell carefully without inventing Chrome Eveenty header if production uses festival logo

---

## 8. Migration priority matrix (47 in-scope)

| Priority | Count | Items | Gate |
|---|--:|---|---|
| P0 Reference | 4 | activate (done), ticket_sale, dispute, festival_marketing_email_target | Owner review after Phase E |
| P1 Same-family near neighbors | ~12 | Other ticket sales, donation, refunds, needs_response_dispute, festival_rescounts_marketing | After P0 approval |
| P2 Remaining Commerce | ~20 | Installments, sponsor, payout, partner coupons, registration family | Catalog |
| P3 Remaining Notification | ~14 | Workflow + internal EN-only | Catalog |
| EXCLUDED | 12 | See §3 | Never in Phase 1 |

---

## 9. Preview vs Figma gaps (current)

| Template | Preview | Figma | Activation-standard parity |
|---|---|---|---|
| activate_email | Synced | Synced | **PASS** (Task 02) |
| festival_ticket_sale | Draft HTML | Draft EN desktop only | FAIL (logo 200, etc.) |
| festival_donation | Draft HTML | Draft EN desktop only | Out of Task 03 reference set |
| festival_ticket_registration_approval | Draft HTML | Draft EN | Out of reference set; Commerce later |
| support | Draft HTML EN | Draft EN | Out of reference set |
| dispute_notification | Missing | Missing | Create |
| festival_marketing_email_target | Missing | Missing | Create |
