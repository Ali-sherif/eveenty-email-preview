# Final Seven Batch Selection

Verified 2026-09-27 against `catalog/email-catalog.json`, `catalog/EMAIL_TEMPLATE_TRACEABILITY.csv`, the seven production templates under read-only `D:\last\rescounts-backend\email\templates\`, and their targeted sender implementations. Before implementation, all seven were exact `IN_SCOPE · UNDESIGNED` catalog matches, none belonged to the protected 41, and no other in-scope undesigned record remained.

## Locked scope

| ID | Semantic family | Design Kit family | Actual locales | Personas / conditions | Shared components | Complexity |
|---|---|---|---|---|---|---|
| `marketing_package_sale` | Financial/Receipt | Commerce | Organizer `en/fr/es/ar/fa`; admin `en` | Organizer/admin; repeated package items | Localized branded header/footer, cards, typography, totals | High |
| `festival_payout` | Financial/Receipt | Commerce | `en` | Organizer/admin | Branded header/footer, success alert, CTA, details card | Medium |
| `partner_coupons` | Ticket/Pass | Commerce | `en` | Buyer; optional partner map; repeated coupons | Branded header/footer, coupon cards, QR fixture, totals, CTA | High |
| `partner_coupons_partner` | Ticket/Pass | Commerce | `en` | Partner; optional partner map; repeated coupons | Same coupon system; partner-specific totals | High |
| `bad_content_alert` | Internal/Operational | Notification | `en` | Admin; serialized flagged content | Branded header/footer, warning alert, details/data cards | Medium |
| `book_demo_admin` | Internal/Operational | Notification | `en` | Admin | Branded header/footer, success alert, details/message cards, CTA | Medium |
| `extra_service_request` | Internal/Operational | Notification | `en` | Admin; optional business name; repeated services | Branded header/footer, details/message cards | Medium |

## Source contracts

### `marketing_package_sale`

- Source: `email/templates/marketing_package_sale.template`; senders `SendMarketingPackageSaleToAdmin` and `SendMarketingPackageSaleToOrganizer`.
- Variables: recipient/header fields; localized title and labels; intro; invoice ID; organizer name, address, phone, email, business name/description; sale date/time; item ID/name/quota/validity/expiry/cost; subtotal/tax/grand total.
- Conditions/personas: organizer follows validated profile language; admin is forced to English. Repeated package items. No attachment or action link.
- Dependencies: `header_2_localized`, `footer_branded_both_dirs`, marketing-package locale YAML for `en/fr/es/ar/fa`.

### `festival_payout`

- Source: `email/templates/festival_payout.template`; senders `SendPayoutEmailToOrganizer` and `SendPayoutEmailToAdmin` in `email/smtp_payout.go`.
- Variables: recipient/header fields, festival name, period start/end dates and date-times, payout amount, redirect link.
- Conditions/personas: organizer and admin share English content; subjects identify the persona.
- Actions/attachments: payout-details redirect only; no attachment. Preview URL is inert.

### `partner_coupons` / `partner_coupons_partner`

- Sources: the two exact templates; senders `SendCoupon` and `SendCouponToPartner`; caller `api/v1/partner.go`.
- Variables: buyer/partner identity, partner name/address/map, purchase date, repeated coupon names/descriptions/codes/quantity/validity/QR image, subtotal/tax and buyer-only processing fees/tax.
- Conditions/personas: buyer vs partner totals; optional partner map; repeated coupons. Hardcoded English.
- Actions/attachments: optional map link and generated coupon QR image. No Wallet action and no MIME attachment.

### `bad_content_alert`

- Source: `email/templates/bad_content_alert.template`; sender `SendBadContentAlert`; helper `api/helpers/bad_content.go` and targeted festival-content call paths.
- Variables: requested timestamp, festival/user identity, action, moderation response, JSON-serialized flagged data.
- Conditions/personas: admin English-only; no template conditional.
- Actions/attachments: none.

### `book_demo_admin`

- Source: `email/templates/book_demo_admin.template`; sender `SendAdminBookDemoEmail`; caller `api/v1/festival_demo.go`.
- Variables: submitter name/contact/business, help topic, message, meeting start/end, Meet link, calendar-event link.
- Conditions/personas: admin English-only; no template conditional.
- Actions/attachments: Meet and calendar links; no MIME attachment. Preview URLs are inert.

### `extra_service_request`

- Source: `email/templates/extra_service_request.template`; sender `SendExtraServiceRequestToAdmin`; caller `api/v1/festival.go`.
- Variables: organizer name/contact/business, request contact, repeated requested services, special request.
- Conditions/personas: optional organizer business name; repeated services; admin English-only.
- Actions/attachments: none.

## Exact selection result

The catalog matched the expected B4 + B6 + B8 list with no discrepancy. The batch contains exactly seven IDs; no substitution or scope expansion occurred.
