# Wallet badge sizing & alignment — festival_ticket_sale

**Date:** 2026-09-25 (updated: final official alignment)  
**Scope:** `festival_ticket_sale` + `walletActionButtons` only  
**Artwork crop/stretch/redraw:** NOT done · **Figma / backend / other six emails:** NOT modified  

---

## 1. Intrinsic Google badge inventory

### Primary (`wallet-button`) — `assets/wallet/official/google/{locale}.png`

| Locale | Intrinsic | Transparent pad | Width @ 48px height |
|--------|-----------|-----------------|---------------------|
| en | 283×50 | none (content fills canvas) | **272** |
| ar | 936×150 | none | **300** |
| fr | 317×50 | none | **304** |
| es | 298×50 | none | **286** |
| fa | 308×50 | none | **296** |

### Condensed (`add-wallet-badge`) — from official `add-to-wallet-png.zip`

| Locale | Intrinsic | Transparent pad | Width @ 48px height |
|--------|-----------|-----------------|---------------------|
| en | 199×55 | none | **174** |
| ar | 199×55 | none | **174** |
| fr | 199×55 | none | **174** |
| es | 199×55 | none | **174** |
| fa | 213×55 | none | **186** |

### Apple — `assets/wallet/official/apple/{locale}.png`

| Locale | Intrinsic | Transparent pad (approx) | Width @ 48px height |
|--------|-----------|--------------------------|---------------------|
| en | 316×100 | ~0–3px edges | **152** |
| ar | 318×100 | ~0–2px edges | **153** |
| fr | 321×100 | ~0–3px edges | **154** |
| es | 376×100 | ~0–3px edges | **180** |
| fa | 316×100 (EN artwork fallback) | ~0–3px | **152** |

Google brand guidelines: primary on light backgrounds; **use condensed when there is not enough space for the primary**; min height **48 dp**; clear space **8 dp**. Apple shapes remain rounded-rectangle; Google remains pill — never forced into matching shapes.

---

## 2. Prior failures (resolved)

### A. 320px height shrink (43–45px)
At 320px, nested padding ate the column. Primary FR needs **304px** at 48px height; even maximized usable ≈ **302px**. `max-width:100%` + `height:auto` fluid-shrunk Google. **Forbidden.**

**Fix:** official condensed Google ≤620px; pin height 48px; cancel nested stack-pad; outer pad → 0; retain 8px clear space.

### B. Desktop vertical misalignment (~9px midY delta)
Google cell held primary + condensed `<a>` siblings with whitespace. Anonymous text strut + baseline alignment pushed Google ~9px above Apple on the same row.

**Fix:** `font-size:0;line-height:0` on wallet cells; hide unused provider *link wrapper* (not only the img); `vertical-align:middle` on links/imgs; no whitespace between sibling links.

---

## 3. Fix applied (final)

1. **Shared display height 48px**; widths from intrinsic aspect — never equal-width force.
2. **Desktop/tablet:** side-by-side, `valign=middle`, ≥16px gap, group centered in `.wallet-section`.
3. **≤620px:** stack + center; Google switches to official condensed.
4. **Dual Google assets:** primary (wide) + condensed (narrow) via CSS; Outlook ignores MQ → primary only.
5. **No custom button chrome** around official artwork.

---

## 4. QA results (Level A Chromium) — measured rendered sizes

Harness: `capture-wallet-official-qa.mjs`  
Log: `wallet-official-qa-results.json`  
Minimal screenshots: `screenshots/wallet-official/` (10 captures)

| Check | Result |
|-------|--------|
| en/ar/fr/es/fa × 800/768/414/375/320 | **PASS** |
| Visible badge height ≥48 every width | **PASS** (`heightFailCount: 0`) |
| Desktop midY delta ≤2 | **PASS** (`alignFailCount: 0`, all `midDelta: 0`) |
| Gap ≥16 (measured **16** desktop & mobile) | **PASS** |
| Mobile condensed Google; desktop primary | **PASS** |
| Wallet group centered | **PASS** |
| Overflow | **PASS** (0) |
| Image-blocked alt / organizer omit / calendar | **PASS** |
| Gmail / Outlook / Apple Mail | **NOT RUN** |

### Measured rendered dimensions (Chromium)

| Locale | Viewport | Google (measured) | Apple (measured) | Gap | Stack | midΔ |
|--------|----------|-------------------|------------------|-----|-------|------|
| en | 800 / 768 | **272×48** primary | **152×48** | 16 | no | 0 |
| en | 414 / 375 / 320 | **174×48** condensed | **152×48** | 16 | yes | — |
| ar | 800 / 768 | **300×48** primary | **153×48** | 16 | no | 0 |
| ar | 414 / 375 / 320 | **174×48** condensed | **153×48** | 16 | yes | — |
| fr | 800 / 768 | **304×48** primary | **154×48** | 16 | no | 0 |
| fr | 414 / 375 / 320 | **174×48** condensed | **154×48** | 16 | yes | — |
| es | 800 / 768 | **286×48** primary | **180×48** | 16 | no | 0 |
| es | 414 / 375 / 320 | **174×48** condensed | **180×48** | 16 | yes | — |
| fa | 800 / 768 | **296×48** primary | **152×48** | 16 | no | 0 |
| fa | 414 / 375 / 320 | **186×48** condensed | **152×48** | 16 | yes | — |

**Unresolved size limitation (documented, mitigated):** Primary FR/AR/FA Google badges cannot fit at 48px + 8dp clear inside a 320px viewport. Official condensed variant is used on ≤620px — not a crop/stretch of primary.

---

## 5. Files touched

| File | Change |
|------|--------|
| `shared/email-kit.js` | Alignment: font-size 0 cells; hide unused Google *link*; badge CSS pin; dual primary/condensed |
| `emails/festival_ticket_sale.html` | Regenerated EN buyer |
| QA harness + this report | midY / measured-dimension assertions; minimal screenshots |

**Not touched:** badge artwork · Figma · backend · other six emails · production CDN · calendar link behavior
