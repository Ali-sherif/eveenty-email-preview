# Task 02 — Independent Visual QA Report
## Account Activation only (`activate_email`)

**Date:** 2026-09-23 (local) / testedAt `2026-09-23T21:34:37.841Z`  
**Verdict for owner:** **NOT READY to approve as complete across all five locales.**  
EN desktop/mobile variants are visually close to Figma and usable for owner review, but FR/ES cannot be inspected in the preview, and AR/FA have material logo + copy gaps.  
**This report does NOT approve the design on behalf of the owner.**

**Email-client rendering (Gmail / Outlook / Apple Mail): NOT EXECUTED.** Browser/Playwright screenshots only.

---

## 1. Test environment

| Item | Value |
|------|--------|
| Preview URL | `http://localhost:54701/` (already running; HTTP 200) |
| Documented start command | `npm start` → `npx --yes serve -p 4173 .` (README). Port **54701** was the live instance used for this QA (same app). |
| Browser tools used | **Playwright Chromium (headless)** for matrix capture + DOM measurements; **Cursor IDE browser + CDP** for independent spot-check of EN @ 800 |
| Capture script | `qa-output/task-02-activation/capture-qa.mjs` (QA-only; does not modify email templates) |
| Measurements | `qa-output/task-02-activation/measurements.json` |
| Figma | Accessible — node `4:2` (`Activation / Desktop / EN / LTR / 800`) compared |
| Backend | Read-only parity vs `email/templates/activate_email.template` + `pkg/locales/translations/email/{en,ar,fa,fr,es}.yaml` |

---

## 2. Matrix results

| Variant | Viewport | Locale | Status | Screenshot |
|---------|----------|--------|--------|------------|
| Desktop EN | 800 | en | **PASS** (with owner decisions below) | `screenshots/desktop-en-800.png` |
| Desktop FR | 800 | fr | **BLOCKED** | — locale missing from preview |
| Desktop ES | 800 | es | **BLOCKED** | — locale missing from preview |
| Desktop AR RTL | 800 | ar | **NEEDS REVIEW** | `screenshots/desktop-ar-800.png` |
| Desktop FA RTL | 800 | fa | **NEEDS REVIEW** | `screenshots/desktop-fa-800.png` |
| Tablet EN | 768 | en | **PASS** | `screenshots/tablet-en-768.png` |
| Mobile EN | 414 | en | **PASS** | `screenshots/mobile-en-414.png` |
| Mobile EN | 375 | en | **PASS** | `screenshots/mobile-en-375.png` |
| Mobile EN | 320 | en | **NEEDS REVIEW** | `screenshots/mobile-en-320.png` (CTA wraps) |
| Mobile AR RTL | 375 | ar | **NEEDS REVIEW** | `screenshots/mobile-ar-375.png` |
| Mobile FA RTL | 320 | fa | **NEEDS REVIEW** | `screenshots/mobile-fa-320.png` |
| Images blocked | 600 | en | **PASS** (simulation) | `screenshots/images-blocked-en-600.png` |
| Long-copy fixture | 320 | en | **PASS** (stress fixture) | `screenshots/long-copy-en-320.png` |

Also saved:
- Stage captures: `*-stage.png`
- Cursor browser spot-check: `browser-activate-en-800-full.png`
- Figma reference export: `figma-activate-en-desktop-800.png`

**Preview locale control actually offers only:** `en`, `ar`, `fa` (confirmed in DOM `#localeSelect`).

---

## 3. Key DOM / CSS measurements (Playwright)

### EN @ 800
| Metric | Measured |
|--------|----------|
| Email container width | **600.00px** (`max-width: 600px`) |
| Logo display | **200 × 80.16px**; natural **3014 × 1208** (matches owner `English.png`) |
| CTA clickable box | **236.78 × 51.19px** (≥ 44×44) |
| CTA parent background | `rgb(233, 208, 35)` = **#E9D023** |
| CTA text color | `rgb(77, 76, 73)` = **#4D4C49** |
| CTA href | `https://example.com/preview/activate` (**mock**, not production activation) |
| Horizontal overflow | **none** (`bodyScrollWidth === bodyClientWidth`) |
| Hidden preheader | Present: `Activate your Eveenty account to get started.` |
| Visible `Preheader:` row inside email | **Absent** |
| Preview annotation | Outside iframe chrome (correct) |
| Heading stack | `"Plus Jakarta Sans", Arial, Helvetica, sans-serif` — `font-weight: 700` |
| Body stack | `Roboto, Arial, Helvetica, Tahoma, sans-serif` |
| Fonts available in this Chromium | Plus Jakarta Sans **true**; Roboto **true** (machine-dependent; email clients still untested) |

