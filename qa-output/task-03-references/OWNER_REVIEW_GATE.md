# Task 03 — Owner Review Gate

**Date:** 2026-09-24  
**Status:** **STOP — awaiting explicit owner approval of all four references before Phase F**  
**Email Kit Figma:** https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit  
**Preview:** http://localhost:4173/  
**QA output:** `D:\last\eveenty-email-preview\qa-output\task-03-references\`

**Gmail / Outlook / Apple Mail client tests: NOT EXECUTED.**

---

## Scope conflict (resolved against authoritative doc)

| Task 03 briefing claim | `phase-1-email-scope.md` | Applied |
|---|---|---|
| 48 in-scope / Marketing 3 | **47** in-scope / Marketing **2** | **47 / 2** |
| Marketing reference = `organizer_announcement` | **EXCLUDED 2026-09-23** | **Not designed** |
| Marketing reference | `festival_marketing_email_target` (or rescounts variant) | **`festival_marketing_email_target`** |

See `PHASE_A_INVENTORY.md` and `SHARED_COMPONENT_IMPACT.md`.

---

## Four references for owner approval

| # | Family | Template | Figma | Local preview |
|---|---|---|---|---|
| 1 | TRANSACTIONAL | `activate_email` | [4:2](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2) (+ locale frames) | `activate_email` — Task 02 synced |
| 2 | COMMERCE | `festival_ticket_sale` | [21:53](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=21-53) | `festival_ticket_sale` — Activation standards applied |
| 3 | NOTIFICATION | `dispute_notification` | [72:44 EN](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=72-44) · [72:111 AR](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=72-111) | `dispute_notification` — new |
| 4 | MARKETING | `festival_marketing_email_target` | [72:175](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=72-175) · mobile [72:192](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=72-192) | `festival_marketing_email_target` — new |

Cover gate board: `73:2` on page `00 — Cover & Decisions`.

---

## Activation foundations applied (comparison)

| Standard | Activation | Ticket Sale | Dispute | Marketing Target |
|---|---|---|---|---|
| CTA yellow `#E9D023` / dark `#4D4C49` | Yes (primary) | N/A primary (wallet secondary links) | Yes when `ViewPaymentLink` | N/A (no primary CTA in production) |
| Logo 160px Eveenty PNG | Yes | Yes | Yes | **Festival logo slot** (production contract — not Eveenty header) |
| Header `#FEFDF4` | Yes | Yes | Yes | Surface / pink campaign band per template |
| Heading SemiBold 600 | Yes | Ticket title 600 | Section titles 600 | Body Regular (no H1 in production) |
| Fluid Hybrid 600 | Yes | Yes | Yes | Yes |
| No visible body preheader | Yes | Yes (removed bar) | Yes | Yes |
| RTL AR/FA | Yes | Yes | Organizer yes; admin EN | EN chrome only (PARTIAL) |

---

## New / updated shared components

### Preview (`shared/email-kit.js`)
- `statusAlertWarning`, `nextStepsPanel`, `detailsTable`
- `marketingFestivalHeader`, `marketingCampaignFooter`
- Shell: `overflow-x:hidden`, `table-layout:fixed`, stronger mobile wallet stacking
- `brandedHeader` default **remains 160 opt-in via `logoWidth:160`** (donation/reg_approval/support still default 200 — deferred)

### Figma
- Ticket Sale `21:53`: logo 160, header `#FEFDF4` h=112, visible Preheader hidden
- New Dispute EN/AR frames + admin EN-only note
- New Marketing EN desktop/mobile
- Cover Task 03 review gate board

### Preview app
- New emails: `dispute_notification`, `festival_marketing_email_target`
- Locales for ticket + dispute: en/fr/es/ar/fa from production YAML
- Variants: buyer/guest/org/admin; organizer/admin/cta/stripe/noEvidence

---

## Browser QA (Chromium)

**Result: 40/40 PASS** — `measurements.json`

Coverage includes:
- Desktop 800, tablet 768, mobile 414/375/320
- Ticket: en/fr/es/ar/fa + guest + long + blocked
- Dispute: en/fr/es/ar/fa + admin + payment CTA + stripe + noEvidence + long
- Marketing: en viewports + long + blocked
- Activation spot-check: en 800 + 375

Evidence: `screenshots/` and `figma/`.

---

## Differences requiring owner decisions

1. **Marketing chrome language** — production footer/preferences English; author body freeform. Confirm EN-only chrome frames are correct (recommended: yes).
2. **Spanish logo optical density** — still uniform 160 (Activation decision). Revisit only if owner wants optical parity adjustment.
3. **Ticket Sale Figma locales** — editable EN desktop updated; FR/ES/AR/FA parity currently strong in **preview**; additional Figma locale frames can follow after approval.
4. **Dispute Figma** — EN + AR desktop delivered; FR/ES/FA Figma frames can follow after approval (preview already has YAML copy).
5. **Catalog page label still says “48”** — should become **47** when Phase F opens.
6. Confirm **`organizer_announcement` stays excluded** (authoritative scope).

---

## Unresolved / NOT VERIFIED

| Item | Status |
|---|---|
| Figma image byte verify for Ticket/Dispute/Marketing (new uploads) | Marketing uses placeholder rectangles — no new Eveenty PNG hashes |
| Eveenty logo Figma hashes (Activation) | Unchanged from Task 02 BYTE-VERIFIED |
| Real email-client rendering | **NOT EXECUTED** |
| Phase F remaining 43 templates | **HOLD** |

---

## Source files modified (local preview only)

| Path | Change |
|---|---|
| `shared/email-kit.js` | Shared helpers + mobile shell hardening |
| `shared/render-emails.js` | Ticket standards; new dispute + marketing renderers |
| `shared/sample-data.js` | YAML-backed copy; EMAIL_IDS |
| `preview.js` | Annotations for new refs |
| `generate-standalone.mjs` | Include new emails |
| `emails/festival_ticket_sale.html` | Regenerated |
| `emails/dispute_notification.html` | **New** |
| `emails/festival_marketing_email_target.html` | **New** |
| `emails/{activate,donation,reg_approval,support}.html` | Regenerated via shared kit (Activation preserved; others logo default 200) |
| `assets/fixtures/festival-*-sample.svg` | Marketing SAMPLE fixtures |
| `qa-output/task-03-references/**` | Inventory, impact, QA, screenshots |

**Unchanged (verified):**
- Backend Go / templates / YAML — no git changes under `email/templates`, `pkg/locales`
- Owner PNGs under `D:\emails\` — preview logos **BYTE-IDENTICAL** (SHA256)
- Original Design System Figma `DeMR3FHvQbVJYmwStKivVg` — not mutated
- No git commit / push

---

## Phase F — remaining catalog plan (AFTER approval only)

See `PHASE_F_EXECUTION_PLAN.md`.

**Do not begin Phase F without explicit owner approval of all four references.**
