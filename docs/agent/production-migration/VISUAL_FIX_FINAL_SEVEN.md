# Visual fix — final-seven approved-design ports (2026-09-29)

Owner-authorized Kit visual parity fixes in `rescounts-backend` against owner-approved HTML Preview designs (`emails/{id}.html`). Analysis vs approved Preview; then implementation; then re-render compare (`eveenty-final7-fix`). **No** approved Preview HTML redesign; **no** subject/recipient/link/attachment/business-logic/data-mapping changes. Conditional fields (`PartnerMap`, `EventCalendarLink`, `OrganizerBusinessName`, coupon `ImageEmail`) remain data-gated.

## Templates

| ID | Approved Preview | Fix |
|---|---|---|
| `partner_coupons` | `emails/partner_coupons.html` | Title “Your partner coupons”; compact coupon cards (Coupon/Code/Quantity/Valid/Description); remove Rescounts help/app/store/terms; remove Company Name / Location / Order Summary heading; approved summary labels; CTA “View partner map”; simple footer |
| `partner_coupons_partner` | `emails/partner_coupons_partner.html` | Title “New partner coupon purchase”; same coupon/card/footer cleanup; partner summary without processing-fee rows |
| `festival_payout` | `emails/festival_payout.html` | Title “Festival payout processed”; remove period-range heading; Recipient row; supporting text; CTA “View payout details”; white bordered detail card with date-only period fields |
| `marketing_package_sale` | `emails/marketing_package_sale.html` | Left-border magenta purchase title; client/items/totals as bordered label/value cards; remove footer website line |
| `bad_content_alert` | `emails/bad_content_alert.html` | Remove legacy rejection intro / organizer-response / developer Data sections; Festival + Response in detail table; User / User email labels; JSON card |
| `book_demo_admin` | `emails/book_demo_admin.html` | Remove legacy intro / raw Meet URL / follow-up/sign-off / social chrome; approved labels + message card; Meet CTA + conditional calendar link; simple footer |
| `extra_service_request` | `emails/extra_service_request.html` | Approved intro; white label/value cards; remove sign-off / social chrome; simple footer |

## Backend files changed (source of truth)

- `email/templates/kit/partner_coupons.template`
- `email/templates/kit/partner_coupons_partner.template`
- `email/templates/kit/festival_payout.template`
- `email/templates/kit/marketing_package_sale.template`
- `email/templates/kit/bad_content_alert.template`
- `email/templates/kit/book_demo_admin.template`
- `email/templates/kit/extra_service_request.template`

No sender, locale YAML, or shared partial changes required for this batch.

## Verification

- `go build ./email/...` PASS after edits.
- Fixture render of all seven Kit HTML bodies vs approved Preview (600px browser screenshots + structural checklist).
- Post-fix compare images (temp only): `C:\Users\Ali\AppData\Local\Temp\eveenty-final7-fix\compare\compare-*.png`
- Fixture name/date/amount/copy differences ignored (not defects). Alert body “synthetic” wording is Preview fixture copy only — production keeps existing moderation wording.

## Match verdict (structure/styling)

| Template | Matches approved design for requested sections? |
|---|---|
| `partner_coupons` | **PASS** |
| `partner_coupons_partner` | **PASS** |
| `festival_payout` | **PASS** |
| `marketing_package_sale` | **PASS** |
| `bad_content_alert` | **PASS** |
| `book_demo_admin` | **PASS** |
| `extra_service_request` | **PASS** |

Does **not** close: Level B, DEV/Production deploy, CDN logo identity, security handoff disposition for the final seven, or kit golden refresh for these seven IDs in `docs/backend-email-migration-evidence/goldens/`.
