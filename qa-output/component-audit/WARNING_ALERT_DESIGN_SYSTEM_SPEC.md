# WARNING Alert — Original Design System Spec (Read-Only Audit)

**Date:** 2026-09-25  
**Source file (READ ONLY):** [Eveenty-Design-System-New](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=362-15543&m=dev) (`DeMR3FHvQbVJYmwStKivVg`)  
**Method:** Live Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`, SVG asset fill/stroke inspection)  
**Scope:** Extract Warning alert specs only. No Figma edits. No Email Kit / HTML / token edits.

**Evidence grades used below:**
- **Verified** — read from live Figma this session
- **Reported** — prior docs only (not relied on unless re-checked)
- **NOT VERIFIED** — inaccessible or not bound in Figma response

---

## 1. Selected Warning alert node and direct Figma link

### 1.1 Located Warning variants (Alerts & Status)

| # | Page | Component / frame name | Node ID | Direct URL | Role |
|---|------|------------------------|---------|------------|------|
| A | Alerts & Status | `Web=Warning, Mobile=Default` (Alerts component set) | `410:10812` | [link](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=410-10812&m=dev) | **Web Warning alert (primary)** |
| B | Alerts & Status | `Web=Default, Mobile=Warning` | `410:10875` | [link](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=410-10875&m=dev) | Mobile Warning alert |
| C | Alerts & Status | Showcase “4. Warning” + instance of A | Frame `576:21491` / instance `576:21555` | [frame](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=576-21491&m=dev) · [instance](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=576-21555&m=dev) | Documented usage |
| D | Alerts & Status | `Property 1=Warning` (status badge) | `448:20330` | [link](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=448-20330&m=dev) | Status pill — **not** the notification alert |

Showcase labels (verified on `576:21493` / `576:21494`):
- **“4. Warning”**
- **“Use for: Alerting users to potential issues or actions that require attention before proceeding.”**

Parent page: Alerts & Status `362:15543` — [page](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=362-15543&m=dev)

### 1.2 Closest semantic match for “New Dispute Alert”

**Selected: Web Warning alert `410:10812` (`Web=Warning, Mobile=Default`).**

Rationale (source-backed):
- Documented **Warning** alert under Alerts (title + body + icon + dismiss).
- Showcase purpose text matches attention-before-proceeding messaging (new dispute / evidence deadline).
- Status badge `448:20330` is a compact label (dot + “Warning”), not a notification pattern.
- Mobile `410:10875` is the same pattern at mobile width/type size — secondary reference.
- Designed Email Kit dispute reference is specifically **Needs Response / New Dispute** (not Won/Lost) — Warning is the correct status family for that state.

---

## 2. Exact component measurements (Web Warning `410:10812`)

### CONTAINER

| Property | Verified value | Notes |
|----------|----------------|-------|
| Background fill | `#fffbeb` | Bound to variable **Status-700** |
| Border color | `#e6d1b9` | **Hard-coded** — no Figma variable returned on the alert node |
| Border width | `1px` | From design context `border` (solid) |
| Border style | `solid` | Verified |
| Border radius | `16px` | Verified (`rounded-[16px]`) |
| Width behavior | Default frame width **992px** in component set; showcase instance ~694–698px | Hug/fill beyond observed widths **NOT VERIFIED** as named auto-layout props |
| Height | Frame height **83px** | Content-driven from padding + title/body |
| Minimum height | **NOT VERIFIED** | No explicit min-height property returned |

### SPACING

| Property | Verified value | How derived |
|----------|----------------|-------------|
| Top / right / bottom / left padding | **16px** all sides | Design context `p-[16px]`; metadata content origin `(16,16)` |
| Gap icon → text | **8px** | Design context `gap-[8px]` on `410:10813`; text frame x=`28` = 20 icon + 8 gap |
| Gap heading → body | **8px** | Design context `gap-[8px]` on `410:10817`; body y=`29` = title h≈21 + 8 |
| Icon optical vertical inset | **4px** top on icon wrapper `410:10814` | Metadata: icon at y=`4` inside 28-tall wrap; design context `py-[4px]` on web |
| Dismiss position | Top-right; 16px from top/right edges | Metadata: Button at `(960,16)` in 992-wide frame |

Spacing scale cross-check (Spacing page `408:10705`, verified in prior Error audit / same file):
- `4px` = xs · `8px` = sm · `16px` = base  
Padding 16 and gaps 8 **align** with that scale numerically; alert nodes did **not** return named spacing variables — treat as **hard-coded numeric matches**, not proven token bindings.

### TYPOGRAPHY — TITLE (`410:10818`)

