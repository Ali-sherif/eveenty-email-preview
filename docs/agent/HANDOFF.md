# HANDOFF — Eveenty Email Design Kit

## Current task

**Phase 4 — Activation PREPARATION COMPLETE — LIVE CUTOVER BLOCKED ON CDN URLS + EXTERNAL GATES.**

Owner authorized all-48 activation mechanism + P4 prep (no Staging required for current workflow; CDN URLs forthcoming).  
Reports: `P1_FOUNDATION_REPORT.md`, `P2_PORT_REPORT.md`, `P3_VERIFICATION_REPORT.md`, **`P4_ACTIVATION_PREP_REPORT.md`**, **`P4_CDN_CONFIGURATION_CHECKLIST.md`**, `LEVEL_B_CHECKLIST.md`.

**Switch default OFF. No kit mail is live. Insert real CDN bases per checklist when Infra supplies them — do not edit templates.**  
Security handoffs unresolved (Backend/Security). Level B NOT RUN. No real emails sent.

Phase 1 HTML Preview design remains complete: **48/48 owner visually approved**.  
Owner FINAL Wallet decision stands: Google **Condensed ONLY** on `festival_ticket_sale`; CDN inventory **14** unique files; **0 uploads**.

## Phase status

| Phase | Status |
|---|---|
| Phase 0 — Production migration prep (docs) | COMPLETE |
| Phase 1 — Backend foundation | **IMPLEMENTED — AWAITING BACKEND REVIEW** |
| Phase 2 — Port templates (dormant) | **PORTED — DORMANT UNTIL LIVE CUTOVER** |
| Phase 3 — Verification | **LOCAL DONE — Staging optional / blocked on CDN if used** |
| Phase 4 — Activation prep | **IMPLEMENTATION COMPLETE — NOT LIVE** |
| CDN upload / deploy / enable switch | **Blocked on Infra URLs + external gates** |

## Deliverable paths

### Phase 0 (unchanged)
- `docs/agent/production-migration/PRODUCTION_MIGRATION_READINESS.md`
- `docs/agent/production-migration/MIGRATION_MATRIX.csv`
- `docs/agent/production-migration/VARIABLE_CONTRACTS/` (48)
- `docs/agent/production-migration/MIGRATION_APPROACH.md`
- `docs/agent/production-migration/CDN_INTEGRATION_PLAN.md`
- `docs/agent/production-migration/TEST_AND_RELEASE_PLAN.md`
- `docs/agent/production-migration/OWNERSHIP.md`

### Phase 1–3 (unchanged intent)
- `P1_FOUNDATION_REPORT.md`, `P2_PORT_REPORT.md`, `P3_VERIFICATION_REPORT.md`, `LEVEL_B_CHECKLIST.md`
- Backend (uncommitted): seam + 48 kit templates + activation guard + snapshots/parity/P3 audits

### Phase 4 (new)
- `docs/agent/production-migration/P4_ACTIVATION_PREP_REPORT.md`
- `docs/agent/production-migration/P4_CDN_CONFIGURATION_CHECKLIST.md` — **exact places to paste CDN URLs**
- Backend (uncommitted additive): reject test-only CDN for live activation; `.env.example` kit keys; eligibility tests

## Remaining open items

1. **Infra** — supply Production (and Staging if/when it exists) kit CDN bases; upload 14 manifest assets; verify HTTPS/png/SHA-256.
2. **Owner/operator** — paste bases into env only (`EMAIL_KIT_CDN_BASE_URL`); leave `EMAIL_KIT_ENABLED=false` until gates allow.
3. **Backend** — review P1–P4; formal rollback confirmation; deploy when authorized; do not enable switch early.
4. **QA** — Level B when an environment + CDN exist (`LEVEL_B_CHECKLIST.md`); agent must not mark rows passed.
5. **Backend/Security** — dispositions for four handoffs (11 ids); release gate 4.
6. Matrix backfill: `locales_supported` still UNKNOWN in CSV (runtime locales exercised in P3 tests).

## Next authorized action

**Infra supplies real kit CDN base(s) → upload/verify 14 assets → set `EMAIL_KIT_CDN_BASE_URL` (switch still OFF) → external gates 2–5 → then `EMAIL_KIT_ENABLED=true` for all-48 cutover.**

Until then: no enabling `EMAIL_KIT_ENABLED` in real envs, no CDN upload by agent, no commit/push/deploy without explicit authorization, no customer sends.

## Current inventory and approval state

- Verified inventory: **59 physical / 11 excluded / 48 in scope**.
- Designed HTML Preview: **48**.
- Owner visually approved (design kit): **48**.
- Kit templates ported: **48/48**.
- Activation mechanism: **complete** (all-or-nothing; fail-closed; test placeholder rejected for live activation).
- Legacy snapshot goldens: **283**. Kit goldens / kit_preview: **273**.
- Real Gmail / Outlook / Apple Mail testing: **NOT RUN** (Level B).
- Active CDN upload inventory: **14 unique files**. **0 uploads**; CDN URLs pending.
- Live kit: **OFF**.

## Workstream separation

| ID | Category | Email Kit owns? | Status |
|---|---|---|---|
| **A** | Completed Email Kit design deliverables | Yes | **DONE** — 48 HTML Preview designs, all owner visually approved |
| **B** | Email rendering and integration requirements | No (needs auth) | **OPEN** — Level B NOT RUN; CDN hosting (14-file manifest; upload not authorized) |
| **C** | Pre-existing Backend/Security observations | Document/hand off only | **OPEN** — unresolved; outside design scope; release gate for activation |
| **D** | Production release / migration | P0–P4 prep done; live cutover pending | **P4 PREP DONE — CUTOVER BLOCKED ON CDN + GATES** |

## Workstream C — four handoffs (unchanged; unresolved)

1. `organizer_announcement` — subject/header and caller-supplied HTML trust boundaries.
2. Marketing Approval — `festival_marketing_approval`, `festival_marketing_approval_sms` (GET approval-link observation).
3. `festival_rescounts_marketing_email_target` — marketing-campaign content trust boundary.
4. Final Seven — Backend/Security Review — seven IDs (`text/template` HTML, dynamic MIME headers, submitted demo URLs).

Do not call these confirmed, fixed, harmless, or cleared.

## Resume prompt

"Continue Eveenty Email Kit from `docs/agent/HANDOFF.md`. P4 activation prep DONE (`P4_ACTIVATION_PREP_REPORT.md`, `P4_CDN_CONFIGURATION_CHECKLIST.md`). Next: Infra CDN URLs + upload/verify 14 assets → set EMAIL_KIT_CDN_BASE_URL (switch OFF) → Backend/QA/Security gates → then EMAIL_KIT_ENABLED=true. Do not enable switch early, upload CDN, mark Level B passed, send customer mail, or commit/push without explicit authorization."
