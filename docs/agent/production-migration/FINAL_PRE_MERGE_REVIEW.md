# FINAL PRE-MERGE REVIEW — Legacy vs Email Kit

Date: 2026-09-28. Backend baseline: `502be96906dc3516736331e8f085d13aef8dbe31`. Preview baseline: `f19da9ce954d4a0391ac79c1e1c414ffd25e1c5f`.

**Verdict: NOT READY — MIGRATION DEFECTS FOUND.**

Seven runtime migration defects and one catalog-path defect were corrected locally. Current-source functional comparisons pass, but the preserved migration snapshot suite does not pass, several approved-design sections are absent from the port, and DEV logo identity is not established. These are not all external release gates; therefore `READY WITH DOCUMENTED EXTERNAL GATES` would overstate this review.

No deployment, send to an SMTP server, staging, commit, push, CDN upload, archive move, asset modification, security remediation, or redesign was performed. Git already contained staged migration changes before this review; this session's fixes remain unstaged.

## 1. Inventory

**Catalog/migration scope: exactly 48 Kit / 11 Legacy. PASS.** All 48 IDs have a unique Kit body, an archived Legacy body, an approved preview, a matrix row, and a readable variable contract. No missing, duplicate, excluded, or orphan Kit body was found. Six Kit partials are shared components, not additional templates. All 48 templates parse and all 11 excluded IDs remain outside the Kit set.

Excluded IDs: `receipt`, `invoice`, `marketing`, `marketing2`, `marketing3`, `marketing4`, `marketing_approval_1`, `marketing_sms_approval`, `marketing_notification_approval`, `restaurant_approval`, `restaurant_decline`.

**Actual backend inventory differs from historical documents:** 59 archived catalog bodies + two existing root-level Legacy bodies = **61 physical Legacy bodies**; adding 48 Kit versions gives 109 physical body files across the two implementations. The additional `organizer_team_invitation` and `festival_end_of_day_report` are already tracked in backend HEAD, have existing senders, and were not added by the migration. They were not classified into the 59-row catalog or ported. Their content was preserved, and the loader regression affecting them was fixed. Their presence must not be hidden behind an unqualified claim that the current backend has only 59 physical templates.

## 2. Functional parity and review coverage

Read: AGENTS, PROJECT_STATE, HANDOFF, P1–P4 reports, CDN checklist, all 48 matrix rows, and all 48 variable contracts. The matrix and contracts are Phase 0 evidence: original pre-archive paths, proposed side-by-side labels, and UNKNOWN locale/caller cells are not current runtime truth. Current catalog paths were corrected without changing membership or approvals.

Fresh capture harnesses call actual Send methods with SMTP delivery replaced by an in-memory buffer. A Go overlay adds the preserved tests without restoring test files into the backend checkout. Compatibility adaptations in temporary test copies only: `newTestSMTPClient` → `newSMTPClient`, remove three references to upstream-removed `FestivalTicketType.Price`, and redirect golden paths to the preview repository. Assertions and preserved goldens were not weakened or overwritten.

For an independent baseline, a second overlay reads the ten original sender source files from backend HEAD and substitutes only the SMTP capture seam. It uses the same current model/locale code and fixture data as the candidate. No baseline sender calls a real SMTP server.

Results:

- **283/283 current Legacy captures match HEAD sender behavior:** semantic From/To/Subject/Content-Type, normalized rendered HTML, and decoded attachment content. Only wall-clock dates/times and calendar DTSTAMP are normalized in this comparison.
- **273/273 Kit captures match current Legacy envelope and decoded attachments:** no address, subject, attachment count, calendar payload, pkpass payload, or unresolved CID difference. This covers every one of the 48 scoped IDs.
- Preserved static compatibility and link audits passed for all 273 Kit cases. These check locale direction/fallback, asset references, empty/malformed links, retained important Legacy links, and HTML size.
- Sender signatures, SMTP envelope recipient expressions, subject builders, language selection/fallback, dynamic images, calendar URLs, tracking/unsubscribe values, and business branches were compared in current source and HEAD. Sender changes are rendering selection, asset chrome, the delivery seam, and representation of calendar bytes; the calendar fallback regression was corrected.
- All distinct Legacy/Kit template actions, variable references, conditions, sender names, and exercised language/direction results are recorded per ID in `FINAL_PRE_MERGE_EVIDENCE.json`. This is fixture and source coverage, not a claim that every possible production input combination has been tested.
- Eight excluded stems have capture cases. The other three excluded marketing variants are verified through unchanged template content, original loader composition, and unchanged sender selection branches. The two additional Legacy templates load during construction; their real scheduled/invitation sends were not executed.

### Difference classification

| Difference | Classification | Finding |
|---|---|---|
| Approved Kit shell, localized logos, cards, typography, official Condensed/Apple badges | INTENTIONAL DESIGN CHANGE | No visual byte equality required |
| Legacy HTML-only or HTML-only mixed wrappers become multipart/alternative with derived text/plain | DOCUMENTED DIFFERENCE | Current MIME builder; business HTML retained |
| Attachment messages gain nested multipart/alternative, QP body encoding, generated boundaries, Date and Message-ID, encoded headers | DOCUMENTED DIFFERENCE | MIME semantics preserved; real-client verification remains open |
| Pass Content-ID gains `@sender-domain`; Apple href changes consistently to that ID | DOCUMENTED DIFFERENCE | Restored working HTML-to-attachment reference; matching IDs tested |
| Old goldens contain older raw-calendar wrappers/content and obsolete organizer-ticket ICS expectations | NEEDS REVIEW | Preserved suite fails; fresh HEAD comparison passes |
| Newer backend model has no ticket-type Price field; ICS test expects older Rescounts UID | DOCUMENTED DIFFERENCE / NEEDS REVIEW | Upstream drift, not a reason to edit business/model code in this task |
| Missing approved status alerts and campaign receipt headings; retained legacy TOTAL styling | **FIXED 2026-09-29** | Four IDs — see `VISUAL_FIX_FOUR_TEMPLATES.md` |
| Five registration ports: festival-logo + legacy footer/social chrome | **FIXED 2026-09-29** | Five IDs — see `VISUAL_FIX_FIVE_REGISTRATION.md`; remaining visual NEEDS REVIEW is final-seven |
| Pre-existing Rescounts coupon body/store/help copy | DOCUMENTED DIFFERENCE | P2 explicitly retained it; Kit uses approved Eveenty header artwork |
| Eight defects corrected in this review | FUNCTIONAL DEFECT | Exact fixes below |