| Property | Verified value |
|----------|----------------|
| Font family | Plus Jakarta Sans |
| Font size | 16px |
| Font weight | 600 (SemiBold) |
| Line height | 1.3 |
| Letter spacing | 0 |
| Text color | `#92400e` |
| Text style / token | `Display — Plus Jakarta Sans/Heading — Plus Jakarta Sans/H5` |
| Color token | **Status-600** |

### TYPOGRAPHY — BODY (`410:10819`)

| Property | Verified value |
|----------|----------------|
| Font family | Roboto |
| Font size | 16px |
| Font weight | 400 (Regular) |
| Line height | 1.4 |
| Letter spacing | 0 |
| Text color | `#ad6f45` |
| Text style / token | `Display — Plus Jakarta Sans/Body — Roboto — Regular/Text` |
| Color token | **None** — hard-coded `#ad6f45` (`get_variable_defs` on body returned typography style only) |

**Important pattern (verified):** Warning alert does **not** use Status-600 brown for all copy. **Title** = Status-600 `#92400e`; **body** = lighter hard-coded `#ad6f45`.

### ICON (leading)

| Property | Verified value |
|----------|----------------|
| Layer / component name | `material-symbols:info-outline-rounded` (`410:10815`) |
| Visual | Circle + “i” (Material Symbols info outline) — **not** a triangle warning glyph |
| Size | **20×20** |
| Color | Fill `#92400E` (SVG asset) |
| Color token on icon node | **Status-600** (`get_variable_defs` on `410:10815`) |
| Spacing to text | **8px** horizontal gap |

### DISMISS / CONTROL

| Property | Verified value |
|----------|----------------|
| Exists? | **Yes** — frame `Button` `410:10820` |
| Inner icon | `Icon` `410:10821` with Vector strokes (X) |
| Hit / frame size | **16×16** |
| Glyph stroke size (asset) | ~9.33×9.33 viewBox paths inside 16 frame |
| Color | Stroke `#92400E` (SVG); variable **Status-600** on button |
| HTML email appropriateness | **Not appropriate as an interactive dismiss** in transactional email |

---

## 3. Exact colors (confirmed / rejected)

### Against Color Palette → Status Colors (section `307:1285`)

| Token label (palette swatch text) | Hex on swatch | Used by Web Warning alert? |
|-----------------------------------|---------------|---------------------------|
| Status-600 | `#92400E` | **Yes** — title, icon, dismiss |
| Status-700 | `#FFFBEB` | **Yes** — alert background |
| Status-200 | `#991B1B` | No (error) |
| Status-300 | `#FEF2F2` | No (error) |
| Status-100 | `#166534` / also labeled `#F0FDF4` | No |
| Status-400 | `#1E40AF` | No |
| Status-500 | `#EFF6FF` | No |

### Candidate confirmation

| Candidate | Live Figma verdict |
|-----------|--------------------|
| Warning text `#92400E` | **CONFIRMED** as Status-600; used for **title / icon / dismiss**, not body |
| Warning background `#FFFBEB` | **CONFIRMED** as Status-700 |
| Warning border | **`#e6d1b9`** on alert — **CONFIRMED** on component; **not** listed as a Status-* swatch hex on Color Palette |
| Body text `#ad6f45` | **CONFIRMED** on alert body; **not** a Status-* palette swatch |

**Status badge note (related, not selected):** Warning status `448:20330` uses border `#e9d6bf` at `0.5px`, bg Status-700, text Status-600, dot `#c89d7d` — **different** from alert border `#e6d1b9` / `1px`. Do not conflate.

---

## 4. Exact typography summary

| Role | Family | Size | Weight | LH | Tracking | Color | Style name |
|------|--------|------|--------|----|----------|-------|------------|
| Title | Plus Jakarta Sans | 16 | 600 | 1.3 | 0 | `#92400e` (Status-600) | Heading H5 |
| Body | Roboto | 16 | 400 | 1.4 | 0 | `#ad6f45` (hard-coded) | Body Regular/Text |

### Mobile Warning variant (`410:10875`) — secondary

| Property | Value |
|----------|-------|
| Width | 327px |
| Padding / radius / border / bg | Same as web (16 / 16 / `#e6d1b9` / Status-700) |
| Title color | Status-600 `#92400e` |
| Body color | `#ad6f45` hard-coded |
| Type size | **14px** (verified style on body; title also at 14 in design context) |
| Title line-height | `normal` in mobile export (differs from web 1.3) — note ambiguity |
| Icon / dismiss | Same 20 / 16 pattern; icon name same `material-symbols:info-outline-rounded` |

---

## 5. Exact spacing summary

