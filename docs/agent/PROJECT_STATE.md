# PROJECT_STATE — Eveenty Email Design Kit

> Inventory verified 2026-09-25 against `catalog/email-catalog.json` and `catalog/EMAIL_TEMPLATE_TRACEABILITY.csv` via `node .agents/scripts/email-cli.mjs validate-catalog`.

## Inventory (verified against live catalog)
| Fact | Value | Verified this session? |
|---|---|---|
| Physical templates | 59 | Yes — `emails.length` + unique ids + CSV 59 data rows |
| Excluded from Phase 1 | 11 | Yes — `scope === EXCLUDED` |
| In Phase 1 scope | 48 | Yes — `scope === IN_SCOPE` |
| Backend families | Auth/Simple 2 / Financial/Receipt 20 / Ticket/Pass 8 / Workflow/Status 15 / Internal/Operational 7 / Campaign/Announcement 7 | Yes — counted from catalog |
| Design Kit families (in-scope only) | Transactional 2 / Commerce 26 / Notification 17 / Marketing 3 | Yes — counted from IN_SCOPE rows |
| Designed references | 7 (list below) | Yes |
| Undesigned in-scope | 41 | Yes |

## Seven completed reference designs
`activate_email`, `festival_donation`, `festival_ticket_sale`, `festival_ticket_registration_approval`, `support`, `dispute_notification`, `festival_marketing_email_target`

Catalog status for all seven: `DESIGNED`, `preview_selectable: true`, preview HTML present under `emails/`.

**Owner visual status:** conditional owner visual approval (components/system accepted for reuse; not a blanket “ship all seven unchecked”).

**Final technical gate (required before any of the remaining 41):** **NOT PASSED** as of 2026-09-25. Must still:
1. Verify Cards/Typography consistency across the seven references.
2. Resolve or accurately report the Wallet badge sizing issue at 320px (do not treat earlier Chromium PASS alone as this gate).

Historical QA (browser packs, Figma/preview parity, production mapping) is **evidence only** — not a fresh gate pass. Discarded screenshot sets must **not** be regenerated as a rollout prerequisite.

## Remaining Phase 1 scope (41)
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
Agent infrastructure aligned with final owner decisions (docs/skills/rules). **Next work:** run and record the seven-email final technical gate. Do **not** start the remaining 41 until that gate is recorded **PASS** here.

## Known blockers
- Seven-email final technical gate — **open** (Cards/Typography + Wallet 320px report/resolve).
- Production CDN upload of `assets/wallet/official/**` — **not authorized**.
- No `package.json` wiring for `email:*` scripts (intentional — use `node .agents/scripts/email-cli.mjs …`).
- Level B real email-client QA — not executed.
- Marking any template fully `OWNER VISUAL APPROVED` / production deploy — requires separate explicit owner authorization.

## Canonical audit artifact locations (verified readable)
- `D:\emails\Eveenty-Email-Kit-Phase1\organization\` (FAMILY_TAXONOMY_AUDIT, TRACEABILITY CSV, etc.)
- Mirrored copies under `eveenty-email-preview/catalog/`
- Backend templates readable under `D:\last\rescounts-backend\email\templates\` (59 `*.template` files; plus non-template asset `welcome_email_ad.png`)
