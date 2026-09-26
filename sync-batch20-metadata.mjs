#!/usr/bin/env node
/** Deterministic metadata transition for the owner-authorized 20-template batch. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
export const BATCH20_IDS = [
  'refund_receipt_organizer',
  'refund_receipt_admin',
  'festival_ticket_registration',
  'festival_ticket_registration_deadline_exceeded',
  'festival_ticket_registration_payment_deadline_exceeded',
  'registration_approval_status_changed',
  'festival_update_request_approved',
  'festival_update_request_rejected',
  'festival_vendor_sale_rejection',
  'needs_response_dispute_reminder',
  'festival_update_request_issued',
  'festival_created',
  'festival_marketing_approval',
  'festival_marketing_approval_sms',
  'festival_sale_installment_paid',
  'second_payment_reminder',
  'first_payment_refund',
  'sponsor_installment_paid',
  'sponsor_installment_second_payment_reminder',
  'sponsor_first_payment_refund',
];

if (BATCH20_IDS.length !== 20 || new Set(BATCH20_IDS).size !== 20) {
  throw new Error('Batch must contain exactly 20 distinct IDs');
}

function parseCsvLine(line) {
  const fields = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      fields.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  fields.push(value);
  return fields;
}

function csvField(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const catalogPath = path.join(root, 'catalog', 'email-catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
for (const id of BATCH20_IDS) {
  const matches = catalog.emails.filter((email) => email.id === id);
  if (matches.length !== 1) throw new Error(`${id}: expected one catalog record, found ${matches.length}`);
  const email = matches[0];
  if (email.scope !== 'IN_SCOPE') throw new Error(`${id}: not IN_SCOPE`);
  const expectedPreview = `emails/${id}.html`;
  if (!['UNDESIGNED', 'DESIGNED'].includes(email.design_status)) {
    throw new Error(`${id}: unexpected design status ${email.design_status}`);
  }
  if (email.design_status === 'DESIGNED' && email.preview !== expectedPreview) {
    throw new Error(`${id}: rerun found unexpected preview mapping ${email.preview}`);
  }
  const previewPath = path.join(root, expectedPreview);
  if (!fs.existsSync(previewPath)) throw new Error(`${id}: preview file does not exist at ${expectedPreview}`);
  email.design_status = 'DESIGNED';
  email.figma = null;
  email.preview = expectedPreview;
  email.preview_selectable = true;
}
catalog.inventory.designed = 33;
catalog.inventory.undesigned = 15;
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

const tracePath = path.join(root, 'catalog', 'EMAIL_TEMPLATE_TRACEABILITY.csv');
const source = fs.readFileSync(tracePath, 'utf8');
const newline = source.includes('\r\n') ? '\r\n' : '\n';
const lines = source.split(/\r?\n/);
const header = parseCsvLine(lines[0]);
const filenameIndex = header.indexOf('exact_original_filename');
const previewIndex = header.indexOf('preview_reference');
const statusIndex = header.indexOf('current_design_status');
if ([filenameIndex, previewIndex, statusIndex].some((index) => index < 0)) {
  throw new Error('Traceability CSV is missing required columns');
}
const updated = new Set();
for (let index = 1; index < lines.length; index += 1) {
  if (!lines[index]) continue;
  const fields = parseCsvLine(lines[index]);
  const id = String(fields[filenameIndex] || '').replace(/\.template$/, '');
  if (!BATCH20_IDS.includes(id)) continue;
  if (updated.has(id)) throw new Error(`${id}: duplicate traceability row`);
  fields[previewIndex] = `emails/${id}.html`;
  fields[statusIndex] = 'DESIGNED';
  lines[index] = fields.map(csvField).join(',');
  updated.add(id);
}
const missing = BATCH20_IDS.filter((id) => !updated.has(id));
if (missing.length) throw new Error(`Missing traceability rows: ${missing.join(', ')}`);
fs.writeFileSync(tracePath, lines.join(newline), 'utf8');

process.stdout.write(`updated catalog + traceability for ${updated.size} templates (33 designed / 15 undesigned)\n`);