| Slot | px | Aligns with Spacing page label? |
|------|----|----------------------------------|
| Padding (all) | 16 | = `base` |
| Icon–text gap | 8 | = `sm` |
| Title–body gap | 8 | = `sm` |
| Icon wrapper vertical pad | 4 | = `xs` |
| Radius | 16 | **Not** on Spacing page; radius source = component hard value |

---

## 6. Exact icon specs

| Item | Value |
|------|-------|
| Node | `410:10815` (`material-symbols:info-outline-rounded`) |
| Size | 20×20 |
| Fill color | `#92400E` |
| Token | Status-600 |
| Relative spacing | 8px to text column; 4px vertical pad in wrapper |
| Note | DS uses **info-outline**, not a triangle/exclamation warning icon |

---

## 7. Exact token / variable references

| Property | Value | Token / variable | Node | Source page |
|----------|-------|------------------|------|-------------|
| Warning background | `#fffbeb` | **Status-700** | `410:10812` | Alerts & Status; Color Palette Status Colors |
| Warning title / icon / dismiss | `#92400e` | **Status-600** | `410:10818`, `410:10815`, `410:10820` | Alerts & Status; Color Palette |
| Warning body text | `#ad6f45` | **Hard-coded** (no variable) | `410:10819` | Alerts & Status only |
| Warning border | `#e6d1b9` | **Hard-coded** (no variable) | `410:10812` | Alerts & Status only |
| Title type | PJS SemiBold 16 / 1.3 / 0 | Style **H5** | `410:10818` | Typography (via style ref) |
| Body type | Roboto Regular 16 / 1.4 / 0 | Style **Body Regular/Text** | `410:10819` | Typography (via style ref) |
| Padding / gaps / radius | 16 / 8 / 16 | **No variable bindings returned** | `410:10812` subtree | Numeric only |

---

## 8. Accessibility note on original DS body color (calculated this session)

| Pair | Ratio | WCAG AA normal (4.5:1) |
|------|-------|-------------------------|
| Title `#92400e` on `#fffbeb` | **6.84:1** | **PASS** |
| Body `#ad6f45` on `#fffbeb` | **3.94:1** | **FAIL** |

Original Design System Warning **body** color fails WCAG AA for normal text. Do not treat DS membership as accessibility approval. See `DISPUTE_EMAIL_DESIGN_AUDIT.md` Phase 3/5 for email proposal using Status-600 for body when AA is required.

---

## 9. Other status variants (structure shared)

Same Alerts component set siblings (for coordination with Error audit — not fully re-measured here):

| Variant | Web node | Mobile node |
|---------|----------|-------------|
| Success | `410:10787` | `410:10837` |
| Error | `410:10824` | `410:10850` |
| Information | `410:10800` | `410:10863` |
| Warning | `410:10812` | `410:10875` |

Shared structural pattern (verified Warning + prior Error audit): flex row · 16px pad · 16px radius · 8px icon/title gaps · 20px leading icon · 16px dismiss · title/body color split (token + hard-coded lighter body).

---

## 10. Unresolved ambiguity

1. **Explicit min-height** on Warning alert — not returned; only observed height 83px.  
2. **Why info-outline glyph** is used for Warning (vs triangle) — component naming only; semantic intent **NOT VERIFIED** beyond showcase copy.  
3. **Whether `#e6d1b9` / `#ad6f45` should become named Status tokens** — hard-coded on component; absent from Status Color swatches.  
4. **Radius 8 vs 16 for email** — kit convention vs DS; owner lock still useful.  
5. **Mobile title line-height `normal` vs web `1.3`** — export difference; which is canonical for email **NOT VERIFIED**.

---

## Concise summary table

| Property | Original DS value | Token | Node |
|----------|-------------------|-------|------|
| Background | `#fffbeb` | Status-700 | `410:10812` |
| Border | `#e6d1b9` 1px solid | Hard-coded | `410:10812` |
| Radius | 16px | Hard-coded | `410:10812` |
| Padding | 16px | Hard-coded (scale base) | `410:10812` |
| Title color | `#92400e` | Status-600 | `410:10818` |
| Body color | `#ad6f45` | Hard-coded | `410:10819` |
| Title type | PJS 16/600/1.3 | H5 | `410:10818` |
| Body type | Roboto 16/400/1.4 | Body Regular | `410:10819` |
| Icon | 20px info-outline `#92400E` | Status-600 | `410:10815` |
| Dismiss | 16px X `#92400E` | Status-600 | `410:10820` |
| Min-height | — | — | NOT VERIFIED |

---

## Stop

Read-only extraction complete. No Figma, Email Kit, HTML, token, or production files were modified except this report.
