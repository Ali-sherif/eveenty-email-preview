# P4 ACTIVATION PREP REPORT — Eveenty Email Kit production migration

**Date:** 2026-09-28 (updated: post-P4 local verification + legacy archive)  
**Status:** LOCAL IMPLEMENTATION COMPLETE — **DEV READY**; Production deploy/verification out of scope for current task  
**Backend changes:** uncommitted (review before DEV deploy)  
**Canonical local status:** `D:\last\rescounts-backend\email\POST_P4_LOCAL_VERIFICATION.md`

---

## Explicit non-claims (standing)

- Kit is **not** claimed live in Production.
- No Production deploy, push, or customer email send performed in the post-P4 local session.
- Level B / Security dispositions: **not marked passed**.
- Production CDN kit object keys currently return **HTTP 403** — Infra/environment deferred item.
- **`EMAIL_KIT_ENABLED` removed** — do not document or set it.

---

## Actual activation wiring (verified in code)

| Component | Status |
|---|---|
| Kit templates | 48 under `email/templates/kit/` |
| Legacy bodies | Archived at `email/templates/archive/legacy/` (59 + 12 partials) |
| Selection | `templateFor` — Kit when `kitActive` + named kit template exists; else Legacy |
| EXCLUDED (11) | No kit file; Legacy `.Execute` only |
| Asset CDN | `config.CdnURL` via `KitAssetResolver` (Production default `cdn.eveenty.com`; DEV/Staging `cdn-dv.eveenty.com`) |
| Separate `EMAIL_KIT_CDN_BASE_URL` | **Not present** in current `config/env.go` |
| Fail-closed assets | Empty/invalid `CdnURL` → no kit asset URL success |
| Rollback | Prior release redeploy |

---

## Outstanding external items (informational)

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | DEV deploy + smoke | Operator/Backend | **NEXT** |
| 2 | Production CDN 14-asset upload/verify | Infra | **DEFERRED** (403 today) |
| 3 | Level B | QA | **NOT RUN** |
| 4 | Security disposition — 4 handoffs | Backend/Security | **REQUIRED** before Production gate |
| 5 | Production deploy authorization | Owner | **OUT OF SCOPE** this task |

---

## Archive

Authorized locally (2026-09-28): legacy moved to `email/templates/archive/legacy/` without deletion. See archive `README.md` / `MANIFEST.md` / `DELETE_CANDIDATES.md`.
