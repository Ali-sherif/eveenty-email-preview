# Pilot review findings resolution

**Date:** 2026-09-26  
**Scope:** focused corrections for the six-template pilot only.

## Festival approval sample data

**Finding:** the approved-with-note state is supported, but the original fixture wording was misleading.

- The read-only sender passes `festival.ReviewNote` into the email params before branching on `festival.ApprovalStatus`; the branch changes only subject/body copy: [`smtp_organizer_emails.go`](../../../rescounts-backend/email/smtp_organizer_emails.go).
- The production template renders every non-empty `ReviewNote` independently of status: [`festival_approval_status_changed.template`](../../../rescounts-backend/email/templates/festival_approval_status_changed.template).
- Therefore an approved state with an optional informational note is legitimate. The local fixture was changed from a request for accessibility/permit changes to confirmation that those items were received and included in the completed review: [`pilot-data.js`](../../shared/pilot-data.js).
- RTL inspection also found that the preview had not preserved the production note's `dir="auto"`/plaintext bidi behavior. That focused parity fix was added in [`pilot-renderers.js`](../../shared/pilot-renderers.js). No status, translation, backend condition, or production file changed.

## Catalog validator

The existing validator now derives designed/undesigned counts from the named seven-reference plus six-pilot baseline, expects `organizer_announcement` to be `IN_SCOPE · DESIGNED · MARKETING`, and still rejects arbitrary changes. It checks exact designed IDs, duplicate/missing IDs, inventory/family counts, required metadata, legal scope/status combinations, catalog/traceability parity, preview mappings/files, and all 59 read-only production template paths.

## Fresh verification

| Command | Result |
|---|---|
| `node .agents/scripts/email-cli.mjs validate-catalog` | **PASS** · 59 / 11 / 48 / 13 / 35 |
| `node .agents/scripts/email-cli.mjs validate-template <pilot-id>` (all six) | **PASS** |
| `npm run generate` | **PASS** |
| `node qa-output/pilot-batch/capture-pilot-qa.mjs` | **PASS** · 57 structural, 46 responsive, 16 focused AR/FA visual checks, 0 failures |
| Contrast pairs | **PASS** · all ≥ 4.5:1 |
| CLI help/status/handoff and skill discovery | **PASS** |

Raw evidence: [`pilot-qa-results.json`](pilot-qa-results.json). RTL evidence: [`PILOT_RTL_VISUAL_REVIEW.md`](PILOT_RTL_VISUAL_REVIEW.md).

## Remaining findings

- `organizer_announcement` HTML Preview QA: **PASS**.
- `organizer_announcement` production security migration: **BLOCKED** pending separately authorized remediation of the caller-supplied subject/HTML boundaries. Exploitability was not tested or claimed. See [`PILOT_SECURITY_REVIEW.md`](PILOT_SECURITY_REVIEW.md).
- Gmail, Outlook, and Apple Mail: **NOT RUN**.
- No owner visual approval or next rollout batch is implied.

