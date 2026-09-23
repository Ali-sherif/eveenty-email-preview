# Task 02 Remediation — Account Activation Visual QA Retest

**Date:** 2026-09-24 (local) / testedAt `2026-09-23T21:44:38.195Z`  
**Scope:** Account Activation (`activate_email`) only — preview remediation + browser retest.  
**Verdict for owner:** **READY FOR OWNER VISUAL REVIEW** across EN / FR / ES / AR / FA in the local preview.  
**This report does NOT approve the design on behalf of the owner.**

**Email-client rendering (Gmail / Outlook / Apple Mail): NOT EXECUTED.** Browser/Playwright screenshots only.

---

## 1. What was fixed (mapped to prior BLOCKER/MAJOR/MINOR)

| Prior severity | Issue | Remediation | Status after retest |
|----------------|-------|-------------|---------------------|
| BLOCKER | FR/ES missing from preview locale control | Added `fr`/`es` to `activate_email` locales only; wired YAML ActivateEmail* strings; copied owner `french.png` / `Spanish.png` → `eveenty-logo-fr.png` / `eveenty-logo-es.png` | **RESOLVED** — both PASS @ 800 |
| MAJOR | AR/FA logos were 782×319 substitutes | Replaced with byte-identical owner `Arabic.png` / `Farse.png` (3014×1208) | **RESOLVED** — natural size + SHA256 match |
| MAJOR | AR/FA English hardcoded footer | `brandedFooter()` now uses YAML `footerLead` + `footerSuffix` per locale | **RESOLVED** |
| MAJOR | AR/FA invented body/button/welcome copy | Aligned to production `ar.yaml` / `fa.yaml` ActivateEmail* keys | **RESOLVED** |
| MINOR | EN CTA wraps at 320px | Mobile: `stack-pad` on CTA row + `.cta-yellow` horizontal padding 40→24px | **RESOLVED** — 1 line, 204.78×51.19 |
| MINOR | Logo alt always EN tagline | Locale alts from logo manifest guidance | **RESOLVED** |
| MINOR | Hidden preheader EN-only | **Reported, not invented** — production template has no preheader key | **OPEN (COSMETIC)** |
| MINOR | Heading weight 700 vs Figma SemiBold | Unchanged — owner decision | **OPEN (COSMETIC)** |

---

## 2. Test environment

| Item | Value |
|------|--------|
| Preview URL | `http://localhost:54701/` (live Eveenty Email Preview app; HTTP 200) |
| Note | Port `4173` was a different `serve` directory listing — **not** used |
| Browser | Playwright Chromium (headless) |
| Capture script | `qa-output/task-02-activation/remediation/capture-remediation.mjs` |
| Measurements | `qa-output/task-02-activation/remediation/measurements.json` |
| Figma | Readable + plugin write API available (team Full/admin). **No Figma node mutations performed** (see §7) |
| Backend | READ ONLY — strings taken from `pkg/locales/translations/email/{en,fr,es,ar,fa}.yaml` + `activate_email.template` |

---

## 3. Matrix results (fresh browser capture)

| Variant | Viewport | Locale | Status | Screenshot |
|---------|----------|--------|--------|------------|
| Desktop EN | 800 | en | **PASS** | `screenshots/desktop-en-800.png` |
| Desktop FR | 800 | fr | **PASS** | `screenshots/desktop-fr-800.png` |
| Desktop ES | 800 | es | **PASS** | `screenshots/desktop-es-800.png` |
| Desktop AR RTL | 800 | ar | **PASS** | `screenshots/desktop-ar-800.png` |
| Desktop FA RTL | 800 | fa | **PASS** | `screenshots/desktop-fa-800.png` |
| Tablet EN | 768 | en | **PASS** | `screenshots/tablet-en-768.png` |
| Mobile EN | 414 | en | **PASS** | `screenshots/mobile-en-414.png` |
| Mobile EN | 375 | en | **PASS** | `screenshots/mobile-en-375.png` |
| Mobile EN | 320 | en | **PASS** | `screenshots/mobile-en-320.png` |
| Mobile AR RTL | 375 | ar | **PASS** | `screenshots/mobile-ar-375.png` |
| Mobile FA RTL | 320 | fa | **PASS** | `screenshots/mobile-fa-320.png` |
| Images blocked | 600 | en | **PASS** | `screenshots/images-blocked-en-600.png` |
| Long-copy fixture | 320 | en | **PASS** | `screenshots/long-copy-en-320.png` |

**Preview `#localeSelect` for Activation now offers:** `en`, `fr`, `es`, `ar`, `fa`.  
Other email templates still offer only their prior locales (`en`/`ar`/`fa` or `en` for support).

---

## 4. Before / after evidence (resolved issues)

### 4.1 EN CTA wrap @ 320 (MINOR → fixed)

| | Before | After |
|---|--------|-------|
| Evidence | `before/mobile-en-320.png` — label wraps “Activate My” / “Account”; height ~70px | `screenshots/mobile-en-320.png` — **single line** |
| Measured | Prior QA: CTA **226 × 70.38**, 2 lines | Now: CTA **204.78 × 51.19**, `ctaLineCount=1`, font-size still **16px**, ≥44×44 |
| Overflow | none | none |

