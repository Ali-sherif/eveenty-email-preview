# CDN Asset Audit — Eveenty Email Design Kit

> **Audit type:** READ-ONLY inventory + documentation only  
> **Date:** 2026-09-27  
> **Workspace:** `D:\\last\\eveenty-email-preview`  
> **Production backend (read-only):** `D:\\last\\rescounts-backend`  
> **Authorization:** Owner-authorized CDN asset inventory; **no uploads performed**  
> **Scope:** All 48 in-scope, owner-visually-approved HTML Preview designs

## A. Executive summary

All **48** in-scope HTML Preview emails were inspected (static `emails/*.html`, shared renderers under `shared/`, and `assets/`).

**Static assets that must be hosted before production use of the approved kit artwork:**

| Category | Unique files (by SHA-256) | Notes |
|---|---:|---|
| Localized Eveenty logos | **5** | Kit PNGs differ from current production CDN logos (verified by size/hash) |
| Official Wallet badges | **14** | 5 Google primary + 5 Google condensed + 4 unique Apple (fa≡en) |
| **Total upload required** | **19** | See `CDN_UPLOAD_MANIFEST.csv` |

Production already hosts **different** logo and Wallet artwork at `cdn.eveenty.com`. Those URLs are **reachable (HTTP 200 verified this session)** but **must not** be treated as hosts for the approved kit files:

| Production URL | HTTP | Content vs approved kit |
|---|---|---|
| `https://cdn.eveenty.com/eveenty-logo-1280.png` | 200 | Different (1280×523 / 16465 B ≠ kit en 3014×1208 / 83925 B) |
| `https://cdn.eveenty.com/assets/logo_transparent_en.png` | 200 | Different (782×319 / 30973 B ≠ kit en) |
| `https://cdn.eveenty.com/google_wallet.png` | 200 | Obsolete **yellow** Eveenty badge — **not** approved official artwork |
| `https://cdn.eveenty.com/apple_wallet.png` | 200 | Obsolete **yellow** Eveenty badge — **not** approved official artwork |
| `https://cdn.eveenty.com/wallet/official/google/en.png` | **403** | Official kit path **not** hosted yet |

Synthetic fixtures (QR / event image / festival logo samples) are **preview-only** and map to **backend-owned dynamic** images in production — **excluded from upload**.

Social media and calendar actions in approved previews are **text links**, not image assets. No social/calendar icon files are referenced by the 48 approved designs.

## B. Exact count of unique referenced static assets

| Bucket | Count | Definition |
|---|---:|---|
| Unique local static files referenced for production email use (upload candidates, SHA-deduped) | **19** | Logos (5) + Wallet prepared PNGs (14 unique content) |
| Distinct prepared Wallet PNG paths on disk (including fa Apple copy) | **15** | en/ar/fr/es/fa × (google primary + condensed + apple) |
| Distinct logo PNG paths | **5** | en/fr/es/ar/fa |
| Referenced fixture files in approved HTML | **6** | QR / festival image / festival logo samples (PNG+SVG variants) — **not for CDN upload** |
| Wallet `source/` originals on disk | **14** | Archive only; emails use prepared PNGs |
| Unreferenced logo SVG | **1** | `eveenty-logo-en.svg` — not used by approved emails |

**Unique referenced static assets needed for CDN hosting of the approved designs: 19** (content-unique).

## C. Number of files requiring upload

**19** unique files (SHA-256 deduplicated) — listed in `docs/agent/CDN_UPLOAD_MANIFEST.csv` and in the agent response section **FILES TO UPLOAD TO CDN**.

If path-per-locale Apple `fa.png` is uploaded as a separate object despite identical content to `en.png`, the physical object count would be **20**; the manifest correctly uploads **once** and reuses the URL for `fa`.

## D. Number of assets already hosted

**0** approved-kit static assets are already hosted at a verified matching production URL.

Related production CDN objects exist (logos + yellow Wallet badges) but fail content parity with approved kit files. Classification for those production URLs: **related / obsolete — do not reuse for kit migration**.

## E. Number of backend-owned dynamic image types

**6** dynamic types documented (not local static uploads):

1. Event / festival / campaign images  
2. Organizer / festival logos  
3. Ticket / order / coupon QR codes  
4. Production Eveenty brand logo URLs already configured in backend (`GetLocalizedLogoURL` / `RescountsLogo`) — content ≠ kit PNGs  
5. Dispute tracking pixel (`open.gif`-style)  
6. Wallet pass deep links / Apple `pkpass` attachments (not badge images)

## F. Missing assets and broken references

**None.** Every `<img src>` under `assets/` in the 48 approved HTML files resolves to an existing local file.

