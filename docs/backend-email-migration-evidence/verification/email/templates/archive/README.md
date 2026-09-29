# Legacy email template archive

**Status:** ARCHIVED LOCALLY — content preserved; not deleted  
**Date:** 2026-09-28 (updated 2026-09-29 for Kit #49/#50)  
**Purpose:** Side-by-side Kit migration is complete for the original **48** IN_SCOPE templates, plus post-review Kit **#49** `organizer_team_invitation` and Kit **#50** `festival_end_of_day_report`. Legacy template bodies and partials were moved here so the active tree is:

| Path | Role |
|---|---|
| `email/templates/kit/` | Active Kit designs (**50** templates + kit partials) |
| `email/templates/archive/legacy/` | Pre-Kit template bodies (**61**) + legacy partials (12) + `welcome_email_ad.png` |

## What was archived

Everything that previously lived under `email/templates/*.template` and `email/templates/partials/` for the original catalog was moved to `email/templates/archive/legacy/` (git renames; content unchanged). Later, `organizer_team_invitation` (Kit #49) and `festival_end_of_day_report` (Kit #50) were archived the same way.

This includes:

- **50 IN_SCOPE** templates that now have Kit counterparts (original 48 + Kit #49 + Kit #50; kept for rollback / legacy snapshot harnesses).
- **11 EXCLUDED** templates that intentionally stay on the Legacy renderer path (`receipt`, `invoice`, `restaurant_approval`, `restaurant_decline`, `marketing`, `marketing2`, `marketing3`, `marketing4`, `marketing_approval_1`, `marketing_sms_approval`, `marketing_notification_approval`).
- **12 legacy partials** still required by the Legacy parse set.
- **`welcome_email_ad.png`** — unused asset; listed in `DELETE_CANDIDATES.md` (not deleted).

See `MANIFEST.md` for the original → archive path map.

## Runtime wiring

- Legacy loader (`emailClientInitiator`) reads from `email/templates/archive/legacy/`.
- No root-level Legacy email body fallback remains (both former out-of-catalog templates are archived).
- Kit loader (`tryLoadKitTemplates`) reads from `email/templates/kit/` only.
- Kit activates only when **exactly 50** Kit bodies parse (`ExpectedInScopeKitTemplateCount`).
- `templateFor(name, legacy)` selects Kit when `kitActive` and the named Kit template parsed; otherwise Legacy.
- EXCLUDED stems have **no** Kit file, so they always resolve to Legacy.
- No files were deleted as part of this archival.

## Deletion policy

Nothing under this archive may be deleted without explicit user approval. Candidates are listed only in:

`email/templates/archive/DELETE_CANDIDATES.md`
