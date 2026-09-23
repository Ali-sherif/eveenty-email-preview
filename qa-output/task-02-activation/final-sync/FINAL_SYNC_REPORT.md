# Account Activation — Final Figma / Preview Synchronization Report

**Date:** 2026-09-24  
**Scope:** Account Activation (`activate_email`) ONLY  
**Email Kit Figma:** [Eveenty Email Design Kit](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit)  
**Preview:** `http://localhost:54701/`  
**Output:** `D:\last\eveenty-email-preview\qa-output\task-02-activation\final-sync\`

**Verdict:** Owner-approved visual decisions applied to editable Figma Activation frames + local Activation preview. Locale content/logo parity **PASS** for EN / FR / ES / AR / FA (browser matrix 11/11 PASS).  
**This report does NOT claim final owner visual sign-off.**  
**Gmail / Outlook / Apple Mail client tests: NOT EXECUTED.**

---

## Owner-approved decisions (CLOSED)

| # | Decision | Applied value |
|---|---|---|
| 1 | CTA | Yellow `#E9D023` + dark text `#4D4C49` |
| 2 | Logo | Nominal display width **160px**, proportional height, source PNGs unchanged |
| 3 | Header | Canonical primary-50 `#FEFDF4` (not legacy `#FCF9DF`) |
| 4 | Heading | **600 SemiBold** (original Figma H2) |

### Spanish logo optical density

| Locale | Canvas | Opaque fill ratio (α>8, sampled) | Display @160 |
|---|---|---:|---|
| EN / FR / AR / FA | 3014×1208 | ~0.50–0.53 | 160×64 |
| ES | 2958×1208 | **~0.997** (near-full canvas ink) | 160×65 |

**Finding:** ES is **optically denser** at the same CSS width because it lacks the transparent padding present in the other four PNGs.  
**Locale-specific display-width adjustment:** **JUSTIFIED for optical parity** (approx. 128–148px would closer-match EN wordmark optical width).  
**Applied in this sync:** **NO** — uniform **160px** retained per owner nominal width. Source PNGs not modified/regenerated.

---

## 1. Figma layers / components updated

### Shared (page `02 — Email Components & Foundations (Shared)`)

| Node | Name | Change |
|---|---|---|
| `3:22`–`3:34` | Localized Header logos EN/FR/ES/AR/FA | Resize **200→160** (ES height 65; others 64) |
| `3:23`–`3:35` | Header alt annotations | `~200px` → `160px` |
| `3:21`–`3:33` | Header Image-state variants | Height grown to fit 160 logo (~112) |
| `3:15` | Typography Hierarchy — Email Title | Bold 700 → **SemiBold 600** (H2) |
| `3:6` | CTA Primary | Confirmed fill `#e9d023` (unchanged) |

### Account Activation frames (page `04 — Email Templates`)

| Frame | Link | Updates |
|---|---|---|
| EN Desktop 800 | [`4:2`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2) | Logo 160×64; header `#FEFDF4` h=112 |
| EN Tablet 768 | [`4:19`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-19) | Logo/header resize |
| EN Mobile 414 / 375 / 320 | [`4:36`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-36) / [`4:53`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-53) / [`4:70`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-70) | Logo/header resize |
| FR Desktop 800 | [`4:87`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-87) | Logo 160×64 |
| ES Desktop 800 | [`4:104`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-104) | Logo 160×65 |
| AR Desktop 800 | [`5:2`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=5-2) | Logo 160; greeting → production order `،مرحباً Alex 👋,`; footer combined; LTR-URL annotation hidden |
| AR Mobile 375 | [`5:20`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=5-20) | Same content/logo sync |
| FA Desktop 800 | [`5:38`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=5-38) | Logo 160; greeting → `،سلام Alex 👋,`; footer `این پیام به … ارسال شد.`; LTR annotations hidden |
| FA Mobile 320 | [`5:56`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=5-56) | Same content/logo sync |

### Cover page

