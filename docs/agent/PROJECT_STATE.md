# PROJECT_STATE — Eveenty Email Design Kit

> Inventory verified 2026-09-26 against `catalog/email-catalog.json`, `catalog/EMAIL_TEMPLATE_TRACEABILITY.csv`, and the fresh pilot QA harness. The protected infrastructure CLI still encodes the pre-pilot 7/41 expectation and must not be used alone for post-pilot counts.

## Inventory (verified against live catalog)
| Fact | Value | Verified this session? |
|---|---|---|
| Physical templates | 59 | Yes — `emails.length` + unique ids + CSV 59 data rows |
| Excluded from Phase 1 | 11 | Yes — `scope === EXCLUDED` |
| In Phase 1 scope | 48 | Yes — `scope === IN_SCOPE` |
| Backend families | Auth/Simple 2 / Financial/Receipt 20 / Ticket/Pass 8 / Workflow/Status 15 / Internal/Operational 7 / Campaign/Announcement 7 | Yes — counted from catalog |
| Design Kit families (in-scope only) | Transactional 2 / Commerce 26 / Notification 17 / Marketing 3 | Yes — counted from IN_SCOPE rows |
| Approved reference designs | 7 (list below) | Yes |
| Pilot designs awaiting owner review | 6 | Yes |
| Total previewable designs | 13 | Yes |
| Undesigned in-scope | 35 | Yes |

## Seven completed reference designs
`activate_email`, `festival_donation`, `festival_ticket_sale`, `festival_ticket_registration_approval`, `support`, `dispute_notification`, `festival_marketing_email_target`

Catalog status for all seven: `DESIGNED`, `preview_selectable: true`, preview HTML present under `emails/`.

**Owner visual status:** conditional owner visual approval (components/system accepted for reuse; not a blanket “ship all seven unchecked”).

**Final technical gate (required before any of the remaining 41):** **PASS** as of 2026-09-26. Evidence: `qa-output/approved-component-corrections/FINAL_SEVEN_TECHNICAL_GATE.md`.

Verified this gate session:
1. Cards/Typography consistency against approved tokens/adaptations — **PASS** (CSS shell synced on six standalones; no approved-token FAIL).
2. Wallet badge sizing at 320px — **PASS** (fresh Chromium measures; official condensed Google ≤620px; heightFailCount 0).

Historical QA remains **evidence only** for older work. Discarded screenshot sets must **not** be regenerated as a rollout prerequisite. Gate PASS does **not** authorize the remaining 41 — still needs explicit per-template or bounded-batch owner authorization. Level B (Gmail/Outlook/Apple Mail) **NOT RUN**.

## Six-template rollout pilot (owner review pending)

`password_reset`, `refund_receipt_user`, `festival_ticket_registration_reject`, `festival_approval_status_changed`, `contact_submission`, `organizer_announcement`

All six have HTML Preview designs and fresh Level A QA **PASS**. They are **not** owner visual approved and are not production-ready. Evidence: `qa-output/pilot-batch/PILOT_REVIEW_PACK.md`. The other 35 in-scope templates remain undesigned.

## Original remaining Phase 1 scope (41; 6 pilot designs complete, 35 still undesigned)
- Deliverable: **HTML Preview only** — no Figma edits for remaining templates unless the owner separately authorizes a specific Figma change.
- Languages: use **only** locales actually supported by each original backend template (catalog/traceability `locale_*` + production template). Do **not** force en/ar/fr/es/fa onto every email.
- Wallet badge locales (en/ar/fr/es/fa under `assets/wallet/official/`) apply to prepared Wallet artwork for ticket-sale style previews — **not** proof that every email supports five languages.
- Reuse the owner-approved email component system (Primary CTA, header/localized logos, Warning/Error/Success alerts, accessible muted-text policy, dividers/shared components, approved typography adaptations). Details: `shared/tokens.js`, `shared/email-kit.js`, and this file — do not duplicate the full Design System into skills.

## Notable single items
- `organizer_announcement` — Phase 1 scope, Marketing / Campaign-Announcement, **IN_SCOPE · UNDESIGNED** (catalog + CSV row confirmed).

## Approved design standards (email kit)
See `.agents/skills/email-rendering-compatibility/SKILL.md` and `shared/tokens.js` (owner-approved corrections 2026-09-25).

**Implemented email kit values:** primary CTA `#e9d023` / `#4d4c49` (DS Large pad 13×24, Medium 500); branded header `#fefdf4`; heading `#2b2a28`; body / **meaningful muted** `#4d4c49` (Dark-500); decorative Dark-50 `#898988` only for non-essential/non-text; border `#ebebeb`; success text `#166534` on `#f0fdf4`; warning `#92400e` on `#fffbeb` border `#e6d1b9`; error title `#991b1b` / body `#4d4c49` on `#fef2f2`; container max 600; logo 160px.

## Wallet (final)
- Use downloaded **official** Apple and Google Wallet badges under `assets/wallet/official/` — not custom CSS buttons and not yellow Eveenty CDN badge images.
- Preserve each provider’s original badge shape; do not edit official artwork.
- Prepared preview locales for badges: en, ar, fr, es, fa (see `assets/wallet/official/README.md`). Condensed Google used on narrow viewports.
- Production CDN upload of these assets — **not authorized**.

## Current active task
Six-template pilot implemented and QA complete; **STOPPED for owner review**. No next rollout batch is authorized.

## Known blockers
- Remaining 35 rollout — **blocked** until explicit owner authorization of a named next batch.
- `organizer_announcement` production migration — read-only review found likely header-injection and unsanitized-HTML boundary gaps; see `qa-output/pilot-batch/PILOT_SECURITY_REVIEW.md`. Preview itself escapes synthetic content.
- Production CDN upload of `assets/wallet/official/**` — **not authorized**.
- No `package.json` wiring for `email:*` scripts (intentional — use `node .agents/scripts/email-cli.mjs …`).
- Level B real email-client QA — not executed.
- Marking any template fully `OWNER VISUAL APPROVED` / production deploy — requires separate explicit owner authorization.

## Closed owner decisions (selected)
- **OD-2 — CLOSED — OWNER APPROVED (Option A, 2026-09-26):** keep Original DS alert borders Warning `#E6D1B9` / Error `#E9C5C6` as decorative; status via accessible text/headings/icons; do not strengthen or change border colors.

## Canonical audit artifact locations (verified readable)
- `D:\emails\Eveenty-Email-Kit-Phase1\organization\` (FAMILY_TAXONOMY_AUDIT, TRACEABILITY CSV, etc.)
- Mirrored copies under `eveenty-email-preview/catalog/`
- Backend templates readable under `D:\last\rescounts-backend\email\templates\` (59 `*.template` files; plus non-template asset `welcome_email_ad.png`)
