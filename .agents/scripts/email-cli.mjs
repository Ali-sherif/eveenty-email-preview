#!/usr/bin/env node
/**
 * Deterministic Eveenty email infra CLI.
 * Invoked as: node .agents/scripts/email-cli.mjs <command> [...]
 * Intentionally NOT wired into package.json (infra-only install).
 */
import fs from 'fs';
import path from 'path';
import {
  DESIGNED_REFERENCE_IDS,
  EXPECTED,
  REPO_ROOT,
  buildContextPackage,
  countBy,
  loadCatalog,
  loadTraceabilityIndex,
  printHuman,
  resolveTemplate,
  traceabilityPath,
} from './lib/catalog.mjs';

function usage(exitCode = 1) {
  const text = `Usage: node .agents/scripts/email-cli.mjs <command> [args] [--json]

Commands:
  context <template_id>              JSON/human context package for one template
  validate-catalog                   Verify 59/11/48, families, 7/41, organizer_announcement
  validate-template <template_id>    Validate one template mapping + preview artifacts
  qa [template_id | --all]           Report available Level-A evidence (no new test runner)
  status                             Compact inventory + next actionable items
  handoff                            Validate docs/agent/HANDOFF.md presence/freshness markers
`;
  process.stderr.write(text);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const asJson = args.includes('--json');
  const positional = args.filter((a) => a !== '--json');
  return { asJson, positional };
}

function cmdContext(templateId, asJson) {
  if (!templateId) usage(1);
  const catalog = loadCatalog();
  const { match, ambiguous } = resolveTemplate(catalog, templateId);
  if (!match) {
    const payload = {
      ok: false,
      error: ambiguous.length
        ? `Ambiguous template_id '${templateId}'`
        : `Template '${templateId}' not found in catalog`,
      ambiguous,
    };
    printHuman([`FAIL: ${payload.error}`], payload, asJson);
    process.exit(1);
  }
  const trace = loadTraceabilityIndex();
  const pkg = buildContextPackage(match, trace.get(match.id) || null);
  const lines = [
    `OK context ${pkg.id}`,
    `  scope=${pkg.scope} design_status=${pkg.design_status}`,
    `  backend_family=${pkg.backend_family} design_kit_family=${pkg.design_kit_family}`,
    `  preview=${pkg.preview || '(none)'} exists=${pkg.preview_exists}`,
  ];
  printHuman(lines, { ok: true, context: pkg }, asJson);
}

function cmdValidateCatalog(asJson) {
  const catalog = loadCatalog();
  const emails = catalog.emails;
  const checks = [];
  const fail = (name, detail) => checks.push({ name, ok: false, detail });
  const pass = (name, detail) => checks.push({ name, ok: true, detail });

  if (emails.length !== EXPECTED.physical) {
    fail('physical_count', `got ${emails.length}, expected ${EXPECTED.physical}`);
  } else pass('physical_count', String(emails.length));

  const unique = new Set(emails.map((e) => e.id)).size;
  if (unique !== EXPECTED.physical) fail('unique_ids', `got ${unique}`);
  else pass('unique_ids', String(unique));

  const scopeCounts = countBy(emails, (e) => e.scope);
  if (scopeCounts.IN_SCOPE !== EXPECTED.in_scope || scopeCounts.EXCLUDED !== EXPECTED.excluded) {
    fail('scope_split', JSON.stringify(scopeCounts));
  } else pass('scope_split', `IN_SCOPE ${EXPECTED.in_scope} / EXCLUDED ${EXPECTED.excluded}`);

  const designCounts = countBy(emails, (e) => e.design_status);
  if (designCounts.DESIGNED !== EXPECTED.designed) fail('designed', JSON.stringify(designCounts));
  else pass('designed', String(EXPECTED.designed));

  const undesignedInScope = emails.filter(
    (e) => e.scope === 'IN_SCOPE' && e.design_status === 'UNDESIGNED',
  ).length;
  if (undesignedInScope !== EXPECTED.undesigned) fail('undesigned_in_scope', String(undesignedInScope));
  else pass('undesigned_in_scope', String(EXPECTED.undesigned));

  const backend = countBy(emails, (e) => e.backend_family);
  for (const [k, v] of Object.entries(EXPECTED.backendFamilies)) {
    if (backend[k] !== v) fail(`backend_${k}`, `got ${backend[k]}, expected ${v}`);
    else pass(`backend_${k}`, String(v));
  }

  const inScope = emails.filter((e) => e.scope === 'IN_SCOPE');
  const dk = countBy(inScope, (e) => e.design_kit_family);
  for (const [k, v] of Object.entries(EXPECTED.designKitFamiliesInScope)) {
    if (dk[k] !== v) fail(`design_kit_${k}`, `got ${dk[k]}, expected ${v}`);
    else pass(`design_kit_${k}`, String(v));
  }

  const designedIds = emails
    .filter((e) => e.design_status === 'DESIGNED')
    .map((e) => e.id)
    .sort();
  const expectedDesigned = [...DESIGNED_REFERENCE_IDS].sort();
  if (JSON.stringify(designedIds) !== JSON.stringify(expectedDesigned)) {
    fail('designed_ids', `got ${designedIds.join(',')}`);
  } else pass('designed_ids', designedIds.join(', '));

  const org = emails.find((e) => e.id === 'organizer_announcement');
  if (!org) fail('organizer_announcement', 'missing');
  else if (org.scope !== 'IN_SCOPE' || org.design_status !== 'UNDESIGNED' || org.design_kit_family !== 'MARKETING') {
    fail('organizer_announcement', JSON.stringify(org));
  } else pass('organizer_announcement', 'IN_SCOPE · UNDESIGNED · MARKETING');

  // inventory object parity
  const inv = catalog.inventory || {};
  for (const key of ['physical', 'excluded', 'in_scope', 'designed', 'undesigned']) {
    if (inv[key] !== EXPECTED[key === 'in_scope' ? 'in_scope' : key]) {
      // map keys
    }
  }
  const expectedInv = {
    physical: EXPECTED.physical,
    excluded: EXPECTED.excluded,
    in_scope: EXPECTED.in_scope,
    designed: EXPECTED.designed,
    undesigned: EXPECTED.undesigned,
  };
  if (JSON.stringify(inv) !== JSON.stringify(expectedInv)) {
    fail('inventory_block', JSON.stringify(inv));
  } else pass('inventory_block', JSON.stringify(inv));

  // CSV row count
  const trace = loadTraceabilityIndex();
  if (trace.size !== EXPECTED.physical) fail('traceability_rows', `got ${trace.size}`);
  else pass('traceability_rows', String(trace.size));

  const ok = checks.every((c) => c.ok);
  const lines = [
    ok ? 'PASS validate-catalog' : 'FAIL validate-catalog',
    ...checks.map((c) => `  ${c.ok ? 'PASS' : 'FAIL'} ${c.name}: ${c.detail}`),
  ];
  printHuman(lines, { ok, checks, inventory: inv, backend, design_kit_in_scope: dk, designedIds }, asJson);
  process.exit(ok ? 0 : 1);
}

