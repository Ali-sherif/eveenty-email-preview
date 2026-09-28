# P1 FOUNDATION REPORT — Eveenty Email Kit production migration

**Date:** 2026-09-27  
**Status:** IMPLEMENTED — AWAITING BACKEND REVIEW  
**Scope:** Backend foundation only (no kit template ports, no activation, no CDN upload).  
**Backend changes:** uncommitted (do not commit/push/deploy without Backend review).

---

## Verdict

P1 foundation items 1–4 are implemented in `D:\last\rescounts-backend`.  
**No kit template is active. `EMAIL_KIT_ENABLED` defaults OFF. Kit CDN URLs remain PENDING for Production and Staging. Security handoffs remain unresolved and owned by Backend/Security.**

---

## 1. Files changed (purpose)

### Modified

| File | Purpose |
|---|---|
| `config/env.go` | Optional `EMAIL_KIT_ENABLED` (default false) and `EMAIL_KIT_CDN_BASE_URL` (default empty). Does **not** touch `CdnURL`. |
| `email/smtp_model.go` | `mailSender` capture seam; `kitActive` / `kitTemplates` fields. |
| `email/smtp_render_template.go` | `NewSMTP` delegates to `newTestSMTPClient` (shared construction). |
| `email/smtp.go`, `smtp_admin.go`, `smtp_organizer_emails.go`, `smtp_partner.go`, `smtp_payout.go`, `smtp_restaurant_emails.go`, `smtp_sponsor_installments.go`, `smtp_support.go`, `smtp_user_emails.go`, `smtp_vendor_emails.go` | Replace `smtp.SendMail(...)` with `c.deliver(...)` — behavior-preserving seam; **Send* signatures unchanged**. |

### New

| File | Purpose |
|---|---|
| `email/smtp_deliver.go` | Injectable `mailSender`; nil → production `smtp.SendMail`. |
| `email/smtp_test_helpers.go` | `newTestSMTPClient` returns `*smtpClient`; applies kit activation guard. |
| `email/smtp_kit.go` | Isolated kit parse set + all-or-nothing `EvaluateKitActivation` / `applyKitActivationGuard`. |
| `email/smtp_kit_test.go` | Guard + missing/empty kit dir + kit partial isolation tests. |
| `email/utils/kit_assets.go` | Fail-closed kit asset resolver (14 manifest ids). |
| `email/utils/kit_assets_test.go` | Resolver unit tests using `https://kit-cdn.invalid` only. |
| `email/templates/kit/.gitkeep` | Kit template directory (no per-template bodies in P1). |
| `email/templates/kit/partials/kit_branded_header.template` | Shared kit chrome: branded header (logo URL from params). |
| `email/templates/kit/partials/kit_branded_footer.template` | Shared kit chrome: branded footer. |
| `email/templates/kit/partials/kit_primary_button.template` | Shared kit chrome: primary yellow CTA. |
| `email/templates/kit/partials/kit_wallet_badges.template` | Shared kit chrome: Google Condensed + Apple badges (URLs from params). |
| `email/legacy_snapshot_*.go` (5 files) | Snapshot harness, cases, fixtures, normalizer, `-update` flag. |
| `email/testdata/legacy_snapshots/**/*.eml` | 106 golden RFC822 captures. |

### Unchanged (verified empty diff)

- `email/templates/*.template` (legacy)
- `email/templates/partials/` (legacy)
- `pkg/locales/`
- `go.mod` / `go.sum`
- `.github/workflows`, deploy/env files for real environments

---

## 2. Snapshot coverage (template × persona × locale)

**106 cases · 56 unique template stems · all 48 IN_SCOPE covered.**  
8 additional EXCLUDED / out-of-matrix stems also snapshotted because they are loaded by `NewSMTP` (`receipt`, `invoice`, `marketing`, `marketing_approval_1`, `marketing_sms_approval`, `marketing_notification_approval`, `restaurant_approval`, `restaurant_decline`).

**Locale policy (discrepancy vs Phase 0 matrix):** `MIGRATION_MATRIX.csv` `locales_supported` is `UNKNOWN — verify Send* language selection` for every row. Snapshots use **backend-verified** routing:
- `GetValidProfileLanguage` paths → `en` + `ar` (LTR + RTL sample)
- Admin / hardcoded-en / no-i18n paths → `en` only

