# DECISION_LOG ? Eveenty Email Design Kit

Append-only. Each entry: date, decision, who/what authorized it, source.

---

**[Backfilled ? dates unknown, carried from task brief, needs owner confirmation of dates]**

- Restored `organizer_announcement` to Phase 1 scope (Marketing / Campaign-Announcement family), in scope but not yet designed.
- Approved baseline: 59 physical templates / 11 excluded / 48 in Phase 1 scope.
- Confirmed the four Design Kit families (Transactional/Commerce/Notification/Marketing) and six backend families (Auth/Financial/Ticket/Workflow/Internal/Campaign) are **separate classification systems** ? not to be merged or replaced with a new taxonomy.
- Approved design tokens set (colors, heading weight, logo width, fluid-hybrid 600px max layout) ? see `email-rendering-compatibility` skill for current values.
- Owner visual approval is a distinct, required gate ? browser QA pass and Figma/preview parity pass do **not** imply owner approval.
- No production backend/template/YAML changes are authorized without separate, explicit scope authorization.

---

**[This session ? package generation, pre-local]**

- Built the AI agent infrastructure package only (AGENTS.md, CLAUDE.md, skills, docs/agent scaffold) ? no local repo access in that environment. See prior HANDOFF placeholder history.

---

**[2026-09-25 ? local install in `eveenty-email-preview`]**

- Installed infra from `D:\last\eveenty-agent-infra.zip` into the preview repo without overwriting existing `docs/*.md` or any application files.
- Independently verified catalog inventory **59 / 11 / 48**, backend families **2/20/8/15/7/7**, Design Kit in-scope **2/26/17/3**, designed **7** / undesigned **41**, and `organizer_announcement` IN_SCOPE ? UNDESIGNED ? MARKETING.
- Implemented deterministic CLI at `.agents/scripts/email-cli.mjs` only; **did not** modify `package.json`.
- Recorded token text deltas between `email-rendering-compatibility` skill and `shared/tokens.js` (muted / success) as needs owner/Figma confirmation ? neither file changed for that reason.
- No email design, production, commit, push, or deploy authorized or performed.

---

**[2026-09-25 ? Design System foundations audit (read-only)]**

- Live-verified DS Priority 1 pages via Figma MCP; compared to Email Kit Activation [`4:2`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2) and local previews. **No** Figma/HTML edits.
- Confirmed DS Buttons Primary L [`354:6282`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=354-6282): fill `#E9D023`, text `#4D4C49`, 48px H, pad 24?13, radius 12, Roboto Medium 16/1.4. Magenta peer L [`355:661`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=355-661): `#D80073` / white, same geometry.
- Email Kit CTA [`4:14`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-14) + HTML: yellow + Dark-500, pad **40?16**, Roboto **Bold** 16 ? **intentional email adaptation** vs DS L (not a silent match).
- Open owner conflicts re-confirmed: (1) yellow vs magenta email primary CTA; (2) `primary-50` paint-style `#FCF9DF` vs variable/control-panel/email `#FEFDF4`; (3) muted `Dark-50` `#898988` (skill) vs `Dark-200` `#7B7B79` (`tokens.js`); (4) success **heading** `#166534` vs success **body** `#629A77` (both exist on DS alert [`410:10787`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=410-10787); skill vs tokens map different roles); (5) logo display width 160 (current Kit+HTML) vs older Task 01 ~200 note.

---

**[2026-09-25 ? Owner-approved component corrections implemented]**

- Owner authorized implementation of: DS Large primary CTA; Warning/Error/Success AA-safe alert colors; shared Status Alert; Dark-500 for meaningful muted; divider `#EBEBEB`; header `#FEFDF4` / logo 160; Event Info yellow accent/text removal on dispute.
- Implemented in `shared/tokens.js`, `shared/email-kit.js`, `shared/render-emails.js`, regenerated seven `emails/*.html`, and synced Email Kit Figma frames (`yz7YggnG4H2RuUd23f9zPk`). Original DS **not** edited.
- Closed prior conflicts for this kit scope: yellow primary CTA = DS Large; success meaningful text `#166534`; warning/error bodies use AA tokens not DS lighter bodies; meaningful muted uses Dark-500.
- **BLOCKED:** ~~official Apple/Google Wallet badge assets~~ ? **RESOLVED 2026-09-25** via production CDN `google_wallet.png` / `apple_wallet.png` (see `qa-output/approved-component-corrections/WALLET_ASSET_VERIFICATION.md`). Wallet item **PASS**.
- **Pending:** owner visual approval of corrected seven references. No Phase F / 41-template rollout. No production/backend changes. No commit/push.
- QA pack: `qa-output/approved-component-corrections/`.