## 3. MIME and attachments

**Current-source MIME/attachment parity: PASS after fixes.**

Attachment-bearing IDs: `festival_ticket_sale`, `festival_activity_sale`, `festival_add_on_sale`, `festival_sponsor_sale`, `festival_sales`. Actual emitted attachment behavior depends on sender persona and supplied data; an empty calendar is not an attachment merely because a template can support it.

- Ticket sale: one- and three-pass cases, Persian Wallet case, and ten-ticket edge fixture retain raw pkpass bytes. Pass parts keep filename `ticket-N.pkpass`, base64 transfer encoding, and valid Content-ID. Apple badge hrefs resolve to the same attached part IDs. Google pass URLs remain unchanged.
- ICS: all five families preserve decoded calendar data relative to HEAD; Kit encodes raw ICS once. Legacy fallback again receives base64 data as required by its archived template's `Content-Transfer-Encoding: base64` declaration. This was broken before this review.
- Calendar method, UID, time zone/date content, reminder data, and Google/Apple/Yahoo action URLs were reviewed without changing model calendar generation. Kit calendar parts declare `method=PUBLISH` and `event.ics`.
- Five `festival_ticket_registration*` bodies used HTML-only multipart/mixed wrappers in Legacy. They did not carry file attachments in the reviewed paths. Current multipart/alternative output is a documented MIME difference, not a lost file.
- Organizer ticket sale has **no FestivalICSData assignment in current HEAD**. The five old parity failures expect an ICS that is no longer produced by that sender. The candidate matches HEAD; no attachment was invented to satisfy those old goldens.

Real mail-client interpretation of CID pass links and nested MIME remains a QA/DEV smoke gate. This report does not substitute browser rendering for delivered-message testing.

## 4. Assets and CDN

**Resolver mapping: PASS — exactly 14 unique flat keys.** `config.CdnURL` supplies the host; development/staging use `https://cdn-dv.eveenty.com`, production uses `https://cdn.eveenty.com`. No live feature flag or separate Kit CDN setting remains. See the asset table below.

Fresh HTTPS GETs:

- DEV: **14/14 HTTP 200, image/png**.
- Production: **14/14 HTTP 403**. Content presence/type cannot be asserted; deferred to Infra before Production release.
- DEV Wallet files: **9/9 SHA-256 match** the approved manifest.
- DEV logos: **5/5 SHA-256 differ** from the approved manifest. No alternate prepared/optimized logo set was found in the reviewed repository documentation. This proves different file bytes, not necessarily different visible artwork. A decoded-pixel follow-up via Python was denied HTTP 403; pixel equivalence is **NOT VERIFIED**. Infra/Backend must establish intended logo identity before calling all 14 assets approved-content matches.

Google uses Condensed only. Apple uses en/ar/fr/es; Persian resolves to English. Locale-specific badge widths were corrected to preserve source proportions at 48px height. Ten fresh browser checks (five locales × 600/320px) passed for height, aspect ratio within integer-pixel rounding, and horizontal fit.

Kit templates contain no hardcoded environment host, obsolete yellow Wallet image, Primary badge image, or `.invalid` URL. Runtime source **does contain** the unused exported test constant `KitAssetTestCDNBase = "https://cdn.snapshot.invalid"` in `email/utils/kit_assets.go`; it is not used by production asset resolution. Do not report zero `.invalid` literals in runtime source. Test outputs intentionally use inert fixture hosts.

The asset resolver checks HTTPS syntax, not reachability or asset identity, and does not reject `.invalid` hosts by itself. Current application environment configuration supplies the real hosts. There is no CDN availability gate at activation; therefore HTTP 403 objects do not prevent Kit selection. This behavior is a documented post-P4 architectural difference, not a successful CDN verification.

## 5. Selection and activation

Before review: `parsedCount > 0` enabled Kit, allowing a partially parsed deployment to mix Kit and Legacy. **Fixed:** Kit is active only when **exactly 48** bodies parse. A focused one-template regression check confirms partial sets remain inactive. All 48 current IDs parse; excluded IDs retain Legacy.

`templateFor` chooses a named Kit body only while Kit is active; otherwise it returns the archived Legacy body. `deliverRendered` wraps only Kit output; Legacy messages are sent unchanged through the equivalent capture/SMTP seam. The loader also preserves the two pre-existing root-level Legacy templates.

`EMAIL_KIT_ENABLED` is absent and stale; it is not required. `EMAIL_KIT_CDN_BASE_URL` is also absent. Deploy/redeploy controls release and rollback. The latest post-P4 decision removed the CDN activation gate; this review restored completeness of the 48-template set without reintroducing a runtime feature flag or changing CDN configuration.

## 6. Legacy safety

