# Precise list of preview and Figma changes

## Preview project (`D:\last\eveenty-email-preview`) — local only

| Path | Change |
|---|---|
| `shared/render-emails.js` | Donation / reg_approval / support brought to Activation standards (logo 160, header `#FEFDF4`, heading 600, remove visible preheader bar). Reg approval primary CTA → yellow/`#4D4C49`. Comment updated to seven templates. Unused magenta/preheader imports removed. |
| `shared/email-kit.js` | `sectionTitle` accepts fontFamily/fontWeight; brandedHeader comment updated for Task 03 seven set. |
| `shared/sample-data.js` | FR/ES donation + regApproval from production YAML; `donatedTo` on en/ar/fa; EMAIL_IDS locales expanded for donation/reg; marketing label → `Campaign / Announcement — …`. |
| `preview.js` | Annotations for donation, reg_approval, support. |
| `emails/*.html` | Regenerated via `generate-standalone.mjs` for all seven. |
| `qa-output/task-03-seven-email-review/**` | New QA folder, scripts, screenshots, Figma exports, comparisons, reports. |

**Not changed:** backend Go/templates/YAML, owner PNGs under `D:\emails\`, original Design System Figma, excluded templates, unrelated catalog emails.

## Figma Email Kit (`yz7YggnG4H2RuUd23f9zPk`)

| Node | Change |
|---|---|
| `21:5` Donation Preheader | `visible=false` |
| `21:8` Donation Logo/en | Resize **200→160×64** |
| `21:7` Donation Header | Height → ~112 |
| `48:48` RegApproval Preheader | `visible=false` |
| `48:51` RegApproval Logo/en | Resize **200→160×64** |
| `48:50` RegApproval Header | Height → ~112 |
| `48:59` / `49:88` Complete Order CTAs | Fill **magenta → `#E9D023`**; label text **white → `#4D4C49`** |
| `22:116` Support Preheader | `visible=false` |
| `22:119` Support Logo/en | Resize **200→160×64** |
| `22:118` Support Header | Height → ~112 |
| `73:2` prior Task 03 gate | Title text updated toward seven-email review |
| `75:49` | **New** cover STOP gate: seven-email review |

**Not mutated:** Activation frames (Task 02), Ticket Sale / Dispute / Marketing frames (prior Task 03), original Design System file.

## Image / logo verification

- Preview assets remain byte-identical to owner PNGs (prior Task 02 SHA256 proof; sources not rewritten this pass).
- Figma logo fills for donation/reg/support reuse existing Activation-verified EN imageHash (`f5eb3d02…`); display size corrected to 160 — **no PNG re-upload**.
- Marketing festival assets remain SAMPLE fixtures (not Eveenty wordmark).
