# DECISION_LOG ù Eveenty Email Design Kit

Append-only. Each entry: date, decision, who/what authorized it, source.

---

**[Backfilled ù dates unknown, carried from task brief, needs owner confirmation of dates]**

- Restored `organizer_announcement` to Phase 1 scope (Marketing / Campaign-Announcement family), in scope but not yet designed.
- Approved baseline: 59 physical templates / 11 excluded / 48 in Phase 1 scope.
- Confirmed the four Design Kit families (Transactional/Commerce/Notification/Marketing) and six backend families (Auth/Financial/Ticket/Workflow/Internal/Campaign) are **separate classification systems** ù not to be merged or replaced with a new taxonomy.
- Approved design tokens set (colors, heading weight, logo width, fluid-hybrid 600px max layout) ù see `email-rendering-compatibility` skill for current values.
- Owner visual approval is a distinct, required gate ù browser QA pass and Figma/preview parity pass do **not** imply owner approval.
- No production backend/template/YAML changes are authorized without separate, explicit scope authorization.

---

**[This session ù package generation, pre-local]**

- Built the AI agent infrastructure package only (AGENTS.md, CLAUDE.md, skills, docs/agent scaffold) ù no local repo access in that environment. See prior HANDOFF placeholder history.

---

**[2026-09-25 ù local install in `eveenty-email-preview`]**

- Installed infra from `D:\last\eveenty-agent-infra.zip` into the preview repo without overwriting existing `docs/*.md` or any application files.
- Independently verified catalog inventory **59 / 11 / 48**, backend families **2/20/8/15/7/7**, Design Kit in-scope **2/26/17/3**, designed **7** / undesigned **41**, and `organizer_announcement` IN_SCOPE ù UNDESIGNED ù MARKETING.
- Implemented deterministic CLI at `.agents/scripts/email-cli.mjs` only; **did not** modify `package.json`.
- Recorded token text deltas between `email-rendering-compatibility` skill and `shared/tokens.js` (muted / success) as needs owner/Figma confirmation ù neither file changed for that reason.
- No email design, production, commit, push, or deploy authorized or performed.

---

**[2026-09-25 ù Design System foundations audit (read-only)]**

- Live-verified DS Priority 1 pages via Figma MCP; compared to Email Kit Activation [`4:2`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2) and local previews. **No** Figma/HTML edits.
- Confirmed DS Buttons Primary L [`354:6282`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=354-6282): fill `#E9D023`, text `#4D4C49`, 48px H, pad 24ù13, radius 12, Roboto Medium 16/1.4. Magenta peer L [`355:661`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=355-661): `#D80073` / white, same geometry.
- Email Kit CTA [`4:14`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-14) + HTML: yellow + Dark-500, pad **40ù16**, Roboto **Bold** 16 ù **intentional email adaptation** vs DS L (not a silent match).
- Open owner conflicts re-confirmed: (1) yellow vs magenta email primary CTA; (2) `primary-50` paint-style `#FCF9DF` vs variable/control-panel/email `#FEFDF4`; (3) muted `Dark-50` `#898988` (skill) vs `Dark-200` `#7B7B79` (`tokens.js`); (4) success **heading** `#166534` vs success **body** `#629A77` (both exist on DS alert [`410:10787`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=410-10787); skill vs tokens map different roles); (5) logo display width 160 (current Kit+HTML) vs older Task 01 ~200 note.

---

**[2026-09-25 ù Owner-approved component corrections implemented]**

- Owner authorized implementation of: DS Large primary CTA; Warning/Error/Success AA-safe alert colors; shared Status Alert; Dark-500 for meaningful muted; divider `#EBEBEB`; header `#FEFDF4` / logo 160; Event Info yellow accent/text removal on dispute.
- Implemented in `shared/tokens.js`, `shared/email-kit.js`, `shared/render-emails.js`, regenerated seven `emails/*.html`, and synced Email Kit Figma frames (`yz7YggnG4H2RuUd23f9zPk`). Original DS **not** edited.
- Closed prior conflicts for this kit scope: yellow primary CTA = DS Large; success meaningful text `#166534`; warning/error bodies use AA tokens not DS lighter bodies; meaningful muted uses Dark-500.
- **BLOCKED:** ~~official Apple/Google Wallet badge assets~~ ? **RESOLVED 2026-09-25** via production CDN `google_wallet.png` / `apple_wallet.png` (see `qa-output/approved-component-corrections/WALLET_ASSET_VERIFICATION.md`). Wallet item **PASS**.
- **Pending:** owner visual approval of corrected seven references. No Phase F / 41-template rollout. No production/backend changes. No commit/push.
- QA pack: `qa-output/approved-component-corrections/`.

