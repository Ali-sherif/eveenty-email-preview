# SEVEN EMAIL CORRECTION MATRIX

**Date:** 2026-09-25  
**Inventory:** 7 designed references · 41 undesigned · mapping preserved

| # | template_id | Figma | HTML | Corrections applied | HTML | Figma | Responsive | RTL | Contrast (text) | Wallet badges | Client QA |
|---|-------------|-------|------|---------------------|------|-------|------------|-----|-----------------|---------------|-----------|
| 1 | `activate_email` | `4:2` | `emails/activate_email.html` | Primary CTA Large (13/24, Medium 500, VML); footer divider `#ebebeb`; container border (no shadow-only) | **PASS** | **PASS** | **PASS** (800/768/414/375/320) | **PASS** (AR/FA sampled) | **PASS** CTA 5.52:1 | N/A | **NOT RUN** |
| 2 | `festival_donation` | `21:2` | `emails/festival_donation.html` | Meaningful muted → Dark-500; footer divider; container border | **PASS** | N/A (no CTA/alert change required) | **PASS** | **PASS** (AR sampled) | **PASS** | N/A | **NOT RUN** |
| 3 | `festival_ticket_sale` | `21:53` | `emails/festival_ticket_sale.html` | Restored custom magenta Wallet text buttons (CDN image-button revoked); calendar text links; Dark-500; footer divider | **PASS** | **PASS** (Wallet Links `18:27` restored) | **PASS** | **PASS** (AR sampled) | **PASS** | Custom chrome **PASS**; logo-in-button **NEEDS OWNER DECISION** (prohibited) | **NOT RUN** |
| 4 | `festival_ticket_registration_approval` | `48:45` | `emails/festival_ticket_registration_approval.html` | Success alert shared component `#166534` / radius 16; CTA Large; Dark-500 labels | **PASS** | **PASS** | **PASS** | **PASS** (AR sampled) | **PASS** success 6.81:1 | N/A | **NOT RUN** |
| 5 | `support` | `22:113` | `emails/support.html` | Error status alert: title `#991B1B` / body `#4D4C49`; radius 16; Dark-500 footer copy | **PASS** | **PASS** | **PASS** | N/A (EN-only production) | **PASS** | N/A | **NOT RUN** |
| 6 | `dispute_notification` | EN `72:44` · AR `72:111` | `emails/dispute_notification.html` | Warning DS border/fg; remove yellow event names; remove yellow Event Info accent bar; team name Dark-700; CTA Large when `withPaymentLink` | **PASS** | **PASS** (EN+AR) | **PASS** | **PASS** (AR) | **PASS** warning 6.84:1 | N/A | **NOT RUN** |
| 7 | `festival_marketing_email_target` | `72:175` | `emails/festival_marketing_email_target.html` | Container border only (festival header/footer preserved; no Eveenty branded header imposed) | **PASS** | Unchanged structure | **PASS** | N/A (EN chrome) | **PASS** body | N/A | **NOT RUN** |

### Production mapping (unchanged)
All seven retain catalog `production_path` and `DESIGNED` status. `organizer_announcement` remains undesigned.

### Notes
- Dispute default organizer preview has **no** payment CTA (conditional) — CTA geometry validated on `withPaymentLink` variant (**PASS**).
- RegApproval uses specialized footer card (not branded footer) — `#ebebeb` present on cards; branded footer divider N/A.
- Overflow checks at all listed widths: **PASS** (no horizontal overflow detected in Chromium).
