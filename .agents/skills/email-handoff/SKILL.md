---
name: email-handoff
description: Prepare the current task so another agent (Claude Code, Cursor, or Codex) can resume it from repository files alone, without needing this session's chat history.
---

## Activation criteria
End of a work session, or explicit request to hand off / pause.

## Workflow
1. Update `docs/agent/HANDOFF.md` with: current task, exact `template_id`(s), completed changes, remaining work, source files already inspected, tests actually executed and their results, known blockers, unresolved questions, files modified, and the next authorized action.
2. Keep it concise — do not paste large tool logs; summarize and point to where the full log lives if needed.
3. Update `docs/agent/PROJECT_STATE.md` only if scope, counts, or design-status facts actually changed this session.
4. Generate a short resume prompt (2–4 sentences) usable by any of the three agents, e.g.: "Continue Eveenty Email Kit from docs/agent/HANDOFF.md. Follow AGENTS.md, select the appropriate skill, inspect the current working tree, and resume only the authorized task."

## Safety boundaries
Handoff files are documentation only — this skill does not itself perform design, QA, or code changes.

## Expected output
Updated `HANDOFF.md` (and `PROJECT_STATE.md`/`DECISION_LOG.md` if applicable) plus the short resume prompt.

## Stop conditions
None — this should run at the end of essentially every session where state changed.
