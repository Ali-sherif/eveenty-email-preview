---
name: generate-email
description: Create one new Email Design Kit reference for an authorized, in-scope, not-yet-designed template. Requires explicit owner authorization for that specific template — creating this skill does not itself authorize using it.
---

## Activation criteria
Owner has explicitly authorized design of a specific in-scope, undesigned `template_id` (or an approved batch ID covering it). Without that authorization, use this skill only to explain the planned work — do not produce the design.

## Required input
`template_id` and explicit owner authorization (or approved batch ID).

## Prerequisites
1. Run `email-context` for this `template_id` first.
2. Confirm `docs/agent/PROJECT_STATE.md` records the **seven-email final technical gate** as **PASS**. If the gate is open/failed, stop and report — do not implement undesigned templates.

## Workflow
1. Identify the correct master layout and reusable modules for this template's Design Kit family (Transactional / Commerce / Notification / Marketing).
2. Inspect the relevant existing reference email (one of the seven, or the nearest family match) for pattern. Reuse the owner-approved component system (Primary CTA, header/localized logos, alerts, muted-text policy, dividers/shared modules, typography adaptations) via `shared/email-kit.js` / `shared/tokens.js` — do not re-derive or paste the full Design System into the report.
3. Preserve original production content and behavior — variables, conditional states, and **only the locales the backend template actually supports** (from catalog/traceability). Do not force en/ar/fr/es/fa onto every email. Do not treat prepared Wallet badge locales as proof of template language support.
4. Apply approved design tokens (see `docs/agent/PROJECT_STATE.md`) and `email-rendering-compatibility` constraints when writing HTML.
5. Implement in the existing Preview architecture (**HTML Preview only** for remaining Phase 1). Do not modify production backend templates.
6. Do **not** edit Figma unless the owner separately authorizes a Figma change for this template. If Figma work is requested but inaccessible, report blocked — don't guess Figma properties.
7. For Wallet actions (ticket/pass families only when production has them): use official Apple/Google badges from `assets/wallet/official/` — not custom CSS buttons or yellow Eveenty CDN badges. Preserve provider shapes; do not edit artwork. See `assets/wallet/official/README.md`.
8. Run focused deterministic validation (`node .agents/scripts/email-cli.mjs validate-template <id>`) for this template only.
9. Generate a compact design report. Do not change the template's owner-approval status yourself.

## Safety boundaries
No production backend or template changes. No Original Design System Figma edits. No CDN/commit/push/deploy. Preserve the seven existing references as-is (unless the owner authorized a separate technical-gate fix session).

## Expected output
New/updated Preview HTML design for this one template, plus a compact report. Figma artifacts only if separately authorized.

## Validation requirements
Focused browser QA for this template (Level A, see `email-rendering-compatibility` and `review-email`). Fresh checks only — do not claim historical packs as this session's PASS.

## Stop conditions
Stop if authorization is missing/ambiguous, scoped to a different template, the seven-email technical gate is not PASS, or the request expands into unauthorized production/Figma/backend work.
