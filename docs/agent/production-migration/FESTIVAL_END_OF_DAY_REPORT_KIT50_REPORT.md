# FESTIVAL END OF DAY REPORT — KIT #50 REPORT

Date: 2026-09-29  
Backend: `D:\last\rescounts-backend`  
Evidence: `D:\last\eveenty-email-preview\docs\backend-email-migration-evidence`

## Verdict

**FESTIVAL END OF DAY REPORT — KIT #50 PASS**  
**DESIGN SYSTEM REVIEW — PASS**  
**FESTIVAL END OF DAY REPORT DATA MAPPING — PASS**  
**FESTIVAL END OF DAY REPORT CURRENCY CLEANUP — PASS**  
**FESTIVAL END OF DAY REPORT PRESENTATION CLEANUP — PASS**
**DEVELOP → EMAIL KIT MERGE CONFLICT RESOLUTION — PASS**

All Legacy report metrics and conditions are preserved 1:1 in the Kit card layout; only presentation changed. The duplicated Legacy currency presentation was intentionally removed from Kit #50. Currency data and all report metrics remain unchanged. A later Kit-only presentation cleanup removed redundant same-day ISO dates, festival From/To metadata, and internal sale-type keys from organizer-facing Kit/Preview copy. Develop `AvailableItems` is present in archived Legacy and Kit #50 cards.

## Scope clarification

| Scope | Count |
|---|---:|
| Original approved Kit migration | **48** |
| Post-review Kit #49 | `organizer_team_invitation` |
| Post-review Kit #50 (this task) | `festival_end_of_day_report` |
| Current Kit scope after this task | **50** |

This ID was **not** part of the original 48. Historical reports for the original 48 were not rewritten.

---

## 1. Current merged HEAD baseline

Captured **before** production modifications via in-memory SMTP capture seam (`kitActive=false`).

Artifacts:

- `docs/agent/production-migration/baselines/festival_end_of_day_report/multi_festival__en.eml`
- `docs/agent/production-migration/baselines/festival_end_of_day_report/single_festival__en.eml`
- `docs/agent/production-migration/baselines/festival_end_of_day_report/no_sales__en.eml`

Pre-migration Legacy SHA-256: `4C78B09D67DC5E6117B4E62003AC46FD072C814EB13B43380E9745DF7AB92D48`

Baseline vs archived Legacy golden: match after volatile normalize (ISO dates → `NORMALIZED_DATE` in goldens only).

Key baseline behavior:

| Field | Value |
|---|---|
| To | Bob Organizer / organizer@snapshot.invalid |
| From | Eveenty / noreply@… |
| Subject | `📊 End of Day Sales Report \| {FestivalName\|All Festivals} \| Organizer Email` |
| Locale | EN / LTR hardcoded |
| Attachments | none |
| MIME (Legacy) | text/html single part |

## 2. Sender / scheduler source

- `(*smtpClient).SendOrganizerEndOfDayReportToOrganizer` — `email/smtp_organizer_emails.go`
- Cron: `(*FestivalEndOfDayReportSender).processOrganizer` — `cron/send_festival_end_of_day_reports.go`
- API resend: `(*FestivalAPI).ResendOrganizerEndOfDayReport` — `api/v1/festival_organizer.go`

Scheduling, recipient selection, report calculations, and subject construction were **not** changed.

## 3. Original Legacy path

`email/templates/festival_end_of_day_report.template` (root-level, pre-migration)

## 4. Archived Legacy path

`email/templates/archive/legacy/festival_end_of_day_report.template`

SHA-256 matched the pre-move root body exactly. Content preserved; no redesign of archived Legacy.

## 5. New Kit path

`email/templates/kit/festival_end_of_day_report.template`

Uses shared Kit partials: `kit_head_styles`, `kit_branded_header`, `kit_branded_footer`.

Report metrics rendered as Kit label/value detail cards (same pattern as reconciled receipt/admin detail emails) so all columns remain visible inside the 600px Kit card.

## 6. Variable contract summary

See `docs/agent/production-migration/VARIABLE_CONTRACTS/festival_end_of_day_report.md`.

## 7. Design-system references used

| Reference | Why |
|---|---|
| Shared Kit partials | Header / footer / responsive CSS |
| `organizer_festival_marketing_email_receipt` | Label/value detail card rows |
| `bad_content_alert` / `extra_service_request` | Detail card chrome |
| `dispute_notification` | Magenta left-border help callout |
| `organizer_team_invitation` | Kit #49 shell / body tokens |
| Final-seven reconciled ports | Palette, spacing, footer |