### 4.2 FR / ES coverage (BLOCKER → fixed)

| | Before | After |
|---|--------|-------|
| Locale control | `en`, `ar`, `fa` only | `en`, `fr`, `es`, `ar`, `fa` |
| Screenshots | BLOCKED (no capture) | `screenshots/desktop-fr-800.png`, `desktop-es-800.png` |
| Copy source | n/a | Production `fr.yaml` / `es.yaml` ActivateEmail* |

### 4.3 AR / FA owner logos (MAJOR → fixed)

| Locale | Owner source | Preview path | SHA256 | Dimensions | Bytes |
|--------|--------------|--------------|--------|------------|-------|
| EN | `English.png` | `assets/logos/eveenty-logo-en.png` | `B763B29A…BBB7F5` | 3014×1208 | 83925 |
| FR | `french.png` | `assets/logos/eveenty-logo-fr.png` | `728D527A…554880F` | 3014×1208 | 86366 |
| ES | `Spanish.png` | `assets/logos/eveenty-logo-es.png` | `C36B2C32…660F7687` | 2958×1208 | 84555 |
| AR | `Arabic.png` | `assets/logos/eveenty-logo-ar.png` | `2CE440F0…E1B058E4` | 3014×1208 | 89063 |
| FA | `Farse.png` | `assets/logos/eveenty-logo-fa.png` | `47C426CA…2FF86FF0` | 3014×1208 | 94026 |

All five preview files are **byte-identical** to owner originals (SHA256 match). Display width remains ~**200px** (`height:auto`). Authoritative manifest filenames (`English.png`, `french.png`, `Spanish.png`, `Arabic.png`, `Farse.png`) unchanged on disk under `D:\emails\`.

Prior defect: AR/FA were **782×319** / ~29–30 KB substitutes (different hashes).

### 4.4 AR / FA copy + footers (MAJOR → fixed)

| String | Production YAML | Preview after fix |
|--------|-----------------|-------------------|
| AR welcome | `مرحباً بك في ايفينتي` | Match |
| AR greeting lead | `،مرحباً` + template ` Name 👋,` | `،مرحباً Alex 👋,` |
| AR button | `تفعيل حسابي` | Match |
| AR footer | `تم إرسال هذه الرسالة إلى` + email + `.` | Match (no English lead) |
| AR copyright | `.© ايفينتي. جميع الحقوق محفوظة` | Match (leading period is YAML) |
| FA welcome | `!به Eveenty خوش آمدید` | Match |
| FA greeting lead | `،سلام` + template | `،سلام Alex 👋,` |
| FA button | `فعال‌سازی حساب من` | Match |
| FA footer | `این پیام به` + email + ` ارسال شد.` | Match |
| FA copyright | `.© Eveenty. تمامی حقوق محفوظ است` | Match |

Greeting markup mirrors production `activate_email.template`:  
`{{ GreetingLead }} <bdi>{{ DisplayName }}</bdi> 👋,`

---

## 5. Key measurements (Playwright)

### EN @ 800
| Metric | Measured |
|--------|----------|
| Container | **600px** max-width |
| Logo display / natural | **200 × 80.16** / **3014 × 1208** |
| CTA | **236.78 × 51.19** (≥44×44), 1 line |
| CTA colors | bg `rgb(233, 208, 35)` `#E9D023`; text `rgb(77, 76, 73)` `#4D4C49` |
| Overflow | none |
| Visible preheader row | Absent |
| Hidden preheader | Present (EN SAMPLE string) |

### EN @ 320
| Metric | Measured |
|--------|----------|
| Container | **286px** (16px outer gutters) |
| CTA | **204.78 × 51.19**, **1 line**, font-size 16px |
| Overflow | none |

### AR @ 800 / FA @ 800
| Metric | AR | FA |
|--------|----|----|
| `html` | `lang=ar` `dir=rtl` | `lang=fa` `dir=rtl` |
| Logo natural | 3014×1208 | 3014×1208 |
| CTA | 187.5×51.19 | 244.84×51.19 |
| English footer fragment | **Absent** | **Absent** |
| Overflow | none | none |

### Contrast (unchanged)
| Pair | Ratio | AA normal |
|------|-------|-----------|
| CTA `#4D4C49` on `#E9D023` | ~5.52:1 | Pass |
| Body on white | ~8.59:1 | Pass |
| Heading on white | ~14.34:1 | Pass |

---

## 6. Locale-by-locale results

| Locale | Logo | Body/CTA copy vs YAML | Footer vs YAML | RTL / LTR islands | Notes |
|--------|------|----------------------|----------------|-------------------|-------|
| EN | Owner match | Match | Match | LTR | Baseline OK |
| FR | Owner match | Match | Match | LTR | Newly inspectable |
| ES | Owner match | Match | Match | LTR | Newly inspectable |
| AR | Owner match | Match | Match | RTL; email `dir=ltr` | YAML greeting punctuation preserved |
| FA | Owner match | Match | Match | RTL; email `dir=ltr`; Latin “Eveenty” per YAML | Same |

