# Pilot RTL visual review

**Date:** 2026-09-26  
**Locales:** Arabic and Persian only where supported by the read-only production mapping.  
**Viewports:** 800px desktop and 320px mobile.

## Screenshot index

| Template | Arabic | Persian |
|---|---|---|
| `password_reset` | [desktop](screenshots/rtl/password_reset--ar--desktop-800.png) · [mobile](screenshots/rtl/password_reset--ar--mobile-320.png) | [desktop](screenshots/rtl/password_reset--fa--desktop-800.png) · [mobile](screenshots/rtl/password_reset--fa--mobile-320.png) |
| `refund_receipt_user` | [desktop](screenshots/rtl/refund_receipt_user--ar--desktop-800.png) · [mobile](screenshots/rtl/refund_receipt_user--ar--mobile-320.png) | [desktop](screenshots/rtl/refund_receipt_user--fa--desktop-800.png) · [mobile](screenshots/rtl/refund_receipt_user--fa--mobile-320.png) |
| `festival_ticket_registration_reject` | [desktop](screenshots/rtl/festival_ticket_registration_reject--ar--desktop-800.png) · [mobile](screenshots/rtl/festival_ticket_registration_reject--ar--mobile-320.png) | [desktop](screenshots/rtl/festival_ticket_registration_reject--fa--desktop-800.png) · [mobile](screenshots/rtl/festival_ticket_registration_reject--fa--mobile-320.png) |
| `festival_approval_status_changed` | [desktop](screenshots/rtl/festival_approval_status_changed--ar--desktop-800.png) · [mobile](screenshots/rtl/festival_approval_status_changed--ar--mobile-320.png) | [desktop](screenshots/rtl/festival_approval_status_changed--fa--desktop-800.png) · [mobile](screenshots/rtl/festival_approval_status_changed--fa--mobile-320.png) |

## Results

| Inspection | Result |
|---|---|
| Document direction and heading/body alignment | **PASS** · all 16 renders use RTL; content aligns correctly (refund headline intentionally centered) |
| Numbers, dates, currency, email addresses and IDs | **PASS** · technical values remain LTR/isolated and readable |
| Field labels/values, alerts, tables and totals | **PASS** · mirrored order remains legible at both widths |
| Alert/section accent placement and CTA behavior | **PASS** · accents appear on the RTL edge; no applicable CTA in these representative states |
| Long localized copy and font fallback | **PASS** · Tahoma/Arial/Helvetica/sans-serif fallback computed; no collisions or clipped lines |
| Horizontal overflow/clipping | **PASS** · 0 document-level or element-level failures |

One issue was found and resolved: the festival review note now preserves production `dir="auto"` and plaintext bidi handling, so caller-supplied LTR text remains correctly ordered inside an RTL email. The English note is intentional synthetic caller content, not a translation.

Source/static locale copy was not translated or rewritten. `contact_submission` remains EN-only, and `organizer_announcement` remains caller-supplied/no-locale. Gmail, Outlook and Apple Mail: **NOT RUN**.

