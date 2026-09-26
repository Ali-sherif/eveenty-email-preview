#!/usr/bin/env node
/** Snapshot only locale packs used by the owner-authorized eight-template batch. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.resolve(root, '..', 'rescounts-backend', 'pkg', 'locales', 'translations', 'email');
const locales = ['en', 'fr', 'es', 'ar', 'fa'];

function scalar(raw, source, lineNumber) {
  const value = raw.trim();
  if (value.startsWith('"')) {
    try { return JSON.parse(value); } catch (error) {
      throw new Error(`${source}:${lineNumber}: ${error.message}`);
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  throw new Error(`${source}:${lineNumber}: expected quoted one-line scalar`);
}

function readFlat(filePath, prefixes = []) {
  const result = {};
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  let key = null;
  for (let index = 0; index < lines.length; index += 1) {
    const keyMatch = lines[index].match(/^([A-Za-z0-9_]+):\s*$/);
    if (keyMatch) { key = keyMatch[1]; continue; }
    const valueMatch = lines[index].match(/^\s+other:\s*(.+)\s*$/);
    if (!valueMatch || !key) continue;
    if (!prefixes.length || prefixes.some((prefix) => key.startsWith(prefix))) {
      result[key] = scalar(valueMatch[1], filePath, index + 1);
    }
    key = null;
  }
  return result;
}

const packs = {
  addOn: 'add_on_locales',
  sponsorSale: 'festival_sponsor_sale_locales',
  festivalSale: 'festival_sale_locales',
  vendorSale: 'festival_vendor_sale_locales',
};
const snapshot = {};
for (const locale of locales) {
  snapshot[locale] = {
    activity: readFlat(path.join(sourceRoot, `${locale}.yaml`), ['FestivalActivity', 'FestivalTicket']),
    common: readFlat(path.join(sourceRoot, `${locale}.yaml`), ['ActivateEmailFooterLead', 'ActivateEmailFooterSuffix', 'ActivateEmailCopyright']),
  };
  for (const [name, directory] of Object.entries(packs)) {
    snapshot[locale][name] = readFlat(path.join(sourceRoot, directory, `${locale}.yaml`));
  }
}

const output = path.join(root, 'shared', 'batch8-locales.generated.js');
const header = `/**\n * GENERATED from targeted, read-only backend locale packs for the owner-authorized\n * eight-template batch. Regenerate with: node build-batch8-locales.mjs\n */\n`;
fs.writeFileSync(output, `${header}export const BATCH8_LOCALES = ${JSON.stringify(snapshot, null, 2)};\n`, 'utf8');
console.log(`wrote ${output}`);
