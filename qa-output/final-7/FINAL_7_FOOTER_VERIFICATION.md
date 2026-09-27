# FINAL 7 — Focused Footer Verification

**Date:** 2026-09-27  
**Scope:** Exact final seven HTML Preview designs + shared `brandedFooter` rendering  
**Boundary:** No Figma, backend, CDN, commit, push, or redesign

## Verdict

**Root cause:** recipient **lost during rendering**, not missing from the fixture and not an intentional production omission of the Design Kit “sent to” line.

**Correction:** wire synthetic `example.com` recipient emails into `shared/final7-renderers.js` `shell()` → `brandedFooter({ email, dir })`.

**Regression:** Level A desktop / mobile / RTL **PASS** after correction.

## 1. Incomplete sentence diagnosis

Observed copy: `This message was sent to .` (empty `mailto:`).

| Hypothesis | Result |
|---|---|
| Missing from synthetic fixture | **No** — `SAMPLE.email` (`alex.morgan@example.com`) already existed in `final7-renderers.js` |
| Lost during rendering | **Yes** — `shell()` called `brandedFooter({ dir })` with no `email`, so `esc(undefined)` rendered empty |
| Intentionally omitted by production | **No for Design Kit component** — see §2. Production templates differ; the Design Kit still expects a recipient when it uses the activate-style branded footer |

Affected previews (all seven standalones before fix):

`marketing_package_sale`, `festival_payout`, `partner_coupons`, `partner_coupons_partner`, `bad_content_alert`, `book_demo_admin`, `extra_service_request`

## 2. Production footer contract (read-only)

| Template | Production footer | “Sent to {email}” in production? |
|---|---|---|
| `marketing_package_sale` | `footer_branded_both_dirs` (phone / address / email / website / HST labels) | **No** — contact-label footer, not activate “sent to” |
| `festival_payout` | none | No |
| `partner_coupons` / `partner_coupons_partner` | Rescounts policy / contact block | No |
| `bad_content_alert` | logo only | No |
| `book_demo_admin` / `extra_service_request` | social icons + logo | No |

Design Kit continues to reuse the **approved activate-style** `brandedFooter` (“This message was sent to …”) for visual system consistency. That component **requires** a recipient email. Fixture emails were present; only the render call omitted them.

## 3. Correction applied (preview only)

File: `shared/final7-renderers.js`

- `shell({ …, email })` now passes `email` into `brandedFooter`
- Synthetic recipients:
  - organizer / buyer: `alex.morgan@example.com`
  - admin ops: `admin@example.com`
  - partner: `partner@example.com`
- Regenerated `emails/<id>.html` for the seven IDs only
- QA structural check added: `footer-recipient-present`

No production templates, YAML, approved layout redesign, or protected-41 HTML edits.

## 4. `marketing_package_sale` Arabic / Persian footer localization

**Production source (verified):**

- Organizer persona supports profile language including `ar` / `fa` (`HTMLLang` / `HTMLDir` + package copy locales).
- Production footer is `footer_branded_both_dirs`, localized via embedded `BrandedFooterEmailLocales` (`BrandedFooterPhoneLabel`, `Address`, `Email`, `Website`, `HSTLabel`) — **present in `ar.yaml` and `fa.yaml`**.
- Production does **not** use `ActivateEmailFooterLead` / “This message was sent to” for this template.

**Design Kit preview:**

- Body copy for organizer `ar` / `fa` remains localized (existing PACKAGE_COPY).
- Shared Design Kit footer lead stays the English activate-style default (same pattern as several other Design Kit receipts such as donation). **No invented translations** and no change to the production content contract.
- RTL layout / `dir` regression for `ar`/`fa` still **PASS**.

## 5. Protected 41 baseline scan

Scanned all `emails/*.html` for empty `mailto:` after the “sent to” lead.

- **Final seven (before fix):** 7 incomplete
- **Protected 41:** **0** incomplete
- **Final seven (after fix):** **0** incomplete

## 6. Regression QA (this session)

Command: `node qa-output/final-7/capture-final7-qa.mjs`

| Check | Result |
|---|---|
| Catalog + exact final-seven mappings | **PASS** · 59 / 11 / 48 / 48 / 0 |
| Structural renders (+ footer-recipient) | **PASS** · 16 · 0 failures |
| Responsive 800/768/414/375/320 | **PASS** · 35 · 0 overflow |
| Long-content / blocked images | **PASS** · 7 / 7 |
| RTL `ar`/`fa` desktop+mobile | **PASS** · 4 |
| Traceability / financial / conditions / contrast | **PASS** |
| Gmail / Outlook / Apple Mail | **NOT RUN** |

Updated screenshots:

- `qa-output/final-7/screenshots/*--desktop-800.png` / `*--mobile-320.png` (14)
- `qa-output/final-7/screenshots/rtl/marketing_package_sale--{ar,fa}--{desktop-800,mobile-320}.png` (4)
- Contact sheets refreshed via `build-contact-sheets.mjs`

## 7. Stop / approval follow-up

Focused technical footer defect corrected; Level A desktop/mobile/RTL regression **PASS**.

**[2026-09-27 follow-up]** Owner visually approved all seven HTML Preview designs after this verified footer correction. Approval does not authorize production work, Level B client testing, CDN upload or backend changes.
