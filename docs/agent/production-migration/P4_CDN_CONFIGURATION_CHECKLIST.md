# P4 CDN CONFIGURATION CHECKLIST — where to insert real kit CDN URLs

**Date:** 2026-09-28  
**Status:** READY FOR INFRA URL INSERTION — no URLs invented; no upload performed  
**Audience:** Owner / Infra / Backend operator inserting final kit CDN bases

Kit templates and Go resolvers already build absolute asset URLs as:

`{EMAIL_KIT_CDN_BASE_URL}` + `/eveenty/email-assets/...`

**You do not edit template HTML or Go object-key maps when the real CDN host arrives.**  
Insert only the environment base URL(s) into config.

---

## 1. Values you must supply (PENDING)

| # | Config key | Where to set it | Current value | Insert |
|---|---|---|---|---|
| 1 | `EMAIL_KIT_CDN_BASE_URL` | Production deploy secrets / env (same source as other `envconfig` vars) | **empty / unset** | Production kit CDN **origin only** (https, no trailing slash), e.g. `https://cdn-kit.example.com` — **Infra supplies final host** |
| 2 | `EMAIL_KIT_CDN_BASE_URL` | Staging deploy secrets / env **if** a Staging env exists later | **empty / unset** | Staging kit CDN origin only — **never** the Production value |
| 3 | `EMAIL_KIT_ENABLED` | Same env files as above | **`false` (default)** | Set `true` only when release gates allow live cutover (see activation procedure) |

**Owner workflow note (2026-09-28):** No Staging environment today. Do **not** block implementation on Staging. When only Production exists, fill row 1 only. Row 2 remains for a future Staging deploy.

---

## 2. Exact insertion points (verified)

| Location | What to change | What NOT to change |
|---|---|---|
| Runtime env / secrets store for the backend process | Set `EMAIL_KIT_CDN_BASE_URL` and (later) `EMAIL_KIT_ENABLED` | — |
| `rescounts-backend/.env.example` | Already documents keys with empty CDN + `EMAIL_KIT_ENABLED=false` | Do not put a real host in the committed example unless Backend policy allows |
| `rescounts-backend/config/env.go` | Already binds `EMAIL_KIT_CDN_BASE_URL` / `EMAIL_KIT_ENABLED` | Do not hardcode a host in Go |
| `email/utils/kit_assets.go` | Object keys under `/eveenty/email-assets/` already defined | Do not rewrite keys unless Infra changes the prefix |
| `email/templates/kit/**` | Asset `src` come from Send* params / resolver | **Do not** paste CDN hosts into templates |
| Local unit / snapshot tests | Keep using `https://kit-cdn.invalid` via harness only | **Never** set real env `EMAIL_KIT_CDN_BASE_URL=https://kit-cdn.invalid` — activation guard rejects `.invalid` |

---

## 3. Fourteen objects that must exist under the base

After upload, each GET `{BASE}{object_key}` must return HTTPS 200, `image/png`, SHA-256 match vs `docs/agent/CDN_UPLOAD_MANIFEST.csv`.

| asset_id | Object key (appended to base) |
|---|---|
| logo_en | `/eveenty/email-assets/logos/eveenty-logo-en.png` |
| logo_fr | `/eveenty/email-assets/logos/eveenty-logo-fr.png` |
| logo_es | `/eveenty/email-assets/logos/eveenty-logo-es.png` |
| logo_ar | `/eveenty/email-assets/logos/eveenty-logo-ar.png` |
| logo_fa | `/eveenty/email-assets/logos/eveenty-logo-fa.png` |
| wallet_google-condensed_en | `/eveenty/email-assets/wallet/official/google/condensed/en.png` |
| wallet_google-condensed_ar | `/eveenty/email-assets/wallet/official/google/condensed/ar.png` |
| wallet_google-condensed_fr | `/eveenty/email-assets/wallet/official/google/condensed/fr.png` |
| wallet_google-condensed_es | `/eveenty/email-assets/wallet/official/google/condensed/es.png` |
| wallet_google-condensed_fa | `/eveenty/email-assets/wallet/official/google/condensed/fa.png` |
| wallet_apple_en | `/eveenty/email-assets/wallet/official/apple/en.png` |
| wallet_apple_ar | `/eveenty/email-assets/wallet/official/apple/ar.png` |
| wallet_apple_fr | `/eveenty/email-assets/wallet/official/apple/fr.png` |
| wallet_apple_es | `/eveenty/email-assets/wallet/official/apple/es.png` |

Prefix `/eveenty/email-assets` is proposed in code; if Infra uses a different prefix, Backend must update `kitAssetObjectPrefix` in `email/utils/kit_assets.go` **once** — templates still need no host edits.

---

## 4. Forbidden values

| Value | Why |
|---|---|
| `https://kit-cdn.invalid` | Test-only; activation guard fail-closes; never customer-facing |
| Empty string with `EMAIL_KIT_ENABLED=true` | Fail-closed → legacy remains selected |
| `http://…` | Resolver requires https |
| Production base in a Staging process (or reverse) | Owner decision: never cross-wire |
| Hardcoded host inside `email/templates/kit/*.template` | Breaks env separation; URLs must come from config |

---

## 5. After URLs are inserted (operator order)

1. Upload 14 files to the host (Infra).  
2. Verify each object (HTTPS 200 / image/png / SHA-256).  
3. Set `EMAIL_KIT_CDN_BASE_URL` for that environment only — **leave `EMAIL_KIT_ENABLED=false`**.  
4. Restart / redeploy backend; confirm log: `email kit activation: LEGACY selected` (CDN present but switch still off is OK).  
5. Complete external release gates (see `P4_ACTIVATION_PREP_REPORT.md`).  
6. Only then set `EMAIL_KIT_ENABLED=true` and restart — all 48 kit templates activate together.  
7. Rollback: set `EMAIL_KIT_ENABLED=false` (or unset) and restart.

---

## 6. Explicit non-claims

- No real CDN URL is recorded in this checklist.  
- No CDN upload performed in P4 prep.  
- No customer emails sent.  
- Setting the base URL alone does **not** activate kit mail (`EMAIL_KIT_ENABLED` remains false by default).
