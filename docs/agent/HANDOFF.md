# HANDOFF — Eveenty Email Design Kit

## Current task

The exact owner-authorized 20-template HTML Preview batch is implemented and fresh Level A QA is **PASS**. **STOPPED for owner visual review.** Do not implement the final 15 without new explicit owner authorization.

## Current inventory and approval state

- Verified inventory: **59 physical / 11 excluded / 48 in scope**.
- Protected owner-approved HTML Preview baseline: **13** (seven original references + six approved pilot designs).
- New batch awaiting owner approval: **20**.
- Total cataloged `DESIGNED` and previewable: **33**.
- Remaining `IN_SCOPE · UNDESIGNED`: **15**.
- Real Gmail / Outlook / Apple Mail testing: **NOT RUN**.

## Implemented batch

Selection and production evidence: `docs/agent/NEXT_20_BATCH_SELECTION.md`.

- B3 Refund personas: `refund_receipt_organizer`, `refund_receipt_admin`
- B5 Registration lifecycle: `festival_ticket_registration`, `festival_ticket_registration_deadline_exceeded`, `festival_ticket_registration_payment_deadline_exceeded`, `registration_approval_status_changed`
- B7 Workflow/status: `festival_update_request_approved`, `festival_update_request_rejected`, `festival_vendor_sale_rejection`, `needs_response_dispute_reminder`, `festival_update_request_issued`, `festival_created`, `festival_marketing_approval`, `festival_marketing_approval_sms`
- B2 Installments: `festival_sale_installment_paid`, `second_payment_reminder`, `first_payment_refund`, `sponsor_installment_paid`, `sponsor_installment_second_payment_reminder`, `sponsor_first_payment_refund`

The implementation uses targeted production locale snapshots, exact per-variant locale routing, existing approved email-kit components, synthetic fixtures, escaped dynamic values, and inert `example.com` preview URLs. No Figma work was performed.

## Fresh QA

Command: `node qa-output/batch-20/capture-batch20-qa.mjs`

| Check | Result |
|---|---|
| Catalog + exact 20 mappings | **PASS** · 59 / 11 / 48 / 33 / 15 |
| Structural renders | **PASS** · 325 · 0 failures |
| Responsive | **PASS** · 175 checks at 800/768/414/375/320 · 0 overflow |
| Long-content stress | **PASS** · 20 · 0 failures |
| Blocked images | **PASS** · 20 · 0 failures |
| RTL visual/layout | **PASS** · 24 AR/FA desktop/mobile checks |
| Traceability | **PASS** · 20 production mappings |
| Financial fixtures | **PASS** · 8 reconciliations |
| Contrast | **PASS** · all tested pairs ≥4.5:1 |
| Default captures | **PASS** · 40 visually reviewed |
| Gmail / Outlook / Apple Mail | **NOT RUN** |
| Figma | **NOT RUN / out of scope** |

Reports:

- `qa-output/batch-20/BATCH_20_IMPLEMENTATION_REPORT.md`
- `qa-output/batch-20/BATCH_20_QA_REPORT.md`
- `qa-output/batch-20/BATCH_20_VISUAL_REVIEW.md`
- `qa-output/batch-20/batch20-qa-results.json`

## Reviewer findings resolved

- Reconciled refund and vendor totals and added deterministic arithmetic checks.
- Added all approved-with-note registration persona variants.
- Decoupled dispute audience, Stripe Connect, last-reminder, payment-link, and tracking-pixel branches.
- Corrected RTL/LTR isolation for localized visible copy and sponsor technical values.
- Replaced the dense vendor six-column mobile table with readable item cards.
- Replaced new SVG-only image references with deterministic PNG fixtures.
- Tightened unknown-variant rejection and admin English-only metadata.
- Verified all 13 protected standalone HTML files remained byte-identical after regeneration.

## Production/security boundaries

- `organizer_announcement`: owner-approved for HTML Preview only; production migration remains **BLOCKED** because the read-only review found unclosed subject/header and caller-supplied HTML trust boundaries.
- `festival_marketing_approval` / `_sms`: HTML Preview QA **PASS** with escaped author content and inert links; production state-changing unauthenticated GET approval links remain **BLOCKED** because of link-scanner/prefetch risk.
- No backend, production template, Figma, official Wallet artwork, owner logo, CDN, staging, commit, push, or deployment change was made.
- All repository changes remain unstaged.

## Tooling status

`.agents/scripts/email-cli.mjs` validates the exact named 33-design baseline. `validate-catalog`, all 20 batch `validate-template` checks, status/handoff, generation, the fresh batch harness, and `git diff --check` should be rerun before any later handoff if files change.

## Next authorized action

Owner review only: inspect `qa-output/batch-20/BATCH_20_VISUAL_REVIEW.md` and the linked implementation/QA reports. Do not mark these 20 owner-approved automatically, modify the protected 13, or start the final 15 without explicit owner direction.

## Resume prompt

"Continue Eveenty Email Kit from `docs/agent/HANDOFF.md` and follow `AGENTS.md`. The exact 20-template batch has fresh Level A QA PASS and is stopped for owner visual review. Inspect `qa-output/batch-20/BATCH_20_VISUAL_REVIEW.md`; do not implement the final 15 or change production/Figma without new explicit authorization."
