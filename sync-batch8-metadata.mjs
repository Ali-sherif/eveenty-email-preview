#!/usr/bin/env node
/** Strict metadata transition for exactly the owner-authorized eight templates. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
export const BATCH8_IDS = [
  'festival_add_on_sale', 'festival_activity_sale', 'festival_sponsor_sale',
  'festival_sales', 'festival_vendor_sale',
  'organizer_festival_marketing_email_receipt',
  'organizer_festival_marketing_sms_receipt',
  'festival_rescounts_marketing_email_target',
];
if (BATCH8_IDS.length !== 8 || new Set(BATCH8_IDS).size !== 8) throw new Error('Expected exactly eight distinct IDs');

function parseCsv(text) {
  const rows = []; let row = []; let field = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]; const next = text[i + 1];
    if (quoted) { if (char === '"' && next === '"') { field += '"'; i += 1; } else if (char === '"') quoted = false; else field += char; continue; }
    if (char === '"') quoted = true; else if (char === ',') { row.push(field); field = ''; } else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; } else if (char !== '\r') field += char;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
function csv(value) { const text = String(value ?? ''); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }

const catalogPath = path.join(root, 'catalog', 'email-catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
for (const id of BATCH8_IDS) {
  const matches = catalog.emails.filter((email) => email.id === id);
  if (matches.length !== 1) throw new Error(`${id}: expected exactly one catalog row`);
  const email = matches[0];
  if (email.scope !== 'IN_SCOPE' || email.design_status !== 'UNDESIGNED' || email.preview || email.preview_selectable !== false) throw new Error(`${id}: unexpected pre-transition metadata`);
  const preview = `emails/${id}.html`;
  if (!fs.existsSync(path.join(root, preview))) throw new Error(`${id}: missing preview ${preview}`);
  email.design_status = 'DESIGNED'; email.figma = null; email.preview = preview; email.preview_selectable = true;
}
catalog.inventory.designed = 41; catalog.inventory.undesigned = 7;
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

const tracePath = path.join(root, 'catalog', 'EMAIL_TEMPLATE_TRACEABILITY.csv');
const source = fs.readFileSync(tracePath, 'utf8');
const newline = source.includes('\r\n') ? '\r\n' : '\n';
const rows = parseCsv(source); const header = rows[0];
const filenameIndex = header.indexOf('exact_original_filename');
const previewIndex = header.indexOf('preview_reference');
const statusIndex = header.indexOf('current_design_status');
if ([filenameIndex, previewIndex, statusIndex].some((index) => index < 0)) throw new Error('Traceability columns missing');
const updated = new Set();
for (let index = 1; index < rows.length; index += 1) {
  const id = String(rows[index][filenameIndex] || '').replace(/\.template$/, '');
  if (!BATCH8_IDS.includes(id)) continue;
  if (updated.has(id)) throw new Error(`${id}: duplicate traceability row`);
  rows[index][previewIndex] = `emails/${id}.html`; rows[index][statusIndex] = 'DESIGNED'; updated.add(id);
}
if (updated.size !== 8) throw new Error(`Updated ${updated.size}, expected 8`);
fs.writeFileSync(tracePath, rows.filter((row) => row.length > 1 || row[0]).map((row) => row.map(csv).join(',')).join(newline) + newline, 'utf8');
console.log('updated exact batch-8 catalog + traceability metadata (41 designed / 7 undesigned)');
