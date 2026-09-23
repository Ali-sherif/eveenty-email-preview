# Figma ↔ HTML visual deviation log

Status: **DRAFT** implementations for owner review. Not APPROVED. Browser-only captures — not email-client certification.

| ID | Area | Figma | HTML preview | Severity | Rationale |
|----|------|-------|--------------|----------|-----------|
| D01 | Canvas width | 800px frame | 600px max container in 800px viewport chrome | Intentional | Spec: Fluid Hybrid 600; frame includes side gutters |
| D02 | Fonts (Activation) | Plus Jakarta Sans headings / Roboto body | Approved family first + email fallbacks; AR/FA Tahoma-first | Intentional | Web-font compatibility not claimed; client tests NOT EXECUTED |
| D02b | Fonts (other refs) | Same kit intent | Legacy Arial-first shared stack | Deferred | Unchanged until Commerce/Notification review |
| D03 | Activate CTA | Yellow `#e9d023` / dark text; ~48–51px via padding | Matches; no `td` min-height dependence | — | Differs from current prod magenta; Outlook VML deferred |
| D04 | Activate emoji | Wave in greeting | Kept | — | Matches Figma + prod |
| D05 | Donation KV layout | Single stacked justify-between rows | Table KV rows | Low | Email-safe equivalent; avoids CSS flex |
| D06 | Totals box | Yellow + cream grand-total band | Table recreation | Low | Approximate radius/padding; Outlook will flatten some radius |
| D07 | Ticket QR | “QR CODE” text placeholder | SAMPLE patterned SVG + alt | Intentional | Safe fixture; not a live ticket |
| D08 | Wallet buttons | Side-by-side | Side-by-side; stack on ≤620px | Low | Fluid hybrid |
| D09 | Social icons (reg approval) | CDN icon row annotation | Text placeholders `[WA] [LI]…` | Medium | Avoids hotlinking; swap to CDN icons when approved |
| D10 | Reg approval alert greens | `#f0fdf4` / `#c5dfcf` / `#629a77` | Same tokens | — | Differs from older prod `#d4edda` / `#28a745` |
| D11 | Support heading | No emoji | No emoji | — | Prod template still has ⛔ |
| D12 | Support footer | Minimal ops copy | Matches Figma | — | Prod has large trailing logo |
| D13 | Figma annotation blocks | Present under designs (incl. Activation preheader metadata outside canvas) | Omitted from email HTML; Activation preheader in preview chrome only | Intentional | Not customer-facing |
| D14 | Box shadow on cards | Subtle | Included; stripped by many clients | Low | Progressive enhancement |
| D15 | Logo asset | Figma MCP PNG export | Local `../assets/logos/...` preview paths only | Low | Production image hosting DEFERRED — no invented URLs |
| D18 | Visible preheader row | Removed from Activation email canvas (Task 02) | Removed from Activation HTML; hidden preheader retained | — | Inbox preview only |
| D16 | Ticket-sale specialized modules (rooms/addons) | Not on ref frame | Not rendered | Intentional | Follow Figma reference; note gap in parity doc |
| D17 | RTL logos | Localized wordmarks | Local `eveenty-logo-{ar,fa}.png` in preview | Low | Production hosting DEFERRED |

## Unresolved visual questions for owner

1. Confirm yellow vs magenta primary CTA for TRANSACTIONAL activate.
2. Approve text social placeholders vs restore CDN icon strip before QA.
3. Confirm omission of room/add-on modules from Ticket/Pass reference HTML.
