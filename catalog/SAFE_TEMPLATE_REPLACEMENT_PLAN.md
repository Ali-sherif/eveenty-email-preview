# SAFE_TEMPLATE_REPLACEMENT_PLAN.md

**Date:** 2026-09-24  
**Status:** Contract only — **DO NOT IMPLEMENT** production replacement yet  
**Principle:** Prefer preserving the original production template **filename and path**.

---

## 1. Default replacement strategy (preferred)

For each in-scope template:

1. Keep `email/templates/<name>.template` path and `mustNewTemplate("<name>")` registration key.
2. Keep Go field names and all `Send*` function signatures.
3. Keep subject construction and locale selection behavior unchanged unless a later owner-approved i18n task says otherwise.
4. Replace **HTML body markup only** inside the same file (or same define blocks), preserving:
   - Template variable names consumed by Go senders
   - Partial invocation names (`{{ template "header_*" }}`, footers) **or** inline-equivalent chrome that still satisfies partial contracts
   - Conditional branches (`{{ if }}`) that gate CTAs, admin vs user copy, evidence deadlines, etc.
5. Deploy behind existing send paths — no lookup-table migration required.

**Canonical identity** = original filename (`activate_email.template`, etc.). Catalog display names and Design Kit folders are metadata only.

---

## 2. When a new filename/path would be required

Only if technically infeasible to keep the original path (not expected for Phase 1 HTML swap). Document and execute:

| Step | Required record |
|---|---|
| Old path | `email/templates/<old>.template` |
| New path | `email/templates/<new>.template` |
| Registration | Update `mustNewTemplate` in `email/smtp_render_template.go` |
| Struct field | Update `smtp_model.go` field if renamed |
| All Execute sites | Every `c.<field>.Execute` |
| Nested parses | e.g. `marketing_approval_1` + `marketingN` |
| Config / switches | e.g. `EmailTemplate` "template 1"…"template 4" |
| Migration | Dual-read period optional; feature flag if available |
| Rollback | Restore previous file from VCS; redeploy |

**No such rename is proposed for the 48 in-scope templates at this time.**

---

## 3. Shared-template rules

Several physical templates are executed by **multiple** Send* functions (donation, ticket sale, refunds, installments, registration, disputes, etc.).

Rules:

- One physical file → one HTML redesign → all recipient paths inherit it.
- Do **not** fork per-recipient files unless product explicitly requires it.
- Preserve recipient branching already encoded in template variables (`SendTo`, `RecipientType`, admin EN).
- Catalog may list shared workflows as metadata links — **never duplicate** the physical catalog identity.

---

## 4. Partial / chrome dependencies

| Concern | Contract |
|---|---|
| Shared partials | If redesign still calls existing partials, update partials carefully (blast radius across templates). Prefer shell components in Design Kit that map 1:1 to partial roles. |
| Excluded-only partials | `header_2` / `footer_1` used by excluded `receipt` — do not force in-scope templates onto them. |
| Intentional kit deltas | e.g. support branded header vs production `header_3` — must be explicitly owner-approved before production swap. |

---

## 5. Special features contract

| Feature | Production observation | Replacement requirement |
|---|---|---|
| QR | Image URL params (e.g. `QRCodeImageLink`) | Keep param names; render `<img>` with same vars |
| Wallet | Google/Apple Wallet **links** in ticket info | Keep URL fields; do not invent attachment MIME unless backend adds it |
| Calendar | Google/Yahoo/Apple links + `FestivalICSData` string in HTML | Keep generators in Go; preserve template vars |
| Attachments | Current `smtp.SendMail` path uses **single HTML body** (no MIME parts observed) | Do not assume `.pkpass`/`.ics` file attachments exist unless a later backend change adds them |
| Unsubscribe | Marketing `UnsubsribeURl` (production spelling) | Preserve field name until a coordinated rename |
| Nested marketing | Approval embeds marketing1–4 | Out of Phase 1 exclusions — do not break composite parse |

---

## 6. Regression test matrix (required before each production swap)

### Behavioral

- [ ] Trigger still fires from documented API/cron/helper
- [ ] Correct recipients for each Send* path
- [ ] Subject strings unchanged (or deliberately versioned)
- [ ] Locale selection: ProfileLanguage / forced EN / none — unchanged
- [ ] Fallback when language missing still matches `GetValidProfileLanguage` behavior

### Content / render

- [ ] All required template variables still populated by Go
- [ ] Conditional blocks (CTA present/absent, Stripe Connect copy, evidence deadline) still evaluate correctly
- [ ] Header/footer/partials render without parse errors
- [ ] RTL (`HTMLDir`/`Dir`) for ar/fa where applicable
- [ ] HTML escaping of user/author-supplied fields preserved (`text/template` auto-escape unless explicitly piped unsafe)

### Transport

- [ ] HTML body renders in clients under test
- [ ] Plain-text alternative: **currently absent** in production — do not require unless product adds it; if added, test multipart structure
- [ ] MIME structure: confirm still matches current SendMail usage
- [ ] QR images load (or graceful broken-image)
- [ ] Wallet / calendar URLs remain valid shapes
- [ ] ICS data still present when previously present

### Security

- [ ] **HTML Injection:** author HTML / user fields do not introduce unintended scriptable markup beyond existing allowing pipes
- [ ] **Header Injection:** subjects/addresses reject CR/LF
- [ ] **Unsafe URLs:** activation, reset, CTA, unsubscribe, wallet, calendar links remain allowlisted/trusted hosts as today

---

## 7. Rollout sequence (future — not this task)

1. Owner visual approval of references.
2. Per-template HTML implementation PR (backend write phase).
3. Staging send tests for each recipient variant.
4. Production deploy with rollback plan (revert template file).
5. Update preview `design_status` → `PRODUCTION_REPLACED` only after deploy.

---

## 8. Explicit non-goals for this document

- No backend code changes
- No YAML changes
- No production template edits
- No Phase F design rollout authorization
