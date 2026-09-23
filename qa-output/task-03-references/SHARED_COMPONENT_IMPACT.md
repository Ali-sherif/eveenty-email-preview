# Task 03 — Shared Component Change / Impact Register

**Date:** 2026-09-24  
**Rule:** Apply Activation-approved foundations carefully. Do not silently change excluded templates. Preserve Activation visuals except necessary shared corrections.

---

## Proposed shared changes (BEFORE broad edits)

| Change | Target | Affected previews today | Isolation strategy | Activation impact |
|---|---|---|---|---|
| Default `brandedHeader` logoWidth **200 → 160** | `shared/email-kit.js` | donation, ticket_sale, reg_approval, support (all call without override) | Prefer **opt-in** `logoWidth: 160` on in-scope references being standardized; keep function default 200 until catalog rollout OR introduce `kitVersion: 'activation'` flag | Activation already passes 160 — **unchanged** |
| Heading weight 600 for main titles | Per-template renderers | Only templates we edit | Do not change donation/reg_approval/support until their turn | Activation already 600 |
| Header `#FEFDF4` | Already in `TOKENS.primary50` | All using brandedHeader | Already applied; no change needed | Unchanged |
| Yellow CTA `#E9D023` / `#4D4C49` | `primaryCtaYellow` | Activation only today | Dispute optional View Payment uses yellow; Marketing may not need primary CTA | Unchanged |
| Hide visible preheader bar from email body | Ticket/donation currently call `visiblePreheaderBar` | donation, ticket_sale, reg_approval, support | Remove from **ticket_sale** (and new refs); leave others until their pass; keep `hiddenPreheader` + preview chrome annotation outside canvas | Activation already correct |
| Commerce modules (ticket card, QR, wallet, calendar, totals, attachment) | Figma shared + preview helpers | ticket_sale | Extend/align to Activation tokens without flattening | N/A |
| Notification status alert / details table | New Figma components + preview helpers | None yet | New components; do not mutate Activation | N/A |
| Marketing campaign body / unsubscribe footer | New components | None yet | Match production fields only; mark no invented legal slots | N/A |
| RTL/LTR + font stacks | tokens + wrapEmailDocument | Per renderer | Apply Activation font roles to new refs; ticket_sale adopt heading/body stacks carefully | Activation unchanged |
| Excluded templates | N/A | **No HTML previews exist for excluded set** | Shared kit changes cannot silently redesign exclusions (they are not in preview). Document if future shared default would affect them. | N/A |

---

## Impact matrix — existing five previews

| Preview | Will receive shared logo 160 in Task 03? | Content rewrite? | Notes |
|---|---|---|---|
| `activate_email` | Already 160 | **No** (preserve) | Regression-check only |
| `festival_ticket_sale` | **Yes** (reference work) | Align to standards; preserve ticket/QR/wallet/totals content | Primary Commerce reference |
| `festival_donation` | **No** (defer) | No | Avoid drive-by |
| `festival_ticket_registration_approval` | **No** (defer) | No | Catalog later |
| `support` | **No** (defer) | No | Not Notification reference |

---

## Figma shared components — planned updates

| Component | Action |
|---|---|
| Localized Header (already 160 post-Activation) | Reuse; verify byte hashes unchanged |
| CTA Primary yellow | Reuse for dispute View Payment when link present |
| Typography Hierarchy SemiBold 600 | Reuse for main headings |
| Totals / Ticket / QR / Wallet / Calendar / Attachment | Verify & refine for Ticket Sale reference |
| Status Alert | Ensure warning/dispute variants match Notification needs |
| Details / KV table | Add or refine Notification details table component |
| Marketing body + unsubscribe footer | **New** Marketing family components |
| Email Shell Fluid Hybrid 600 | Reuse |

**Original Design System file:** not mutated.  
**Owner PNGs / backend / YAML:** not mutated.

---

## Proceed / hold

| Item | Decision |
|---|---|
| Broad default logoWidth change in kit | **HOLD** — apply per-reference opt-in |
| Ticket sale Activation foundations | **PROCEED** |
| New dispute + marketing previews + Figma | **PROCEED** |
| `organizer_announcement` | **BLOCKED by scope** — excluded |
| Phase F catalog (remaining 43) | **HOLD** until owner approves all four references |
