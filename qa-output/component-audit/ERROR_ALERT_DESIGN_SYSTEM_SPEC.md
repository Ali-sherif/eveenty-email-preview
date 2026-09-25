# ERROR Alert — Original Design System Spec (Read-Only Audit)

**Date:** 2026-09-25  
**Source file (READ ONLY):** [Eveenty-Design-System-New](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=362-15543&m=dev) (`DeMR3FHvQbVJYmwStKivVg`)  
**Method:** Live Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`, SVG asset stroke inspection)  
**Scope:** Extract Error alert specs only. No Figma edits. No Email Kit / HTML / token edits.

**Evidence grades used below:**
- **Verified** — read from live Figma this session
- **Reported** — prior docs only (not relied on unless re-checked)
- **NOT VERIFIED** — inaccessible or not bound in Figma response

---

## 1. Selected Error alert node and direct Figma link

### 1.1 Located Error variants (Alerts & Status)

| # | Page | Component / frame name | Node ID | Direct URL | Role |
|---|------|------------------------|---------|------------|------|
| A | Alerts & Status | `Web=Error, Mobile=Default` (Alerts component set) | `410:10824` | [link](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=410-10824&m=dev) | **Web Error alert (primary)** |
| B | Alerts & Status | `Web=Default, Mobile=Error` | `410:10850` | [link](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=410-10850&m=dev) | Mobile Error alert |
| C | Alerts & Status | Showcase “2. Error” + instance of A | Frame `576:21481` / instance `576:21527` | [frame](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=576-21481&m=dev) · [instance](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=576-21527&m=dev) | Documented usage |
| D | Alerts & Status | `Property 1=error` (status badge) | `448:20328` | [link](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=448-20328&m=dev) | Status pill — **not** the notification alert |

Showcase label (verified on `576:21483` / `576:21484`):
- **“2. Error”**
- **“Use for: Informing users that an action failed or requires immediate attention.”**

### 1.2 Closest semantic match for “Internal Server Error Notification”

**Selected: Web Error alert `410:10824` (`Web=Error, Mobile=Default`).**

Rationale (source-backed):
- It is the documented **Error** alert under Alerts (title + body + icon + dismiss).
- Showcase purpose text matches failure / attention messaging.
- Status badge `448:20328` is a compact label (dot + “Error”), not a notification pattern.
- Mobile `410:10850` is the same pattern at mobile width/type size — secondary reference.

---

## 2. Exact component measurements (Web Error `410:10824`)

### CONTAINER

| Property | Verified value | Notes |
|----------|----------------|-------|
| Background fill | `#fef2f2` | Bound to variable **Status-300** |
| Border color | `#e9c5c6` | **Hard-coded** — no Figma variable returned on the alert node |
| Border width | `1px` | From design context `border` (solid) |
| Border style | `solid` | Verified |
| Border radius | `16px` | Verified (`rounded-[16px]`) |
| Width behavior | Default frame width **694px**; layout `flex` + `justify-between` | Hug/fill constraints beyond default width **NOT VERIFIED** as named auto-layout props |
| Height | Frame height **83px** | Content-driven from padding + title/body |
| Minimum height | **NOT VERIFIED** | No explicit min-height property returned; do not invent one |

### SPACING

| Property | Verified value | How derived |
|----------|----------------|-------------|
| Top / right / bottom / left padding | **16px** all sides | Design context `p-[16px]`; metadata content origin `(16,16)` |
| Gap icon → text | **8px** | Design context `gap-[8px]` on `410:10825`; text frame x=`28` = 20 icon + 8 gap |
| Gap heading → body | **8px** | Design context `gap-[8px]` on `410:10830`; body y=`29` = title h≈21 + 8 |
| Icon optical vertical inset | **4px** top/bottom on icon wrapper `410:10893` | `py-[4px]` |
| Dismiss position | Top-right; 16px from top/right edges | Metadata: Button at `(662,16)` in 694-wide frame |

Spacing scale cross-check (Spacing page `408:10705`, verified):
- `4px` = xs · `8px` = sm · `16px` = base  
Padding 16 and gaps 8 **align** with that scale numerically; alert nodes did **not** return named spacing variables — treat as **hard-coded numeric matches**, not proven token bindings.

### TYPOGRAPHY — TITLE (`410:10831`)

| Property | Verified value |
|----------|----------------|
| Font family | Plus Jakarta Sans |
| Font size | 16px |
| Font weight | 600 (SemiBold) |
| Line height | 1.3 |
| Letter spacing | 0 |
| Text color | `#991b1b` |
| Text style / token | `Display — Plus Jakarta Sans/Heading — Plus Jakarta Sans/H5` |
| Color token | **Status-200** |

