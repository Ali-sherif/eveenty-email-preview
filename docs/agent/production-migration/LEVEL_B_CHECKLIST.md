# LEVEL B CHECKLIST — Eveenty Email Kit (Staging real-client QA)

**Date prepared:** 2026-09-28  
**Prepared by:** P3 verification agent  
**Executed by:** QA (human) — **agent must never mark rows passed**  
**Environment:** Staging (if present) · Staging kit CDN base · kit selected automatically when CDN eligible + 48 templates parse (Backend-owned deploy; no `EMAIL_KIT_ENABLED`)  
**Status of all evidence rows:** **NOT RUN**

Do not convert historical HTML Preview Level A into a Level B pass.

---

## Prerequisites (must be true before QA starts)

| # | Prerequisite | Status |
|---|---|---|
| 1 | Staging kit CDN base URL set and Part B asset checks PASS | PENDING |
| 2 | Staging deployed with eligible kit CDN base (kit readiness ON) | Backend-owned — NOT RUN |
| 3 | Allowlisted QA inboxes only | PENDING (`QA_RECIPIENTS`) |
| 4 | Test sends authorized (`SEND_AUTHORIZED=YES`) | NO (this P3 run) |

---

## Clients to cover (minimum)

| Client | Platform |
|---|---|
| Gmail | Web |
| Gmail | iOS |
| Gmail | Android |
| Outlook | Desktop (Word engine) |
| Outlook | Web |
| Outlook | Mobile |
| Apple Mail | macOS |
| Apple Mail | iOS |

---

## Scenario checklist (execution)

For each scenario, test on the clients above as applicable. Record evidence in the table below — leave **result = NOT RUN** until a human tester completes the row.

| ID | Scenario | Notes |
|---|---|---|
| B1 | Branded header / logos | Eveenty kit logos (not legacy transparent CDN logos) |
| B2 | Dark mode | Appearance with client dark mode on |
| B3 | Images blocked | Layout still readable; CTAs usable |
| B4 | RTL Arabic (`ar`) | `dir=rtl`; readable copy |
| B5 | RTL Farsi (`fa`) | `dir=rtl`; Apple Wallet badge uses **en** artwork |
| B6 | Wallet badges (Condensed Google + Apple) | `festival_ticket_sale` buyer |
| B7 | Apple pkpass opens | Attachment / `cid:ticket-N.pkpass` |
| B8 | `.ics` calendar import | Ticket / activity / sales families |
| B9 | Support branded header | New Support design |
| B10 | Registration multipart | HTML + multipart structure |
| B11 | Long-content / many tickets | Edge fixtures (10 tickets / 20 line items) |
| B12 | Unsubscribe / calendar / CTA links | Click targets correct on Staging |

---

## Evidence table

**All rows: NOT RUN.** Do not mark passed in this document from an agent session.

| client | case | result | screenshot path | tester | date |
|---|---|---|---|---|---|
| Gmail web | B1 branded header | NOT RUN | | | |
| Gmail web | B2 dark mode | NOT RUN | | | |
| Gmail web | B3 images blocked | NOT RUN | | | |
| Gmail web | B4 RTL ar | NOT RUN | | | |
| Gmail web | B5 RTL fa | NOT RUN | | | |
| Gmail web | B6 wallet badges | NOT RUN | | | |
| Gmail web | B7 pkpass | NOT RUN | | | |
| Gmail web | B8 ics | NOT RUN | | | |
| Gmail web | B9 support header | NOT RUN | | | |
| Gmail web | B10 registration multipart | NOT RUN | | | |
| Gmail web | B11 long content | NOT RUN | | | |
| Gmail web | B12 links | NOT RUN | | | |
| Gmail iOS | B1–B12 (as applicable) | NOT RUN | | | |
| Gmail Android | B1–B12 (as applicable) | NOT RUN | | | |
| Outlook desktop (Word) | B1–B12 (as applicable) | NOT RUN | | | |
| Outlook web | B1–B12 (as applicable) | NOT RUN | | | |
| Outlook mobile | B1–B12 (as applicable) | NOT RUN | | | |
| Apple Mail macOS | B1–B12 (as applicable) | NOT RUN | | | |
| Apple Mail iOS | B1–B12 (as applicable) | NOT RUN | | | |

---

## Suggested case IDs for sends (when Part C authorized)

Prefer kit renders of:

- `festival_ticket_sale` / `buyer_user_wallet1` / `en` and `fa`
- `festival_ticket_sale` / `buyer_user_edge_10tickets` / `en`
- `support` / `admin` / `en`
- `festival_ticket_registration` / `buyer_user` / `en` and `ar`
- `activate_email` / `user` / `ar`
- `refund_receipt_user` / `user_edge_20items` / `en`

Subject prefix for automated P3 test sends only (when implemented): `[P3 STAGING TEST] ` — parity measured without it.

---

## Explicit non-claims

- No Level B row is passed.
- Security handoffs remain unresolved (Backend/Security).
- Production CDN and activation are out of scope for this checklist.
