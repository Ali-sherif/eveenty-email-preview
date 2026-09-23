/**
 * Build side-by-side Figma | browser comparison HTML pages.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const cmpDir = join(root, 'comparisons');
mkdirSync(cmpDir, { recursive: true });

const pairs = [
  {
    id: 'activate_email',
    figma: '../figma/activate-en-desktop-800.png',
    browser: '../screenshots/activate_email-en-desktop-800.png',
    figmaNode: '4:2',
  },
  {
    id: 'festival_donation',
    figma: '../figma/donation-en-desktop-800.png',
    browser: '../screenshots/festival_donation-en-desktop-800.png',
    figmaNode: '21:2',
  },
  {
    id: 'festival_ticket_sale',
    figma: '../figma/ticket-sale-en-desktop-800.png',
    browser: '../screenshots/festival_ticket_sale-en-desktop-800.png',
    figmaNode: '21:53',
  },
  {
    id: 'festival_ticket_registration_approval',
    figma: '../figma/reg-approval-en-desktop-800.png',
    browser: '../screenshots/festival_ticket_registration_approval-en-desktop-800.png',
    figmaNode: '48:45',
  },
  {
    id: 'support',
    figma: '../figma/support-en-desktop-800.png',
    browser: '../screenshots/support-en-desktop-800.png',
    figmaNode: '22:113',
  },
  {
    id: 'dispute_notification',
    figma: '../figma/dispute-en-desktop-800.png',
    browser: '../screenshots/dispute_notification-en-desktop-800.png',
    figmaNode: '72:44',
  },
  {
    id: 'festival_marketing_email_target',
    figma: '../figma/marketing-en-desktop-800.png',
    browser: '../screenshots/festival_marketing_email_target-en-desktop-800.png',
    figmaNode: '72:175',
  },
];

const index = [];
for (const p of pairs) {
  const fOk = existsSync(join(root, 'figma', p.figma.split('/').pop()));
  const bOk = existsSync(join(root, 'screenshots', p.browser.split('/').pop()));
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>Compare ${p.id}</title>
<style>
body{font-family:Arial,sans-serif;margin:16px;background:#f4f4f4;color:#2b2a28}
h1{font-size:18px} .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
figure{margin:0;background:#fff;padding:12px;border:1px solid #ebebeb}
img{max-width:100%;height:auto;display:block;border:1px solid #ddd}
.meta{font-size:12px;color:#7b7b79}
</style></head><body>
<h1>${p.id} — Figma vs browser (EN desktop)</h1>
<p class="meta">Task 03 final review · Figma node ${p.figmaNode} · Browser Chromium only · Gmail/Outlook/Apple Mail NOT EXECUTED</p>
<p class="meta">Assets present: Figma=${fOk} Browser=${bOk}</p>
<div class="grid">
<figure><figcaption>Figma</figcaption><img src="${p.figma}" alt="Figma ${p.id}"/></figure>
<figure><figcaption>Browser preview</figcaption><img src="${p.browser}" alt="Browser ${p.id}"/></figure>
</div>
</body></html>`;
  const file = `compare-${p.id}.html`;
  writeFileSync(join(cmpDir, file), html, 'utf8');
  index.push({ ...p, file, figmaPresent: fOk, browserPresent: bOk });
}

writeFileSync(join(cmpDir, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
const indexHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Seven-email comparisons</title></head>
<body style="font-family:Arial;margin:24px"><h1>Figma vs browser comparisons</h1><ul>
${index.map((i) => `<li><a href="${i.file}">${i.id}</a> (figma=${i.figmaPresent}, browser=${i.browserPresent})</li>`).join('')}
</ul></body></html>`;
writeFileSync(join(cmpDir, 'index.html'), indexHtml, 'utf8');
console.log('wrote', index.length, 'comparisons');
