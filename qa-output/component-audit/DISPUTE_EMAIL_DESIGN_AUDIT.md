# Dispute Email — Warning Alert Design Audit (Read-Only)

**Date:** 2026-09-25  
**Template:** `dispute_notification`  
**Skills followed:** `review-email`, `email-context`  
**Companion specs:** `WARNING_ALERT_DESIGN_SYSTEM_SPEC.md`, `ERROR_ALERT_DESIGN_SYSTEM_SPEC.md`, `STATUS_ALERT_COMPONENT_PROPOSAL.md`

**Hard restrictions honored:** No Figma edits · No HTML/token/component edits · No backend/production edits · No commits · No design of undesigned templates.

**Evidence grades:** Verified = inspected live this session · Reported = prior docs · NOT VERIFIED = inaccessible.

---

## Catalog / traceability (email-context)

| Field | Value | Evidence |
|-------|-------|----------|
| `template_id` | `dispute_notification` | `catalog/email-catalog.json` |
| Scope / design | `IN_SCOPE` · `DESIGNED` | CLI `email-cli.mjs context` |
| Backend family | Workflow/Status | Catalog |
| Design Kit family | NOTIFICATION | Catalog |
| Production path | `email/templates/dispute_notification.template` | Catalog + file read |
| Figma EN | `72:44` | Catalog · [EN frame](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=72-44) |
| Figma AR | `72:111` | [AR frame](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=72-111) |
| Preview HTML | `emails/dispute_notification.html` | Exists |
| Shared renderer | `shared/render-emails.js` → `renderDispute` + `statusAlertWarning` | Verified |
| Production state audited | **Needs Response / New Dispute** (Warning) | Figma/HTML title “New Dispute Alert”; production helper uses `#fff3cd` for this status |

**Status semantics note (verified):** Production `GetDisputeEmailContent` also sends Under Review / Won / Lost with the **same** yellow `AlertColor: #fff3cd`. This audit covers the **designed New Dispute** reference only. Do **not** auto-map Won→Warning or Lost→Warning in a future component — see proposal.

---

## PHASE 1 — Source component (summary)

Full extraction: `WARNING_ALERT_DESIGN_SYSTEM_SPEC.md`.

| Item | Value |
|------|-------|
| Selected node | `410:10812` Web Warning |
| Direct URL | https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=410-10812&m=dev |
| BG | `#fffbeb` / **Status-700** |
| Border | `#e6d1b9` 1px solid (hard-coded) |
| Radius | 16px |
| Padding / gaps | 16 / 8 / 8 |
| Title | PJS 16/600/1.3 · `#92400e` / **Status-600** |
| Body | Roboto 16/400/1.4 · `#ad6f45` (hard-coded) |
| Icon | `material-symbols:info-outline-rounded` 20×20 · `#92400E` |
| Dismiss | 16×16 X · Status-600 |

---

## PHASE 2 — Current Dispute email inventory

### 2.1 Figma EN — Status Alert (`72:53` / inner `72:54`)

| Property | Verified value | Node |
|----------|----------------|------|
| Outer section pad | pt 8 / pb 16 / px 30 | `72:53` |
| Background | `#fffbeb` | `72:54` |
| Border | `1px solid #fde68a` | `72:54` |
| Radius | `8px` | `72:54` |
| Padding | `20px` | `72:54` |
| Title↔body gap | `12px` | `72:54` |
| Title | Inter SemiBold 18 · `#856404` · “⚠️ New Dispute Alert” | `72:55` |
| Body | Inter Medium 15 · `#856404` (entire paragraph same color) | `72:56` |
| Leading DS icon | **Absent** (emoji in title string only) | — |
| Dismiss | Absent | — |

### 2.2 Figma AR — Status Alert (`72:120` / inner `72:121`)

| Property | Verified value | Node |
|----------|----------------|------|
| Colors / pad / radius / border | Same as EN (`#fffbeb` / `#fde68a` / 8 / 20 / `#856404`) | `72:121` |
| Alignment | `text-right` | `72:121` |
| Title | `⚠️ تنبيه: نزاع جديد` | `72:122` |
| Body | Arabic + Latin event name; same `#856404` | `72:123` |
| Font | Inter (same as EN) | — |

