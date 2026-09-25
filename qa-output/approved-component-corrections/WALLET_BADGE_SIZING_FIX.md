# Wallet badge sizing fix — festival_ticket_sale

**Date:** 2026-09-25 (updated: mobile 320px final)  
**Scope:** `festival_ticket_sale` + `walletActionButtons` only  
**Artwork crop/stretch/redraw:** NOT done · **Figma / backend / other six emails:** NOT modified  

---

## 1. Intrinsic Google badge inventory

### Primary (`wallet-button`) — `assets/wallet/official/google/{locale}.png`

| Locale | Intrinsic | Aspect | Width @ 48px height |
|--------|-----------|--------|---------------------|
| en | 283×50 | 5.66 | **272** |
| ar | 936×150 | 6.24 | **300** |
| fr | 317×50 | 6.34 | **304** |
| es | 298×50 | 5.96 | **286** |
| fa | 308×50 | 6.16 | **296** |

### Condensed (`add-wallet-badge`) — from official `add-to-wallet-png.zip`

| Locale | Intrinsic | Aspect | Width @ 48px height |
|--------|-----------|--------|---------------------|
| en | 199×55 | 3.62 | **174** |
| ar | 199×55 | 3.62 | **174** |
| fr | 199×55 | 3.62 | **174** |
| es | 199×55 | 3.62 | **174** |
| fa | 213×55 | 3.87 | **186** |

Google brand guidelines: primary on light backgrounds; **use condensed when there is not enough space for the primary**; min height **48 dp**; clear space **8 dp**.

---

## 2. Why 320px failed before

At 320px, nested padding ate the column:

| Chrome | px |
|--------|-----|
| outer-pad L+R | 8+8 |
| stack-pad L+R | 16+16 |
| container border | ~2 |
| **Available** | **~270** |

Primary FR needs **304px** at 48px height → `max-width:100%` + `height:auto` fluid-shrunk Google to ~43px. **Forbidden.**

Even with padding maximized (outer 0, stack cancelled, 8dp clear): available ≈ **302px**. Primary FR (**304**) still cannot fit with 8dp clear space. → official condensed required for narrow viewports.

---

## 3. Fix applied

1. **Stack + center** badges ≤620px (existing `.wallet-btn` block rules).
2. **`.wallet-section`** cancels nested `stack-pad` (−16px margins) and keeps **8px** horizontal clear space.
3. **`.outer-pad`** horizontal → **0** on mobile (maximize width, no overflow).
4. **Pinned 48px height** — removed fluid `height:auto` shrink on wallet badges.
5. **Dual official Google assets:** primary (desktop/tablet ≥768) + condensed (≤620px via CSS). Apple unchanged (fits at 48px). Artwork unmodified copies from brand pack.
6. Outlook ignores MQ → shows primary only (wide pane).

---

## 4. QA results (Level A Chromium) — this session

| Check | Result |
|-------|--------|
| en/ar/fr/es/fa × 800/768/414/375/320 | **PASS** |
| Visible badge height ≥48 at **every** width incl. 320 | **PASS** (`heightFailCount: 0`) |
| Mobile uses condensed Google; desktop primary | **PASS** |
| Stack + ≥16px gap on narrow | **PASS** |
| Overflow | **PASS** (0) |
| Image-blocked alt (EN + AR, desktop + 320) | **PASS** |
| Gmail / Outlook / Apple Mail | **NOT RUN** |

Measured at 320 (visible): Google condensed **174×48** (fa **186×48**); Apple **152–180×48**. All matched height.

**Captures:** `screenshots/wallet-official/`  
**Log:** `wallet-official-qa-results.json`

---

## 5. Files touched

| File | Change |
|------|--------|
| `shared/email-kit.js` | Dual Google primary/condensed; wallet-section MQ; no fluid shrink |
| `shared/render-emails.js` | `wallet-section` wrapper (ticket sale only consumer) |
| `emails/festival_ticket_sale.html` | Regenerated EN buyer |
| `assets/wallet/official/google/condensed/*` | Official condensed PNGs (5 locales) |
| `assets/wallet/official/source/google/*add-wallet-badge*` | Source copies |
| `assets/wallet/official/README.md` | Condensed + sizing notes |
| QA harness + this report | Hard ≥48 assertions |

**Not touched:** badge artwork redraw · Figma · backend · other six emails · production CDN · calendar links
