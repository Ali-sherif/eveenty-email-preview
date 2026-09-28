# P3 VERIFICATION REPORT — Eveenty Email Kit production migration

**Date:** 2026-09-28  
**Status:** LOCAL VERIFICATION DONE — STAGING BLOCKED ON INPUTS  
**Scope:** Phase 3 verification (Part A always; Parts B/C blocked on owner inputs).  
**Backend changes:** uncommitted (test-only + documented kit fixes).  
**Switch:** `EMAIL_KIT_ENABLED` default OFF. Nothing active in any real environment.

> **SUPERSEDED (2026-09-28):** `EMAIL_KIT_ENABLED` removed. Kit readiness = 48 parse + eligible CDN; cutover = deploy. See `DECISION_LOG.md` / `P4_ACTIVATION_PREP_REPORT.md`.

---

## Explicit non-claims (standing)

- Nothing is PRODUCTION_READY or OWNER APPROVED.
- Level B real-client QA: **NOT RUN** (agent must not mark Level B rows passed).
- Production CDN: **PENDING**. Staging CDN: **PENDING** (`STAGING_KIT_CDN_BASE_URL`).
- Security handoffs (11 ids / four items): **unresolved** — owned by Backend/Security. Not fixed, cleared, or safe.
- Part C sends: **NOT RUN** (`SEND_AUTHORIZED=NO`).

---

## OWNER INPUTS (this run)

| Input | Value |
|---|---|
| STAGING_KIT_CDN_BASE_URL | PENDING |
| QA_RECIPIENTS | PENDING |
| P3_SMTP_* env vars | not used (Part C blocked) |
| SEND_AUTHORIZED | NO |

---

## PROGRESS

| Item | Status | Notes |
|---|---|---|
| A1 Wallet fixtures (1 + 3 tickets + fa) | DONE | Legacy goldens first; kit Condensed + Apple; pkpass CID; ICS retained |
| A1 Locale coverage (fr/es/fa/xx) | DONE | GetValidProfileLanguage templates; fa/ar RTL; Apple fa→en artwork |
| A1 Edge fixtures | DONE | Long names, 10 tickets, 20 refund items, missing images, zero amount, empty note |
| A2 TestKitLegacyParity (all cases incl. new) | DONE | PASS |
| A3 Static client-compatibility audit | DONE | PASS (`TestP3KitStaticClientCompatibilityAudit`) |
| A4 Link audit | DONE | PASS (`TestP3KitLinkAudit`) |
| A5 kit_preview re-export | DONE | 273 HTML preview files |
| Part B Staging CDN verify | BLOCKED — INPUT PENDING | `STAGING_KIT_CDN_BASE_URL` |
| Part C Staging test sends | BLOCKED — INPUT PENDING | needs Part B + SEND_AUTHORIZED=YES + QA_RECIPIENTS + P3_SMTP_* |
| Part D Level B checklist | DONE | `LEVEL_B_CHECKLIST.md` — all NOT RUN |
| Final gates (build/vet/test/diff/rg) | DONE | PASS (see Gates) |

---

## 1. Coverage added

### 1a Wallet (`festival_ticket_sale`)

| Case | Persona / locale | Verified |
|---|---|---|
| 1 ticket + Google + Apple | `buyer_user_wallet1` / en | Google Condensed + Apple badges via resolver; 1× `application/vnd.apple.pkpass` CID `ticket-1.pkpass`; Apple href `cid:ticket-1.pkpass`; `.ics` present; MIME order matches legacy |
| 3 tickets + Google + Apple | `buyer_user_wallet3` / en | 3 pkpass parts (`ticket-1..3`); ICS after pkpass |
| 1 ticket wallet + fa | `buyer_user_wallet1` / fa | `dir=rtl`; Google Condensed `…/google/condensed/fa.png`; Apple `…/apple/en.png` |

Parity note: legacy yellow badge image URLs (`cdn.eveenty.com/google_wallet.png`, `apple_wallet.png`) are intentional design chrome replaced by kit Condensed/official badges. `isInterestingLink` skips those badge image srcs while still requiring Google pass hrefs and `cid:…pkpass`.

### 1b Locales

For templates whose Send* uses `GetValidProfileLanguage`, added **fr / es / fa / xx** (xx → en fallback):

