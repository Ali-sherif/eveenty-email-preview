# Batch 20 implementation report

**Completed:** 2026-09-27  
**Scope:** exactly 20 owner-authorized HTML Preview templates  
**Outcome:** **PASS — implemented and ready for owner visual review**  
**Approval status:** the 20 are `DESIGNED` preview references, but are **not owner-approved** and are not production-ready.

## Implemented scope

The selection in [`docs/agent/NEXT_20_BATCH_SELECTION.md`](../../docs/agent/NEXT_20_BATCH_SELECTION.md) was implemented without substitution or expansion:

- B3 Refund personas (2): `refund_receipt_organizer`, `refund_receipt_admin`
- B5 Registration lifecycle (4): `festival_ticket_registration`, `festival_ticket_registration_deadline_exceeded`, `festival_ticket_registration_payment_deadline_exceeded`, `registration_approval_status_changed`
- B7 Workflow/status (8): `festival_update_request_approved`, `festival_update_request_rejected`, `festival_vendor_sale_rejection`, `needs_response_dispute_reminder`, `festival_update_request_issued`, `festival_created`, `festival_marketing_approval`, `festival_marketing_approval_sms`
- B2 Installments (6): `festival_sale_installment_paid`, `second_payment_reminder`, `first_payment_refund`, `sponsor_installment_paid`, `sponsor_installment_second_payment_reminder`, `sponsor_first_payment_refund`

The catalog now verifies **59 physical / 11 excluded / 48 in scope / 33 designed / 15 undesigned**. The designed set is the protected 13-template owner-approved baseline plus these 20 owner-review-pending previews.

## Implementation structure

- `shared/batch20-refund-registration-renderers.js` — refund, registration, and approval-status families.
- `shared/batch20-workflow-renderers.js` — update, vendor rejection, dispute, admin operational, and marketing approval families.
- `shared/batch20-installment-renderers.js` — booth and sponsor installment/reminder/refund families.
- `shared/batch20-definitions.js` — exact preview metadata, locale matrices, and variants.
- `shared/batch20-locales.generated.js` — deterministic snapshot of only the production locale records required by this batch.
- `build-batch20-locales.mjs` and `sync-batch20-metadata.mjs` — deterministic batch support tooling.
- `build-batch20-fixtures.mjs` — deterministic rasterization of synthetic, non-production SVG fixtures for new Outlook-safe PNG references.

All previews reuse the existing approved tokens and email components. No Figma work or production-template change was made.

## Production-fidelity coverage

- Locale routing matches each production path: five-locale user/organizer/payer branches where supported; admin-only branches force English/LTR.
- Refund previews cover refund-only, canceled-only, combined, external payment, processing-fee omission, bank-fee deduction/refund, adjustments, and optional proof image.
- Registration previews cover user/organizer/admin recipients, review/payment deadline states, repeated tickets and questions, and all artist/speaker/volunteer approval/rejection states with optional review notes.
- Dispute reminders keep audience, Stripe Connect, last-reminder warning, payment link, and tracking pixel as independent conditions.
- Vendor and refund financial fixtures reconcile line items, subtotal, tax, processing/bank fees, and grand totals.
- Marketing previews escape organizer-authored content and use inert `example.com` approval links.
- New batch image references use PNG fixtures; no batch output references SVG-only content.
- Dynamic identifiers, currency, dates, email addresses, phone numbers, and mixed-direction values use bidi isolation in RTL output.

## Protected baseline preservation

After the final `npm run generate`, all 13 owner-approved standalone HTML files matched their pre-batch SHA-256 values exactly:

| Template | SHA-256 prefix | Result |
|---|---:|---|
| `activate_email` | `B9B12C99` | unchanged |
| `festival_donation` | `8A5BF103` | unchanged |
| `festival_ticket_sale` | `BB812023` | unchanged |
| `festival_ticket_registration_approval` | `78E5F3CD` | unchanged |
| `support` | `4F2FDD19` | unchanged |
| `dispute_notification` | `50D71EE3` | unchanged |
| `festival_marketing_email_target` | `86851DAB` | unchanged |
| `password_reset` | `4B22791F` | unchanged |
| `refund_receipt_user` | `10657BE7` | unchanged |
| `festival_ticket_registration_reject` | `AF9EF8B7` | unchanged |
| `festival_approval_status_changed` | `CF687362` | unchanged |
| `contact_submission` | `BC76FB34` | unchanged |
| `organizer_announcement` | `0FC2A698` | unchanged |

## Verification

- Generation: **PASS** — 33 standalone previews generated.
- Exact catalog and traceability validation: **PASS**.
- Batch QA: **PASS** — 325 structural renders, 175 responsive checks, 20 long-content stress checks, 20 blocked-image checks, 24 RTL visual checks, 20 traceability checks, and 8 financial fixtures; zero failures.
- Visual inspection: **PASS** for all 40 default desktop/mobile captures plus focused RTL and dense-financial spot checks.
- Real Gmail, Outlook, and Apple Mail: **NOT RUN**.

See [`BATCH_20_QA_REPORT.md`](./BATCH_20_QA_REPORT.md), [`BATCH_20_VISUAL_REVIEW.md`](./BATCH_20_VISUAL_REVIEW.md), and the raw [`batch20-qa-results.json`](./batch20-qa-results.json).

## Boundaries preserved

- Backend source remained read-only.
- No production template, Figma, official Wallet artwork, owner logo, CDN, staging, commit, push, or deployment action occurred.
- `organizer_announcement` remains owner-approved for HTML Preview only and **BLOCKED** for production security migration.
- Production marketing approval links remain **BLOCKED** pending a separately authorized safe state-changing flow; the preview uses inert URLs.
- The final 15 in-scope templates remain undesigned and unauthorized.
- All work remains unstaged for owner review.
