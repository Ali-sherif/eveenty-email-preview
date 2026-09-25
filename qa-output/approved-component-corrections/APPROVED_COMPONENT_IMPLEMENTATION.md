# APPROVED COMPONENT IMPLEMENTATION

**Date:** 2026-09-25  
**Mode:** Design implementation + verification  
**Scope:** Shared email components + seven existing reference emails only  
**Owner visual approval:** pending (not claimed)

## Approved specifications implemented

### Primary CTA (Original DS Large)
| Property | Value |
|----------|-------|
| Background | `#E9D023` |
| Text | `#4D4C49` |
| Font | Roboto Medium 500 |
| Size / LH | 16px / 1.4 |
| Padding | 13px × 24px |
| Radius | 12px |
| Target height | ~48px (expands for long labels) |
| Outlook | VML `roundrect` fallback + non-MSO anchor |

### Warning (Needs Response / Dispute)
| Property | Value |
|----------|-------|
| BG / Border / Radius / Pad | `#FFFBEB` / `#E6D1B9` / 16px / 16px |
| Title & body | `#92400E` (AA-safe; DS `#AD6F45` rejected) |
| Title type | Plus Jakarta Sans 16 / 600 / 1.3 |
| Body type | Roboto 16 / 400 / 1.4 |
| Gaps | 8px |
| Dismiss | omitted (email) |

### Error (Support environment block)
| Property | Value |
|----------|-------|
| BG / Border / Radius / Pad | `#FEF2F2` / `#E9C5C6` / 16px / 16px |
| Title | `#991B1B` |
| Body | `#4D4C49` (AA-safe; DS `#B75C5E` rejected) |

### Success (Registration approval)
| Property | Value |
|----------|-------|
| BG / Border / Radius / Pad | `#F0FDF4` / `#C5DFCF` / 16px / 16px |
| Text | `#166534` (AA-safe; DS `#629A77` rejected) |

### Text / dividers / header
- Dark-700 `#2B2A28` headings; Dark-500 `#4D4C49` body & meaningful secondary
- Divider `#EBEBEB` (footer `#e5e5e5` corrected where branded footer applies)
- Header `#FEFDF4`, logo 160px preserved
- Container max 600px; card border used instead of shadow-only separation

## Source files changed

| Path | Change |
|------|--------|
| `shared/tokens.js` | Warning/error/success AA tokens; status alert geometry; CTA metrics |
| `shared/email-kit.js` | `statusAlert()` shared component; `primaryCtaYellow` DS Large + VML; `walletActionButtons`; footer divider; container border; kvRow Dark-500 |
| `shared/render-emails.js` | Dispute warning + Event Info; Support error alert; Reg success alert; Ticket wallet row; muted→Dark-500 |
| `emails/*.html` (7) | Regenerated via `node generate-standalone.mjs` |

## Figma nodes changed (Email Kit `yz7YggnG4H2RuUd23f9zPk`)

| Frame | Node | Change |
|-------|------|--------|
| Activation `4:2` | CTA `4:14`, label `4:15`, footer `4:16` | Pad 13/24, Medium, divider `#ebebeb` |
| RegApproval `48:45` | Alert `48:53`/`48:54`, CTAs `48:59`/`49:88` | Success AA + CTA Large |
| Support `22:113` | Alert `22:122`/`22:123` | Radius 16; Environment title / production body |
| Dispute EN `72:44` | Alert `72:54`–`72:56`, team `72:110`, CTA label | Warning DS + AA; team Dark-700 |
| Dispute AR `72:111` | Alert `72:121`–`72:123`, team `72:174` | Same Warning + AA |
| TicketSale `21:53` | Wallet `I21:76;18:28`–`31` | Accessible text-link chrome (badges BLOCKED) |
| Shared CTA set `3:12` | Primary LTR `3:6` | Approved Large metrics |

Original Design System `DeMR3FHvQbVJYmwStKivVg`: **not modified** (read-only).

## BLOCKED

| Item | Reason |
|------|--------|
| Real Gmail / Outlook / Apple Mail QA | Level B not executed |

### Resolved
| Item | Resolution |
|------|------------|
| Wallet badges | **PASS** — reused production CDN `https://cdn.eveenty.com/google_wallet.png` and `apple_wallet.png` (see `WALLET_ASSET_VERIFICATION.md`) |

## Not changed

- Backend / production templates / YAML
- Owner logo PNGs
- Remaining 41 undesigned templates (still undesigned)
- `organizer_announcement` remains IN_SCOPE · UNDESIGNED
- Catalog IDs / preview routes