**Source/content safety: PASS with precise qualifications.** Git reports 59 bodies, 12 partials, and `welcome_email_ad.png` as existing archive renames. All 71 archived text files match HEAD content after CRLF normalization; the PNG matches exactly. Both additional root-level Legacy templates match HEAD content after CRLF normalization. No Legacy content was edited during this review.

Diffs of `pkg/locales`, `config`, `go.mod`, `go.sum`, and `model/festival.go` against HEAD are empty. Current business/model/locale code is shared by both fresh capture runs. Existing sender files necessarily changed for Kit selection and delivery; it would be inaccurate to say senders were untouched. Fresh Legacy-vs-HEAD output comparison passed all 283 available cases after the calendar representation fix.

## 7. Tests — fresh results, including failures

| Check | Result |
|---|---|
| `go build ./...` | PASS; existing module-cache metadata required sandbox escalation; no dependency install |
| `go vet ./email/... ./config/...` | PASS |
| `go test ./email/... -count=1` in current checkout | PASS; the pre-existing integration test is skipped and the migration tests are absent from this checkout |
| Catalog validation | Initially FAIL on all 59 obsolete paths; PASS after path-only catalog fix |
| Preserved migration tests via temporary Go overlay | **FAIL: 130 leaf failures** — 5 parity, 62 Kit snapshots, 63 Legacy snapshots |
| Preserved all-case P3 static and link audits | PASS — 273 cases each |
| Preserved MIME/asset/load/inventory/partial-isolation tests | PASS |
| Preserved model ICS test | **FAIL** — expects `UID:fest-1@rescounts.com`, current HEAD emits `UID:fest-1@eveenty.com` |
| Fresh HEAD-baseline capture | PASS — 283 cases |
| Fresh Legacy-vs-HEAD comparison | PASS — 283 cases |
| Fresh Kit envelope/decoded-attachment comparison | PASS — 273 cases |
| Supplemental export, partial rejection, CID, calendar encoding, Wallet locale, price-name branch tests | PASS |
| Browser comparison | 192 captures: approved and current Kit × 48 IDs × 600/320px; zero page horizontal overflow |
| Wallet aspect/fit browser checks | PASS — 10 checks, five locales × 600/320px |
| Real Gmail/Outlook/Apple Mail / DEV SMTP sends | NOT RUN |
| Git whitespace check | PASS; line-ending conversion warnings recorded |

The preserved snapshot suite was run after the initial runtime fixes and before the final badge-width/price-name repairs. Its failures are retained and not represented as a pass for the final candidate. A focused ticket static/link audit and supplemental render tests were rerun for the final ticket changes. Existing golden files were not regenerated.

Failure groups: Kit snapshots — sales 11, activity 12, add-on 12, sponsor 7, ticket 20. Legacy snapshots — the same groups plus one bad-content timestamp/normalization case. Old parity — organizer ticket sale en/fr/es/fa/xx. These require a controlled reconciliation of old evidence with HEAD, updated fixtures/normalization where justified, and rerunning the full suite. Passing the ordinary checkout package test alone does not close this local gate.

## 8. Rendered output versus the 48 approved designs

Reviewed actual freshly captured Kit HTML, all 48 approved HTML files, DOM content/link/image records, and 48 pairs of contact-sheet images. Different recipients, amounts, item counts, statuses, blank optional fields, and synthetic fixture values are not visual or functional defects by themselves. Fixture external images were blocked; static artwork was served from approved local files. Browser views therefore do not verify the mismatching remote logo bytes.

**Visual result: NEEDS REVIEW for remaining ports, not a blanket PASS.** Concrete observations:

1. `registration_approval_status_changed`: **FIXED 2026-09-29** — Kit now renders the approved green/red status-alert block (title from subject segment; `IsApproved` for variant). See `VISUAL_FIX_FOUR_TEMPLATES.md`.
2. `festival_approval_status_changed`: **FIXED 2026-09-29** — Kit now includes status-alert (`AlertTitleApproved` / `AlertTitleRejected`) and branded footer. Review-note section remains data-gated (`{{ if .ReviewNote }}`); empty note in a reject fixture is not a defect.
3. Both `organizer_festival_marketing_*_receipt` templates: **FIXED 2026-09-29** — campaign-receipt alert title + “Campaign receipt” section heading restored; yellow Legacy TOTAL band replaced with approved neutral row; Twitter removed from social row to match approved Preview.
4. Final-seven administrative/commerce ports move headings into the body after the branded header and retain additional Legacy copy/sections; coupon bodies retain Rescounts app/help text. Those differences need explicit port disposition against the approved references; they do not authorize reopening the original design decisions.
5. Five registration ports: **FIXED 2026-09-29** — festival-logo slot and legacy Make-your-event/live social chrome removed; per-template footers, Ticket N of N / approval cards / reject Event Details (no map), and deadline alert titles matched to approved Preview. See `VISUAL_FIX_FIVE_REGISTRATION.md`.

Functional links that were present in Legacy remain in the captured Kit fixtures. Optional calendar CTAs, optional note sections, campaign images and item images depend on data. Missing real fixture images in these screenshots are intentional network blocking, not proof of broken production URLs. No actual real-client delivery or visual owner approval was granted by this review.

## 9. Security handoff boundary

All **11/11** handoff IDs have Kit bodies and are included in fresh migration parity coverage: `organizer_announcement`; `festival_marketing_approval`; `festival_marketing_approval_sms`; `festival_rescounts_marketing_email_target`; `marketing_package_sale`; `festival_payout`; `partner_coupons`; `partner_coupons_partner`; `bad_content_alert`; `book_demo_admin`; `extra_service_request`.

