# PROJECT_STATE — Eveenty Email Design Kit

> Inventory verified 2026-09-27 against `catalog/email-catalog.json`, `catalog/EMAIL_TEMPLATE_TRACEABILITY.csv`, the catalog validator, and final-seven QA evidence (including focused footer verification).

## Inventory (verified against live catalog)
| Fact | Value | Verified this session? |
|---|---|---|
| Physical templates | 59 | Yes — `emails.length` + unique ids + CSV 59 data rows |
| Excluded from Phase 1 | 11 | Yes — `scope === EXCLUDED` |
| In Phase 1 scope | 48 | Yes — `scope === IN_SCOPE` |
| Backend families | Auth/Simple 2 / Financial/Receipt 20 / Ticket/Pass 8 / Workflow/Status 15 / Internal/Operational 7 / Campaign/Announcement 7 | Yes — counted from catalog |
| Design Kit families (in-scope only) | Transactional 2 / Commerce 26 / Notification 17 / Marketing 3 | Yes — counted from IN_SCOPE rows |
| Designed (HTML Preview) | 48 | Yes — all IN_SCOPE records `DESIGNED` with readable previews |
| Owner-approved HTML Preview designs | 48 | Yes — explicit owner visual approval of final seven recorded 2026-09-27 (after prior 41) |
| Remaining undesigned in-scope | 0 | Yes |
| Real Gmail / Outlook / Apple Mail testing | NOT RUN | Yes |

## Phase 1 HTML Preview — COMPLETE

All 48 in-scope Phase 1 templates now have HTML Preview designs with **explicit owner visual approval**.

No further design implementation is authorized. Production security review, actual email-client testing, CDN hosting and production migration remain separate future work requiring explicit owner authorization.

## Seven original reference designs
`activate_email`, `festival_donation`, `festival_ticket_sale`, `festival_ticket_registration_approval`, `support`, `dispute_notification`, `festival_marketing_email_target`

Catalog status for all seven: `DESIGNED`, `preview_selectable: true`, preview HTML present under `emails/`.

**Owner visual status:** owner visually approved as part of the Phase 1 HTML Preview baseline (conditional component-system acceptance earlier; full baseline now closed with the final seven).

**Final technical gate (historical prerequisite before remaining-email work):** **PASS** as of 2026-09-26. Evidence: `qa-output/approved-component-corrections/FINAL_SEVEN_TECHNICAL_GATE.md`.

Verified this gate session:
1. Cards/Typography consistency against approved tokens/adaptations — **PASS** (CSS shell synced on six standalones; no approved-token FAIL).
2. Wallet badge sizing at 320px — **PASS** (fresh Chromium measures; official condensed Google ≤620px; heightFailCount 0).

Historical QA remains **evidence only** for older work. Level B (Gmail/Outlook/Apple Mail) **NOT RUN**.

## Protected owner-approved baseline (all 48)

Composition of the 48 owner-approved HTML Preview designs:

1. **Seven original references** (above).
2. **Six-template pilot:** `password_reset`, `refund_receipt_user`, `festival_ticket_registration_reject`, `festival_approval_status_changed`, `contact_submission`, `organizer_announcement`. Evidence: `qa-output/pilot-batch/`.
3. **20-template batch** (exact B3 + B5 + B7 + B2 in `docs/agent/NEXT_20_BATCH_SELECTION.md`). Evidence: `qa-output/batch-20/`.
4. **Eight-template batch** (exact B1 + B9 + B10 in `docs/agent/NEXT_8_BATCH_SELECTION.md`): `festival_add_on_sale`, `festival_activity_sale`, `festival_sponsor_sale`, `festival_sales`, `festival_vendor_sale`, `organizer_festival_marketing_email_receipt`, `organizer_festival_marketing_sms_receipt`, `festival_rescounts_marketing_email_target`. Evidence: `qa-output/batch-8/`.
5. **Final seven** (exact B4 + B6 + B8 in `docs/agent/FINAL_7_BATCH_SELECTION.md`): `marketing_package_sale`, `festival_payout`, `partner_coupons`, `partner_coupons_partner`, `bad_content_alert`, `book_demo_admin`, `extra_service_request`. Evidence: `qa-output/final-7/`.

On 2026-09-27 the owner visually approved the final seven after verified footer correction and fresh Level A QA **PASS**. Together with the prior 41, all **48** in-scope Phase 1 HTML Preview designs are **OWNER VISUAL APPROVED**.

This approval does not assert production readiness and does not close Level B client testing or production security gates.

## Final seven — owner approved (HTML Preview)

Fresh Level A QA **PASS**: 16 structural renders, 35 responsive checks at 800/768/414/375/320, 7 long-content checks, 7 blocked-image checks, 4 RTL visual checks, 7 traceability checks, 4 financial fixtures and 4 focused condition assertions, all with zero failures. Focused footer recipient correction verified: `qa-output/final-7/FINAL_7_FOOTER_VERIFICATION.md`.

