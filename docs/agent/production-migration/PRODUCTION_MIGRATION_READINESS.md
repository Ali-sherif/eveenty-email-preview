# PRODUCTION MIGRATION READINESS — Phase 0

**Date:** 2026-09-27  
**Scope:** Preparation / documentation only. No backend writes, no CDN upload, no activation.  
**Inventory (catalog CLI):** 59 physical / 11 excluded / 48 in scope — VERIFIED (`node .agents/scripts/email-cli.mjs validate-catalog` ok).

## Verdict

**READY FOR P1 PLANNING / NOT READY FOR ACTIVATION**

Phase 0 evidence is sufficient for the Backend team to begin P1 foundation planning once the owner gives go-ahead. Activation is blocked until all release gates in `TEST_AND_RELEASE_PLAN.md` pass (all currently **NOT RUN**).

---

## Verified backend state (file:line)

| Topic | Label | Evidence |
|---|---|---|
| Renderer | VERIFIED | `email/smtp_render_template.go:7` imports `text/template`; `:104` `ParseFiles`; `:91–105` every template parse includes all partial paths; `:108–114` `mustNewTemplate` panics on parse error; `:117–190` startup registration via `NewSMTP` |
| Partials count | VERIFIED | 12 files under `email/templates/partials/` (glob) |
| Send path | VERIFIED | `github.com/emersion/go-smtp` `smtp.SendMail` used across `email/smtp_*.go` (e.g. `smtp_admin.go:85`) |
| RFC822 in templates | VERIFIED | Each `.template` begins with `From` / `To` / `Subject` / `Content-Type` (spot-check registration + sales + support) |
| text/plain alternative | VERIFIED absent | No `text/plain` matches under `email/templates/*.template` |
| multipart/mixed (10) | VERIFIED | See §MIME below |
| Feature flag / kit version select | VERIFIED absent | No email kit/version/feature-flag selection in `email/*.go` (search empty) |
| Locales | VERIFIED | `model/user_profile_language.go:36–40` `GetValidProfileLanguage` unknown→en; `email/utils/direction.go:10–14` `HTMLDirForLang`; admin Send* often `lang := "en"` / `const lang = "en"` (e.g. `smtp_admin.go:405`, `:447`); registration uses `Dir` via `lo.Ternary(IsRTLLanguage…)` (e.g. `smtp_user_emails.go:696`) |
| Brand logos | VERIFIED | `email/utils/utils.go:27–33` `GetLocalizedLogoURL` hardcodes `https://cdn.eveenty.com/assets/logo_transparent_%s.png` |
| Dynamic images | VERIFIED | `email/utils/image.go:7–8` → `model/image.go:15–16` `GetFullURL` uses `config.AppConfig.CdnURL` |
| CdnURL env bases | VERIFIED | `config/env.go:148–154` production `cdn.eveenty.com`; staging/default `cdn-dv.eveenty.com` |
| Partial hardcoded images | VERIFIED | e.g. `header_3.template:4`, `header_1.template:3`, social icons in `footer_*` hardcode `cdn.eveenty.com` |
| festival_ticket_sale Wallet | VERIFIED | `festival_ticket_sale.template:208–216` `GoogleWalletPassLink` + yellow badge URLs (legacy/obsolete); `:215` `cid:ticket-{{inc $index}}.pkpass`; `:567–581` pkpass + ics parts |
| Tests | VERIFIED | `email/smtp_test.go:21` `t.Skip()`; `.github/workflows/test.yml:27` `go test -v ./payment/` only |
| Preview inventory | VERIFIED | Catalog CLI: 48 designed / 0 undesigned; all owner visually approved (HTML Preview only) per `PROJECT_STATE.md` |

### MIME — 10 multipart/mixed templates

| Template | Parts | Attachments |
|---|---|---|
| `festival_ticket_sale` | `multipart/mixed` boundary=`boundary-string`; `text/html`; N× `application/vnd.apple.pkpass` (filename `ticket-N.pkpass`, Content-ID `<ticket-N.pkpass>`, base64); `text/calendar` `event.ics` | Real: pkpass + ics |
| `festival_add_on_sale` | mixed + html + `text/calendar` `event.ics` | Real: ics |
| `festival_activity_sale` | mixed + html + `text/calendar` `event.ics` | Real: ics |
| `festival_sponsor_sale` | mixed + html + `text/calendar` `event.ics` | Real: ics |
| `festival_sales` | mixed + html + `text/calendar` `event.ics` | Real: ics |
| `festival_ticket_registration` | mixed + **html only** + `--boundary-string--` | **No file parts** |
| `festival_ticket_registration_approval` | mixed + **html only** | **No file parts** |
| `festival_ticket_registration_reject` | mixed + **html only** | **No file parts** |
| `festival_ticket_registration_deadline_exceeded` | mixed + **html only** | **No file parts** |
| `festival_ticket_registration_payment_deadline_exceeded` | mixed + **html only** | **No file parts** |

All other in-scope templates: single `text/html` body after RFC822 headers.

---

## Dependencies for later phases (not Phase 0 work)

1. Infra supplies separate Production and Staging CDN base URLs (both currently **PENDING**) and hosts all 14 manifest assets.
2. Backend implements side-by-side kit parse set, dormant until activation (mechanics: Backend team to define).
3. Backend/Security dispositions all four handoffs (11 template IDs) — release gate; unresolved.
4. QA Level B on Staging — **NOT RUN**.
5. Owner authorizes activation (and later archive) separately.

---

## Missing evidence / open items

| Item | Owner | Status |
|---|---|---|
| Concrete kit CDN base URL — Production | Infra / Owner | PENDING |
| Concrete kit CDN base URL — Staging | Infra / Owner | PENDING |
| Activation control mechanism | Backend | Backend team to define (non-blocking for P0) |
| Rollback mechanism | Backend | Backend team to define |
| Deploy sequencing | Backend | Backend team to define |
| Archive mechanics | Backend | Backend team to define |
| Four security handoff dispositions | Backend/Security | Unresolved; gate before activation |
| Level A re-run for migration parity | QA/Backend | NOT RUN (historical Level A is design evidence only) |
| Integration / Level B | QA/Backend | NOT RUN |

---

## Discrepancies recorded (see also `DECISION_LOG.md`)

1. Traceability CSV / SAFE plan claimed no MIME attachments — **stale**; pkpass + ics exist.
2. SAFE plan claimed `text/template` auto-escape — **incorrect**.
3. SAFE plan preferred in-place replacement — **superseded** by owner side-by-side decision.
4. Brand logos hardcode production CDN host even when `CdnURL` is staging — kit migration must use env-specific kit bases (owner decision 4).

---

## Deliverables produced this session

| Path | Status |
|---|---|
| `docs/agent/production-migration/PRODUCTION_MIGRATION_READINESS.md` | This file |
| `docs/agent/production-migration/MIGRATION_MATRIX.csv` | 48 rows |
| `docs/agent/production-migration/VARIABLE_CONTRACTS/*.md` | 48 files |
| `docs/agent/production-migration/MIGRATION_APPROACH.md` | Written |
| `docs/agent/production-migration/CDN_INTEGRATION_PLAN.md` | Written |
| `docs/agent/production-migration/TEST_AND_RELEASE_PLAN.md` | Written |
| `docs/agent/production-migration/OWNERSHIP.md` | Written |

**Do not** treat any template as `PRODUCTION_READY` or `PRODUCTION_REPLACED`.
