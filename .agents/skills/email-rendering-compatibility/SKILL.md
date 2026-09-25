---
name: email-rendering-compatibility
description: Cross-client HTML/CSS email compatibility rules (Outlook Word engine, Gmail incl. 102KB clipping, Yahoo, Apple Mail dark mode) plus the project's approved design tokens. Load whenever writing, converting, or reviewing email HTML/CSS for this project.
---

## Activation criteria
Any task that writes, edits, or reviews email HTML/CSS in this project — used by `generate-email`, `email-batch`, and `review-email`, and on its own when someone just asks "will this render correctly."

## Required input
None to load the rules. For a specific check: the HTML/CSS in question, or a `template_id` (combine with `email-context` to know its Design Kit family).

## Reference
Full rule set: [`reference/html-email-rendering-rules.md`](./reference/html-email-rendering-rules.md) — covers the Outlook Word-engine layout/VML/dark-mode quirks, Gmail CSS stripping and the 102 KB clipping limit, Yahoo Mail link-styling quirks, Apple Mail's three-tier dark-mode model, the universal "stripped everywhere" feature table, sizing budgets, and a pre-send checklist. Load this file's full content only when actually authoring or auditing markup — don't pull it into context for unrelated tasks.

## Project-specific tokens (verify current values against `docs/agent/PROJECT_STATE.md` — these were supplied by the owner and may have changed since)
- Primary action background `#E9D023` / text `#4D4C49`
- Canonical branded header background `#FEFDF4`
- Strong neutral text `#2B2A28` · standard body text `#4D4C49` · muted text `#898988`
- Border `#EBEBEB`
- Success text `#166534` / success background `#F0FDF4`
- Primary heading weight 600/SemiBold
- Localized logo nominal width 160px — maintain original proportions, don't re-derive
- Fluid-hybrid layout, max width 600px (see reference doc §2.1 for the MSO ghost-table pattern that makes this actually fluid in classic Outlook)
- RTL support required for Arabic and Persian; LTR must be preserved within RTL layouts for email addresses, links, and technical identifiers
- No added visible preheader row — preserve existing hidden-preheader behavior only
- Preserve family-specific structure (tickets: QR/wallet/calendar; financial: amounts/totals/receipt info; workflow: status + conditional actions; support: operational content; marketing: flexible content + unsubscribe) rather than forcing one shared visual structure

## Workflow
1. For new/edited markup: build against the reference doc's base skeleton (§1) and universal constraints (§6) first — table layout, inlined critical CSS, MSO conditional wrappers for VML backgrounds/rounded buttons.
2. Apply the project tokens above rather than inventing new colors/weights.
3. Before calling markup done, run the reference doc's §8 pre-send checklist, including the 102 KB size check (Gmail clipping) and the dark-mode meta tags/media query block (Apple Mail + Outlook.com `[data-ogsc]`/`[data-ogsb]`).
4. Distinguish what you actually validated (structural HTML checks, Playwright/Chromium screenshots — Level A) from what you did not (real Gmail/Outlook/Apple Mail client rendering — Level B). Never claim Level B was tested unless it genuinely was, in a real client or a verified service like Litmus/Email on Acid.

## Safety boundaries
Read/advisory only — this skill doesn't itself authorize designing an undesigned template; that's `generate-email`.

## Expected output
Either compliant HTML/CSS, or a findings list keyed to the specific reference-doc rule violated (e.g. "§2.3 — background-image on `<td>` has no VML fallback for classic Outlook").

## Validation
Checklist in reference doc §8, fully checked off, before marking a template's markup ready for `review-email`.

## Stop conditions
If a requirement conflicts with a hard client constraint (e.g. owner wants a CSS `box-shadow` that Outlook's Word engine will drop with no workaround), report the tradeoff rather than silently picking one.
