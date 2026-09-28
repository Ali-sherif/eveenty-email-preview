# POST-P4 LOCAL VERIFICATION REPORT — Eveenty Email Kit

**Date:** 2026-09-28  
**Repo:** `rescounts-backend`  
**Verdict:** **DEV READY** (local / code-readiness)  
**Not claimed:** Production deployed, Production verified, live traffic verified, Level B real-client pass, Security disposition cleared.

---

## 1. Overall status

| Item | Status |
|---|---|
| P4 local implementation | COMPLETE |
| Post-P4 local verification | COMPLETE |
| 48 Kit templates | PASS (parse + inventory + package tests) |
| 11 EXCLUDED Legacy | PASS (no Kit file; Legacy Execute path) |
| Legacy archive preparation | COMPLETE (moved, not deleted) |
| Deletions performed | **NONE** |
| Push / Production deploy | **NONE** |

---

## 2. Architecture (actual code, verified)

| Topic | Verified behavior |
|---|---|
| Runtime Kit toggle | **Removed** — no `EMAIL_KIT_ENABLED` |
| Separate `EMAIL_KIT_CDN_BASE_URL` | **Not used** — Kit assets resolve via `config.CdnURL` (`CDN_URL` / env defaults) |
| Kit selection | `kitActive` when ≥1 Kit template parses; IN_SCOPE names resolve via `templateFor` |
| EXCLUDED | No Kit file → always Legacy |
| CDN defaults | Production `https://cdn.eveenty.com`; DEV/Staging `https://cdn-dv.eveenty.com` (`config/env.go`) |
| Fail-closed assets | Empty/invalid `CdnURL` → resolver returns `("", false)`; never empty `src` success |
| MIME for Kit | HTML-only Kit bodies wrapped by `mimeMessage` + attachments (`.ics` / `.pkpass`) |

---

## 3. 48-template verification

| Check | Result |
|---|---|
| Kit files present under `email/templates/kit/` | **48/48** |
| Kit partials | 6 files (`kit_branded_*`, `kit_head_styles`, `kit_primary_button`, `kit_registration_details` incl. chrome footer define, `kit_wallet_badges`) |
| Parse (isolated Kit parse set) | **48/48 OK** |
| Legacy partials referenced from Kit | **None** |
| Hardcoded `cdn.eveenty.com` / yellow wallet PNGs / `logo_transparent` in Kit | **None** |
| Google Wallet | Condensed object keys only (`/condensed/{locale}.png`) |
| Apple Wallet | Locale map with `fa→en`; badge URLs via resolver; pkpass via MIME Content-ID |
| Recipients / From / Reply-To / subjects | Preserved via `kit_envelope.go` + existing Send* params |
| Attachments / multipart / `.ics` / pkpass | Covered by MIME + parity / snapshot tests |

---

## 4. Legacy 11 (EXCLUDED)

Still Legacy-only (direct `.Execute`, no `templateFor`):

`receipt`, `invoice`, `restaurant_approval`, `restaurant_decline`, `marketing`, `marketing2`, `marketing3`, `marketing4`, `marketing_approval_1`, `marketing_sms_approval`, `marketing_notification_approval`

Bodies + partials now load from `email/templates/archive/legacy/`.

---

## 5. Test results (local)

Commands:

```text
go test ./email/utils/ -count=1 -timeout 60s
go test ./email/ -count=1 -timeout 300s
go test ./model/ -count=1 -timeout 60s -run "ICS|Ics|Calendar"
```

Results:

| Package / scope | Result |
|---|---|
| `./email/utils/` | **PASS** |
| `./email/` (full package, ~287s) | **PASS** |
| `./model/` ICS-related | **PASS** |
| Ad-hoc 48 Kit parse script | **48 OK / 0 FAIL** |

Coverage exercised by existing suites includes: Kit load/activation, 48/11 inventory, locale/RTL audits, Apple/Google wallet mapping, MIME/attachments, `.ics`, `festival_ticket_sale` pkpass Content-IDs, CdnURL path construction, snapshots/parity/P3 audits.

