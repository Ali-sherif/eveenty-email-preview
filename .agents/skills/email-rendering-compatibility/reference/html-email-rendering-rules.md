# HTML Email Rendering Rules — Engineering Reference

A battle-tested constraint list for building HTML/CSS emails that survive Outlook (Word engine), Gmail, Yahoo Mail, and Apple Mail without breaking. Treat this as a linting checklist for anything your backend generates or converts into email markup.

---

## 0. The Core Mental Model

Email clients are **not browsers**. Three rendering realities drive every rule below:

1. **Outlook on Windows (desktop, "classic" 365/2016/2019/2021) renders HTML using Microsoft Word's engine**, not Trident/WebView/Chromium. Word has no real CSS box model, no flexbox/grid, and mishandles margins on `<p>`/`<div>`. New Outlook (Win11) and Outlook.com now use a WebView2/Chromium-based engine with much better support — but you must still support classic Outlook for years to come, so build for the worst case.
2. **Gmail sanitizes and strips CSS server/client-side** and has a hard **102 KB clipping limit** on the rendered HTML — anything past that gets truncated behind a "View entire message" link (which also strips your tracking pixel and, often, your unsubscribe link).
3. **Dark mode is three unrelated behaviors**, not one: Apple Mail leaves your colors alone unless you opt in (or auto-inverts pure black-on-white), Gmail mobile does a partial/unpredictable inversion, and Outlook desktop historically did full inversion. There is no single CSS rule that "just works" everywhere.

**Golden rules that fix 80% of bugs before you write a line of code:**
- Build with **nested HTML tables**, not divs/flexbox/grid, for structural layout.
- **Inline all CSS** on every element that must render correctly (keep a `<style>` block only for progressive-enhancement rules like media queries and dark mode).
- Set explicit `width`, `height`, `border`, `cellpadding`, `cellspacing`, `border-collapse` on every table.
- Never rely on `<div>` margins/padding for spacing — use table cells with padding, or spacer rows.
- Keep total HTML under **102 KB** (aim for under 75 KB).
- Test every send in Outlook desktop, Gmail (web + Android + iOS), Yahoo, and Apple Mail (macOS + iOS) before shipping — real clients or Litmus/Email on Acid, not just a browser preview.

---

## 1. Document Skeleton (use this as your base template)

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title></title>
<!--[if mso]>
<noscript>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
</noscript>
<![endif]-->
<style>
  /* reset + dark mode + media queries go here */
</style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4;">
  <!-- preheader, outer table, content -->
</body>
</html>
```

Notes:
- The `xmlns:v` / `xmlns:o` namespaces and the MSO `<xml>` block set Outlook's rendering DPI to 96 (avoids the "everything is 4% too big" Word-engine bug) — always include them.
- `X-UA-Compatible` matters for embedded Outlook web previews and some older webmail renderers.
- Both `color-scheme` **and** `supported-color-schemes` meta tags are required — different Apple Mail versions historically required one or the other; ship both.

---

## 2. Outlook on Windows (Word Rendering Engine) — Classic 2016/2019/2021/365

This is the hardest target. Word's engine treats your HTML like a Word document.

### 2.1 Layout
- **No CSS `max-width`, `float`, `position`, flexbox, or grid.** Word ignores or mangles all of them. Build fixed-width layouts with tables and use MSO conditional comments to hard-code table widths.
- **`<div>` is unreliable for structure.** Use it only for content wrappers with no positioning/box requirements; do all layout in `<table>`.
- Always set on every layout table: `border="0" cellpadding="0" cellspacing="0" role="presentation"` plus inline `style="border-collapse:collapse;"`.
- Outlook adds default cell spacing/padding you didn't ask for unless `cellpadding="0" cellspacing="0"` **and** `border-collapse:collapse` are both present — set both, one alone isn't enough.
- **Fluid/responsive layout requires the "ghost table" or MSO conditional-width hybrid pattern**, because Word ignores `@media` queries entirely:
```html
<!--[if mso]>
<table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
<![endif]-->
<div style="max-width:600px; margin:0 auto;">
  ... fluid content ...
