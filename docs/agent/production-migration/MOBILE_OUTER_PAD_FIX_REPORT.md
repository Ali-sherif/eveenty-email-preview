# Mobile outer horizontal padding fix — Kit / Preview 50

Date: 2026-09-30  
Scope: all **50** current Kit/Preview emails (shared shell)

## Verdict

**PASS** — shared mobile `.outer-pad` restored to **16px** left/right. Chromium Level A measures at 320 / 375 / 414 show 16px gutters on both sides. Level B (Gmail / Outlook / Apple Mail) **NOT RUN**.

## Root cause

Shared responsive CSS (preview `shared/email-kit.js` + Kit `kit_head_styles.template`) zeroed outer side padding under `@media only screen and (max-width: 620px)`:

```css
.outer-pad { padding-left: 0 !important; padding-right: 0 !important; }
```

That was intentional for older Google Wallet **Primary** badge fit at 320px. Owner policy is now **Condensed-only**; Condensed badges max ~186×48 and still fit inside a 320px viewport with 16px gutters (card ≈288px).

Inline shell already used `padding:40px 16px` on `.outer-pad`; the media query overrode sides to 0 on every mobile client that honors the MQ (Gmail iOS/Android, Apple Mail, etc.).

## Fix

```css
.outer-pad { padding-left: 16px !important; padding-right: 16px !important; }
```

| Layer | Path |
|---|---|
| Preview shell | `shared/email-kit.js` |
| Preview HTML | all 50 `emails/*.html` via `node generate-standalone.mjs` |
| Kit production | `rescounts-backend/email/templates/kit/partials/kit_head_styles.template` |
| Kit goldens | 278 `docs/.../kit_snapshots/**/*.eml` (CSS line only) |
| Baselines | 12 `docs/agent/production-migration/baselines/**/*.html` |

No per-template body markup changes. No subject / recipient / link / data-mapping changes.

## Affected templates (50 / 50)

All current Kit/Preview IDs share `kit_head_styles` / `wrapEmailDocument`:

1. `activate_email`
2. `bad_content_alert`
3. `book_demo_admin`
4. `contact_submission`
5. `dispute_notification`
6. `extra_service_request`
7. `festival_activity_sale`
8. `festival_add_on_sale`
9. `festival_approval_status_changed`
10. `festival_created`
11. `festival_donation`
12. `festival_end_of_day_report`
13. `festival_marketing_approval`
14. `festival_marketing_approval_sms`
15. `festival_marketing_email_target`
16. `festival_payout`
17. `festival_rescounts_marketing_email_target`
18. `festival_sale_installment_paid`
19. `festival_sales`
20. `festival_sponsor_sale`
21. `festival_ticket_registration`
22. `festival_ticket_registration_approval`
23. `festival_ticket_registration_deadline_exceeded`
24. `festival_ticket_registration_payment_deadline_exceeded`
25. `festival_ticket_registration_reject`
26. `festival_ticket_sale`
27. `festival_update_request_approved`
28. `festival_update_request_issued`
29. `festival_update_request_rejected`
30. `festival_vendor_sale`
31. `festival_vendor_sale_rejection`
32. `first_payment_refund`
33. `marketing_package_sale`
34. `needs_response_dispute_reminder`
35. `organizer_announcement`
36. `organizer_festival_marketing_email_receipt`
37. `organizer_festival_marketing_sms_receipt`
38. `organizer_team_invitation`
39. `partner_coupons`
40. `partner_coupons_partner`
41. `password_reset`
42. `refund_receipt_admin`
43. `refund_receipt_organizer`
44. `refund_receipt_user`
45. `registration_approval_status_changed`
46. `second_payment_reminder`
47. `sponsor_first_payment_refund`
48. `sponsor_installment_paid`
49. `sponsor_installment_second_payment_reminder`
50. `support`

## Corrected snippet (shared)

```html
<td align="center" class="outer-pad" style="padding:40px 16px;width:100%;max-width:100%;">
  <table role="presentation" class="email-container" width="600" …>
    …body…
  </table>
</td>
```

```css
@media only screen and (max-width: 620px) {
  .email-container { width: 100% !important; max-width: 100% !important; }
  .stack-pad { padding-left: 16px !important; padding-right: 16px !important; }
  .outer-pad { padding-left: 16px !important; padding-right: 16px !important; }
}
```

## Mobile measures (Chromium Level A)

| Viewport | Outer pad L/R | Card↔viewport gutter L/R | Card width |
|---:|---|---:|---:|
| 320 | 16px / 16px | 16 / 16 | 288 |
| 375 | 16px / 16px | 16 / 16 | 343 |
| 414 | 16px / 16px | 16 / 16 | 382 |

Templates sampled: `festival_ticket_sale`, `password_reset`.

## Out of scope / not claimed

- Level B real-client testing
- Commit / push / deploy
- Inner bordered-row padding on non-reject registration layouts (`padding:6px 0` still as prior handoff)