---

**[2026-09-25 ù Wallet badges resolved via production CDN]**

- Verified `festival_ticket_sale.template` Wallet conditionals, CDN URLs, pkpass + `event.ics` attachments, calendar text links (read-only backend).
- Reused `https://cdn.eveenty.com/google_wallet.png` and `apple_wallet.png` (335ù48) in Email Kit HTML + Figma Wallet Links component. Calendar remains text-only.
- Focused Chromium QA: **PASS**. Wallet item marked **PASS** in correction matrix. Backend/production/Original DS unchanged.
---

**[2026-09-25 ù Wallet custom buttons restored; logo-in-button blocked by guidelines]**

- Owner revoked CDN full-image-as-button. Restored original magenta custom text Wallet buttons in HTML + Figma `18:27`.
- Apple/Google guidelines prohibit logo-inside-custom-button and DIY badges ? **NEEDS OWNER DECISION** (options A/B/C in `WALLET_BRAND_COMPLIANCE.md`).
- Official brand-kit packs remain download-BLOCKED without provider auth; comparison shows labeled production CDN complete badges as alternative visuals only.
- Focused QA **PASS**. Backend/production/Original DS unchanged.

---

**[2026-09-25 ù OD-W1 option B: official multilingual Wallet badges (HTML only)]**

- Owner authorized complete official Apple/Google badges for `festival_ticket_sale` only (not custom CSS; not yellow CDN). Figma explicitly out of scope this session.
- Downloaded brand kits inspected: Google PNG `wallet-button` for en/ar/fr/es/fa; Apple SVG/EPS for AR/US_UK/FR/ES ù **no Persian Apple badge** ? English official fallback.
- Assets prepared under `assets/wallet/official/`; `walletActionButtons` locale-aware `<img>` badges; calendar text links + buyer/guest/organizer conditionals preserved.
- Chromium responsive/RTL QA **PASS** (30 captures). Gmail/Outlook/Apple Mail **NOT RUN**. CDN upload + backend change **NOT DONE** (need separate auth).
- Report: `qa-output/approved-component-corrections/OFFICIAL_MULTILINGUAL_WALLET_BADGES.md`.

---

**[2026-09-25 ù Official Wallet badge sizing fix (48px height)]**

- Owner requested visual consistency: Google looked shorter than Apple because both were forced to **180px width**.
- Switched `walletActionButtons` to shared **display height 48px** (Google min 48 dp; Apple onscreen min 40 px), widths from intrinsic aspect ratio; ?16px gap; stack ?620px; Outlook width/height attrs; no artwork edits.
- Clear space: Google 8 dp / Apple 0.1ù height ù kit gap 16px satisfies both.
- Regenerated `emails/festival_ticket_sale.html` only. Other six emails, Figma, backend, badge PNGs unchanged.
- Chromium QA **PASS** (30 captures, 0 structural / 0 overflow). At 320px, longer Google locales fluid-shrink slightly (~43ù45px) when column < badge width ù aspect preserved, no stretch.
- Report: `qa-output/approved-component-corrections/WALLET_BADGE_SIZING_FIX.md`.

---

**[2026-09-25 ó Wallet 320px: official condensed Google to keep 48px min]**

- Primary `wallet-button` widths @48px (en 272 / ar 300 / fr 304 / es 286 / fa 296). At 320px even with outer pad 0 + stack-pad cancelled + 8dp clear, max usable ?302px ? **FR primary cannot fit compliantly**.
- Official pack includes condensed `add-wallet-badge` (en/ar/fr/es ~174◊48, fa 186◊48). Google guidelines: use condensed when space is limited.
- Implemented dual assets: primary ?768; condensed ?620 via CSS. Pinned 48px (no fluid shrink). Wallet-section padding maximize.
- QA: **PASS**, `heightFailCount: 0` for all five locales at 320. Blocked-image cases re-run.
- Assets under `assets/wallet/official/google/condensed/`. CDN upload still owner-gated (now +5 condensed files).