No `data:` image URIs were found in the 48 HTML previews.  
No `background-image` URL image assets were found in the 48 HTML previews.

Templates without Eveenty branded header logo (by design — marketing campaign shells):

- `festival_marketing_email_target` — festival logo fixture only  
- `festival_rescounts_marketing_email_target` — festival logo fixture only  

All other **46** templates reference `assets/logos/eveenty-logo-en.png` in static HTML; interactive preview can switch locale via `logoUrl()` in `shared/email-kit.js`.

## G. Duplicate assets (SHA-256)

| SHA-256 (prefix) | Paths with identical content | Upload implication |
|---|---|---|
| `12a0dbedcd20…` | `apple/en.png` ≡ `apple/fa.png` | Upload **one**; use for en + fa (approved Persian Apple fallback) |
| `2ae7a2615b83…` | `google/en.png` ≡ `source/google/enUS_…_wallet-button.png` | Upload prepared path only; source is archive |
| `fd8cb2b91c04…` | `google/condensed/en.png` ≡ `source/google/enUS_…_add-wallet-badge.png` | Same |
| `99033534d001…` | `google/ar.png` ≡ source ar wallet-button | Same |
| `159b3863b098…` | `google/condensed/ar.png` ≡ source ar add-wallet-badge | Same |
| `3c458bb69e64…` | `google/fr.png` ≡ source frFR wallet-button | Same |
| `e1d367a8ee6e…` | `google/condensed/fr.png` ≡ source frFR add-wallet-badge | Same |
| `13c23f3bcbc7…` | `google/es.png` ≡ source esES wallet-button | Same |
| `a551e02dde2d…` | `google/condensed/es.png` ≡ source esES add-wallet-badge | Same |
| `28c80c8f6dde…` | `google/fa.png` ≡ source fa wallet-button | Same |
| `1d93edbaa0b7…` | `google/condensed/fa.png` ≡ source fa add-wallet-badge | Same |

No kit logo PNGs share hashes with each other or with downloaded production CDN logos.

## H. Complete Wallet badge inventory

Template: **`festival_ticket_sale` only** (verified in static HTML + `walletActionButtons` in `shared/email-kit.js` / `shared/render-emails.js`).

Supported kit locales: **en, ar, fr, es, fa**.  
Display: shared height **48px**; Google **primary** on wide viewports; Google **condensed** at **≤620px** / narrow mobile; Apple always; no RTL mirroring of artwork.

| Variant | Locale | Relative path | Intrinsic |
|---|---|---|---|
| google-primary | en | `assets/wallet/official/google/en.png` | 283×50 |
| google-primary | ar | `assets/wallet/official/google/ar.png` | 936×150 |
| google-primary | fr | `assets/wallet/official/google/fr.png` | 317×50 |
| google-primary | es | `assets/wallet/official/google/es.png` | 298×50 |
| google-primary | fa | `assets/wallet/official/google/fa.png` | 308×50 |
| google-condensed | en | `assets/wallet/official/google/condensed/en.png` | 199×55 |
| google-condensed | ar | `assets/wallet/official/google/condensed/ar.png` | 199×55 |
| google-condensed | fr | `assets/wallet/official/google/condensed/fr.png` | 199×55 |
| google-condensed | es | `assets/wallet/official/google/condensed/es.png` | 199×55 |
| google-condensed | fa | `assets/wallet/official/google/condensed/fa.png` | 213×55 |
| apple | en | `assets/wallet/official/apple/en.png` | 316×100 |
| apple | ar | `assets/wallet/official/apple/ar.png` | 318×100 |
| apple | fr | `assets/wallet/official/apple/fr.png` | 321×100 |
| apple | es | `assets/wallet/official/apple/es.png` | 376×100 |
| apple | fa | `assets/wallet/official/apple/fa.png` | 316×100 (English artwork fallback; identical SHA to en) |

**Obsolete yellow production badges (do NOT upload / do NOT use for approved design):**

- `https://cdn.eveenty.com/google_wallet.png` (HTTP 200; 335×48; yellow Eveenty chrome)  
- `https://cdn.eveenty.com/apple_wallet.png` (HTTP 200; 335×48; yellow Eveenty chrome)  

Still referenced by current production `email/templates/festival_ticket_sale.template` — replacement with official badges is a **separately authorized** production migration task.

## I. Assets excluded from CDN upload

