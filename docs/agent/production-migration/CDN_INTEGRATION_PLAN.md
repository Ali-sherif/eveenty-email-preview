# CDN INTEGRATION PLAN — Phase 0

**Date:** 2026-09-27  
**Upload status:** Not performed. **No invented kit URLs.**  
**Active inventory:** 14 unique files — `docs/agent/CDN_UPLOAD_MANIFEST.csv`  
**Audit:** `docs/agent/CDN_ASSET_AUDIT.md`

---

## 1. Environment bases (owner decision 4)

| Environment | Kit asset base URL | Status |
|---|---|---|
| Production | _(to be supplied by Infra)_ | **PENDING (Production)** |
| Staging | _(to be supplied by Infra)_ | **PENDING (Staging)** |

Rules:

- One base per environment.
- Staging must never resolve kit assets from the Production base.
- Production must never resolve kit assets from the Staging base.
- Fail-closed: if any required kit asset URL for the active environment is missing/empty, kit email render/send for templates that need that asset must not proceed with a fallback to the other environment or to obsolete yellow badges.

Existing production hosts such as `https://cdn.eveenty.com/...` may be quoted only as **legacy/obsolete** relative to approved kit artwork.

---

## 2. Asset map (manifest → relative path → locale)

| asset_id | Relative path | Locale resolution |
|---|---|---|
| logo_en | `assets/logos/eveenty-logo-en.png` | `en`; also admin forced `en`; unknown profile language → `en` |
| logo_fr | `assets/logos/eveenty-logo-fr.png` | `fr` |
| logo_es | `assets/logos/eveenty-logo-es.png` | `es` |
| logo_ar | `assets/logos/eveenty-logo-ar.png` | `ar` |
| logo_fa | `assets/logos/eveenty-logo-fa.png` | `fa` |
| wallet_google-condensed_en | `assets/wallet/official/google/condensed/en.png` | `en` |
| wallet_google-condensed_ar | `assets/wallet/official/google/condensed/ar.png` | `ar` |
| wallet_google-condensed_fr | `assets/wallet/official/google/condensed/fr.png` | `fr` |
| wallet_google-condensed_es | `assets/wallet/official/google/condensed/es.png` | `es` |
| wallet_google-condensed_fa | `assets/wallet/official/google/condensed/fa.png` | `fa` |
| wallet_apple_en | `assets/wallet/official/apple/en.png` | `en`; **`fa` → en** (approved fallback; do not upload duplicate) |
| wallet_apple_ar | `assets/wallet/official/apple/ar.png` | `ar` |
| wallet_apple_fr | `assets/wallet/official/apple/fr.png` | `fr` |
| wallet_apple_es | `assets/wallet/official/apple/es.png` | `es` |

**Logos:** new approved kit logos only (owner decision 2).  
**Google Wallet:** Condensed only (owner decision 5). Google Primary is local reference only — not uploaded.  
**Proposed object key prefix (non-binding until Infra confirms):** `/eveenty/email-assets/` under each environment base (see audit). Final keys are Infra-owned.

Kit URL formula (conceptual — bases PENDING):

`{ENV_KIT_CDN_BASE}/{object_key}`

Do not write concrete hostnames into kit templates until Infra supplies both bases.

---

## 3. Verification checklist (per environment host)

For **each** of the 14 objects on **both** Production and Staging:

| Check | Required result |
|---|---|
| HTTPS GET | 200 |
| `Content-Type` | `image/png` (or equivalent image/png) |
| Body SHA-256 | Exact match to `CDN_UPLOAD_MANIFEST.csv` `sha256` column |
| No cross-env | Object retrieved from that environment’s base only |

Status today: **NOT RUN** (no upload).

---

## 4. Static vs dynamic assets

### Static (kit CDN — 14 files)

- Localized Eveenty logos (5)
- Google Wallet Condensed (5)
- Apple Wallet (4 unique; fa reuses en)

Templates without Eveenty branded header (by design): `festival_marketing_email_target`, `festival_rescounts_marketing_email_target` — no `logo_*` requirement for those shells.

### Dynamic / backend-generated (not kit CDN uploads)

| Type | Source (verified pattern) | Notes |
|---|---|---|
| QR images | `utils.GetImageLink` → `ImageID.GetFullURL` (`model/image.go:15–16` uses `config.AppConfig.CdnURL`) | Backend-generated |
| Festival / event / campaign images | Same image-service / CdnURL pattern or caller URL | Backend-generated |
| OrganizerLogo | `GetImageLink` in Send* params | Backend-generated |
| Tracking pixels | Backend-built URL fields (e.g. dispute) | Backend-generated |
| GoogleWalletPassLink | Deep link string in ticket data | Not a badge image |
| Apple pkpass | MIME `cid:ticket-N.pkpass` + base64 part | Attachment, not CDN badge |
| PDF waivers/contracts | `config.AppConfig.CdnURL` + path (`email/utils/activity.go`, `contract.go`) | Backend-generated |
| Obsolete yellow Wallet PNGs | legacy/obsolete production URLs | Must not be used in kit templates |

---

## 5. Fail-closed policy

Before kit activation in an environment:

1. Base URL configured for that deploy target only (Staging deploy uses Staging base; Production deploy uses Production base). Owner may run Production-only if no Staging exists — still never cross-wire bases when both exist.
2. All required asset URLs for templates being activated resolve (for all-48 activation: all 14 on that host).
3. If any required URL is missing → do not activate / do not send kit-rendered mail that depends on it.
4. **P4 (implemented):** `EMAIL_KIT_CDN_BASE_URL` equal to `https://kit-cdn.invalid` or any `.invalid` host is **not** eligible for live activation. That host remains test-only for local render/snapshots. Customer-facing environments must use the real Infra base.

Exact enforcement hook: `utils.KitAssetsEligibleForActivation` + `EvaluateKitActivation` / `applyKitActivationGuard` in `rescounts-backend`.

Operator paste map: `P4_CDN_CONFIGURATION_CHECKLIST.md`.

---

## 6. Locale notes (not Wallet-global)

Per-template email locales come from backend Send* / `GetValidProfileLanguage` evidence (see matrix). Wallet badge locale coverage (en/ar/fr/es/fa) applies only where Wallet badges are rendered (`festival_ticket_sale`), not as a global language matrix for all 48.
