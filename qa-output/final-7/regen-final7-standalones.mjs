import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderEmail } from '../../shared/render-emails.js';
import { FINAL7_EMAIL_IDS } from '../../shared/final7-definitions.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const defaults = Object.fromEntries(
  FINAL7_EMAIL_IDS.map((d) => [d.id, { locale: d.locales[0], variant: d.variants[0] }]),
);

for (const { id } of FINAL7_EMAIL_IDS) {
  const html = renderEmail(id, { ...defaults[id], assetBase: '../' });
  const out = join(root, 'emails', `${id}.html`);
  writeFileSync(out, html, 'utf8');
  const match = html.match(/This message was sent to <a href="mailto:([^"]*)"[^>]*>([^<]*)<\/a>/);
  if (!match || !match[1] || match[1] !== match[2]) {
    throw new Error(`${id}: incomplete or mismatched footer recipient`);
  }
  console.log('wrote', id, '→', match[1]);
}
