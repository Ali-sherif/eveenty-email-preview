# Seven-email matrix — Task 03 final review

**Generated:** 2026-09-24  
**Evidence:** `measurements.json`, `figma/*.png`, `screenshots/*.png`, `comparisons/index.html`, production templates (read-only)

**Legend**

| Column | Meaning |
|---|---|
| **DESIGNED** | Editable Email Kit frame exists for EN reference (and noted locale gaps). |
| **BROWSER QA PASS** | Fresh Playwright Chromium matrix pass (automated checks in `capture-qa.mjs`). |
| **FIGMA/PREVIEW PARITY PASS** | Independent visual review: Figma export vs browser EN desktop — structure, foundations, CTA/logo where applicable. Not byte-identical. |
| **OWNER APPROVED** | Explicit owner sign-off — **none recorded**. |

**Email clients:** Gmail / Outlook / Apple Mail — **NOT EXECUTED**.

---

| # | Template | DESIGNED | BROWSER QA PASS | FIGMA/PREVIEW PARITY PASS | OWNER APPROVED | Locales (production) | Variants exercised | Figma node (EN) | Notes |
|--:|---|:---:|:---:|:---:|---|---|---|---|
| 1 | `activate_email` | Yes | **13/13** | **PASS** | **No** | en fr es ar fa | default, long, blocked | [4:2](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2) | Task 02 synchronized; YAML-backed copy; hidden preheader only. |
| 2 | `festival_donation` | Yes | **14/14** | **PASS** | **No** | en fr es ar fa (+ admin EN path in prod) | donatorUser, organizerNotify | [21:2](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=21-2) | No primary CTA (correct). FR/ES YAML patched. |
| 3 | `festival_ticket_sale` | Yes | **14/14** | **PASS** (minor fixture deltas) | **No** | en fr es ar fa | buyer, guest, long, blocked | [21:53](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=21-53) | Wallet/QR SAMPLE fixtures; secondary CTAs not yellow (prod). |
| 4 | `festival_ticket_registration_approval` | Yes | **14/14** | **PASS** | **No** | en fr es ar fa | completeOrder, noCta, long | [48:45](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=48-45) | Primary CTA yellow in Figma + preview; magenta **accent** retained in content chrome (`#D80073` secondary). |
| 5 | `support` | Yes | **8/8** | **PASS** | **No** | **en only** | default, longDetails | [22:113](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=22-113) | Branded header in kit; **differs from prod** `header_3` + bottom 380px CDN logo (intentional reference). |
| 6 | `dispute_notification` | Yes | **17/17** | **PASS** | **No** | en fr es ar fa (admin EN forced) | organizer, admin, CTA, stripe, noEvidence | [72:44](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=72-44) | Yellow CTA when `withPaymentLink` only. |
| 7 | `festival_marketing_email_target` | Yes | **7/7** | **PASS** | **No** | **en chrome**; author body | default, long, blocked | [72:175](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=72-175) | Festival logo slot; EN footer + unsubscribe; no Eveenty wordmark header. |

**Automated browser total:** **87/87 PASS** (`measurements.json`, regenerated this review).

**Shared components used (preview renderer)**

| Template | Header | Footer / chrome | CTA | Other |
|---|---|---|---|---|
| activate | `brandedHeader` | `brandedFooter` | `primaryCtaYellow` | — |
| donation | `brandedHeader` | `brandedFooter` | — | `totalsBox`, `kvRow` |
| ticket_sale | `brandedHeader` | `brandedFooter` | wallet links (secondary) | ticket card, QR fixture |
| reg_approval | `brandedHeader` | registration footer block | `primaryCtaYellow` | `sectionTitle`, ticket modules |
| support | `brandedHeader` | text footers (no giant CDN logo) | — | error panel, `<pre>` block |
| dispute | `brandedHeader` | inline closing | `primaryCtaYellow` (conditional) | alert, details table, next steps |
| marketing | `marketingFestivalHeader` | `marketingCampaignFooter` | — | author body + image fixture |

**Localized logos:** `assets/logos/eveenty-logo-{en,fr,es,ar,fa}.png` (owner PNGs, 160px display width).

**Previous QA findings**

| Finding (prior pass) | Resolved? |
|---|---|
| Donation/reg/support visible preheader bar | **Yes** — hidden preheader only |
| Logo 200→160 | **Yes** — preview + Figma |
| Reg approval magenta CTA | **Yes** — yellow CTA in Figma `48:59` + preview; prod template unchanged |
| Marketing wrong reference / announcement | **Yes** — `festival_marketing_email_target` only; announcement not in selector |
| FR/ES donation/reg copy | **Yes** — YAML-backed sample data |
