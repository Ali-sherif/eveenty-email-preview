---
name: email-security-review
description: Focused, read-only review of email-related security concerns (HTML injection/escaping, sanitization boundaries, unsafe URLs, header injection, MIME/attachment safety). An audit skill — never authorizes fixing production code.
---

## Activation criteria
Explicit request for a security review of email-related code paths. Not triggered automatically by design or QA tasks.

## Required input
Scope (which templates, call sites, or components to review).

## Workflow
1. Review relevant code paths (read-only) for: HTML injection, HTML escaping, unsafe trusted-HTML usage, sanitization boundaries, unsafe URLs, email header injection, CR/LF/NUL handling, MIME/attachment safety, frontend rich-text preview rendering.
2. The backend uses Go `text/template` for legacy email rendering — do not recommend blindly swapping to `html/template` inside complete MIME message templates without accounting for header/MIME context.
3. Distinguish plain text vs. sanitized rich HTML vs. trusted system-generated fragments vs. URLs/attributes vs. MIME headers — each has different escaping requirements.
4. Distinguish confirmed vulnerabilities (with source evidence) from theoretical risk from areas needing further verification.
5. Never copy real credentials, customer data, or secrets into the findings report or fixtures — use synthetic data only.

## Safety boundaries
Strictly read-only. No fixes, no refactors, even for confirmed issues — record and hand off separately.

## Expected output
A prioritized, source-backed findings report with severity and confidence level per finding.

## Stop conditions
Stop before making any code change; a finding is a deliverable, not a trigger to fix.
