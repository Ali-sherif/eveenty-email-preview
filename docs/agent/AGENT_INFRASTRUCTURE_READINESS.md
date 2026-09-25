# AGENT_INFRASTRUCTURE_READINESS.md

**Date:** 2026-09-25  
**Workspace:** `D:\last\eveenty-email-preview`  
**Mode:** Audit + minimal instruction alignment only — no email HTML, Figma, backend, Wallet artwork, or 41-template work.

## Verdict
Agent instructions are aligned with final owner decisions for the next phase. Infrastructure is ready to run the **seven-email final technical gate**. It is **not** ready to start the remaining 41 until that gate is recorded **PASS** and the owner authorizes a template or bounded batch.

## Files inspected
- `AGENTS.md`, `CLAUDE.md`
- `.cursor/rules/eveenty-email-kit.mdc`
- `.agents/skills/*` (8 skills) + `email-rendering-compatibility/reference/html-email-rendering-rules.md` (spot-check)
- `docs/agent/{PROJECT_STATE,HANDOFF,DECISION_LOG,RUNBOOK}.md`
- `.agents/scripts/email-cli.mjs` (+ `lib/catalog.mjs` via CLI)
- `catalog/email-catalog.json`, `catalog/EMAIL_TEMPLATE_TRACEABILITY.csv`, `catalog/SEVEN_REFERENCE_MAPPING_REVIEW.md`
- `assets/wallet/official/README.md`
- `qa-output/approved-component-corrections/FINAL_VISUAL_REVIEW.md` (stale gate language)
- Skill adapters: no `.claude/`, no `.cursor/skills/`

## Files updated and why
| File | Why |
|---|---|
| `docs/agent/PROJECT_STATE.md` | HTML-only remaining scope; conditional visual approval; technical gate **NOT PASSED**; Wallet/locale/reuse policy |
| `docs/agent/DECISION_LOG.md` | Append-only final owner decisions entry |
| `docs/agent/HANDOFF.md` | Current task = infra alignment; next = technical gate |
| `docs/agent/RUNBOOK.md` | Phase gates; locales; Wallet; QA not requiring discarded screenshots / default Figma parity |
| `AGENTS.md` | Purpose, Figma default, gate before 41, skill path verification, no historical-QA-as-fresh |
| `CLAUDE.md` | Verified: use `.agents/skills/` directly (no `.claude/skills`) |
| `.cursor/rules/eveenty-email-kit.mdc` | Verified: no `.cursor/skills` adapter |
| `.agents/skills/generate-email/SKILL.md` | Gate prerequisite; HTML-only; no default Figma; per-template locales; official Wallet |
| `.agents/skills/email-batch/SKILL.md` | Gate prerequisite; no auto-41; per-template locales; HTML-only |
| `.agents/skills/review-email/SKILL.md` | No discarded-screenshot regen; no historical-as-fresh gate; optional Figma; Wallet 320px |
| `.agents/skills/email-rendering-compatibility/SKILL.md` | Meaningful muted = Dark-500; Wallet policy; locales not global-five |
| `.agents/skills/email-context/SKILL.md` | Wallet badge locales ≠ template language matrix |
| `catalog/SEVEN_REFERENCE_MAPPING_REVIEW.md` | Status line: conditional approval + gate not passed |
| `qa-output/.../FINAL_VISUAL_REVIEW.md` | Stop regenerating discarded PNGs; point to technical gate |
| `docs/agent/AGENT_INFRASTRUCTURE_READINESS.md` | This report |

## Outdated instructions corrected
- Default Figma workflow / Figma-preview parity as required for remaining work → HTML Preview only unless separately authorized.
- Muted text listed as `#898988` for meaningful copy → Dark-500 `#4D4C49` (decorative Dark-50 retained as non-text).
- Implied five-locale matrix / Wallet five locales as global language proof → per-backend-template locales only.
- Custom/CDN Wallet button guidance lingering in phase narrative → official `assets/wallet/official/` only.
- Owner visual “pending” without technical gate → conditional visual approval + explicit **NOT PASSED** gate.
- Historical Chromium/browser packs treated as current readiness → evidence only; gate must be re-run/recorded.
- Pressure to regenerate discarded screenshot sets → explicitly forbidden as prerequisite.
- Skill discovery “needs verification” for adapters → verified none; use `.agents/skills/`.

## Skills and rules left unchanged (still valid)
- `email-handoff` — workflow still correct
- `email-traceability` — read-only mapping skill still correct
- `email-security-review` — read-only security audit still correct
- `email-rendering-compatibility/reference/html-email-rendering-rules.md` — client rules still valid (project tokens corrected in parent SKILL.md)
- No new skills created

## Validation results
| Command | Result |
|---|---|
| `node .agents/scripts/email-cli.mjs validate-catalog --json` | **PASS** — 59 / 11 / 48 · designed 7 · undesigned 41 · families match · `organizer_announcement` IN_SCOPE UNDESIGNED MARKETING |
| `node .agents/scripts/email-cli.mjs status --json` | **PASS** |
| `node .agents/scripts/email-cli.mjs handoff --json` | **PASS** |
| `node .agents/scripts/email-cli.mjs validate-template festival_ticket_sale --json` | **PASS** — preview present, DESIGNED |
| Skill dirs under `.agents/skills/` | **8** present |
| `.claude/skills` / `.cursor/skills` | **Absent** (use `.agents/skills` directly) |

Seven designed IDs unchanged: `activate_email`, `dispute_notification`, `festival_donation`, `festival_marketing_email_target`, `festival_ticket_registration_approval`, `festival_ticket_sale`, `support`.

## Remaining conflicts / ambiguities (not invented)
1. **Cards/Typography consistency checklist** — owner named the gate but did not define a scored checklist beyond that phrase; gate session must define measurable checks from existing approved components/tokens rather than inventing new DS rules.
2. **Wallet 320px** — prior measured Chromium PASS with condensed Google exists in QA reports; owner still requires resolve-or-accurate-report as part of the *current* gate (do not auto-close from history).
3. **OD-2** (stronger status alert borders) — still optional/owner call; not part of the named final technical gate.
4. **CDN upload of official Wallet assets** — production-blocked separately; not required to *start* HTML previews for the 41 after the gate, but production parity remains blocked until authorized.
5. Older DECISION_LOG entries still narrate Wallet CDN → custom magenta → official badges evolution (append-only history). The **2026-09-25 final owner decisions** entry is the standing policy.

## Readiness: seven-email final technical gate
**Ready to begin** that gate work under `review-email` (and authorized HTML fixes only if the owner opens a gate-fix session). Gate currently **NOT PASSED**.

## Readiness: subsequent 41-email rollout
**Not ready.** Blocked on: (1) technical gate PASS in `PROJECT_STATE.md`, (2) explicit per-template or bounded-batch authorization, (3) continued backend/production/CDN freeze.

## Changes left unstaged
All documentation/skill updates from this session remain uncommitted (no commit/push/deploy performed).
