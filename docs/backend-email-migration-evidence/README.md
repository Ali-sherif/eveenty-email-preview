# Backend Email Migration Evidence

Evidence removed from the `rescounts-backend` PR so that PR contains **only runtime / production Email Kit implementation**.

**Source repo:** `D:\last\rescounts-backend`  
**Evidence repo:** `D:\last\eveenty-email-preview`  
**Moved on:** 2026-09-28  
**Policy:** Nothing permanently deleted — material lives here and can be restored to original backend paths.

---

## Directory layout

| Evidence folder | Contents |
|---|---|
| `tests/` | Migration Go tests (original paths under `email/`) |
| `goldens/` | `.eml` snapshot goldens (`email/testdata/…`) |
| `reports/` | Verification reports + migration plan |
| `inventories/` | Archive MANIFEST + DELETE_CANDIDATES |
| `verification/` | Archive README (verification-oriented notes) |

Inside each folder, **original relative paths are preserved** so restore is a path remap:

```text
evidence/<category>/<original-backend-relative-path>
→ rescounts-backend/<original-backend-relative-path>
```

---

## 1. Moved tests

| Original backend path | Evidence path | Reason excluded from backend PR |
|---|---|---|
| `email/kit_p3_audit_test.go` | `tests/email/kit_p3_audit_test.go` | P3 static/link audit — verification only |
| `email/kit_parity_test.go` | `tests/email/kit_parity_test.go` | Kit↔legacy parity — verification only |
| `email/kit_snapshot_harness_test.go` | `tests/email/kit_snapshot_harness_test.go` | `newCapturingKitSMTP` harness |
| `email/kit_snapshot_test.go` | `tests/email/kit_snapshot_test.go` | Kit `.eml` golden snapshots |
| `email/legacy_snapshot_cases_test.go` | `tests/email/legacy_snapshot_cases_test.go` | `allSnapshotCases` table |
| `email/legacy_snapshot_fixtures_test.go` | `tests/email/legacy_snapshot_fixtures_test.go` | Fixed fixtures for snapshots |
| `email/legacy_snapshot_harness_test.go` | `tests/email/legacy_snapshot_harness_test.go` | `newCapturingSMTP` harness |
| `email/legacy_snapshot_normalize_test.go` | `tests/email/legacy_snapshot_normalize_test.go` | Golden normalize helpers |
| `email/legacy_snapshot_p3_cases_test.go` | `tests/email/legacy_snapshot_p3_cases_test.go` | P3 cases appended to `allSnapshotCases` |
| `email/legacy_snapshot_p3_fixtures_test.go` | `tests/email/legacy_snapshot_p3_fixtures_test.go` | P3 fixtures |
| `email/legacy_snapshot_test.go` | `tests/email/legacy_snapshot_test.go` | Legacy `.eml` golden snapshots |
| `email/mime_message_test.go` | `tests/email/mime_message_test.go` | MIME unit tests (migration verification) |
| `email/smtp_kit_test.go` | `tests/email/smtp_kit_test.go` | Kit load / 48+11 inventory / archive path tests |
| `email/utils/kit_assets_test.go` | `tests/email/utils/kit_assets_test.go` | Kit CDN resolver unit tests |
| `model/festival_ics_test.go` | `tests/model/festival_ics_test.go` | ICS RFC5545 regression — verification only |

**Not moved (runtime):** `email/smtp_test_helpers.go` — despite the name, `NewSMTP` delegates to `newTestSMTPClient` in that file. Required at build/runtime.

**Not moved (pre-existing):** `email/smtp_test.go` — skipped integration smoke test; unrelated migration harness.

---

## 2. Moved goldens / testdata

| Original backend path | Evidence path | Count | Consumed by |
|---|---|---|---|
| `email/testdata/legacy_snapshots/` | `goldens/email/testdata/legacy_snapshots/` | 283 `.eml` | `legacy_snapshot_test.go` (`goldensDir`), `kit_parity_test.go` (legacy side) |
| `email/testdata/kit_snapshots/` | `goldens/email/testdata/kit_snapshots/` | 273 `.eml` | `kit_snapshot_test.go` (`kitGoldensDir`) |