| Node | Change |
|---|---|
| `1:14` | Updated timestamp noting Activation visual decisions CLOSED |
| `1:18`–`1:24` | **Restored** prior Phase 1 scope closures (inventory not reopened) |
| `63:45` | **New** board: `Activation Visual Decisions — CLOSED 2026-09-24` |

**Not mutated:** Original Design System file, Donation / Ticket / RegApproval / Support frames, backend, YAML, owner PNGs.

---

## 2. Preview files changed

| Path | Change |
|---|---|
| `shared/email-kit.js` | `brandedHeader({ logoWidth })` — Activation can pass 160; other templates default 200 |
| `shared/render-emails.js` | Activation: `logoWidth: 160`, heading `font-weight:600` |
| `emails/activate_email.html` | Regenerated (160 logo, weight 600) |
| `emails/*.html` (other 4) | Regenerated via `generate-standalone.mjs` (shared kit only; non-Activation still default logo 200) |

**Not changed:** backend templates, YAML, owner PNGs under `D:\emails\`, Commerce/Notification/Marketing preview content.

**Git:** No stage / commit / push.

---

## 3. Task 01 documentation changes

| File | Change |
|---|---|
| `email-kit-v1-spec.md` | Logo 160 approved; header `#FEFDF4` Activation close; CTA yellow owner-approved for Activation; heading 600 |
| `email-logo-manifest.json` | Display width 160; ES optical-density note; unverified list updated |
| `shared-foundations.json` | New `accountActivationVisualDecisionsClosed` (inventory counts untouched) |
| `email-qa-checklist.md` | Logo check updated to 160px |
| `phase-1-email-scope.md` | 2026-09-24 Activation decision close note; inventory unchanged |

---

## 4. Locale-by-locale parity (Figma ↔ preview ↔ production)

Sources: `pkg/locales/translations/email/{en,fr,es,ar,fa}.yaml` ActivateEmail* + `activate_email.template` greeting/footer pattern (READ ONLY).

| Locale | Logo | Heading/body/CTA/footer vs YAML | Dir | CTA yellow/dark | Heading 600 | Header `#FEFDF4` | Preheader hidden | Evidence |
|---|---|---|---|---|---|---|---|---|
| EN | PASS 160×64; owner PNG | PASS | LTR | PASS | PASS | PASS | PASS | `screenshots/desktop-en-800*.png`, `figma/activate-en-desktop-800.png`, `comparisons/compare-en-desktop-800.png` |
| FR | PASS 160×64 | PASS | LTR | PASS | PASS | PASS | PASS | `desktop-fr-800*`, `figma/activate-fr-desktop-800.png`, `compare-fr-desktop-800.png` |
| ES | PASS 160×65 (denser ink) | PASS | LTR | PASS | PASS | PASS | PASS | `desktop-es-800*`, `figma/activate-es-desktop-800.png`, `compare-es-desktop-800.png` |
| AR | PASS 160×64 | PASS (greeting lead `،مرحباً` + template comma) | RTL | PASS | PASS | PASS | PASS | `desktop-ar-800*`, `mobile-ar-375*`, Figma `5:2`/`5:20`, comparisons |
| FA | PASS 160×64 | PASS (greeting lead `،سلام`; footer suffix ` ارسال شد.`) | RTL | PASS | PASS | PASS | PASS | `desktop-fa-800*`, `mobile-fa-320*`, Figma `5:38`/`5:56`, comparisons |

**Also captured:** blocked-images EN 600 — PASS; long-copy EN 320 — PASS.

Browser automated checks: **11/11 PASS** (`measurements.json`).

Side-by-side Figma vs browser screenshots used for visual match (not source-only).

---

## 5. Source-image verification method

### Preview ↔ owner PNGs
SHA256 byte-identical for all five:

| Locale | Owner file | Preview asset | Match |
|---|---|---|---|
| EN | `English.png` | `eveenty-logo-en.png` | BYTE-IDENTICAL |
| FR | `french.png` | `eveenty-logo-fr.png` | BYTE-IDENTICAL |
| ES | `Spanish.png` | `eveenty-logo-es.png` | BYTE-IDENTICAL |
| AR | `Arabic.png` | `eveenty-logo-ar.png` | BYTE-IDENTICAL |
| FA | `Farse.png` | `eveenty-logo-fa.png` | BYTE-IDENTICAL |

