# P4 CDN CONFIGURATION CHECKLIST — where to insert real kit CDN URLs

**Date:** 2026-09-28 (updated: owner flat CDN keys confirmed for **dev and production**)  
**Status:** OBJECT KEYS CONFIRMED (identical on both hosts) — base host still comes from `config.CdnURL`  
**Audience:** Owner / Infra / Backend operator

Kit templates and Go resolvers build absolute asset URLs as:

`{config.CdnURL}` + object key

**You do not paste hosts into template HTML.** Object keys are defined once in `email/utils/kit_assets.go`.

There is **no** `EMAIL_KIT_ENABLED` runtime toggle. Release control is **DEV → verify → merge/deploy**. When the deployed process has a usable `CdnURL` and all 48 kit templates parse, Kit is selected for IN_SCOPE templates automatically.

---

## 1. CDN base (already wired)

| Env | `config.CdnURL` (from `setEnvURLs`) | Status |
|---|---|---|
| development / staging | `https://cdn-dv.eveenty.com` | **Verified 2026-09-28** — all kit objects return HTTPS 200 `image/png` |
| production | `https://cdn.eveenty.com` | **Same object keys** (owner confirmed) — upload/verify objects before cutover |

No separate `EMAIL_KIT_CDN_BASE_URL` is required in current Backend code; kit assets use `config.CdnURL`.

---

## 2. Exact insertion points (verified)

| Location | What to change | What NOT to change |
|---|---|---|
| Runtime `CdnURL` via `GO_ENV` / `setEnvURLs` | Already set per environment | Do not add a Kit on/off flag |
| `email/utils/kit_assets.go` | Flat object keys (confirmed below) | Do not hardcode CDN hosts in templates |
| `email/templates/kit/**` | Asset `src` come from Send* params / resolver | **Do not** paste CDN hosts into templates |
| Local unit / snapshot tests | Use `https://cdn.snapshot.invalid` via harness only | Never point live env at the snapshot host |

---

## 3. Fourteen objects under the CDN base (owner-confirmed flat keys)

After upload, each GET `{CdnURL}{object_key}` must return HTTPS 200, `image/png`.

| asset_id | Object key (appended to base) | Dev verified |
|---|---|---|
| logo_en | `/logos/eveenty-logo-en.png` | yes |
| logo_fr | `/logos/eveenty-logo-fr.png` | yes |
| logo_es | `/logos/eveenty-logo-es.png` | yes |
| logo_ar | `/logos/eveenty-logo-ar.png` | yes |
| logo_fa | `/logos/eveenty-logo-fa.png` | yes |
| wallet_google-condensed_en | `/condensed/en.png` | yes |
| wallet_google-condensed_ar | `/condensed/ar.png` | yes |
| wallet_google-condensed_fr | `/condensed/fr.png` | yes |
| wallet_google-condensed_es | `/condensed/es.png` | yes |
| wallet_google-condensed_fa | `/condensed/fa.png` | yes |
| wallet_apple_en | `/apple/en.png` | yes |
| wallet_apple_ar | `/apple/ar.png` | yes |
| wallet_apple_fr | `/apple/fr.png` | yes |
| wallet_apple_es | `/apple/es.png` | yes |

Also present on CDV (unused by resolver): `/apple/fa.png` — Apple locale `fa` still falls back to `/apple/en.png` per approved rule.

**Retired proposed prefix:** `/eveenty/email-assets/...` — replaced by the flat keys above.

---

## 4. Forbidden values

| Value | Why |
|---|---|
| `https://cdn.snapshot.invalid` | Test-only harness host |
| Empty `CdnURL` | Fail-closed → legacy remains selected |
| `http://…` | Resolver requires https |
| Hardcoded host inside `email/templates/kit/*.template` | Breaks env separation |

---

## 5. After Production objects are uploaded (operator order)

1. Upload the 14 files to `https://cdn.eveenty.com` using the **identical** flat keys in §3 (no path remap).  
2. Verify each object (HTTPS 200 / image/png).  
3. Complete external release gates.  
4. Merge/deploy via **DEV → verify → Production**.  
5. Rollback if needed: **redeploy the previous known-good production release**.  

---

## 6. Explicit non-claims

- Production host object presence not independently verified in this checklist update (path layout is owner-confirmed).  
- No customer emails sent.  
- `/apple/fa.png` exists on CDV but is not selected by the 14-asset resolver.
