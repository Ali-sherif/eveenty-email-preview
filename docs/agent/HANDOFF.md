# HANDOFF — Eveenty Email Design Kit

## Latest session — five registration approved visual fixes (2026-09-29)

**VISUAL PORT FIXES APPLIED (5 registration IDs) in `rescounts-backend`.** See `production-migration/VISUAL_FIX_FIVE_REGISTRATION.md`.

- Compared Kit vs approved Preview for: `festival_ticket_registration`, `festival_ticket_registration_approval`, `festival_ticket_registration_reject`, `festival_ticket_registration_deadline_exceeded`, `festival_ticket_registration_payment_deadline_exceeded`.
- Removed festival-logo slot + legacy Make-your-event/live social chrome; matched per-template footers, Ticket N of N / approval cards / reject Event Details (no map), and deadline alert titles.
- Re-rendered and re-compared all five — **PASS** for requested sections (fixture copy differences ignored).
- Preview-repo docs updated this session. Approved `emails/*.html` **not** edited.
- Follow-up (not done): refresh kit snapshot goldens for these five IDs (and the prior four) under `docs/backend-email-migration-evidence/goldens/` if the preserved suite is re-run.

## Prior session — four-template approved visual fixes (2026-09-29)

**VISUAL PORT FIXES APPLIED (4 IDs) in `rescounts-backend`.** See `production-migration/VISUAL_FIX_FOUR_TEMPLATES.md`.

- Compared Kit vs approved Preview for: `registration_approval_status_changed`, `festival_approval_status_changed`, `organizer_festival_marketing_email_receipt`, `organizer_festival_marketing_sms_receipt`.
- Implemented approved status-alert / footer / campaign-receipt heading / neutral TOTAL / no-Twitter social row. Subjects, recipients, links, attachments, review-note data gating unchanged.
- Re-rendered and re-compared all four — **structure/styling match** approved designs for the requested sections (fixture copy differences ignored).
- Preview-repo docs updated this session (HANDOFF, DECISION_LOG, FINAL_PRE_MERGE_REVIEW §8 notes, this report). Approved `emails/*.html` **not** edited.
- Follow-up (not done): refresh kit snapshot goldens for these four IDs under `docs/backend-email-migration-evidence/goldens/` if the preserved suite is re-run against the new Kit bodies.

## Prior session — preserved suite reconciliation (2026-09-29)

**PRESERVED MIGRATION SUITE — PASS.** See `production-migration/PRESERVED_SUITE_RECONCILIATION_REPORT.md`.

- Initial preserved failures: 167 leaf (130 historical + day-drift reminders + ICS UID). After justified normalize/ICS expectation fixes and selective golden refresh against current HEAD: **0 leaf failures**.
- Organizer ticket sale: HEAD has no `FestivalICSData` — stale ICS expectations removed from goldens/parity only. ICS UID expectation updated to `@eveenty.com` to match `model/festival.go`. No production behavior changes for tests.
- Final pre-merge visual/CDN/security items from `FINAL_PRE_MERGE_REVIEW.md` remain partially open for final-seven; status/receipt + registration chrome visual omissions are now **closed in Kit source**.

## Prior session — final pre-merge review (2026-09-28)

**NOT READY — MIGRATION DEFECTS FOUND** (visual/CDN/security/port-omission gates). Functional fresh HEAD comparisons had already PASS; preserved suite was later reconciled. Remaining visual NEEDS REVIEW items are final-seven (registration chrome fixed 2026-09-29). Details: `production-migration/FINAL_PRE_MERGE_REVIEW.md`.

## Current task

**Post-P4 local work COMPLETE in `rescounts-backend`. Four status/receipt + five registration approved visual port omissions fixed. Next environment: DEV deploy (not Production).**

Owner architecture stands: no `EMAIL_KIT_ENABLED`; release control is deploy. Kit assets use **`config.CdnURL`**. Kit is selected for IN_SCOPE when kit templates parse; EXCLUDED stay Legacy.

Backend verification report: `D:\last\rescounts-backend\email\POST_P4_LOCAL_VERIFICATION.md`  
Legacy archive: `email/templates/archive/` (moved, not deleted).

Phase 1 HTML Preview design remains complete: **48/48 owner visually approved**.  
Google **Condensed ONLY** on `festival_ticket_sale`; CDN inventory **14** unique files. DEV CDN verified HTTP 200; Production CDN currently **403** (Infra).

## Phase status

| Phase | Status |
|---|---|
| Phase 0 — Production migration prep (docs) | COMPLETE |
| Phase 1 — Backend foundation | COMPLETE (toggle removed; `CdnURL` asset resolver) |
| Phase 2 — Port templates | COMPLETE — 48 kit templates |
| Phase 3 — Verification | LOCAL PASS |
| Phase 4 — Activation prep | LOCAL IMPLEMENTATION COMPLETE |
| Post-P4 local (archive + re-verify) | **COMPLETE — DEV READY** |
| Four-template visual port omissions | **FIXED (2026-09-29)** |
| Five-registration visual port omissions | **FIXED (2026-09-29)** |
| DEV deployment | **NEXT** (operator) |
| Production deploy / verification | **OUT OF SCOPE for current task** — deferred |

## Remaining open items

1. **Operator** — review backend diff (incl. four + five registration visual fixes); deploy to DEV; smoke-check Kit ACTIVE + sample sends.
2. **Infra** — Production `cdn.eveenty.com` currently 403 for kit object keys; upload/verify before Production.
3. **QA** — Level B when authorized (`LEVEL_B_CHECKLIST.md`); agent must not mark rows passed.
4. **Backend/Security** — dispositions for four handoffs (11 ids); still required before Production release gate.
5. **User** — approve or reject `DELETE_CANDIDATES.md` entry for `welcome_email_ad.png` before any deletion/push.
6. **Optional evidence** — refresh kit goldens for the nine fixed IDs if re-running preserved snapshot suite against new Kit HTML.

## Next authorized action

**Review backend post-P4 + visual-fix changes → DEV deploy → DEV smoke verification.**  
Do not push/merge/deploy Production without explicit authorization.  
Do not delete archive candidates without user approval.

**Rollback:** redeploy previous known-good release — not a runtime flag.

## Current inventory

- Verified inventory: **59 physical / 11 excluded / 48 in scope**.
- Kit templates: **48/48** under `email/templates/kit/`.
- Legacy bodies: archived under `email/templates/archive/legacy/` (59 + 12 partials).
- Local email package tests: **PASS** (2026-09-28); visual four-ID re-compare **PASS** (2026-09-29).
- Level B: **NOT RUN**.
- Production CDN kit assets: **403 / DEFERRED**.
- Live Production kit traffic: **NOT CLAIMED**.

## Workstream C — four handoffs (unresolved disposition)

1. `organizer_announcement`
2. Marketing Approval — `festival_marketing_approval`, `festival_marketing_approval_sms`
3. `festival_rescounts_marketing_email_target`
4. Final Seven — seven IDs

Classification after post-P4 review: **IMPLEMENTATION COMPLETE — SECURITY DISPOSITION STILL REQUIRED** for all four. Do not call these confirmed, fixed, harmless, or cleared.