The four existing handoffs remain owned by **Backend/Security**. Existing raw HTML trust boundaries, approval GET links, dynamic headers, and submitted demo URL observations were not remediated or security-cleared. Kit selection does not enforce security disposition. Their disposition is still required before the relevant Production release workflows.

## 10. Exact defects corrected

| Defect | Fix | Verification |
|---|---|---|
| Two calls to undefined `smtp` after import removal | Invitation and end-of-day Legacy senders use equivalent `c.deliver` seam | Build/vet/package test; existing sender logic preserved |
| Archive loader cannot find two newer root-level Legacy templates | Use original root path when the archived body does not exist | Actual client construction and inventory/content comparison |
| Partial Kit activation | Require exactly 48 parsed bodies | Full parse/inventory and focused partial-set test |
| Raw ICS passed to Legacy templates declaring base64 | `calendarData` chooses raw bytes for Kit and base64 for Legacy, across 15 sender assignments | 283 HEAD comparisons and calendar encoding regression |
| Apple badge has no href | Generate CID href matching attached pass Content-ID | Wallet 1/3/fa capture and CID regression |
| All Wallet languages forced to EN dimensions | Google fa 186px; Apple ar/fr/es 153/154/180px; 48px height, English fallback for fa | Ten browser aspect/fit checks |
| `TicketPriceName` lost from ticket sale port | Restore escaped price-tier name under the existing ShowPrices branch | Explicit nonempty tier fixture, visible/hidden branch assertions |
| Catalog points to removed pre-archive paths | Update only 59 production paths to verified archive locations | Catalog validator PASS; scope and approvals unchanged |

## 11. Remaining work, separated from external gates

**Local merge blockers:** preserved snapshot/parity/ICS suite reconciled 2026-09-29 (see `PRESERVED_SUITE_RECONCILIATION_REPORT.md`). Four status/receipt visual port omissions fixed 2026-09-29 (see `VISUAL_FIX_FOUR_TEMPLATES.md`). Five registration visual port omissions fixed 2026-09-29 (see `VISUAL_FIX_FIVE_REGISTRATION.md`). Remaining: disposition FINAL_PRE_MERGE section 8 item 4 (final-seven); optional kit golden refresh for the nine fixed IDs; document the two additional pre-existing Legacy IDs without silently expanding the approved 48-template scope.

**External gates only:** Infra/Backend establish DEV logo asset identity; Operator/Backend perform authorized DEV deployment and actual sample sends/rollback smoke; QA perform Level B; Infra make and verify Production's 14 objects; Backend/Security disposition the four existing handoffs; obtain the separate Production release authorization. No Backend/Security work is assigned to the owner.

## 12. Git and cleanliness

Backend changes are confined to `email/`; 145 changed paths relative to HEAD, including inherited staged archive renames and Kit/runtime additions. There are **no backend untracked files**. No unrelated model, locale, configuration, dependency, deployment, or business-layer edits were found. No new TODO/debug output was introduced in the runtime migration files. Historical test/golden/report files remain in the preview evidence directory, not in the backend PR.

Review-generated `.eml`, HTML captures, overlays, and Go cache are in the task's OS temporary directories. They are not backend shipping artifacts. Review scripts/tests, validation results, contact sheets, and JSON summaries are preview-only evidence. The unused `.invalid` constant and unused Primary CSS selectors are explicitly disclosed; there is no active Primary image or `.invalid` template asset URL.

Full final backend status and all changed paths are appended below and also preserved in `FINAL_PRE_MERGE_EVIDENCE.json`. Preview status is appended after recording this report and handoff. No existing staging was changed by this review.

## 13. Final verdict

**NOT READY — MIGRATION DEFECTS FOUND.** The concrete runtime regressions discovered here are repaired and tested. The final candidate has strong current-source parity evidence, but the failed preserved test gate and unresolved approved-design port differences prevent a final merge-ready claim. Production CDN availability, DEV logo identity, actual DEV sends, Level B, and security disposition also remain open. Stop here; no merge or deployment was performed.

## Per-template results and exact final status

The following generated appendices are part of this report.

### All 48 IDs

Functional PASS below means current-source capture/source parity within reviewed fixtures; it does not close the failing historical snapshot gate. Visual SAMPLE REVIEWED records inspection, not owner approval or Level B.