---

## 7. Figma vs preview parity

**Figma file:** [Eveenty Email Design Kit](https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit)  
**Access:** Authenticated as Full/admin on Eveenty team — **edit access exists**.  
**Figma mutations in this remediation:** **None.**

Reason: inspected Activation frames (`4:2` EN, `4:87` FR, `4:104` ES, `5:2` AR, `5:38` FA). Visible body/button/footer/welcome strings already match production YAML. Plugin API cannot call `createImageAsync` here, so Figma logo image fills were **not** replaced in-file; display size on frames is already ~200×80.

| Aspect | Figma | Preview (post-fix) | Assessment |
|--------|-------|---------------------|------------|
| EN layout / CTA yellow / cream header / 200px logo | Match intent | Match | Parity OK |
| FR/ES/AR/FA body + footer copy | Already YAML-aligned | YAML-aligned | Parity OK |
| AR/FA greeting punctuation | Natural RTL form e.g. `مرحباً Alex 👋،` | Production template order `،مرحباً Alex 👋,` | **Remaining MINOR** presentation difference |
| Heading weight | SemiBold (~600) on EN | **700** | **Remaining COSMETIC** — owner call |
| Yellow CTA / ~200px logo | Design proposal | Same proposal in preview | **Awaiting owner visual approval** (not treated as final) |

Figma export saved: `screenshots/figma-activate-en-desktop-800.png`.

---

## 8. Remaining items (classified)

### COSMETIC / intentional
1. **Hidden inbox preheader is English-only** for all locales. Production `activate_email.template` has **no** preheader translation keys — not invented. Preview annotation correctly stays outside the email canvas.
2. **Heading `font-weight: 700` vs Figma SemiBold** — owner call.
3. **Yellow CTA `#E9D023` / text `#4D4C49`** vs production magenta `#d80073` — design proposal awaiting owner approval.
4. **~200px logo** vs production template `width="120"` — design proposal awaiting owner approval.
5. **Cream header `#FEFDF4`** — Figma TRANSACTIONAL proposal.
6. **Mock activate URL** `example.com` — expected for preview.
7. **AR/FA copyright leading `.`** — exact production YAML; looks odd in LTR tooling but correct for RTL source.

### MINOR
8. **Figma vs preview AR/FA greeting punctuation** (natural Figma vs production YAML+template order). Preview correctly follows production; Figma may stay as design presentation until owner decides.

### BLOCKER / MAJOR
**None remaining** for Account Activation preview coverage/copy/logos/footer/CTA wrap in this browser matrix.

### Deferred / not executed
9. Gmail / Outlook / Apple Mail client matrix — **NOT EXECUTED**.
10. Outlook VML bulletproof button — deferred.
11. Production template / YAML / image hosting changes — **out of scope** (not modified).

---

## 9. Changed files (preview project only)

| Path | Change |
|------|--------|
| `shared/sample-data.js` | YAML-accurate activate copy for EN/AR/FA; added FR/ES activate locales; Activation `locales: ['en','fr','es','ar','fa']` |
| `shared/email-kit.js` | FR/ES logo map; localized logo alt; `brandedFooter` lead/suffix; mobile `.cta-yellow` padding; stack-pad on footer |
| `shared/render-emails.js` | Pass footer lead/suffix; stack-pad on CTA row; document preheader limitation |
| `assets/logos/eveenty-logo-ar.png` | Replaced with owner `Arabic.png` (byte-identical) |
| `assets/logos/eveenty-logo-fa.png` | Replaced with owner `Farse.png` (byte-identical) |
| `assets/logos/eveenty-logo-fr.png` | **Added** from owner `french.png` |
| `assets/logos/eveenty-logo-es.png` | **Added** from owner `Spanish.png` |
| `emails/activate_email.html` | Regenerated standalone EN default |
| `emails/*.html` (other 4) | Regenerated via `generate-standalone.mjs` (shared kit footer/alt only; not Activation content work) |
| `qa-output/task-02-activation/remediation/*` | Capture script, measurements, screenshots, this report |

**Not modified:** backend, production templates, YAML translations, owner PNG sources under `D:\emails\`, Figma file, unrelated email catalog designs.

**Git:** No stage / commit / push.

---

## 10. Items still requiring owner visual approval

1. Approve yellow primary CTA `#E9D023` + dark text (vs prod magenta).
2. Approve ~200px logo display + cream header band.
3. Confirm production-accurate AR/FA greeting punctuation in preview (YAML leading comma) vs Figma’s natural RTL greeting.
4. Confirm heading Bold (700) vs SemiBold (600).
5. Formal email-client matrix when requested.
6. Whether preview-only hidden preheader should gain localized strings later (would need new translation keys — none exist today).

---

## 11. Stop

Account Activation remediation + browser retest complete.  
No Commerce / Notification / Marketing / full catalog work started.  
**No owner approval claimed.**