---

## 6. CDN reference verification

| Host | Local HTTP check (14 kit assets) |
|---|---|
| `https://cdn-dv.eveenty.com` (DEV) | **14/14 HTTP 200**, `Content-Type: image/png` |
| `https://cdn.eveenty.com` (Production) | **14/14 HTTP 403** — **DEFERRED — REQUIRES DEPLOYED ENVIRONMENT / INFRA UPLOAD** |

Code path composition: `strings.TrimRight(base,"/") + objectKey` (keys start with `/`) — no duplicated slashes in unit tests.

---

## 7. Security handoffs (4 groups / 11 IDs)

| Handoff | IDs | Classification |
|---|---|---|
| Organizer announcement | `organizer_announcement` | **IMPLEMENTATION COMPLETE — SECURITY DISPOSITION STILL REQUIRED** |
| Marketing Approval | `festival_marketing_approval`, `festival_marketing_approval_sms` | **IMPLEMENTATION COMPLETE — SECURITY DISPOSITION STILL REQUIRED** |
| Rescounts marketing target | `festival_rescounts_marketing_email_target` | **IMPLEMENTATION COMPLETE — SECURITY DISPOSITION STILL REQUIRED** |
| Final Seven | `marketing_package_sale`, `festival_payout`, `partner_coupons`, `partner_coupons_partner`, `bad_content_alert`, `book_demo_admin`, `extra_service_request` | **IMPLEMENTATION COMPLETE — SECURITY DISPOSITION STILL REQUIRED** |

No security approval invented. Policy/trust-boundary disposition remains Backend/Security-owned.

---

## 8. Archive summary

Moved (git rename; content preserved):

- `email/templates/*.template` (59) → `email/templates/archive/legacy/`
- `email/templates/partials/*` (12) → `email/templates/archive/legacy/partials/`
- `email/templates/welcome_email_ad.png` → `email/templates/archive/legacy/welcome_email_ad.png`

Docs:

- `email/templates/archive/README.md`
- `email/templates/archive/MANIFEST.md`
- `email/templates/archive/DELETE_CANDIDATES.md`

Loader updated: `emailClientInitiator` → `email/templates/archive/legacy`.

---

## 9. DELETE CANDIDATES — USER APPROVAL REQUIRED

Only candidate (untouched):

| Path | Reason |
|---|---|
| `email/templates/archive/legacy/welcome_email_ad.png` | No callers found; appears unused |

See `email/templates/archive/DELETE_CANDIDATES.md` for full fields. **DO NOT DELETE without user approval.**

---

## 10. Deferred environment-only verification

### DEV (after deploy)

- Smoke-send subset of Kit emails against DEV CDN (`cdn-dv.eveenty.com`)
- Confirm startup log `email kit: ACTIVE — parsed 48 kit templates`
- Confirm EXCLUDED still Legacy
- Confirm `.ics` / pkpass client behavior in a real mailbox (optional Level B subset)

### Production-only (informational; not blocking local DEV readiness)

- Upload/verify 14 Kit assets on `cdn.eveenty.com` (currently 403)
- Production deploy + live verification
- Level B full checklist
- Security disposition sign-off
- Formal rollback-redeploy confirmation in the Production pipeline

---

## 11. DEV deployment checklist (operator)

1. Review this report + `email/templates/archive/*` + Go seam changes.
2. Decide on `welcome_email_ad.png` delete candidate (optional; can ship with it).
3. Ensure DEV `GO_ENV` yields `CdnURL=https://cdn-dv.eveenty.com` (default non-production).
4. Deploy to DEV.
5. Check kit ACTIVE log + spot-check a few Send* paths.
6. Do **not** treat Production 403 as a local code defect.

---

## Explicit confirmations

- No files were deleted without user approval.
- No `git clean` / destructive cleanup was run.
- No push occurred.
- No Production deploy occurred.
