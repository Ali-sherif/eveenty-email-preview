# OWNERSHIP — Production Email Migration

**Date:** 2026-09-27

| Role | Owns | Does not own |
|---|---|---|
| **Owner** | Activation authorization (all 48 together); archive approval after production verification; design decisions already closed (logos, Support, Condensed Wallet, side-by-side, CDN separation) | Security remediation; inventing rollback/deploy mechanics |
| **Backend team** | P1–P2 implementation; side-by-side kit parse set; dormant port batches; activation control; rollback; deploy sequencing; archive mechanics; integration snapshots/parity | Owner visual redesign; Infra CDN upload without Infra |
| **Backend / Security** | Disposition of the **four** security handoffs (11 template IDs) as a **release gate** | Email Kit HTML Preview redesign |
| **Infra** | Host 14 kit assets on **both** Production and Staging CDN bases; supply PENDING base URLs; resolve path/auth issues | Template Go porting |
| **QA** | Level B real-client testing on Staging; assist production verification as agreed | Security disposition sign-off |
| **Email Kit (this repo)** | Phase 0 docs; approved HTML Preview designs (read-only for migration); catalog/traceability | Backend writes; CDN upload; activation |

## Four security handoffs (Backend/Security)

| Handoff name | Template IDs |
|---|---|
| `organizer_announcement` | `organizer_announcement` |
| Marketing Approval | `festival_marketing_approval`, `festival_marketing_approval_sms` |
| `festival_rescounts_marketing_email_target` | `festival_rescounts_marketing_email_target` |
| Final Seven — Backend/Security Review | `marketing_package_sale`, `festival_payout`, `partner_coupons`, `partner_coupons_partner`, `bad_content_alert`, `book_demo_admin`, `extra_service_request` |

Evidence pointers live in `docs/agent/HANDOFF.md` / `PROJECT_STATE.md` workstream C. Status: **unresolved**. Do not describe as fixed, harmless, or cleared.

## Delegated mechanics (Backend team to define)

- Activation control  
- Rollback mechanism  
- Deploy sequencing  
- Archive mechanics  

Non-blocking for Phase 0 completion.
