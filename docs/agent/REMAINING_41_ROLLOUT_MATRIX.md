# Remaining 41 rollout matrix

**Prepared:** 2026-09-26  
**Authorization:** plan all 41; implement only a diverse pilot of six; stop for owner review.  
**Scope:** HTML Preview only. Backend, Figma, production templates, CDN, deploy, commit and push remain out of scope.

The seven-reference technical gate is **PASS**. The pilot uses the existing approved component system; no new owner-decision component was introduced.

## Pilot selection

| Template | Backend family | Kit family | Backend evidence / why selected |
|---|---|---|---|
| `password_reset` | Auth/Simple | Transactional | `SendPasswordReset`; profile language; five locale YAMLs; exercises security-code content and the Activation shell. |
| `refund_receipt_user` | Financial/Receipt | Commerce | `SendRefundItemsToTargetUser`; five refund locale YAMLs; exercises line items, totals and refunded/canceled conditions. |
| `festival_ticket_registration_reject` | Ticket/Pass | Commerce | Three send paths (user/organizer/admin); user/organizer profile locale, admin EN; exercises rejection state, persona variants and RTL. |
| `festival_approval_status_changed` | Workflow/Status | Notification | `SendFestivalApprovalStatusChangedToOrganizer`; profile locale; approved/rejected and optional review-note states. |
| `contact_submission` | Internal/Operational | Notification | `SendContactSubmission`; admin EN only; exercises operational free-text/data fields with the Support-Ops pattern. |
| `organizer_announcement` | Campaign/Announcement | Marketing | `SendOrganizerAnnouncement`; caller-supplied subject/body with no locale; exercises the minimal announcement pattern restored to scope. |

## Full matrix

| # | Template ID | Backend family | Kit / subfolder | Proposed rollout batch | Pilot |
|---:|---|---|---|---|---|
| 1 | `password_reset` | Auth/Simple | Transactional / Password-Reset | P0 Diverse pilot | **Yes** |
| 2 | `festival_add_on_sale` | Financial/Receipt | Commerce / Ticket-Sales | B1 Sales receipts | No |
| 3 | `festival_activity_sale` | Financial/Receipt | Commerce / Ticket-Sales | B1 Sales receipts | No |
| 4 | `festival_sponsor_sale` | Financial/Receipt | Commerce / Sponsor-Sales | B1 Sales receipts | No |
| 5 | `festival_sales` | Financial/Receipt | Commerce / Booth-Vendor-Sales | B1 Sales receipts | No |
| 6 | `festival_vendor_sale` | Financial/Receipt | Commerce / Booth-Vendor-Sales | B1 Sales receipts | No |
| 7 | `festival_sale_installment_paid` | Financial/Receipt | Commerce / Installments | B2 Installments | No |
| 8 | `second_payment_reminder` | Financial/Receipt | Commerce / Installments | B2 Installments | No |
| 9 | `first_payment_refund` | Financial/Receipt | Commerce / Installments | B2 Installments | No |
| 10 | `sponsor_installment_paid` | Financial/Receipt | Commerce / Installments | B2 Installments | No |
| 11 | `sponsor_installment_second_payment_reminder` | Financial/Receipt | Commerce / Installments | B2 Installments | No |
| 12 | `sponsor_first_payment_refund` | Financial/Receipt | Commerce / Installments | B2 Installments | No |
| 13 | `refund_receipt_user` | Financial/Receipt | Commerce / Refunds | P0 Diverse pilot | **Yes** |
| 14 | `refund_receipt_organizer` | Financial/Receipt | Commerce / Refunds | B3 Refund personas | No |
| 15 | `refund_receipt_admin` | Financial/Receipt | Commerce / Refunds | B3 Refund personas | No |
| 16 | `marketing_package_sale` | Financial/Receipt | Commerce / Marketing-Package | B4 Financial misc. | No |
| 17 | `festival_payout` | Financial/Receipt | Commerce / Payouts | B4 Financial misc. | No |
| 18 | `festival_ticket_registration` | Ticket/Pass | Commerce / Registration | B5 Registration lifecycle | No |
| 19 | `festival_ticket_registration_reject` | Ticket/Pass | Commerce / Registration | P0 Diverse pilot | **Yes** |
| 20 | `festival_ticket_registration_deadline_exceeded` | Ticket/Pass | Commerce / Registration | B5 Registration lifecycle | No |
| 21 | `festival_ticket_registration_payment_deadline_exceeded` | Ticket/Pass | Commerce / Registration | B5 Registration lifecycle | No |
| 22 | `registration_approval_status_changed` | Ticket/Pass | Commerce / Registration | B5 Registration lifecycle | No |
| 23 | `partner_coupons` | Ticket/Pass | Commerce / Partner-Coupons | B6 Partner coupons | No |
| 24 | `partner_coupons_partner` | Ticket/Pass | Commerce / Partner-Coupons | B6 Partner coupons | No |
| 25 | `festival_approval_status_changed` | Workflow/Status | Notification / Approvals-Status | P0 Diverse pilot | **Yes** |
| 26 | `festival_update_request_approved` | Workflow/Status | Notification / Approvals-Status | B7 Workflow/status | No |
| 27 | `festival_update_request_rejected` | Workflow/Status | Notification / Approvals-Status | B7 Workflow/status | No |
| 28 | `festival_vendor_sale_rejection` | Workflow/Status | Notification / Approvals-Status | B7 Workflow/status | No |
| 29 | `needs_response_dispute_reminder` | Workflow/Status | Notification / Disputes | B7 Workflow/status | No |
| 30 | `festival_update_request_issued` | Workflow/Status | Notification / Approvals-Status | B7 Workflow/status | No |
| 31 | `festival_created` | Workflow/Status | Notification / Approvals-Status | B7 Workflow/status | No |
| 32 | `festival_marketing_approval` | Workflow/Status | Notification / Approvals-Status | B7 Workflow/status | No |
| 33 | `festival_marketing_approval_sms` | Workflow/Status | Notification / Approvals-Status | B7 Workflow/status | No |
| 34 | `bad_content_alert` | Internal/Operational | Notification / Support-Ops | B8 Internal operations | No |
| 35 | `contact_submission` | Internal/Operational | Notification / Support-Ops | P0 Diverse pilot | **Yes** |
| 36 | `book_demo_admin` | Internal/Operational | Notification / Support-Ops | B8 Internal operations | No |
| 37 | `extra_service_request` | Internal/Operational | Notification / Support-Ops | B8 Internal operations | No |
| 38 | `organizer_festival_marketing_email_receipt` | Internal/Operational | Notification / Organizer-Campaign-Receipts | B9 Campaign receipts | No |
| 39 | `organizer_festival_marketing_sms_receipt` | Internal/Operational | Notification / Organizer-Campaign-Receipts | B9 Campaign receipts | No |
| 40 | `festival_rescounts_marketing_email_target` | Campaign/Announcement | Marketing / Campaigns | B10 Marketing target | No |
| 41 | `organizer_announcement` | Campaign/Announcement | Marketing / Organizer-Announcements | P0 Diverse pilot | **Yes** |

## Order after owner review

Recommended sequence is B3/B5/B7 first because the pilot validates their shared refund, registration and status patterns; then B1/B2/B4/B6; then B8/B9/B10. Each future batch still requires explicit owner authorization and per-template locale/traceability verification. Do not start any batch automatically.
