# OFFICIAL MULTILINGUAL WALLET BADGES

**Date:** 2026-09-25  
**Scope:** `festival_ticket_sale` + `walletActionButtons` only  
**Owner decision:** OD-W1 option **B** — complete official Apple / Google brand-kit badges  
**Figma:** NOT modified (owner-restricted this session)  
**Backend / production CDN upload:** NOT modified / NOT uploaded  

---

## 1. Asset inventory

### Source archives (Downloads)

| Archive | Contents |
|---------|----------|
| `add-to-wallet-png.zip` | Google Wallet PNG pack (`wallet-button` + `add-wallet-badge` per locale) |
| `Add-to-Apple-Wallet.zip` | Apple “Add to Apple Wallet” badges — **SVG + EPS only** (45 locale folders) |

### Prepared project assets

```
assets/wallet/official/
  google/{en,ar,fr,es,fa}.png     ← official Google wallet-button PNGs
  apple/{en,ar,fr,es,fa}.png      ← Apple RGB SVGs rasterized → PNG (email-safe)
  source/google/                  ← unmodified Google originals
  source/apple/                   ← unmodified Apple RGB SVGs
  README.md                       ← provenance + CDN deploy steps
```

| Locale | Google intrinsic | Apple intrinsic | Notes |
|--------|------------------|-----------------|-------|
| `en` | 283×50 | 316×100 | Google `enUS`; Apple `US_UK` |
| `ar` | 936×150 | 318×100 | Google `ar` (3×); Apple `AR` |
| `fr` | 317×50 | 321×100 | Google `frFR`; Apple `FR` |
| `es` | 298×50 | 376×100 | Google `esES`; Apple `ES` |
| `fa` | 308×50 | 316×100 | Google `fa` **official**; Apple = **English fallback** (no FA/IR folder in Apple kit) |

Apple PNGs were rasterized from official RGB SVGs via Playwright (`rasterize-apple-wallet.mjs`) — uniform scale only; **no crop / recolor / redesign**.

Google asset chosen: **`wallet-button`** (complete “Add to Google Wallet” button), not the condensed `add-wallet-badge`.

---

## 2. Five-language Wallet mapping

| Email locale | Google badge file | Apple badge file | Fallback |
|--------------|-------------------|------------------|----------|
| `en` | `official/google/en.png` | `official/apple/en.png` | — |
| `ar` | `official/google/ar.png` | `official/apple/ar.png` | — |
| `fr` | `official/google/fr.png` | `official/apple/fr.png` | — |
| `es` | `official/google/es.png` | `official/apple/es.png` | — |
| `fa` | `official/google/fa.png` | `official/apple/fa.png` (= `en` artwork) | **Apple → English official** |

Unknown locales → English via `walletBadgeLocale()`.

---

## 3. Files changed

| File | Change |
|------|--------|
| `shared/email-kit.js` | `walletActionButtons` → official `<img>` badges by locale; helpers `walletBadgeUrl` / `walletBadgeLocale` |
| `shared/render-emails.js` | Passes `locale: lang` into `walletActionButtons` |
| `emails/festival_ticket_sale.html` | Regenerated EN buyer preview with official badges |
| `assets/wallet/official/**` | New organized badge library + README |
| `qa-output/.../capture-wallet-official-qa.mjs` | 5-locale responsive/RTL QA harness |
| `qa-output/.../rasterize-apple-wallet.mjs` | One-shot SVG→PNG (Apple) |
| `qa-output/.../OFFICIAL_MULTILINGUAL_WALLET_BADGES.md` | This report |
| `qa-output/.../wallet-official-qa-results.json` | Machine QA results (structural/overflow retained; screenshot paths discarded) |
| `qa-output/.../screenshots/wallet-official/` | Visual captures **discarded** 2026-09-25 (dir empty; re-run `capture-wallet-official-qa.mjs` to regenerate) |

**Not changed:** other six reference emails · Figma · backend · Original Design System · production CDN.

---

## 4. Behavior preserved

| Rule | Status |
|------|--------|
| Google badge only when Google pass href present | **PASS** |
| Apple badge only when Apple pass href present | **PASS** |
| Buyer / guest show wallets | **PASS** |
| Organizer / admin omit wallets | **PASS** (organizer capture) |
| Calendar = text links Google \| Apple \| Yahoo | **PASS** |
| `event.ics` / pkpass attachment note retained in preview copy | **PASS** |
| Official artwork not mirrored in RTL | **PASS** |
| Accessible `alt` on badge images | **PASS** |
| No Windows absolute paths in HTML | **PASS** (`../assets/...` or `assetBase`) |

