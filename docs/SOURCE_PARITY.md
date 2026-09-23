# Source parity checklists — Phase 1 references

Legend: **P** = in production template · **S** = in sender payload/model · **H** = in HTML preview · **C** = conditional

---

## 1. Auth / Simple — `activate_email.template`

| Field / behavior | P | S | H | Notes |
|------------------|---|---|---|-------|
| From / To / Subject headers | Y | Y | N | Preview is HTML body only |
| `HTMLLang` / `HTMLDir` | Y | Y | Y | EN + AR/FA RTL variants |
| `BrandLogoURL` | Y | Y | Y | Local asset; CDN URL in prod |
| `DisplayName` | Y | Y | Y | |
| `UserEmail` (footer mailto) | Y | Y | Y | |
| `ActivateBaseURL` CTA | Y | Y | Y | example.com preview URL |
| Locales: Welcome, Greeting, Body, Button, Footer, Copyright | Y | Y | Y | EN from yaml; AR/FA preview strings |
| Preheader | N | N | Y | **Hidden** inbox preheader in email HTML; visible “Preheader: …” row removed from canvas (Task 02). Designer metadata = preview annotation outside iframe / Figma annotation outside container. |
| CTA color yellow (`#e9d023`) | N | — | Y | Prod uses magenta `#d80073`; Figma = yellow |
| Header cream band (`#fefdf4`) | N | — | Y | Figma master TRANSACTIONAL |
| Card radius / shadow | Partial | — | Y | |

---

## 2. Financial / Receipt — `festival_donation.template`

| Field / behavior | P | S | H | Notes |
|------------------|---|---|---|-------|
| `SendToDonatorUser` thank-you vs organizer copy | Y | Y | Y | Variants: `donatorUser`, `organizerNotify` |
| `NotTaxReceiptNote` | Y | locale | Y | Hidden on organizerNotify |
| `UserName`, `FestivalName` | Y | Y | Y | |
| Client name / address / phone / email | Y | Y | Y | Figma stacks as single KV column (prod uses dual float columns) |
| `InvoiceID`, `Date`, `Time` | Y | Y | Y | |
| Subtotal `TotalCost` | Y | Y | Y | Labeled Subtotal |
| Tax `TotalTax` | Y | Y | Y | |
| Processing fee (`ShowProcessingFees`) | Y | Y | Y | Always shown in default sample |
| Credit card fees (`UserCreditCardFees`) | Y | Y | N | **Gap** — optional in prod; not in Figma EN frame |
| Grand total `TotalAmount` | Y | Y | Y | |
| `header_2_localized` / `footer_branded_both_dirs` | Y | Y | Y | Visual equivalent masters |
| QR / Wallet | N | N | N | Correctly absent |

---

## 3. Ticket / Pass — `festival_ticket_sale.template`

| Field / behavior | P | S | H | Notes |
|------------------|---|---|---|-------|
| `SendTo` buyerUser / guestUser / staff | Y | Y | Partial | buyerUser + guestUser variants; staff deferred |
| Greeting + festival name | Y | Y | Y | |
| Carry receipt note | Y | locale | Y | |
| Room booking block | Y | Y | N | **Gap** — specialized module not on Figma ticket-sale ref frame |
| Inline donation block | Y | Y | N | Same |
| Add-ons list | Y | Y | N | Same |
| Ticket pass card (event, type, holder, index, id, datetime, venue) | Partial | Y | Y | Figma specialized module |
| QR module | Y | Y | Y | **SAMPLE** fixture only — not live credential |
| Google / Apple Wallet links | Y | Y | Y | example.com — labeled sample |
| Calendar links | Y | Y | Y | Combined text row as Figma |
| Attachment / .pkpass callout | Partial | multipart | Y | Callout only; no real attachment bytes |
| Totals box | Y | Y | Y | |
| `header_4_localized`, contact, footer icons | Y | Y | Partial | Branded footer simplified vs icon footer |
| Multipart MIME / ICS / pkpass files | Y | Y | N | Preview is HTML only (by design) |

---

## 4. Workflow / Status — `festival_ticket_registration_approval.template`

Reference variant: **RecipientType=user**, **ShowCompleteOrderButton=true**

| Field / behavior | P | S | H | Notes |
|------------------|---|---|---|-------|
| Approval alert (user/admin/organizer copy) | Y | Y | Y | User copy in default; staff deferred to QA |
| `GreetingMessage` / `GreetingMessageHTML` + deadline | Y | Y | Y | Sample includes deadline text |
| `SummarySubtitle` | Y | locale | Y | |
| Complete Order CTA (top) | Y | `ShowCompleteOrderButton` | Y | Also `user_noCta` variant |
| Complete Order CTA (bottom) | Y | same | Y | **Verified dual CTAs** |
| Registration Summary: Event, ID, DateTime, Status, PaymentDeadline | Y | Y | Y | |
| Buyer: Name, Email, Phone (optional) | Y | Y | Y | Phone included |
| Registered Tickets + count | Y | `TicketItems` | Y | 2 sample tickets |
| Ticket Type / Holder / Email / Phone | Y | Y | Y | |
| `QuestionAnswers` | Y | Y | Y | On ticket 1 |
| Event Details: Doors, Start, End, Venue, Location | Y | Y | Y | |
| Map link (`FestivalMap`) | Y | Y | Y | example map URL |
| `TimezoneNote` | Y | Y | Y | |
| `footer_ticket_registration` | Y | Y | Y | Social icons as text placeholders |
| QR / Wallet / Totals | N | N | N | Correctly absent (sale email owns those) |

---

## 5. Internal / Operational — `support.template`

| Field / behavior | P | S | H | Notes |
|------------------|---|---|---|-------|
| EN-only | Y | Y | Y | No RTL locales |
| `header_3` | Y | — | Visual | Cream branded header per Figma |
| Heading Internal Server Error | Y | hard-coded | Y | Figma drops ⛔ emoji |
| `Environment` badge | Y | Y | Y | |
| Intro + hint copy | Y | hard-coded | Y | |
| `ErrorDetails` `<pre>` | Y | Y | Y | Monospace block; longDetails variant |
| Trailing large logo in body | Y | CDN | N | **Deviation** — Figma uses header logo only + minimal footer |
| Minimal internal footer | N | N | Y | Figma addition |

---

## Proposed additions (not in current prod templates)

1. Visible + hidden preheader rows (all five Figma frames).
2. TRANSACTIONAL yellow CTA (activate) vs current magenta.
3. Cream `#fefdf4` logo band across masters.
4. Support minimal ops footer; remove secondary large logo if Figma wins.
5. Ticket-sale Attachment Callout module as first-class UI (prod is multipart-only).
