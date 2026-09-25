# Email preview screenshots

**All PNG captures in this directory were discarded 2026-09-25** (testing-only artifacts). Mail-used assets remain under `assets/logos/` and `assets/wallet/official/`.

Prefer live preview (`npm start`) for visual review. Historical filenames below are former evidence only.

## Account Activation (Task 02 — awaiting owner approval)

| File | What |
|------|------|
| `activate_email-desktop-800.png` | HTML EN desktop ~800 — **DISCARDED** |
| `activate_email-mobile-375.png` | HTML EN mobile 375 — **DISCARDED** |
| `activate_email-mobile-320.png` | HTML EN mobile 320 — **DISCARDED** |
| `activate_email-ar-rtl-800.png` | HTML AR RTL ~800 — **DISCARDED** |
| `preview-app-activate-ar-800.png` | Preview chrome — **DISCARDED** |
| `figma/activate-en-desktop-800.png` | Figma EN 800 (node `4:2`) — **DISCARDED** |
| `figma/activate-en-mobile-320.png` | Figma EN 320 — **DISCARDED** |
| `figma/activate-en-mobile-375.png` | Figma EN 375 — **DISCARDED** |
| `figma/activate-ar-rtl-800.png` | Figma AR RTL 800 — **DISCARDED** |

Figma file: https://www.figma.com/design/yz7YggnG4H2RuUd23f9zPk/Eveenty-Email-Design-Kit?node-id=4-2

## Other Phase-1 references

Former desktop/mobile PNGs for donation, ticket sale, registration approval, and support — **DISCARDED**.

## Regenerate HTML captures

```bash
npm install
npx playwright install chromium
node capture-screenshots.mjs
```

Requires `"type": "module"` in `package.json`.