</div>
<!--[if mso]>
</td></tr></table>
<![endif]-->
```

### 2.2 Spacing
- **`margin` on `<p>` and `<div>` is inconsistent in Word** — margins on paragraphs can double, collapse, or be ignored depending on Outlook version. Prefer padding on table cells (`<td style="padding:20px;">`) or dedicated spacer rows (`<tr><td height="20" style="line-height:20px; font-size:1px;">&nbsp;</td></tr>`) instead of `<p>` margins for anything load-bearing.
- Outlook can add unwanted line-height/spacing under images inside table cells — always set `display:block` on `<img>` and remove default gaps with `style="font-size:0; line-height:0;"` on the parent `<td>` if a stray gap appears.

### 2.3 Backgrounds
- **Outlook desktop does not support CSS `background-image` on `<div>`/`<td>` reliably before "new" Outlook.** Use VML (`v:rect` / `v:fill`) wrapped in MSO conditional comments as the Outlook fallback, with the CSS `background` property for everyone else:
```html
<!--[if mso]>
<v:rect fill="true" stroke="false" style="width:600px;height:300px;">
<v:fill type="tile" src="https://example.com/bg.jpg" color="#222222" />
<v:textbox inset="0,0,0,0">
<![endif]-->
<div style="background:url('https://example.com/bg.jpg') no-repeat center/cover; width:600px; height:300px;">
  <!--[if mso]><table role="presentation" width="100%"><tr><td><![endif]-->
  <!-- content -->
  <!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]>
