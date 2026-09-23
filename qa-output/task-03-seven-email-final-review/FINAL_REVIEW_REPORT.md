# Task 03 — Seven-email final review report

**Date:** 2026-09-24  
**Role:** Senior email design-system engineer / independent visual QA  
**Status:** **STOP — owner visual approval still required**; **scope twelfth exclusion = SCOPE DECISION PENDING**  
**Preview app:** `npm start` → http://localhost:4173/  
**Email Kit Figma:** https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit  
**Output folder:** `D:\last\eveenty-email-preview\qa-output\task-03-seven-email-final-review\`

**Gmail / Outlook / Apple Mail:** **NOT EXECUTED**  
**Backend / YAML / owner PNGs / original Design System:** **NOT MODIFIED**  
**Git:** no stage / commit / push  
**Phase F:** **NOT STARTED** (scope + seven-email gate)

---

## Executive summary

All **seven authorized** reference emails were re-verified against production templates (read-only), Activation-approved foundations, editable Figma frames, and a **fresh** Playwright Chromium matrix (**87/87 automated PASS**). Prior Task 03 remediation (donation, registration approval, support) remains in place; **no additional preview or Figma mutations** were required in this final pass beyond **fresh QA artifacts** and documentation.

The **59 / 11 / 48 → 59 / 12 / 47** shift is **not independently owner-authorized** in available sources. See `SCOPE_RECONCILIATION.md` (**SCOPE DECISION PENDING**). The seven emails are in-scope under **either** count.

---

## Part 1 — Current state verification

### Foundations checklist (all seven where applicable)

| Foundation | Applied |
|---|---|
| Primary CTA yellow `#E9D023` / text `#4D4C49` | activate, reg approval (CTA), dispute (conditional CTA) |
| Logo 160px owner PNGs | All except marketing (festival logo slot) |
| Header `#FEFDF4` | Branded-header emails |
| Heading weight 600 SemiBold | activate, donation thank-you, support H1, dispute/reg section titles |
| Fluid hybrid max 600px | All seven |
| Mobile widths 320 / 375 / 414 | Exercised in browser matrix |
| RTL AR/FA | Supported templates; support + marketing EN-only |
| No visible body preheader | All seven |
| Hidden preheader in `<head>` | Preview pattern retained |

### Design review items (Part 3)

#### A — Registration approval CTA

| Source | CTA button | Accent magenta `#d80073` |
|---|---|---|
| Production `festival_ticket_registration_approval.template` | Magenta fill / white text | Section borders, status highlights, links — **ticket-family chrome**, not a separate semantic “warning CTA” |
| Approved Email Kit primary CTA | Yellow / dark text | N/A for primary button |
| Figma `48:59` | **`#e9d023` / `#4d4c49`** (verified via design context) | Section accents may still use secondary magenta in frames |
| Local preview | `primaryCtaYellow` | Content uses `TOKENS.secondary` for registration accents |

**Conclusion:** No documented exception requiring a **magenta primary CTA**. Magenta remains the **secondary brand accent** inside registration content. **Primary action** aligned to Activation yellow in Figma + preview. Production template **unchanged** (Phase 1 boundary).

#### B — Support header

| Production | Reference (Figma + preview) |
|---|---|
| `header_3` partial (gradient bar + CDN logo in header) | `brandedHeader` cream `#FEFDF4` + **160px** localized Eveenty PNG |
| Bottom `eveenty-logo-1280.png` ~380px | Text footers only; giant logo **deferred** (hosting/layout not in Phase 1) |
| EN-only copy from template | Sample strings match production headings / error panel intent |

**Conclusion:** Branded header applied where compatible with internal EN-only contract. **Production partials not modified.**

#### C — Marketing language and content

| Fact | Evidence |
|---|---|
| Author-supplied body | `BodyText` from `FestivalMarketingEmailRequest` in `email/smtp.go` |
| No ProfileLanguage / YAML localization on send path | Same file — subject + body from request only |
| English chrome | Footer strings hardcoded in `festival_marketing_email_target.template` |
| Unsubscribe | Existing `UnsubsribeURl` link preserved in preview (`marketingCampaignFooter`) |
| No invented compliance | Preview does not add legal blocks beyond production template fields |

**Conclusion:** EN-only chrome + freeform author body **confirmed**. Preview matches contract.

---

## Part 2 — Scope (Part 4 summary)

See **`SCOPE_RECONCILIATION.md`**. Label: **`SCOPE DECISION PENDING`** for `organizer_announcement` twelfth exclusion.

---

## Part 5 — Browser & Figma QA (this pass)

| Artifact | Location |
|---|---|
| Browser screenshots | `screenshots/` (87 captures) |
| Measurements + checks | `measurements.json` |
| Figma exports (fresh MCP) | `figma/*-en-desktop-800.png` |
| Side-by-side comparisons | `comparisons/index.html` |
| Scripts | `capture-qa.mjs`, `build-comparisons.mjs`, `smoke-render.mjs`, `capture-figma.mjs` |

**Figma nodes exported:** `4:2`, `21:2`, `21:53`, `48:45`, `22:113`, `72:44`, `72:175`

**Parity:** EN desktop Figma vs browser reviewed per template — see `SEVEN_EMAIL_MATRIX.md` (FIGMA/PREVIEW PARITY PASS with noted production deltas for support + marketing).

---

## Part 6 — Remaining owner decisions

1. **Visual sign-off** on all seven references (none marked OWNER APPROVED).
2. **Scope:** Confirm or revert `organizer_announcement` exclusion (`SCOPE DECISION PENDING`).
3. **Support reference vs production chrome** — accept branded header reference vs live `header_3` until backend Phase 2.
4. **Spanish logo optical density** at 160px (optional narrower ES width — Activation left open).
5. **Additional Figma locale frames** for donation / reg / support / ticket / dispute (preview already multi-locale where production supports).
6. **Figma catalog page label “48”** → update to **47** only after scope decision confirmed.

---

## Quick links

| Resource | Link |
|---|---|
| Comparison index | `comparisons/index.html` |
| Matrix | `SEVEN_EMAIL_MATRIX.md` |
| Scope | `SCOPE_RECONCILIATION.md` |
| Changes this pass | `CHANGES.md` |
| Prior pass (superseded QA folder) | `../task-03-seven-email-review/` |
| Activation final sync | `../task-02-activation/final-sync/FINAL_SYNC_REPORT.md` |

---

## Stop gate

Seven-email design preview + Figma references are **ready for owner visual review**. Do **not** proceed to Phase F catalog or backend implementation until **owner approves these seven** and **resolves scope 11 vs 12 exclusions**.
