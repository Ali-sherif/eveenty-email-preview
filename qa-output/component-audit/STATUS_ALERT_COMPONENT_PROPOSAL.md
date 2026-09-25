# Email Status Alert — Shared Component Proposal (Read-Only)

**Date:** 2026-09-25  
**Status:** Proposal only — **do not implement**  
**Inputs:**  
- `ERROR_ALERT_DESIGN_SYSTEM_SPEC.md` (verified prior / same-day Error extraction)  
- `WARNING_ALERT_DESIGN_SYSTEM_SPEC.md` (this session)  
- `DISPUTE_EMAIL_DESIGN_AUDIT.md` (this session)  
**Sources:** Original DS Alerts & Status (`DeMR3FHvQbVJYmwStKivVg` · page `362:15543`) · Email Kit dispute frames · local helpers `statusAlertWarning` / support error block

---

## 1. Purpose

Define which properties a future **Email Status Alert** shared pattern should inherit for all variants (Success / Information / Warning / Error), and which must remain **variant-specific**, based on live Design System structure — without building the component yet.

---

## 2. Error vs Warning — structural comparison (verified)

| Property | Error `410:10824` | Warning `410:10812` | Shared? |
|----------|-------------------|---------------------|---------|
| Layout | Flex row · content + dismiss | Same | **Yes — shared** |
| Padding | 16px all | 16px all | **Yes — shared** |
| Radius (DS) | 16px | 16px | **Yes — shared (DS)** · email may adapt to 8px kit-wide |
| Icon size | 20×20 | 20×20 | **Yes — shared** |
| Icon–text gap | 8px | 8px | **Yes — shared** |
| Title–body gap | 8px | 8px | **Yes — shared** |
| Icon wrapper vertical inset | 4px | 4px | **Yes — shared** |
| Dismiss | 16×16 · title-color token | Same pattern | **Yes — shared structure** · **omit in email** |
| Title type | PJS H5 16/600/1.3 | Same | **Yes — shared** |
| Body type | Roboto Regular 16/400/1.4 | Same | **Yes — shared** |
| Title/body color split | Title = Status token; body = lighter hard-coded | Same pattern | **Yes — pattern shared** · hex **variant-specific** |
| Background token | Status-300 `#fef2f2` | Status-700 `#fffbeb` | **Variant-specific** |
| Title/icon token | Status-200 `#991b1b` | Status-600 `#92400e` | **Variant-specific** |
| Body hard-coded | `#b75c5e` | `#ad6f45` | **Variant-specific** |
| Border hard-coded | `#e9c5c6` | `#e6d1b9` | **Variant-specific** |
| Leading glyph | Circle-X (error) | Info-outline (warning) | **Variant-specific** |
| Showcase purpose | Failure / immediate attention | Potential issues / attention before proceeding | **Variant-specific semantics** |

**Conclusion:** One structural Email Status Alert shell; four (or more) **theme maps**.

---

## 3. Proposed shared shell (email-adapted)

Properties that should be **identical** across variants in email:

| Shared property | Proposed email value | Source |
|-----------------|----------------------|--------|
| Container model | Single nested `<table>` (no flex) | Email constraint |
| Padding | **16px** (prefer DS) or owner-locked 20px | DS / kit debate |
| Border width/style | 1px solid | DS |
| Border radius | **8px** (kit convention) | Intentional email adaptation vs DS 16 |
| Title font | Plus Jakarta Sans · weight **600** · LH **1.3** | DS H5 |
| Title size | **16px** (strict DS) or **18px** (current dispute) — owner pick once | — |
| Body font | Roboto · weight **400** · LH **1.4–1.5** | DS |
| Body size | **15–16px** | DS web 16 / current email 15 |
| Title↔body spacing | **8px** (DS) or 12px if 18px title retained | Prefer DS 8 |
| Leading icon | Optional; if present **20×20** · same color as title token | DS |
| Dismiss / close | **Never** in transactional email | Email constraint |
| Interactive states | None | Email constraint |
| RTL | `align` + `dir` props only; same colors | Kit |

---

## 4. Variant-specific theme maps

### 4.1 Error (from Error audit + AA notes)

| Slot | DS value | Email AA proposal |
|------|----------|-------------------|
| Background | Status-300 `#fef2f2` | Keep |
| Border | `#e9c5c6` | Keep (or owner-strengthen) |
| Title / icon | Status-200 `#991b1b` | Keep |
| Body | `#b75c5e` | **4.08:1 FAIL** on Status-300 (calculated this session) → propose Status-200 `#991b1b` for body (same AA pattern as Warning) |

