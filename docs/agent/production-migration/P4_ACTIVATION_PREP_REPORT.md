# P4 ACTIVATION PREP REPORT — Eveenty Email Kit production migration

**Date:** 2026-09-28  
**Status:** IMPLEMENTATION COMPLETE — NOT LIVE; AWAITING CDN URLS + EXTERNAL GATES  
**Scope:** Finish remaining all-or-nothing activation implementation; CDN config prep; operator checklist.  
**Backend changes:** uncommitted (additive to P1–P3).  
**Owner authorization:** Activate-all-48 mechanism approved; no Staging required for current workflow; final CDN URLs forthcoming — do not delay code prep.

---

## Explicit non-claims (standing)

- Kit is **not** live. `EMAIL_KIT_ENABLED` default remains **false**.  
- No real CDN hostname embedded in templates or customer-facing defaults.  
- No CDN upload, deploy, commit, push, or customer email send performed this session.  
- Level B / Staging smoke / Security dispositions: **not marked passed**.  
- Security handoffs (11 ids / four items): **unresolved** — Backend/Security-owned.

---

## 1. Inspection result (P1/P2 wiring preserved)

| Component | Status | Action this session |
|---|---|---|
| `EMAIL_KIT_ENABLED` + `EMAIL_KIT_CDN_BASE_URL` in `config/env.go` | Already present (P1) | Comment clarified for P4 |
| `EvaluateKitActivation` all-or-nothing (48) | Already present | Reason text updated; eligibility semantics tightened |
| `tryLoadKitTemplates` + isolated kit parse set | Already present | Unchanged |
| `templateFor` on all 48 in-scope Send* paths | Already present (P2) | Verified; not rewritten |
| 11 excluded templates (legacy `Execute` only) | Already preserved | Verified + regression test |
| Kit logos / Support branded header / Google Condensed | Already in kit templates | Unchanged |
| Fail-closed empty CDN | Already present | Extended: reject test-only `.invalid` for **live** activation |
| Test harness `https://kit-cdn.invalid` | Already present | Kept for local render/snapshots only |

**Verdict:** Core activation wiring was already complete after P2. P4 did **not** rewrite it. Only genuine gaps were closed (below).

---

## 2. Genuine P4 gaps closed

| Gap | Implementation |
|---|---|
| Live activation could accept `https://kit-cdn.invalid` if mis-set in env | `KitAssetsEligibleForActivation` + `IsKitCDNTestOnlyBase`; guard uses eligibility, not raw FullyConfigured |
| No operator map for “where do I paste the CDN URL?” | `P4_CDN_CONFIGURATION_CHECKLIST.md` |
| `.env.example` lacked kit keys | Added `EMAIL_KIT_ENABLED=false` + empty `EMAIL_KIT_CDN_BASE_URL` |
| Excluded-template kit isolation not asserted in activation test | Extended `TestApplyKitActivationGuard_All48_KitSelected` + new placeholder rejection test |

Local kit snapshots/parity continue to **force** `kitActive` with the test placeholder via `newCapturingKitSMTP` — never via production guard with `.invalid`.

---

## 3. All-or-nothing activation (how it works)

Kit is selected for **every** in-scope Send* only when **all** of:

1. `EMAIL_KIT_ENABLED=true`  
2. Exactly **48** kit templates parse from `email/templates/kit/*.template`  
3. `EMAIL_KIT_CDN_BASE_URL` is https, resolves all **14** manifest object keys, and is **not** a `.invalid` / test-only host  

Otherwise **legacy** is used for all mail (including the 11 excluded templates, which never enter the kit set).

Rollback: set `EMAIL_KIT_ENABLED=false` (or unset) → immediate legacy path on restart.

---

## 4. Remaining configuration values (owner / Infra)

| Value | Status |
|---|---|
| Production `EMAIL_KIT_CDN_BASE_URL` | **PENDING** — insert per checklist §1–2 |
| Staging `EMAIL_KIT_CDN_BASE_URL` | **PENDING / N/A today** — owner has no Staging; fill if Staging appears later |
| Upload of 14 manifest files | **NOT DONE** (0 uploads) |
| `EMAIL_KIT_ENABLED` in any real env | Must stay **false** until external gates allow cutover |

Exact paste locations: **`P4_CDN_CONFIGURATION_CHECKLIST.md`**.

