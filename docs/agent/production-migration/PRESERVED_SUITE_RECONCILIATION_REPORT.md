# PRESERVED SUITE RECONCILIATION REPORT

Date: 2026-09-29. Backend checkout: `D:\last\rescounts-backend` (current working tree / HEAD behavior). Evidence suite: `docs/backend-email-migration-evidence/`.

**Verdict: PRESERVED MIGRATION SUITE — PASS**

No production/runtime behavior was changed to satisfy historical tests. No approved preview HTML, CDN config, redesign, commit, push, or deploy was performed. Reconciliation touched only preserved evidence tests/goldens and temporary Go overlays used to run them against the current backend.

## 1. Initial failure count

| Run | Leaf failures | Notes |
|---|---:|---|
| Initial preserved suite (this session) | **167** | 81 Legacy snapshots + 80 Kit snapshots + 5 parity + 1 model ICS |
| After normalization + ICS expectation fix (before golden refresh) | **130** | Matches prior pre-merge historical leaf set; reminder day-drift cleared |
| After selective golden refresh | **0** | Full preserved email overlay suite PASS |

Prior final-pre-merge report recorded 130 leaf snapshot/parity failures plus a separate model ICS UID failure. This session’s extra 36 initial failures were wall-clock installment reminder indexes (`(168)` → `(169)`) that had continued to drift after the goldens were frozen.

## 2. Failure classification table

Source of truth for classification: current backend HEAD sender/model behavior, confirmed by source inspection and fresh in-memory Send* capture (SMTP replaced by the existing capture seam). Fresh HEAD baseline / Legacy-vs-HEAD / Kit envelope parity from the prior review remain PASS and were not contradicted.

| Group | Count (initial) | Class | Evidence |
|---|---:|---|---|
| Model ICS UID `@rescounts.com` vs `@eveenty.com` | 1 | **B — STALE TEST EXPECTATION** | `model/festival.go` `GenerateICS` emits `UID:%s@eveenty.com`; fresh capture `UID:fest-1@eveenty.com` |
| Organizer `festival_ticket_sale` parity (en/fr/es/fa/xx) | 5 | **A — STALE GOLDEN** (+ **B** on old ICS expectation) | `SendFestivalTicketSaleToOrganizer` does **not** assign `FestivalICSData`; fresh Kit/Legacy captures have 0 calendar attachments |
| Organizer ticket sale Legacy/Kit snapshots | 5 + 5 | **A — STALE GOLDEN** | Same as above; old goldens still carried `event.ics` |
| Legacy/Kit snapshots for `festival_sales`, `festival_activity_sale`, `festival_add_on_sale`, `festival_sponsor_sale`, non-organizer `festival_ticket_sale` | 114 | **A — STALE GOLDEN** | Calendar payload/wrapper drift vs HEAD: UID domain `rescounts`→`eveenty`, PRODID Eveenty, Legacy CTE `7bit`/`method=REQUEST` → base64/`method=PUBLISH`; HTML/envelope otherwise match HEAD |
| `second_payment_reminder` + `sponsor_installment_second_payment_reminder` | 36 | **C — NORMALIZATION ISSUE** | Reminder index from `utils.InstallmentReminderNumber(dueDate)` is days-since-due; fixture due date is fixed so the displayed `(N)` advances daily |
| `bad_content_alert` Legacy snapshot | 1 | **A — STALE GOLDEN** | Pretty-printed JSON inside `<pre>` now uses LF vs older CRLF golden; no business/envelope change |
| Real migration defect (recipients/subject/locale/MIME semantics/attachments/links/business) | 0 | **D — none found** | Fresh HEAD comparisons already PASS; candidate matched HEAD on inspected diffs |
| Needs review / insufficient evidence | 0 | **E — none remaining** | — |

No **D** defects were hidden by golden refresh: only cases already proven to match current HEAD (or pure volatile normalization) were updated.

## 3. Exact stale goldens updated

**125** `.eml` goldens under `docs/backend-email-migration-evidence/goldens/email/testdata/` were regenerated with `-update` against current HEAD capture (after normalization fix):

| Tree | Template | Count |
|---|---|---:|
| `legacy_snapshots/` | `festival_ticket_sale` | 20 |
| `legacy_snapshots/` | `festival_activity_sale` | 12 |
| `legacy_snapshots/` | `festival_add_on_sale` | 12 |
| `legacy_snapshots/` | `festival_sales` | 11 |
| `legacy_snapshots/` | `festival_sponsor_sale` | 7 |
| `legacy_snapshots/` | `bad_content_alert` | 1 |
| `kit_snapshots/` | `festival_ticket_sale` | 20 |
| `kit_snapshots/` | `festival_activity_sale` | 12 |
| `kit_snapshots/` | `festival_add_on_sale` | 12 |
| `kit_snapshots/` | `festival_sales` | 11 |
| `kit_snapshots/` | `festival_sponsor_sale` | 7 |

**Why:** each differed from current HEAD only by historical calendar identity/encoding (and organizer ICS presence / bad_content JSON newlines). Reminder goldens were **not** bulk-refreshed; normalization alone made them stable.

Full path list: session artifact `goldens-updated.txt` under the temporary overlay directory.

## 4. Exact stale tests updated