- Buyer/user (also filled missing **ar** where needed):  
  `password_reset`, `activate_email`, `festival_donation`, `festival_ticket_sale`, `refund_receipt_user`, `registration_approval_status_changed`, `festival_ticket_registration`, `festival_add_on_sale`, `festival_activity_sale`, registration approval/reject/deadline/payment-deadline, `festival_vendor_sale` (buyer).
- Organizer: approval/update-request/donation/ticket/add-on/activity/sales/sponsor/payout/disputes/marketing-package/refund/registration/installment/sponsor-installment families.
- Vendor: `festival_sales`, installment/reminder/refund, `festival_vendor_sale`.

**Excluded from locale matrix (hardcoded `en` in Send*):**  
`organizer_festival_marketing_email_receipt`, `organizer_festival_marketing_sms_receipt` (logo/`lang` forced `en` — not GetValidProfileLanguage).

RTL: `ar` and `fa` render `dir="rtl"` when the Send* actually sets that language. Apple fa badge → en artwork (verified on wallet fa case).

### 1c Edge fixtures

| Case | Purpose |
|---|---|
| `buyer_user_edge_long` | Very long names/titles |
| `buyer_user_edge_10tickets` | 10 tickets (+ wallet) |
| `buyer_user_edge_noimages` | Missing `Festival.LogoImage` / OrganizerLogo |
| `buyer_user_edge_zero` | Zero-amount sale |
| `user_edge_20items` (refund) | 20 refund line items |
| `buyer_user_edge_noimages` (registration) | Missing festival logo |
| `user_edge_emptynote` | Empty optional review note |

### Snapshot inventory

| Set | Count |
|---|---|
| Legacy `.eml` goldens | **283** (was 106) |
| Kit `.eml` goldens | **273** |
| Kit preview HTML | **273** |

---

## 2. Parity results

| Check | Result |
|---|---|
| `TestLegacyOutputSnapshots` | PASS (byte-identical vs goldens) |
| `TestKitLegacyParity` (all cases with kit template, incl. new) | PASS |
| Headers From/To/Subject/Content-Type | Match |
| MIME part count/order/types/boundaries | Match |
| Non-HTML attachment bytes + Content-ID | Match |
| Legacy interesting links (CTA, wallet pass, cid, calendar, unsubscribe, tracking) | Present in kit |

---

## 3. Static audit results (A3)

`TestP3KitStaticClientCompatibilityAudit` — **PASS**

| Rule | Result |
|---|---|
| Table-based layout | PASS |
| MSO conditionals balanced (`<!--[if` / `<![endif]`) | PASS |
| Every `<img>` has `alt`, `width`, `height` | PASS (after kit fixes) |
| No `http://` asset URLs | PASS |
| No placeholder hosts other than `https://kit-cdn.invalid` | PASS |
| No `src=""` | PASS (after kit fixes) |
| No yellow wallet badges / no kit `cdn.eveenty.com` logos | PASS |
| `lang`/`dir` on `<html>` | PASS |
| Body &lt; 102 KB (largest fixture) | PASS — max preview ≈ **67.93 KB** (`refund_receipt_user__user_edge_20items__en`) |
| Dark-mode meta where kit defines it | Present on kit templates using kit head chrome |

---

## 4. Link audit (A4)

`TestP3KitLinkAudit` — **PASS**

Classified `href`/`src` as CTA / wallet / cid / calendar / unsubscribe / tracking / mailto / asset. Flagged empty/malformed/unexpected hosts; failures fixed via kit conditionals (see §6).

---

## 5. Size table (largest kit HTML bodies)

| Preview file | Size (KB) |
|---|---|
| `refund_receipt_user__user_edge_20items__en.html` | 67.93 |
| `festival_ticket_sale__buyer_user_edge_10tickets__en.html` | 56.30 |
| `festival_ticket_sale__buyer_user_wallet3__en.html` | 25.83 |
| `festival_ticket_registration_approval__user__fa.html` | 22.09 |
| Gmail clip budget | &lt; 102 KB — **PASS** |

---

## 6. Kit fixes (parity-preserving; legacy untouched)

