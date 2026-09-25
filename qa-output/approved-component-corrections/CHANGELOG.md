# CHANGELOG — Approved component corrections (2026-09-25)

## Latest — Official multilingual Wallet badges (OD-W1 B)

- Replaced custom magenta Wallet text buttons with **official** Apple/Google complete badges for `festival_ticket_sale` only.
- Locales: `en`, `ar`, `fr`, `es`, `fa` (Persian Apple → English official fallback).
- Assets: `assets/wallet/official/{google,apple}/*.png` (+ source originals).
- Helper: `walletActionButtons` locale-aware `<img>` badges; calendar text links unchanged.
- Figma **not** updated this session. CDN upload **not** performed.
- Report + QA: `OFFICIAL_MULTILINGUAL_WALLET_BADGES.md`, `wallet-official-qa-results.json` (machine results). **All testing PNGs discarded** 2026-09-25 (`qa-output/**` captures/Figma exports, root `screenshots/`, unused `assets/figma-activate-export.png` + `eveenty-logo-en-cdn.png`). Mail-used PNGs kept under `assets/logos/` + `assets/wallet/official/`.

## Implemented (prior)

### Shared
- Added `statusAlert({ variant })` supporting warning / error / success / info with shared pad/radius/gap and variant colors.
- Updated `primaryCtaYellow` to Original DS Large (13×24 pad, Roboto Medium 500, LH 1.4, VML Outlook fallback).
- `walletActionButtons` — now **official multilingual badges** (was briefly custom magenta text after CDN revoke).
- Footer divider `#e5e5e5` → `#ebebeb` on branded footer.
- Outer email container: 1px `#ebebeb` border; removed reliance on box-shadow alone.
- Tokens: warning/error/success AA colors; CTA metrics; Dark-500 preferred for meaningful secondary text.

### Per email
1. **activate_email** — CTA + footer divider.
2. **festival_donation** — Dark-500 secondary; shared chrome.
3. **festival_ticket_sale** — Official multilingual Wallet badges (OD-W1 B). Calendar text links preserved. Buyer/guest only.
4. **festival_ticket_registration_approval** — Success status alert `#166534`; CTA Large; Dark-500 labels.
5. **support** — Error status alert (Environment title / production body).
6. **dispute_notification** — Warning DS colors; removed yellow event-name text; removed yellow Event Info accent bar; team name Dark-700; AR Figma synced.
7. **festival_marketing_email_target** — Shared container border only; festival chrome unchanged.

### Figma Email Kit
- Prior frames updated in earlier session; **Wallet Links not re-synced** for OD-W1 B (Figma forbidden this session).

## Closed owner decisions

| ID | Topic |
|----|-------|
| OD-2 | **CLOSED — OWNER APPROVED (Option A, 2026-09-26):** keep DS Warning `#E6D1B9` / Error `#E9C5C6` as decorative; status via accessible text/headings/icons; do not strengthen or change borders |

## Remaining owner decisions

| ID | Topic |
|----|-------|
| OD-W1 | **B implemented in Design Kit HTML** — awaiting visual approval + CDN deploy auth. A/C superseded for this preview unless owner reverts. |
| OD-CDN | Authorize upload of `assets/wallet/official/**` to `cdn.eveenty.com/wallet/official/…` |
| OD-3 | Owner visual approval of corrected seven references |
| OD-4 | Any card radius/padding redesign beyond approved status-alert 16px (not in this task) |

## Explicitly not done
- No design of remaining 41 templates
- No backend / production / Original DS edits
- No Figma edits this session
- No CDN upload
- No commit / push / deploy
- No claim of owner visual approval
- No Level B email-client QA
