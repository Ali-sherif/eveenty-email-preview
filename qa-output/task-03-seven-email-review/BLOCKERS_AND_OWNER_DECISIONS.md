# Remaining blockers and owner visual decisions

## STOP

Await **owner visual approval** of these exact seven emails before:
- Phase F catalog rollout
- Additional templates beyond the seven
- Any production backend / YAML / MIME changes

## Owner visual decisions needed

1. **Registration approval CTA color** — Design kit applies yellow `#E9D023` / dark `#4D4C49` (Activation standard). Production `festival_ticket_registration_approval.template` still uses magenta `#d80073` / white. Confirm design-kit yellow for Phase 1 Figma/preview, or retain magenta to match current production chrome.
2. **Support chrome** — Preview uses branded header + 160px Eveenty logo (design kit). Production uses `header_3` + large CDN footer logo (`eveenty-logo-1280.png` at ~380px). Confirm design-kit header is acceptable for the internal ops reference.
3. **Marketing chrome language** — EN-only chrome frames (production footer/preferences English; author body freeform). Confirm EN-only is correct.
4. **Spanish logo optical density** — Uniform 160 retained (Activation decision). Optional narrower ES display width still open if optical parity desired.
5. **Additional Figma locale frames** — Donation / RegApproval / Support / Ticket / Dispute FR·ES·FA Figma frames can follow after approval (preview already has YAML-backed locales where production supports them).
6. **Catalog page still labeled “48”** — Should become **47** when Phase F opens.
7. Confirm **`organizer_announcement` stays excluded**.

## NOT EXECUTED / NOT VERIFIED this pass

| Item | Status |
|---|---|
| Real Gmail / Outlook / Apple Mail rendering | **NOT EXECUTED** |
| Fresh Figma image-byte re-verify for Ticket/Dispute/Marketing fills | Not re-run; Activation EN logo hash reused for remediated frames |
| Phase F remaining ~40 in-scope templates | **HOLD** |
| Backend / YAML / send-path changes | **OUT OF SCOPE** (correctly untouched) |

## Known INFO notes (non-blocking)

- ES logo denser ink at 160px (Activation known).
- RTL greeting bidi presentation follows Unicode/production strings.
- Dispute admin path forced EN.
- Marketing uses festival logo slot, not Eveenty wordmark header.
