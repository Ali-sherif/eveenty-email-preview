# WALLET BUTTON RESTORATION

**Date:** 2026-09-25  
**Scope:** `festival_ticket_sale` + shared `walletActionButtons` / Figma `18:27` only  
**Owner visual approval:** pending

## Decision (this task)

Owner revoked use of yellow Eveenty CDN images as the **entire** Wallet button.

Restored the **original custom HTML/CSS** magenta outline buttons from the Email Kit (pre-CDN replacement).

**Logo-inside-custom-button was NOT implemented** — Apple and Google guidelines prohibit that combination. See `WALLET_BRAND_COMPLIANCE.md` → **NEEDS OWNER DECISION**.

## Original style restored (verified)

Source: `qa-output/approved-component-corrections/before/festival_ticket_sale.html` + git `HEAD` renderer prior to CDN change.

| Property | Value |
|----------|-------|
| Background | `#f9f9f9` (`light100`) |
| Border | `1px solid #d80073` (secondary) |
| Text | `#d80073` |
| Font | Roboto / kit body · **12px** · weight **500** |
| Padding | **12px 16px** |
| Min-height | **44px** |
| Radius | **8px** |
| Line-height | **1.3** |
| Gap between buttons | **6px** |
| Decoration | none |

## Files changed

| File | Change |
|------|--------|
| `shared/email-kit.js` | `walletActionButtons` restored to custom magenta text buttons; CDN image-button removed |
| `shared/render-emails.js` | Unchanged conditionals (buyer/guest show; organizer/admin omit) |
| `emails/festival_ticket_sale.html` | Regenerated |
| Figma Email Kit `18:27` / children `18:28`, `18:30` | Restored outline + label; image fills removed |
| TicketSale instance `21:53` | Inherits restored component |

Unrelated approved corrections (CTA, alerts, muted text, dividers, other six emails) **preserved**.

## Functionality preserved

- Google only when href present (preview sample for buyer/guest)
- Apple only when href present
- Preview destinations unchanged
- Calendar = text links only
- No wallet on other templates / organizer preview
- Backend untouched

## Screenshots

Under `screenshots/wallet-restore/` — **DISCARDED** (directory absent as of 2026-09-25). Former captures:

| File | Content |
|------|---------|
| `01-original-custom--desktop-800.png` | Pre-CDN custom buttons |
| `02-cdn-image-button--desktop-800.png` | Recent CDN image-as-button design |
| `03-restored-custom--desktop-800.png` | Restored custom buttons (later superseded by OD-W1 B official badges) |
| `04-complete-badge-alternative--desktop-800.png` | Complete badge alternative (production CDN unmodified) for owner decision |
| `restored--*.png` | Responsive / RTL / blocked / organizer |

Figma: component `18:27` screenshot + TicketSale `21:53` (still under `figma/`).

## QA

| Check | Result |
|-------|--------|
| Structural (magenta chrome, no CDN img, hrefs, calendar text, organizer omit) | **PASS** (0 fails) |
| Overflow 800/768/414/375/320 + AR | **PASS** |
| Figma/HTML parity (custom outline buttons) | **PASS** |
| Logo inside custom button | **NOT RUN / NOT IMPLEMENTED** (prohibited) |
| Gmail / Outlook / Apple Mail | **NOT RUN** |

## Unresolved — owner decision required

Whether to keep restored **custom magenta text buttons**, or switch to **complete unmodified official/provider badges** (Apple SVG/EPS / Google brand-kit black buttons, or continue production CDN complete badges). Combining official logos *inside* the custom chrome is **not** guideline-compliant.
