# Visual Parity Exception Reconciliation

Date: 2026-09-29

## Verdict

**VISUAL/PARITY RECONCILIATION — PASS**

The Kit-to-Legacy parity harness now permits only fifteen exact, approved
Legacy-only URLs across thirteen cases. It continues to enforce all other
interesting action, wallet, calendar, tracking, recipient, subject, MIME, and
attachment contracts.

## Initial failures and classification

The untouched `TestKitLegacyParity` run produced exactly thirteen failures.
Every failed assertion was `kit body missing legacy links`; no header, text,
MIME, attachment, Content-ID, or structural assertion failed.

| Template | Case(s) | Legacy-only URL(s) | Current Kit output | Assertion / classification | Approved-design evidence |
|---|---|---|---|---|---|
| `partner_coupons` | `user__en` | Google Play Rescounts app; Apple Rescounts Restaurant Discounts app | Both store URLs absent; PartnerMap CTA remains | `kit body missing legacy links`; link-only; A — approved intentional removal | `VISUAL_FIX_FINAL_SEVEN.md`: approved coupon design removes Rescounts help/app/store/terms while retaining the PartnerMap CTA. `emails/partner_coupons.html` contains only the partner-map CTA. |
| `partner_coupons_partner` | `partner__en` | Same two Rescounts store URLs | Both store URLs absent; PartnerMap CTA remains | `kit body missing legacy links`; link-only; A — approved intentional removal | Same final-seven evidence; `emails/partner_coupons_partner.html` retains the PartnerMap CTA and omits store chrome. |
| `book_demo_admin` | `admin__en` | `https://wa.me/+16479366343` | WhatsApp URL absent; Meet CTA and conditional calendar link remain | `kit body missing legacy links`; link-only; A — approved intentional removal | `VISUAL_FIX_FINAL_SEVEN.md`: remove legacy social chrome; `emails/book_demo_admin.html` retains the Meet CTA and conditional calendar event link. |
| `extra_service_request` | `admin__en` | `https://wa.me/+16479366343` | WhatsApp URL absent; request details remain | `kit body missing legacy links`; link-only; A — approved intentional removal | `VISUAL_FIX_FINAL_SEVEN.md`: remove sign-off/social chrome; `emails/extra_service_request.html` retains the request detail content. |
| `festival_ticket_registration_reject` | `user__en`, `admin__en`, `organizer__en`, `user__ar`, `user__fr`, `user__es`, `user__fa`, `user__xx` | `https://maps.google.com/?q=43.6532,-79.3832` | Map URL absent in all eight exact cases; Event Details remains | `kit body missing legacy links`; link-only; A — approved intentional removal | `VISUAL_FIX_FIVE_REGISTRATION.md`: rejection design has Event Details with **no map row**; `emails/festival_ticket_registration_reject.html` contains no map link. |

The first two rows contain two legacy URLs each, so the thirteen failures map
to fifteen exact URL removals. All five template records were resolved through
`email-cli context`; their approved Preview paths exist and their functional
call-site/locale contracts remain unchanged.

## Exact allowlist

`tests/email/kit_parity_test.go` contains `approvedLegacyRemovals`, a list of
exact `{templateID, persona, locale, url}` entries:

1. `partner_coupons/user/en`: Google Play and Apple Rescounts store URLs.
2. `partner_coupons_partner/partner/en`: the same two URLs.
3. `book_demo_admin/admin/en`: the exact WhatsApp URL.
4. `extra_service_request/admin/en`: the exact WhatsApp URL.
5. `festival_ticket_registration_reject`: the exact Google Maps URL for
   `admin/en`, `organizer/en`, and `user/en/ar/fr/es/fa/xx` only.

`missingLegacyLinks` subtracts an item only when all four fields match. The
existing parity checks for recipient, sender, subject, locale, MIME shape,
attachments, Content-IDs, and every non-allowlisted interesting link are
unchanged. No template, case, domain, or link category was skipped.

## Regression coverage

`TestApprovedLegacyRemovalAllowlist` verifies that:

- an explicit coupon-store removal is allowed;
- an unrelated missing action URL remains reported;
- an exception cannot cross to another template; and
- the map exception is locale-scoped (`user/ar` allowed, `user/de` rejected).

Focused parity plus this regression test passed before the full suite.

## Verification

| Command / suite | Result |
|---|---|
| `go build ./...` | PASS |
| `go vet ./email/... ./config/...` | PASS |
| Focused `TestApprovedLegacyRemovalAllowlist` + affected `TestKitLegacyParity` cases | PASS |
| `TestGenerateICSRFC5545` (`go test ./model/ -run 'ICS\|Ics\|Calendar\|TestGenerateICS'`) | PASS |
| Full preserved `go test ./email/... -count=1 -timeout 600s` | PASS — 322.255s |

The first full-suite attempt used the historical 300-second test timeout and
timed out while rendering Legacy snapshots; it reported no assertion mismatch.
The 600-second rerun completed successfully. The full email package includes
Kit snapshots, Legacy snapshots, Kit-to-Legacy parity, MIME/attachment checks,
inventory/load tests, asset tests, and static/link audits.

## Scope and status

No Kit or Legacy template, production code, fixture, golden, approved Preview,
or backend behavior changed during this reconciliation. The temporary backend
test harness and copied golden directories used to execute the preserved suite
were removed afterward. No commit, push, deploy, or staging was performed.

No case was classified as a real parity defect or as needing further review.
