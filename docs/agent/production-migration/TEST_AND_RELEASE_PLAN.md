# TEST AND RELEASE PLAN — Phase 0

**Date:** 2026-09-27  
**All test statuses in this document:** **NOT RUN** (unless explicitly labeled historical design evidence).

Do not convert historical HTML Preview Level A into a migration gate pass.

---

## 1. Level A — HTML Preview / structural (design evidence)

**Purpose:** Design-kit structure, responsive layout, locale/RTL where applicable, conditional variants.  
**Historical:** Completed during Phase 1 HTML Preview for all 48 — owner visually approved.  
**Migration re-run:** **NOT RUN** (optional Backend/QA regression against kit Go output later; not claimed here).

---

## 2. Integration tests (Backend-owned)

**Status:** **NOT RUN**

### 2a. Legacy output snapshots

Capture current legacy `Send*` outputs (headers, subjects, recipients, HTML, MIME parts, attachments) as regression baselines **before** activation.

### 2b. Parity checks (kit vs legacy behavior contract)

For each of the 48 templates / each live Send* persona:

| Check | Status |
|---|---|
| Recipients match | NOT RUN |
| Subjects match (or deliberately versioned with owner approval) | NOT RUN |
| Locale routing matches (`GetValidProfileLanguage`, admin `en`, registration `Dir`) | NOT RUN |
| MIME structure matches (including multipart wrappers with html-only registration) | NOT RUN |
| Attachments present/absent correctly (ics / pkpass / none) | NOT RUN |
| `cid:ticket-N.pkpass` links resolve to parts (`festival_ticket_sale`) | NOT RUN |
| CTA / Wallet / calendar / unsubscribe links shape parity | NOT RUN |
| No Staging↔Production CDN cross-wire | NOT RUN |

---

## 3. Level B — real clients on Staging

**Status:** **NOT RUN**

Environments: Staging only, Staging kit CDN base.  
Clients: Gmail, Outlook, Apple Mail (minimum).  
Cover: branded header/logos, RTL samples, `festival_ticket_sale` Wallet Condensed + Apple + pkpass/ics, Support branded header, representative multipart and html-only registration.

---

## 4. Release gates (all required before live P4 cutover)

| # | Gate | Owner | Status |
|---|---|---|---|
| 1 | All 48 kit templates ported + integration parity pass | Backend | LOCAL PASS (P3) — not production-activated |
| 2 | CDN verified on hosts in use (14 assets: HTTPS 200, image/png, SHA-256 vs manifest) | Infra + Backend | NOT RUN — URLs PENDING (Staging optional if env absent) |
| 3 | Level B real-client pass | QA | NOT RUN |
| 4 | Backend/Security disposition recorded for **all four** handoffs (11 ids) | Backend/Security | NOT RUN / unresolved |
| 5 | Backend confirms rollback capability in place | Backend | Mechanism implemented (switch OFF); formal confirmation NOT RUN |
| 6 | Owner authorizes activation (all 48 together) | Owner | **AUTHORIZED for mechanism/prep (2026-09-28)** — live cutover still blocked on CDN + gates 2–5 |

Activation implementation prep: see `P4_ACTIVATION_PREP_REPORT.md` and `P4_CDN_CONFIGURATION_CHECKLIST.md`.

---

## 5. Post-activation

1. Production verification (recipients, subjects, MIME, assets, sample real sends as Backend/QA define) — **NOT RUN**.
2. Owner archive approval (separate) while rollback remains available — **no waiting period**.
3. Archive mechanics — Backend team to define; execute only after owner archive approval.

---

## 6. Explicit non-claims

- No template is `PRODUCTION_READY` or `PRODUCTION_REPLACED`.
- Security handoffs are not confirmed, fixed, harmless, or cleared.
- Kit asset URLs remain PENDING for both environments.
