# FAMILY_TAXONOMY_AUDIT.md

**Date:** 2026-09-24  
**Mode:** Audit only (no production changes)  
**Backend (read-only):** `D:\last\rescounts-backend`  
**Approved Phase 1:** `D:\emails\Eveenty-Email-Kit-Phase1`

---

## Verdict

**No material conflict** with the owner-approved Design Kit distribution **2 / 26 / 17 / 3**.

An earlier audit **did identify six email families**. Those six are a **backend semantic classification**. The Email Design Kit uses **four Master Layout families**. The two systems coexist by deliberate crosswalk — the four Design Kit families do **not** invalidate the six-category backend classification.

Proceeding to organization is allowed.

---

## Classification layers (do not conflate)

| Layer | Count / shape | Purpose | Authoritative source |
|---|---|---|---|
| **Backend semantic families** | **6** families across all **59** physical templates | Business/content taxonomy used by localization and inventory audits | `D:\emails\references\email-localization-coverage-audit.md` §B.1 |
| **Email Design Kit families (Master Layouts)** | **4** layouts for **48** in-scope designs | Figma/email design architecture | `email-kit-v1-spec.md` §2; `phase-1-email-scope.md` |
| **Master layouts** | Same as Design Kit families | Shared shell + layout-specific content zones | `email-kit-v1-spec.md` §2–3 |
| **Functional subfolders** | Proposed catalog folders under each Design Kit family | Browse/organize by production purpose | This organization task (`EMAIL_FOLDER_STRUCTURE.md`) |

---

## Six backend semantic families (source-backed)

From `email-localization-coverage-audit.md` (2026-09-23), reconciled against live `email/templates/*.template` inventory:

| Semantic family | Count (all 59) | Purpose |
|---|--:|---|
| Auth / Simple | 2 | Account activation, password reset |
| Financial / Receipt | 20 | Payments, sales, refunds, invoices, payouts |
| Ticket / Pass | 8 | Registration lifecycle + partner coupons |
| Workflow / Status | 15 | Approvals, disputes, admin campaign approvals |
| Internal / Operational | 7 | Support, moderation, contact, demo, service requests, org marketing receipts |
| Campaign / Announcement | 7 | Marketing shells + festival/organizer campaigns |
| **Total** | **59** | |

**Evidence quote (audit §A inventory reconciliation):**  
> Family counts from the audit brief (**Auth 2 / Financial 20 / Ticket 8 / Workflow 15 / Internal 7 / Campaign 7**) were used and reconciled against the live repo inventory.

**Evidence quote (`phase-1-email-scope.md`):**  
> Semantic family counts (all 59 templates, pre-exclusion) match `email-localization-coverage-audit.md`: Auth 2, Financial 20, Ticket 8, Workflow 15, Internal 7, Campaign 7.

---

## Four Design Kit families (approved Phase 1)

| Master layout | In-scope count | Notes |
|---|--:|---|
| TRANSACTIONAL | 2 | Auth / Simple only |
| COMMERCE | 26 | Financial/Receipt (18 after exclusions) + Ticket/Pass (8) |
| NOTIFICATION | 17 | Workflow/Status (10 after exclusions) + Internal/Operational (7) |
| MARKETING | 3 | Campaign/Announcement after exclusions (`organizer_announcement` IN SCOPE) |
| **Total** | **48** | 59 − 11 exclusions |

Source: `phase-1-email-scope.md` (updated 2026-09-24 owner restore).

---

## Crosswalk: six backend → four Design Kit

| Backend semantic family | Maps into Design Kit family | In-scope after exclusions | Excluded members |
|---|---|--:|---|
| Auth / Simple | TRANSACTIONAL | 2 | — |
| Financial / Receipt | COMMERCE | 18 | `receipt`, `invoice` (2) |
| Ticket / Pass | COMMERCE | 8 | — |
| Workflow / Status | NOTIFICATION | 10 | `restaurant_approval`, `restaurant_decline`, `marketing_approval_1`, `marketing_sms_approval`, `marketing_notification_approval` (5) |
| Internal / Operational | NOTIFICATION | 7 | — |
| Campaign / Announcement | MARKETING | 3 | `marketing`, `marketing2`, `marketing3`, `marketing4` (4) |
| | | **48** | **11** |

This matches `email-kit-v1-spec.md` §2:

> TRANSACTIONAL ← Auth/Simple  
> COMMERCE ← Financial/Receipt + Ticket/Pass  
> NOTIFICATION ← Workflow/Status + Internal/Operational  
> MARKETING ← Campaign/Announcement

---

## Arithmetic check vs approved baseline

| Check | Result |
|---|---|
| 2 + 26 + 17 + 3 | **48** |
| 59 − 11 | **48** |
| Financial 20 − 2 excluded = 18; Ticket 8; Commerce 18+8 | **26** |
| Workflow 15 − 5 excluded = 10; Internal 7; Notification 10+7 | **17** |
| Campaign 7 − 4 excluded = 3 | **3** |
| `organizer_announcement` | **IN SCOPE**, Marketing / Campaign-Announcement |

**No stop condition.** Approved 2 / 26 / 17 / 3 stands.

---

## Historical note (six vs four)

| Claim | Finding |
|---|---|
| “Earlier audit identified six families” | **Confirmed** — localization coverage audit + Task 01 scope register |
| “Four families invalidate six” | **False** — four are Master Layouts / Design Kit; six are semantic |
| Brief twelfth exclusion of `organizer_announcement` (59/12/47) | **Superseded** 2026-09-24 by owner Option B restore → **59/11/48** |

---

## Functional subfolders (proposed, production-purpose based)

See `EMAIL_FOLDER_STRUCTURE.md`. Subfolders are **catalog/navigation only**; they do not rename production files.

---

## Sources consulted

1. `D:\emails\references\email-localization-coverage-audit.md`
2. `D:\emails\Eveenty-Email-Kit-Phase1\phase-1-email-scope.md`
3. `D:\emails\Eveenty-Email-Kit-Phase1\email-kit-v1-spec.md`
4. Live filesystem: 59 top-level `email/templates/*.template` + 12 partials
5. `email/smtp_render_template.go` registration (L126–187)