### Figma ↔ owner PNGs
Method: Plugin API `figma.getImageByHash(hash).getBytesAsync()` + `getSizeAsync()`, compared to owner files by:

1. Exact **byte length** match  
2. Full-content **FNV-1a** hash match  
3. PNG signature first/last 8 bytes  
4. Natural dimensions (3014×1208 or ES 2958×1208)

| Locale | Figma imageHash (prefix) | Byte length | FNV match | Claim |
|---|---|---:|---|---|
| EN | `f5eb3d02…` | 83925 | Yes | **BYTE-VERIFIED** |
| FR | `7d443aa3…` | 86366 | Yes | **BYTE-VERIFIED** |
| ES | `9cf6d6db…` | 84555 | Yes | **BYTE-VERIFIED** |
| AR | `996eb874…` | 89063 | Yes | **BYTE-VERIFIED** |
| FA | `8098e3cb…` | 94026 | Yes | **BYTE-VERIFIED** |

**Limitation:** Figma MCP does not surface SHA256 of image fills directly; identity is proven via full-byte FNV-1a + length (equivalent practical proof for these files). No `upload_assets` replacement was required — existing fills already matched owner PNGs. Images were **not** re-uploaded.

**Fifth requirement (Figma/preview logo + content parity):** **PASS** (not BLOCKED).

---

## 6. Remaining discrepancies / limitations

| Item | Severity | Notes |
|---|---|---|
| ES optical density @160 | INFO | Optional narrower display width justified; not applied |
| RTL greeting bidi presentation | INFO | Stored string matches production YAML+template; visual glyph order follows Unicode bidi |
| Hidden inbox preheader EN-only | COSMETIC | No production preheader keys — not invented; annotation outside canvas |
| Figma annotations outside email | OK | Preheader / font-stack notes remain outside container |
| Shared Localized Header used by future templates | NOTE | Component logos now 160; Commerce frames not redesigned this pass |
| Non-Activation preview logos | NOTE | Still default 200 until those templates’ decisions close |
| Email client auto-dark / Outlook VML | DEFERRED | NOT EXECUTED |

---

## 7. Browser measurements & accessibility

From `measurements.json` (Playwright Chromium, `localhost:54701`):

| Check | Result |
|---|---|
| Logo display width | **160px** (ES height ≈65.33; others ≈64.13) |
| Heading `font-weight` | **600** |
| CTA fill / text | `rgb(233,208,35)` / `rgb(77,76,73)` |
| Header band | `rgb(254,253,244)` (`#FEFDF4`) |
| CTA touch target | ≥44×44 (desktop EN ≈236×51) |
| Horizontal overflow | None in matrix |
| Visible preheader row | Absent |
| Contrast CTA `#4D4C49` on `#E9D023` | ~**5.52:1** AA pass |
| Contrast body on white | ~**8.59:1** AA pass |
| Contrast heading on white | ~**14.34:1** AA pass |
| Plus Jakarta fallback | Preview stacks include Arial/Helvetica; weight 600 retained when web font blocked (synthetic SemiBold may vary by OS — design risk only) |

---

## 8. Email client testing

**Real Gmail / Outlook / Apple Mail tests remain NOT EXECUTED.**  
Evidence in this folder is browser/Playwright + Figma export only.

---

## Artifact index

```
final-sync/
  FINAL_SYNC_REPORT.md          ← this file
  measurements.json
  capture-final-sync.mjs
  build-comparisons.mjs
  screenshots/                  ← browser captures (viewport + email-only)
  figma/                        ← Figma node exports
  comparisons/                  ← side-by-side Figma | browser pairs
```

---

## Stop gate

- Account Activation synchronized for the four closed owner visual decisions + Figma/preview content/logo parity.  
- **Awaiting final owner visual sign-off** before Commerce / Notification / Marketing / remaining catalog.  
- No backend, YAML, DS, or owner PNG mutations.  
- No git stage/commit/push.