### TYPOGRAPHY — BODY (`410:10832`)

| Property | Verified value |
|----------|----------------|
| Font family | Roboto |
| Font size | 16px |
| Font weight | 400 (Regular) |
| Line height | 1.4 |
| Letter spacing | 0 |
| Text color | `#b75c5e` |
| Text style / token | `Display — Plus Jakarta Sans/Body — Roboto — Regular/Text` |
| Color token | **None** — hard-coded `#b75c5e` (`get_variable_defs` on body returned typography style only) |

**Important pattern (verified):** Error alert does **not** use Status-200 red for all copy. **Title** = Status-200 `#991b1b`; **body** = lighter hard-coded `#b75c5e`.

### ICON (leading)

| Property | Verified value |
|----------|----------------|
| Layer / component name | `Icon` (`410:10826`) |
| Visual | Circle + X (stroke paths) |
| Size | **20×20** |
| Color | Stroke `#991B1B` (SVG asset) |
| Color token on icon node | **Status-200** (`get_variable_defs` on `410:10826`) |
| Spacing to text | **8px** horizontal gap |
| Library glyph name beyond layer “Icon” | **NOT VERIFIED** (Icons & Controls page not deep-mapped to a published icon name this session) |

### DISMISS / CONTROL

| Property | Verified value |
|----------|----------------|
| Exists? | **Yes** — frame `Button` `410:10833` |
| Inner icon | `Icon` `410:10834` with two Vector strokes (X) |
| Hit / frame size | **16×16** |
| Glyph stroke size (asset) | ~9.33×9.33 viewBox paths inside 16 frame |
| Color | Stroke `#991B1B` (SVG); variable **Status-200** on button/icon |
| HTML email appropriateness | **Not appropriate as an interactive dismiss** in transactional email (no reliable dismiss UX; decorative X would be misleading). Report only — no redesign. |

---

## 3. Exact colors (confirmed / rejected)

### Against Color Palette → Status Colors (page Color Palette / section `307:1285`)

| Token label (palette swatch text) | Hex on swatch | Used by Web Error alert? |
|-----------------------------------|---------------|---------------------------|
| Status-200 | `#991B1B` | **Yes** — title, icon, dismiss |
| Status-300 | `#FEF2F2` | **Yes** — alert background |
| Status-100 | `#166534` / also labeled swatch `#F0FDF4` | No (error alert) |
| Status-400 | `#1E40AF` | No |
| Status-500 | `#EFF6FF` | No |
| Status-600 | `#92400E` | No |
| Status-700 | `#FFFBEB` | No |

### Candidate confirmation

| Candidate from prior audit | Live Figma verdict |
|----------------------------|--------------------|
| Error text `#991B1B` | **CONFIRMED** as Status-200; used for **title / icon / dismiss**, not body |
| Error background `#FEF2F2` | **CONFIRMED** as Status-300 |
| Error border | **`#e9c5c6`** on alert — **CONFIRMED** on component; **not** listed as a Status-* swatch hex on Color Palette |
| Body text `#b75c5e` | **CONFIRMED** on alert body; **not** a Status-* palette swatch |

**Status badge note (related, not selected):** Error status `448:20328` uses border `#eac7c7` at `0.5px` — **different** from alert border `#e9c5c6` / `1px`. Do not conflate.

---

## 4. Exact typography summary

| Role | Family | Size | Weight | LH | Tracking | Color | Style name |
|------|--------|------|--------|----|----------|-------|------------|
| Title | Plus Jakarta Sans | 16 | 600 | 1.3 | 0 | `#991b1b` (Status-200) | Heading H5 |
| Body | Roboto | 16 | 400 | 1.4 | 0 | `#b75c5e` (hard-coded) | Body Regular/Text |

### Mobile Error variant (`410:10850`) — secondary

| Property | Value |
|----------|-------|
| Width | 327px |
| Padding / radius / border / bg | Same as web (16 / 16 / `#e9c5c6` / Status-300) |
| Title color | Status-200 `#991b1b` |
| Body color | `#b75c5e` hard-coded |
| Type size | **14px** body (verified style); title also rendered at 14 in design context |
| Title line-height | `normal` in mobile export (differs from web 1.3) — note ambiguity |
| Icon / dismiss | Same 20 / 16 pattern |

---

## 5. Exact spacing summary