No historic approved Preview exists for this ID.

## 8. Visual difference classification

| # | Difference | Classification | Action |
|---|---|---|---|
| 1 | Wide min-width sales table overflowed / clipped inside 600px Kit card | **A — DESIGN SYSTEM DEFECT** | Fixed during port: stacked Kit detail cards preserve all metrics |
| 2 | Legacy dark `#292929` / yellow `#E8CF21` bands | **A** (would be defect if kept) | Replaced with Kit `#fefdf4` / `#fffbeb` / `#e6d1b9` / `#2b2a28` / `#4d4c49` |
| 3 | Legacy help link `#856404` + bottom logo + “Best regards” sign-off | **A** | Replaced with Kit magenta mailto + `kit_branded_footer` |
| 4 | Presentation: table → detail cards | **B — FUNCTIONAL NECESSITY** (fit Kit card without clipping data) | Keep |
| 5 | EN-only LTR content with RTL shell conditionals | **B / C** | Keep |
| 6 | Kit MIME multipart/alternative vs Legacy single HTML | **C** (established Kit difference) | Keep |

## 9. Exact visual fixes

During the Kit port (before goldens finalized):

- Removed non-Kit Legacy chrome (dark headers, yellow bands, bottom logo, obsolete help colors).
- Replaced wide horizontal table with Kit detail-row cards so **Items / Transactions / Total / Sold To Date / % Sold / Subtotal / Day Total** remain fully visible at 600px and 320px with **no page overflow**.

No further visual fix was required after that Category A correction.

## 9b. Legacy Table → Kit Card Data Mapping

**Result: PASS.** Automated check: `TestFestivalEOD_LegacyTableToKitCardDataMapping` (evidence overlay). Kit HTML changes were **not** required by this audit — mapping already complete.

### Before / after layout

| Legacy | Kit |
|---|---|
| Wide HTML `<table min-width:680px>` with 7 columns | One Kit detail card per sale type (label/value rows) |
| Day Total as table footer row with empty cells for Total / Sold To Date / % Sold | Day Total as Kit amber summary card with Items / Transactions / Subtotal only (same non-empty values) |
| Festival dark/yellow chrome | Kit `#fefdf4` festival header band |
| Bottom logo + “Best regards” | `kit_branded_footer` (chrome only; not report metrics) |

Legacy wide table was **not** restored.

### Multi-festival path (production sender — always uses `.Festivals`)

| Legacy label / content | Source | Condition | Kit label / content | Shown | Result |
|---|---|---|---|---|---|
| Greeting `ToName` | `params.ToName` | always | same | always | PASS |
| Intro report date | `params.ReportDate` | `.Festivals` | same | same | PASS |
| Festival name | `$festival.FestivalName` | per festival | same | same | PASS |
| TimeZone | `$festival.TimeZone` | per festival | same | same | PASS |
| Currency | `$festival.CurrencyLabel` | per festival | single display (`America/Toronto • CAD`); parentheses form removed in intentional cleanup | same value | PASS |
| From – To | `$festival.From` / `.To` | per festival | same | same | PASS |
| Day Date | `$day.Date` | per day | same | same | PASS |
| RawDate | `$day.RawDate` | `$day.HasSales` | same | same | PASS |
| Sale Type (display) | `$saleType.SaleType` | per sale type in sales day | card title | same | PASS |
| Sale Type key | `$saleType.SaleTypeKey` | per sale type | subtitle under title | same | PASS |
| Items | `$saleType.ItemsCount` | per sale type | Items | same | PASS |
| Transactions | `$saleType.TransactionsCount` | per sale type | Transactions | same | PASS |
| Total | `$saleType.TotalItems` | per sale type | Total | same | PASS |
| Sold To Date | `$saleType.TotalSoldItems` | per sale type | Sold To Date | same | PASS |
| % Sold | `$saleType.SoldPercentage` | per sale type | % Sold | same | PASS |
| Subtotal | `$saleType.Subtotal` | per sale type | Subtotal (formatted money includes ISO code) | same | PASS |
| Secondary Currency under Subtotal | `$saleType.Currency` | per sale type | **intentionally omitted** (duplicate of code already in Subtotal); currency value still present via Subtotal + header | N/A | PASS (cleanup) |
| Day Total Items | `$day.TotalItems` | `$day.HasSales` | Day Total → Items | same | PASS |
| Day Total Transactions | `$day.TotalTransactions` | `$day.HasSales` | Day Total → Transactions | same | PASS |
| Day Total Subtotal | `$day.TotalSubtotal` | `$day.HasSales` | Day Total → Subtotal | same | PASS |
| Day Total empty Total / Sold To Date / % Sold cells | (no values) | `$day.HasSales` | omitted (no values to show) | N/A | PASS |
| % Sold footnote | fixed copy | `$day.HasSales` | same copy | same | PASS |
| “No sales were recorded for this day.” | fixed copy | `HasSales` festival + `!HasSales` day | same | same | PASS |
| “No sales were recorded for this festival on this day.” | fixed copy | `!$festival.HasSales` | same | same | PASS |
| Need Help? + `info@eveenty.com` | fixed | always | same | always | PASS |