### Narrow EN @ 320
| Metric | Measured |
|--------|----------|
| Container width | **286px** (fluid; 16px outer gutter each side) |
| CTA | **226 × 70.38px** — label wraps to **two lines** (“Activate My” / “Account”) |
| Overflow | **none** |

### AR @ 800
| Metric | Measured |
|--------|----------|
| `html` | `lang=ar` `dir=rtl` |
| Font stack | Tahoma-first (as intended for RTL) |
| Logo | **200 × 81.58px**; natural **782 × 319** only |
| Logo src | `./assets/logos/eveenty-logo-ar.png` |
| CTA | **187.5 × 51.19px** |

### Contrast (WCAG relative luminance, hex calc)
| Pair | Ratio | AA normal text |
|------|-------|----------------|
| CTA `#4D4C49` on `#E9D023` | **~5.52:1** | Pass |
| Body `#4D4C49` on `#FFFFFF` | **~8.59:1** | Pass |
| Heading `#2B2A28` on `#FFFFFF` | **~14.34:1** | Pass |

---

## 4. Issues by severity

### BLOCKER
1. **FR and ES Activation cannot be visually QA’d in the running preview.**  
   - `#localeSelect` has no `fr` / `es`.  
   - No FR/ES logo files under `assets/logos/` (owner PNGs exist at `D:\emails\french.png`, `D:\emails\Spanish.png`).  
   - Backend YAML for FR/ES exists and is unused by preview.  
   - **Evidence:** Playwright enumeration; filesystem listing; blocked matrix rows.

### MAJOR
2. **AR/FA header logos are not the owner-prepared PNGs.**  
   - Owner AR/FA: **3014×1208**, ~89–94 KB.  
   - Preview AR/FA: **782×319**, ~29–30 KB, different SHA256 vs owner files.  
   - EN preview **does** match owner `English.png` (same hash).  
   - Violates Phase-1 logo policy (“use exactly five owner-prepared PNGs”). Optical weight parity across five logos cannot be signed off.  
   - Refs: `shared/email-kit.js` `logoUrl()`, `assets/logos/eveenty-logo-{ar,fa}.png`, `D:\emails\Eveenty-Email-Kit-Phase1\email-logo-manifest.json`.

3. **AR/FA footer lead is English hardcoded**, not localized.  
   - Visible: `This message was sent to alex.user@example.com.` in RTL layouts.  
   - Production YAML: AR `تم إرسال هذه الرسالة إلى` / FA `این پیام به` … `ارسال شد.`  
   - Causes awkward punctuation/order (period appears at the “start” in RTL reading).  
   - Ref: `shared/email-kit.js` `brandedFooter()` hardcodes English sentence.

4. **AR/FA body copy diverges from production YAML** (preview invented/approximate strings).  
   Examples:  
   - AR welcome: YAML `مرحباً بك في ايفينتي` vs preview `مرحباً بك في إيفينتي!`  
   - AR greeting: YAML `،مرحباً` vs preview `مرحباً`  
   - FA button: YAML `فعال‌سازی حساب من` vs preview `فعال‌سازی حساب`  
   - FA brand spelling: YAML often `Eveenty` Latin vs preview `ایونتی`  
   - Refs: `shared/sample-data.js` vs `pkg/locales/translations/email/{ar,fa}.yaml`

### MINOR
5. **CTA label wraps at 320px (EN).** Measured height 70.38px; still ≥44px and no overflow. Owner should decide if two-line CTA is acceptable or if padding/font/label should change. Screenshot: `mobile-en-320.png`.

6. **Hidden inbox preheader is English-only** for AR/FA (content still EN string). Ref: `SAMPLE.activate.preheader` in `shared/sample-data.js`.

7. **Logo `alt` is always** `Eveenty — Events Made Easy` (EN tagline) for AR/FA. Manifest proposes localized alts. Ref: `brandedHeader()` in `shared/email-kit.js`.

8. **Heading `font-weight: 700` vs Figma SemiBold (~600)** on node `4:10`. Optical difference small; owner call.