### 2.3 Figma EN — Event Information (`72:57` / `72:58`)

| Property | Verified value | Node |
|----------|----------------|------|
| Background | `#f9f9f9` | `72:58` |
| Yellow accent bar | **Absent** in Figma | — |
| Padding | `20px` | `72:58` |
| Gap | `10px` | `72:58` |
| Heading | Inter SemiBold 17 · `#2b2a28` | `72:59` |
| Body line | Inter Regular 15 · `#4d4c49` (event name **not** yellow) | `72:60` |

AR Event Information (`72:124` / `72:125`): same neutrals; `text-right`; Arabic labels.

### 2.4 Figma EN — What Happens Next (`72:97` / `72:98`)

| Property | Verified value |
|----------|----------------|
| BG / border | `#fdf2f8` / `#fbcfe8` |
| Text | `#d80073` title + body |
| Radius / pad | 8px / 20px |
| Role | Magenta info panel — **not** a Warning alert |

### 2.5 Figma EN — CTA (`72:101` / `72:102`)

| Property | Verified value |
|----------|----------------|
| Background | `#e9d023` |
| Label color | `#4d4c49` |
| Label | “View Payment in Stripe” · Roboto Medium 16 |
| Radius / pad | 12px · py 13 / px 24 · min-h 48 |
| AR frame | **No CTA block** in `72:111` (matches conditional payment-link behavior) |

### 2.6 Local HTML preview (`emails/dispute_notification.html`)

| Instance | Actual styles | Notes |
|----------|---------------|-------|
| Warning alert table | bg `#fffbeb`; border `1px solid #fde68a`; radius `8px`; pad `20px` | Matches Figma alert chrome |
| Alert title | 18/600/`#856404` + emoji | Matches Figma color; font stack Arial/Roboto (not Inter) |
| Alert body | 15/500/`#856404` | Matches Figma body color |
| **Event name in alert** | `#e9d023` / weight 700 | **Present in HTML; not in Figma Status Alert body** |
| Event Information card | bg `#f9f9f9`; **`border-left: 4px solid #e9d023`** | **Accent bar in HTML; absent in Figma** |
| Event name in card | `#e9d023` / 700 | **HTML only vs Figma `#4d4c49`** |
| What Happens Next | `#fdf2f8` / `#fbcfe8` / `#d80073` | Matches Figma |
| Evidence Due value | `#d80073` / 700 | HTML table |
| Table header | bg `#e9d023`; text `#2b2a28` | HTML |
| CTA | **Absent** in static HTML | Matches default variant without payment link; Figma EN shows with-link sample |
| Signoff team | `#e9d023` | HTML |
| Shared helper | `statusAlertWarning` in `shared/email-kit.js` | Same `#fffbeb`/`#fde68a`/`#856404` |

### 2.7 Figma ↔ HTML match matrix

| Element | Figma | HTML | Match? |
|---------|-------|------|--------|
| Alert BG `#fffbeb` | Yes | Yes | **MATCH** |
| Alert border `#fde68a` | Yes | Yes | **MATCH** |
| Alert radius 8 | Yes | Yes | **MATCH** |
| Alert text `#856404` | Yes | Yes | **MATCH** |
| Alert fonts Inter vs kit fonts | Inter | PJS/Roboto/Arial | **MISMATCH** (family) |
| Event name yellow in alert body | No (uniform `#856404`) | Yes `#e9d023` | **IMPLEMENTATION MISMATCH** |
| Event Info yellow left bar | No | Yes | **IMPLEMENTATION MISMATCH** |
| Event name yellow in Event Info | No (`#4d4c49`) | Yes `#e9d023` | **IMPLEMENTATION MISMATCH** |
| CTA yellow/`#4d4c49` | EN yes | Static HTML no (conditional) | **MATCH** for default; EN canvas shows optional CTA |
| AR RTL alignment | Yes | Static HTML is `lang=en` LTR only | Preview AR via renderer variants — static file is EN |

### 2.8 Production template (read-only context — not Design Kit source of truth)