### Single-festival dead path (`.SaleTypes` — unused by current sender; preserved)

| Legacy | Kit | Result |
|---|---|---|
| SaleType, Items, Transactions, % Sold, Subtotal | same labels/values in cards | PASS |
| Total Items / Transactions / Subtotal | Total card | PASS |
| No SaleTypeKey / TotalItems / TotalSoldItems columns in Legacy | Kit also omits them on this path | PASS |
| Empty-state copy | same | PASS |

### Params present but never rendered in Legacy (not defects)

`FestivalID`, `OrganizerUserID`, festival-section aggregate totals, `RawSubtotal`, `RawSoldPercentage`, unused single-festival root fields when `.Festivals` is set — **not** in Legacy HTML; correctly not invented in Kit.

### Order / grouping

Sale types keep sender order (`EndOfDaySaleTypeOrder`: tickets first, then canonical sale-type order). Per day: sale-type cards then Day Total. Festivals keep report order.

### Conditions corrected

None — Kit conditions already matched Legacy (`Festivals` / `HasSales` / day `HasSales` / `SaleTypes`).

### Missing fields found

**None.**

### Automated evidence

`TestFestivalEOD_LegacyTableToKitCardDataMapping` asserts every section-builder business fact substring appears in both Legacy and Kit HTML for `multi_festival`, `single_festival`, and `no_sales`, plus shared condition copy and column labels when sales exist. Kit must not contain `eod-table` / `min-width:680px`.

## 10. Functional parity results

| Check | Result |
|---|---|
| Baseline vs archived Legacy golden | PASS (after volatile normalize) |
| Kit ↔ Legacy parity (`TestKitLegacyParity`) | PASS for all three personas |
| Attachment count | 0 / 0 |
| Unresolved CID | none |
| Malformed/empty URL | none |
| Report fields / totals / no-sales copy | preserved |

Intentional design differences only: Kit shell/chrome, logo via CdnURL, multipart/alternative wrapper, detail-card layout, and **approved currency presentation cleanup** (see §19) — Legacy still shows `CurrencyLabel (Currency)` and a secondary Subtotal currency line; Kit does not. Functional/MIME/link parity remains strict; no allowlist weakening.

## 11. Root-fallback cleanup

Removed the narrow `newEmailTemplate` root-path special-case for `festival_end_of_day_report`.

No root-level Legacy email bodies remain for the former out-of-catalog pair (`organizer_team_invitation`, `festival_end_of_day_report`). Loader uses archive/legacy only.

## 12. Kit scope 49 → 50

- `ExpectedInScopeKitTemplateCount` updated **49 → 50** in `email/smtp_kit.go`
- Kit activates only when exactly 50 bodies parse; partial sets fail closed
- Evidence inventory: 50 Kit + 61 archived Legacy
- Snapshot cases: `multi_festival__en`, `single_festival__en`, `no_sales__en`

## 13. Snapshot / parity results

| Golden | Result |
|---|---|
| Legacy `multi_festival` / `single_festival` / `no_sales` | PASS |
| Kit `multi_festival` / `single_festival` / `no_sales` | PASS |
| Kit↔Legacy parity for those cases | PASS |

Paths under `docs/backend-email-migration-evidence/goldens/email/testdata/{legacy,kit}_snapshots/festival_end_of_day_report/`.

## 14. Desktop / mobile review

Fresh Kit HTML (browser via local static serve):

| Check | 600px desktop | 320px mobile |
|---|---|---|
| Horizontal overflow | PASS (`scrollWidth == clientWidth`) | PASS |
| Kit header / footer | PASS | PASS |
| All sale metrics visible (Items / Transactions / Total / Sold To Date / % Sold / Subtotal / Day Total) | PASS | PASS |
| Multi-festival + no-sales copy | PASS | PASS |
| Long labels/values readable; no mis-associated labels | PASS | PASS |
| RTL content | N/A (EN/`ltr` only; shell conditionals retained) | N/A |