| template_id | persona | locale |
|---|---|---|
| password_reset | user | en |
| password_reset | user | ar |
| activate_email | user | en |
| activate_email | user | ar |
| support | admin | en |
| receipt | user | en |
| restaurant_decline | admin | en |
| restaurant_approval | admin | en |
| invoice | restaurant | en |
| marketing | user | en |
| marketing_approval_1 | admin | en |
| marketing_sms_approval | admin | en |
| marketing_sms_approval | admin_rescounts | en |
| marketing_notification_approval | admin | en |
| marketing_notification_approval | admin_rescounts | en |
| partner_coupons | user | en |
| partner_coupons_partner | partner | en |
| festival_marketing_approval | admin | en |
| festival_marketing_approval_sms | admin | en |
| festival_marketing_email_target | target_user | en |
| festival_rescounts_marketing_email_target | target_user | en |
| organizer_festival_marketing_email_receipt | organizer | en |
| organizer_festival_marketing_sms_receipt | organizer | en |
| festival_sales | admin | en |
| festival_sales | vendor | en |
| festival_sales | organizer | en |
| festival_sale_installment_paid | vendor | en |
| festival_sale_installment_paid | organizer | en |
| festival_sale_installment_paid | admin | en |
| second_payment_reminder | vendor | en |
| second_payment_reminder | admin | en |
| second_payment_reminder | organizer | en |
| first_payment_refund | vendor | en |
| first_payment_refund | organizer | en |
| first_payment_refund | admin | en |
| sponsor_installment_paid | sponsor | en |
| sponsor_installment_paid | admin | en |
| sponsor_installment_paid | organizer | en |
| sponsor_installment_second_payment_reminder | sponsor | en |
| sponsor_installment_second_payment_reminder | admin | en |
| sponsor_installment_second_payment_reminder | organizer | en |
| sponsor_first_payment_refund | sponsor | en |
| sponsor_first_payment_refund | admin | en |
| sponsor_first_payment_refund | organizer | en |
| festival_donation | user | en |
| festival_donation | user | ar |
| festival_donation | organizer | en |
| festival_donation | admin | en |
| festival_ticket_sale | buyer_user | en |
| festival_ticket_sale | buyer_user | ar |
| festival_ticket_sale | guest_user | en |
| festival_ticket_sale | admin | en |
| festival_ticket_sale | organizer | en |
| festival_add_on_sale | admin | en |
| festival_add_on_sale | user | en |
| festival_add_on_sale | organizer | en |
| organizer_announcement | user | en |
| refund_receipt_user | user | en |
| refund_receipt_user | user | ar |
| refund_receipt_organizer | organizer | en |
| refund_receipt_admin | admin | en |
| festival_vendor_sale | buyer | en |
| festival_vendor_sale | vendor | en |
| festival_vendor_sale | received | en |
| festival_vendor_sale_rejection | buyer | en |
| festival_activity_sale | admin | en |
| festival_activity_sale | user | en |
| festival_activity_sale | organizer | en |
| festival_sponsor_sale | admin | en |
| festival_sponsor_sale | sponsor | en |
| festival_sponsor_sale | organizer | en |
| festival_update_request_issued | admin | en |
| festival_update_request_approved | organizer | en |
| festival_update_request_rejected | organizer | en |
| marketing_package_sale | admin | en |
| marketing_package_sale | organizer | en |
| bad_content_alert | admin | en |
| festival_created | admin | en |
| festival_approval_status_changed | organizer | en |
| contact_submission | admin | en |
| book_demo_admin | admin | en |
| extra_service_request | admin | en |
| festival_payout | organizer | en |
| festival_payout | admin | en |
| dispute_notification | organizer | en |
| dispute_notification | admin | en |
| needs_response_dispute_reminder | admin | en |
| needs_response_dispute_reminder | organizer | en |
| registration_approval_status_changed | user | en |
| registration_approval_status_changed | user | ar |
| festival_ticket_registration | admin | en |
| festival_ticket_registration | organizer | en |
| festival_ticket_registration | buyer_user | en |
| festival_ticket_registration | buyer_user | ar |
| festival_ticket_registration_reject | user | en |
| festival_ticket_registration_reject | admin | en |
| festival_ticket_registration_reject | organizer | en |
| festival_ticket_registration_deadline_exceeded | admin | en |
| festival_ticket_registration_deadline_exceeded | organizer | en |
| festival_ticket_registration_deadline_exceeded | user | en |
| festival_ticket_registration_payment_deadline_exceeded | admin | en |
| festival_ticket_registration_payment_deadline_exceeded | organizer | en |
| festival_ticket_registration_payment_deadline_exceeded | user | en |
| festival_ticket_registration_approval | user | en |
| festival_ticket_registration_approval | admin | en |
| festival_ticket_registration_approval | organizer | en |