| Asset / class | Reason |
|---|---|
| All `assets/fixtures/*` | Synthetic preview stand-ins for dynamic backend images/QR |
| All `assets/wallet/official/source/*` | Provider source archive; emails use prepared PNGs |
| `assets/logos/eveenty-logo-en.svg` | Not referenced by approved email HTML (PNG used) |
| Production yellow Wallet CDN URLs | Obsolete relative to approved official badges |
| Production social icon CDN assets (`MaskGroup*.png`, `fb.png`, `icon_*.png`, etc.) | Used by **production** templates; **not** referenced by approved HTML Preview designs (previews use text social links) |
| Production `background.png`, `paid-image-opacity-30.png`, `car.png`, etc. | Production-only decorative assets; not in approved kit HTML |
| QA screenshots under `qa-output/` | Explicitly excluded |

## J. Unresolved questions

1. **Logo migration policy:** Should production switch from `logo_transparent_{lang}.png` / `eveenty-logo-1280.png` to the approved kit `eveenty-logo-{lang}.png` files, or keep production logos and accept visual divergence from HTML Preview?  
2. **CDN URL scheme:** Confirm proposed folder `/eveenty/email-assets/...` vs root `cdn.eveenty.com/wallet/official/...` (suggested in `assets/wallet/official/README.md`).  
3. **Apple `fa`:** Host a single `apple/en.png` object and point fa at it, or also publish `apple/fa.png` as an alias/copy?  
4. **Network:** Official path probe returned **403** (not 404) — confirm CDN auth/routing behavior before upload.  
5. **Level B client testing** still **NOT RUN** — CDN hosting does not close Gmail/Outlook/Apple Mail verification.

## K. Proposed CDN folder structure (no uploads performed)

```
https://cdn.eveenty.com/eveenty/email-assets/
  logos/
    eveenty-logo-en.png
    eveenty-logo-fr.png
    eveenty-logo-es.png
    eveenty-logo-ar.png
    eveenty-logo-fa.png
  wallet/official/
    google/
      en.png
      ar.png
      fr.png
      es.png
      fa.png
      condensed/
        en.png
        ar.png
        fr.png
        es.png
        fa.png
    apple/
      en.png          # also serves fa fallback
      ar.png
      fr.png
      es.png
```

Alternative (from Wallet README, equally valid pending owner choice):

```
https://cdn.eveenty.com/wallet/official/google/{en,ar,fr,es,fa}.png
https://cdn.eveenty.com/wallet/official/google/condensed/{locale}.png
https://cdn.eveenty.com/wallet/official/apple/{locale}.png
```

## Validation checklist

| Check | Result |
|---|---|
| All 48 approved templates considered | **PASS** — `inscope_count=48` |
| Every referenced local image resolved or flagged | **PASS** — missing files = 0 |
| No QA screenshot in upload manifest | **PASS** |
| No synthetic QR fixture classified as upload | **PASS** |
| No obsolete yellow Wallet artwork in upload list | **PASS** |
| Shared assets once in upload manifest (SHA dedupe) | **PASS** — 19 rows |
| Every recommended upload file exists | **PASS** |
| “Already hosted” claims have evidence | **PASS** — none claimed as matching; related prod URLs verified HTTP 200 but content mismatch documented |

## Appendix — templates using Eveenty logo (static HTML)

**46 templates** reference `eveenty-logo-en.png`. Locale variants are required for multilingual `logoUrl()` / production localization.

**Without Eveenty logo header:** festival_marketing_email_target, festival_rescounts_marketing_email_target.

## Appendix — fixture usage (excluded from upload)

| Fixture | Templates (static HTML) |
|---|---|
| `qr-sample.png` | festival_activity_sale, festival_add_on_sale, festival_vendor_sale, partner_coupons, partner_coupons_partner |
| `qr-sample.svg` | festival_ticket_sale |
| `festival-image-sample.png` | festival_add_on_sale, festival_marketing_approval, festival_rescounts_marketing_email_target |
| `festival-image-sample.svg` | festival_marketing_email_target |
| `festival-logo-sample.png` | festival_marketing_approval, festival_rescounts_marketing_email_target |
| `festival-logo-sample.svg` | festival_marketing_email_target |

## Appendix — production backend static image host (read-only)

- Config default CDN base: `https://cdn.eveenty.com` (`config/env.go`)  
- Default logo flag: `https://cdn.eveenty.com/eveenty-logo-1280.png` (`email/smtp_render_template.go`)  
- Localized logo helper: `https://cdn.eveenty.com/assets/logo_transparent_%s.png` (`email/utils/utils.go` — en/ar/fa/fr/es)  
- Current ticket-sale Wallet badges: yellow `google_wallet.png` / `apple_wallet.png` in `festival_ticket_sale.template`

---

**STOP.** No uploads, backend changes, HTML edits, commits, or deploys were performed. Wait for explicit owner authorization before any CDN upload.
