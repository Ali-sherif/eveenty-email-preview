# Account Activation — Evidence-Based Design Decision Review

**Date:** 2026-09-24 (local)  
**Scope:** Four outstanding visual questions for `activate_email` only  
**Mode:** READ-ONLY inspection — no production, Figma, or preview-source mutations  
**Verdict role:** Present evidence for **owner approval**. This report does **not** approve the design.

**Email-client rendering (Gmail / Outlook / Apple Mail):** NOT EXECUTED. Browser/Playwright evidence only.

---

## Label legend

| Label | Meaning |
|---|---|
| **OBSERVED** | Verified in current Figma / code / assets |
| **APPROVED** | Explicit Task 01 owner-approved project decision |
| **PROPOSED** | Email Kit / preview proposal awaiting owner visual approval |
| **LEGACY** | Older paint-style alias or production pattern that may conflict with tokens |
| **UNVERIFIED** | Not confirmed in this pass |

---

## Sources inspected (discovered paths)

### Task 01 deliverables
- `D:\emails\Eveenty-Email-Kit-Phase1\email-kit-v1-spec.md`
- `D:\emails\Eveenty-Email-Kit-Phase1\shared-foundations.json`
- `D:\emails\Eveenty-Email-Kit-Phase1\email-logo-manifest.json`
- `D:\emails\Eveenty-Email-Kit-Phase1\phase-1-email-scope.md`
- `D:\emails\Eveenty-Email-Kit-Phase1\email-qa-checklist.md`

### Active references
- `D:\emails\references\FIGMA_DESIGN_SYSTEM_AUDIT.md`
- `D:\emails\references\FIGMA_COMPONENT_INVENTORY.md`
- `D:\emails\references\figma-design-tokens.json`

### Figma (read-only)
- Original DS: [Eveenty Design System New](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New) — access **OK**
- Email Kit: [Eveenty Email Design Kit](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2) — access **OK**

### Backend (read-only)
- `D:\last\rescounts-backend\email\templates\activate_email.template`
- Related: `password_reset.template`, partials (`header_*`, footers)

### Preview / QA
- Live preview: `http://localhost:54701/` (HTTP 200)
- Preview kit: `D:\last\eveenty-email-preview\shared\email-kit.js`, `tokens.js`, `render-emails.js`
- Remediation QA: `D:\last\eveenty-email-preview\qa-output\task-02-activation\remediation\`

### Other Eveenty repos inspected (relevant only)
- `D:\last\eveenty-control-panel\src\styles\foundation\_tokens.scss`
- `D:\last\eveenty-control-panel\src\components\pages\create-event\shared\forms\EveButton.module.scss`
- `D:\last\eveenty-users-next\styles\main.scss` (brand CSS vars)

### Owner PNG assets
- `D:\emails\English.png`, `french.png`, `Spanish.png`, `Arabic.png`, `Farse.png`

### Not treated as approved decisions
- Older architecture audits under `D:\emails\references\OUTPUT_ARCHITECTURE_AUDIT.md` / Markdown Live Preview PDFs — **proposals only**

---

# Decision 1 — CTA COLOR

**Owner decision needed:** Magenta `#D80073` + white text **vs** Yellow `#E9D023` + dark `#4D4C49` text.  
**Status:** **GENUINELY OPEN** (Email Kit proposes yellow; production uses magenta; both exist as peer Figma button sets).

### Original Figma Design System — OBSERVED

Two peer filled-button component sets exist under Buttons & Input (`1:632` → section `347:2776`):