### COSMETIC / intentional / deferred
9. **Yellow CTA `#E9D023` / dark text `#4D4C49`** — matches Figma; **differs from production magenta `#d80073`**. Documented as proposed, not owner-final.  
10. **Cream header `#FEFDF4`** — Figma TRANSACTIONAL; not in current prod template.  
11. **No `@font-face` / remote font link** — stacks declare Plus Jakarta / Roboto with Arial fallbacks; Figma annotation says web-font loading not claimed. On this QA machine fonts resolved; clients remain untested.  
12. **Outlook VML bulletproof button** — deferred (documented).  
13. **Long-copy / blocked-images modes** — intentional QA stress fixtures; long name wraps cleanly; blocked image shows alt placeholder and CTA remains clear.  
14. **CTA href is mock `example.com`** — expected for preview; not a working activation flow.

---

## 5. Figma vs preview (accessible)

Figma node `4:2` compared to `desktop-en-800.png` + live browser spot-check:

| Aspect | Figma | Preview | Assessment |
|--------|-------|---------|------------|
| Container | 600 max | 600px measured | Match |
| Logo | 200×80 EN | 200×80.16 | Match |
| Header cream | `#fefdf4` | present | Match |
| Colors CTA | `#e9d023` / `#4d4c49` | measured match | Match |
| Type sizes | 24 / 16 | 24 / 16 | Match |
| Heading weight | SemiBold | **700 Bold** | Slight deviation |
| Preheader | Annotation outside container | Preview annotation outside iframe; hidden preheader in HTML | Match intent |
| Typography notes | Outside canvas | Outside email canvas | Match |
| FR/ES/AR/FA frames | Not compared in this pass beyond EN `4:2` | AR/FA HTML exist; FR/ES absent | Incomplete |

Saved Figma export: `screenshots/figma-activate-en-desktop-800.png`.

---

## 6. Content / template parity notes

| Item | Finding |
|------|---------|
| EN welcome / body / button / copyright | Matches `en.yaml` |
| EN footer lead | Matches YAML conceptually; preview hardcodes full EN sentence (same language) |
| Hidden preheader | Preview-only (prod template has no preheader) — intentional Task 02 |
| Prod CTA color | Magenta — **not** what Figma/preview show |
| Prod logo width | Template `width="120"` — preview/Figma ~200 |
| Activate URL | Mock only |

---

## 7. Proposed fixes (do not implement until owner approves)

1. Add FR/ES to `EMAIL_IDS` activate locales + `LOCALES.fr` / `LOCALES.es` from YAML; copy owner `french.png` / `Spanish.png` into `assets/logos/` without regenerating.  
2. Replace AR/FA logo assets with owner `Arabic.png` / `Farse.png` (exact files).  
3. Localize `brandedFooter()` lead/suffix per locale (use YAML strings).  
4. Align AR/FA activate strings with production YAML (or get owner sign-off on intentional preview copy).  
5. Optional: localize preheader + logo alt; reduce heading weight to 600; adjust 320 CTA so label stays one line if owner prefers.

Files involved: `shared/sample-data.js`, `shared/email-kit.js`, `assets/logos/*` — **no changes made in this QA task**.

---

## 8. Items still requiring owner visual decision

1. Approve yellow primary CTA `#E9D023` + dark text (vs current prod magenta).  
2. Approve ~200px logo display + cream header band.  
3. Accept or reject **two-line CTA** at 320px EN.  
4. Confirm AR/FA must use **owner PNG logos** at full resolution before any “five-locale” approval.  
5. Confirm whether preview copy must **exactly** match production YAML for AR/FA (and FR/ES once wired).  
6. Confirm heading Bold vs SemiBold.  
7. Confirm English footer in RTL is unacceptable (recommended: localized).  
8. Formal email-client matrix remains out of scope until requested.

---

## 9. Distinction summary

| Category | Items |
|----------|--------|
| Genuine defects / gaps | FR/ES missing; AR/FA wrong logos; English footer in RTL; AR/FA copy ≠ YAML |
| Intentional fixtures | Long-copy mode; blocked-images simulation; mock activate URL |
| Deferred engineering | Outlook VML; production image hosting; SMTP/migration; client matrix |
| Close enough for owner EN review | EN 800/768/414/375 layout, spacing, colors, preheader handling vs Figma `4:2` |

---

## 10. Stop

No HTML/CSS/JS/template/YAML/logo/Figma changes were made.  
No Commerce / Notification / Marketing / 48-template work started.  
**Awaiting owner decision before any fixes or next task.**
