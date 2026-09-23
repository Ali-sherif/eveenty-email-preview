# Phase F — Remaining Catalog Execution Plan

**Gate:** Explicit owner approval of all four references (Activation, Ticket Sale, Dispute, Marketing Target).  
**In-scope remaining after references:** **43** templates (47 − 4).  
**Exclusions (12):** never redesign in Phase 1 — including `organizer_announcement` and `marketing`–`marketing4`.

---

## Wave plan

| Wave | Master | Templates (examples) | Notes |
|---|---|---|---|
| F1 | COMMERCE near-neighbors | `festival_donation`, `festival_activity_sale`, `festival_add_on_sale`, refunds, sponsor/sales | Reuse Totals / Header / Footer |
| F2 | COMMERCE ticket/pass | Registration family, partner coupons (EN-only) | Preserve Ticket modules |
| F3 | NOTIFICATION workflow | `needs_response_dispute_reminder`, festival approval/update family | Reuse Dispute status/table patterns |
| F4 | NOTIFICATION internal EN | `support`, `bad_content_alert`, contact/demo/extra_service, marketing receipts | EN-only frames |
| F5 | MARKETING | `festival_rescounts_marketing_email_target` | Same Marketing master; existing unsubscribe |
| F6 | TRANSACTIONAL remainder | `password_reset` | Same Activation shell |

---

## Per-template completion rule

A template is **complete** only when ALL are true:
1. Editable Figma design exists for each applicable locale/audience (not placeholder-only)
2. Matching local HTML preview exists
3. Automated browser checks recorded with evidence
4. Copy verified against production template + YAML for supported languages
5. Exclusions untouched

Never mark complete solely because a shared layout instance exists.

---

## Evidence matrix columns (per template)

`template | master | locales | variants | figma nodes | preview id | browser matrix | blockers | exceptions | owner notes`
