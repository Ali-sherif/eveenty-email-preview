# DELETE CANDIDATES — USER APPROVAL REQUIRED

**Policy:** Nothing listed here has been deleted. Final deletion decisions belong to the user before any push.

---

## Candidate 1

- **Exact path:** `email/templates/archive/legacy/welcome_email_ad.png`
- **Type:** static image asset (PNG)
- **Original path:** `email/templates/welcome_email_ad.png`
- **Current callers/references:** None found in Go source, templates, or docs (repo-wide search for `welcome_email_ad` returned zero matches).
- **Why it appears obsolete:** Appears unused by any Send* path or template include after archival.
- **Risk of deletion:** Low if truly unreferenced; medium if an external system or undocumented flow still expects the file at the old path.
- **Recommended action:** Confirm with Backend owner; if unused, delete after approval. Until then keep archived.
- **Status:** WAITING FOR USER APPROVAL

---

## Notes — intentionally NOT listed as delete candidates

The following remain required and must not be deleted without a separate, explicit decision after DEV/Prod confidence:

- All 48 IN_SCOPE archived legacy `.template` files (rollback / snapshot harness).
- All 11 EXCLUDED archived legacy `.template` files (still the live Legacy path).
- All 12 archived legacy partials (still parsed into every Legacy template).
- All Kit templates under `email/templates/kit/`.
- Legacy renderer / seam / MIME / attachment code paths.
- Snapshot / parity / audit tests and goldens.

No other delete candidates were identified during post-P4 local verification.
