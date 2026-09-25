import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '../../..');

export const DESIGNED_REFERENCE_IDS = [
  'activate_email',
  'festival_donation',
  'festival_ticket_sale',
  'festival_ticket_registration_approval',
  'support',
  'dispute_notification',
  'festival_marketing_email_target',
];

export const EXPECTED = {
  physical: 59,
  excluded: 11,
  in_scope: 48,
  designed: 7,
  undesigned: 41,
  backendFamilies: {
    'Auth/Simple': 2,
    'Financial/Receipt': 20,
    'Ticket/Pass': 8,
    'Workflow/Status': 15,
    'Internal/Operational': 7,
    'Campaign/Announcement': 7,
  },
  designKitFamiliesInScope: {
    TRANSACTIONAL: 2,
    COMMERCE: 26,
    NOTIFICATION: 17,
    MARKETING: 3,
  },
};

export function catalogPath() {
  return path.join(REPO_ROOT, 'catalog', 'email-catalog.json');
}

export function traceabilityPath() {
  return path.join(REPO_ROOT, 'catalog', 'EMAIL_TEMPLATE_TRACEABILITY.csv');
}

export function loadCatalog() {
  const raw = fs.readFileSync(catalogPath(), 'utf8');
  return JSON.parse(raw);
}

/** Minimal CSV parser that respects double-quoted fields. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      continue;
    }
    if (ch === '\n') {
      row.push(field);
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
      field = '';
      continue;
    }
    if (ch === '\r') continue;
    field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function loadTraceabilityIndex() {
  const rows = parseCsv(fs.readFileSync(traceabilityPath(), 'utf8'));
  const header = rows[0];
  const index = new Map();
  for (let i = 1; i < rows.length; i++) {
    const obj = {};
    header.forEach((h, j) => {
      obj[h] = rows[i][j] ?? '';
    });
    const filename = obj.exact_original_filename || '';
    const id = filename.replace(/\.template$/, '');
    if (id) index.set(id, obj);
  }
  return index;
}

export function countBy(items, keyFn) {
  const out = {};
  for (const item of items) {
    const k = keyFn(item);
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

export function resolveTemplate(catalog, templateId) {
  const exact = catalog.emails.find((e) => e.id === templateId);
  if (exact) return { match: exact, ambiguous: [] };
  const lower = String(templateId).toLowerCase();
  const candidates = catalog.emails.filter(
    (e) =>
      e.id.toLowerCase() === lower ||
      e.filename.toLowerCase() === lower ||
      e.filename.toLowerCase() === `${lower}.template`,
  );
  if (candidates.length === 1) return { match: candidates[0], ambiguous: [] };
  return { match: null, ambiguous: candidates.map((c) => c.id) };
}

export function buildContextPackage(catalogEntry, traceRow) {
  const previewRel = catalogEntry.preview || null;
  const previewAbs = previewRel ? path.join(REPO_ROOT, previewRel) : null;
  return {
    id: catalogEntry.id,
    filename: catalogEntry.filename,
    production_path: catalogEntry.production_path,
    backend_family: catalogEntry.backend_family,
    design_kit_family: catalogEntry.design_kit_family,
    functional_subfolder: catalogEntry.functional_subfolder,
    catalog_path: catalogEntry.catalog_path,
    scope: catalogEntry.scope,
    design_status: catalogEntry.design_status,
    figma: catalogEntry.figma,
    preview: catalogEntry.preview,
    preview_selectable: catalogEntry.preview_selectable,
    preview_exists: previewAbs ? fs.existsSync(previewAbs) : false,
    production_lookup_key: traceRow?.template_id_or_lookup_key || null,
    call_sites: traceRow?.backend_send_functions_and_call_sites || null,
    trigger: traceRow?.trigger_or_business_event || null,
    recipient_type: traceRow?.recipient_type || null,
    locale_behavior: traceRow?.locale_selection_and_fallback || null,
    variables: traceRow?.template_variables_and_producers || null,
    partials: traceRow?.header_footer_partial_dependencies || null,
    special_features: traceRow?.attachments_qr_wallet_calendar_special || null,
    replacement_strategy: traceRow?.replacement_strategy || null,
    production_deployment: traceRow?.current_production_deployment_status || null,
    source_evidence: traceRow?.source_evidence || null,
  };
}

export function printHuman(summaryLines, jsonPayload, asJson) {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(jsonPayload, null, 2)}\n`);
  } else {
    for (const line of summaryLines) process.stdout.write(`${line}\n`);
  }
}
