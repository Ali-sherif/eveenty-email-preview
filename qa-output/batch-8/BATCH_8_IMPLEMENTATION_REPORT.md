# Batch 8 implementation report

**Date:** 2026-09-27  
**Scope:** the exact eight templates locked in `docs/agent/NEXT_8_BATCH_SELECTION.md`  
**Outcome:** **PASS — 8/8 implemented and validated in HTML Preview; awaiting owner review**

## Exact implemented set

| Template ID | Family | Locale coverage | Preview variants |
|---|---|---|---|
| `festival_add_on_sale` | Commerce / Ticket-Sales | user/guest/no-summary/organizer: en, fr, es, ar, fa; dormant admin: en | `user`, `userGuest`, `userNoSummary`, `organizerDormant`, `adminDormant` |
| `festival_activity_sale` | Commerce / Ticket-Sales | user/organizer: en, fr, es, ar, fa; admin: en | `user`, `organizer`, `admin` |
| `festival_sponsor_sale` | Commerce / Sponsor-Sales | sponsor/organizer: en, fr, es, ar, fa; admin: en | sponsor pending/approved; organizer pending/approved/rejected/closed; admin pending/approved/rejected/closed |
| `festival_sales` | Commerce / Booth-Vendor-Sales | vendor/organizer: en, fr, es, ar, fa; admin: en | vendor pending/approved/rejected; organizer and admin pending/approved/rejected/closed |
| `festival_vendor_sale` | Commerce / Booth-Vendor-Sales | en, fr, es, ar, fa | `buyer`, `vendor`, `vendorReceived` |
| `organizer_festival_marketing_email_receipt` | Notification / Organizer-Campaign-Receipts | en only | `default` |
| `organizer_festival_marketing_sms_receipt` | Notification / Organizer-Campaign-Receipts | en only | `default` |
| `festival_rescounts_marketing_email_target` | Marketing / Campaigns | en production chrome; author-supplied body | `default`, `withoutLogo`, `withoutImage`, `bodyOnly` |

The eight IDs were verified before implementation against the catalog, traceability CSV, production templates, locale builders and named sender paths. No ninth template was substituted or added.

## Implementation changes

- Added exact batch metadata in `shared/batch8-definitions.js` and targeted, source-derived locale snapshots in `shared/batch8-locales.generated.js`.
- Added table-based renderers in `shared/batch8-renderers.js`, using the approved 600px shell, branded header, typography, dividers, alerts, CTA colors, responsive rules and RTL conventions.
- Added eight generated standalone previews under `emails/` and integrated the same renderers into the interactive preview.
- Added a deterministic raster QR fixture for synthetic preview data. No Wallet functionality was introduced.
- Added exact catalog/traceability status and preview paths for only these eight records. The strict validator now asserts the named 41-design / 7-undesigned inventory and retains strict ID, metadata, mapping and source-path checks.
- Added the batch QA harness and representative captures under `qa-output/batch-8/`.

## Source behavior preserved

- Repeated add-on, activity, sponsor, sale and vendor line items; financial totals; promo, processing, card and purchase-protection conditions; and installment/due-date states use synthetic but reconcilable data.
- Buyer, guest, vendor, sponsor, organizer and admin behaviors remain distinct. Admin-only routes are English where the sender forces English.
- Status variants preserve pending, approved, rejected and closed semantics and optional rejection notes.
- QR, waiver, contract, calendar and `event.ics` attachment representations are shown only where supported by the source evidence.
- Campaign receipt content remains English-only. The marketing-target preview preserves optional logo/image/body/unsubscribe semantics while escaping author content and using inert `example.com` destinations.
- Arabic and Persian use `dir="rtl"`; technical identifiers, money values, email addresses and URLs retain explicit LTR isolation.

## Security boundary

The read-only production review confirmed that `festival_rescounts_marketing_email_target.template` is parsed with Go `text/template` and inserts `.BodyText`, `.Logo`, `.Image` and `.UnsubsribeURl` into HTML or URL attributes. The sender supplies the first three from the marketing request or fixed CDN values and builds the unsubscribe URL internally. The preview escapes author-supplied content and keeps destinations inert. Production exploitability depends on upstream validation that was not exhaustively audited here, so production migration is **BLOCKED pending a separately authorized trust-boundary review/remediation**. No backend change was made.

The previously recorded production blockers for `organizer_announcement` and the unauthenticated state-changing GET links in `festival_marketing_approval` / `_sms` remain unchanged.

## Scope confirmation

- Figma, backend templates/YAML, recipients, triggers, official Wallet artwork, owner logos and CDN: **not modified**.
- The 33 owner-approved HTML Preview designs: **not intentionally modified or redesigned**.
- Stage, commit, push and deploy: **not performed**.
- Resulting inventory: **59 physical / 11 excluded / 48 in scope / 41 designed / 7 undesigned**; **33 owner-approved + 8 awaiting owner review**.

