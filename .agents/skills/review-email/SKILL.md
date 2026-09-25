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
2. Check the design against approved tokens (`docs/agent/PROJECT_STATE.md`).
3. Inspect relevant responsive views and applicable RTL/locale behavior for that family.
4. Compare Figma and Preview only if both are actually accessible this session.
5. Run relevant existing browser tests (`scripts/email-qa`); inspect failures and summarize actionable differences — don't just restate the raw log.
6. Only capture new screenshots for templates that actually changed, or where a check genuinely needs fresh visual evidence.

## Safety boundaries
Read-only. Does not modify designs. Does not claim real Gmail/Outlook/Apple Mail compatibility from Playwright/Chromium screenshots — that's Level B, see `email-rendering-compatibility`.

## Expected output
Per-template status: `PASS` / `FAIL` / `BLOCKED` / `NOT RUN`, with a short actionable diff summary. Never silently convert `NOT RUN` into `PASS`.

## Validation requirements
Every claimed `PASS` must correspond to a test actually executed this session, or be explicitly labeled as a carried-forward historical result with its original date/source.

## Stop conditions
Stop and mark `BLOCKED` for any template whose sources or preview build aren't accessible.
