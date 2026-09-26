# Batch 20 QA report

**Run:** 2026-09-27  
**Command:** `node qa-output/batch-20/capture-batch20-qa.mjs`  
**Overall Level A result:** **PASS**  
**Real-client Level B:** **NOT RUN**

## Fresh results

| QA area | Coverage | Result |
|---|---:|---|
| Catalog inventory and exact batch mapping | 59 / 11 / 48 / 33 / 15; exact 20 IDs | **PASS** |
| Structural rendering | 325 locale/variant renders | **PASS — 0 failed renders / 0 failed checks** |
| Responsive layout | 175 checks at 800, 768, 414, 375, and 320 px | **PASS — 0 overflow** |
| Long-content stress | 20 templates at 320 px | **PASS — 0 failures** |
| Blocked images | 20 templates at 320 px | **PASS — 0 failures** |
| RTL visual/layout | 24 Arabic/Persian desktop/mobile checks | **PASS — 0 failures** |
| Traceability | 20 catalog/CSV/backend-source mappings | **PASS — 0 failures** |
| Financial reconciliation | 8 refund/vendor fixtures | **PASS — 0 failures** |
| Contrast | 8 approved token pairs | **PASS — all ≥ 4.5:1** |
| Default screenshots | 20 desktop + 20 mobile | **PASS — visually inspected** |

The raw evidence is in [`batch20-qa-results.json`](./batch20-qa-results.json). Captures are linked from [`BATCH_20_VISUAL_REVIEW.md`](./BATCH_20_VISUAL_REVIEW.md).

## Structural and security assertions

Each declared render was checked for the 102 KB Gmail ceiling, table layout, 600 px container, localized logo sizing, approved color tokens, unresolved Go placeholders, unsafe elements/layout CSS, base64 images, unsafe destinations, meaningful image alt text, locale/direction attributes, escaped synthetic author content, and SVG image references.

Focused assertions also verify:

- marketing approval/decline URLs are inert `https://example.com/` preview links;
- dispute payment links and tracking pixels appear only in the declared independent variants;
- vendor profile links appear only in the production-equivalent payer branch;
- refund and vendor totals reconcile across standard, fee-omitted, bank-fee, and long-content variants;
- registration approved-with-note states exist for artist, speaker, and volunteer personas;
- admin variants expose English only in preview metadata;
- new batch output contains no SVG-only image references.

## Visual review notes

- The vendor rejection financial layout uses vertical item cards rather than a dense six-column table; desktop and 320 px captures are readable and totals reconcile.
- Refund, registration, dispute, and installment layouts remain within the viewport under long strings and blocked-image conditions.
- Arabic and Persian captures preserve document RTL direction while isolating dates, currency, percentages, identifiers, addresses, and contact values.
- Marketing and refund proof imagery uses synthetic raster fixtures and includes explicit dimensions and alt text.

## Status by environment

| Environment | Status | Meaning |
|---|---|---|
| Chromium structural/responsive Level A | **PASS** | Fresh automated and visual evidence in this report |
| Gmail | **NOT RUN** | No live inbox/client execution |
| Outlook desktop/Word engine | **NOT RUN** | PNG fixture risk was removed, but no live Outlook execution |
| Apple Mail | **NOT RUN** | No live client execution |
| Figma | **NOT RUN / out of scope** | HTML Preview-only authorization |

Known inherited shared-shell risks—dark-mode inversion behavior, shared helper tables without universal inline `border-collapse`, and the shared VML CTA fallback using automatic width—cannot be upgraded to PASS without real-client evidence. They were not changed because the protected 13-template baseline was required to remain byte-identical.

## Production-only blockers

- `organizer_announcement`: HTML Preview QA **PASS**; production security migration **BLOCKED** because the read-only backend review found unclosed subject/header and caller-supplied HTML trust boundaries.
- `festival_marketing_approval` and `festival_marketing_approval_sms`: HTML Preview QA **PASS** with escaped content and inert links; production approval/decline actions remain **BLOCKED** pending an authorized design that avoids state-changing unauthenticated GET links and link-scanner/prefetch risk.

There are no open Level A failures for this batch. Owner visual approval and real-client Level B testing remain separate gates.