Evidence: `qa-output/final-7/FINAL_7_IMPLEMENTATION_REPORT.md`, `FINAL_7_QA_REPORT.md`, `FINAL_7_VISUAL_REVIEW.md`, `FINAL_7_FOOTER_VERIFICATION.md`, and `final7-qa-results.json`.

## Original remaining Phase 1 scope (historical; now complete)
- Deliverable was **HTML Preview only** — no Figma edits for remaining templates unless the owner separately authorizes a specific Figma change.
- Languages: use **only** locales actually supported by each original backend template (catalog/traceability `locale_*` + production template). Do **not** force en/ar/fr/es/fa onto every email.
- Wallet badge locales (en/ar/fr/es/fa under `assets/wallet/official/`) apply to prepared Wallet artwork for ticket-sale style previews — **not** proof that every email supports five languages.
- Reuse the owner-approved email component system (Primary CTA, header/localized logos, Warning/Error/Success alerts, accessible muted-text policy, dividers/shared components, approved typography adaptations). Details: `shared/tokens.js`, `shared/email-kit.js`, and this file — do not duplicate the full Design System into skills.

## Notable single items
- `organizer_announcement` — Phase 1 scope, Marketing / Campaign-Announcement, **IN_SCOPE · DESIGNED · OWNER VISUAL APPROVED for HTML Preview**. Design impact: **none currently identified**. See ownership classification under Known blockers (workstream C).
- `festival_marketing_approval` and `festival_marketing_approval_sms` — both **IN_SCOPE · DESIGNED · OWNER VISUAL APPROVED for HTML Preview** (Level A **PASS**, escaped content, inert `example.com` links). One consolidated Backend/Security work item covers both Email and SMS marketing approval workflows; see Known blockers (workstream C). Not an Email Kit design task.
- `festival_rescounts_marketing_email_target` — HTML Preview **OWNER VISUAL APPROVED**, Level A **PASS**. Its `text/template` production sink accepts body/media/URL values; production migration remains blocked pending a separately authorized trust-boundary review/remediation.
- Final-seven production templates — HTML Preview approved; read-only review recorded unverified trust-boundary observations around `text/template` HTML insertion, dynamic MIME headers and submitted demo URLs (see `FINAL_7_IMPLEMENTATION_REPORT.md`). These are review requirements, not confirmed exploitable vulnerabilities.

## Workstream separation (do not collapse)

| ID | Category | Status |
|---|---|---|
| **A** | Completed Email Kit design deliverables | **DONE** — 48 HTML Preview designs, all owner visually approved |
| **B** | Email rendering and integration requirements | **OPEN** — Level B Gmail/Outlook/Apple Mail testing; CDN hosting of Wallet/assets |
| **C** | Pre-existing Backend/Security observations | **OPEN** — unresolved; outside Email Kit design scope; require separately authorized Backend/Security work |
| **D** | Separately authorized production release work | **NOT AUTHORIZED** — production migration, deploy, YAML/backend changes |

Email Kit designers own **A**. They document and hand off **C**; they do not remediate backend security. **B** and **D** require separate owner authorization and are not automatic Email Kit design responsibilities.

## Approved design standards (email kit)
See `.agents/skills/email-rendering-compatibility/SKILL.md` and `shared/tokens.js` (owner-approved corrections 2026-09-25).

**Implemented email kit values:** primary CTA `#e9d023` / `#4d4c49` (DS Large pad 13×24, Medium 500); branded header `#fefdf4`; heading `#2b2a28`; body / **meaningful muted** `#4d4c49` (Dark-500); decorative Dark-50 `#898988` only for non-essential/non-text; border `#ebebeb`; success text `#166534` on `#f0fdf4`; warning `#92400e` on `#fffbeb` border `#e6d1b9`; error title `#991b1b` / body `#4d4c49` on `#fef2f2`; container max 600; logo 160px.

## Wallet (final)
- Use downloaded **official** Apple and Google Wallet badges under `assets/wallet/official/` — not custom CSS buttons and not yellow Eveenty CDN badge images.
- Preserve each provider’s original badge shape; do not edit official artwork.
- Prepared preview locales for badges: en, ar, fr, es, fa (see `assets/wallet/official/README.md`). Condensed Google used on narrow viewports.
- Production CDN upload of these assets — **not authorized**.

## Current active task
Phase 1 HTML Preview design is **complete**. All 48 in-scope templates have explicit owner visual approval. No further design implementation is authorized. Await owner authorization for any Backend/Security investigation, Level B client testing, CDN hosting or production migration.

## Known blockers / open items (by workstream)

### C — Pre-existing Backend/Security observations (unresolved; Email Kit documents only)

**Issue:** `organizer_announcement` — existing backend subject/header and caller-supplied HTML trust-boundary observations.