| Template | Kit cases | Rendered languages | Sender(s), current source | Functional | Visual |
|---|---:|---|---|---|---|
| `activate_email` | 6 | ar, en, es, fa, fr | SendActivateEmail | PASS | SAMPLE REVIEWED |
| `password_reset` | 6 | ar, en, es, fa, fr | SendPasswordReset | PASS | SAMPLE REVIEWED |
| `festival_donation` | 12 | ar, en, es, fa, fr | SendAdminDonation, SendOrganizerDonation, SendUserDonationReceipt | PASS | SAMPLE REVIEWED |
| `festival_ticket_sale` | 20 | ar, en, es, fa, fr | SendFestivalTicketSaleToAdmin, SendFestivalTicketSaleToOrganizer, SendFestivalTicketSaleToBuyerUser, SendFestivalTicketToGuestUser | PASS | SAMPLE REVIEWED |
| `festival_add_on_sale` | 12 | ar, en, es, fa, fr | SendFestivalAddOnSaleToAdmin, SendFestivalAddOnSaleToOrganizer, SendFestivalAddOnSaleToUser | PASS | SAMPLE REVIEWED |
| `festival_activity_sale` | 12 | ar, en, es, fa, fr | SendActivitySaleToAdmin, SendActivitySaleToOrganizer, SendActivitySaleToUser | PASS | SAMPLE REVIEWED |
| `festival_sponsor_sale` | 7 | en, es, fa, fr | SendSponsorSaleToAdmin, SendSponsorSaleToOrganizer, SendSponsorSaleToSponsor | PASS | SAMPLE REVIEWED |
| `festival_sales` | 11 | en, es, fa, fr | SendFestivalSaleToAdmin, SendFestivalSaleToOrganizer, SendFestivalSaleToVendor | PASS | SAMPLE REVIEWED |
| `festival_vendor_sale` | 12 | ar, en, es, fa, fr | SendVendorSaleEmail, SendSaleReceivedEmail, SendVendorSaleEmailToVendor | PASS | SAMPLE REVIEWED |
| `festival_sale_installment_paid` | 11 | en, es, fa, fr | SendAdminPaidInstallment, SendOrganizerPaidInstallment, SendVendorPaidInstallment | PASS | SAMPLE REVIEWED |
| `second_payment_reminder` | 11 | en, es, fa, fr | SendAdminSecondPaymentReminder, SendOrganizerSecondPaymentReminder, SendVendorSecondPaymentReminder | PASS | SAMPLE REVIEWED |
| `first_payment_refund` | 11 | en, es, fa, fr | SendAdminFirstPaymentRefund, SendOrganizerFirstPaymentRefund, SendVendorFirstPaymentRefund | PASS | SAMPLE REVIEWED |
| `sponsor_installment_paid` | 7 | en, es, fa, fr | SendSponsorInstallmentPaidToSponsor, SendSponsorInstallmentPaidToAdmin, SendSponsorInstallmentPaidToOrganizer | PASS | SAMPLE REVIEWED |
| `sponsor_installment_second_payment_reminder` | 7 | en, es, fa, fr | SendInstallmentSecondPaymentReminderToSponsor, SendInstallmentSecondPaymentReminderToAdmin, SendInstallmentSecondPaymentReminderToOrganizer | PASS | SAMPLE REVIEWED |
| `sponsor_first_payment_refund` | 7 | en, es, fa, fr | SendSponsorFirstPaymentRefundToSponsor, SendSponsorFirstPaymentRefundToAdmin, SendSponsorFirstPaymentRefundToOrganizer | PASS | SAMPLE REVIEWED |
| `refund_receipt_user` | 7 | ar, en, es, fa, fr | SendRefundItemsToTargetUser | PASS | SAMPLE REVIEWED |
| `refund_receipt_organizer` | 5 | en, es, fa, fr | SendRefundItemsToOrganizer | PASS | SAMPLE REVIEWED |
| `refund_receipt_admin` | 1 | en | SendRefundItemsToAdmin | PASS | SAMPLE REVIEWED |
| `marketing_package_sale` | 6 | en, es, fa, fr | SendMarketingPackageSaleToAdmin, SendMarketingPackageSaleToOrganizer | PASS | NEEDS REVIEW |
| `festival_payout` | 6 | en | sendPayoutEmail | PASS | NEEDS REVIEW |
| `festival_ticket_registration` | 13 | ar, en, es, fa, fr | SendTicketRegistrationToAdmin, SendTicketRegistrationToOrganizer, SendTicketRegistrationToBuyerUser | PASS | **FIXED 2026-09-29** |
| `festival_ticket_registration_approval` | 8 | ar, en, es, fa, fr | SendFestivalTicketRegistrationApprovalToAdmin, SendFestivalTicketRegistrationApprovalToOrganizer, SendFestivalTicketRegistrationApprovalToUser | PASS | **FIXED 2026-09-29** |
| `festival_ticket_registration_reject` | 8 | ar, en, es, fa, fr | SendFestivalTicketRegistrationRejectToAdmin, SendFestivalTicketRegistrationRejectToOrganizer, SendFestivalTicketRegistrationRejectToUser | PASS | **FIXED 2026-09-29** |
| `festival_ticket_registration_deadline_exceeded` | 8 | ar, en, es, fa, fr | SendFestivalTicketRegistrationReviewDeadlineExceededToAdmin, SendFestivalTicketRegistrationReviewDeadlineExceededToOrganizer, SendFestivalTicketRegistrationReviewDeadlineExceededToUser | PASS | **FIXED 2026-09-29** |
| `festival_ticket_registration_payment_deadline_exceeded` | 8 | ar, en, es, fa, fr | SendFestivalTicketRegistrationPaymentDeadlineExceededToAdmin, SendFestivalTicketRegistrationPaymentDeadlineExceededToOrganizer, SendFestivalTicketRegistrationPaymentDeadlineExceededToUser | PASS | **FIXED 2026-09-29** |
| `registration_approval_status_changed` | 7 | ar, en, es, fa, fr | SendRegistrationApprovalStatusChangedToUser | PASS | VISUAL FIXED 2026-09-29 |
| `partner_coupons` | 1 | en | SendCoupon | PASS | NEEDS REVIEW |
| `partner_coupons_partner` | 1 | en | SendCouponToPartner | PASS | NEEDS REVIEW |
| `festival_approval_status_changed` | 5 | en, es, fa, fr | SendFestivalApprovalStatusChangedToOrganizer | PASS | VISUAL FIXED 2026-09-29 |
| `festival_update_request_approved` | 5 | en, es, fa, fr | SendApprovedUpdateRequestToOrganizer | PASS | SAMPLE REVIEWED |
| `festival_update_request_rejected` | 5 | en, es, fa, fr | SendApprovedUpdateRequestToOrganizer | PASS | SAMPLE REVIEWED |
| `festival_vendor_sale_rejection` | 1 | en | SendVendorSaleRejectionEmail | PASS | SAMPLE REVIEWED |
| `dispute_notification` | 6 | en, es, fa, fr | SendDisputeNotificationToAdmin, SendDisputeNotificationToOrganizer | PASS | SAMPLE REVIEWED |
| `needs_response_dispute_reminder` | 6 | en, es, fa, fr | SendNeedsResponseDisputeReminderToAdmin, SendNeedsResponseDisputeReminderToOrganizer | PASS | SAMPLE REVIEWED |
| `festival_update_request_issued` | 1 | en | SendFestivalUpdateRequestIssuedToAdmin | PASS | SAMPLE REVIEWED |
| `festival_created` | 1 | en | SendFestivalCreatedToAdmin | PASS | SAMPLE REVIEWED |
| `festival_marketing_approval` | 1 | en | SendFestivalMarketingEmailToAdmin | PASS | SAMPLE REVIEWED |
| `festival_marketing_approval_sms` | 1 | en | SendFestivalMarketingSMSToAdmin | PASS | SAMPLE REVIEWED |
| `support` | 1 | en | SendSupportEmail | PASS | SAMPLE REVIEWED |
| `bad_content_alert` | 1 | en | SendBadContentAlert | PASS | NEEDS REVIEW |
| `contact_submission` | 1 | en | SendContactSubmission | PASS | SAMPLE REVIEWED |
| `book_demo_admin` | 1 | en | SendAdminBookDemoEmail | PASS | NEEDS REVIEW |
| `extra_service_request` | 1 | en | SendExtraServiceRequestToAdmin | PASS | NEEDS REVIEW |
| `organizer_festival_marketing_email_receipt` | 1 | en | SendFestivalMarketingEmailReceipt | PASS | VISUAL FIXED 2026-09-29 |
| `organizer_festival_marketing_sms_receipt` | 1 | en | SendFestivalMarketingSMSReceipt | PASS | VISUAL FIXED 2026-09-29 |
| `festival_marketing_email_target` | 1 | en | SendFestivalMarketingEmailToTarget | PASS | SAMPLE REVIEWED |
| `festival_rescounts_marketing_email_target` | 1 | en | SendFestivalRescountsMarketingEmailToTarget | PASS | SAMPLE REVIEWED |
| `organizer_announcement` | 1 | en | SendOrganizerAnnouncement | PASS | SAMPLE REVIEWED |

