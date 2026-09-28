# Legacy email template archive

**Status:** ARCHIVED LOCALLY — content preserved; not deleted  
**Date:** 2026-09-28  
**Purpose:** Side-by-side Kit migration is complete for the 48 IN_SCOPE templates. Legacy template bodies and partials were moved here so the active tree is:

| Path | Role |
|---|---|
| `email/templates/kit/` | Active Kit designs (48 templates + kit partials) |
| `email/templates/archive/legacy/` | Pre-Kit template bodies (59) + legacy partials (12) + `welcome_email_ad.png` |

## What was archived

Everything that previously lived under `email/templates/*.template` and `email/templates/partials/` was moved to `email/templates/archive/legacy/` (git renames; content unchanged).

This includes:

- **48 IN_SCOPE** templates that now have Kit counterparts (kept for rollback / legacy snapshot harnesses).
- **11 EXCLUDED** templates that intentionally stay on the Legacy renderer path (`receipt`, `invoice`, `restaurant_approval`, `restaurant_decline`, `marketing`, `marketing2`, `marketing3`, `marketing4`, `marketing_approval_1`, `marketing_sms_approval`, `marketing_notification_approval`).
- **12 legacy partials** still required by the Legacy parse set.
- **`welcome_email_ad.png`** — unused asset; listed in `DELETE_CANDIDATES.md` (not deleted).

See `MANIFEST.md` for the original → archive path map.

## Runtime wiring

- Legacy loader (`emailClientInitiator`) reads from `email/templates/archive/legacy/`.
- Kit loader (`tryLoadKitTemplates`) reads from `email/templates/kit/` only.
- `templateFor(name, legacy)` selects Kit when `kitActive` and the named Kit template parsed; otherwise Legacy.
- EXCLUDED stems have **no** Kit file, so they always resolve to Legacy.
- No files were deleted as part of this archival.

## Deletion policy

Nothing under this archive may be deleted without explicit user approval. Candidates are listed only in:

`email/templates/archive/DELETE_CANDIDATES.md`

## Environment note

This archival is a **local / code-layout** step authorized for DEV readiness. It does **not** claim Production verification or live-traffic cutover.
