# Official multilingual Wallet badges

Prepared for Email Design Kit previews (`festival_ticket_sale` only).

## Layout

| Path | Contents |
|------|----------|
| `google/{en,ar,fr,es,fa}.png` | Official Google **primary** `wallet-button` PNGs |
| `google/condensed/{en,ar,fr,es,fa}.png` | Official Google **condensed** `add-wallet-badge` PNGs (≤620px / 320px) |
| `apple/{en,ar,fr,es,fa}.png` | Official Apple RGB badges rasterized from SVG (email-safe PNG) |
| `source/google/` | Unmodified originals from Google brand pack (both variants) |
| `source/apple/` | Unmodified official Apple RGB SVGs |

## Locale mapping

| Kit locale | Google primary | Google condensed | Apple source | Notes |
|------------|----------------|------------------|--------------|-------|
| `en` | `enUS_…_wallet-button` | `enUS_…_add-wallet-badge` | `US_UK` RGB SVG → PNG | |
| `ar` | `ar_…_wallet-button` | `ar_…_add-wallet-badge` | `AR` RGB SVG → PNG | |
| `fr` | `frFR_…_wallet-button` | `frFR_…_add-wallet-badge` | `FR` RGB SVG → PNG | |
| `es` | `esES_…_wallet-button` | `esES_…_add-wallet-badge` | `ES` RGB SVG → PNG | Spain Spanish |
| `fa` | `fa_…_wallet-button` | `fa_…_add-wallet-badge` | **English** `US_UK` PNG | No Persian Apple badge in official kit |

## Display sizing

- Shared display **height 48px** (Google minimum; Apple onscreen min 40px).
- Width from each asset’s intrinsic aspect ratio — never crop/stretch/redraw.
- Desktop: Google **primary** + Apple.
- ≤620px: Google switches to official **condensed** (Google guidelines: use condensed when space is limited) so 48px fits at 320px with ≥8px clear space.
- Wallet section cancels nested `stack-pad` on mobile; outer horizontal pad → 0; 8px wallet clear space retained.

## Production hosting (NOT done — needs owner authorization)

Upload primary + condensed Google PNGs and Apple PNGs to Eveenty CDN, then point production templates at HTTPS URLs, e.g.:

```
https://cdn.eveenty.com/wallet/official/google/en.png
https://cdn.eveenty.com/wallet/official/google/condensed/en.png
https://cdn.eveenty.com/wallet/official/apple/en.png
… (ar, fr, es, fa)
```

Do **not** upload or change production hosting without explicit owner authorization.
Preview HTML uses relative `assets/wallet/official/…` paths via `assetBase` (local preview only).
