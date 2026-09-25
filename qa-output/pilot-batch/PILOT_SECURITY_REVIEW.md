# Pilot security review

**Scope:** six pilot previews, with focused read-only backend evidence for dynamic announcement content. No backend changes were made.

## Findings

### HIGH · Organizer announcement subject reaches an RFC message header without visible CR/LF validation

- `api/v1/festival.go` decodes `festivalSendEmail.Subject` directly from JSON with no validation tags or normalization, then passes it to `SendOrganizerAnnouncement`.
- `email/smtp_organizer_emails.go` assigns it directly to `organizerAnnouncementTemplateParams.Subject`.
- `email/templates/organizer_announcement.template` renders it in `Subject: {{ .Subject }}` using the backend's complete-message `text/template` path.
- A subject containing CR/LF could therefore create an email-header injection path unless an uninspected upstream middleware or SMTP library rejects it. Confidence: **high** for the missing local boundary; exploitability still needs an authorized backend test.

**Action:** backend owner should add an explicit header-value validation boundary rejecting CR, LF and NUL before template execution. This pilot does not authorize that production change.

### MEDIUM · Organizer announcement body is caller-controlled HTML with no visible sanitization boundary

- `festivalSendEmail.Body` is decoded directly and passed through the same send path.
- `organizer_announcement.template` inserts `{{ .Body }}` inside the HTML body while the complete MIME message is rendered with Go `text/template`.
- This permits arbitrary markup and URLs in the outgoing announcement. It may be intentional rich content, but no sanitizer/trusted-author boundary is visible in the inspected path. Confidence: **high** for unsanitized insertion; business intent is **unknown**.

**Action:** define the field as plain text (escape it) or sanitize against an email-safe allowlist at the authoring boundary. Do not blindly swap the complete MIME template to `html/template`, because headers and MIME content require context-specific handling.

## Preview implementation result

**PASS.** `shared/pilot-renderers.js` escapes the synthetic announcement subject/body and every synthetic contact/refund/registration value before insertion. Preview links are fixed `mailto:`/synthetic URLs; no real credentials or customer data are present.