---

## 5. Exact activation procedure (operator)

1. Infra uploads 14 assets; verifies HTTPS 200 / `image/png` / SHA-256 vs `CDN_UPLOAD_MANIFEST.csv`.  
2. Set `EMAIL_KIT_CDN_BASE_URL=<real https origin>` for that environment. Keep `EMAIL_KIT_ENABLED=false`. Redeploy/restart.  
3. Confirm startup log still shows LEGACY while switch is off (or KIT only after step 6).  
4. External teams complete their gates (table §6) — **do not invent passes**.  
5. Owner confirms cutover timing (mechanism already authorized 2026-09-28).  
6. Set `EMAIL_KIT_ENABLED=true`; restart. Expect log: `email kit activation: KIT ACTIVE — …`.  
7. Backend/QA perform post-activation verification (owner: no real sends until CDN URLs exist).  
8. Rollback if needed: `EMAIL_KIT_ENABLED=false` + restart.  
9. Legacy archive: **separate** owner approval later (P5); not part of this prep.

---

## 6. Outstanding external release gates (actual status)

| # | Gate | Owner | Status (this session) |
|---|---|---|---|
| 1 | 48 ported + integration parity | Backend | **LOCAL PASS** (P3); not production-activated |
| 2 | CDN verified on hosts in use (14 assets) | Infra + Backend | **NOT RUN** — URLs PENDING; no Staging required for owner’s current workflow |
| 3 | Level B real-client QA | QA | **NOT RUN** (`LEVEL_B_CHECKLIST.md`) |
| 4 | Backend/Security disposition — four handoffs (11 ids) | Backend/Security | **NOT RUN / unresolved** |
| 5 | Backend confirms rollback capability | Backend | **Mechanism implemented** (switch OFF); **formal Backend confirmation NOT RUN** |
| 6 | Owner authorizes activation (all 48 together) | Owner | **AUTHORIZED (mechanism + prep)** 2026-09-28 — **live cutover still blocked** on CDN URLs + gates 2–5 |

No gate above is marked passed unless independently completed by its owner.

---

## 7. Confirmation: no real emails sent

- No SMTP credentials used for kit activation sends.  
- No `SEND_AUTHORIZED` / Part C sender added.  
- Only local `go test` / build / vet (in-process capture, no network send).

---

## 8. Files touched (P4)

### Backend (`rescounts-backend`, uncommitted)

- `email/utils/kit_assets.go` — production eligibility helpers  
- `email/utils/kit_assets_test.go` — eligibility tests  
- `email/smtp_kit.go` — guard uses eligibility; clearer reasons  
- `email/smtp_kit_test.go` — All48 uses example base; placeholder rejected; excluded asserted  
- `config/env.go` — P4 comments  
- `.env.example` — kit keys documented empty/OFF  

### Preview docs (`eveenty-email-preview`)

- `docs/agent/production-migration/P4_ACTIVATION_PREP_REPORT.md` (this file)  
- `docs/agent/production-migration/P4_CDN_CONFIGURATION_CHECKLIST.md`  
- `docs/agent/HANDOFF.md`, `DECISION_LOG.md`, `TEST_AND_RELEASE_PLAN.md` (gate 6 / status)  
- `CDN_INTEGRATION_PLAN.md` (fail-closed placeholder note)

### Untouched (verified intent)

- Legacy `email/templates/*.template` + legacy partials  
- `pkg/locales/`  
- Kit template bodies / designs  
- No commit / push / deploy

---

## 9. Validation gates (2026-09-28)

```
--- go build ./... ---
exit=0

--- go vet ./email/... ./config/... ---
exit=0

--- go test ./email/... ---
ok  	zemind.ca/rescounts/email
ok  	zemind.ca/rescounts/email/utils
exit=0

--- TestApplyKitActivationGuard_All48_KitSelected ---
PASS (switch ON + https://kit-cdn.example.com → KIT; 48/48; excluded stay legacy)

--- TestApplyKitActivationGuard_TestPlaceholder_LegacySelected ---
PASS (kit-cdn.invalid → LEGACY even with switch ON + 48 templates)

--- git diff protected (legacy templates/partials, pkg/locales, go.mod/sum) ---
empty

--- EMAIL_KIT_ENABLED=true in committed env ---
absent (default false; .env.example documents false)
```
