# Scope reconciliation — Task 03 final review

**Review date:** 2026-09-24  
**Investigator stance:** Independent QA — document edits and prior agent reports are **not** treated as owner authorization.

---

## Counts in dispute

| Claim | Physical templates | Exclusions | In-scope | Marketing in-scope (campaign family) |
|---|---:|---:|---:|---|
| **Original Task 01 baseline** (`email-kit-v1-spec.md`, `email-qa-checklist.md`, `shared-foundations.json` tokenProvenance) | 59 | **11** | **48** | **3** (incl. `organizer_announcement`) |
| **Current `phase-1-email-scope.md`** (header table, 2026-09-23 edits) | 59 | **12** | **47** | **2** (`festival_marketing_email_target`, `festival_rescounts_marketing_email_target`) |
| **This seven-email task** | — | — | all **7 authorized templates IN SCOPE** under either count | uses `festival_marketing_email_target` only |

---

## What changed for `organizer_announcement`

| Evidence | Finding |
|---|---|
| `D:\emails\Eveenty-Email-Kit-Phase1\email-kit-v1-spec.md` §18 | Marketing reference gate still lists **`organizer_announcement.template` as in-scope** (48-template program). |
| `email-qa-checklist.md` | Still references **48 in-scope** and **11 excluded**; marketing gate still names `organizer_announcement`. |
| `shared-foundations.json` | Still documents **“11-template Phase 1 exclusion”** (no twelfth template). |
| `phase-1-email-scope.md` | Adds exclusion **#12** `organizer_announcement.template` with label **“REMOVED 2026-09-23”** and inventory **59 / 12 / 47**. |
| Same file § “In-scope templates **(48)**” | Section title **still says 48** while table rows and arithmetic say **47** — internal doc inconsistency. |
| Agent transcripts searched (`agent-transcripts/*.jsonl`) | **No user message** explicitly authorizing a twelfth exclusion; only task briefs and agents citing `phase-1-email-scope.md`. |
| `qa-output/task-03-seven-email-review/SCOPE_CONFLICT_REPORT.md` | Asserts owner decision in scope register — **circular** (doc → report → doc). |

### When / why (best available reconstruction)

1. **Before 2026-09-23:** Task 01 artifacts consistently used **59 / 11 / 48** with `organizer_announcement` as the Marketing reference template.
2. **2026-09-23 (document timestamp):** `phase-1-email-scope.md` was rewritten to exclude `organizer_announcement`, citing Phase 1 boundary *“no new payload/unsubscribe/legal fields”* and pointing Marketing reference work at `festival_marketing_email_target` / `festival_rescounts_marketing_email_target` instead.
3. **2026-09-24:** Account Activation owner decisions closed in the same scope file **without changing** the 12/47 counts.

**Independent conclusion:** The twelfth exclusion is **documented and operational in the scope register**, but **independent owner authorization was not found** outside that register and derivative QA reports.

---

## Status label

### **`SCOPE DECISION PENDING`**

Pending owner confirmation of one of:

| Option | Effect |
|---|---|
| **A — Confirm exclusion** | Keep **59 / 12 / 47**; align stale Task 01 docs (`email-kit-v1-spec.md`, checklist, shared-foundations, Figma catalog “48” label) in a **future doc-sync task** (not done here). |
| **B — Revert exclusion** | Restore **59 / 11 / 48**; `organizer_announcement` returns to in-scope Marketing reference; **does not** require redesign of the seven emails already delivered. |

**Actions intentionally not taken (per task safety):**

- Did **not** edit `phase-1-email-scope.md`.
- Did **not** change inclusion flags in inventory tables.
- Did **not** start Phase F catalog rollout.

---

## Impact on the seven authorized emails

| Template | In-scope under 48? | In-scope under 47? |
|---|---|---|
| All seven in this task | Yes | Yes |

No stop-conflict on the seven-item list. Phase F remains **HOLD** until scope decision + owner visual approval of these seven references.

---

## Authoritative sources consulted

- `D:\emails\Eveenty-Email-Kit-Phase1\phase-1-email-scope.md` (current register — not modified)
- `D:\emails\Eveenty-Email-Kit-Phase1\email-kit-v1-spec.md` (still 48 / announcement reference)
- `D:\emails\Eveenty-Email-Kit-Phase1\email-qa-checklist.md`
- `D:\emails\Eveenty-Email-Kit-Phase1\shared-foundations.json`
- `qa-output/task-03-seven-email-review/SCOPE_CONFLICT_REPORT.md` (prior pass — superseded by this reconciliation)
- Backend filesystem: **59** top-level `email/templates/*.template` (excluding partials) — unchanged

---

## Owner decision recorded (2026-09-24)

**Status label:** **`SCOPE DECISION CLOSED — OPTION B`**

The owner has **explicitly approved restoring** `organizer_announcement.template` to Phase 1. This section records that decision only; the evidence tables above are left as they stood at investigation time.

| Item | Resolution |
|---|---|
| Authoritative baseline | **59** physical / **11** excluded / **48** in-scope |
| Marketing in-scope | **3** — `festival_marketing_email_target`, `festival_rescounts_marketing_email_target`, `organizer_announcement` |
| Chosen option | **B — Revert exclusion** (see pending-options table above) |
| Seven completed references | Unchanged and still in-scope; no redesign required |
| Remaining undesigned in-scope | **41** (48 − 7) |
| `organizer_announcement` design | In-scope; **not started** in this document-correction pass |
| Phase F | **NOT STARTED** |

Subsequent register correction lives in `D:\emails\Eveenty-Email-Kit-Phase1\phase-1-email-scope.md`. Historical Task 03 reports that cited **59 / 12 / 47** remain evidence of the pre-decision state and are not rewritten here.