Email display: shared **height 48px** at all viewports. Desktop uses Google **primary** `wallet-button`; ≤620px uses official **condensed** `add-wallet-badge` so 48px fits at 320px (primary FR needs 304px; max usable ~302 with 8dp clear). See `WALLET_BADGE_SIZING_FIX.md`.

---

## 5. Image hosting

| Context | How images are referenced |
|---------|---------------------------|
| Standalone preview (`emails/*.html`) | Relative `../assets/wallet/official/{provider}/{locale}.png` |
| Preview app / QA | `assetBase` prefix (HTTP localhost during Playwright QA) |
| **Production email delivery** | Relative/local paths **will not work** for recipients |

### Required deployment step (NOT executed — needs owner authorization)

1. Upload the 10 PNGs under `assets/wallet/official/{google,apple}/*.png` to Eveenty CDN, e.g.:
   - `https://cdn.eveenty.com/wallet/official/google/{en,ar,fr,es,fa}.png`
   - `https://cdn.eveenty.com/wallet/official/apple/{en,ar,fr,es,fa}.png`
2. Update production `festival_ticket_sale.template` (separate authorized backend change) to select locale-specific CDN URLs instead of the current yellow `google_wallet.png` / `apple_wallet.png`.
3. Do **not** upload or change production without explicit authorization.

---

## 6. Responsive & RTL QA (Level A Chromium)

| Check | Result |
|-------|--------|
| Viewports 800 / 768 / 414 / 375 / 320 | **PASS** (all five locales) |
| Correct localized badge per locale | **PASS** (visual + path checks) |
| Persian Apple English fallback | **PASS** (verified FA desktop) |
| Image proportions / spacing | **PASS** |
| Mobile stack (wallet-btn CSS) | **PASS** (AR/ES 320–375) |
| AR / FA RTL text alignment | **PASS** |
| No `scaleX(-1)` / artwork mirroring | **PASS** |
| No horizontal overflow | **PASS** (0 fails) |
| Blocked-image alt fallback | **PASS** (EN + AR blocked captures) |
| Structural checks | **PASS** (0 fails) |
| Gmail / Outlook / Apple Mail | **NOT RUN** |

**Captures:** `screenshots/wallet-official/` — **DISCARDED** (0 files on disk; were 30 Chromium PNGs)  
**Machine log:** `wallet-official-qa-results.json` (structural/overflow still **PASS**; `screenshot` fields null)

### Key visual samples for owner review

**Unavailable until regenerated.** Former capture basenames (for `capture-wallet-official-qa.mjs` re-run):

| Locale | Desktop | Mobile |
|--------|---------|--------|
| EN | `ticket-sale--en-buyerUser--desktop-800.png` | `ticket-sale--en-buyerUser--mobile-320.png` |
| AR | `ticket-sale--ar-buyerUser-rtl--desktop-800.png` | `ticket-sale--ar-buyerUser-rtl--mobile-375.png` |
| FR | `ticket-sale--fr-buyerUser--desktop-800.png` | `ticket-sale--fr-buyerUser--mobile-375.png` |
| ES | `ticket-sale--es-buyerUser--desktop-800.png` | `ticket-sale--es-buyerUser--mobile-320.png` |
| FA | `ticket-sale--fa-buyerUser-rtl--desktop-800.png` | `ticket-sale--fa-buyerUser-rtl--mobile-375.png` |

---

## 7. Missing language / hosting requirements

| Item | Status |
|------|--------|
| Persian Apple official badge | **Missing in Apple kit** → English official used |
| Production HTTPS hosting of new badges | **Required before send** — assets prepared, upload **blocked pending owner auth** |
| Localized `alt` strings in sample-data | Still English product names (image carries localization); optional copy improvement later |
| Figma Wallet Links sync | **Out of scope this session** (explicitly forbidden) |

---

## 8. Verdict

**READY FOR OWNER REVIEW** — five localized preview variants + machine structural/overflow QA in `qa-output/approved-component-corrections/`. Visual PNG captures were discarded; regenerate via `capture-wallet-official-qa.mjs` if needed for visual review.  
OD-W1 option B implemented in Design Kit HTML only. Production CDN deploy and backend template change remain **owner-gated**.
