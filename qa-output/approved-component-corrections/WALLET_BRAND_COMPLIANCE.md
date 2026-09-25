# WALLET BRAND COMPLIANCE

**Date:** 2026-09-25  
**Request:** Put official Apple / Google logos inside Eveenty’s custom magenta Wallet buttons.

## Official sources reviewed

| Provider | Guideline URL | Reviewed this session |
|----------|---------------|------------------------|
| Apple | https://developer.apple.com/wallet/add-to-apple-wallet-guidelines/ | **Yes** (live fetch) |
| Google | https://developers.google.com/wallet/generic/resources/brand-guidelines | **Yes** (live fetch) |

## Asset download status

| Asset | Status |
|-------|--------|
| Apple Add to Apple Wallet badge (SVG/EPS, 45 locales) | **BLOCKED** — requires Apple Developer Program authenticated download (“Download badge files”) |
| Google Add to Google Wallet button pack (PNG/SVG/XML) | **BLOCKED** — provider “Download assets” package not retrievable without authenticated/asset portal access (prior CDN probe 404) |
| Eveenty production complete badges (`cdn.eveenty.com/google_wallet.png`, `apple_wallet.png`) | **Available** — unmodified complete images; **not** official black brand-kit artwork |

Third-party / search-result extractions were **not** used.

## Permission analysis — logo inside custom button

### Apple

Explicit avoid-mistakes rules (guidelines page):

- “Be sure to use the badges provided by Apple. **Do not create your own versions.**”
- “**Do not use the Wallet icon alone.**”
- “Do not obstruct the badge… Do not flip, rotate… Do not add visual effects…”
- For email/web: use Apple-provided **SVG badge artwork** as the control.

**Verdict:** Placing an Apple Wallet icon (or cropped badge mark) next to custom label text inside a magenta Eveenty button = **creating a custom badge / using icon alone** → **NOT PERMITTED**.

### Google

Dos and don’ts (guidelines page):

- “Do: Use only the Add to Google Wallet buttons provided by Google.”
- “Don’t: Create your own Add to Google Wallet buttons or **alter the font, color, button radius, or padding** within the button in any way.”
- “Don’t: Alter the button color.”
- Button “only comes in black”; localized versions provided; do not create own localized text versions.

**Verdict:** A custom magenta outline button with a Google mark + Eveenty typography = **own button / altered color/geometry** → **NOT PERMITTED**.

## What was implemented instead

1. **Restored** original custom text buttons (magenta chrome) as the working preview — **no** provider logo inside.
2. **Comparison pack** includes complete-badge alternative visuals (production CDN complete badges labeled as such) for owner choice.
3. Did **not** silently ship logo-in-custom-button or claim official compliance.

## NEEDS OWNER DECISION

| Option | Description | Guideline fit |
|--------|-------------|---------------|
| **A (current)** | Keep restored custom magenta text buttons | Allowed as Eveenty UI; **not** an official Wallet badge |
| **B** | Use complete unmodified official Apple SVG + Google brand-kit black buttons | Compliant **when** official packs are obtained |
| **C** | Use complete unmodified Eveenty production CDN badges (yellow) as full clickable images | Matches current production template; **not** official black brand-kit |
| **D** | Custom button + official logo inside | **Rejected by both providers** — do not implement |

Owner must pick A/B/C. Option D remains disallowed.

## Credit / naming notes (if using official badges later)

- Typeset “Apple Wallet” / “Google Wallet” per editorial rules (capital G/W).
- Apple U.S. communications may require trademark credit lines when using Apple messaging.
- Do not imply Apple/Google partnership beyond pass save affordance.
