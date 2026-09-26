#!/usr/bin/env node
/**
 * Deterministically snapshots only the locale packs used by the owner-authorized
 * 20-template batch. The production repository is read-only; output is written
 * to this preview repository for browser use.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const backendEmailLocales = path.resolve(repoRoot, '..', 'rescounts-backend', 'pkg', 'locales', 'translations', 'email');
const locales = ['en', 'fr', 'es', 'ar', 'fa'];

const packs = {
  refundItems: 'refund_items',
  registrationStatus: 'ticket_registration_status',
  registrationApproval: 'registration_approval_status_changed',
  updateRequest: 'festival_update_request_locales',
  vendorRejection: 'festival_vendor_sale_rejection_locales',
  disputeReminder: 'dispute_reminder',
  boothInstallments: 'festival_sale_installments',
  sponsorInstallments: 'festival_sponsor_sale_installments',
};

function parseQuotedScalar(raw, source, lineNumber) {
  const value = raw.trim();
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`${source}:${lineNumber}: unsupported double-quoted scalar: ${error.message}`);
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }
  throw new Error(`${source}:${lineNumber}: expected a quoted one-line 'other' scalar`);
}

function readFlatLocaleFile(filePath, { prefix = '' } = {}) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const result = {};
  let currentKey = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyMatch = line.match(/^([A-Za-z0-9_]+):\s*$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      continue;
    }
    const valueMatch = line.match(/^\s+other:\s*(.+)\s*$/);
    if (!valueMatch || !currentKey) continue;
    if (!prefix || currentKey.startsWith(prefix)) {
      result[currentKey] = parseQuotedScalar(valueMatch[1], filePath, index + 1);
    }
    currentKey = null;
  }
  return result;
}

const snapshot = {};
for (const locale of locales) {
  snapshot[locale] = {
    registration: readFlatLocaleFile(path.join(backendEmailLocales, `${locale}.yaml`), {
      prefix: 'FestivalTicketRegistration',
    }),
  };
  for (const [name, directory] of Object.entries(packs)) {
    snapshot[locale][name] = readFlatLocaleFile(path.join(backendEmailLocales, directory, `${locale}.yaml`));
  }
}

const outputPath = path.join(repoRoot, 'shared', 'batch20-locales.generated.js');
const header = `/**\n * GENERATED from targeted, read-only backend locale packs for the owner-authorized\n * 20-template batch. Regenerate with: node build-batch20-locales.mjs\n * Source root: ../rescounts-backend/pkg/locales/translations/email\n */\n`;
fs.writeFileSync(outputPath, `${header}export const BATCH20_LOCALES = ${JSON.stringify(snapshot, null, 2)};\n`, 'utf8');
process.stdout.write(`wrote ${outputPath}\n`);
