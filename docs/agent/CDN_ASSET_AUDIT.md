# CDN Asset Audit — Eveenty Email Design Kit

> **Audit type:** Inventory + documentation (owner-authorized Wallet Condensed-only update 2026-09-27)  
> **Date:** 2026-09-27 (active inventory supersedes earlier same-day 19-file proposal)  
> **Workspace:** `D:\\last\\eveenty-email-preview`  
> **Production backend (read-only):** `D:\\last\\rescounts-backend`  
> **Authorization:** Owner FINAL Wallet design decision (Google Condensed ONLY) + CDN inventory update; **no uploads performed**  
> **Scope:** `festival_ticket_sale` Wallet mapping + CDN upload inventory for approved kit static assets

## SUPERSEDED notice

The earlier proposed **19-file** CDN upload inventory (5 logos + 5 Google Primary + 5 Google Condensed + 4 Apple) is **SUPERSEDED** by the owner's FINAL design decision of **2026-09-27**:

> Use official Google Wallet **Condensed** badges exclusively at ALL viewport widths.  
> Do not use Google Wallet Primary in the approved `festival_ticket_sale` design.

Active upload inventory is now **exactly 14 unique files**. Historical audit findings below (production CDN parity checks, fixture exclusions, yellow-badge obsolescence) remain valid evidence and are preserved. Primary-only / Condensed-only experiment reports under `qa-output/` remain historical evidence only — do not re-run those experiments.

## A. Executive summary

**Static assets that must be hosted before production use of the approved kit artwork:**

| Category | Unique files (by SHA-256) | Notes |
|---|---:|---|
| Localized Eveenty logos | **5** | Kit PNGs differ from current production CDN logos |
| Official Google Wallet Condensed | **5** | en/ar/fr/es/fa — sole approved Google variant |
| Official Apple Wallet | **4** | en/ar/fr/es; Persian reuses English |
| **Total upload required** | **14** | See `CDN_UPLOAD_MANIFEST.csv` |

**Removed from active upload list (retained on disk as unused reference):**

| Category | Files | Status |
|---|---:|---|
| Google Wallet Primary | **5** | Local reference only — **not** for CDN upload |

Production already hosts **different** logo and Wallet artwork at `cdn.eveenty.com`. Those URLs are **reachable (HTTP 200 verified earlier session)** but **must not** be treated as hosts for the approved kit files:

| Production URL | HTTP | Content vs approved kit |
|---|---|---|
| `https://cdn.eveenty.com/eveenty-logo-1280.png` | 200 | Different (≠ kit logos) |
| `https://cdn.eveenty.com/assets/logo_transparent_en.png` | 200 | Different (≠ kit logos) |
| `https://cdn.eveenty.com/google_wallet.png` | 200 | Obsolete **yellow** Eveenty badge — **not** approved |
| `https://cdn.eveenty.com/apple_wallet.png` | 200 | Obsolete **yellow** Eveenty badge — **not** approved |
| `https://cdn.eveenty.com/wallet/official/google/condensed/en.png` | **403 / not hosted** | Official kit path **not** hosted yet |

**No assets have been uploaded yet. Actual CDN URLs remain pending.**

Synthetic fixtures (QR / event image / festival logo samples) are **preview-only** — **excluded from upload**.  
Obsolete yellow Wallet badges are **not** upload candidates.

## B. Exact count of unique referenced static assets

| Bucket | Count | Definition |
|---|---:|---|
| Unique local static files required for CDN (active upload inventory) | **14** | Logos (5) + Google Condensed (5) + Apple (4 unique) |
| Google Primary prepared PNGs on disk | **5** | Retained locally; **excluded** from active upload |
| Distinct logo PNG paths | **5** | en/fr/es/ar/fa |
| Referenced fixture files in approved HTML | **6** | QR / festival image / festival logo samples — **not for CDN upload** |
| Wallet `source/` originals on disk | **14** | Archive only; emails use prepared PNGs |

**Unique referenced static assets needed for CDN hosting of the approved designs: 14** (content-unique).

## C. Number of files requiring upload

**14** unique files — listed in `docs/agent/CDN_UPLOAD_MANIFEST.csv`.

Groups:

- **A. Localized Eveenty logos — 5**
- **B. Google Wallet Condensed — 5**
- **C. Apple Wallet — 4** (`en` also serves `fa`)

## D. Number of assets already hosted

**0** approved-kit static assets are already hosted at a verified matching production URL.

Related production CDN objects exist (logos + yellow Wallet badges) but fail content parity with approved kit files. Classification: **related / obsolete — do not reuse for kit migration**.

## E. Number of backend-owned dynamic image types

**6** dynamic types documented (not local static uploads):

1. Event / festival / campaign images  
2. Organizer / festival logos  
3. Ticket / order / coupon QR codes  
4. Production Eveenty brand logo URLs already configured in backend — content ≠ kit PNGs  
5. Dispute tracking pixel (`open.gif`-style)  
6. Wallet pass deep links / Apple `pkpass` attachments (not badge images)

## F. Missing assets and broken references