Goldens path: `email/testdata/legacy_snapshots/<template_id>/<persona>__<locale>.eml`  
Update: `go test ./email/ -run TestLegacyOutputSnapshots -update`  
Default: compare (byte-identical after `normalizeVolatile`).

---

## 3. Normalizations (every replacement)

| Pattern | Sentinel | Why volatile |
|---|---|---|
| RFC5322 `Date:` header | `Date: NORMALIZED` | Safety if ever added to buffers |
| RFC5322 `Message-ID:` | `Message-ID: NORMALIZED` | Safety if ever added |
| Clock times `H:MM AM/PM [TZ]` | `NORMALIZED_TIME` | `dates.GetFormattedTime(GetCurrentTimeInLocation(...))` in several Send* |
| Long weekday dates (`Sunday. September …`) | `NORMALIZED_LONG_DATE` | `dates.GetFormattedLongDate(GetCurrentTime…)` (e.g. bad_content_alert) |
| ISO dates `YYYY-MM-DD` | `NORMALIZED_DATE` | Current-time dates; also collapses fixed fixture festival dates (documented trade-off for stability) |
| iCal `DTSTAMP:YYYYMMDDThhmmssZ` | `DTSTAMP:NORMALIZED` | Calendar attachment generation uses wall-clock UTC |

**Not normalized (intentionally):** fixed MIME `boundary="boundary-string"` / `--boundary-string` delimiters; pkpass/ics structural parts; recipients; subjects; legacy CDN logo hosts in legacy output.

---

## 4. Seam description

No render-only entry point existed. Added minimal injectable sender:

- Field `smtpClient.mailSender` (nil in production)
- Method `(*smtpClient).deliver(to, msg)` — if `mailSender == nil`, calls `smtp.SendMail` unchanged
- All former `smtp.SendMail(c.server, c.auth, c.from, …)` call sites now `c.deliver(…)`
- **Send* signatures, recipients, subjects, locale routing, MIME output unchanged** when `mailSender` is nil
- Tests set `mailSender` to capture full RFC822 into a `bytes.Buffer` (no network)

Construction helper: `newTestSMTPClient` (returns `*smtpClient`); `NewSMTP` wraps it as `Client`.

---

## 5. Kit asset resolver rules

File: `email/utils/kit_assets.go`

- Config: `EMAIL_KIT_CDN_BASE_URL` — one value per deployment environment; default empty
- **Does not** use `config.CdnURL` or `GetLocalizedLogoURL`
- Object key prefix (proposed): `/eveenty/email-assets/…` per CDN_INTEGRATION_PLAN / manifest
- Locale: logos en/fr/es/ar/fa; `admin`→en; unknown→en; Apple `fa`→en artwork; Google = **Condensed only**
- Fail-closed: empty / non-https / missing host → `Configured()==false`; `Resolve` returns `("", false)` — never `src=""`, never legacy host, never yellow badges, never cross-env host
- Unit tests use **only** `https://kit-cdn.invalid`
- Production/Staging concrete bases: **PENDING (Infra)**

---

## 6. Kit parse-set design

| Path | Role |
|---|---|
| `email/templates/kit/*.template` | Per-template kit bodies — **none in P1** |
| `email/templates/kit/partials/*.template` | Shared kit chrome only (4 partials) |
| Legacy `email/templates/` + `partials/` | Untouched; legacy `ParseFiles` set unchanged |

- Kit parse uses **only** kit partials; legacy parse uses **only** legacy partials
- Missing/empty kit dir: **no panic**, legacy startup unaffected
- `tryLoadKitTemplates` + `applyKitActivationGuard` run after legacy `mustNewTemplate` loads

---

## 7. Activation switch proposal (Backend team review)

**Proposal (not a final Backend decision):**

| Item | Proposal |
|---|---|
| Switch | `EMAIL_KIT_ENABLED` (bool, default **false**) — single global, no per-template allowlist |
| Guard | Kit selected only if switch ON **AND** 48 kit templates parse **AND** resolver `FullyConfigured()` |
| P1 reality | Guard always resolves to **legacy** (0 kit templates) |
| Rollback | Set `EMAIL_KIT_ENABLED=false` (or unset) — immediate legacy path |
| Logging | Startup line: `email kit activation: LEGACY selected — <reason>` |
| Deploy | Do **not** enable in any env file / CI / deploy manifest until release gates pass |
| Archive | Out of P1; still Backend-defined after owner archive approval |

