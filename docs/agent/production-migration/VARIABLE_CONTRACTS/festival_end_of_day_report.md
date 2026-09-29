# VARIABLE CONTRACT — `festival_end_of_day_report` (Kit #50)

> Post-original-48 Kit addition. Original approved Kit migration remained **48** templates.
> This ID was root-level Legacy-only until Kit #50 migration (2026-09-29).
> Escaping: Go `text/template` does **not** HTML-escape by default. Kit body uses `| html` on copy/report label fields.

## 1. Identity

| Field | Value |
|---|---|
| Template ID | `festival_end_of_day_report` |
| Kit number | **#50** (new post-review addition; not part of original 48) |
| Kit path | `email/templates/kit/festival_end_of_day_report.template` |
| Archived Legacy path | `email/templates/archive/legacy/festival_end_of_day_report.template` |
| Original Legacy path (pre-archive) | `email/templates/festival_end_of_day_report.template` |
| Sender method | `(*smtpClient).SendOrganizerEndOfDayReportToOrganizer` — `email/smtp_organizer_emails.go` |
| Callers / schedulers | `(*FestivalEndOfDayReportSender).processOrganizer` — `cron/send_festival_end_of_day_reports.go`; `(*FestivalAPI).ResendOrganizerEndOfDayReport` — `api/v1/festival_organizer.go` |
| Selection | `templateFor("festival_end_of_day_report", …)` + `deliverRendered("festival_end_of_day_report", …)` |

## 2. Params struct (production)

Best-match type: `festivalEndOfDayReportTemplateParams` (`email/smtp_model.go`)

```
FromName / FromEmail / ToName / ToEmail / Subject
BrandLogo / HTMLLang / HTMLDir
FestivalName / ReportDate / TimeZone          // legacy single-festival fields (unused by current sender)
SaleTypes / TotalItems / TotalTransactions / TotalSubtotal  // legacy single-festival path
Festivals []endOfDayReportFestivalSection     // production multi-festival path
From / To / OrganizerUserID                   // report date-range keys + organizer id
```

Nested festival section fields (built by `buildEndOfDayReportFestivalSections`):

```
FestivalID, FestivalName, Currency, CurrencyLabel, TimeZone, From, To, ReportDate
Days[]: Date, RawDate, SaleTypes[], TotalItems, TotalTransactions, TotalSubtotal, Currency, HasSales
SaleTypes[]: SaleType, SaleTypeKey, ItemsCount, TransactionsCount, SoldPercentage, Subtotal,
             TotalItems, TotalSoldItems, Currency (+ raw numeric helpers unused in template)
```

## 3. Envelope

| Field | Behavior |
|---|---|
| SMTP recipient | `[]string{organizer.Email}` / `params.ToEmail` |
| From | `"Eveenty" <c.from>` (Kit envelope `fromLiteral: "Eveenty"`; Legacy From header in archived body) |
| To | `utils.GetOrganizerName(organizer)` / organizer email |
| Reply-To | none |
| Subject | ``📊 End of Day Sales Report | {FestivalName|All Festivals} | Organizer Email`` |

## 4. Locale / fallback

- Copy is **English-only** (hardcoded in sender and template).
- `HTMLLang` = `"en"`, `HTMLDir` = `"ltr"` always.
- Brand logo language: English via `applyKitBrandLogo("en", utils.GetLocalizedLogoURL("en"))`.

## 5. Report fields (functional)

| Field | Source |
|---|---|
| ReportDate (intro) | `formatEndOfDayReportDate(report.ReportDay(), time.UTC)` → `Monday, January 2, 2006` |
| Festival name / TZ / currency | `FestivalEndOfDayReport` + currency upper label |
| Day Date / RawDate | formatted day + `YYYY-MM-DD` (params still built; **Kit/Preview display human-readable Date only**) |
| Sale type label / key | mapped label (`Tickets`, …) + raw key (`tickets`, …) (**Kit/Preview display label only**) |
| Festival From–To | report filter day keys (params still built; **Kit/Preview omit** — always the single report day for cron/resend) |
| Items / Transactions / Total / Sold To Date / % Sold / Subtotal | per sale type row |
| Day Total Items / Transactions / Subtotal | summed in section builder |
| No-sales day / festival messages | `HasSales` conditionals |
| Help mailto | hardcoded `info@eveenty.com` |

## 6. Conditional branches

| Condition | Behavior |
|---|---|
| `.Festivals` non-empty | Multi-festival sections (production path) |
| else + `.SaleTypes` | Legacy single-festival table/cards path (preserved; unused by current sender) |
| `$festival.HasSales` / `$day.HasSales` | Sales cards vs empty-state copy |

## 7. URLs / links

- Help: `mailto:info@eveenty.com`
- Footer mailto: organizer `ToEmail`
- Brand logo URL (Kit): via `CdnURL` resolver when Kit active
- No action CTA button; no calendar / wallet / tracking links

## 8. HTML-safe / raw surfaces

- Kit applies `| html` to names, dates, labels, percentages, money display strings, currency.
- Counts are numeric template inserts (safe).
- Mailto hrefs are raw URL surfaces (same as other Kit templates).

## 9. MIME / attachments

- Legacy archived body: RFC822 headers + `text/html; charset="utf-8"`; no attachments
- Kit active: `deliverRendered` wraps HTML as `multipart/alternative`
- Attachments: **none**
- No ICS / pkpass / CID references

## 10. Fallback behavior

- Kit active + Kit body present → Kit template
- Kit inactive / incomplete set (< 50) → archived Legacy body
- No root-level Legacy fallback remains for this ID

## 11. Security handoff

`none`

## 12. Visual approval note

No historic approved Preview HTML exists specifically for `festival_end_of_day_report`.
Visual reference is the established Eveenty Kit design system (branded header / detail cards / branded footer).
Formal visual-owner approval, if required by process, is separate from functional parity.