| Template | Fix | Why |
|---|---|---|
| `partner_coupons` | Wrap coupon image in `{{ if $coupon.ImageEmail }}` | Avoid `src=""` when fixture has no image |
| `partner_coupons_partner` | Same | Same |
| `book_demo_admin` | Wrap calendar CTA in `{{ if .EventCalendarLink }}` | Avoid empty `href` when calendar link unset |
| `festival_marketing_email_target` | Conditional logo/image + `height` attrs | A3 img height + no empty src |
| `festival_rescounts_marketing_email_target` | Conditional Logo/Image + `height` | Same |
| `festival_marketing_approval` | Conditional FestivalLogo/Image + `height` | Same |
| `kit_parity_test.go` | Skip legacy yellow wallet badge image URLs in link parity | Design chrome; pass/cid links still required |

**Legacy templates / partials / YAML / go.mod / go.sum:** unchanged (protected diff empty).

---

## 7. Part B — Staging CDN verification

**BLOCKED — INPUT PENDING** (`STAGING_KIT_CDN_BASE_URL`).

When set, required table (not run):

| asset_id | GET status | Content-Type | SHA-256 match | Host = staging base |
|---|---|---|---|---|
| (14 manifest rows) | — | — | — | — |

Production host verification remains a **separate release gate** (not P3).

---

## 8. Part C — Staging test sends

**BLOCKED — INPUT PENDING** (`SEND_AUTHORIZED=NO`, QA_RECIPIENTS PENDING, Part B not passed).

No `p3send` build-tag sender was added (conditions not met). No credentials written or logged.

---

## 9. Backend-owned staging checklist (document only — do not execute here)

| # | Action | Owner | Status |
|---|---|---|---|
| 1 | Deploy staging with `EMAIL_KIT_ENABLED=true` + staging kit CDN base | Backend | NOT RUN |
| 2 | Smoke real `Send*` flows on staging (allowlisted only) | Backend / QA | NOT RUN |
| 3 | Rollback drill: switch OFF → legacy path | Backend | NOT RUN |
| 4 | Confirm no Production CDN cross-wire | Backend / Infra | NOT RUN |

---

## 10. Release-gate status (TEST_AND_RELEASE_PLAN.md §4)

| # | Gate | Status |
|---|---|---|
| 1 | All 48 kit templates ported + integration parity pass | **LOCAL PASS** (dormant; parity + snapshots). Not production-activated. |
| 2 | CDN verified on **both** Production and Staging hosts (14 assets) | **NOT RUN** — URLs PENDING |
| 3 | Level B real-client pass on Staging | **NOT RUN** |
| 4 | Backend/Security disposition for all four handoffs (11 ids) | **NOT RUN / unresolved** |
| 5 | Backend confirms rollback capability | **NOT RUN** — Backend-owned |
| 6 | Owner authorizes activation (all 48 together) | **NOT AUTHORIZED** |

---

## Gates (2026-09-28)

```
--- go build ./... ---
exit=0

--- go vet ./email/... ./config/... ---
exit=0

--- go test ./email/... ---
ok  	zemind.ca/rescounts/email
ok  	zemind.ca/rescounts/email/utils
exit=0

--- TestLegacyOutputSnapshots ---
PASS (byte-identical)

--- TestKitLegacyParity ---
PASS (all cases with kit templates, incl. P3 additions)

--- git diff protected (legacy templates/partials, pkg/locales, go.mod/sum) ---
empty

--- rg ---
no EMAIL_KIT_ENABLED=true in email/config
no cdn.eveenty.com under email/templates/kit/
no credentials in P3 test files
```

**git status (backend):** changes under `email/` (+ P1 `config/env.go`). No commit. No stage/push.

---

## Stop conditions checked

| Condition | Outcome |
|---|---|
| Wallet/pkpass parity needing Send*/MIME/legacy change | Not hit (parity PASS) |
| Kit fix would change legacy output | Not hit (legacy goldens unchanged for protected paths) |
| Staging CDN hash/type fail | N/A (blocked) |
| Send to non-allowlisted / credentials on disk | N/A (Part C blocked) |
| New security issue beyond four handoffs | None found; handoffs remain Backend/Security |

---

## Next actions (by owner)

1. **Infra:** supply Staging + Production kit CDN bases; upload 14 manifest assets.  
2. **Backend:** review P1+P2+P3; staging deploy + smoke + rollback drill.  
3. **QA:** execute `LEVEL_B_CHECKLIST.md` on Staging after Part B.  
4. **Backend/Security:** dispositions for four handoffs (11 ids).  
5. **Owner:** visual review of new `email/testdata/kit_preview/` cases (wallet / locales / edges).
