# ORGANIZER TEAM INVITATION — KIT #49 REPORT

Date: 2026-09-29  
Backend: `D:\last\rescounts-backend`  
Evidence: `D:\last\eveenty-email-preview\docs\backend-email-migration-evidence`

## Verdict

**ORGANIZER TEAM INVITATION — KIT #49 PASS**

## Scope clarification

| Scope | Count |
|---|---:|
| Original approved Kit migration | **48** |
| Current Kit scope after this task | **49** |
| New Kit ID | `organizer_team_invitation` (#49) |
| Still Legacy-only | `festival_end_of_day_report` |

This ID was **not** part of the original 48. It was intentionally added post-review. Historical reports for the original 48 were not rewritten to pretend otherwise.

## 1. Original Legacy source path

`email/templates/organizer_team_invitation.template` (root-level, pre-migration)

## 2. Archived Legacy path

`email/templates/archive/legacy/organizer_team_invitation.template`

SHA-256 of archived body matched the pre-move root body exactly (`F4083909177FF32C592FEC51DFF7D437219C7FC07882117CDE561346E87491B3`). Content preserved; no redesign of archived Legacy.

## 3. Sender method(s)

- `(*smtpClient).SendOrganizerTeamInvitation` — `email/smtp_organizer_emails.go`
- Caller: `(*FestivalAPI).CreateOrganizerTeamInvitations` — `api/v1/festival_organizer.go`

## 4. Baseline current-HEAD behavior

Captured **before** production modifications via in-memory SMTP capture seam (`kitActive=false`).

Artifacts:

- `docs/agent/production-migration/baselines/organizer_team_invitation/existing_user__en.eml`
- `docs/agent/production-migration/baselines/organizer_team_invitation/new_user__en.eml`

Verified byte-equal (after CRLF normalize) to post-archive Legacy goldens.

Key baseline behavior:

| Field | Existing user | New user |
|---|---|---|
| To | Eveenty Organizer / invitee-existing@… | Eveenty User / invitee-new@… |
| From | Eveenty / noreply@… | same |
| Subject | You're invited to join an organizer team | Join an organizer team - create your account first |
| Primary CTA | invite URL with token | `https://www.eveenty.com/register` |
| Secondary link | invite URL with token | invite URL with token |
| Locale | EN / LTR hardcoded | same |
| Attachments | none | none |
| MIME | text/html single part | same |

## 5. Kit template path

`email/templates/kit/organizer_team_invitation.template`

Uses shared Kit partials: `kit_head_styles`, `kit_branded_header`, `kit_primary_button`, `kit_branded_footer`.

## 6. Variable contract

See `docs/agent/production-migration/VARIABLE_CONTRACTS/organizer_team_invitation.md`.

## 7. Template-selection changes

Sender now uses:

- `templateFor("organizer_team_invitation", c.organizerTeamInvitationTemplate)`
- `deliverRendered("organizer_team_invitation", params, …)`

Envelope registered in `kitEnvelopeSpecs` (`fromLiteral: "Eveenty"`, `ToName` / `UserEmail`, default Subject field).

No changes to recipient selection, subject strings, token generation, `userExists` branching, or signup URL.

`BrandLogo` now goes through `applyKitBrandLogo("en", legacyURL)` when Kit is active.

## 8. 48 → 49 inventory / completeness

- `ExpectedInScopeKitTemplateCount` updated **48 → 49** in `email/smtp_kit.go`
- Kit activates only when exactly 49 bodies parse; partial sets fail closed
- Evidence tests updated: inventory expects 49 Kit + 60 archived Legacy; `festival_end_of_day_report` asserted outside Kit set
- Snapshot cases added: `existing_user__en`, `new_user__en`

## 9. Root-level fallback cleanup

`emailClientInitiator.newEmailTemplate` root fallback narrowed to:

```go
fileName == "festival_end_of_day_report"
```

`organizer_team_invitation` no longer has root-path special handling; it loads from archive/legacy like other migrated templates.

## 10. festival_end_of_day_report safety

- Root file still present: `email/templates/festival_end_of_day_report.template`
- Loader smoke test loads it via initiator
- Not present under `email/templates/kit/`
- Not counted toward Kit completeness

## 11. Functional parity results

| Check | Result |
|---|---|
| Baseline vs archived Legacy golden | PASS (exact match both personas) |
| Kit vs Legacy parity (`TestKitLegacyParity`) | PASS (envelope, MIME semantics, invite/signup links) |
| Attachment count | 0 / 0 |
| Unresolved CID | none |
| Malformed/empty URL | none in fixtures |

Intentional design differences only: Kit shell/chrome, logo via CdnURL, multipart/alternative wrapper.

## 12. Snapshot results

| Golden | Result |
|---|---|
| Legacy `existing_user__en` / `new_user__en` | PASS |
| Kit `existing_user__en` / `new_user__en` | PASS |

Paths under `docs/backend-email-migration-evidence/goldens/email/testdata/{legacy,kit}_snapshots/organizer_team_invitation/`.

## 13. Visual review

Rendered Kit HTML at representative widths **600px (desktop)** and **320px (mobile)** via browser.

| Check | Result |
|---|---|
| Eveenty Kit shell (header / yellow CTA / footer) | PASS |
| Horizontal overflow | PASS (`scrollWidth == clientWidth` at 600) |
| Readable content / invitation copy | PASS |
| CTA href intact (invite token / signup) | PASS |
| Secondary invitation link intact | PASS |
| LTR | PASS (EN-only) |
| Footer | PASS |
| Broken placeholder art | none (fixture CDN host `cdn.snapshot.invalid` does not resolve in browser — expected; URL present) |

**Approval history note:** Original 48 had approved Preview HTML. `organizer_team_invitation` has **no** historic approved Preview. Visual reference is the established Eveenty Kit design system. Formal visual-owner approval, if required by process, is separate from functional parity.

## 14. Full test results

| Command | Result |
|---|---|
| `go build ./...` | PASS |
| `go vet ./email/... ./config/...` | PASS |
| `go test ./email/... -count=1` (checkout; migration suite absent) | PASS |
| Overlay focused OTI snapshots/parity + inventory/partial/load | PASS |
| Overlay full `go test ./email/... -count=1 -timeout 600s` | **PASS** — ~300s |

Existing 48 Kit/Legacy snapshots and parity remained PASS. MIME, attachment, ICS, asset, inventory/load, static/link audits, visual-parity allowlist, and partial-activation fail-closed checks included in the preserved package run.

## 15. Git status

No commit / push / deploy performed. Backend and preview working trees contain Kit #49 + evidence/docs changes only (uncommitted).

## 16. Final verdict

**ORGANIZER TEAM INVITATION — KIT #49 PASS**