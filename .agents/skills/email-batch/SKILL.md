---
name: email-batch
description: Plan and execute a small, explicitly authorized group of related undesigned templates that share modules. Never auto-processes all 41 remaining templates or starts a broader rollout without owner approval.
---

## Activation criteria
Owner has authorized a specific, bounded batch of related `template_id`s (same family / shared modules) — not "do the rest."

## Required input
List of authorized `template_id`s, or an approved batch ID.

## Prerequisites
1. `docs/agent/PROJECT_STATE.md` records the **seven-email final technical gate** as **PASS**.
2. Each ID is in-scope, undesigned, and covered by the owner's authorization.

## Workflow
1. Use the verified family/subfolder mappings (`email-context` per template) to confirm every ID in the batch actually shares reusable modules.
2. Keep the batch to a manageable size; if the shared module is new/unvalidated, design one pilot template first via `generate-email` and stop if it surfaces a shared design-system issue.
3. Once the pilot is validated, reuse its validated layout for the rest of the batch rather than re-deriving it each time. Locales remain **per template** from backend support — do not apply one global five-locale matrix to the batch.
4. Produce individual mapping (`email-traceability`) and QA (`review-email`) results per template — batch-level "all pass" summaries are not sufficient.
5. Scope remains **HTML Preview only** unless the owner separately authorizes Figma for specific IDs.

## Safety boundaries
Same as `generate-email`. Do not expand the batch beyond the authorized ID list during execution. No production/backend/CDN/commit/push/deploy. Do not start because historical QA looked green.

## Expected output
Per-template design + QA + mapping results, plus a short batch summary.

## Stop conditions
Stop immediately if the seven-email technical gate is not PASS, the pilot exposes a shared design-system defect, or if asked to extend beyond the authorized list / auto-roll out all 41.
