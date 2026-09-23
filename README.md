# Eveenty Email Preview — Phase 1 (DRAFT)

Local, standalone HTML implementations of the five active Eveenty **reference** email designs, plus a browser preview app for owner visual review.

**Status:** DRAFT / AWAITING APPROVAL — not production migration, not SMTP integration, not formal QA.

Figma: [Eveenty Email Design Kit](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit)

## References implemented

| # | Family | Template | Master | Figma |
|---|--------|----------|--------|-------|
| 1 | Auth / Simple | `activate_email` | TRANSACTIONAL | 4:2 |
| 2 | Financial / Receipt | `festival_donation` | COMMERCE | 21:2 |
| 3 | Ticket / Pass | `festival_ticket_sale` | COMMERCE | 21:53 |
| 4 | Workflow / Status | `festival_ticket_registration_approval` | COMMERCE / Ticket-Pass | 48:45 |
| 5 | Internal / Operational | `support` | NOTIFICATION | 22:113 |

`organizer_announcement.template` is **excluded**.

## Email container width

**Chosen strategy: Fluid Hybrid 600**

- Figma desktop frames are **800px** design canvases (with side padding).
- Every reference labels the content shell as **“Container / 600 max”** and notes **Fluid Hybrid 600**.
- Standalone HTML uses `max-width: 600px` centered table, fluid down to 320px via media queries.
- Preview viewport presets include 800 / 768 / 414 / 375 / 320 plus a 600 “email width” mode.

See [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md).

## Run the preview

Requires a local static server (ES modules + `srcdoc` asset URLs). From this directory:

```bash
npm start

# or
npx --yes serve -p 4173 .
python -m http.server 4173
```

Open: http://localhost:4173/

## Deploy (Vercel)

Static site — no build step. Connect the GitHub repo in Vercel:

- **Framework Preset:** Other
- **Build Command:** leave empty
- **Output Directory:** `.` (project root)

Or: `npx vercel --prod` after `vercel login`.

### Preview features

- Selector for all five references
- Viewport presets: 800, 768, 600, 414, 375, 320
- Locale + RTL/LTR where source/locales exist (Support = EN-only)
- Sample-data variants (donator vs organizer, buyer vs guest, CTA on/off, long support details)
- Blocked-images simulation (alt/dimension fallbacks)
- Long-content mode
- Inspect HTML source + download standalone HTML
- Email document rendered in a sandboxed iframe (`srcdoc`) — preview JS is never injected into the email

### Regenerate baked EN standalone files

```bash
node generate-standalone.mjs
```

Outputs land in `emails/*.html` with `../assets/` paths.

## Safety

- Does **not** modify production templates, SMTP, or senders
- Does **not** send mail
- QR / Wallet use **SAMPLE** fixtures and example.com links — no live passes or credentials
- Support long-content uses sanitized synthetic stack text
- Does **not** edit the Figma file
- Does **not** claim Gmail/Outlook/Apple Mail client parity from browser screenshots alone
- Designs remain **DRAFT / not APPROVED**

## Docs

- [SOURCE_PARITY.md](docs/SOURCE_PARITY.md) — field checklists
- [VISUAL_DEVIATION_LOG.md](docs/VISUAL_DEVIATION_LOG.md) — Figma vs HTML
- [COMPATIBILITY.md](docs/COMPATIBILITY.md) — width + email-safe CSS strategy
- [BLOCKERS.md](docs/BLOCKERS.md) — unresolved items
- [screenshots/](screenshots/) — desktop + mobile captures for review