**None** for the active Condensed-only `festival_ticket_sale` Wallet paths and logo set.

Templates without Eveenty branded header logo (by design — marketing campaign shells):

- `festival_marketing_email_target` — festival logo fixture only  
- `festival_rescounts_marketing_email_target` — festival logo fixture only  

## G. Duplicate assets (SHA-256)

| SHA-256 (prefix) | Paths with identical content | Upload implication |
|---|---|---|
| `12a0dbedcd20…` | `apple/en.png` ≡ `apple/fa.png` | Upload **one** (`en.png`); map `fa` to the same CDN URL |
| Condensed prepared ≡ `source/google` add-wallet-badge | Same content as archive | Upload prepared condensed path only |

Google Primary prepared ↔ source `wallet-button` duplicates remain on disk but are **not** in the active upload manifest.

## H. Complete Wallet badge inventory (`festival_ticket_sale`)

Supported kit locales: **en, ar, fr, es, fa**.  
Display: shared height **48px**; Google **Condensed only** at all widths; Apple always; no RTL mirroring of artwork.

| Variant | Locale | Relative path | Active? | Intrinsic |
|---|---|---|---|---|
| google-condensed | en | `assets/wallet/official/google/condensed/en.png` | **Yes — upload** | 199×55 |
| google-condensed | ar | `assets/wallet/official/google/condensed/ar.png` | **Yes — upload** | 199×55 |
| google-condensed | fr | `assets/wallet/official/google/condensed/fr.png` | **Yes — upload** | 199×55 |
| google-condensed | es | `assets/wallet/official/google/condensed/es.png` | **Yes — upload** | 199×55 |
| google-condensed | fa | `assets/wallet/official/google/condensed/fa.png` | **Yes — upload** | 213×55 |
| google-primary | en–fa | `assets/wallet/official/google/{locale}.png` | **No — local reference only** | (retained) |
| apple | en | `assets/wallet/official/apple/en.png` | **Yes — upload** (also fa) | 316×100 |
| apple | ar | `assets/wallet/official/apple/ar.png` | **Yes — upload** | 318×100 |
| apple | fr | `assets/wallet/official/apple/fr.png` | **Yes — upload** | 321×100 |
| apple | es | `assets/wallet/official/apple/es.png` | **Yes — upload** | 376×100 |
| apple | fa | `assets/wallet/official/apple/fa.png` | Local alias of en; CDN reuses en | 316×100 |

**Obsolete yellow production badges (do NOT upload / do NOT use):**

- `https://cdn.eveenty.com/google_wallet.png`  
- `https://cdn.eveenty.com/apple_wallet.png`  

Still referenced by current production `festival_ticket_sale.template` — replacement is a **separately authorized** production migration task.

## I. Assets excluded from CDN upload

| Asset / class | Reason |
|---|---|
| Google Wallet Primary (`assets/wallet/official/google/{en,ar,fr,es,fa}.png`) | SUPERSEDED by Condensed-only owner decision; retain locally |
| All `assets/fixtures/*` | Synthetic preview stand-ins |
| All `assets/wallet/official/source/*` | Provider source archive |
| `assets/logos/eveenty-logo-en.svg` | Not referenced by approved email HTML |
| Production yellow Wallet CDN URLs | Obsolete relative to approved official badges |
| Production social icon CDN assets | Not referenced by approved HTML Preview designs |
| QA screenshots under `qa-output/` | Explicitly excluded |

## J. Unresolved questions

1. **Logo migration policy:** Switch production logos to kit PNGs, or keep production logos?  
2. **CDN URL scheme:** `/eveenty/email-assets/...` vs root `cdn.eveenty.com/wallet/official/...`  
3. **Network:** Official path probe previously returned **403** — confirm CDN auth/routing before upload.  
4. **Level B client testing** still **NOT RUN** — CDN hosting does not close Gmail/Outlook/Apple Mail verification.

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

Do **not** publish Google Primary under `wallet/official/google/{locale}.png` for the approved Condensed-only design.

## Validation checklist

| Check | Result |
|---|---|
| Active upload inventory exactly 14 unique files | **PASS** |
| Google Primary removed from active upload manifest | **PASS** — retained on disk only |
| No QA screenshot in upload manifest | **PASS** |
| No synthetic QR fixture classified as upload | **PASS** |
| No obsolete yellow Wallet artwork in upload list | **PASS** |
| Apple fa mapped to English upload object | **PASS** |
| Every recommended upload file exists | **PASS** |
| Earlier 19-file inventory marked SUPERSEDED | **PASS** |
| No CDN upload performed | **PASS** |
| Actual CDN URLs pending | **PASS** |

## Appendix — production backend static image host (read-only)

- Config default CDN base: `https://cdn.eveenty.com`  
- Current ticket-sale Wallet badges in production: yellow `google_wallet.png` / `apple_wallet.png`  
- Approved kit migration (Condensed Google + official Apple + kit logos) requires separate owner CDN upload authorization

---

**STOP.** No uploads, backend changes, Figma edits, commits, or deploys were performed for CDN hosting. Wait for explicit owner authorization before any CDN upload.
