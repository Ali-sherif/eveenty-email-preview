# PROJECT_STATE — Eveenty Email Design Kit

> Inventory verified 2026-09-27 against `catalog/email-catalog.json`, `catalog/EMAIL_TEMPLATE_TRACEABILITY.csv`, the updated catalog validator, and the fresh batch-8 QA harness.

## Inventory (verified against live catalog)
| Fact | Value | Verified this session? |
|---|---|---|
| Physical templates | 59 | Yes — `emails.length` + unique ids + CSV 59 data rows |
| Excluded from Phase 1 | 11 | Yes — `scope === EXCLUDED` |
| In Phase 1 scope | 48 | Yes — `scope === IN_SCOPE` |
| Backend families | Auth/Simple 2 / Financial/Receipt 20 / Ticket/Pass 8 / Workflow/Status 15 / Internal/Operational 7 / Campaign/Announcement 7 | Yes — counted from catalog |
| Design Kit families (in-scope only) | Transactional 2 / Commerce 26 / Notification 17 / Marketing 3 | Yes — counted from IN_SCOPE rows |
| Owner-approved HTML Preview designs | 41 (previous 33 + approved batch 8) | Yes — explicit owner approval recorded 2026-09-27 |
| Final-seven designs awaiting owner review | 7 | Yes |
| Total previewable designs | 48 | Yes |
| Undesigned in-scope | 0 | Yes |

## Seven completed reference designs
`activate_email`, `festival_donation`, `festival_ticket_sale`, `festival_ticket_registration_approval`, `support`, `dispute_notification`, `festival_marketing_email_target`

Catalog status for all seven: `DESIGNED`, `preview_selectable: true`, preview HTML present under `emails/`.

**Owner visual status:** conditional owner visual approval (components/system accepted for reuse; not a blanket “ship all seven unchecked”).

**Final technical gate (required before any of the remaining 41):** **PASS** as of 2026-09-26. Evidence: `qa-output/approved-component-corrections/FINAL_SEVEN_TECHNICAL_GATE.md`.

Verified this gate session:
1. Cards/Typography consistency against approved tokens/adaptations — **PASS** (CSS shell synced on six standalones; no approved-token FAIL).
2. Wallet badge sizing at 320px — **PASS** (fresh Chromium measures; official condensed Google ≤620px; heightFailCount 0).

Historical QA remains **evidence only** for older work. Discarded screenshot sets must **not** be regenerated as a rollout prerequisite. Gate PASS does **not** authorize the remaining 41 — still needs explicit per-template or bounded-batch owner authorization. Level B (Gmail/Outlook/Apple Mail) **NOT RUN**.

## Protected 41-template owner-approved baseline

`password_reset`, `refund_receipt_user`, `festival_ticket_registration_reject`, `festival_approval_status_changed`, `contact_submission`, `organizer_announcement`

All six pilot designs are owner-approved for HTML Preview, joining the seven references above. Their fresh Level A QA is **PASS**. Evidence: `qa-output/pilot-batch/PILOT_REVIEW_PACK.md`.

## Owner-approved 20-template batch

The exact B3 + B5 + B7 + B2 selection in `docs/agent/NEXT_20_BATCH_SELECTION.md` is implemented in HTML Preview. Fresh Level A QA is **PASS**: 325 structural renders, 175 responsive checks at 800/768/414/375/320, 20 long-content checks, 20 blocked-image checks, 24 RTL visual checks, 20 traceability checks, and 8 financial reconciliation fixtures, all with zero failures.

Evidence: `qa-output/batch-20/BATCH_20_IMPLEMENTATION_REPORT.md`, `BATCH_20_QA_REPORT.md`, `BATCH_20_VISUAL_REVIEW.md`, and `batch20-qa-results.json`.

On 2026-09-27 the owner visually approved all 20 HTML Preview designs. Together with the prior 13 and the subsequently approved eight-template batch, they form the protected **41-template owner-approved baseline**. This approval does not assert production readiness and does not close Level B client testing or production security gates.

## Owner-approved eight-template batch

The exact B1 + B9 + B10 selection in `docs/agent/NEXT_8_BATCH_SELECTION.md` is implemented in HTML Preview:

`festival_add_on_sale`, `festival_activity_sale`, `festival_sponsor_sale`, `festival_sales`, `festival_vendor_sale`, `organizer_festival_marketing_email_receipt`, `organizer_festival_marketing_sms_receipt`, `festival_rescounts_marketing_email_target`.

Fresh Level A QA is **PASS**: 126 structural renders, 65 responsive checks at 800/768/414/375/320, 8 long-content checks, 8 blocked-image checks, 12 RTL visual checks, 8 traceability checks, 5 financial reconciliation fixtures and 4 focused condition assertions, all with zero failures.

Evidence: `qa-output/batch-8/BATCH_8_IMPLEMENTATION_REPORT.md`, `BATCH_8_QA_REPORT.md`, `BATCH_8_VISUAL_REVIEW.md`, and `batch8-qa-results.json`.

On 2026-09-27 the owner visually approved all eight HTML Preview designs. They are now part of the protected 41-template baseline. Production security findings for `festival_rescounts_marketing_email_target` remain open separately.

## Final seven implemented (owner review pending)

The exact B4 + B6 + B8 selection in `docs/agent/FINAL_7_BATCH_SELECTION.md` is implemented in HTML Preview:

`marketing_package_sale`, `festival_payout`, `partner_coupons`, `partner_coupons_partner`, `bad_content_alert`, `book_demo_admin`, `extra_service_request`.