### 4.2 Warning (this audit)

| Slot | DS value | Email AA proposal |
|------|----------|-------------------|
| Background | Status-700 `#fffbeb` | Keep |
| Border | `#e6d1b9` (prefer over kit `#fde68a`) | Prefer DS |
| Title / icon | Status-600 `#92400e` | Keep |
| Body | `#ad6f45` (**3.94:1 FAIL** on Status-700) | **Use Status-600 `#92400e`** (existing token · **6.84:1 PASS**) |

Do **not** invent a new mid-brown. Limitation: DS body hard-code fails AA; Status-600 is the accessible existing Status token.

### 4.3 Success / Information (structure only — not deep-measured this session)

| Variant | Web node (metadata) | Expected token pair (from Color Palette / prior audits) |
|---------|---------------------|--------------------------------------------------------|
| Success | `410:10787` | Status greens (e.g. Status-100 family) — **measure before implement** |
| Information | `410:10800` | Status blue Status-400/500 — **measure before implement** |

Mark Success/Information theme hexes **NOT VERIFIED** until a dedicated extraction matching Error/Warning rigor.

---

## 5. What must remain outside the Status Alert component

| Concern | Why separate |
|---------|--------------|
| Primary CTA `#E9D023` / `#4D4C49` | Approved button pattern — not an alert |
| Event Information card (`#f9f9f9` + optional accent bar) | Content card, not status alert |
| Magenta “What Happens Next” (`#fdf2f8` / `#d80073`) | Brand secondary panel — not DS Warning/Error |
| Details table / yellow header | Data table pattern |
| Yellow **text** highlights on light surfaces | Accessibility failure; not a status-alert primitive |
| Dispute Won / Lost / Under Review copy | Different **semantic** variants — map Won→Success, Lost→Error, Needs Response→Warning when multi-status templates are redesigned |

---

## 6. Dispute email mapping (current designed state only)

| Email block | Maps to Email Status Alert? | Variant |
|-------------|----------------------------|---------|
| “New Dispute Alert” | **Yes** | **Warning** |
| Event Information | No | Card |
| What Happens Next | No | Magenta panel (or future Information — owner decision) |
| View Payment CTA | No | Primary CTA |
| Need Help | No | Neutral help card |

Production helper currently paints **all** dispute statuses with yellow `#fff3cd`. Future work must not force Success/Lost into Warning solely because production AlertColor is shared today.

---

## 7. Suggested future API shape (documentation only)

```text
statusAlert({
  variant: 'warning' | 'error' | 'success' | 'info',
  title: string,
  bodyHtml: string,
  dir: 'ltr' | 'rtl',
  showIcon?: boolean   // default false for email-safe
})
```

Theme resolution (conceptual):

```text
warning → { bg: Status-700, border: #e6d1b9, fg: Status-600, bodyFg: Status-600 }
error   → { bg: Status-300, border: #e9c5c6, fg: Status-200, bodyFg: <AA-safe> }
...
```

Token names should be added to `shared/tokens.js` **only after owner approval** (currently tokens file has `error*` / `success*` but **no `warning*`** entries — verified).

---

## 8. Owner decisions required before implementation

1. Lock email alert **padding** 16 vs 20 and **title size** 16 vs 18.  
2. Accept Status-600 for Warning **body** (reject inaccessible `#ad6f45`).  
3. Border: DS `#e6d1b9` vs warmer `#fde68a` / production `#ffeaa7`.  
4. Sync production `AlertColor` `#fff3cd` vs kit Status-700 `#fffbeb`.  
5. Event-name emphasis: never primary yellow as text; choose Status-600 vs `#2b2a28`.  
6. Whether Event Info yellow accent bar stays (decorative) while text goes neutral.  
7. Multi-status dispute emails: map each status to Success/Warning/Error — do not reuse Warning for all.  
8. Whether optional 20px icon is desired in email (hosted PNG/GIF) vs emoji-only.

---

## 9. Explicit non-actions

- Do **not** create the shared component yet.  
- Do **not** edit Figma, HTML previews, tokens, or production.  
- Do **not** mark any template OWNER VISUAL APPROVED.  
- Do **not** start the remaining 41 undesigned emails.

---

## Stop

Proposal recorded for owner review. Implementation blocked pending decisions above.
