# EMAIL_FOLDER_STRUCTURE.md

**Date:** 2026-09-24  
**Type:** Catalog / navigation structure (metadata)  
**Production paths:** Unchanged — canonical identity remains `email/templates/<name>.template`

---

## Principles

1. Organize **48 in-scope** templates under four Design Kit families.
2. Keep **11 exclusions** in a separate Excluded inventory.
3. One physical template → **one** catalog location.
4. Shared workflows recorded as metadata, not duplicated files.
5. Preview HTML files for the seven references stay in `emails/` (routes preserved).
6. Catalog paths below are **logical** — implemented via `email-catalog.json`, not by moving production templates.

---

## Tree

```text
Phase-1/
├── 01-Transactional/                         (2)
│   ├── Account-Activation/
│   │   └── activate_email.template           [DESIGNED]
│   └── Password-Reset/
│       └── password_reset.template
│
├── 02-Commerce/                              (26)
│   ├── Donations/
│   │   └── festival_donation.template        [DESIGNED]
│   ├── Ticket-Sales/
│   │   ├── festival_ticket_sale.template     [DESIGNED]
│   │   ├── festival_add_on_sale.template
│   │   └── festival_activity_sale.template
│   ├── Booth-Vendor-Sales/
│   │   ├── festival_sales.template
│   │   └── festival_vendor_sale.template
│   ├── Sponsor-Sales/
│   │   └── festival_sponsor_sale.template
│   ├── Installments/
│   │   ├── festival_sale_installment_paid.template
│   │   ├── second_payment_reminder.template
│   │   ├── first_payment_refund.template
│   │   ├── sponsor_installment_paid.template
│   │   ├── sponsor_installment_second_payment_reminder.template
│   │   └── sponsor_first_payment_refund.template
│   ├── Refunds/
│   │   ├── refund_receipt_user.template
│   │   ├── refund_receipt_organizer.template
│   │   └── refund_receipt_admin.template
│   ├── Marketing-Package/
│   │   └── marketing_package_sale.template
│   ├── Payouts/
│   │   └── festival_payout.template
│   ├── Registration/
│   │   ├── festival_ticket_registration.template
│   │   ├── festival_ticket_registration_approval.template  [DESIGNED]
│   │   ├── festival_ticket_registration_reject.template
│   │   ├── festival_ticket_registration_deadline_exceeded.template
│   │   ├── festival_ticket_registration_payment_deadline_exceeded.template
│   │   └── registration_approval_status_changed.template
│   └── Partner-Coupons/
│       ├── partner_coupons.template
│       └── partner_coupons_partner.template
│
├── 03-Notification/                          (17)
│   ├── Approvals-Status/
│   │   ├── festival_approval_status_changed.template
│   │   ├── festival_update_request_approved.template
│   │   ├── festival_update_request_rejected.template
│   │   ├── festival_vendor_sale_rejection.template
│   │   ├── festival_update_request_issued.template
│   │   ├── festival_created.template
│   │   ├── festival_marketing_approval.template
│   │   └── festival_marketing_approval_sms.template
│   ├── Disputes/
│   │   ├── dispute_notification.template     [DESIGNED]
│   │   └── needs_response_dispute_reminder.template
│   ├── Support-Ops/
│   │   ├── support.template                  [DESIGNED]
│   │   ├── bad_content_alert.template
│   │   ├── contact_submission.template
│   │   ├── book_demo_admin.template
│   │   └── extra_service_request.template
│   └── Organizer-Campaign-Receipts/
│       ├── organizer_festival_marketing_email_receipt.template
│       └── organizer_festival_marketing_sms_receipt.template
│
└── 04-Marketing/                             (3)
    ├── Campaigns/
    │   ├── festival_marketing_email_target.template          [DESIGNED]
    │   └── festival_rescounts_marketing_email_target.template
    └── Organizer-Announcements/
        └── organizer_announcement.template   [IN SCOPE · UNDESIGNED]

Excluded/                                     (11)
├── Restaurant-Legacy/
│   ├── restaurant_approval.template
│   ├── restaurant_decline.template
│   ├── receipt.template
│   ├── invoice.template
│   ├── marketing_approval_1.template
│   ├── marketing_sms_approval.template
│   └── marketing_notification_approval.template
└── Restaurant-Legacy-Campaigns/
    ├── marketing.template
    ├── marketing2.template
    ├── marketing3.template
    └── marketing4.template
```

---

## Count validation

| Bucket | Count |
|---|--:|
| Transactional | 2 |
| Commerce | 26 |
| Notification | 17 |
| Marketing | 3 |
| In-scope total | **48** |
| Excluded | **11** |
| Physical total | **59** |
| Designed references | **7** |
| In-scope undesigned | **41** |

---

## Metadata fields (per template)

Maintained in `EMAIL_TEMPLATE_MAPPING.csv` and `catalog/email-catalog.json`:

- `backend_semantic_family`
- `verified_design_kit_family`
- `proposed_functional_subfolder`
- `repository_relative_source_path` (canonical)
- `phase1_scope_status`
- `current_design_status`
- `figma_frame`
- `preview_reference`

---

## Preview project organization

| Asset | Action taken |
|---|---|
| `emails/*.html` (7) | **Left in place** — preserves selector / download behavior |
| `shared/sample-data.js` `EMAIL_IDS` | **Unchanged** (seven selectable previews) |
| `catalog/email-catalog.json` | **Added** — browse by family, subfolder, design status |
| Placeholder designs for 41 | **Not created** |

---

## Figma organization

| Page | Action |
|---|---|
| `04 — Email Templates — Draft` | Seven reference frames **left in place** (preserve review URLs / instances) |
| `06 — Catalog — Phase 1 (48)` | Updated navigation index to match this tree (no frame moves) |
| `00 — Cover & Decisions` | Scope badge text corrected to **59 / 11 / 48** where stale 12/47 remained |
| Original Design System | **Not modified** |
