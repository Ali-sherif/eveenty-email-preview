# AGENTS.md — Eveenty Email Design Kit

Canonical, tool-agnostic entry point for any AI coding agent (Claude Code, Cursor, Codex, or other AGENTS.md-compatible tools) working on this project. Keep this file short — detail lives in skills and `docs/agent/`.

> Provenance note: this file was generated outside your local repository (no access to `D:\...` paths, Figma, or your installed agent versions). Before relying on it, verify the paths, skill-discovery mechanism, and family/count facts below against `docs/agent/PROJECT_STATE.md` and the actual catalog files in this repo — mark anything that doesn't match as **needs verification**, don't silently trust it.

## 1. Project purpose
Design Kit for Eveenty's transactional/marketing emails — a Figma + HTML preview system that produces reference designs for production email templates, without modifying the production backend.

## 2. Source-of-truth hierarchy
1. Actual current repository files (always wins on disagreement).
2. `D:\emails\Eveenty-Email-Kit-Phase1\organization\*` — canonical taxonomy/traceability audit.
3. `catalog/email-catalog.json` in the preview repo — mirrored organization data.
4. `docs/agent/PROJECT_STATE.md` and `DECISION_LOG.md` in this repo — approved scope/decisions.
5. Figma (`Eveenty-Email-Design-Kit`, editable / `Eveenty-Design-System-New`, **read-only**) — presentation reference, not functional source of truth.

If the current files disagree with a prior report, investigate before editing and record the discrepancy in `DECISION_LOG.md`.

## 3. Approved scope (verify against PROJECT_STATE.md before trusting)
- 59 physical backend templates · 11 excluded · 48 in Phase 1 scope.
- Six backend families: Auth 2 / Financial 20 / Ticket 8 / Workflow 15 / Internal 7 / Campaign 7.
- Four Design Kit families: Transactional 2 / Commerce 26 / Notification 17 / Marketing 3.
- 7 templates already designed (see PROJECT_STATE.md); 41 in-scope templates undesigned.
- `organizer_announcement` is in scope, **not yet designed**.
- These are two separate classification systems — never merge them.

## 4. Read-only boundaries — never write to these
- Backend source (`rescounts-backend` and equivalent).
- Production email templates / YAML.
- Original Figma Design System (`Eveenty-Design-System-New`).
- Owner logo files.
- The seven existing reference designs — do not redesign, move, rename, or delete.

## 5. What requires explicit owner approval before acting
- Designing or modifying any of the 41 undesigned templates.
- Any production template or backend change.
- Marking a template `OWNER VISUAL APPROVED` or advancing it past what evidence supports.
- Committing, pushing, staging, or deploying anything.
- Installing new dependencies.

## 6. How to work
1. Read this file, then `docs/agent/PROJECT_STATE.md` and the current `docs/agent/HANDOFF.md`.
2. Pick the one skill in `.agents/skills/` (or `.claude/skills/` / `.cursor/skills/` adapter) matching the task. Don't load skills you're not using.
3. For a specific template, use the `email-context` skill to pull only that template's catalog entry and sources — never load all 59 records.
4. Run the relevant `node .agents/scripts/email-cli.mjs …` command for deterministic checks instead of re-deriving counts by hand (not wired into `package.json`).
5. Record progress in `docs/agent/HANDOFF.md` before ending a session, especially anything another agent needs to resume.
6. If a step needs access or approval you don't have, stop and report it — don't guess or silently expand scope.

## 7. Reporting uncertainty
Distinguish clearly between: verified (you read the actual file), reported (a prior document says so, not independently re-checked this session), and unknown/blocked (inaccessible). Never upgrade "reported" to "verified" without doing the check.

## 8. Skills available
See `.agents/skills/` — `email-context`, `generate-email`, `review-email`, `email-batch`, `email-traceability`, `email-security-review`, `email-handoff`, `email-rendering-compatibility`. Each SKILL.md states its own activation criteria, inputs, workflow, and stop conditions.