Evidence HTML: `docs/agent/production-migration/baselines/festival_end_of_day_report/*.fresh.kit.html`

**Data mapping re-check (2026-09-29):** desktop/mobile overflow still PASS; no Kit HTML change required.

**Approval history note:** No historic approved Preview. Visual reference is the established Eveenty Kit design system. Formal visual-owner approval is separate.

## 15. Build / vet / tests

| Command | Result |
|---|---|
| `go build ./...` | PASS |
| `go vet ./email/... ./config/...` | PASS |
| Focused EOD inventory/load/snapshots/parity | PASS |

## 16. Full preserved-suite result

| Command | Result |
|---|---|
| Overlay `go test ./email/... -count=1 -timeout 600s` (Kit #50 migration) | **PASS** — 520.076s |
| Overlay `go test ./email/... -count=1 -timeout 600s` (data-mapping audit re-run) | **PASS** — 510.832s |
| Restored evidence `go test ./email/... -count=1 -timeout 600s` (currency cleanup 2026-09-30) | **PASS** — 552.566s |
| Overlay `go test ./email/... -count=1 -timeout 600s` (presentation cleanup 2026-09-30) | **PASS** — 345.923s |

Includes Kit/Legacy snapshots, parity, MIME/inventory/load/asset checks, static/link audits, visual-parity allowlist guards, and `TestFestivalEOD_LegacyTableToKitCardDataMapping`. Original 48 + Kit #49 + Kit #50 PASS. Currency cleanup: Kit EOD goldens refreshed only; Legacy goldens unchanged. Presentation cleanup: Kit EOD goldens + baselines refreshed only; Legacy goldens/template unchanged. (Also selectively refreshed 8 stale `festival_ticket_registration_reject` Kit goldens left by a prior padding session so the full suite could close green.)

## 17. Git status

No commit / push / deploy performed.

## 19. Intentional Currency Presentation Cleanup

Date: 2026-09-30. Owner-approved Kit-only visual/product cleanup after Legacy→Kit parity was already proven.

### Before

| Surface | Presentation |
|---|---|
| Festival header | `TimeZone • CurrencyLabel (Currency)` → e.g. `America/Toronto • CAD (CAD)` |
| Sale-type Subtotal | Formatted money **plus** secondary `$saleType.Currency` line → e.g. `$150.00 CAD` then `CAD` |

Cause: `CurrencyLabel` is `ToUpper(Currency)` (identical for current ISO codes), and `Subtotal` already includes the ISO code via `GetMoneyForDisplay`. Legacy printed both; Kit had preserved that for parity.

### After (Kit only)

| Surface | Presentation |
|---|---|
| Festival header | `TimeZone • CurrencyLabel` → e.g. `America/Toronto • CAD` |
| Sale-type Subtotal | Formatted money only → e.g. `$150.00 CAD` |

### Not changed

- Backend / model currency generation and money formatter
- Archived Legacy template (still shows the duplicated presentation)
- Totals, metrics, conditions, locale, MIME, recipients, subject, scheduling
- Other Kit templates

### Files touched

| File | Change |
|---|---|
| `email/templates/kit/festival_end_of_day_report.template` | Header + Subtotal cleanup |
| `emails/festival_end_of_day_report.html` | Preview matches Kit |
| `shared/post-scope-renderers.js` | Preview renderer matches Kit |
| `docs/.../goldens/.../kit_snapshots/festival_end_of_day_report/{multi_festival,single_festival,no_sales}__en.eml` | Selective Kit golden refresh only |

### Parity handling

- Legacy goldens **unchanged**
- Kit↔Legacy RFC822/MIME/link parity still **PASS** (body HTML design may differ; no currency-value bypass added)
- `TestFestivalEOD_LegacyTableToKitCardDataMapping` still **PASS** — currency code remains in header + Subtotal strings
- Classified as **approved intentional Kit presentation difference** scoped to this ID’s redundant currency chrome only

### Visual

| Viewport | Header | Subtotal | Overflow |
|---|---|---|---|
| 600px | `America/Toronto • CAD` | single line `$…. CAD` | PASS |
| 320px | same | same | PASS |

### Reason

Both duplicated values were semantically identical for current currency data. Cleanup removes presentation noise without removing any unique business/report data.

## 20. Intentional Daily-Report Presentation Cleanup

Date: 2026-09-30. Owner-requested Kit/Preview-only cleanup for Daily Report readability.

### Source verification (single report day)

| Sender | From/To filters |
|---|---|
| Cron `processOrganizer` | `from` = `to` = previous local calendar day (`dateKey`) |
| API `ResendOrganizerEndOfDayReport` | same single-day `dateKey` |

Each email therefore represents **one** report day. Festival section `From`/`To` equal that same day (e.g. `2026-03-14`–`2026-03-14`). Day `RawDate` (`YYYY-MM-DD`) is the same calendar day as human-readable `Date` (`Saturday, March 14, 2026`).

### Removed from Kit / Preview display only

| Surface | Before | After | Reason |
|---|---|---|---|
| Day heading | Human date + ISO `RawDate` | Human date only | Same day; keep organizer-facing form |
| Festival header | `TimeZone • Currency` + `From – To` | `TimeZone • Currency` only | From/To are redundant same-day metadata for this email, not festival schedule dates |
| Sale-type card title | Label + internal key (`Tickets` / `tickets`) | Label only (`Tickets`) | Internal keys are not organizer-facing |

### Preserved metrics & conditions

Items, Transactions, Total, Sold To Date, Available, % Sold, Subtotal, Day Total, empty-day / empty-festival copy, help callout, intro `ReportDate`, timezone, currency label, money values — all still present. `TestFestivalEOD_LegacyTableToKitCardDataMapping` updated to stop requiring presentation-only duplicates (`From`/`To`, `RawDate`, `SaleTypeKey`) while still asserting labels, counts, money, and condition phrases.

### Not changed

- Backend/model/business logic, sender, schedulers
- Archived Legacy template (still shows ISO date, From/To, and sale-type keys)
- Legacy goldens
- Other Kit templates

### Files touched

| File | Change |
|---|---|
| `email/templates/kit/festival_end_of_day_report.template` | Drop RawDate, From/To, SaleTypeKey display |
| `shared/post-scope-renderers.js` + `emails/festival_end_of_day_report.html` | Preview matches Kit |
| `docs/.../tests/email/festival_eod_data_mapping_test.go` | Facts list omits presentation-only duplicates |
| Kit EOD goldens + `baselines/.../*.{fresh.,}kit.html` | Selective refresh |

### Tests

| Command | Result |
|---|---|
| Focused EOD mapping + Kit/Legacy EOD snapshots | **PASS** |
| Overlay `go test ./email/... -count=1 -timeout 600s` | **PASS** — 345.923s |

## 18. Final verdict

**FESTIVAL END OF DAY REPORT — KIT #50 PASS**  
**DESIGN SYSTEM REVIEW — PASS**  
**FESTIVAL END OF DAY REPORT DATA MAPPING — PASS**  
**FESTIVAL END OF DAY REPORT CURRENCY CLEANUP — PASS**  
**FESTIVAL END OF DAY REPORT PRESENTATION CLEANUP — PASS**  
**DEVELOP → EMAIL KIT MERGE CONFLICT RESOLUTION — PASS**

The duplicated Legacy currency presentation was intentionally removed from Kit #50. Redundant same-day ISO dates, festival From/To metadata, and internal sale-type keys were intentionally removed from Kit/Preview display. Currency data and all report metrics remain unchanged. Develop `AvailableItems` is preserved in archived Legacy and exposed in Kit #50 cards without restoring the wide Legacy table.

## 21. Develop merge conflict resolution (AvailableItems)

Date: 2026-09-30.

### Merge

`origin/develop` merged into `feature/eveenty-new-email-kit`. Git ort rename detection applied develop’s Legacy template edits onto `email/templates/archive/legacy/festival_end_of_day_report.template`. Root template stays absent.

### Preserved from develop

| Surface | Change |
|---|---|
| `model.SaleTypeEndOfDayReport.AvailableItems` + `availableItemsOf` | Business calculation |
| `endOfDayReportSaleTypeRow.AvailableItems` + section builder mapping | Email data path |
| Legacy archive table | **Available** column + `min-width: 760px` |
| `SendActivateEmail(ctx, user, token)` + `?token=` URL | Auth activation flow |
| Phone/email verification + migration renumbers | Unrelated develop features kept |

### Preserved from Kit branch

| Surface | Change |
|---|---|
| Kit #50 template + `templateFor` / `deliverRendered` | Kit rendering/delivery |
| Kit card layout (no `eod-table` / no 760px min-width table) | Design system |
| Kit `Available` metric row after Sold To Date | Same develop data, Kit presentation |

### Evidence / tests

- Fixtures set `AvailableItems`; mapping test requires label **Available** + values; rejects Kit `min-width: 760px`.
- Activate snapshot callers pass `snapshot-activate-token`.
- EOD + activate Kit/Legacy goldens refreshed; preview + kit HTML baselines updated.
- Overlay full suite **PASS** — 327.197s.
