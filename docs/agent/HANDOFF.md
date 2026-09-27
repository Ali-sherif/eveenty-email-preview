# HANDOFF — Eveenty Email Design Kit

## Current task

Phase 1 HTML Preview design is complete.
All 48 in-scope templates have explicit
owner visual approval.

No further design implementation is authorized.

Documentation update (2026-09-27): clarified
ownership of the consolidated Marketing Approval
security observation (`festival_marketing_approval`
+ `festival_marketing_approval_sms`) — Backend/Security,
outside Email Kit design scope; unresolved;
documented and handed off only. Both HTML Previews
remain owner visually approved.

Prior documentation update (same day): clarified
`organizer_announcement` trust-boundary ownership
the same way.

Production security review, actual email-client
testing, CDN hosting and production migration
remain separate future work requiring
explicit owner authorization.

## Current inventory and approval state

- Verified inventory: **59 physical / 11 excluded / 48 in scope**.
- Designed HTML Preview: **48**.
- Owner visually approved: **48**.
- Remaining `IN_SCOPE · UNDESIGNED`: **0**.
- Real Gmail / Outlook / Apple Mail testing: **NOT RUN**.

## Workstream separation

| ID | Category | Email Kit owns? | Status |
|---|---|---|---|
| **A** | Completed Email Kit design deliverables | Yes | **DONE** — 48 HTML Preview designs, all owner visually approved |
| **B** | Email rendering and integration requirements | No (needs auth) | **OPEN** — Level B client testing; CDN hosting |
| **C** | Pre-existing Backend/Security observations | Document/hand off only | **OPEN** — unresolved; outside design scope |
| **D** | Separately authorized production release work | No | **NOT AUTHORIZED** |

Do not classify all production tasks as the Email Kit designer's responsibility.

## Final seven — owner visually approved (2026-09-27)

After verified Level A QA and focused footer correction, the owner approved:

- Financial: `marketing_package_sale`, `festival_payout`
- Partner coupons: `partner_coupons`, `partner_coupons_partner`
- Internal operations: `bad_content_alert`, `book_demo_admin`, `extra_service_request`

Evidence:

- `qa-output/final-7/FINAL_7_IMPLEMENTATION_REPORT.md`
- `qa-output/final-7/FINAL_7_QA_REPORT.md`
- `qa-output/final-7/FINAL_7_VISUAL_REVIEW.md`
- `qa-output/final-7/FINAL_7_FOOTER_VERIFICATION.md`
- `qa-output/final-7/final7-qa-results.json`

Approval is for **HTML Preview designs only**.

## Open items by workstream

### C — Pre-existing Backend/Security (document only; unresolved)

**`organizer_announcement` — subject/header and caller-supplied HTML trust boundaries**

| Field | Value |
|---|---|
| Origin | Pre-existing production backend behavior, identified during Email Kit review |
| Ownership | **Backend / Security** |
| Email Kit responsibility | Document and hand off only |
| Design impact | None currently identified |
| HTML Preview | Completed and owner visually approved |
| Production security status | **Unresolved** — separately authorized Backend/Security investigation required |
| Production migration | Not security-cleared until Backend/Security resolves or formally accepts |
| Evidence strength | Potential trust-boundary issue — **not** a confirmed exploitable vulnerability; not fixed; not dismissed as harmless |
| Evidence | `qa-output/pilot-batch/PILOT_SECURITY_REVIEW.md` |

**Marketing Approval — consolidated approval-link observation**

One Backend/Security work item covering both Email and SMS marketing approval workflows. Preserve both template IDs for individual traceability.

| Field | Value |
|---|---|
| Affected IDs | `festival_marketing_approval`, `festival_marketing_approval_sms` |
| Category | Pre-existing Backend / Security observations |
| Observation | Production approve/reject links may trigger state-changing operations via unauthenticated GET; scanners/prefetch may change approval status without intentional admin action |
| Origin | Pre-existing production backend — **not** introduced by HTML Preview designs |
| Ownership | **Backend / Security** |
| Email Kit responsibility | Document and hand off only — **not** an Email Kit design task |
| Design impact | None — do not reopen visual approval |
| HTML Preview | Both **COMPLETE** and owner visually approved; inert `example.com` links |
| Production security status | **Unresolved** — pending separately authorized Backend/Security investigation |
| Production migration | Security clearance by Backend/Security required before enabling production approval workflows; integration needs separate owner auth |
| Evidence strength | Documented concern — **not** confirmed exploitation |
| Evidence | `qa-output/batch-20/BATCH_20_QA_REPORT.md`, `BATCH_20_IMPLEMENTATION_REPORT.md`, `BATCH_20_VISUAL_REVIEW.md` |
| Possible remediation | Confirmation page + auth + protected POST (CSRF/token/expiry/one-time-use as appropriate); test prefetch/scanners — Backend/Security selects; **not** an approved implementation task |

Other Backend/Security observations (keep separate; statuses unchanged):

- `festival_rescounts_marketing_email_target` — caller-derived HTML/body/media boundaries.
- Final-seven batch — `text/template` HTML insertion, dynamic MIME headers, submitted demo URL observations (see `FINAL_7_IMPLEMENTATION_REPORT.md`).

### B — Rendering / integration

- Actual Gmail, Outlook and Apple Mail testing — **NOT RUN**.
- CDN hosting of Wallet/official assets — **not authorized**.

### D — Production release

CDN upload and production integration remain separately unauthorized. No backend, production template/YAML, Figma, official Wallet artwork, owner logo, staging, commit, push or deployment change is authorized by HTML Preview approval.

## Tooling status

`.agents/scripts/email-cli.mjs validate-catalog` enforces the exact named 48-design / 0-undesigned set. Catalog has no separate owner-approval field; approval lives in `PROJECT_STATE.md` / `DECISION_LOG.md` / this handoff.

## Next authorized action

None for design implementation. Wait for explicit owner authorization before any Backend/Security investigation, Level B client testing, CDN hosting, Figma work, backend change, commit, push or deployment.

## Resume prompt

"Continue Eveenty Email Kit from `docs/agent/HANDOFF.md` and follow `AGENTS.md`. Phase 1 HTML Preview design is complete: 59/11/48/48 designed/48 owner visually approved/0 undesigned. Do not implement further designs. Workstream C Backend/Security handoffs (unresolved, outside design scope): (1) `organizer_announcement` trust boundaries; (2) consolidated Marketing Approval GET approval-link observation covering `festival_marketing_approval` and `festival_marketing_approval_sms`. Level B client testing, CDN hosting and production migration (workstreams B/D) require new explicit owner authorization."
