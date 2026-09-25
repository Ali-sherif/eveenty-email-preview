---
name: review-email
description: Review one existing reference design (or a small batch) against production mapping, approved tokens, responsive/RTL behavior, and existing QA. Read-only — reports PASS/FAIL/BLOCKED/NOT RUN, never advances approval status.
---

## Activation criteria
One or more existing reference `template_id`s need a compatibility/parity check.

## Required input
One or more `template_id`s.

## Workflow
1. Check production mapping and required content against `email-context` output for each ID.
2. Check the design against approved tokens (`docs/agent/PROJECT_STATE.md` / `shared/tokens.js`).
3. Inspect relevant responsive views and applicable RTL/locale behavior for **that** template's backend-supported locales only.
4. Compare Figma and Preview only if the owner asked for Figma parity this session **and** both are accessible. Remaining rollout is HTML Preview–scoped — do not require Figma edits or full Figma re-exports.
5. Run relevant browser/structural checks when this session actually needs them; summarize actionable differences — don't just restate a raw log.
6. Only capture new screenshots for templates that actually changed this session, or where a check genuinely needs fresh visual evidence. Do **not** regenerate discarded historical QA screenshot sets as a prerequisite.
7. For Wallet: confirm official badges (not custom CSS / not yellow CDN images) when the template uses Wallet actions. At 320px, resolve or accurately report sizing — do not assume an older Chromium PASS closes the current technical gate.

## Safety boundaries
Read-only. Does not modify designs. Does not claim real Gmail/Outlook/Apple Mail compatibility from Playwright/Chromium screenshots — that's Level B, see `email-rendering-compatibility`. Does not mark owner visual approval or close the seven-email technical gate unless the owner authorized that gate review and evidence is fresh.

## Expected output
Per-template status: `PASS` / `FAIL` / `BLOCKED` / `NOT RUN`, with a short actionable diff summary. Never silently convert `NOT RUN` into `PASS`.

## Validation requirements
Every claimed `PASS` must correspond to a test actually executed this session, or be explicitly labeled as a carried-forward historical result with its original date/source. Historical packs do not satisfy an open final technical gate.

## Stop conditions
Stop and mark `BLOCKED` for any template whose sources or preview build aren't accessible.
