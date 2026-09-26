# Batch 8 QA report

**Date:** 2026-09-27  
**Harness:** `node qa-output/batch-8/capture-batch8-qa.mjs`  
**Machine-readable evidence:** `batch8-qa-results.json`  
**Overall Level A result:** **PASS**

## Results

| Check | Result |
|---|---|
| Catalog and exact batch mapping | **PASS** — 59 physical / 11 excluded / 48 in scope / 41 designed / 7 undesigned; exact eight IDs |
| Per-template validation | **PASS** — 8/8; source path, family, locale, status and preview metadata |
| Structural rendering | **PASS** — 126 locale/variant renders; 0 render or structural failures |
| Responsive layout | **PASS** — 65 checks at 800, 768, 414, 375 and 320px; 0 document or element overflow failures |
| Long-content stress | **PASS** — 8/8 at 320px |
| Blocked-image behavior | **PASS** — 8/8 at 320px |
| RTL visual/layout | **PASS** — 12 Arabic/Persian desktop/mobile checks; 0 failures |
| Conditional/persona assertions | **PASS** — summary omission, organizer fee omission, rejection note and optional logo paths |
| Financial reconciliation fixtures | **PASS** — 5/5 representative Commerce totals |
| Contrast | **PASS** — heading, body, success, error, warning, CTA and marketing footer pairs all at least 4.5:1 |
| Links and preview paths | **PASS** — no unsafe live preview actions; generated preview files readable |
| Source-template traceability | **PASS** — 8/8 current read-only production template paths |
| Standalone generation | **PASS** — 41 previewable HTML files generated |
| `git diff --check` | **PASS** — no whitespace errors (line-ending warnings only) |
| Gmail | **NOT RUN** |
| Outlook | **NOT RUN** |
| Apple Mail | **NOT RUN** |
| Figma | **NOT RUN / out of scope** |

## Locale and variant coverage

- Five-locale Commerce paths: en, fr, es, ar and fa, restricted by persona where the backend forces admin English.
- Organizer campaign receipts: en only, matching hardcoded production copy.
- Rescounts marketing target: English production chrome with escaped synthetic author content.
- Total structural matrix: **126** valid locale/variant combinations. Unsupported combinations are rejected rather than silently falling back.

## Objective fixes closed during QA

- Corrected source locale-key mappings and per-persona English-only routing.
- Localized the new Commerce footer where the production locale pack provides the strings.
- Preserved LTR isolation for money, identifiers, email addresses and URLs inside RTL layouts.
- Removed a non-source English attachment annotation from localized output.
- Kept the approved Warning and Error borders decorative and unchanged.
- Darkened only the new marketing preview footer background to `#4D4C49`, producing an 8.59:1 white-text contrast ratio without changing approved prior templates.

## Status interpretation

The eight HTML Preview implementations are technically **PASS** and ready for owner visual review. They are not owner-approved or production-ready. The new production trust-boundary note for `festival_rescounts_marketing_email_target`, plus the existing organizer-announcement and marketing-approval blockers, does not fail the inert HTML Preview implementation; it blocks production migration until separately authorized work occurs.