---

**[2026-09-25 ? Wallet badges resolved via production CDN]**

- Verified `festival_ticket_sale.template` Wallet conditionals, CDN URLs, pkpass + `event.ics` attachments, calendar text links (read-only backend).
- Reused `https://cdn.eveenty.com/google_wallet.png` and `apple_wallet.png` (335?48) in Email Kit HTML + Figma Wallet Links component. Calendar remains text-only.
- Focused Chromium QA: **PASS**. Wallet item marked **PASS** in correction matrix. Backend/production/Original DS unchanged.
---

**[2026-09-25 ? Wallet custom buttons restored; logo-in-button blocked by guidelines]**

- Owner revoked CDN full-image-as-button. Restored original magenta custom text Wallet buttons in HTML + Figma `18:27`.
- Apple/Google guidelines prohibit logo-inside-custom-button and DIY badges ? **NEEDS OWNER DECISION** (options A/B/C in `WALLET_BRAND_COMPLIANCE.md`).
- Official brand-kit packs remain download-BLOCKED without provider auth; comparison shows labeled production CDN complete badges as alternative visuals only.
- Focused QA **PASS**. Backend/production/Original DS unchanged.

---

**[2026-09-25 ? OD-W1 option B: official multilingual Wallet badges (HTML only)]**

- Owner authorized complete official Apple/Google badges for `festival_ticket_sale` only (not custom CSS; not yellow CDN). Figma explicitly out of scope this session.
- Downloaded brand kits inspected: Google PNG `wallet-button` for en/ar/fr/es/fa; Apple SVG/EPS for AR/US_UK/FR/ES ? **no Persian Apple badge** ? English official fallback.
- Assets prepared under `assets/wallet/official/`; `walletActionButtons` locale-aware `<img>` badges; calendar text links + buyer/guest/organizer conditionals preserved.
- Chromium responsive/RTL QA **PASS** (30 captures). Gmail/Outlook/Apple Mail **NOT RUN**. CDN upload + backend change **NOT DONE** (need separate auth).
- Report: `qa-output/approved-component-corrections/OFFICIAL_MULTILINGUAL_WALLET_BADGES.md`.

---

**[2026-09-25 ? Official Wallet badge sizing fix (48px height)]**

- Owner requested visual consistency: Google looked shorter than Apple because both were forced to **180px width**.
- Switched `walletActionButtons` to shared **display height 48px** (Google min 48 dp; Apple onscreen min 40 px), widths from intrinsic aspect ratio; ?16px gap; stack ?620px; Outlook width/height attrs; no artwork edits.
- Clear space: Google 8 dp / Apple 0.1? height ? kit gap 16px satisfies both.
- Regenerated `emails/festival_ticket_sale.html` only. Other six emails, Figma, backend, badge PNGs unchanged.
- Chromium QA **PASS** (30 captures, 0 structural / 0 overflow). At 320px, longer Google locales fluid-shrink slightly (~43?45px) when column < badge width ? aspect preserved, no stretch.
- Report: `qa-output/approved-component-corrections/WALLET_BADGE_SIZING_FIX.md`.

---

**[2026-09-25 ? Wallet 320px: official condensed Google to keep 48px min]**

- Primary `wallet-button` widths @48px (en 272 / ar 300 / fr 304 / es 286 / fa 296). At 320px even with outer pad 0 + stack-pad cancelled + 8dp clear, max usable ?302px ? **FR primary cannot fit compliantly**.
- Official pack includes condensed `add-wallet-badge` (en/ar/fr/es ~174?48, fa 186?48). Google guidelines: use condensed when space is limited.
- Implemented dual assets: primary ?768; condensed ?620 via CSS. Pinned 48px (no fluid shrink). Wallet-section padding maximize.
- QA: **PASS**, `heightFailCount: 0` for all five locales at 320. Blocked-image cases re-run.
- Assets under `assets/wallet/official/google/condensed/`. CDN upload still owner-gated (now +5 condensed files).

---

**[2026-09-25 ? Final official Wallet badge alignment]**

- Owner requested final desktop/mobile alignment while keeping each provider?s original badge shape (Google pill / Apple rounded-rect).
- Root cause of desktop misalignment: ~9px midY delta from dual Google link siblings + anonymous text strut. Fixed via `font-size:0` cells, hide unused *link wrappers*, valign middle.
- Mobile stack/center gap measured **16px**; all locales **48?** at 800/768/414/375/320; condensed Google on narrow.
- Report updated with **measured** Chromium dimensions: `WALLET_BADGE_SIZING_FIX.md`. Minimal screenshots only. No Figma/backend/artwork/other-email changes. No commit.

