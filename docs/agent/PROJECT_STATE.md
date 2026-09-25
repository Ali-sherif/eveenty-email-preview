# PROJECT_STATE — Eveenty Email Design Kit

> Local install session (2026-09-25): inventory counts below were re-checked against `catalog/email-catalog.json` and `catalog/EMAIL_TEMPLATE_TRACEABILITY.csv`. Status column reflects that verification.

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

Catalog status for all seven: `DESIGNED`, `preview_selectable: true`, preview HTML present under `emails/`. Historical reported QA (browser 87/87, Figma/preview parity, production mapping) was **not** re-executed this session. Owner visual approval remains **pending** (reported).

## Notable single items
- `organizer_announcement` — Phase 1 scope, Marketing / Campaign-Announcement, **IN_SCOPE · UNDESIGNED** (catalog + CSV row confirmed).

## Approved design standards
See `.agents/skills/email-rendering-compatibility/SKILL.md` and `shared/tokens.js` (aligned 2026-09-25 owner-approved corrections).

**Implemented email kit values (verified in tokens + HTML this session):** primary CTA `#e9d023` / `#4d4c49` (DS Large pad 13×24, Medium 500); branded header `#fefdf4`; heading `#2b2a28`; body/meaningful muted `#4d4c49`; border `#ebebeb`; success text `#166534` on `#f0fdf4`; warning `#92400e` on `#fffbeb` border `#e6d1b9`; error title `#991b1b` / body `#4d4c49` on `#fef2f2`; container max 600; logo 160px.

## Current active task
OD-W1 option B — official multilingual Wallet badges in Design Kit `festival_ticket_sale` HTML — **implemented**. Awaiting owner visual review + CDN deploy authorization. See `docs/agent/HANDOFF.md` and `qa-output/approved-component-corrections/OFFICIAL_MULTILINGUAL_WALLET_BADGES.md`.

## Known blockers
- Production CDN upload of `assets/wallet/official/**` (and optional backend locale URL wiring) — **not authorized yet**.
- No `package.json` wiring for `email:*` scripts (intentional — use `node .agents/scripts/email-cli.mjs …`).
- Level B real email-client QA not executed.
- Owner visual approval pending.
## Canonical audit artifact locations (verified readable)
- `D:\emails\Eveenty-Email-Kit-Phase1\organization\` (FAMILY_TAXONOMY_AUDIT, TRACEABILITY CSV, etc.)
- Mirrored copies under `eveenty-email-preview/catalog/`
- Backend templates readable under `D:\last\rescounts-backend\email\templates\` (59 `*.template` files; plus non-template asset `welcome_email_ad.png`)