function cmdValidateTemplate(templateId, asJson) {
  if (!templateId) usage(1);
  const catalog = loadCatalog();
  const { match, ambiguous } = resolveTemplate(catalog, templateId);
  if (!match) {
    printHuman(
      [`FAIL: template '${templateId}' not resolved`],
      { ok: false, ambiguous },
      asJson,
    );
    process.exit(1);
  }
  const trace = loadTraceabilityIndex();
  const row = trace.get(match.id);
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });

  add('catalog_record', true, match.id);
  add('traceability_row', Boolean(row), row ? 'present' : 'missing');
  if (row) {
    add(
      'scope_parity',
      row.phase1_scope_status === match.scope,
      `${row.phase1_scope_status} vs ${match.scope}`,
    );
    add(
      'design_status_parity',
      row.current_design_status === match.design_status ||
        (match.design_status === 'EXCLUDED_NO_DESIGN' && row.current_design_status),
      `${row.current_design_status} vs ${match.design_status}`,
    );
    add(
      'design_kit_parity',
      row.verified_design_kit_family === match.design_kit_family,
      `${row.verified_design_kit_family} vs ${match.design_kit_family}`,
    );
  }

  const previewPath = match.preview ? path.join(REPO_ROOT, match.preview) : null;
  if (match.design_status === 'DESIGNED') {
    add('preview_path_set', Boolean(match.preview), match.preview || '(none)');
    add('preview_file_exists', previewPath ? fs.existsSync(previewPath) : false, previewPath || '');
    add('preview_selectable', match.preview_selectable === true, String(match.preview_selectable));
  } else if (match.scope === 'IN_SCOPE') {
    add('no_preview_expected', !match.preview, match.preview || '(none)');
  }

  const backendTemplate = path.join(REPO_ROOT, '..', 'rescounts-backend', match.production_path);
  const backendReadable = fs.existsSync(backendTemplate);
  add(
    'backend_template_readable',
    backendReadable,
    backendReadable ? backendTemplate : `not found at ${backendTemplate} (optional read-only check)`,
  );

  const ok = checks.every((c) => c.ok || c.name === 'backend_template_readable');
  // backend check is informational if path missing — still report but don't fail install validation on path layout
  const hardOk = checks.filter((c) => c.name !== 'backend_template_readable').every((c) => c.ok);
  const lines = [
    hardOk ? `PASS validate-template ${match.id}` : `FAIL validate-template ${match.id}`,
    ...checks.map((c) => `  ${c.ok ? 'PASS' : 'WARN/FAIL'} ${c.name}: ${c.detail}`),
  ];
  printHuman(
    lines,
    { ok: hardOk, template: buildContextPackage(match, row || null), checks },
    asJson,
  );
  process.exit(hardOk ? 0 : 1);
}

