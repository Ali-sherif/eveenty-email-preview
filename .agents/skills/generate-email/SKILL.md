---
name: generate-email
description: Create one new Email Design Kit reference for an authorized, in-scope, not-yet-designed template. Requires explicit owner authorization for that specific template — creating this skill does not itself authorize using it.
---

## Activation criteria
Owner has explicitly authorized design of a specific in-scope, undesigned `template_id` (or an approved batch ID covering it). Without that authorization, use this skill only to explain the planned work — do not produce the design.

## Required input
`template_id` and explicit owner authorization (or approved batch ID).

## Prerequisite
Run `email-context` for this `template_id` first.

## Workflow
1. Identify the correct master layout and reusable modules for this template's Design Kit family (Transactional / Commerce / Notification / Marketing).
2. Inspect the relevant existing reference email (one of the seven, or the nearest family match) for pattern.
3. Preserve original production content and behavior — variables, conditional states, locale/RTL behavior.
4. Reuse the approved design tokens (colors, type, logo sizing — see `docs/agent/PROJECT_STATE.md` for the current approved values) and the `email-rendering-compatibility` skill's constraints when writing the HTML.
5. Implement in the existing Preview architecture; do not modify production backend templates.
6. If Figma access is authorized and available, prepare the corresponding Figma workflow; if not accessible, do the local HTML work and report the blocked step — don't guess Figma properties.
7. Run focused deterministic validation (`scripts/email-validate-template`) for this template only.
8. Generate a compact design report. Do not change the template's owner-approval status yourself.

## Safety boundaries
No production backend or template changes. No changes to the original Figma Design System. Preserve the seven existing references as-is.

## Expected output
New/updated Preview design for this one template, plus a compact report and (if authorized) a Figma workflow artifact.

## Validation requirements
Focused browser QA for this template (Level A, see `email-rendering-compatibility` and `review-email`).

## Stop conditions
Stop if authorization is missing, ambiguous, or scoped to a different template than requested.
