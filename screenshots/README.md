# Email preview screenshots

PNG captures for owner visual review. Browser / Playwright renders only — **email-client rendering tests NOT EXECUTED**.

## Account Activation (Task 02 — awaiting owner approval)

| File | What |
|------|------|
| `activate_email-desktop-800.png` | HTML EN desktop ~800 |
| `activate_email-mobile-375.png` | HTML EN mobile 375 |
| `activate_email-mobile-320.png` | HTML EN mobile 320 |
| `activate_email-ar-rtl-800.png` | HTML AR RTL ~800 |
| `preview-app-activate-ar-800.png` | Preview chrome showing outside-canvas preheader annotation |
| `figma/activate-en-desktop-800.png` | Figma EN 800 (node `4:2`) |
| `figma/activate-en-mobile-320.png` | Figma EN 320 |
| `figma/activate-en-mobile-375.png` | Figma EN 375 |
| `figma/activate-ar-rtl-800.png` | Figma AR RTL 800 |

Figma file: https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2

## Other Phase-1 references (unchanged this task)

| File | Email |
|------|--------|
| `festival_donation-desktop-800.png` / `festival_donation-mobile-375.png` | Festival donation |
| `festival_ticket_sale-desktop-800.png` / `festival_ticket_sale-mobile-375.png` | Ticket sale |
| `festival_ticket_registration_approval-desktop-800.png` / `festival_ticket_registration_approval-mobile-375.png` | Ticket registration approval |
| `support-desktop-800.png` / `support-mobile-375.png` | Support |

## Regenerate HTML captures

```bash
npm install
npx playwright install chromium
node capture-screenshots.mjs
```

Requires `"type": "module"` in `package.json`.