| Set | Node | Default L fill | Default L text | Geometry |
|---|---|---|---|---|
| **Buttons Primary** | [`354:6328`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=354-6328) / L [`354:6282`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=354-6282) | `#E9D023` (`primary`) | `#4D4C49` (`Dark-500`) | 48px H, 12px radius, 24×13 pad, Roboto Medium 16 |
| **Buttons Magenta** | [`355:536`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=355-536) / L [`355:661`](https://www.figma.com/design/DeMR3FHvQbVJYmwStKivVg/Eveenty-Design-System-New?node-id=355-661) | `#D80073` (`Second`) | `#FFFFFF` (`Light-50`) | Same L geometry; Roboto Medium 16 |

Figma documentation text on the Buttons page (node `534:172`) states variants should be chosen **based on the action’s importance** — it does **not** declare that magenta is secondary or that yellow is the only email CTA.

Token names (**OBSERVED**):
- `primary` = yellow `#E9D023` (node ref `1:3063`)
- `Second` = magenta `#D80073` (node ref `1:2806`)

**Implication:** A visually strong magenta fill is **not** automatically the DS “Primary” button. Conversely, choosing yellow for email CTAs is an alignment with the component named **Buttons Primary**, not a claim that production emails already use it.

Screenshots:
- `screenshots/figma-ds-buttons-primary.png`
- `screenshots/figma-ds-buttons-magenta.png`
- `screenshots/figma-ds-button-primary-L.png`

### Current production Account Activation — LEGACY / OBSERVED

`activate_email.template` lines 41–44:

- CTA fill `#d80073`, text `#ffffff`, radius `6px`, label `font-weight: 600`
- Footer mailto also `#d80073`

Same magenta CTA pattern is widespread in other production templates (registration approval CTAs, dispute accents, links). Auth sibling `password_reset.template` uses a different yellow-tinted shell (`rgb(255,255,220)` / `#fffbe6`) and **does not** use the magenta filled CTA pattern — so Activation’s magenta button is a **template convention**, not a universal auth rule.

### New Email Kit — PROPOSED

Activation frame [`4:2`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2) CTA [`4:14`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-14):

- Fill `#e9d023`, text `#4d4c49`, radius 12px, padding 16×40, **Roboto Bold**
- Spec (`email-kit-v1-spec.md` §8): Primary = yellow; Secondary = outline Dark-500; text links may use Second/magenta sparingly
- Task 01 foundations map `primary` → CTA fill, `Second` → secondary emphasis / link accent

Preview live (2026-09-24): CTA parent bg `rgb(233, 208, 35)`, text `rgb(77, 76, 73)` — matches Email Kit. Footer email link remains magenta (`Second`) in preview — intentional dual-role usage.

Screenshot: `screenshots/figma-email-kit-activation-en-4-2.png`, `screenshots/preview-activation-en-600-browser.png`

### Web corroboration — OBSERVED (naming conflict)

Control panel foundation (`_tokens.scss`):
- `$primary: #e9d023` (brand yellow)
- `$second: #d80073` (brand pink)

`EveButton.module.scss`:
- `.primary` → **magenta** (`$second`) — comment: “Figma Buttons Magenta”
- `.yellow` → **yellow** (`$primary`) — comment: “Figma Buttons Primary”

Users-next CSS vars: `--yellow-color: #E9D023`, `--burgundy-color: #d80073`. Magenta is heavily used for accents/icons; yellow appears on some CTAs/surfaces.

**Conflict:** Web CSS class name `primary` ≠ Figma component name `Buttons Primary`. Do not equate CSS `.primary` with DS Primary without checking.

### Visual comparison & contrast

Isolated side-by-side (same Activation layout):
- `screenshots/compare-cta-magenta.png`
- `screenshots/compare-cta-yellow.png`

| Pair | Ratio (WCAG relative luminance) | AA normal text |
|---|---:|---|
| White on `#D80073` | **~5.04:1** | Pass |
| `#4D4C49` on `#E9D023` | **~5.52:1** | Pass |

Both pass AA for normal text in this computation. Hierarchy: magenta is higher chroma against white; yellow echoes the logo’s yellow “ee” mark and DS Primary naming.

### Options — advantages / limitations

| Option | Advantages | Limitations |
|---|---|---|
| **A. Keep production magenta** | Continuity with live Activation + most transactional CTAs; matches Buttons Magenta + control-panel `.primary`; strong contrast on white | Diverges from Figma component named Primary and Email Kit proposal; mixes “Second” token into the single primary action |
| **B. Adopt Email Kit yellow** | Aligns with Buttons Primary + Task 01 email CTA mapping; brand lockup yellow continuity; slightly higher contrast ratio with dark text | Breaks visual continuity with current production emails until they migrate; yellow can invert awkwardly in auto-dark clients (**design risk only — UNVERIFIED in clients**) |

### Shared-component implications

If yellow is approved for Activation CTA, shared Email Kit `ctaYellow()` / TRANSACTIONAL CTA will likely propagate to the other Transactional reference (`password_reset`) and potentially all single-CTA masters. Magenta would remain for links/accents per Task 01. Approving magenta-as-email-primary would instead diverge Email Kit from Buttons Primary and require rewriting Task 01 CTA semantics.

### Decision status

**OPEN — owner approval required.** Neither option is silently finalized. Email Kit + preview currently show yellow as a **proposal**, not an approved ship decision.

---

# Decision 2 — LOGO SIZE

**Owner decision needed:** Production **120px** vs proposed **~200px** (or intermediate e.g. **160px**).  
**Status:** **PARTIALLY PRE-DECIDED in Task 01 docs as ~200px APPROVED PROJECT DECISION, with explicit “validate visually”** — still needs owner visual confirmation for Activation.

### Original Figma Design System — OBSERVED / UNDOCUMENTED sizing rule

- Logo frames exist (section `1:51`); EN default frame `1:156` ≈ 2958×1208; yellow-bg variants ≈ 3014×1208.
- **No documented email display width, clear-space / exclusion zone, or minimum size rule** found in DS audit (`FIGMA_DESIGN_SYSTEM_AUDIT.md`: “No documented logo exclusion zone…”).
- **UNDOCUMENTED:** official logo-sizing rule for email or web headers beyond raw artboard dimensions.

### Owner PNG assets — OBSERVED (canvas vs content)

| Locale | Canvas | Opaque content box (α>8) | Content H @120 / @160 / @200 CSS width* | Notes |
|---|---|---|---|---|
| EN | 3014×1208 | 2359×772 @ (389,193) | 39.3 / 52.4 / **65.5** | ~13–20% transparent padding |
| FR | 3014×1208 | 2359×800 | 40.7 / 54.3 / **67.8** | Similar padding |
| AR | 3014×1208 | 2359×819 | 41.7 / 55.5 / **69.4** | Similar |
| FA | 3014×1208 | 2359×805 | 40.9 / 54.6 / **68.2** | Similar |
| ES | 2958×1208 | **Full canvas** (0,0)–(2958,1208) | 49 / 65.3 / **81.7** | No transparent margin detected — denser optical fill |

\*Heights above are **content-box** proportions if width-scaled to content; email HTML currently scales the **full canvas** (`height:auto`), so EN display at 200px ≈ **80.16px** total image height (padding included). Data: `logo-content-bounds.json`.

### Production Account Activation — OBSERVED

`activate_email.template` line 21: `width="120"` (no cream header band).  
`password_reset.template` also `width="120"`.  
Other templates vary: `header_4_localized` max-width 150 / 200; footer logos often **76×24**.

### Email Kit / Task 01 — APPROVED (with validate) + PROPOSED geometry

- Spec §4 + `email-logo-manifest.json`: display width **~200px** labeled **APPROVED PROJECT DECISION**, “validate visually”.
- Suggested height ~80px proportional (**PROPOSED EMAIL-SPECIFIC ADAPTATION**).
- Figma Activation logo node `4:8`: **200×80** on header frame `4:7` height **128**.
- Preview: measured **200×80.16**, attr `width="200"`.

### Measurements (isolated identical layout)

| Display width | Img height (canvas scale) | Header band height (32+16 pad + img) |
|---:|---:|---:|
| 120px | 48.09 | **96.09** |
| 160px | 64.13 | **112.13** |
| 200px | 80.16 | **128.16** |

Source: `comparison-measurements.json`. Screenshots:
- Desktop: `compare-logo-120-desktop.png`, `compare-logo-160-desktop.png`, `compare-logo-200-desktop.png`
- Mobile 320: `compare-logo-120-mobile320.png`, `compare-logo-160-mobile320.png`, `compare-logo-200-mobile320.png`
- Locales @200: `compare-logo-locales-200.png`

At **320px** viewport with 16px gutters (content ≈286px), a **200px** logo still fits with side margin; header becomes the tallest element (~128px). Risk is **visual weight / header dominance**, not overflow.

### Options

| Option | Advantages | Limitations |
|---|---|---|
| **120px** | Matches production Activation; quieter header; consistent with password_reset today | Below Task 01 ~200 decision; weaker brand presence; logo tagline harder to read |
| **160px** | Compromise weight; undocumented middle | Neither production nor Task 01 target; still needs owner call |
| **200px** | Matches Task 01 + Email Kit + current preview/Figma; readable tagline | Tallest header (~128px); ES may look optically heavier (no canvas padding); may feel large vs body on mobile |

### Decision status

Task 01 documents **~200px as APPROVED PROJECT DECISION pending visual validation**. For Activation shipping sign-off, treat as **owner visual confirmation still required** (remediation QA also lists it open). Clear-space rule remains **UNDOCUMENTED**.

---

# Decision 3 — HEADER BACKGROUND

**Owner decision needed:** Canonical **primary-50 `#FEFDF4`** vs **white `#FFFFFF`** (vs other documented surfaces).  
**Status:** **OPEN** for Activation; Email Kit proposes cream band; production is flat white container.

### Original Figma Design System — OBSERVED

| Token | Hex | Role |
|---|---|---|
| `primary-50` **variable** | `#FEFDF4` | Canonical soft primary tint (node `1:3098`) |
| Local paint style also named `primary-50` | `#FCF9DF` | **LEGACY COMPATIBILITY** — must not be collapsed into the variable |
| `Light-50` | `#FFFFFF` | Default white surface |
| `Light-100` | `#F9F9F9` | Soft outer viewport gray |

Task 01 `shared-foundations.json` + spec §3.4: use **canonical `#FEFDF4`** for optional header bands; retain `#FCF9DF` only when matching legacy style-bound artwork.

### Production Account Activation — OBSERVED

- Outer body `#f5f5f5` (near Light-200)
- Inner container `#ffffff`
- Logo cell: **no background** (transparent on white) — effectively white header

Other production patterns (not Activation):
- `password_reset`: yellow-ish shells `rgb(255,255,220)` / `#fffbe6` (**LEGACY**, not primary-50)
- `header_3_both_dirs`: `rgb(250, 255, 222)` behind logo (**LEGACY**, not canonical)

### Email Kit / preview — PROPOSED

- Figma header frame `4:7`: `bg-[#fefdf4]` (**OBSERVED** via design context)
- Preview `brandedHeader()`: `background-color:${T.primary50}` → `#fefdf4`
- Live computed: `rgb(254, 253, 244)` — **confirmed**

Screenshots:
- `compare-header-primary50.png`
- `compare-header-white.png`
- `compare-header-legacy-fcf9df.png` (shown only to distinguish alias)
- `preview-activation-en-800-email.png`

### Behavior with transparent logos

All five owner PNGs are 32bpp ARGB. On `#FEFDF4`, dark charcoal wordmark + yellow “ee” read cleanly. On white, also readable but **no separation** from body. On legacy `#FCF9DF`, slightly stronger yellow cast — **not recommended** for new kit per Task 01.

Blocked-images: cream band still provides brand tint when logo fails (preview remediation covered blocked-image path).

### Auto-inversion (design consideration only)

Cream `#FEFDF4` and yellow fills may invert in some clients’ dark modes — **UNVERIFIED** for Gmail/Outlook/Apple Mail. Treat as risk annotation, not a compatibility claim.

### Options

| Option | Advantages | Limitations |
|---|---|---|
| **`#FEFDF4` primary-50** | Canonical DS variable; separates header from white body; matches Email Kit/Figma/preview | Differs from production Activation; subtle — some may not notice |
| **`#FFFFFF`** | Matches production Activation flat shell; maximum “minimal transactional” look | No header/body separation; weaker brand surface cue |
| **`#FCF9DF` legacy** | Only if matching old paint-bound art | Explicitly **not** for new Email Kit consumers |
| **Other Light-\*** | Documented neutrals exist | Not proposed for Activation header in Email Kit |

### Decision status

**OPEN.** Prefer framing as: approve **canonical primary-50 `#FEFDF4`** or keep **white**. Do **not** approve `#FCF9DF` by accident.

---

# Decision 4 — HEADING FONT WEIGHT

**Owner decision needed:** **SemiBold 600** vs **Bold 700**.  
**Status:** **OPEN** — Figma DS + Email Kit use 600; preview HTML uses 700; production uses 600 at a different size.

### Original Figma Design System — OBSERVED

From `figma-design-tokens.json` / foundations:

| Style | Family | Weight | Size |
|---|---|---:|---:|
| **H1** | Plus Jakarta Sans | **700** | 32 |
| **H2** | Plus Jakarta Sans | **600** | 24 |
| H3–H5 | Plus Jakarta Sans | **600** | 20–16 |

Email title mapping in Task 01 starts from **H2/H3** (20–24px) → expected **600**, not H1’s 700.

### Email Kit Figma — OBSERVED

Activation heading node [`4:10`](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-10):

- Export: `font-['Plus_Jakarta_Sans:SemiBold']` / `font-semibold` → **600**
- Size **24px**, color `#2b2a28`

### Production Account Activation — OBSERVED

`activate_email.template` line 26:

- `font-size: 28px; font-weight: 600;` color `#0d1731`
- Stack: Arial/Helvetica (no Plus Jakarta)

So production weight is already **600**, at a larger size and different color/family.

### Current HTML preview — PROPOSED divergence

`render-emails.js` Activation h1: `font-weight:700` at 24px Plus Jakarta Sans.  
Live computed: **`fontWeight: "700"`**.

Remediation QA already flagged this as **COSMETIC / owner call**.

### Visual comparison (identical frames + real locale strings)

- `screenshots/compare-heading-weight-600.png`
- `screenshots/compare-heading-weight-700.png`

Includes EN/FR/ES + AR/FA (Tahoma) + Arial fallback without Plus Jakarta.

### Fallback effects

| Condition | 600 | 700 |
|---|---|---|
| Plus Jakarta loads | Matches DS H2 / Email Kit | Heavier than Figma frame |
| Falls back to Arial/Helvetica | SemiBold may synthesize; still lighter | Bold more reliably available; stronger |
| AR/FA Tahoma stack | Bold-ish synthesis; both usable | Slightly heavier; Farsi “Eveenty” Latin mix still fine |

### Options

| Option | Advantages | Limitations |
|---|---|---|
| **600 SemiBold** | Matches original DS H2 + Email Kit Figma + production weight intent | Preview must change to match Figma if chosen |
| **700 Bold** | Stronger when web fonts blocked; matches preview today + DS H1 weight | Diverges from Email Kit editable frame and H2 token; heavier than production’s 600 |

### Decision status

**OPEN.** Clearest token-aligned choice for a 24px email title is **600 (H2)**; **700** is an email-preview adaptation unless owner prefers H1 emphasis.

---

## Preview HTML vs editable Figma frames (Activation)

| Aspect | Figma `4:2` | Live preview `localhost:54701` | Match? |
|---|---|---|---|
| Yellow CTA `#E9D023` / `#4D4C49` | Yes | Yes | Yes |
| Logo ~200×80 | Yes | Yes (200×80.16) | Yes |
| Header `#FEFDF4` | Yes | Yes (`rgb(254,253,244)`) | Yes |
| Heading weight | **SemiBold 600** | **Bold 700** | **No — open decision** |
| Heading size | 24px | 24px | Yes |
| CTA label weight | Roboto Bold | 700 | Close (Bold) |
| Copy EN | YAML-aligned | YAML-aligned | Yes |
| Footer link color | Magenta accent (typical) | Magenta | Yes |
| Approval state | Design proposal | DRAFT — not approved | Both await owner |

Screenshot evidence: `figma-email-kit-activation-en-4-2.png` vs `preview-activation-en-600-browser.png` / `preview-activation-en-800-email.png`.

---

## Shared-component implications (beyond Activation)

| Decision | Shared impact if approved |
|---|---|
| Yellow primary CTA | `ctaYellow` / TRANSACTIONAL CTA component → password_reset + all single-CTA masters; magenta retained for links (`Second`) |
| Magenta primary CTA | Requires rewriting Email Kit CTA semantics away from Buttons Primary; closer to today’s backend templates |
| Logo ~200px | `brandedHeader()` width propagates to all masters using shared header |
| Header `#FEFDF4` | Shared header band token; commerce/notification headers inherit |
| Heading 600 vs 700 | Shared title style for TRANSACTIONAL (and likely other masters’ H1/H2 roles) |

Do **not** start Commerce / Notification / Marketing / remaining catalog until Activation visual decisions are owner-approved (Task 01 sequence).

---

## Comparison table

| Decision | Original DS | Production email | Current Email Kit | Evidence gaps | Owner approval needed |
|---|---|---|---|---|---|
| **1. CTA color** | Peer sets: **Buttons Primary = yellow**; **Buttons Magenta = magenta** | Magenta `#d80073` + white; radius 6 | Yellow `#E9D023` + `#4D4C49`; radius 12 | Client auto-inversion of yellow/magenta **UNVERIFIED**; no written rule which set wins for email | **Yes — A magenta vs B yellow** |
| **2. Logo size** | Artboards ~2958–3014×1208; **email size rule UNDOCUMENTED** | `width="120"` | ~**200×80**; Task 01 ~200 **APPROVED w/ visual validate** | Official clear-space **UNDOCUMENTED**; ES denser optical fill | **Yes — confirm 120 / 160 / 200** |
| **3. Header background** | `primary-50` variable `#FEFDF4`; Light-50 `#FFF`; legacy paint `#FCF9DF` | White container; no cream band | `#FEFDF4` band | Real client dark-mode inversion **UNVERIFIED** | **Yes — `#FEFDF4` vs `#FFFFFF`** (avoid `#FCF9DF`) |
| **4. Heading weight** | H2 **600** @24; H1 **700** @32 | **600** @28px Arial | Figma **600** @24; preview HTML **700** | Font fallback synthesis varies by client | **Yes — 600 vs 700** |

---

## Artifact index (this review)

Directory: `D:\last\eveenty-email-preview\qa-output\task-02-activation\design-decision-review\`

| File | Purpose |
|---|---|
| `DESIGN_DECISIONS_REPORT.md` | This report |
| `comparisons.html` | Isolated option frames (QA only) |
| `comparison-measurements.json` | Logo header heights + contrast |
| `logo-content-bounds.json` | Opaque artwork bounds for 5 PNGs |
| `preview-live-measurements.json` | Live computed preview styles |
| `capture-comparisons.mjs` / `measure-preview.mjs` | Capture scripts (QA only) |
| `screenshots/*` | Figma, preview, and side-by-side comparisons |

---

## Stop gate

- No backend, Figma, production template, YAML, or shared preview-source edits in this task.
- No Commerce / Notification / Marketing / remaining 44–47 catalog work started.
- **No owner visual approval claimed.**

**Awaiting owner decisions on all four questions above.**
