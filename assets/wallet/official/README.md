# Official multilingual Wallet badges

Prepared for Email Design Kit previews (`festival_ticket_sale` only).

## Owner-approved display policy (2026-09-27 FINAL)

**Google Wallet Condensed ONLY** at all viewport widths (desktop, tablet, mobile).

- Do **not** use Google Wallet Primary in the approved `festival_ticket_sale` design.
- Primary PNGs under `google/{locale}.png` remain on disk as **unused reference** assets — do not delete; do **not** upload to CDN.
- Apple Wallet badges remain locale-specific; Persian (`fa`) reuses the English Apple artwork.
- Shared display height **48px**; widths follow each asset’s intrinsic aspect ratio — never crop, stretch, or force identical widths.

## Layout

| Path | Contents | Active in approved design? |
|------|----------|----------------------------|
| `google/condensed/{en,ar,fr,es,fa}.png` | Official Google **condensed** `add-wallet-badge` PNGs | **Yes** — sole Google variant |
| `google/{en,ar,fr,es,fa}.png` | Official Google **primary** `wallet-button` PNGs | **No** — retained locally; not CDN-upload |
| `apple/{en,ar,fr,es}.png` | Official Apple RGB badges (PNG) | **Yes** |
| `apple/fa.png` | Copy of English Apple artwork | Local alias; CDN reuses `apple/en.png` |
| `source/google/` | Unmodified originals from Google brand pack | Archive only |
| `source/apple/` | Unmodified official Apple RGB SVGs | Archive only |

## Locale mapping

| Kit locale | Google (approved) | Apple | Notes |
|------------|-------------------|-------|-------|
| `en` | `condensed/en.png` | `en.png` | |
| `ar` | `condensed/ar.png` | `ar.png` | |
| `fr` | `condensed/fr.png` | `fr.png` | |
| `es` | `condensed/es.png` | `es.png` | Spain Spanish |
| `fa` | `condensed/fa.png` | **English** `en.png` | No Persian Apple badge in official kit |

## Display sizing

- Shared display **height 48px** (Google minimum; Apple onscreen min 40px).
- Width from each asset’s intrinsic aspect ratio — never crop/stretch/redraw.
- Google Condensed + Apple at **all** widths (no Primary↔Condensed media-query swap).
- Wallet section cancels nested `stack-pad` on mobile; outer horizontal pad → 0; 8px wallet clear space retained.

## Production hosting (NOT done — needs owner authorization)

Active CDN upload inventory is **14 unique files** (see `docs/agent/CDN_UPLOAD_MANIFEST.csv`):

- 5 localized Eveenty logos
- 5 Google Wallet Condensed
- 4 Apple Wallet (`en`/`ar`/`fr`/`es`; `fa` reuses `en`)

Do **not** upload Google Primary, yellow production badges, fixtures, or QA screenshots.

Do **not** upload or change production hosting without explicit owner authorization.
Preview HTML uses relative `assets/wallet/official/…` paths via `assetBase` (local preview only).
