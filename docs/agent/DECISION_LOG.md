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

---

**[2026-09-26 - Pilot review findings resolved]**

- Verified from the read-only sender and production template that `festival_approval_status_changed` may render a non-empty `ReviewNote` independently of approved/rejected status.
- The approved-with-note preview state was retained, but its misleading request-for-changes fixture was replaced with informational completed-review copy. Preview note bidi behavior was aligned with production using `dir="auto"` and plaintext isolation.
- Updated the protected catalog validator from the stale 7/41 baseline to the named seven-reference plus six-pilot baseline (13/35), with strict preview, metadata, status, mapping and source checks.
- Fresh Level A regression and focused Arabic/Persian visual review **PASS**. Gmail, Outlook and Apple Mail **NOT RUN**.
- `organizer_announcement` remains **PASS** for HTML Preview QA and **BLOCKED** for production security migration; no backend remediation or exploitability test was authorized.

---

**[2026-09-26 - Six-template pilot owner approved; 13-design baseline]**

- The owner visually approved the six pilot HTML Preview designs: `password_reset`, `refund_receipt_user`, `festival_ticket_registration_reject`, `festival_approval_status_changed`, `contact_submission`, and `organizer_announcement`.
- Together with the seven previously approved references, the protected baseline is now **13 designed and owner-approved / 35 undesigned** within the verified 59 physical / 11 excluded / 48 Phase 1 inventory.
- `organizer_announcement` approval applies to **HTML Preview only**. Its production security migration remains **BLOCKED** pending separately authorized backend remediation; it is not production-ready.
- Gmail, Outlook, and Apple Mail testing remains **NOT RUN** for the approved baseline.

---

**[2026-09-26 - Exactly 20-template HTML Preview batch authorized and selected]**

- The owner authorized selecting and implementing exactly 20 of the 35 remaining undesigned templates, followed by focused QA and a stop for owner review.
- Selection is B3 Refund personas (2) + B5 Registration lifecycle (4) + B7 Workflow/status (8) + B2 Installments (6). Targeted catalog/traceability/backend checks confirmed **20 distinct `IN_SCOPE · UNDESIGNED` IDs** before implementation.
- Exact IDs, locale scopes, conditions, dependencies, and complexity are recorded in `docs/agent/NEXT_20_BATCH_SELECTION.md`.
- Scope remains HTML Preview only. The 20 may not be marked owner-approved automatically, and the final 15 remain unauthorized.

---

**[2026-09-27 - Exact 20-template batch implemented; Level A PASS; stopped for owner review]**

- Implemented the authorized B3 Refund (2) + B5 Registration (4) + B7 Workflow/status (8) + B2 Installments (6) selection without substitution or expansion.
- Updated catalog and traceability to the exact named **33 designed / 15 undesigned** state: the protected 13 remain owner-approved and the new 20 remain owner-review pending.
- Fresh batch QA **PASS** with zero failures: 325 structural renders, 175 responsive checks across 800/768/414/375/320, 20 long-content checks, 20 blocked-image checks, 24 RTL visual checks, 20 traceability checks, 8 financial reconciliation fixtures, and all approved contrast pairs.
- Closed focused implementation-review findings: financial reconciliation, approved-with-note coverage, independent dispute branches, RTL technical-value isolation, readable vendor item cards, raster image fixtures, exact locale metadata, and strict variant validation.
- Verified all 13 protected standalone HTML files remained byte-identical after regeneration.
- Gmail, Outlook, and Apple Mail remain **NOT RUN**. `organizer_announcement` production security migration and marketing approval state-changing GET flows remain **BLOCKED** separately.
- No backend, Figma, official Wallet artwork, owner logo, CDN, staging, commit, push, or deployment change occurred. The final 15 remain unauthorized. **STOPPED for owner review.**

---

**[2026-09-27 - Completed 20-template batch owner approved; 33-design protected baseline]**

- The owner visually approved all 20 HTML Preview designs in the completed batch. Together with the previous 13, the protected baseline is now **33 designed and owner-approved / 15 undesigned** within the verified 59 physical / 11 excluded / 48 Phase 1 inventory.
- Approval applies to HTML Preview design only. It does not mark any template production-ready and does not imply Gmail, Outlook or Apple Mail testing; all three remain **NOT RUN**.
- `organizer_announcement` production subject/HTML trust boundaries remain blocked. `festival_marketing_approval` and `festival_marketing_approval_sms` production state-changing unauthenticated GET approval links remain blocked. Separate backend authorization and remediation are still required.
- The 33 approved previews are protected from redesign or modification.

---

**[2026-09-27 - Exact eight-template batch selected, implemented and Level A PASS]**

