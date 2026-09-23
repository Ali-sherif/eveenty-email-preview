# Scope conflict report

**Authoritative source:** `D:\emails\Eveenty-Email-Kit-Phase1\phase-1-email-scope.md`  
**Date checked:** 2026-09-24

## Counts

| Source / claim | Physical | Exclusions | In-scope | Marketing in-scope |
|---|--:|--:|--:|--:|
| Older briefings / catalog page label “48” | 59 | 11 | 48 | 3 (incl. announcement) |
| **Authoritative scope doc (2026-09-23)** | **59** | **12** | **47** | **2** |
| This Task 03 seven-email pass | — | — | uses **47** | uses `festival_marketing_email_target` |

## Conflict resolution

| Briefing claim | Authoritative doc | Action taken |
|---|---|---|
| 48 in-scope | **47** | Used **47**; did not reopen inventory |
| Marketing reference = `organizer_announcement` | **EXCLUDED / REMOVED 2026-09-23** | **Not designed**; not in selector |
| Marketing reference | `festival_marketing_email_target` (or rescounts variant) | Implemented **`festival_marketing_email_target`** |
| Exclusions = 11 | **12** (prior 11 + announcement) | Used **12** |

**Do not infer that exclusion of `organizer_announcement` was accidental.** Owner decision text in the scope register explicitly removes it from Phase 1.

## Seven-template vs Phase 1 status

All seven requested templates are **IN SCOPE**. No stop-conflict on the seven-item list itself.

Stale UI text: Figma page `06 — Catalog — Phase 1 (48)` still says **48** — cosmetic catalog label only; not changed in this pass (await Phase F / owner instruction).
