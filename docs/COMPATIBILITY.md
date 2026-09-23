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
- Web fonts not required for layout; system/Arial/Helvetica/Tahoma fallbacks.
- No JavaScript inside email documents.
- Images: explicit `width`/`height`, `alt`, and blocked-image simulation in the preview app.
- MSO conditional comments for basic Outlook font hints only (not full VML button suite yet).

## What this preview does **not** prove

Browser iframe rendering ≠ Gmail, Outlook desktop, Outlook.com, Apple Mail, or Yahoo. Formal client QA is explicitly out of Phase 1 scope.