| Property | Production value |
|----------|------------------|
| Alert BG | `{{.AlertColor}}` → `#fff3cd` for Needs Response |
| Alert border | `#ffeaa7` |
| Alert text | `#856404` |
| Event name highlight | `#E8CF21` bold |
| Event Info accent | `4px solid #E8CF21` |
| CTA (when link) | `#E8CF21` bg / `#292929` text |

Design Kit preview deliberately moved toward Status-700 `#fffbeb` and primary `#e9d023`, but kept production-like `#856404` text and yellow event-name emphasis.

---

## PHASE 3 — Accessibility (calculated WCAG contrast)

Method: relative luminance per WCAG 2.x; AA = **4.5:1** normal text · **3:1** large text · **3:1** non-text UI (borders/icons against adjacent colors).

**Large-text note:** Email alert title is 18px / 600. WCAG large text typically requires ~18.67px+ bold or ~24px+. Treat **18px/600 as normal text** (need 4.5:1) unless owner locks large-text treatment.

### 3.1 Warning heading / background

| Pair | Ratio | AA | Verdict |
|------|-------|----|---------|
| DS title `#92400e` on `#fffbeb` | **6.84:1** | 4.5 | **PASS** |
| Email/Figma `#856404` on `#fffbeb` | **5.30:1** | 4.5 | **PASS** |
| Production `#856404` on `#fff3cd` | **4.96:1** | 4.5 | **PASS** |

### 3.2 Warning body / background

| Pair | Ratio | AA | Verdict |
|------|-------|----|---------|
| DS body `#ad6f45` on `#fffbeb` | **3.94:1** | 4.5 | **FAIL** |
| Email/Figma body `#856404` on `#fffbeb` | **5.30:1** | 4.5 | **PASS** |
| Production body `#856404` on `#fff3cd` | **4.96:1** | 4.5 | **PASS** |

### 3.3 Highlighted event name / background

| Pair | Ratio | AA | Verdict |
|------|-------|----|---------|
| HTML `#e9d023` on alert `#fffbeb` | **1.50:1** | 4.5 | **FAIL** |
| HTML `#e9d023` on Event Info `#f9f9f9` | **1.48:1** | 4.5 | **FAIL** |
| HTML `#e9d023` on `#ffffff` | **1.55:1** | 4.5 | **FAIL** |
| Production `#E8CF21` on `#fff3cd` (approx same family) | **~1.40:1** | 4.5 | **FAIL** |

This is the primary uncomfortable / low-contrast yellow-text problem.

### 3.4 Event Information labels / values

| Pair | Ratio | AA | Verdict |
|------|-------|----|---------|
| Heading `#2b2a28` on `#f9f9f9` | **13.62:1** | 4.5 | **PASS** |
| Value `#4d4c49` on `#f9f9f9` (Figma) | **8.16:1** | 4.5 | **PASS** |
| Value `#e9d023` on `#f9f9f9` (HTML) | **1.48:1** | 4.5 | **FAIL** |

### 3.5 CTA label / button background

| Pair | Ratio | AA | Verdict |
|------|-------|----|---------|
| `#4d4c49` on `#e9d023` | **5.52:1** | 4.5 | **PASS** |

Preserve approved primary CTA: `#E9D023` + `#4D4C49`.

### 3.6 Other meaningful pairs

| Pair | Ratio | AA | Verdict |
|------|-------|----|---------|
| Magenta next-steps `#d80073` on `#fdf2f8` | **4.62:1** | 4.5 | **PASS** |
| Evidence due `#d80073` on white | **5.04:1** | 4.5 | **PASS** |
| Table header `#2b2a28` on `#e9d023` | **9.23:1** | 4.5 | **PASS** |
| Signoff team `#e9d023` on white | **1.55:1** | 4.5 | **FAIL** |

### 3.7 Non-text contrast (borders)

| Pair | Ratio | AA non-text 3:1 | Verdict |
|------|-------|-----------------|---------|
| DS border `#e6d1b9` on `#fffbeb` | **1.43:1** | 3.0 | **FAIL** |
| DS border `#e6d1b9` on white | **1.48:1** | 3.0 | **FAIL** |
| Email border `#fde68a` on `#fffbeb` | **1.20:1** | 3.0 | **FAIL** |
| Email border `#fde68a` on white | **1.25:1** | 3.0 | **FAIL** |

