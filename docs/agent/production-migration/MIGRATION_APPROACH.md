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
6. **All 48 templates activate together.** Implementation may land in batches; production cutover is all-or-nothing via release deploy (no runtime Kit on/off flag — see §4).

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

### Selection rule (post owner architecture change 2026-09-28)

Kit templates are selected for live `Send*` traffic on IN_SCOPE ids when **both** hold: (1) all 48 kit templates parse, and (2) `EMAIL_KIT_CDN_BASE_URL` is production-eligible (https, 14 assets, not test-only). Empty/invalid CDN fail-closes to legacy. The 11 EXCLUDED templates always use Legacy. There is **no** `EMAIL_KIT_ENABLED` runtime toggle.

### Single cutover

When release gates pass, cutover is **DEV → verify → merge/deploy to Production**. All 48 in-scope kit templates go live together with that deploy. No partial production cutover of a subset of the 48. Rollback is redeploy of the previous known-good production release.

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

## 4. Release / rollback / archive (owner + Backend)

**Owner architecture decision (2026-09-28 — FINAL):**

1. **Activation / release control** — `DEV → verify → merge/deploy to Production`. No runtime `EMAIL_KIT_ENABLED` flag. Kit readiness guard remains: 48 parse + eligible `EMAIL_KIT_CDN_BASE_URL`.
2. **Rollback** — deploy the previous known-good production release (not a config toggle).
3. **Deploy sequencing** — Backend owns staging vs production order and packaging where Staging exists.
4. **Archive mechanics** — Backend-defined; execute only after P5 production verification + separate owner archive approval. Legacy templates stay in repo until then.

Earlier Phase 0 text that delegated “activation control” as an open Backend proposal is **superseded** by this owner decision.

---

## 5. Security handoffs (release gate)

Four Backend/Security work items covering **11** template IDs remain unresolved. Disposition is a **release gate** before activation. Remediation is **not** assigned to the owner. See `OWNERSHIP.md` and `HANDOFF.md` workstream C.

---

## 6. Supersedes

This approach **supersedes** `catalog/SAFE_TEMPLATE_REPLACEMENT_PLAN.md` in-place replacement preference for the production migration. SAFE plan remains historical contract text; side-by-side is authoritative.
