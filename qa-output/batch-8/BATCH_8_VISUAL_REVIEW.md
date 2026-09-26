# Batch 8 visual review

**Date:** 2026-09-27  
**Review status:** **PASS — ready for owner visual review**  
**Approval status:** the eight designs are **not owner-approved automatically**.

## Representative captures

| Template | Desktop 800px | Mobile 320px | Review note |
|---|---|---|---|
| `festival_add_on_sale` | [desktop](screenshots/festival_add_on_sale--desktop-800.png) | [mobile](screenshots/festival_add_on_sale--mobile-320.png) | Repeated add-ons, QR, financial summary and attachment/calendar actions remain readable |
| `festival_activity_sale` | [desktop](screenshots/festival_activity_sale--desktop-800.png) | [mobile](screenshots/festival_activity_sale--mobile-320.png) | Activity cards, waiver/calendar actions and totals stack cleanly |
| `festival_sponsor_sale` | [desktop](screenshots/festival_sponsor_sale--desktop-800.png) | [mobile](screenshots/festival_sponsor_sale--mobile-320.png) | Status, sponsor metadata, installments and contract action are distinct |
| `festival_sales` | [desktop](screenshots/festival_sales--desktop-800.png) | [mobile](screenshots/festival_sales--mobile-320.png) | Vendor sale status, item/installment cards and due state remain legible |
| `festival_vendor_sale` | [desktop](screenshots/festival_vendor_sale--desktop-800.png) | [mobile](screenshots/festival_vendor_sale--mobile-320.png) | Buyer/vendor order details use narrow-screen cards with no horizontal overflow |
| `organizer_festival_marketing_email_receipt` | [desktop](screenshots/organizer_festival_marketing_email_receipt--desktop-800.png) | [mobile](screenshots/organizer_festival_marketing_email_receipt--mobile-320.png) | Operational email-campaign receipt follows the approved Notification pattern |
| `organizer_festival_marketing_sms_receipt` | [desktop](screenshots/organizer_festival_marketing_sms_receipt--desktop-800.png) | [mobile](screenshots/organizer_festival_marketing_sms_receipt--mobile-320.png) | SMS count/cost/tax/card-fee/paid summary remains compact |
| `festival_rescounts_marketing_email_target` | [desktop](screenshots/festival_rescounts_marketing_email_target--desktop-800.png) | [mobile](screenshots/festival_rescounts_marketing_email_target--mobile-320.png) | Optional campaign media and preference footer degrade safely |

## RTL captures

Arabic and Persian were checked at 800px and 320px for representative complex Commerce templates:

- `festival_add_on_sale`: [Arabic desktop](screenshots/rtl/festival_add_on_sale--ar--desktop-800.png), [Arabic mobile](screenshots/rtl/festival_add_on_sale--ar--mobile-320.png), [Persian desktop](screenshots/rtl/festival_add_on_sale--fa--desktop-800.png), [Persian mobile](screenshots/rtl/festival_add_on_sale--fa--mobile-320.png)
- `festival_sponsor_sale`: [Arabic desktop](screenshots/rtl/festival_sponsor_sale--ar--desktop-800.png), [Arabic mobile](screenshots/rtl/festival_sponsor_sale--ar--mobile-320.png), [Persian desktop](screenshots/rtl/festival_sponsor_sale--fa--desktop-800.png), [Persian mobile](screenshots/rtl/festival_sponsor_sale--fa--mobile-320.png)
- `festival_vendor_sale`: [Arabic desktop](screenshots/rtl/festival_vendor_sale--ar--desktop-800.png), [Arabic mobile](screenshots/rtl/festival_vendor_sale--ar--mobile-320.png), [Persian desktop](screenshots/rtl/festival_vendor_sale--fa--desktop-800.png), [Persian mobile](screenshots/rtl/festival_vendor_sale--fa--mobile-320.png)

All 12 RTL captures passed directionality and overflow checks. Money values, email addresses, invoice IDs and URLs remain LTR-isolated.

## Visual conclusions

- Approved Commerce, Notification and Marketing patterns are reused consistently; no new owner design decision is required.
- The 600px shell, localized logo treatment, card hierarchy, 16px status alerts, approved colors, 48px CTA target, neutral dividers and meaningful secondary text are preserved.
- 320px layouts stack without clipping; long addresses and email values wrap rather than overflow.
- Blocked images retain useful alt/fallback structure and do not break the layout.
- Warning/Error borders remain the owner-approved decorative colors under OD-2.
- Gmail, Outlook and Apple Mail are **NOT RUN**; this pack is browser-based Level A evidence only.

Owner review should approve or return findings for these exact eight designs. The final seven undesigned templates remain out of scope.