</v:textbox>
</v:rect>
<![endif]-->
```
- **`background-color` on `<td>` works fine** in Outlook — no VML needed for solid fills, only for image backgrounds.

### 2.4 Rounded Corners / Shadows
- `border-radius` and `box-shadow` are **silently ignored** by Word — the element renders as a hard square with no shadow. Either accept square corners in Outlook, or use VML `arcsize` roundrects for critical buttons.
- Standard bulletproof button pattern (works everywhere incl. rounded corners in Outlook):
```html
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://example.com" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="10%" fillcolor="#2563eb" stroke="f">
<w:anchorlock/>
<center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Click Me</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href="https://example.com" style="background-color:#2563eb; border-radius:8px; color:#ffffff; display:inline-block; font-family:Arial,sans-serif; font-size:16px; font-weight:bold; line-height:44px; text-align:center; text-decoration:none; width:200px;">Click Me</a>
<!--<![endif]-->
```

### 2.5 Fonts
- Word only reliably renders **web-safe fonts**: Arial, Georgia, Times New Roman, Verdana, Courier New, Tahoma, Trebuchet MS. `@font-face` / custom web fonts silently fall back to Times New Roman in Outlook desktop.
- Always declare a full fallback stack: `font-family: 'Custom Font', Arial, sans-serif;` — Outlook will use Arial.
- Line-height on fonts can render inconsistently; set it explicitly on every text-bearing element, don't rely on inheritance.

### 2.6 Images
- Outlook does not auto-scale images to their container — always set explicit `width` and `height` **attributes** (not just CSS) on every `<img>`, or Word may render at native pixel size.
- `<img>` must have `style="display:block;"` or Word adds a few px of inline whitespace beneath it.

### 2.7 Things That Are Silently Stripped or Broken in Word Engine
- Flexbox, CSS Grid, `position`, `float`, `transform`, `transition`, `animation`, `z-index`, CSS `gap`, `object-fit`, `clip-path`, `filter`, multiple backgrounds, CSS variables (`var()`) without literal fallback, `calc()`.
- `<video>`, `<audio>`, `<iframe>`, `<form>`, `<script>`, SVG — all unsupported; provide static `<img>` fallbacks (see §6).

### 2.8 Outlook.com / New Outlook (Win11) / Outlook Mac/iOS/Android
- These use WebView/Chromium-based or WebKit-based engines with much better CSS support (flexbox partially works, border-radius works, background-images work without VML). **Do not assume this coverage for classic Windows desktop Outlook** — test both.

---

## 3. Gmail (Web, Android App, iOS App)

Gmail proxies/caches images through Google's own servers and aggressively sanitizes CSS.

### 3.1 What Gmail Strips or Ignores
- `<style>` blocks in the `<head>` are supported in Gmail webmail (unlike old Gmail) but are **removed entirely** in the Gmail Android/iOS app in some contexts — inline your critical styles regardless; treat `<style>` as progressive enhancement only (media queries, dark mode, `:hover`, pseudo-classes).
- External stylesheets (`<link rel="stylesheet">`) and `@import` are stripped completely.
- `@font-face` is stripped except for Google-hosted fonts (Roboto, Google Sans) — expect fallback fonts everywhere else.
- `position`, `z-index`, CSS Grid, flexbox sub-properties (`align-items`, `justify-content`, `flex-direction`, `flex-wrap` — though bare `display:flex` itself often survives) are stripped.
- `box-shadow`, `filter`, `clip-path`, `backdrop-filter`, transforms/animations/transitions are stripped.
- **Any `background-image` rule inside a `<style>` block can cause Gmail to strip the entire style block**, not just that one rule — a known landmine. Keep background-image rules inline via the `style` attribute instead of in `<head>` CSS.
- Class/ID selectors can be renamed/stripped depending on Gmail's sanitizer pass — never rely on cascading selectors for anything load-bearing; use inline styles as the source of truth and `<style>`/classes only for `@media` overrides.
- Custom `data-*` attributes are stripped in some Gmail contexts (an exception exists for Outlook.com/Outlook-app dark mode hooks like `[data-ogsc]`, which Gmail does not use anyway).

### 3.2 Images
- Gmail **blocks remote images by default in some configurations** and always proxies/caches external images through Google's own CDN — first-load may be delayed and you cannot rely on cookie-based personalization in images.
- Because images can be blocked, always set meaningful `alt` text and a background color behind image-based content so the message is legible with images off.

### 3.3 The 102 KB Clipping Limit — critical
- Gmail clips any message whose **rendered HTML (not the whole MIME message)** exceeds **~102 KB**. Once clipped:
  - The recipient sees a truncated email with a **"[Message clipped] View entire message"** link.
  - Anything below the clip point — including your **footer, unsubscribe link, and tracking pixel** — is hidden until the user clicks through, which most won't.
- Mitigations:
  - Minify HTML (strip comments except required MSO conditionals, collapse whitespace).
  - Remove duplicate/redundant inline styles and unused CSS in `<head>`.
  - Move heavy inline `style` blocks to `<style>` (allowed for @media/dark-mode only) rather than repeating full styles on every cell.
  - Keep image *references* (`<img src="https://...">`), never base64-embed images — base64 inflates HTML size dramatically and is one of the most common causes of clipping.
  - Target ≤ 75 KB in dev so you have headroom; treat 102 KB as a hard ceiling, not a target.
  - Put your unsubscribe link and legally-required footer content as **early as reasonably possible** in the source order as a defensive measure, in case of accidental clipping.

### 3.4 Media Queries
- Gmail webmail supports `@media` queries reasonably well; Gmail apps have historically been inconsistent — never rely on `@media` alone for critical responsive behavior; use a fluid-hybrid layout (percentage/`max-width` table with MSO-conditional fixed fallback) so it degrades gracefully even where media queries are ignored.

---

## 4. Yahoo Mail (incl. AOL Mail, same backend)

Generally more permissive than Gmail but still webmail-sanitized.

- Supports `<style>` blocks and most standard CSS reasonably well, including `border-radius`, `background-image` in CSS, and web fonts via `@font-face` for many campaigns.
- **Strips or rewrites some inline `style` attributes on `<a>` tags** — Yahoo has historically overridden default link-blue styling; always explicitly set `color` and `text-decoration:none` inline on every anchor to avoid Yahoo's default blue-underline link styling bleeding through.
- Image blocking-by-default is common — same mitigation as Gmail (alt text, background colors, don't rely on image load for layout).
- No unique VML/Word-engine quirks (it's a webmail client), but treat it as a mid-tier target: test after Outlook/Gmail/Apple Mail, don't assume parity with either.
- Supports `@media` queries.

---

## 5. Apple Mail (macOS Mail + iOS Mail) and Dark Mode

Apple Mail (WebKit-based) has the **best CSS support of any major client** — flexbox, grid (partial), border-radius, box-shadow, web fonts, `@media`, and `@supports` all generally work. The primary risk here is **dark mode**, not layout.

### 5.1 Dark Mode Behavior (the three-tier model)
1. **No color changes** — Apple Mail's default: it renders your explicit colors exactly as authored, light or dark system setting, *unless* you opt in to responding to dark mode via CSS, or you trigger Apple's auto-inversion heuristic (below).
2. **Apple's auto-invert heuristic** — if your email is pure `#ffffff` background with pure `#000000` text (or is unstyled plain text), Apple Mail will auto-invert it to dark for readability. This is often *undesired* if you have a deliberately styled light template — avoid pure black-on-white if you don't want Apple deciding your colors for you.
3. **Opt-in dark theme via CSS** — the only reliable way to fully control Apple Mail's dark rendering:
```html
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body, .bg-main { background-color:#ffffff; color:#111111; }
  @media (prefers-color-scheme: dark) {
    body, .bg-main { background-color:#111111 !important; color:#f0f0f0 !important; }
    .dark-img { display:block !important; }
    .light-img { display:none !important; }
  }
</style>
```
- Both meta tags are required together for cross-version compatibility (older Apple Mail wanted the meta tag, newer wants the CSS property — ship both, it's harmless).
- Use `!important` inside the `@media (prefers-color-scheme: dark)` block — Apple Mail's specificity handling for dark overrides is inconsistent without it.

### 5.2 Logos and Transparent Images
- Transparent-background PNG logos (e.g., dark text/logo on transparency) **disappear or become illegible** if the surrounding background flips to dark. Either:
  - Provide a light/dark image swap (`.light-img` / `.dark-img` classes toggled via the media query above), or
  - Put a solid background color behind the logo so it never sits on unpredictable transparency, or
  - Design logos with enough contrast to survive either background.

### 5.3 Gmail and Outlook Dark Mode (contrast with Apple)
- **Gmail mobile apps** do a **partial, semi-unpredictable inversion** — light backgrounds often flip dark but explicitly-set colors on inner elements may be respected inconsistently, producing "patchwork" results. Gmail webmail (desktop) generally does **not** apply dark mode to message *content* at all — only the surrounding UI chrome goes dark.
- **Outlook desktop (classic, Windows)** has historically done **full, aggressive color inversion** with no opt-out via standard `prefers-color-scheme` (it doesn't support the media query) — instead, Outlook.com/Outlook app dark mode is targeted via the proprietary `[data-ogsc]` (text) / `[data-ogsb]` (background) attribute selectors:
```html
<style>
  [data-ogsc] .bg-main { background-color:#111111 !important; color:#f0f0f0 !important; }
  [data-ogsb] { background-color:#111111 !important; }
</style>
```
- **Net implication:** design every template to survive all three behaviors gracefully — don't depend on any single dark-mode technique working everywhere; use `color-scheme`/`prefers-color-scheme` for Apple Mail + modern clients, `[data-ogsc]`/`[data-ogsb]` for Outlook.com/app, and accept that Gmail's inversion is partly out of your control (mitigate by avoiding pure white/pure black extremes and giving every element an explicit, readable color rather than relying on inherited/default color).

---

## 6. Universal Constraints (apply regardless of client)

| Feature | Status | Guidance |
|---|---|---|
| `<script>` | Stripped everywhere | Never rely on JS for critical rendering or interactivity |
| `<form>` / `<input>` / `<button>` | Stripped by nearly all major clients | Use `<a>` styled as a button (§2.4) instead of `<button>`; avoid in-email forms except AMP-for-email (very limited support, Gmail-only, opt-in) |
| `<iframe>` | Blocked everywhere | Never use |
| SVG | Unsupported in Outlook (Word engine) and inconsistently in Gmail | Provide PNG/JPG fallback via `<img>`; if using inline SVG, wrap with MSO conditional fallback to a raster image |
| `<video>` / `<audio>` | Unsupported in Outlook and Gmail; partial in Apple Mail | Use a static poster-frame `<img>` linking out to a hosted video, not embedded `<video>` |
| CSS `gap` (flex/grid gap) | Unsupported everywhere in email | Use `<td>` padding or spacer cells/columns instead |
| `object-fit` | Unsupported everywhere | Pre-crop/resize images server-side to the exact display dimensions instead |
| CSS variables `var()` | Silently ignored by Outlook/Gmail if no literal fallback exists | Always inline literal values; don't rely on custom properties for anything critical |
| `calc()` | Unsupported in Outlook, spotty elsewhere | Pre-compute values server-side and hard-code |
| Web fonts (`@font-face`) | Outlook: no. Gmail: Google fonts only. Apple/Yahoo: yes | Always specify a web-safe fallback stack; never let brand typography be load-bearing for legibility |
| `position`, `float`, `z-index` | Unsupported/unsafe in Outlook; risky in webmail (potential UI-overlay/phishing vector, actively stripped by some clients for security) | Don't use for layout at all in email |
| Base64-embedded images | Technically renders in some clients but bloats HTML size and is blocked/stripped in Outlook and some Gmail contexts | Always use hosted `<img src="https://...">`, never inline base64, both for compatibility and to protect your 102 KB Gmail budget |
| Remote images | Blocked by default in many clients until user action | Design so the email is legible/functional with images off (alt text, background colors, don't put critical CTAs only inside an image) |

---

## 7. Sizing & Structural Budget (2026 baseline)

| Element | Target | Hard max | Why |
|---|---|---|---|
| Template width (desktop) | 600–640px | 800px | Historical Outlook/Hotmail container width; still the safe universal canvas |
| Template width (mobile) | 320–375px fluid | 480px | Wider forces landscape scroll, hurts engagement |
| Total HTML size | ≤ 75 KB | 102 KB | Gmail clipping threshold — footer/unsubscribe/pixel vanish past this |
| Single image file size | ≤ 200 KB | ~1 MB | Load time on mobile/cellular |
| Animated GIF | ≤ 500 KB | 1 MB | Same |
| Preheader text | 50–100 chars | ~140 chars | Truncated further on mobile inbox previews |
| CTA button size | 200–300 × 44–75px | — | 44px is the WCAG/Apple minimum comfortable tap target |
| Body font size | 14–16px | — | 16px is the practical minimum for WCAG-friendly legibility on mobile |

---

## 8. Pre-Send Engineering Checklist

- [ ] All layout done with `<table role="presentation">`, not `<div>` flex/grid
- [ ] Every table has `cellpadding="0" cellspacing="0" border="0"` + `border-collapse:collapse`
- [ ] All critical styles inlined on the element (not only in `<style>`)
- [ ] `<style>` block reserved for `@media` queries and `prefers-color-scheme` overrides only
- [ ] `color-scheme` and `supported-color-schemes` meta tags + CSS property both present
- [ ] `[data-ogsc]` / `[data-ogsb]` dark-mode rules included for Outlook.com/app
- [ ] No pure `#ffffff`-bg/`#000000`-text combination unless auto-invert in Apple Mail is acceptable
- [ ] Logos/images tested against a dark background (swap or solid-bg fallback in place)
- [ ] Background images have a VML fallback wrapped in `<!--[if mso]>` for classic Outlook
- [ ] Rounded corners/shadows have an acceptable Outlook fallback (square corner, or VML roundrect for key buttons)
- [ ] All fonts have a web-safe fallback stack ending in a generic family
- [ ] No `<script>`, `<form>`, `<iframe>`, `<video>`, `<audio>`, live SVG without raster fallback
- [ ] No CSS `gap`, `object-fit`, `calc()`, unfallbacked `var()`
- [ ] All `<img>` tags have explicit `width`/`height` attributes and `style="display:block;"`
- [ ] No base64-embedded images — all images hosted and linked
- [ ] Total HTML file size measured and confirmed under 102 KB (target 75 KB)
- [ ] Unsubscribe link and required footer content placed early enough to survive accidental clipping
- [ ] Tested in: Outlook desktop Windows (classic, Word engine), Gmail web, Gmail Android app, Gmail iOS app, Yahoo Mail web, Apple Mail macOS, Apple Mail iOS — light **and** dark mode on each that supports it

---

*Sources reflect current (2026) documented behavior across Litmus/Email on Acid-style testing guides, the Can I Email compatibility tables, and known Outlook/Gmail/Apple Mail bug trackers. Rendering engines shift with client updates (notably "new Outlook" migrating more users to a WebView/Chromium engine) — re-verify against a current compatibility table before major releases, since client market share and engine rollout percentages change over time.*