Send* functions are **not** wired to select kit templates yet (beyond storing `kitActive` on the client). Proves legacy stays selected.

---

## 8. Raw-HTML fields in new kit partials (`text/template` does not escape)

List for Backend/Security (new surfaces introduced by kit chrome; legacy escaping behavior unchanged):

| Partial | Fields rendered without HTML escaping |
|---|---|
| `kit_branded_header` | `BrandLogoURL`, `LogoAlt`, `LogoWidth`, `LogoHeight` |
| `kit_branded_footer` | `FooterLead`, `FooterEmail`, `FooterSuffix`, `Copyright`, `HTMLDir` |
| `kit_primary_button` | `CTAHref`, `CTALabel` |
| `kit_wallet_badges` | `GoogleWalletHref`, `GoogleWalletBadgeURL`, `GoogleWalletLabel`, `GoogleWalletWidth`, `AppleWalletHref`, `AppleWalletBadgeURL`, `AppleWalletLabel`, `AppleWalletWidth`, `WalletDisplayHeight`, `HTMLDir` |

Callers in P2+ must treat these as trusted/escaped upstream. **Do not** treat this list as remediation of the four security handoffs.

---

## 9. Validation gate outputs (exact)

```
--- go build ./... ---
exit=0

--- go vet ./email/... ./config/... ---
exit=0

--- go test ./email/... ---
ok  	zemind.ca/rescounts/email	10.957s
?   	zemind.ca/rescounts/email/emailLocales	[no test files]
ok  	zemind.ca/rescounts/email/utils	0.719s
exit=0
```

Additional checks:
- Snapshot stability: `TestLegacyOutputSnapshots` passed twice consecutively after regenerating goldens with the corrected normalizer
- Startup/initiator: `TestTryLoadKitTemplates_MissingDirNoPanic`, `TestApplyKitActivationGuard_SwitchOnZeroTemplates_LegacySelected`, `TestApplyKitActivationGuard_MissingKitDir_LegacySelected` — PASS
- `git diff -- email/templates/*.template email/templates/partials/ pkg/locales/` — **empty**
- No `EMAIL_KIT_ENABLED=true` in repo; no real kit CDN hostname; tests use `https://kit-cdn.invalid` only

---

## 10. Discrepancies vs Phase 0

1. **`MIGRATION_MATRIX.csv` `locales_supported`** — all rows still `UNKNOWN — verify Send* language selection`. P1 used backend Send* evidence (en / en+ar) instead of inventing matrix values. **Backend should backfill the matrix.**
2. **Matrix `send_functions` UNKNOWN** for `festival_payout`, `sponsor_*`, `support` — filled from code for snapshot cases; matrix not edited (docs-only Phase 0 owned separately).
3. **Matrix error:** `festival_update_request_rejected` listed `SendApprovedUpdateRequestToOrganizer`; code uses `SendRejectedUpdateRequestToOrganizer`.
4. **Extra snapshots** for 8 EXCLUDED/out-of-matrix templates loaded by `NewSMTP` (bonus; not IN_SCOPE).
5. **ISO date normalization** also collapses fixed fixture festival dates (`2026-03-15`) — stability trade-off documented in §3.
6. Go toolchain was initially missing on the agent host; Go 1.27.0 was installed via winget to run gates (matches `go.mod`).

---

## 11. Open items for Backend team review

1. Accept or revise the activation/rollback proposal (§7).
2. Supply Production + Staging `EMAIL_KIT_CDN_BASE_URL` (Infra) — both PENDING.
3. Confirm object-key prefix `/eveenty/email-assets/`.
4. Backfill matrix `locales_supported` / UNKNOWN send_functions; fix rejected-update send name.
5. Review raw-HTML kit partial field list (§8) with Security.
6. Four security handoffs (11 ids) — **still unresolved**; release gate before activation. **Not fixed in P1.**
7. Authorize P2 batch 1 after Backend review: `activate_email`, `password_reset` (dormant until activation).

---

## Explicit non-claims

- No kit template is active or production-ready.
- Switch default OFF; not enabled in any real env.
- CDN URLs PENDING both environments; 0 uploads.
- Security handoffs not confirmed, fixed, harmless, or cleared.