`kit_preview/` was **not present** in the backend working tree at move time (already absent / never staged).

---

## 3. Moved docs / reports / inventories

| Original backend path | Evidence path | Reason |
|---|---|---|
| `email/POST_P4_LOCAL_VERIFICATION.md` | `reports/email/POST_P4_LOCAL_VERIFICATION.md` | Local verification report |
| `.cursor/plans/production_email_migration_plan_bd7a1004.plan.md` | `reports/.cursor/plans/production_email_migration_plan_bd7a1004.plan.md` | Migration planning doc |
| `email/templates/archive/MANIFEST.md` | `inventories/email/templates/archive/MANIFEST.md` | Archive inventory note (not runtime) |
| `email/templates/archive/DELETE_CANDIDATES.md` | `inventories/email/templates/archive/DELETE_CANDIDATES.md` | Deletion-approval note |
| `email/templates/archive/README.md` | `verification/email/templates/archive/README.md` | Archive verification notes |

---

## 4. Dependency clusters (moved together)

### Cluster A — Snapshot / parity / P3 audit

Shared symbols:

- `allSnapshotCases` — defined in `legacy_snapshot_cases_test.go`, extended in `legacy_snapshot_p3_cases_test.go`
- `snapshotCase` — cases table type
- `newCapturingSMTP` — `legacy_snapshot_harness_test.go`
- `newCapturingKitSMTP` — `kit_snapshot_harness_test.go` (calls `newCapturingSMTP`)
- Fixtures: `legacy_snapshot_fixtures_test.go`, `legacy_snapshot_p3_fixtures_test.go`
- Normalize: `legacy_snapshot_normalize_test.go`
- Consumers: `legacy_snapshot_test.go`, `kit_snapshot_test.go`, `kit_parity_test.go`, `kit_p3_audit_test.go`, `smtp_kit_test.go` (uses `allSnapshotCases`)

**Entire cluster moved together** so no backend `_test.go` remains that references removed helpers.

### Cluster B — MIME tests

- `mime_message_test.go` — standalone; moved for PR slimness (runtime `mime_message.go` kept).

### Cluster C — Kit assets unit tests

- `utils/kit_assets_test.go` — uses `utils.KitAssetTestCDNBase` (const remains in runtime `kit_assets.go` for restore compatibility).

### Cluster D — ICS regression

- `model/festival_ics_test.go` — standalone; moved. Runtime `model/festival.go` ICS changes stay in backend.

---

## 5. Recorded test commands and results

From `POST_P4_LOCAL_VERIFICATION.md` (2026-09-28), executed **before** this cleanup while tests still lived in the backend:

```text
go test ./email/utils/ -count=1 -timeout 60s
go test ./email/ -count=1 -timeout 300s
go test ./model/ -count=1 -timeout 60s -run "ICS|Ics|Calendar"
```

| Scope | Result |
|---|---|
| `./email/utils/` | **PASS** |
| `./email/` (full package, ~287s) | **PASS** |
| `./model/` ICS-related | **PASS** |
| Ad-hoc 48 Kit parse | **48 OK / 0 FAIL** |

### 48 Kit / 11 Legacy

| Check | Result |
|---|---|
| Kit templates under `email/templates/kit/` | **48/48** |
| Kit partials | **6** |
| EXCLUDED Legacy (no Kit; archive path) | **11** |
| Inventory test `TestInventory_48KitAnd11Excluded` | **PASS** (pre-move) |

### MIME / `.ics` / `.pkpass`

| Check | Result |
|---|---|
| Kit bodies wrapped by `mimeMessage` + attachments | Covered by MIME + parity/snapshot suites — **PASS** (pre-move) |
| `.ics` calendar attachments | **PASS** (parity/snapshots + model ICS tests) |
| `festival_ticket_sale` `.pkpass` Content-IDs | **PASS** (parity/snapshots) |

