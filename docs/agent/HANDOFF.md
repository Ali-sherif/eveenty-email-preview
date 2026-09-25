# HANDOFF — Eveenty Email Design Kit

## Current task
Align existing agent skills/rules/docs with **final owner decisions** before remaining-email rollout. Infrastructure audit complete; seven-email **final technical gate** still open. Do **not** start the remaining 41.

## Exact scope of what was done (latest)
- Audited `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.agents/skills/*`, `docs/agent/*`, `.agents/scripts/email-cli.mjs`, `catalog/email-catalog.json`.
- Recorded final owner decisions in `PROJECT_STATE.md` + `DECISION_LOG.md`.
- Minimally updated stale skill/runbook/AGENTS wording (HTML-only remaining scope, locales-from-backend, official Wallet badges, seven-email gate before 41, no historical-QA-as-fresh, no Figma default).
- Wrote `docs/agent/AGENT_INFRASTRUCTURE_READINESS.md`.
- Did **not** edit email HTML, shared rendering code, Figma, backend, Wallet artwork, or historical QA screenshots. Did **not** commit/push/deploy.

## Verification results
| Check | Result |
|---|---|
| Inventory 59/11/48 · designed 7 · undesigned 41 | **PASS** (`email-cli validate-catalog`) |
| Seven references preserved / preview present | **PASS** |
| Remaining 41 still undesigned | **PASS** |
| Skill discovery (`.agents/skills/` × 8) | **PASS** — no `.claude/skills` or `.cursor/skills` adapters; use `.agents/skills` directly |
| Seven-email final technical gate | **NOT PASSED** (Cards/Typography + Wallet 320px still required) |
| 41-email rollout authorization | **Blocked** until gate PASS + explicit owner batch/template auth |

## Known blockers / open owner items
- **Final technical gate** on the seven references (Cards/Typography consistency; Wallet badge sizing at 320px — resolve or accurately report).
- CDN deploy of `assets/wallet/official/**` (including `google/condensed/*`) — separate production auth.
- Optional: backend locale CDN URL wiring — not authorized.
- OD-2: Optional stronger status borders (owner call).
- Level B client QA — not run.

## Next authorized action
1. Execute and record the seven-email final technical gate only.
2. After gate **PASS** is written into `PROJECT_STATE.md`, wait for explicit owner authorization before any of the 41 undesigned templates (single ID or bounded batch).
3. Stop — do not implement new emails in this handoff.

## Resume prompt
"Continue Eveenty Email Kit from docs/agent/HANDOFF.md and AGENT_INFRASTRUCTURE_READINESS.md. Follow AGENTS.md. Next authorized work is the seven-email final technical gate (Cards/Typography + Wallet 320px). Do not start the remaining 41 until that gate is PASS and the owner authorizes a template or batch."
