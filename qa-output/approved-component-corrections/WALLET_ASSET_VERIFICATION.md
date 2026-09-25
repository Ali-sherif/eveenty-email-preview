# WALLET ASSET VERIFICATION

**Date:** 2026-09-25  
**Template:** `festival_ticket_sale` only  
**Sources:** production `email/templates/festival_ticket_sale.template` (READ ONLY) · CDN · Email Kit HTML/Figma

## Production behavior (verified)

| Item | Production fact |
|------|-----------------|
| Google badge image | `https://cdn.eveenty.com/google_wallet.png` |
| Apple badge image | `https://cdn.eveenty.com/apple_wallet.png` |
| Google action | `<a href="{{$ticket.GoogleWalletPassLink}}">` — shown only if `GoogleWalletPassLink` set |
| Apple action | `<a href="cid:ticket-{{n}}.pkpass">` — shown only if `AppleWalletPassFile` set |
| Apple attachment | MIME `application/vnd.apple.pkpass` per ticket when file present |
| Calendar | **Text links** Google \| Apple \| Yahoo (`GoogleCalendarLink` / `AppleCalendarLink` / `YahooCalendarLink`) |
| Calendar attachment | Always `event.ics` (`FestivalICSData`) at end of multipart |
| Display width | `width="180"` on both badge `<img>`s |
| Send paths | Buyer / Guest / Organizer / Admin share the same template; wallet cells are per-ticket conditionals |

Send functions inspected: `SendFestivalTicketSaleToBuyerUser`, guest/organizer/admin counterparts in `email/smtp_*.go` (read-only).

## CDN asset inspection

| Asset | Intrinsic | Format | Visual |
|-------|-----------|--------|--------|
| `google_wallet.png` | **335×48** | PNG 32-bit ARGB | Yellow rounded badge · Google Wallet card stack icon · “Add to Google Wallet” |
| `apple_wallet.png` | **335×48** | PNG 32-bit ARGB | Yellow rounded badge · Apple Wallet card icon · “Add to Apple Wallet” |

Local audit copies: `wallet-audit/google_wallet.png`, `wallet-audit/apple_wallet.png` (+ `assets/wallet/` for offline reference).

## vs official Apple / Google brand-kit badges

| Criterion | Official brand kits | Eveenty CDN assets | Assessment |
|-----------|---------------------|--------------------|------------|
| Artwork source | Apple Developer / Google Wallet brand downloads | Eveenty production CDN | **Production-authorized** for this email |
| Color | Official black (Google) / black (Apple) badges | **Eveenty yellow** brand chrome | Brand-adapted, not brand-kit black |
| Proportions | Wide horizontal badge; Google min height 48dp | Intrinsic **48px** tall, ~7:1 wide | **Aligned** with badge geometry |
| Mutability | Do not recolor / recreate | Unmodified CDN files reused by URL | **No invented artwork** |
| Email display | Provider guidance | Production `width="180"` (~26px rendered height) | **Matches production** (not brand-kit 48dp on-page) |

**Suitability verdict:** **PASS for Email Kit reuse** — these are the exact assets already shipped in production `festival_ticket_sale`. They are Eveenty-hosted production badges (not a fresh Apple/Google brand-kit download). Official black brand-kit variants were not required once production mapping was verified.

## Design Kit implementation

| Surface | Status |
|---------|--------|
| HTML `emails/festival_ticket_sale.html` | CDN `<img>` badges, width 180, meaningful `alt`, conditional on buyer/guest (passes available) |
| Shared helper `walletActionButtons` | Uses CDN URLs; omits badge when href empty |
| Figma Wallet Links `18:27` / TicketSale `21:53` | Image fills from same PNGs; frames 180×26; instance inherits |
| Calendar | Remains text links only |
| Other six references | No wallet badges introduced |

## QA (this session)

| Check | Result |
|-------|--------|
| Asset download + measure | **PASS** |
| Structural HTML (CDN, alt, hrefs, calendar text, organizer omit) | **PASS** (0 fails) |
| Responsive 800/768/414/375/320 + AR + blocked-image | **PASS** (0 overflow fails) |
| Figma/HTML parity (CDN artwork on TicketSale wallet row) | **PASS** |
| Gmail / Outlook / Apple Mail | **NOT RUN** |

Evidence: `wallet-qa-results.json` (if present). Visual captures under `screenshots/wallet/` and QA Figma PNG exports — **DISCARDED** 2026-09-25. Live Figma Kit remains the design reference.

## Wallet item status

**PASS** — production CDN assets verified, reused in HTML + Figma, focused QA passed.
