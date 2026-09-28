# MIGRATION APPROACH — Phase 0 (final owner decisions)

**Date:** 2026-09-27  
**Status:** Owner decisions recorded as **FINAL**. Do not re-open alternatives in later phases without new explicit owner authorization.

---

## 1. Six owner decisions (final)

1. **Side-by-side migration, then archive.** Kit templates are added alongside legacy templates. Legacy files are **not** edited in place. After successful production verification, legacy is archived under separate criteria (below).
2. **New approved Eveenty kit logos** for all kit outputs that use branded header logos (manifest `logo_*`). Do not reuse obsolete production `logo_transparent_*` / `eveenty-logo-1280.png` content for kit templates.
3. **New approved Support design** (kit branded header) in production kit `support` — closes the prior “support header delta” question.
4. **Separate Production and Staging CDN URLs.** One asset base URL per environment. Never cross-wire Staging→Production or Production→Staging.
5. **Google Wallet Condensed badges only** (Apple as in manifest; `fa` Apple → `en`).
6. **All 48 templates activate together.** Implementation may land in batches while dormant; production activation is a single all-or-nothing switch.

### Legacy archival criteria (final)

Archive legacy only when **all** of the following are true:

1. Successful production verification after activation.
2. Rollback capability is still retained.
3. Separate explicit owner approval to archive.

**There is no fixed waiting period.**

---

## 2. Side-by-side layout (proposed)

| Area | Proposed location | Notes |
|---|---|---|
| Kit templates | `email/templates/kit/<template_id>.template` | One file per IN_SCOPE id; mirror legacy filename stem |
| Kit partials | `email/templates/kit/partials/*.template` | Isolated from legacy partials; kit chrome (branded header/footer, Wallet badges, etc.) |
| Legacy templates | `email/templates/<template_id>.template` | Unchanged until archive |
| Legacy partials | `email/templates/partials/` | Unchanged until archive |
| Parse registration | Separate kit initiator / parse set | Must **not** inject kit partials into legacy `ParseFiles` sets or vice versa |
| SMTP client fields | Backend team to define (e.g. parallel `*KitTemplate` fields or selector) | Dormant until activation |

Exact Go types, field names, and wiring are **Backend team to define**. Paths above are the Phase 0 proposed contract for docs/matrix column `kit_production_file`.

### Dormant-until-activation rule

Ported kit templates may merge to the codebase in batches but must not be selected for live `Send*` traffic until the single all-48 activation switch. Until then, legacy templates remain the only live render path.

### Single activation

When release gates pass and the owner authorizes activation, all 48 in-scope kit templates switch on together. No partial production cutover of a subset of the 48.

---

## 3. Port batch order (implementation, dormant)

| Batch | Name | Templates (count) |
|---|---|---|
| 1 | Transactional | `activate_email`, `password_reset` (2) |
| 2 | Localized notifications | dispute/update/festival status, marketing email target, organizer campaign receipts, etc. (11) — see matrix |
| 3 | Installments / refunds | installment + refund receipt templates (9) |
| 4 | Donation / vendor | `festival_donation`, `festival_vendor_sale` (2) |
| 5 | EN-only internal | `support`, `contact_submission` (2) |
| 6 | Registration multipart | five registration templates + `registration_approval_status_changed` (6) |
| 7 | `.ics` sales | add-on, activity, sponsor, sales (4) |
| 8 | `festival_ticket_sale` | (1) — pkpass + ics + Wallet |
| 9 | Security-handoff templates | 11 ids under the four Backend/Security handoffs |

Exact per-id assignment: `MIGRATION_MATRIX.csv` column `port_batch`.

---

## 4. Backend team to define (delegated — non-blocking for Phase 0)

These items are explicitly **not** owner decisions and do **not** block P0 completion or P1 planning start:

1. **Activation control** — how the all-48 switch is implemented (config flag, build tag, dual client fields, etc.).
2. **Rollback mechanism** — how to revert to legacy render paths quickly while retaining capability through archive approval.
3. **Deploy sequencing** — staging vs production deploy order, binary/template packaging.
4. **Archive mechanics** — move/rename/delete legacy templates and partials after owner archive approval.

Phase 0 records them as open Backend work. Do not invent mechanisms in Email Kit docs.

---

## 5. Security handoffs (release gate)

Four Backend/Security work items covering **11** template IDs remain unresolved. Disposition is a **release gate** before activation. Remediation is **not** assigned to the owner. See `OWNERSHIP.md` and `HANDOFF.md` workstream C.

---

## 6. Supersedes

This approach **supersedes** `catalog/SAFE_TEMPLATE_REPLACEMENT_PLAN.md` in-place replacement preference for the production migration. SAFE plan remains historical contract text; side-by-side is authoritative.