Fresh Level A QA is **PASS**: 16 structural renders, 35 responsive checks at 800/768/414/375/320, 7 long-content checks, 7 blocked-image checks, 4 RTL visual checks, 7 traceability checks, 4 financial fixtures and 4 focused condition assertions, all with zero failures.

Evidence: `qa-output/final-7/FINAL_7_IMPLEMENTATION_REPORT.md`, `FINAL_7_QA_REPORT.md`, `FINAL_7_VISUAL_REVIEW.md`, and `final7-qa-results.json`.

The seven are cataloged `DESIGNED` and previewable but remain **AWAITING OWNER REVIEW**. Phase 1 has no remaining undesigned in-scope templates.

## Original remaining Phase 1 scope (41; all 41 designs complete)
- Deliverable: **HTML Preview only** — no Figma edits for remaining templates unless the owner separately authorizes a specific Figma change.
- Languages: use **only** locales actually supported by each original backend template (catalog/traceability `locale_*` + production template). Do **not** force en/ar/fr/es/fa onto every email.
- Wallet badge locales (en/ar/fr/es/fa under `assets/wallet/official/`) apply to prepared Wallet artwork for ticket-sale style previews — **not** proof that every email supports five languages.
- Reuse the owner-approved email component system (Primary CTA, header/localized logos, Warning/Error/Success alerts, accessible muted-text policy, dividers/shared components, approved typography adaptations). Details: `shared/tokens.js`, `shared/email-kit.js`, and this file — do not duplicate the full Design System into skills.

## Notable single items
- `organizer_announcement` — Phase 1 scope, Marketing / Campaign-Announcement, **IN_SCOPE · DESIGNED · owner-approved for HTML Preview**. Production security migration remains blocked separately.
- `festival_marketing_approval` / `festival_marketing_approval_sms` — owner-approved HTML Preview designs with Level A **PASS**, escaped content and inert links; production state-changing approval links remain blocked pending a separately authorized secure flow.
- `festival_rescounts_marketing_email_target` — HTML Preview Level A **PASS**, awaiting owner review. Its `text/template` production sink accepts body/media/URL values; production migration remains blocked pending a separately authorized trust-boundary review/remediation.

## Approved design standards (email kit)
See `.agents/skills/email-rendering-compatibility/SKILL.md` and `shared/tokens.js` (owner-approved corrections 2026-09-25).

**Implemented email kit values:** primary CTA `#e9d023` / `#4d4c49` (DS Large pad 13×24, Medium 500); branded header `#fefdf4`; heading `#2b2a28`; body / **meaningful muted** `#4d4c49` (Dark-500); decorative Dark-50 `#898988` only for non-essential/non-text; border `#ebebeb`; success text `#166534` on `#f0fdf4`; warning `#92400e` on `#fffbeb` border `#e6d1b9`; error title `#991b1b` / body `#4d4c49` on `#fef2f2`; container max 600; logo 160px.

## Wallet (final)
- Use downloaded **official** Apple and Google Wallet badges under `assets/wallet/official/` — not custom CSS buttons and not yellow Eveenty CDN badge images.
- Preserve each provider’s original badge shape; do not edit official artwork.
- Prepared preview locales for badges: en, ar, fr, es, fa (see `assets/wallet/official/README.md`). Condensed Google used on narrow viewports.
- Production CDN upload of these assets — **not authorized**.

## Current active task
The exact final-seven batch is implemented and fresh Level A/RTL QA is **PASS** (including 2026-09-27 focused footer recipient correction; see `qa-output/final-7/FINAL_7_FOOTER_VERIFICATION.md`); **STOPPED for final owner visual review**. The seven are `DESIGNED` and previewable but are not owner-approved automatically.

## Known blockers
- Final seven production or further implementation work — **blocked** pending explicit owner visual approval and any separately authorized production scope.
- `organizer_announcement` production migration — read-only review found likely header-injection and unsanitized-HTML boundary gaps; see `qa-output/pilot-batch/PILOT_SECURITY_REVIEW.md`. Preview itself escapes synthetic content.
- Marketing email/SMS approval production flow — current state-changing unauthenticated GET links carry link-scanner/prefetch risk; preview links are inert, but production remediation requires separate authorization.
- `festival_rescounts_marketing_email_target` production migration — Go `text/template` inserts caller/request-derived body and media values into HTML/attributes; preview escapes them, but production trust-boundary review/remediation needs separate authorization.
- Production CDN upload of `assets/wallet/official/**` — **not authorized**.
- No `package.json` wiring for `email:*` scripts (intentional — use `node .agents/scripts/email-cli.mjs …`).
- Level B real email-client QA — not executed.
- Marking the final seven `OWNER VISUAL APPROVED` or performing any production deploy — requires separate explicit owner authorization.

## Closed owner decisions (selected)
- **OD-2 — CLOSED — OWNER APPROVED (Option A, 2026-09-26):** keep Original DS alert borders Warning `#E6D1B9` / Error `#E9C5C6` as decorative; status via accessible text/headings/icons; do not strengthen or change border colors.

## Canonical audit artifact locations (verified readable)
- `D:\emails\Eveenty-Email-Kit-Phase1\organization\` (FAMILY_TAXONOMY_AUDIT, TRACEABILITY CSV, etc.)
- Mirrored copies under `eveenty-email-preview/catalog/`
- Backend templates readable under `D:\last\rescounts-backend\email\templates\` (59 `*.template` files; plus non-template asset `welcome_email_ad.png`)
