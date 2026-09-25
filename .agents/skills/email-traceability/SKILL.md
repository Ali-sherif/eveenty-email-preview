---
name: email-traceability
description: Verify the relationship between one production template, its call sites, and its design — using the existing 59-row traceability CSV as source of truth. Focused, not a repeat of the full audit.
---

## Activation criteria
A specific template's mapping needs verification (new/changed design, or a reported inconsistency).

## Required input
One or more `template_id`s.

## Workflow
1. Look up the template in the existing traceability CSV (`Eveenty-Email-Kit-Phase1/organization/EMAIL_TEMPLATE_TRACEABILITY.csv`) first.
2. Only inspect actual backend call sites if the CSV entry is missing, ambiguous, or disputed — don't re-audit templates with a clean existing record.
3. Check template name, variables, locales, links, and behavior match between production and design.
4. When an eventual migration is authorized (not in this task), the contract is to preserve production filenames/paths by default.

## Safety boundaries
Read-only against backend. Never redo the full 59-template audit as part of a single-template task.

## Expected output
Confirmation or a documented discrepancy for the requested template(s), referencing exact source paths.

## Stop conditions
Stop and report if the backend source directory isn't accessible for verification.
