# CONTRAST VALIDATION

**Date:** 2026-09-25  
**Method:** WCAG 2.x relative luminance (calculated)  
**Criteria:** Normal text 4.5:1 · Large text 3:1 · Non-text UI 3:1

## Implemented pairs (must pass)

| Pair | FG | BG | Ratio | Need | Verdict |
|------|----|----|-------|------|---------|
| CTA label on primary | `#4D4C49` | `#E9D023` | **5.52:1** | 4.5 | **PASS** |
| Warning title/body on warning | `#92400E` | `#FFFBEB` | **6.84:1** | 4.5 | **PASS** |
| Error title on error | `#991B1B` | `#FEF2F2` | **7.60:1** | 4.5 | **PASS** |
| Error body on error | `#4D4C49` | `#FEF2F2` | **7.85:1** | 4.5 | **PASS** |
| Success text on success | `#166534` | `#F0FDF4` | **6.81:1** | 4.5 | **PASS** |
| Heading on white | `#2B2A28` | `#FFFFFF` | **14.34:1** | 4.5 | **PASS** |
| Body / Dark-500 on white | `#4D4C49` | `#FFFFFF` | **8.59:1** | 4.5 | **PASS** |
| Dark-500 on light-100 | `#4D4C49` | `#F9F9F9` | **8.16:1** | 4.5 | **PASS** |

## Rejected DS lighter bodies (documented — not used)

| Pair | FG | BG | Ratio | Verdict |
|------|----|----|-------|---------|
| DS Warning body | `#AD6F45` | `#FFFBEB` | 3.94:1 | **FAIL** (not used) |
| DS Error body | `#B75C5E` | `#FEF2F2` | 4.08:1 | **FAIL** (not used) |
| DS Success body | `#629A77` | `#F0FDF4` | 3.13:1 | **FAIL** (not used) |
| Yellow event name on warning | `#E9D023` | `#FFFBEB` | 1.50:1 | **FAIL** (removed from HTML) |

## Status borders (non-text)

| Pair | FG | BG | Ratio | Need | Verdict |
|------|----|----|-------|------|---------|
| Warning border on warning BG | `#E6D1B9` | `#FFFBEB` | 1.43:1 | 3.0 | **FAIL** |
| Error border on error BG | `#E9C5C6` | `#FEF2F2` | 1.45:1 | 3.0 | **FAIL** |

**Note:** These borders match the **owner-approved / original DS** alert chrome. Status is also communicated via title/body text (PASS above) and semantic copy — borders are not the sole status indicator.

**OD-2 — CLOSED — OWNER APPROVED (Option A, 2026-09-26):** Keep Warning `#E6D1B9` / Error `#E9C5C6`. Treat borders as decorative. Do not strengthen or change border colors. Non-text 3:1 FAIL above is accepted under that policy (status must remain clear without relying on border contrast alone).

## Evidence
Machine results: `capture-results.json` → `contrastResults`.