- Confirmed exactly 15 remaining `IN_SCOPE · UNDESIGNED` records before selection, then locked B1 Sales receipts (5) + B9 Organizer campaign receipts (2) + B10 Marketing target (1).
- Exact IDs: `festival_add_on_sale`, `festival_activity_sale`, `festival_sponsor_sale`, `festival_sales`, `festival_vendor_sale`, `organizer_festival_marketing_email_receipt`, `organizer_festival_marketing_sms_receipt`, `festival_rescounts_marketing_email_target`.
- Verified all eight against targeted catalog, traceability, production template, locale and sender evidence before implementation. No ninth template was substituted or added.
- Implemented HTML Preview only using source-derived locales/conditions/personas, approved shared components, synthetic reconciled data, inert preview actions and explicit RTL/LTR handling.
- Fresh Level A QA **PASS** with zero failures: 126 structural renders, 65 responsive checks across 800/768/414/375/320, 8 long-content checks, 8 blocked-image checks, 12 RTL visual checks, 8 traceability checks, 5 financial fixtures and 4 condition assertions.
- Resulting state: **41 designed** = 33 owner-approved + 8 awaiting owner review; **7 undesigned**. The new eight are not owner-approved automatically. **STOPPED for owner review.**

---

**[2026-09-27 - Eight-template batch owner approved; final seven authorized]**

- The owner visually approved the eight HTML Preview designs: `festival_add_on_sale`, `festival_activity_sale`, `festival_sponsor_sale`, `festival_sales`, `festival_vendor_sale`, `organizer_festival_marketing_email_receipt`, `organizer_festival_marketing_sms_receipt`, and `festival_rescounts_marketing_email_target`.
- Together with the previous 33, they form the protected **41-template owner-approved HTML Preview baseline**. Approval does not authorize production deployment or close production security/Level B client-testing gates.
- The owner authorized exactly the final seven for HTML Preview: `marketing_package_sale`, `festival_payout`, `partner_coupons`, `partner_coupons_partner`, `bad_content_alert`, `book_demo_admin`, and `extra_service_request`.

---

**[2026-09-27 - Final seven implemented; Phase 1 design inventory complete]**

- Targeted catalog, traceability and read-only backend evidence matched the expected B4 + B6 + B8 list exactly. Before implementation, these were the only seven `IN_SCOPE · UNDESIGNED` records.
- Implemented only those seven HTML Preview designs using actual per-template locales, personas, conditions and actions. Preview links are inert; no Wallet functionality or attachment was invented.
- Fresh Level A QA **PASS** with zero failures: 16 structural renders, 35 responsive checks at 800/768/414/375/320, 7 long-content checks, 7 blocked-image checks, 4 RTL captures, 7 traceability checks, 4 financial fixtures and 4 conditional assertions.
- Resulting inventory: **59 physical / 11 excluded / 48 in scope / 48 designed / 0 undesigned**. Approval state: **41 owner-approved + 7 awaiting owner review**.
- Read-only review recorded production trust-boundary questions for dynamic HTML/header fields and submitted demo URLs; no exploitation is claimed and no backend change was authorized.
- Gmail, Outlook and Apple Mail remain **NOT RUN**. No backend, production template/YAML, Figma, official Wallet artwork, owner-logo, CDN, staging, commit, push or deployment change occurred. **STOPPED for final owner visual review.**
- Read-only security review confirmed `festival_rescounts_marketing_email_target` is parsed with Go `text/template` and inserts request/caller-derived body/media data into HTML/attributes. The preview escapes author content; production migration remains blocked pending separate trust-boundary review/remediation. Existing production blockers remain unchanged.
- Gmail, Outlook and Apple Mail remain **NOT RUN**. No backend, Figma, Wallet artwork, owner logo, CDN, staging, commit, push or deployment change occurred.

---

**[2026-09-27 - Final seven focused footer verification]**

- Owner-reported incomplete footer sentence `This message was sent to .` was diagnosed as a **render integration defect**: `final7-renderers.js` `shell()` called `brandedFooter({ dir })` without `email`, despite `SAMPLE.email` existing.
- Protected 41 HTML standalones: **0** incomplete footers. Final seven: all seven incomplete before fix; **0** after.
- Production read-only: only `marketing_package_sale` includes `footer_branded_both_dirs` (contact labels, localized via `BrandedFooter*` including **ar/fa**). That production footer is **not** the activate “sent to” sentence. Design Kit continues to use the approved activate-style `brandedFooter` component and now supplies synthetic `example.com` recipients.
- Corrected preview rendering only; regenerated seven standalones; fresh Level A desktop/mobile/RTL QA **PASS**. No invented translations, no production/YAML/Figma/commit changes. Final seven remain awaiting owner review.

---

**[2026-09-27 - Final seven owner visually approved; Phase 1 HTML Preview complete]**

