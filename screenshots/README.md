# Email preview screenshots

PNG captures of the five reference emails at desktop (800) and mobile (375) widths.

## Regenerate

From `email-preview/`:

```bash
npm install
npx playwright install chromium
node capture-screenshots.mjs
```

Requires `"type": "module"` in `package.json` (ESM imports in `capture-screenshots.mjs`).

Output files:

| File | Email |
|------|--------|
| `activate_email-desktop-800.png` / `activate_email-mobile-375.png` | Account activation |
| `festival_donation-desktop-800.png` / `festival_donation-mobile-375.png` | Festival donation |
| `festival_ticket_sale-desktop-800.png` / `festival_ticket_sale-mobile-375.png` | Ticket sale |
| `festival_ticket_registration_approval-desktop-800.png` / `festival_ticket_registration_approval-mobile-375.png` | Ticket registration approval |
| `support-desktop-800.png` / `support-mobile-375.png` | Support |

Optional: copy any matching files from `%LOCALAPPDATA%\Temp\cursor\screenshots\` (names containing `activate`, `donation`, `ticket`, or `support`) into this folder if you captured them via the Cursor browser tools.
