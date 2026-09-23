# Email container width & compatibility strategy

## Decision

Use **Fluid Hybrid 600**:

| Layer | Width | Role |
|-------|-------|------|
| Figma desktop frame | 800px | Design canvas (includes ~100px side padding) |
| Email content shell | **600px max** | Labeled “Container / 600 max” on all five frames |
| Hybrid behavior | `width:100%; max-width:600px` | Shrinks on narrow viewports |
| Preview chrome | 800 / 768 / 600 / 414 / 375 / 320 | Inspection only |

## Why not 800px fixed email width?

1. Figma itself documents Fluid Hybrid **600** on the commerce/ticket/support annotations.
2. 600px remains the safest historical default for many desktop clients’ readable column.
3. An 800px fixed table overflows or forces horizontal scroll on common mobile clients.

## Deviations from Figma that are required for email

- No flex/grid for critical structure → nested `<table role="presentation">`.
- Critical styles inlined; `@media` only for progressive enhancement (wallet stack, container fluid).
- **Account Activation typography intent (Figma):** headings `Plus Jakarta Sans`; body/CTA `Roboto`. Preview stacks put the approved family first, then realistic client fallbacks (`Arial, Helvetica[, Tahoma], sans-serif`). AR/FA Activation uses `Tahoma, Arial, Helvetica, sans-serif` per Figma note. **Web-font loading / cross-client rendering is NOT claimed** — formal email-client matrix **NOT EXECUTED**.
- Other Phase-1 templates still use the legacy Arial-first shared stack until their review pass.
- No JavaScript inside email documents.
- Images: explicit `width`/`height`, `alt`, and blocked-image simulation in the preview app. Logo `../assets/logos/...` paths are **local preview assets only**; production image hosting remains **DEFERRED** (no invented CDN URLs).
- MSO conditional comments for basic Outlook font hints only (not full VML button suite yet).

## Account Activation CTA (preview note)

| Spec | Value |
|------|-------|
| Figma CTA | ~230×51, `min-height: 48`, padding 16×40, radius 12, yellow `#e9d023` |
| Preview approach | Height from **anchor padding + line-height**, not `td { min-height }` |
| Touch target | `min-width: 44px`; horizontal padding keeps readable tap area on 320/375 |
| Outlook | Do **not** rely solely on cell `min-height` — often ignored. Full VML/bulletproof buttons **DEFERRED** (Task 02: no production engineering). |
| Client tests | **NOT EXECUTED** |

## What this preview does **not** prove

Browser iframe rendering ≠ Gmail, Outlook desktop, Outlook.com, Apple Mail, or Yahoo. Formal client QA is explicitly out of Phase 1 scope.