All under `docs/backend-email-migration-evidence/tests/` (preserved evidence; not restored into the backend PR):

| File | Change |
|---|---|
| `model/festival_ics_test.go` | Expect `UID:fest-1@eveenty.com` (was `@rescounts.com`) |
| `email/legacy_snapshot_normalize_test.go` | Reminder-index normalization; base64 calendar DTSTAMP end-boundary also matches `boundary-string` |
| `email/legacy_snapshot_harness_test.go` | `newTestSMTPClient` → `newSMTPClient` (constructor rename on HEAD) |
| `email/legacy_snapshot_fixtures_test.go` | Remove obsolete `FestivalTicketType.Price` field literals |
| `email/legacy_snapshot_p3_fixtures_test.go` | Same Price removal for zero-amount edge fixture |

Assertions were not weakened: ICS still requires a concrete UID; snapshots still byte-compare after volatile normalization; parity still checks addresses, subject, attachment count/payload.

## 5. Normalization changes

In `legacy_snapshot_normalize_test.go`:

1. **Installment reminder index** — rewrite `(N)` from `SecondPaymentReminderNumberDisplay` to `(NORMALIZED_REMINDER_INDEX)`, excluding phone forms like `1 (855) 552-1522` (digit-space before `(` / space-digit after `)`).
2. **Base64 calendar DTSTAMP** — part terminator regex now matches both kit `BOUNDARY_N` and legacy `boundary-string`, so Legacy base64 ICS stamps normalize like raw ICS.

Not normalized (functional): recipients, subjects, locales, CTA URLs, attachment counts/payloads, Content-IDs, calendar UID/method/PRODID, wallet links, money/business fields.

## 6. Organizer ticket sale ICS conclusion

**Current HEAD does not attach ICS for organizer ticket sale.**

- Source: `SendFestivalTicketSaleToOrganizer` in `email/smtp_organizer_emails.go` builds `festivalTicketSaleTemplateParams` with calendar **links** but **no** `FestivalICSData` assignment (unlike admin/buyer/guest ticket senders).
- Fresh Kit capture: top type `multipart/alternative`, attachment count 0.
- Fresh Legacy capture: no `event.ics` part.
- Old goldens/parity expected 1 calendar attachment / `multipart/mixed` — classified **stale**, updated to match HEAD. No ICS was invented for the test.

## 7. ICS UID conclusion

**Current HEAD emits `@eveenty.com`.**

- Source: `model/festival.go` `GenerateICS`: `UID:%s@eveenty.com`.
- Fresh model test output: `UID:fest-1@eveenty.com`.
- Preserved expectation updated from `@rescounts.com` to `@eveenty.com`. Production/model code was not changed for the test.

## 8. Final full-suite results

Preserved suite executed via temporary Go `-overlay` pointing at adapted evidence tests + evidence golden paths (tests are not present in the backend checkout).

| Suite | Result |
|---|---|
| `TestLegacyOutputSnapshots` | PASS — 283 leaf |
| `TestKitOutputSnapshots` | PASS — 273 leaf |
| `TestKitLegacyParity` | PASS — 273 leaf |
| `TestP3KitStaticClientCompatibilityAudit` | PASS — 273 leaf |
| `TestP3KitLinkAudit` | PASS — 273 leaf |
| MIME / inventory / load / asset / kit SMTP tests in overlay | PASS (package `./email/` exit 0) |
| `TestGenerateICSRFC5545` (`go test ./model/ -run ICS\|Ics\|Calendar\|TestGenerateICS`) | PASS |
| Full overlay `go test ./email/ -count=1` | **PASS** (≈244–318s) |

## 9. Build / vet / go-test results

| Check | Result |
|---|---|
| `go build ./...` (backend, no overlay) | PASS |
| `go vet ./email/... ./config/...` | PASS |
| `go test ./email/... -count=1` (checkout only; migration suite absent) | PASS |
| Overlay `go test ./email/utils/ -count=1` | PASS |
| Overlay model ICS filter | PASS |

Note: unrestricted `go test ./model/` still has a pre-existing unrelated failure in `TestUser_String` (JSON shape drift). It is outside the preserved email migration suite and was not modified.

## 10. Remaining genuine failures

**None in the preserved migration suite.**

Unrelated / out of scope (unchanged): `TestUser_String` in `model/`; Production CDN 403; DEV logo hash identity; Level B; four Backend/Security handoffs; approved-design port omissions from the final pre-merge visual review.

## 11. Git status (relevant)

**Backend (`rescounts-backend`):** no new changes from this reconciliation session. Existing migration working tree / index entries unchanged by golden work. No `*_test.go` added to the backend PR.

**Preview (`eveenty-email-preview`):**

- Modified evidence goldens (125 paths under `docs/backend-email-migration-evidence/goldens/...`)
- Modified evidence tests listed in §4
- This report + `docs/agent/HANDOFF.md`
- Prior final-pre-merge evidence files remain present from the previous session

No commit/push/deploy.

## 12. Final verdict

**PRESERVED MIGRATION SUITE — PASS**

Every historical failure was classified; stale ICS UID / organizer ICS / calendar goldens / reminder normalization were reconciled against current HEAD without masking a real migration defect; the full preserved suite was rerun successfully.
