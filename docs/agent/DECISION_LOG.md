# DECISION_LOG — Eveenty Email Design Kit

Append-only. Each entry: date, decision, who/what authorized it, source.

---

**[Backfilled — dates unknown, carried from task brief, needs owner confirmation of dates]**

- Restored `organizer_announcement` to Phase 1 scope (Marketing / Campaign-Announcement family), in scope but not yet designed.
- Approved baseline: 59 physical templates / 11 excluded / 48 in Phase 1 scope.
- Confirmed the four Design Kit families (Transactional/Commerce/Notification/Marketing) and six backend families (Auth/Financial/Ticket/Workflow/Internal/Campaign) are **separate classification systems** — not to be merged or replaced with a new taxonomy.
- Approved design tokens set (colors, heading weight, logo width, fluid-hybrid 600px max layout) — see `email-rendering-compatibility` skill for current values.
- Owner visual approval is a distinct, required gate — browser QA pass and Figma/preview parity pass do **not** imply owner approval.
- No production backend/template/YAML changes are authorized without separate, explicit scope authorization.

---

**[This session — package generation, pre-local]**

- Built the AI agent infrastructure package only (AGENTS.md, CLAUDE.md, skills, docs/agent scaffold) — no local repo access in that environment. See prior HANDOFF placeholder history.

---

**[2026-09-25 — local install in `eveenty-email-preview`]**

- Installed infra from `D:\last\eveenty-agent-infra.zip` into the preview repo without overwriting existing `docs/*.md` or any application files.
- Independently verified catalog inventory **59 / 11 / 48**, backend families **2/20/8/15/7/7**, Design Kit in-scope **2/26/17/3**, designed **7** / undesigned **41**, and `organizer_announcement` IN_SCOPE · UNDESIGNED · MARKETING.
- Implemented deterministic CLI at `.agents/scripts/email-cli.mjs` only; **did not** modify `package.json`.
- Recorded token text deltas between `email-rendering-compatibility` skill and `shared/tokens.js` (muted / success) as needs owner/Figma confirmation — neither file changed for that reason.
- No email design, production, commit, push, or deploy authorized or performed.