- After the verified footer correction and Level A QA **PASS**, the owner visually approved all seven final HTML Preview designs: `marketing_package_sale`, `festival_payout`, `partner_coupons`, `partner_coupons_partner`, `bad_content_alert`, `book_demo_admin`, and `extra_service_request`.
- Final Phase 1 inventory: **59 physical / 11 excluded / 48 in scope / 48 designed / 48 owner visually approved / 0 remaining undesigned**.
- Approval applies to **HTML Preview designs only**. It does not assert production readiness, close Level B client testing, authorize CDN upload, or authorize production migration.
- Preserved production/security review requirements (not claimed as confirmed exploitable vulnerabilities): `organizer_announcement` subject/header and caller-supplied HTML trust boundaries; `festival_marketing_approval` / `festival_marketing_approval_sms` state-changing GET approval links; `festival_rescounts_marketing_email_target` caller-derived HTML/body/media boundaries; final-seven `text/template` HTML insertion, dynamic MIME header, and submitted demo URL trust-boundary observations.
- Real Gmail, Outlook and Apple Mail testing remain **NOT RUN**. No further design implementation is authorized without new explicit owner authorization.

---

**[2026-09-27 - organizer_announcement security observation: ownership/scope clarified]**

- Owner authorized a **documentation-only** update. No HTML, CSS, components, fixtures, preview output, catalog, backend, Figma, CDN, commit, push or remediation work was performed.
- **Issue:** `organizer_announcement` — existing backend subject/header and caller-supplied HTML trust-boundary observations (evidence: `qa-output/pilot-batch/PILOT_SECURITY_REVIEW.md`).
- **Origin:** Pre-existing production backend / email-generation pipeline behavior, discovered during Email Kit redesign review — **not** introduced by the new HTML Preview designs.
- **Ownership:** **Backend / Security**. Outside the authorized scope of the Email Kit design project. Investigation or remediation requires a separately authorized Backend/Security task.
- **Email Kit responsibility:** Document and hand off the observation only. Design impact: none currently identified. HTML Preview remains completed and owner visually approved.
- **Production security status:** **Unresolved**. Evidence identifies a **potential** trust-boundary issue, not a confirmed exploitable vulnerability. Do not describe as fixed or dismiss as harmless. Do not claim the template is security-cleared for production migration until Backend/Security resolves or formally accepts the finding.
- **Preserved separately (status unchanged at that time):** marketing approval state-changing GET links; marketing target HTML/body/media boundaries; final-seven production trust-boundary observations; Level B Gmail/Outlook/Apple Mail testing; CDN hosting and production integration. (Marketing approval ownership/scope clarified in the subsequent 2026-09-27 entry below; other preserved items remain unchanged.)
- Phase 1 inventory unchanged: **59 / 11 / 48 / 48 designed / 48 owner visually approved / 0 undesigned**.

---

**[2026-09-27 - Marketing Approval security observation: ownership/scope clarified]**

- Owner authorized a **documentation-only** update. No HTML, CSS, components, fixtures, preview output, catalog, backend, Figma, CDN, commit, push or remediation work was performed.
- **Consolidated work item:** Marketing Approval approval-link behavior — one Backend/Security item covering both Email and SMS marketing approval workflows.
- **Affected template IDs (preserve individually):** `festival_marketing_approval`, `festival_marketing_approval_sms`.
- **Observation:** Production approve/reject links may trigger state-changing operations through unauthenticated GET requests. Email-security scanners and link-prefetching systems may open these URLs automatically, potentially changing a campaign's approval status without an intentional administrator action.
- **Origin:** Pre-existing production backend behavior, identified while reviewing the existing production backend — **not** introduced by the new HTML Preview designs. Approved HTML Previews use inert `example.com` links and do not execute approval or rejection operations.
- **Ownership:** **Backend / Security**. Category: Pre-existing Backend / Security observations. Outside Email Kit design scope. Investigation or remediation requires a separately authorized Backend/Security task.
- **Email Kit responsibility:** Document and hand off only. Design status: **COMPLETE — owner visually approved** for both templates. Do not reopen visual approval or create additional design requirements solely because of these backend observations.
- **Production security status:** **Unresolved**. Documented production security concern — **not** a claim that exploitation has been confirmed. Do not describe as fixed or dismiss as harmless. Security clearance must be determined by Backend/Security before enabling the relevant production approval workflows. Production integration requires separate owner authorization.
- **Possible remediation (documented approach only — not an approved implementation task):** avoid state-changing GET; open a confirmation page from the email link; authenticate and authorize the administrator; execute via protected POST; consider CSRF, token validation, expiration and one-time-use semantics as appropriate; test link-scanning/prefetch before production release. Backend/Security must investigate the current implementation and select the appropriate solution.
- **Evidence preserved:** `qa-output/batch-20/BATCH_20_QA_REPORT.md`, `BATCH_20_IMPLEMENTATION_REPORT.md`, `BATCH_20_VISUAL_REVIEW.md`.
- **Preserved separately (status unchanged):** `organizer_announcement` subject/header and caller-supplied HTML observations; `festival_rescounts_marketing_email_target` HTML/body/media trust-boundary observations; final-seven text/template, MIME-header and submitted demo-URL observations; Level B Gmail/Outlook/Apple Mail testing; CDN hosting and production integration.
- Phase 1 inventory unchanged: **59 / 11 / 48 / 48 designed / 48 owner visually approved / 0 undesigned**.

