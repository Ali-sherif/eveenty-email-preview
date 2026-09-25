# RUNBOOK — Eveenty Email Design Kit

## Starting a session
1. Read `AGENTS.md`, then `docs/agent/PROJECT_STATE.md` and `HANDOFF.md`.
2. Identify the task type and load exactly one matching skill from `.agents/skills/`.
3. If the task names a template, run `email-context` for it before anything else.

## Common tasks → skill
| You want to... | Skill |
|---|---|
| Get everything known about one template | `email-context` |
| Design an authorized, undesigned template | `generate-email` |
| Check an existing design against tokens/QA | `review-email` |
| Design a small authorized related group | `email-batch` |
| Confirm production ↔ design mapping | `email-traceability` |
| Audit for injection/escaping/MIME issues | `email-security-review` |
| Write/check email HTML & CSS compatibility | `email-rendering-compatibility` |
| End a session / pass to another agent | `email-handoff` |

## Deterministic scripts (implemented under `.agents/scripts/` — not wired into `package.json`)
Infra-only install keeps application `package.json` unchanged. Invoke via Node:

```
node .agents/scripts/email-cli.mjs context <template_id> [--json]
node .agents/scripts/email-cli.mjs validate-catalog [--json]
node .agents/scripts/email-cli.mjs validate-template <template_id> [--json]
node .agents/scripts/email-cli.mjs qa [template_id | --all] [--json]
node .agents/scripts/email-cli.mjs status [--json]
node .agents/scripts/email-cli.mjs handoff [--json]
```

Command aliases also accept the `email:` prefix (e.g. `email:context`). Each exits non-zero on failure and supports `--json`.

`qa` reports preview/screenshot **artifact evidence only** — this repo has no Playwright/`*.spec` suite; do not treat a PASS as Level A browser QA re-run.

## QA levels
- **Level A (current phase):** HTML structure, required content, responsive layout, viewport overflow, image-blocked rendering, long-copy behavior, applicable RTL/locale, conditional states, Figma-preview parity where accessible. Run via Playwright/existing browser tooling.
- **Level B (future, not covered by Level A passing):** actual backend rendering, template-variable compatibility, escaping/sanitization, MIME structure, plain-text alternative, attachment/CID integrity, link/recipient behavior, SMTP integration, and real Gmail/Outlook/Apple Mail rendering. Don't claim Level B results unless independently verified in a real client or a service like Litmus/Email on Acid.

## Ending a session
Always run `email-handoff` before stopping if any state changed — update `HANDOFF.md`, and `PROJECT_STATE.md`/`DECISION_LOG.md` only if facts actually changed.
