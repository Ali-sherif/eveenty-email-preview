---
name: email-context
description: Retrieve the minimum necessary context for one physical email template by ID, from the canonical catalog/traceability data — not by scanning the whole repo. Use whenever a task names a specific template.
---

## Activation criteria
A task references one specific template (by name or ID) and you need its mapping, family, variables, locale behavior, or design status before acting.

## Required input
`template_id` (exact catalog ID or template name).

## Workflow
1. Resolve `template_id` against the canonical 59-template catalog (`catalog/email-catalog.json` and/or the traceability CSV under `Eveenty-Email-Kit-Phase1/organization/`) — do not guess a match.
2. Retrieve only this template's record: original name + exact path, backend family, Design Kit family, functional subfolder, scope status, design status, production call sites, variables, locale behavior, relevant partials, special features, existing reference design (if any), existing QA/mapping notes. Treat `locale_behavior` / production locales as the language scope for this template — do not infer five-language support from Wallet badge asset coverage.
3. If the catalog entry is missing or looks stale, inspect the actual production file directly and report the discrepancy — do not fabricate a mapping.
4. Load only the source files this template's record actually references — never the full backend or all 59 records.

## Safety boundaries
Read-only. No modification of catalog, production, or Figma files.

## Expected output
A compact structured context package (the fields above) for this one template.

## Validation
The catalog match must be exact (ID or unambiguous name); if ambiguous, ask rather than guess.

## Stop conditions
Stop and report if the catalog/traceability source is inaccessible, or if the template ID doesn't resolve to exactly one record.