Level B real-client: **NOT RUN**. Production CDN kit objects: **403 / deferred**.

---

## 6. Restore procedure

Run from a PowerShell session. Adjust roots if repos move.

```powershell
$BE  = 'D:\last\rescounts-backend'
$EV  = 'D:\last\eveenty-email-preview\docs\backend-email-migration-evidence'

# Tests
Copy-Item "$EV\tests\email\*" "$BE\email\" -Force
New-Item -ItemType Directory -Force -Path "$BE\email\utils" | Out-Null
Copy-Item "$EV\tests\email\utils\kit_assets_test.go" "$BE\email\utils\kit_assets_test.go" -Force
Copy-Item "$EV\tests\model\festival_ics_test.go" "$BE\model\festival_ics_test.go" -Force

# Goldens (exact original paths)
New-Item -ItemType Directory -Force -Path "$BE\email\testdata" | Out-Null
Copy-Item "$EV\goldens\email\testdata\legacy_snapshots" "$BE\email\testdata\legacy_snapshots" -Recurse -Force
Copy-Item "$EV\goldens\email\testdata\kit_snapshots"    "$BE\email\testdata\kit_snapshots"    -Recurse -Force

# Docs / reports / archive notes
Copy-Item "$EV\reports\email\POST_P4_LOCAL_VERIFICATION.md" "$BE\email\POST_P4_LOCAL_VERIFICATION.md" -Force
New-Item -ItemType Directory -Force -Path "$BE\.cursor\plans" | Out-Null
Copy-Item "$EV\reports\.cursor\plans\production_email_migration_plan_bd7a1004.plan.md" `
          "$BE\.cursor\plans\production_email_migration_plan_bd7a1004.plan.md" -Force
Copy-Item "$EV\inventories\email\templates\archive\MANIFEST.md" `
          "$BE\email\templates\archive\MANIFEST.md" -Force
Copy-Item "$EV\inventories\email\templates\archive\DELETE_CANDIDATES.md" `
          "$BE\email\templates\archive\DELETE_CANDIDATES.md" -Force
Copy-Item "$EV\verification\email\templates\archive\README.md" `
          "$BE\email\templates\archive\README.md" -Force
```

### Path mapping (summary)

| Evidence → | Backend restore path |
|---|---|
| `tests/email/*.go` | `email/*.go` |
| `tests/email/utils/kit_assets_test.go` | `email/utils/kit_assets_test.go` |
| `tests/model/festival_ics_test.go` | `model/festival_ics_test.go` |
| `goldens/email/testdata/legacy_snapshots/` | `email/testdata/legacy_snapshots/` |
| `goldens/email/testdata/kit_snapshots/` | `email/testdata/kit_snapshots/` |
| `reports/email/POST_P4_LOCAL_VERIFICATION.md` | `email/POST_P4_LOCAL_VERIFICATION.md` |
| `reports/.cursor/plans/….plan.md` | `.cursor/plans/….plan.md` |
| `inventories/email/templates/archive/*.md` | `email/templates/archive/*.md` |
| `verification/email/templates/archive/README.md` | `email/templates/archive/README.md` |

After restore, re-run:

```text
go test ./email/utils/ -count=1 -timeout 60s
go test ./email/ -count=1 -timeout 300s
```

Runtime helper still in backend (do **not** need to restore): `email/smtp_test_helpers.go`.

---

## 7. What stayed in the backend PR (runtime)

- 48 Kit templates + 6 Kit partials under `email/templates/kit/`
- Legacy archive under `email/templates/archive/legacy/` (59 bodies + 12 partials + `welcome_email_ad.png`) — required for 11 EXCLUDED + rollback bodies
- Runtime Go: `kit_envelope.go`, `mime_message.go`, `smtp_kit.go`, `smtp_deliver.go`, `smtp_test_helpers.go` (`NewSMTP`), `utils/kit_assets.go`, Send*/render/model seam edits, `model/festival.go` ICS compatibility
- Pre-existing skipped `email/smtp_test.go`

No runtime path references this evidence directory.