| Field | Classification |
|---|---|
| Origin | Pre-existing production backend behavior, identified during the Email Kit review (not introduced by the HTML Preview designs) |
| Ownership | **Backend / Security** |
| Email Kit responsibility | Document and hand off the observation only |
| Email Kit design impact | None currently identified |
| HTML Preview | Completed and owner visually approved |
| Production security status | **Unresolved**; requires separately authorized Backend/Security investigation |
| Production migration | Do **not** claim this template is security-cleared until the responsible team resolves or formally accepts the finding |
| Evidence strength | Potential trust-boundary issue — **not** a confirmed exploitable vulnerability; do not describe as fixed or dismiss as harmless |
| Evidence | `qa-output/pilot-batch/PILOT_SECURITY_REVIEW.md` (preview escapes synthetic content; no backend remediation performed) |

**Issue (consolidated):** Marketing Approval approval-link behavior — covers both `festival_marketing_approval` (Email) and `festival_marketing_approval_sms` (SMS). One Backend/Security work item; two preserved template IDs for traceability.

| Field | Classification |
|---|---|
| Category | Pre-existing Backend / Security observations |
| Affected template IDs | `festival_marketing_approval`, `festival_marketing_approval_sms` (keep individually traceable) |
| Observation | Production approve/reject links may trigger state-changing operations through unauthenticated GET requests. Email-security scanners and link-prefetching systems may open these URLs automatically, potentially changing a campaign's approval status without an intentional administrator action. |
| Origin | Pre-existing production backend behavior, identified while reviewing the existing production backend during Email Kit work — **not** introduced by the HTML Preview designs |
| Ownership | **Backend / Security** |
| Email Kit responsibility | Document and hand off the observations only. **Not** an outstanding Email Kit design task. |
| Email Kit design impact | None — do not reopen visual approval or create additional design requirements solely because of these backend observations |
| HTML Preview | Both designs **COMPLETE** and owner visually approved; inert `example.com` links; do not execute approval or rejection operations |
| Production security status | **Unresolved** — pending separately authorized Backend/Security investigation |
| Production migration / integration | Security clearance must be determined by the responsible team before enabling the relevant production approval workflows. Requires separate owner authorization (workstream D). |
| Evidence strength | Documented production security concern — **not** a claim that exploitation has been confirmed; do not describe as fixed or dismiss as harmless |
| Evidence (preserve) | `qa-output/batch-20/BATCH_20_QA_REPORT.md`, `BATCH_20_IMPLEMENTATION_REPORT.md`, `BATCH_20_VISUAL_REVIEW.md` |
| Possible remediation (not approved; Backend/Security selects) | Avoid executing state-changing operations directly on GET; open a confirmation page from the email link; authenticate the administrator and verify authorization; execute the confirmed action via a protected POST; consider CSRF protection, token validation, expiration and one-time-use semantics as appropriate; test email-security link scanning and prefetch behavior before production release. The responsible team must investigate the current implementation and select the appropriate solution. Do **not** implement or assume any proposed remediation is already approved. |

Other Backend/Security observations (keep separate; same workstream C; statuses unchanged):

- Marketing target HTML/body/media boundaries (`festival_rescounts_marketing_email_target`) — Go `text/template` inserts caller/request-derived values; preview escapes them; production trust-boundary review needs separate authorization.
- Final-seven production trust-boundary observations (`text/template` HTML insertion, dynamic MIME headers, submitted demo URLs) — review required before production migration; not labeled confirmed exploitable vulnerabilities.

### Distinction (do not collapse)

| | Deliverable | Status |
|---|---|---|
| **A** | Email Kit design deliverables (incl. both marketing-approval HTML Previews) | **COMPLETE** and owner-approved |
| **C** | Existing backend approval-link behavior for `festival_marketing_approval` / `festival_marketing_approval_sms` | Outside Email Kit design scope; **unresolved**; Backend/Security owns follow-up |
| **D** | Production integration of those approval workflows | Requires separate owner authorization after security clearance |

### B — Email rendering and integration requirements

- Level B real Gmail / Outlook / Apple Mail QA — **NOT RUN**.
- Production CDN upload of `assets/wallet/official/**` — **not authorized**.

### D — Separately authorized production release work

- Any production deploy / CDN / backend / Figma / YAML / migration work — requires separate explicit owner authorization.
- No `package.json` wiring for `email:*` scripts (intentional — use `node .agents/scripts/email-cli.mjs …`).

## Closed owner decisions (selected)
- **OD-2 — CLOSED — OWNER APPROVED (Option A, 2026-09-26):** keep Original DS alert borders Warning `#E6D1B9` / Error `#E9C5C6` as decorative; status via accessible text/headings/icons; do not strengthen or change border colors.
- **Phase 1 HTML Preview design — CLOSED — OWNER VISUAL APPROVED (2026-09-27):** all 48 in-scope designs approved; no further design implementation authorized.

## Canonical audit artifact locations (verified readable)
- `D:\emails\Eveenty-Email-Kit-Phase1\organization\` (FAMILY_TAXONOMY_AUDIT, TRACEABILITY CSV, etc.)
- Mirrored copies under `eveenty-email-preview/catalog/`
- Backend templates readable under `D:\last\rescounts-backend\email\templates\` (59 `*.template` files; plus non-template asset `welcome_email_ad.png`)