Borders are decorative chrome; fail WCAG non-text if treated as required UI boundaries. **NEEDS OWNER DECISION** whether alert identity may rely on bg + text alone (acceptable for email) or needs a stronger border/accent (≥3:1).

---

## PHASE 4 — Compare and classify

| Property | Original DS | Email Kit Figma | HTML preview | Classification |
|----------|-------------|-----------------|--------------|----------------|
| Alert BG `#fffbeb` / Status-700 | Yes | Yes | Yes | **MATCHES ORIGINAL** (token) |
| Alert border color | `#e6d1b9` | `#fde68a` | `#fde68a` | **UNINTENDED DESIGN DEVIATION** (vs DS) · production-like amber |
| Border width 1px solid | Yes | Yes | Yes | **MATCHES ORIGINAL** |
| Radius | 16px | 8px | 8px | **INTENTIONAL EMAIL ADAPTATION** (kit-wide 8px) |
| Padding | 16px | 20px | 20px | **INTENTIONAL EMAIL ADAPTATION** (or unintended — **NEEDS OWNER DECISION**) |
| Title↔body gap | 8px | 12px | 12px (margin) | **INTENTIONAL EMAIL ADAPTATION** / **NEEDS OWNER DECISION** |
| Title color | Status-600 `#92400e` | `#856404` | `#856404` | **UNINTENDED DESIGN DEVIATION** (legacy Bootstrap warning text; accessible but not DS token) |
| Body color | `#ad6f45` (AA **FAIL**) | `#856404` (AA PASS) | `#856404` | **INTENTIONAL EMAIL ADAPTATION** relative to AA · still not Status-600 |
| Title type PJS 16/600 | DS | Inter 18/600 | 18/600 kit fonts | **UNINTENDED DESIGN DEVIATION** (Inter) + size adaptation |
| Body type Roboto 16/400 | DS | Inter 15/500 | 15/500 | **UNINTENDED DESIGN DEVIATION** |
| Leading icon 20px Status-600 | DS info-outline | Emoji only | Emoji only | **INTENTIONAL EMAIL ADAPTATION** (client-safe) |
| Dismiss control | Yes | No | No | **INTENTIONAL EMAIL ADAPTATION** |
| Event name as primary yellow text | N/A | Not in Figma alert | Yes `#e9d023` | **ACCESSIBILITY FAILURE** + **IMPLEMENTATION MISMATCH** (HTML≠Figma) |
| Event Info accent bar primary | N/A | Absent | Present | **IMPLEMENTATION MISMATCH** · accent may be intentional brand — **NEEDS OWNER DECISION** |
| Event Info value color | N/A | `#4d4c49` PASS | `#e9d023` FAIL | **ACCESSIBILITY FAILURE** (HTML) · Figma **PASS** |
| CTA `#e9d023`/`#4d4c49` | N/A (app buttons differ) | Yes | Conditional | **MATCHES** approved Email Kit CTA · **PASS** AA |
| Production BG `#fff3cd` | Differs from Status-700 | Kit uses Status-700 | Kit uses Status-700 | **NEEDS OWNER DECISION** (kit vs production AlertColor) |
| Treat all dispute statuses as Warning | Showcase: potential issues | New Dispute only designed | Needs Response sample | Designed state = Warning **OK**; Won/Lost must not inherit Warning — **NEEDS OWNER DECISION** for multi-status |

---

## PHASE 5 — Proposed corrections (BEFORE / PROPOSED)

**Do not implement.** Owner review only. Prefer existing DS tokens that pass AA. Preserve CTA `#E9D023` / `#4D4C49`.

### 5.1 New Dispute Warning Alert