function cmdQa(target, asJson) {
  // No Playwright suite exists in this repo; report artifact evidence only.
  const catalog = loadCatalog();
  let ids;
  if (!target || target === '--all') {
    ids = DESIGNED_REFERENCE_IDS;
  } else {
    ids = [target];
  }
  const results = [];
  for (const id of ids) {
    const { match } = resolveTemplate(catalog, id);
    if (!match) {
      results.push({ id, ok: false, detail: 'not in catalog' });
      continue;
    }
    const previewOk = match.preview ? fs.existsSync(path.join(REPO_ROOT, match.preview)) : false;
    const screenshotDir = path.join(REPO_ROOT, 'screenshots');
    const screenshotHits = fs.existsSync(screenshotDir)
      ? fs.readdirSync(screenshotDir).filter((f) => f.includes(id))
      : [];
    results.push({
      id,
      ok: match.design_status !== 'DESIGNED' || previewOk,
      design_status: match.design_status,
      preview_exists: previewOk,
      screenshot_artifacts: screenshotHits,
      level_a_browser_suite: 'NOT PRESENT in repo (no *.spec/test files)',
      level_b_client_render: 'NOT RUN',
    });
  }
  const ok = results.every((r) => r.ok);
  const lines = [
    ok ? 'PASS qa (artifact evidence only)' : 'FAIL qa',
    '  NOTE: No automated browser QA suite found in eveenty-email-preview.',
    ...results.map(
      (r) =>
        `  ${r.ok ? 'PASS' : 'FAIL'} ${r.id}: preview=${r.preview_exists} screenshots=${(r.screenshot_artifacts || []).length}`,
    ),
  ];
  printHuman(lines, { ok, results }, asJson);
  process.exit(ok ? 0 : 1);
}

function cmdStatus(asJson) {
  const catalog = loadCatalog();
  const inv = catalog.inventory;
  const next = catalog.emails
    .filter((e) => e.scope === 'IN_SCOPE' && e.design_status === 'UNDESIGNED')
    .slice(0, 5)
    .map((e) => e.id);
  const lines = [
    `physical=${inv.physical} excluded=${inv.excluded} in_scope=${inv.in_scope}`,
    `designed=${inv.designed} undesigned=${inv.undesigned}`,
    `next_undesigned_sample=${next.join(', ')}`,
    `organizer_announcement=${catalog.emails.find((e) => e.id === 'organizer_announcement')?.design_status}`,
    'active_design_task=none (infra install only)',
  ];
  printHuman(lines, { ok: true, inventory: inv, next_undesigned_sample: next }, asJson);
}

function cmdHandoff(asJson) {
  const handoffPath = path.join(REPO_ROOT, 'docs', 'agent', 'HANDOFF.md');
  const projectStatePath = path.join(REPO_ROOT, 'docs', 'agent', 'PROJECT_STATE.md');
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });
  add('handoff_exists', fs.existsSync(handoffPath), handoffPath);
  add('project_state_exists', fs.existsSync(projectStatePath), projectStatePath);
  if (fs.existsSync(handoffPath)) {
    const text = fs.readFileSync(handoffPath, 'utf8');
    add('has_current_task_section', /## Current task/i.test(text), '## Current task');
    add('has_next_action_section', /## Next authorized action/i.test(text), '## Next authorized action');
    add(
      'not_placeholder_only',
      !/Generated outside the local repo — every fact below is \*\*reported\*\*/.test(text) &&
        /Local install|verified|PASS|FAIL/i.test(text),
      'expects local verification notes',
    );
  }
  const ok = checks.every((c) => c.ok);
  const lines = [
    ok ? 'PASS handoff' : 'FAIL handoff',
    ...checks.map((c) => `  ${c.ok ? 'PASS' : 'FAIL'} ${c.name}: ${c.detail}`),
  ];
  printHuman(lines, { ok, checks, handoffPath }, asJson);
  process.exit(ok ? 0 : 1);
}

const { asJson, positional } = parseArgs(process.argv);
const [cmd, arg] = positional;
if (!cmd) usage(1);

switch (cmd) {
  case 'context':
  case 'email:context':
    cmdContext(arg, asJson);
    break;
  case 'validate-catalog':
  case 'email:validate-catalog':
    cmdValidateCatalog(asJson);
    break;
  case 'validate-template':
  case 'email:validate-template':
    cmdValidateTemplate(arg, asJson);
    break;
  case 'qa':
  case 'email:qa':
    cmdQa(arg, asJson);
    break;
  case 'status':
  case 'email:status':
    cmdStatus(asJson);
    break;
  case 'handoff':
  case 'email:handoff':
    cmdHandoff(asJson);
    break;
  case 'help':
  case '--help':
  case '-h':
    usage(0);
    break;
  default:
    process.stderr.write(`Unknown command: ${cmd}\n`);
    usage(1);
}