| Slot | px | Aligns with Spacing page label? |
|------|----|----------------------------------|
| Padding (all) | 16 | = `base` |
| Icon–text gap | 8 | = `sm` |
| Title–body gap | 8 | = `sm` |
| Icon wrapper vertical pad | 4 | = `xs` |
| Radius | 16 | **Not** on Spacing page (spacing scale only); radius source = component hard value |

---

## 6. Exact icon specs

| Item | Value |
|------|-------|
| Node | `410:10826` (`Icon`) |
| Size | 20×20 |
| Stroke color | `#991B1B` |
| Token | Status-200 |
| Relative spacing | 8px to text column; 4px vertical pad in wrapper |

---

## 7. Exact token / variable references

| Property | Value | Token / variable | Node | Source page |
|----------|-------|------------------|------|-------------|
| Error background | `#fef2f2` | **Status-300** | `410:10824` | Alerts & Status; Color Palette Status Colors |
| Error title / icon / dismiss text-stroke | `#991b1b` | **Status-200** | `410:10831`, `410:10826`, `410:10833` | Alerts & Status; Color Palette |
| Error body text | `#b75c5e` | **Hard-coded** (no variable) | `410:10832` | Alerts & Status only |
| Error border | `#e9c5c6` | **Hard-coded** (no variable) | `410:10824` | Alerts & Status only |
| Title type | PJS SemiBold 16 / 1.3 / 0 | Style **Display — Plus Jakarta Sans/Heading — Plus Jakarta Sans/H5** | `410:10831` | Typography (via style ref) |
| Body type | Roboto Regular 16 / 1.4 / 0 | Style **Display — Plus Jakarta Sans/Body — Roboto — Regular/Text** | `410:10832` | Typography (via style ref) |
| Padding / gaps / radius | 16 / 8 / 16 | **No variable bindings returned** | `410:10824` subtree | Numeric only; Spacing page documents 4/8/16 scale |

---

## 8. Comparison against current email pattern

**Current email example (read-only):** `emails/support.html` — “Internal Server Error Notification” with Environment error block:

```html
<!-- conceptual excerpt — not modified -->
h1: Internal Server Error Notification
  font: Plus Jakarta Sans 20 / 600 / #2b2a28

error block table:
  background: #fef2f2
  border: 1px solid #e9c5c6
  border-radius: 8px
  cell padding: 16px
  text: "Environment: production"
  font: Roboto 14 / 700 / #991b1b
  (no leading icon, no dismiss, no secondary body inside the red block)
```

Also mirrored in `shared/tokens.js` as `errorSurface` / `errorBorder` / `errorFg` (documentation only; not re-authored here).

### Does DS use red for all body copy?

**No.** Verified pattern:
- **Heading / title:** Status-200 `#991b1b`
- **Body:** hard-coded `#b75c5e`
- Therefore “Environment: production” being `#991b1b` is **title-weight color treatment**, not DS alert body color. Whether Environment *should* be title-colored is **NEEDS OWNER DECISION** (content role mapping).

### Classification table

| Property | Original DS value | Token | Node | Current email (`support.html`) | Status |
|----------|-------------------|-------|------|--------------------------------|--------|
| Alert background | `#fef2f2` | Status-300 | `410:10824` | `#fef2f2` | **MATCHES ORIGINAL** |
| Alert border color | `#e9c5c6` | Hard-coded | `410:10824` | `#e9c5c6` | **MATCHES ORIGINAL** |
| Alert border width/style | 1px solid | Hard-coded | `410:10824` | 1px solid | **MATCHES ORIGINAL** |
| Border radius | 16px | Hard-coded | `410:10824` | 8px | **INTENTIONAL EMAIL ADAPTATION** (kit-wide 8px card/radius convention observed) |
| Padding | 16px | Hard-coded (scale base) | `410:10824` | 16px | **MATCHES ORIGINAL** |
| Structure | Icon + title + body + dismiss | — | `410:10824` | Single bold line; no icon/dismiss; page H1 outside block | **UNINTENDED DESIGN DEVIATION** (structure) / structure simplification may also be **NEEDS OWNER DECISION** |
| Title type | PJS 16 / 600 / 1.3 | H5 style | `410:10831` | N/A inside block; page H1 is PJS 20 / 600 / `#2b2a28` | **INTENTIONAL EMAIL ADAPTATION** (page heading) vs alert title — **NOT VERIFIED** as intended mapping |
| In-block emphasis text | Title Status-200; body `#b75c5e` | Status-200 + hard-coded | `410:10831`/`410:10832` | Single Roboto 14 / **700** / `#991b1b` | **UNINTENDED DESIGN DEVIATION** (weight 700 vs 600; missing body tier `#b75c5e`; 14 vs web 16) |
| In-block size 14 | Mobile alert uses 14 | — | `410:10850` | 14 | **NOT VERIFIED** whether email intentionally followed mobile |
| Leading icon | 20px Status-200 circle-X | Status-200 | `410:10826` | Absent | **INTENTIONAL EMAIL ADAPTATION** (email safety) — confirm with owner if omission is permanent |
| Dismiss control | 16px Status-200 X | Status-200 | `410:10833` | Absent | **INTENTIONAL EMAIL ADAPTATION** (interactive dismiss unsuitable) |
| Body color for secondary copy | `#b75c5e` | Hard-coded | `410:10832` | Not used in error block | **NEEDS OWNER DECISION** (whether Environment / secondary lines should use body red) |
| Red for *all* alert text | No (title vs body split) | — | — | Entire Environment line is `#991b1b` | **NEEDS OWNER DECISION** (role mapping) |