| Slot | BEFORE (current Kit/HTML) | PROPOSED | Why |
|------|---------------------------|----------|-----|
| Background | `#fffbeb` | Keep `#fffbeb` (**Status-700**) | Matches DS · AA surface OK |
| Border | `#fde68a` | Prefer DS `#e6d1b9` **or** keep amber if owner wants warmer email chrome | Align to DS; note both fail 3:1 non-text |
| Radius | 8px | Keep 8px | Email adaptation |
| Padding | 20px | **16px** (DS) or keep 20 with owner lock | Prefer DS unless email density needs 20 |
| Title color | `#856404` | **`#92400e` (Status-600)** | DS token · **6.84:1** PASS |
| Body color | `#856404` | **`#92400e` (Status-600)** — do **not** use DS `#ad6f45` | DS body **3.94:1 FAIL**; Status-600 is existing accessible token |
| Title type | Inter 18/600 | Plus Jakarta Sans **16 or 18**/600 | Drop Inter; 18 is OK email hierarchy if owner prefers |
| Body type | Inter 15/500 | Roboto **15–16**/400 | Match DS weight tier |
| Icon | Emoji ⚠️ | Keep emoji **or** optional hosted 20px info-outline Status-600 | Email-safe; DS uses info-outline not triangle |
| Dismiss | Absent | Keep absent | Email-safe |

### 5.2 Event Information Card

| Slot | BEFORE (HTML) | BEFORE (Figma) | PROPOSED |
|------|---------------|----------------|----------|
| BG | `#f9f9f9` | `#f9f9f9` | Keep `#f9f9f9` / `light100` |
| Left/right accent | `4px #e9d023` | None | **NEEDS OWNER DECISION:** keep brand accent bar (decorative) **or** match Figma flat card |
| Heading | `#2b2a28` 17/600 | Same | Keep |
| Body label + value | value `#e9d023` | whole line `#4d4c49` | Use **`#4d4c49`** (or heading `#2b2a28` for name emphasis) — **not** primary yellow |

### 5.3 Event name and highlighted values

| Slot | BEFORE | PROPOSED | Contrast |
|------|--------|----------|----------|
| Event name in alert | `#e9d023` on `#fffbeb` | Status-600 `#92400e` **or** heading `#2b2a28` + weight 700 | ≥6.84:1 / 13.83:1 |
| Event name in Event Info | `#e9d023` on `#f9f9f9` | `#2b2a28` or `#4d4c49` + 700 | PASS |
| Evidence due | `#d80073` | Keep (PASS) | 5.04:1 |
| Signoff team yellow | `#e9d023` on white | Prefer `#2b2a28` or secondary magenta — **NEEDS OWNER DECISION** | Current **FAIL** |

**Limitation of existing palette:** Primary brand yellow `#e9d023` / `#E8CF21` cannot be used as **text** on light surfaces and pass AA. No new invented yellow text token is proposed — use Status-600 / heading / body neutrals for text; reserve primary yellow for **fills** (CTA, table header, accent bars).

### 5.4 Relevant CTA buttons

| Slot | BEFORE | PROPOSED |
|------|--------|----------|
| Primary View Payment | `#e9d023` bg · `#4d4c49` text | **Keep unchanged** (approved · **5.52:1 PASS**) |
| Conditional visibility | Show when payment link present | Keep production behavior |

### 5.5 Arabic RTL variant

| Slot | BEFORE | PROPOSED |
|------|--------|----------|
| Alert colors | Same as EN | Same corrections as EN (mirrored) |
| Alignment | `text-right` / `dir=rtl` | Keep |
| Fonts | Inter in Figma | Align to kit RTL stack (Tahoma-first body) when implementing |
| CTA | Absent on AR canvas | Keep conditional; do not invent AR-only CTA |
| Event name bidi | Latin name in Arabic sentence | Keep `<bdi>` / `dir=auto`; fix **color** only |

---

## Review status (review-email skill)

| Check | Result |
|-------|--------|
| Production mapping / content roles | **PASS** (Needs Response Warning reference; conditional CTA preserved in design intent) |
| Token / DS parity for Warning chrome | **FAIL** (border, title/body tokens, typography family, event-name yellow) |
| Figma ↔ HTML parity | **FAIL** (event name + Event Info accent) |
| RTL AR frame inspect | **PASS** inspected; color issues mirror EN |
| Accessibility AA for critical pairs | **FAIL** (yellow event-name text; DS body token if adopted raw; signoff yellow; optional border non-text) |
| Owner visual approval | **NOT RUN** / pending (do not advance) |

**Overall audit verdict:** **FAIL** — actionable diffs above; corrections proposed for owner review only.

---

## Stop

Read-only audit complete. Reports only under `qa-output/component-audit/`. No design or code mutations.
