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
See `.agents/skills/email-rendering-compatibility/SKILL.md` for packaged token values.

**Token cross-check note (this session):** `shared/tokens.js` agrees on primary `#e9d023`, branded header `#fefdf4`, heading `#2b2a28`, body `#4d4c49`, border `#ebebeb`, container max 600. Differences observed vs skill text: muted (`tokens.js` `#7b7b79` / skill `#898988`) and success text (`tokens.js` successBody `#629a77` / skill `#166534`). Treat skill values as **needs owner/Figma confirmation** before design work — do not silently change either file in this infra-only task.

## Current active task
AI infrastructure install + validation only. No email design task is in progress.

## Known blockers
- No `package.json` wiring for `email:*` scripts (intentional — infra-only; use `node .agents/scripts/email-cli.mjs …`).
- No Playwright/`*.spec` suite in this repo; `email:qa` reports preview/screenshot artifact evidence only.
- Cursor project-skill auto-discovery of `.agents/skills/` vs need for `.cursor/skills/` adapter: filesystem present; live Rules UI / skill picker confirmation is operator-side.
- Figma files and live SMTP/client Level B QA not accessed this session.

## Canonical audit artifact locations (verified readable)
- `D:\emails\Eveenty-Email-Kit-Phase1\organization\` (FAMILY_TAXONOMY_AUDIT, TRACEABILITY CSV, etc.)
- Mirrored copies under `eveenty-email-preview/catalog/`
- Backend templates readable under `D:\last\rescounts-backend\email\templates\` (59 `*.template` files; plus non-template asset `welcome_email_ad.png`)