---

## 9. Email-specific constraints (no redesign)

Properties from the **original** Error alert that are unsuitable or fragile in HTML email — report only:

| Original property | Why email-fragile |
|-------------------|-------------------|
| Dismiss / close control | No reliable client-side dismiss; interactive control implies action that email cannot provide |
| Hover / focus / pressed states (if any on Button) | Email clients do not support interactive alert states consistently — **NOT VERIFIED** whether DS defines those states beyond the static symbol |
| Leading SVG icon (stroke-based) | Many clients strip or break external SVG; inline SVG / image hosting / Outlook VML constraints apply |
| `border-radius: 16px` | Partial Outlook support; kit already uses 8px elsewhere — adaptation expected |
| Flex + `justify-between` layout | Email requires table layout; gaps/padding must be re-expressed with nested tables / spacer cells |
| Web fonts (Plus Jakarta Sans / Roboto) | Fallbacks required; not all clients load webfonts |
| Shadows | Original Error alert **did not** expose a shadow in design context (none verified on `410:10824`) — N/A for this component |

---

## 10. Unresolved ambiguity

1. **Explicit min-height** on Error alert — not returned; only observed height 83px.  
2. **Published icon library name** for leading `Icon` — layer name only.  
3. **Whether `#e9c5c6` / `#b75c5e` should become named Status tokens** — they are hard-coded on the component and absent from Status Color swatches.  
4. **Email “Environment: production” role** — title-colored (`#991b1b`) vs DS body (`#b75c5e`) — owner mapping required.  
5. **Radius 8 vs 16** — treated as intentional email adaptation based on kit convention; owner may still want to lock this.  
6. **Mobile title line-height `normal` vs web `1.3`** — export difference; which is canonical for email **NOT VERIFIED**.  
7. **Color Palette duplicate “Status-100” labels** (`#166534` and `#F0FDF4`) — labeling quirk on palette; does not affect Error-200/300 confirmation.

---

## Concise summary table

| Property | Original DS value | Token | Node | Current email | Status |
|----------|-------------------|-------|------|---------------|--------|
| Background | `#fef2f2` | Status-300 | `410:10824` | `#fef2f2` | MATCHES ORIGINAL |
| Border | `#e9c5c6` 1px solid | Hard-coded | `410:10824` | `#e9c5c6` 1px solid | MATCHES ORIGINAL |
| Radius | 16px | Hard-coded | `410:10824` | 8px | INTENTIONAL EMAIL ADAPTATION |
| Padding | 16px | Hard-coded | `410:10824` | 16px | MATCHES ORIGINAL |
| Title color | `#991b1b` | Status-200 | `410:10831` | `#991b1b` on Environment line | MATCHES ORIGINAL (color only) |
| Body color | `#b75c5e` | Hard-coded | `410:10832` | Not used in block | NEEDS OWNER DECISION |
| Title type | PJS 16/600/1.3 | H5 | `410:10831` | Roboto 14/700 in block | UNINTENDED DESIGN DEVIATION |
| Icon | 20px `#991B1B` | Status-200 | `410:10826` | Absent | INTENTIONAL EMAIL ADAPTATION |
| Dismiss | 16px `#991B1B` | Status-200 | `410:10833` | Absent | INTENTIONAL EMAIL ADAPTATION |
| Min-height | — | — | — | — | NOT VERIFIED |

---

## Stop

Read-only extraction complete. No Figma, Email Kit, HTML, token, or production files were modified except this report.
)