---

**[2026-09-25 ? Final owner decisions before remaining-email rollout (agent infra alignment)]**

Authorized as standing policy for the next phase (recorded from owner task brief; supersedes conflicting older skill/doc defaults where they disagreed):

1. **Remaining 41 deliverable = HTML Preview only.** No Figma changes for undesigned templates unless the owner separately authorizes a specific Figma edit. Email Kit / Original DS Figma remain non-production; Original DS stays read-only.
2. **Languages:** use only locales actually supported by each original backend template (catalog/traceability + production). Do not force five languages onto every email. The five prepared Wallet badge locales (en/ar/fr/es/fa) are Wallet artwork coverage for ticket-sale-style previews, not a global locale matrix.
3. **Seven references:** conditional owner visual approval of the approved component system. **Final technical gate** (Cards/Typography consistency + resolve-or-accurately-report Wallet badge sizing at 320px) must **PASS** before implementing any of the remaining 41. Earlier Chromium tests alone do **not** close this gate.
4. **Design reuse:** Primary CTA, header/localized logos, Warning/Error/Success alerts, accessible muted-text (meaningful muted = Dark-500 `#4D4C49`), dividers/shared components, approved typography adaptations ? via existing `shared/tokens.js` / `shared/email-kit.js`, not by re-embedding the full DS into every skill.
5. **Wallet:** official Apple/Google badges from `assets/wallet/official/` only; preserve provider shapes; do not edit artwork; do not reintroduce custom CSS Wallet buttons or yellow Eveenty CDN badge images.
6. **Inventory:** 59 / 11 excluded / 48 Phase 1 / 7 designed / 41 undesigned ? verified catalog is source of truth.
7. **Backend:** read-only. **Production:** no CDN upload, commit, push, or deployment without separate explicit authorization.
8. **QA:** do not treat historical QA as fresh; do not require regenerating discarded screenshot sets as a rollout prerequisite.

Agent skills/rules/docs were updated only where stale or contradictory; no new skills created. See `docs/agent/AGENT_INFRASTRUCTURE_READINESS.md`.

---

**[2026-09-26 ? Final technical gate: seven approved emails PASS]**

- Executed fresh Level A Wallet measurement (`capture-wallet-official-qa.mjs`): en/ar/fr/es/fa ? 800/768/414/375/320 ? all badges **48px**, condensed Google ?620, gap 16, no overflow, desktop mid? 0.
- Cards/Typography audit vs approved tokens/adaptations: **0 FAIL**. Regenerated six standalone HTMLs for shared-shell CSS sync only (`outer-pad:0` / wallet MQ); no content-token edits; no shared JS/token changes; no Figma/backend/artwork.
- Regression: catalog + 7? validate-template + overflow/RTL/blocked-image ? **PASS**. Gmail/Outlook/Apple Mail **NOT RUN**.
- Gate report: `qa-output/approved-component-corrections/FINAL_SEVEN_TECHNICAL_GATE.md`. `PROJECT_STATE.md` gate status ? **PASS**.
- Remaining 41 still **not authorized**. CDN / OD-2 / Level B remain separate owner items.

---

**[2026-09-26 - OD-2 CLOSED - OWNER APPROVED: Option A]**

- Owner approved **Option A**: keep Original Eveenty Design System alert borders - Warning `#E6D1B9`, Error `#E9C5C6`.
- Borders are **decorative**. Alert status must remain understandable via accessible text, headings, and icons without relying on border contrast alone.
- **Do not** strengthen or change those border colors. No HTML / Figma / backend / token changes required (current kit already uses these hexes).
- OD-2 status: **CLOSED - OWNER APPROVED**.

---

**[2026-09-26 - Remaining-email rollout pilot authorized and completed]**

- Owner authorized planning all 41 originally undesigned templates and implementing only a diverse pilot of 4–6, HTML Preview only, then stopping for review.
- Selected and implemented six: `password_reset`, `refund_receipt_user`, `festival_ticket_registration_reject`, `festival_approval_status_changed`, `contact_submission`, `organizer_announcement`.
- Pilot deliberately covers all six backend families and all four Design Kit families while reusing existing approved components; no new component decision was introduced.
- Fresh Level A QA: 57 locale/variant structural renders, 46 responsive checks (including 16 RTL and six long-content stress checks), 12 screenshots, and approved contrast pairs — **PASS**.
- Catalog status is now 13 designed / 35 undesigned. Pilot designs remain owner-review pending; no owner visual approval, production migration, Figma work, backend change, commit, push, deploy or CDN upload occurred.
- Read-only security review recorded two `organizer_announcement` production-boundary findings; no backend fix was authorized.