### Fourteen static asset results

| Asset | Object key | DEV HTTPS GET | DEV hash vs approved | Production HTTPS GET |
|---|---|---|---|---|
| logo_en | `/logos/eveenty-logo-en.png` | 200 image/png | DIFFERENT — NEEDS REVIEW | 403 |
| logo_fr | `/logos/eveenty-logo-fr.png` | 200 image/png | DIFFERENT — NEEDS REVIEW | 403 |
| logo_es | `/logos/eveenty-logo-es.png` | 200 image/png | DIFFERENT — NEEDS REVIEW | 403 |
| logo_ar | `/logos/eveenty-logo-ar.png` | 200 image/png | DIFFERENT — NEEDS REVIEW | 403 |
| logo_fa | `/logos/eveenty-logo-fa.png` | 200 image/png | DIFFERENT — NEEDS REVIEW | 403 |
| wallet_google-condensed_en | `/condensed/en.png` | 200 image/png | MATCH | 403 |
| wallet_google-condensed_ar | `/condensed/ar.png` | 200 image/png | MATCH | 403 |
| wallet_google-condensed_fr | `/condensed/fr.png` | 200 image/png | MATCH | 403 |
| wallet_google-condensed_es | `/condensed/es.png` | 200 image/png | MATCH | 403 |
| wallet_google-condensed_fa | `/condensed/fa.png` | 200 image/png | MATCH | 403 |
| wallet_apple_en | `/apple/en.png` | 200 image/png | MATCH | 403 |
| wallet_apple_ar | `/apple/ar.png` | 200 image/png | MATCH | 403 |
| wallet_apple_fr | `/apple/fr.png` | 200 image/png | MATCH | 403 |
| wallet_apple_es | `/apple/es.png` | 200 image/png | MATCH | 403 |

### Final backend status (all changed paths)

