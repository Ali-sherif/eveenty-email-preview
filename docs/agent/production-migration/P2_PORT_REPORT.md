# P2 PORT REPORT — Eveenty Email Kit production migration

**Date:** 2026-09-28  
**Status:** PORTED — DORMANT, AWAITING BACKEND + OWNER VISUAL REVIEW  
**Scope:** Port all 48 kit templates + dormant Send* wiring + tests (no activation, no CDN upload).  
**Backend changes:** uncommitted.

---

## Explicit non-claims (standing)

- Nothing is active. `EMAIL_KIT_ENABLED` default OFF.
- CDN URLs PENDING for Production and Staging.
- Security handoffs (11 ids / four items) unresolved — owned by Backend/Security. Not fixed or cleared.

---

## PROGRESS

| template_id | batch | status | cases | size KB (max) | gaps | raw-HTML fields |
|---|---|---|---|---|---|---|
| activate_email | 1-transactional | DONE | 2 (user en/ar) | 7.35 | OMIT: wallet_badges, tracking_pixel, hidden_preheader (no params/locale data). CTA mapped to ActivateBaseURL+ButtonText (contract said WITHOUT DATA — corrected from Send*). | Partial surfaces only (BrandLogoURL/LogoAlt/LogoWidth/LogoHeight; CTAHref/CTALabel; Footer*). Body fields escaped via `html`. |
| password_reset | 1-transactional | DONE | 2 (user en/ar) | 7.11 | OMIT: wallet_badges, tracking_pixel, hidden_preheader. LEGACY KEPT: Code, Ignore* mailto, FooterSentTo, Copyright. FooterSuffix literal `.` matches legacy. | Same partial surfaces. Body fields escaped via `html`. |
| dispute_notification | 2-localized-notifications | DONE | 2 (admin/organizer en) | 15.39 | OMIT: wallet_badges, tracking_pixel, kit_branded_footer (no FooterLead/Copyright). CTA mapped to ViewPaymentLink+ViewPayment (contract said WITHOUT DATA — corrected from Send*). LEGACY KEPT: AlertColor, dispute details, BestRegards/TeamName. | StatusMessage, NextStepsMessage |
| festival_approval_status_changed | 2-localized-notifications | DONE | 1 (organizer en) | 5.50 | OMIT: wallet_badges, tracking_pixel, approval_actions, kit_branded_footer. LEGACY KEPT: GreetingHTML, BodyHTML, ReviewNote. | GreetingHTML, BodyHTML |
| festival_created | 2-localized-notifications | DONE | 1 (admin en) | 9.92 | OMIT: wallet_badges, organizer_or_festival_logo, tracking_pixel, approval_actions, kit_branded_footer. Header via BrandLogoURL+applyKitBrandLogo (contract said WITHOUT DATA — corrected). LEGACY KEPT: organizer details; EN copy matches legacy. | none (plain escaped) |
| festival_marketing_email_target | 2-localized-notifications | DONE | 1 (target_user en) | 5.88 | NO Eveenty kit logo by design (festival logo). OMIT: kit_branded_header, wallet_badges, tracking_pixel. LEGACY KEPT: FestivalLogo, FestivalImage, UnsubsribeURl, font-awesome link (parity). | BodyText |
| festival_update_request_approved | 2-localized-notifications | DONE | 1 (organizer en) | 6.47 | OMIT: wallet_badges, tracking_pixel, approval_actions, kit_branded_footer. LEGACY KEPT: ReviewNote. | GreetingHTML, BodyFirstHTML, BodySecondHTML |
| festival_update_request_issued | 2-localized-notifications | DONE | 1 (admin en) | 6.69 | OMIT: wallet_badges, tracking_pixel, approval_actions, kit_branded_footer. Header via BrandLogoURL+applyKitBrandLogo. LEGACY KEPT: UpdatedItemDescription; EN copy matches legacy. | none (plain escaped) |
| festival_update_request_rejected | 2-localized-notifications | DONE | 1 (organizer en) | 7.56 | OMIT: wallet_badges, tracking_pixel, approval_actions, kit_branded_footer. LEGACY KEPT: ReviewNote. | GreetingHTML, BodyFirstHTML, BodySecondHTML |
| festival_vendor_sale_rejection | 2-localized-notifications | DONE | 1 (buyer en) | 16.37 | OMIT: wallet_badges, tracking_pixel. LEGACY KEPT: rejection reason/note, items, totals, inline FooterPhone/Address/Email/Website/HST (no kit_branded_footer). | none (plain escaped) |
| needs_response_dispute_reminder | 2-localized-notifications | DONE | 2 (admin/organizer en) | 18.28 | OMIT: wallet_badges, tracking_pixel, kit_branded_footer. CTA mapped to ViewPaymentLink+ViewPayment. LEGACY KEPT: AlertColor, last-reminder banner, dispute details, BestRegards/TeamName. | StatusMessage, ActionRequiredContent, NextStepsMessage |
| organizer_festival_marketing_email_receipt | 2-localized-notifications | DONE | 1 (organizer en) | 10.34 | OMIT: wallet_badges, tracking_pixel, social img srcs (cdn.eveenty.com). LEGACY KEPT: cost table, social hrefs as text links. kit_branded_footer uses legacy “This message was sent to” + Toronto address. | none (plain escaped) |
| organizer_festival_marketing_sms_receipt | 2-localized-notifications | DONE | 1 (organizer en) | 10.35 | OMIT: wallet_badges, tracking_pixel, social img srcs (cdn.eveenty.com). LEGACY KEPT: cost table, social hrefs as text links. kit_branded_footer uses legacy “This message was sent to” + Toronto address. | none (plain escaped) |
| festival_sale_installment_paid | 3-installments-refunds | DONE | 3 (admin/organizer/vendor en) | 14.98 | OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via BrandLogo+applyKitBrandLogo. status_alert uses TopText (legacy HTML). LEGACY KEPT: ShowObserverSections vendor metadata, invoice kv, promo, processing fees, totals. Kit footer chrome EN literals (no FooterLead YAML). | TopText; BrandLogo/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| first_payment_refund | 3-installments-refunds | DONE | 3 (admin/organizer/vendor en) | 10.69 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, primary_cta (CTA lives in BodyHTML). Logo via applyKitBrandLogo. LEGACY KEPT: error alert, booth kv (ID/Name/InitialPayment/Penalty/RefundedCost/Tax/CC fees/TotalRefunded). | BodyHTML; BrandLogo/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| refund_receipt_admin | 3-installments-refunds | DONE | 1 (admin en) | 15.42 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, primary_cta. Logo+status_alert mapped from BrandLogoURL / HeadingRefundedItems+StaffRefundSuccess* (contract said WITHOUT DATA — corrected). LEGACY KEPT: client kv, items, canceled, totals. www.eveenty.com retained for parity. | RefundImageURL src; UserEmail mailto href; BrandLogoURL/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| refund_receipt_organizer | 3-installments-refunds | DONE | 1 (organizer en) | 15.44 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, primary_cta. Logo+status_alert mapped from BrandLogoURL / HeadingRefundedItems+StaffRefundSuccess* (contract said WITHOUT DATA — corrected). LEGACY KEPT: client kv, items, canceled, totals. www.eveenty.com retained for parity. | RefundImageURL src; UserEmail mailto href; BrandLogoURL/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| refund_receipt_user | 3-installments-refunds | DONE | 2 (user en/ar) | 15.75 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, primary_cta. Logo+status_alert mapped from BrandLogoURL / HeadingRefundedItems+BuyerRefundSuccess* (contract said WITHOUT DATA — corrected). LEGACY KEPT: InfoText, client kv, items, canceled, totals. www.eveenty.com retained for parity. RTL via HTMLDir. | RefundImageURL src; UserEmail mailto href; BrandLogoURL/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| second_payment_reminder | 3-installments-refunds | DONE | 3 (admin/organizer/vendor en) | 7.92 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, primary_cta (ProfileURL lives in BodyHTML). Logo via applyKitBrandLogo. LEGACY KEPT: warning alert + BodyHTML. Subject `FestivalName \| Subject`. | BodyHTML; BrandLogo/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| sponsor_first_payment_refund | 3-installments-refunds | DONE | 3 (admin/organizer/sponsor en) | 10.29 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, primary_cta (CTA lives in BodyHTML). Logo via applyKitBrandLogo. LEGACY KEPT: error alert, sponsor kv (no InitialPayment; penalty unprefixed; TableTotalRefundedForItem). | BodyHTML; BrandLogo/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| sponsor_installment_paid | 3-installments-refunds | DONE | 3 (admin/organizer/sponsor en) | 15.04 | OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. status_alert uses TopText. LEGACY KEPT: LabelSponsorName metadata, invoice kv, ItemDetails.UserCreditCardFees, promo, totals. Subject `FestivalName \| Subject`. | TopText; BrandLogo/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| sponsor_installment_second_payment_reminder | 3-installments-refunds | DONE | 3 (admin/organizer/sponsor en) | 6.97 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, primary_cta (ProfileURL lives in BodyHTML). Logo via applyKitBrandLogo. LEGACY KEPT: warning alert + BodyHTML. Subject `FestivalName \| Subject`. | BodyHTML; BrandLogo/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| festival_donation | 4-donation-vendor | DONE | 4 (user en/ar, organizer en, admin en) | 11.87 | OMIT: primary_cta, wallet_badges, tracking_pixel, hidden_preheader. Logo mapped via BrandLogoURL+applyKitBrandLogo (contract said WITHOUT DATA — corrected from Send*). LEGACY KEPT: SendToDonatorUser heading variants, client/invoice/date/time, ShowProcessingFees, UserCreditCardFees, totals. RTL via HTMLDir. Kit footer chrome EN/AR literals (no new YAML); www.eveenty.com retained for parity. FestivalAddress/FestivalPhoneNumber/FestivalLogo unused in legacy body — still unused. | BrandLogoURL/LogoAlt (header); FooterEmail; UserEmail mailto href. Body fields escaped via `html`. |
| festival_vendor_sale | 4-donation-vendor | DONE | 3 (buyer/vendor/received en) | 15.60 | OMIT: primary_cta, wallet_badges, tracking_pixel, hidden_preheader, preview-only “Buyer receipt copy”. Logo mapped via BrandLogoURL. LEGACY KEPT: FestivalName\|BoothName\|BusinessName, QRCodeImageLink, item cards incl. ItemID, ShowProcessingFees, UserCreditCardFees. ClientAddress in params but not in legacy body — omitted. Website link retained for parity. | BrandLogoURL/LogoAlt; QRCodeImageLink src; ClientEmail/FooterEmail mailto hrefs. Body fields escaped via `html`. |
| support | 5-en-only-internal | DONE | 1 (admin en) | 6.88 | NEW branded header (owner decision; visual emails/support.html). status_alert uses Environment (contract said WITHOUT DATA — corrected from Send*). OMIT: wallet_badges, tracking_pixel, hidden_preheader. BrandLogoURL added on supportEmailParams for kit wiring only (legacy template ignores it; no YAML). Hardcoded EN ops chrome from approved HTML. | BrandLogoURL/LogoAlt. Environment/ErrorDetails escaped via `html`. |
| contact_submission | 5-en-only-internal | DONE | 1 (admin en) | 9.50 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, legacy CDN social icons. LEGACY KEPT: Name/Email/Phone/Business/Topic/Message. BrandLogoURL added on contactSubmissionParanms for kit wiring only. Social hrefs kept as text links for parity (instagram/wa.me/x/linkedin). | BrandLogoURL/LogoAlt; UserEmail/ToEmail mailto hrefs; social hrefs. Body fields escaped via `html`. |
| festival_ticket_registration | 6-registration-multipart | DONE | 4 (admin/organizer/buyer_user en, buyer_user ar) | 18.26 | OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via BrandLogoURL+applyKitBrandLogo (contract said WITHOUT DATA — corrected from Send*). OrganizerLogo kept when present (header_4_localized; contract said WITHOUT DATA — corrected). LEGACY KEPT: summary/buyer/tickets/event kv, FestivalMap, TimezoneNote. Social CDN imgs omitted; hrefs as text links. Dir via lo.Ternary IsRTLLanguage. MIME multipart/mixed boundary=boundary-string. | BrandLogoURL/LogoAlt; OrganizerLogo src; BuyerEmail/HolderEmail mailto hrefs; FestivalMap href; FooterEmail (info@eveenty.com). Body fields escaped via `html`. |
| festival_ticket_registration_approval | 6-registration-multipart | DONE | 3 (user/admin/organizer en) | 21.43 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, approval_actions. Logo via applyKitBrandLogo. OrganizerLogo kept. CTA mapped to CompleteRegistrationLink+CompleteOrderButton (user only). GreetingMessageHTML RAW. LEGACY KEPT: persona alerts, summary/buyer/tickets/event kv, dual CTA. Social CDN imgs omitted; hrefs as text. MIME multipart/mixed. | GreetingMessageHTML; BrandLogoURL/LogoAlt; OrganizerLogo src; CompleteRegistrationLink; BuyerEmail/HolderEmail mailto hrefs; FestivalMap href; FooterEmail. Body fields escaped via `html`. |
| festival_ticket_registration_deadline_exceeded | 6-registration-multipart | DONE | 3 (admin/organizer/user en) | 18.72 | OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. OrganizerLogo kept (contract said WITHOUT DATA — corrected). User red vs staff amber alerts from RecipientType. LEGACY KEPT: AlertReviewBody/AlertAdminAction/AlertOrganizerAction, summary/buyer/tickets/event kv. MIME multipart/mixed. | BrandLogoURL/LogoAlt; OrganizerLogo src; BuyerEmail/HolderEmail mailto hrefs; FestivalMap href; FooterEmail. Body fields escaped via `html`. |
| festival_ticket_registration_payment_deadline_exceeded | 6-registration-multipart | DONE | 3 (admin/organizer/user en) | 19.33 | OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. OrganizerLogo kept. User GreetingMessage lives in alert; staff get alert + greeting. LEGACY KEPT: AlertPaymentBody/AlertAdminAction/AlertOrganizerAction, PaymentDeadline, summary/buyer/tickets/event kv. MIME multipart/mixed. | BrandLogoURL/LogoAlt; OrganizerLogo src; BuyerEmail/HolderEmail mailto hrefs; FestivalMap href; FooterEmail. Body fields escaped via `html`. |
| festival_ticket_registration_reject | 6-registration-multipart | DONE | 3 (user/admin/organizer en) | 18.37 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, approval_actions. Logo via applyKitBrandLogo. OrganizerLogo kept (contract said WITHOUT DATA — corrected). LEGACY KEPT: AlertRejectBody, summary/buyer/tickets/event kv. MIME multipart/mixed. | BrandLogoURL/LogoAlt; OrganizerLogo src; BuyerEmail/HolderEmail mailto hrefs; FestivalMap href; FooterEmail. Body fields escaped via `html`. |
| registration_approval_status_changed | 6-registration-multipart | DONE | 2 (user en/ar) | 5.86 | OMIT: wallet_badges, tracking_pixel, approval_actions. Logo via BrandLogo+applyKitBrandLogo. LEGACY KEPT: GreetingHTML, BodyHTML, ReviewNote. Kit footer chrome EN/AR literals (no FooterLead YAML). RTL via HTMLDir (this template is not Dir). | GreetingHTML, BodyHTML; BrandLogo/LogoAlt; FooterEmail. |
| festival_activity_sale | 7-ics-sales | DONE | 3 (admin/user/organizer en) | 14.45 | OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via BrandLogoURL+applyKitBrandLogo. LEGACY KEPT: calendar links; MIME HTML then ICS (`text/calendar; method=REQUEST; name="event.ics"`). FirstParagraph/SecondParagraph RAW. Kit footer chrome EN/AR literals (TargetEmail). | FirstParagraph, SecondParagraph; BrandLogoURL/LogoAlt; FestivalMap href; calendar hrefs; FooterEmail. Body fields escaped via `html`. |
| festival_add_on_sale | 7-ics-sales | DONE | 3 (admin/user/organizer en) | 15.37 | OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. LEGACY KEPT: calendar links; MIME HTML then ICS (`text/calendar; charset="utf-8"; method=REQUEST` + blank line). ShowSummary/ShowProcessingFees. Kit footer chrome EN/AR literals. | BrandLogoURL/LogoAlt; AddOnImageURL/QRCodeImageURL src; UserEmail mailto; FestivalMap href; calendar hrefs; FooterEmail. Body fields escaped via `html`. |
| festival_sales | 7-ics-sales | DONE | 3 (admin/vendor/organizer en) | 18.39 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, paid watermark (cdn.eveenty.com). Logo via applyKitBrandLogo. status_alert from ShowEventButton/Rejection*/IsSalePaid. CheckEvents CTA `https://eveenty.com/all-events?badge=events`. LEGACY KEPT: calendar links; MIME HTML then ICS (`text/calendar; method=REQUEST; name="event.ics"`). ParagraphText RAW. Subject `FestivalName Subject`. | ParagraphText; BrandLogoURL/LogoAlt; RejectionImage src; calendar/ContractLink hrefs; FooterEmail. Body fields escaped via `html`. |
| festival_sponsor_sale | 7-ics-sales | DONE | 3 (admin/sponsor/organizer en) | 17.84 | OMIT: wallet_badges, tracking_pixel, hidden_preheader, paid watermark (cdn.eveenty.com). Logo via applyKitBrandLogo. status_alert from ShowEventButton/Rejection*/IsSalePaid. CheckEvents CTA `https://eveenty.com/all-events?badge=events`. LEGACY KEPT: calendar links; MIME HTML then ICS (`text/calendar; method=REQUEST; name="event.ics"`). ParagraphText RAW. Subject `FestivalName Subject`. Header `From: "{{.From}}"` spacing matches legacy. | ParagraphText; BrandLogoURL/LogoAlt; RejectionImage src; calendar/ContractLink hrefs; FooterEmail. Body fields escaped via `html`. |
| festival_ticket_sale | 8-festival-ticket-sale | DONE | 5 (buyer_user en/ar, guest_user/admin/organizer en) | 15.43 | OMIT: tracking_pixel, hidden_preheader, paid watermark (cdn.eveenty.com). Logo via applyKitBrandLogo. kit_wallet_badges Google Condensed + Apple via fillKitWallet/NewKitAssetResolver (no yellow badges; no hardcoded hosts). Fixtures have no GoogleWalletPassLink/AppleWalletPassFile → badges omitted; MIME is HTML then ICS only. When AppleWalletPassFile present: per-ticket `application/vnd.apple.pkpass` with `cid:ticket-N.pkpass` then ICS; Apple href `cid:ticket-N.pkpass`. LEGACY KEPT: calendar links; MIME tail whitespace/boundaries copied from legacy. | BrandLogoURL/LogoAlt; QRCodeImageLink src; FestivalMap href; GoogleWalletPassLink/cid Apple hrefs; wallet badge srcs; ContractLink; UserEmail mailto; SponsoredImages ImageURL/Link; FooterEmail. Body fields escaped via `html`. |
| organizer_announcement | 9-security-handoff | DONE | 1 (user en) | 5.03 | Security handoff still open (Backend/Security disposition; not activatable; Body trust boundary NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader, kit_branded_footer (legacy has none). Logo via BrandLogoURL+applyKitBrandLogo. LEGACY KEPT: To without display name; Subject in title/h1 unescaped. | Body (RAW HTML); BrandLogoURL/LogoAlt. |
| festival_marketing_approval | 9-security-handoff | DONE | 1 (admin en) | 13.66 | Security handoff still open (Backend/Security disposition; not activatable; BodyText/approve-decline URLs NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader, social img srcs. LEGACY KEPT: DecclineBaseURL spelling, font-awesome cdnjs link (parity), Hi Hany copy, campaign preview chrome. | BodyText; FestivalLogo src; FestivalImage src; ApproveBaseURL; DecclineBaseURL; BrandLogoURL/LogoAlt; FooterEmail. |
| festival_marketing_approval_sms | 9-security-handoff | DONE | 1 (admin en) | 12.51 | Security handoff still open (Backend/Security disposition; not activatable; Message/approve-decline URLs NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader. LEGACY KEPT: DecclineBaseURL spelling, font-awesome cdnjs link (parity), Hi Hany copy. | Message; ApproveBaseURL; DecclineBaseURL; BrandLogoURL/LogoAlt; FooterEmail. |
| festival_rescounts_marketing_email_target | 9-security-handoff | DONE | 1 (target_user en) | 7.52 | Security handoff still open (Backend/Security disposition; not activatable; BodyText/UnsubsribeURl NOT remediated). NO Eveenty kit logo by design (campaign Logo/Image slots; applyKitBrandLogo CDN swap only). OMIT: kit_branded_header, wallet_badges, tracking_pixel, social img srcs. LEGACY KEPT: UnsubsribeURl spelling, font-awesome cdnjs link (parity), social hrefs as text links. | BodyText; Logo src; Image src; UnsubsribeURl href; FooterEmail. |
| marketing_package_sale | 9-security-handoff | DONE | 2 (admin/organizer en) | 13.39 | Security handoff still open (Backend/Security disposition; not activatable). OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. LEGACY KEPT: Subject `UserName \| Subject`; invoice kv + item cards + totals. Kit footer chrome EN/AR literals (no new YAML). | BrandLogoURL/LogoAlt; UserEmail mailto href; FooterEmail. Body fields escaped via `html`. |
| festival_payout | 9-security-handoff | DONE | 2 (admin/organizer en) | 10.21 | Security handoff still open (Backend/Security disposition; not activatable; RedirectLink NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. LEGACY KEPT: period alert, payout kv, “click here” CTA. | RedirectLink href; BrandLogoURL/LogoAlt; FooterEmail. Body fields escaped via `html`. |
| partner_coupons | 9-security-handoff | DONE | 1 (user en) | 14.50 | Security handoff still open (Backend/Security disposition; not activatable; coupon Description/Code/PartnerMap NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader, decorative CDN imgs (background/car/burger/store badges). LEGACY KEPT: coupon cards, PartnerMap, play.google.com `&hl=en&gl=US` (not `&amp;`), apps.apple.com. | Coupons[].Code; Coupons[].Description; Coupons[].ImageEmail src; PartnerMap href; BrandLogoURL/LogoAlt; FooterEmail; store hrefs. |
| partner_coupons_partner | 9-security-handoff | DONE | 1 (partner en) | 13.58 | Security handoff still open (Backend/Security disposition; not activatable; coupon Description/Code/PartnerMap NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader, decorative CDN imgs. LEGACY KEPT: coupon cards, PartnerMap, store hrefs as above. | Coupons[].Code; Coupons[].Description; Coupons[].ImageEmail src; PartnerMap href; BrandLogoURL/LogoAlt; FooterEmail; store hrefs. |
| bad_content_alert | 9-security-handoff | DONE | 1 (admin en) | 9.92 | Security handoff still open (Backend/Security disposition; not activatable; Data/ResponseMessage NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. LEGACY KEPT: Subject `{{.Subject}} \| {{ .FestivalName }} ` (trailing space); Data as pre-wrap block. | ResponseMessage; Data; BrandLogoURL/LogoAlt; UserEmail mailto href; FooterEmail. |
| book_demo_admin | 9-security-handoff | DONE | 1 (admin en) | 13.43 | Security handoff still open (Backend/Security disposition; not activatable; Message/MeetLink/EventCalendarLink NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. LEGACY KEPT: demo URLs exact; MeetLink + calendar hrefs. | Message; MeetLink href; EventCalendarLink href; BrandLogoURL/LogoAlt; Email mailto href; FooterEmail. |
| extra_service_request | 9-security-handoff | DONE | 1 (admin en) | 10.88 | Security handoff still open (Backend/Security disposition; not activatable; SpecialRequest NOT remediated). OMIT: wallet_badges, tracking_pixel, hidden_preheader. Logo via applyKitBrandLogo. LEGACY KEPT: organizer + request kv; SpecialRequest pre-wrap. | Request.SpecialRequest; BrandLogoURL/LogoAlt; OrganizerEmail/Request.Email mailto hrefs; FooterEmail. |

**All 48 DONE. Resume: N/A — P2 port complete (dormant).**

---

## FINAL GATES (2026-09-28)

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
PASS (switch ON + https://kit-cdn.invalid → KIT; 48/48 templateFor)

--- TestApplyKitActivationGuard_Defaults_LegacySelected ---
PASS (defaults OFF/empty → LEGACY; ON+empty CDN → LEGACY; OFF+placeholder CDN → LEGACY)

--- git diff protected (legacy templates/partials, pkg/locales, go.mod/sum) ---
empty

--- rg kit/ ---
no cdn.eveenty.com; no EMAIL_KIT_ENABLED=true; no yellow badge URLs
(cta-yellow CSS class / yellow CTA fillcolor are design tokens, not wallet badges)
```

**Inventory:** 48 kit templates · 48 kit_snapshot dirs · 96 kit_preview HTML files.

**git status (backend):** changes only under `email/` (+ P1 `config/env.go`). No commit.

---

## Batch 1 gate outputs (2026-09-28)

```
--- go build ./... ---
exit=0

--- go vet ./email/... ./config/... ---
exit=0

--- go test ./email/... ---
ok  	zemind.ca/rescounts/email
ok  	zemind.ca/rescounts/email/utils
exit=0

--- git diff protected (legacy templates/partials, pkg/locales, go.mod/sum) ---
empty
```

Parity: `TestKitLegacyParity` PASS for activate_email + password_reset (headers + MIME; fonts.googleapis.com excluded as design chrome).  
Legacy snapshots: `TestLegacyOutputSnapshots` PASS (byte-identical).

---

## Infrastructure added (P2, shared)

| File | Purpose |
|---|---|
| `email/smtp_kit.go` | `templateFor`, `applyKitBrandLogo`, `applyKitWalletChrome` / `fillKitWallet`, `kitDict` / `dict` funcMap |
| `email/templates/kit/partials/kit_head_styles.template` | Shared MSO + responsive CSS (≥2 templates) |
| `email/templates/kit/partials/kit_registration_details.template` | Shared registration details (≥2 registration templates) |
| `email/kit_snapshot_harness_test.go` | Force kitActive + `https://kit-cdn.invalid` for tests |
| `email/kit_snapshot_test.go` | Kit goldens + kit_preview HTML export + Gmail 102KB check |
| `email/kit_parity_test.go` | Header/MIME/attachment/link parity vs legacy goldens |

### Send* wiring pattern (dormant)

```go
BrandLogoURL: c.applyKitBrandLogo(lang, utils.GetLocalizedLogoURL(lang)),
// ...
c.templateFor("<id>", c.<legacyField>).Execute(&buf, params)
```

`kitActive` stays false in real envs (switch OFF / CDN empty). Tests force kit via harness.

---

## Discrepancies vs Phase 0 contracts

1. Several contracts listed branded header / primary_cta as DESIGN SLOT WITHOUT DATA where Send* already supplies logo/CTA fields — ports used Send* evidence (see per-row gaps).
2. Preview hidden preheader / wallet badges omitted when no params data — listed in gaps.
3. Matrix `locales_supported` still UNKNOWN; ports used backend-verified locales (P1 §2).

---

## Review items

### Backend
- Review dormant `templateFor` / `applyKitBrandLogo` / wallet chrome seam + P1 activation/rollback proposal.
- Confirm LogoAlt hardcoded `"Eveenty"` (brand constant; not YAML).
- Security handoffs still open (11 ids) — release gate before activation.
- Supply Production + Staging `EMAIL_KIT_CDN_BASE_URL` (Infra) — both PENDING.

### Owner visual review
Compare `email/testdata/kit_preview/<id>__<persona>__<locale>.html` (96 files) against preview repo `emails/<id>.html` for all 48 templates.