```text
AM email/kit_envelope.go
A  email/mime_message.go
M  email/smtp.go
MM email/smtp_admin.go
A  email/smtp_client.go
A  email/smtp_deliver.go
AM email/smtp_kit.go
M  email/smtp_model.go
MM email/smtp_organizer_emails.go
M  email/smtp_partner.go
M  email/smtp_payout.go
MM email/smtp_render_template.go
M  email/smtp_restaurant_emails.go
M  email/smtp_sponsor_installments.go
M  email/smtp_support.go
MM email/smtp_user_emails.go
MM email/smtp_vendor_emails.go
R  email/templates/activate_email.template -> email/templates/archive/legacy/activate_email.template
R  email/templates/bad_content_alert.template -> email/templates/archive/legacy/bad_content_alert.template
R  email/templates/book_demo_admin.template -> email/templates/archive/legacy/book_demo_admin.template
R  email/templates/contact_submission.template -> email/templates/archive/legacy/contact_submission.template
R  email/templates/dispute_notification.template -> email/templates/archive/legacy/dispute_notification.template
R  email/templates/extra_service_request.template -> email/templates/archive/legacy/extra_service_request.template
R  email/templates/festival_activity_sale.template -> email/templates/archive/legacy/festival_activity_sale.template
R  email/templates/festival_add_on_sale.template -> email/templates/archive/legacy/festival_add_on_sale.template
R  email/templates/festival_approval_status_changed.template -> email/templates/archive/legacy/festival_approval_status_changed.template
R  email/templates/festival_created.template -> email/templates/archive/legacy/festival_created.template
R  email/templates/festival_donation.template -> email/templates/archive/legacy/festival_donation.template
R  email/templates/festival_marketing_approval.template -> email/templates/archive/legacy/festival_marketing_approval.template
R  email/templates/festival_marketing_approval_sms.template -> email/templates/archive/legacy/festival_marketing_approval_sms.template
R  email/templates/festival_marketing_email_target.template -> email/templates/archive/legacy/festival_marketing_email_target.template
R  email/templates/festival_payout.template -> email/templates/archive/legacy/festival_payout.template
R  email/templates/festival_rescounts_marketing_email_target.template -> email/templates/archive/legacy/festival_rescounts_marketing_email_target.template
R  email/templates/festival_sale_installment_paid.template -> email/templates/archive/legacy/festival_sale_installment_paid.template
R  email/templates/festival_sales.template -> email/templates/archive/legacy/festival_sales.template
R  email/templates/festival_sponsor_sale.template -> email/templates/archive/legacy/festival_sponsor_sale.template
R  email/templates/festival_ticket_registration.template -> email/templates/archive/legacy/festival_ticket_registration.template
R  email/templates/festival_ticket_registration_approval.template -> email/templates/archive/legacy/festival_ticket_registration_approval.template
R  email/templates/festival_ticket_registration_deadline_exceeded.template -> email/templates/archive/legacy/festival_ticket_registration_deadline_exceeded.template
R  email/templates/festival_ticket_registration_payment_deadline_exceeded.template -> email/templates/archive/legacy/festival_ticket_registration_payment_deadline_exceeded.template
R  email/templates/festival_ticket_registration_reject.template -> email/templates/archive/legacy/festival_ticket_registration_reject.template
R  email/templates/festival_ticket_sale.template -> email/templates/archive/legacy/festival_ticket_sale.template
R  email/templates/festival_update_request_approved.template -> email/templates/archive/legacy/festival_update_request_approved.template
R  email/templates/festival_update_request_issued.template -> email/templates/archive/legacy/festival_update_request_issued.template
R  email/templates/festival_update_request_rejected.template -> email/templates/archive/legacy/festival_update_request_rejected.template
R  email/templates/festival_vendor_sale.template -> email/templates/archive/legacy/festival_vendor_sale.template
R  email/templates/festival_vendor_sale_rejection.template -> email/templates/archive/legacy/festival_vendor_sale_rejection.template
R  email/templates/first_payment_refund.template -> email/templates/archive/legacy/first_payment_refund.template
R  email/templates/invoice.template -> email/templates/archive/legacy/invoice.template
R  email/templates/marketing.template -> email/templates/archive/legacy/marketing.template
R  email/templates/marketing2.template -> email/templates/archive/legacy/marketing2.template
R  email/templates/marketing3.template -> email/templates/archive/legacy/marketing3.template
R  email/templates/marketing4.template -> email/templates/archive/legacy/marketing4.template
R  email/templates/marketing_approval_1.template -> email/templates/archive/legacy/marketing_approval_1.template
R  email/templates/marketing_notification_approval.template -> email/templates/archive/legacy/marketing_notification_approval.template
R  email/templates/marketing_package_sale.template -> email/templates/archive/legacy/marketing_package_sale.template
R  email/templates/marketing_sms_approval.template -> email/templates/archive/legacy/marketing_sms_approval.template
R  email/templates/needs_response_dispute_reminder.template -> email/templates/archive/legacy/needs_response_dispute_reminder.template
R  email/templates/organizer_announcement.template -> email/templates/archive/legacy/organizer_announcement.template
R  email/templates/organizer_festival_marketing_email_receipt.template -> email/templates/archive/legacy/organizer_festival_marketing_email_receipt.template
R  email/templates/organizer_festival_marketing_sms_receipt.template -> email/templates/archive/legacy/organizer_festival_marketing_sms_receipt.template
R  email/templates/partials/contact_container_both_dirs.template -> email/templates/archive/legacy/partials/contact_container_both_dirs.template
R  email/templates/partials/footer_1.template -> email/templates/archive/legacy/partials/footer_1.template
R  email/templates/partials/footer_branded_both_dirs.template -> email/templates/archive/legacy/partials/footer_branded_both_dirs.template
R  email/templates/partials/footer_ticket_registration.template -> email/templates/archive/legacy/partials/footer_ticket_registration.template
R  email/templates/partials/footer_with_icons_both_dirs.template -> email/templates/archive/legacy/partials/footer_with_icons_both_dirs.template
R  email/templates/partials/header_1.template -> email/templates/archive/legacy/partials/header_1.template
R  email/templates/partials/header_2.template -> email/templates/archive/legacy/partials/header_2.template
R  email/templates/partials/header_2_localized.template -> email/templates/archive/legacy/partials/header_2_localized.template
R  email/templates/partials/header_3.template -> email/templates/archive/legacy/partials/header_3.template
R  email/templates/partials/header_3_both_dirs.template -> email/templates/archive/legacy/partials/header_3_both_dirs.template
R  email/templates/partials/header_4.template -> email/templates/archive/legacy/partials/header_4.template
R  email/templates/partials/header_4_localized.template -> email/templates/archive/legacy/partials/header_4_localized.template
R  email/templates/partner_coupons.template -> email/templates/archive/legacy/partner_coupons.template
R  email/templates/partner_coupons_partner.template -> email/templates/archive/legacy/partner_coupons_partner.template
R  email/templates/password_reset.template -> email/templates/archive/legacy/password_reset.template
R  email/templates/receipt.template -> email/templates/archive/legacy/receipt.template
R  email/templates/refund_receipt_admin.template -> email/templates/archive/legacy/refund_receipt_admin.template
R  email/templates/refund_receipt_organizer.template -> email/templates/archive/legacy/refund_receipt_organizer.template
R  email/templates/refund_receipt_user.template -> email/templates/archive/legacy/refund_receipt_user.template
R  email/templates/registration_approval_status_changed.template -> email/templates/archive/legacy/registration_approval_status_changed.template
R  email/templates/restaurant_approval.template -> email/templates/archive/legacy/restaurant_approval.template
R  email/templates/restaurant_decline.template -> email/templates/archive/legacy/restaurant_decline.template
R  email/templates/second_payment_reminder.template -> email/templates/archive/legacy/second_payment_reminder.template
R  email/templates/sponsor_first_payment_refund.template -> email/templates/archive/legacy/sponsor_first_payment_refund.template
R  email/templates/sponsor_installment_paid.template -> email/templates/archive/legacy/sponsor_installment_paid.template
R  email/templates/sponsor_installment_second_payment_reminder.template -> email/templates/archive/legacy/sponsor_installment_second_payment_reminder.template
R  email/templates/support.template -> email/templates/archive/legacy/support.template
R  email/templates/welcome_email_ad.png -> email/templates/archive/legacy/welcome_email_ad.png
A  email/templates/kit/activate_email.template
A  email/templates/kit/bad_content_alert.template
A  email/templates/kit/book_demo_admin.template
A  email/templates/kit/contact_submission.template
A  email/templates/kit/dispute_notification.template
A  email/templates/kit/extra_service_request.template
A  email/templates/kit/festival_activity_sale.template
A  email/templates/kit/festival_add_on_sale.template
A  email/templates/kit/festival_approval_status_changed.template
A  email/templates/kit/festival_created.template
A  email/templates/kit/festival_donation.template
A  email/templates/kit/festival_marketing_approval.template
A  email/templates/kit/festival_marketing_approval_sms.template
A  email/templates/kit/festival_marketing_email_target.template
A  email/templates/kit/festival_payout.template
A  email/templates/kit/festival_rescounts_marketing_email_target.template
A  email/templates/kit/festival_sale_installment_paid.template
A  email/templates/kit/festival_sales.template
A  email/templates/kit/festival_sponsor_sale.template
A  email/templates/kit/festival_ticket_registration.template
A  email/templates/kit/festival_ticket_registration_approval.template
A  email/templates/kit/festival_ticket_registration_deadline_exceeded.template
A  email/templates/kit/festival_ticket_registration_payment_deadline_exceeded.template
A  email/templates/kit/festival_ticket_registration_reject.template
AM email/templates/kit/festival_ticket_sale.template
A  email/templates/kit/festival_update_request_approved.template
A  email/templates/kit/festival_update_request_issued.template
A  email/templates/kit/festival_update_request_rejected.template
A  email/templates/kit/festival_vendor_sale.template
A  email/templates/kit/festival_vendor_sale_rejection.template
A  email/templates/kit/first_payment_refund.template
A  email/templates/kit/marketing_package_sale.template
A  email/templates/kit/needs_response_dispute_reminder.template
A  email/templates/kit/organizer_announcement.template
A  email/templates/kit/organizer_festival_marketing_email_receipt.template
A  email/templates/kit/organizer_festival_marketing_sms_receipt.template
A  email/templates/kit/partials/kit_branded_footer.template
A  email/templates/kit/partials/kit_branded_header.template
A  email/templates/kit/partials/kit_head_styles.template
A  email/templates/kit/partials/kit_primary_button.template
A  email/templates/kit/partials/kit_registration_details.template
A  email/templates/kit/partials/kit_wallet_badges.template
A  email/templates/kit/partner_coupons.template
A  email/templates/kit/partner_coupons_partner.template
A  email/templates/kit/password_reset.template
A  email/templates/kit/refund_receipt_admin.template
A  email/templates/kit/refund_receipt_organizer.template
A  email/templates/kit/refund_receipt_user.template
A  email/templates/kit/registration_approval_status_changed.template
A  email/templates/kit/second_payment_reminder.template
A  email/templates/kit/sponsor_first_payment_refund.template
A  email/templates/kit/sponsor_installment_paid.template
A  email/templates/kit/sponsor_installment_second_payment_reminder.template
A  email/templates/kit/support.template
M  email/utils/festival_ticket.go
A  email/utils/kit_assets.go
```

Backend untracked: none. Index entries are inherited; this review did not stage changes.

### Final preview status

```text
 M catalog/email-catalog.json
 M docs/agent/DECISION_LOG.md
 M docs/agent/HANDOFF.md
?? docs/agent/production-migration/FINAL_PRE_MERGE_EVIDENCE.json
?? docs/agent/production-migration/FINAL_PRE_MERGE_HISTORICAL_FAILURES.json
?? docs/agent/production-migration/FINAL_PRE_MERGE_PARITY.json
?? docs/agent/production-migration/FINAL_PRE_MERGE_REVIEW.md
?? docs/agent/production-migration/FINAL_PRE_MERGE_TEST_RESULTS.json
?? docs/agent/production-migration/FINAL_PRE_MERGE_VISUAL.json
?? docs/agent/production-migration/FINAL_PRE_MERGE_WALLET.json
?? qa-output/final-pre-merge/
```

The JSON evidence and `qa-output/final-pre-merge/` files are local review evidence; they are not backend runtime artifacts.
