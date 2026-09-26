#!/usr/bin/env node
/**
 * Deterministic Eveenty email infra CLI.
 * Invoked as: node .agents/scripts/email-cli.mjs <command> [...]
 * Intentionally NOT wired into package.json (infra-only install).
 */
import fs from 'fs';
import path from 'path';
import {
  EXPECTED_DESIGNED_IDS,
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
  validate-catalog                   Verify inventory, mappings, preview paths, 33/15 state
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
  const expectedDesigned = [...EXPECTED_DESIGNED_IDS].sort();
  if (JSON.stringify(designedIds) !== JSON.stringify(expectedDesigned)) {
    fail('designed_ids', `got ${designedIds.join(',')}`);
  } else pass('designed_ids', designedIds.join(', '));

  const org = emails.find((e) => e.id === 'organizer_announcement');
  if (!org) fail('organizer_announcement', 'missing');
  else if (org.scope !== 'IN_SCOPE' || org.design_status !== 'DESIGNED' || org.design_kit_family !== 'MARKETING') {
    fail('organizer_announcement', JSON.stringify(org));
  } else pass('organizer_announcement', 'IN_SCOPE · DESIGNED · MARKETING');

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

  const requiredFields = [
    'id', 'filename', 'production_path', 'backend_family', 'design_kit_family',
    'functional_subfolder', 'catalog_path', 'scope', 'design_status',
  ];
  const missingMetadata = emails.flatMap((email) =>
    requiredFields
      .filter((field) => typeof email[field] !== 'string' || !email[field].trim())
      .map((field) => `${email.id || '(missing id)'}.${field}`),
  );
  if (missingMetadata.length) fail('required_metadata', missingMetadata.join(', '));
  else pass('required_metadata', `${emails.length} records complete`);

  const statusProblems = emails.flatMap((email) => {
    const allowed = email.scope === 'EXCLUDED'
      ? email.design_status === 'EXCLUDED_NO_DESIGN'
      : email.scope === 'IN_SCOPE' && ['DESIGNED', 'UNDESIGNED'].includes(email.design_status);
    return allowed ? [] : [`${email.id}:${email.scope}/${email.design_status}`];
  });
  if (statusProblems.length) fail('supported_status_transitions', statusProblems.join(', '));
  else pass('supported_status_transitions', 'scope/design-status combinations valid');

  const previewProblems = emails.flatMap((email) => {
    const previewPath = email.preview ? path.join(REPO_ROOT, email.preview) : null;
    if (email.design_status === 'DESIGNED') {
      if (!email.preview || email.preview_selectable !== true) return [`${email.id}:missing preview mapping`];
      if (!fs.existsSync(previewPath)) return [`${email.id}:missing ${email.preview}`];
    } else if (email.preview || email.preview_selectable !== false) {
      return [`${email.id}:unexpected preview mapping`];
    }
    return [];
  });
  if (previewProblems.length) fail('preview_paths', previewProblems.join(', '));
  else pass('preview_paths', `${EXPECTED.designed} designed previews readable`);

  const catalogIds = [...new Set(emails.map((email) => email.id))].sort();
  const traceIds = [...trace.keys()].sort();
  if (JSON.stringify(catalogIds) !== JSON.stringify(traceIds)) {
    fail('catalog_traceability_ids', 'catalog and traceability template IDs differ');
  } else pass('catalog_traceability_ids', `${catalogIds.length} exact IDs`);

  const mappingProblems = emails.flatMap((email) => {
    const row = trace.get(email.id);
    if (!row) return [`${email.id}:missing traceability row`];
    const problems = [];
    if (row.phase1_scope_status !== email.scope) problems.push(`${email.id}:scope`);
    if (row.current_design_status !== email.design_status) problems.push(`${email.id}:design_status`);
    if (row.verified_design_kit_family !== email.design_kit_family) problems.push(`${email.id}:design_kit_family`);
    return problems;
  });
  if (mappingProblems.length) fail('traceability_mapping_parity', mappingProblems.join(', '));
  else pass('traceability_mapping_parity', `${emails.length} mappings match`);

  const missingProduction = emails
    .filter((email) => !fs.existsSync(path.join(REPO_ROOT, '..', 'rescounts-backend', email.production_path)))
    .map((email) => email.id);
  if (missingProduction.length) fail('production_templates', missingProduction.join(', '));
  else pass('production_templates', `${emails.length} read-only sources readable`);

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
  // Report deterministic preview and screenshot artifact evidence. The dedicated
  // batch harness remains the source of fresh browser-QA results.
  const catalog = loadCatalog();
  let ids;
  if (!target || target === '--all') {
    ids = EXPECTED_DESIGNED_IDS;
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
    const screenshotDirs = [
      path.join(REPO_ROOT, 'screenshots'),
      path.join(REPO_ROOT, 'qa-output', 'pilot-batch', 'screenshots'),
      path.join(REPO_ROOT, 'qa-output', 'batch-20', 'screenshots'),
      path.join(REPO_ROOT, 'qa-output', 'batch-8', 'screenshots'),
    ];
    const screenshotHits = screenshotDirs.flatMap((directory) =>
      fs.existsSync(directory)
        ? fs.readdirSync(directory).filter((file) => file.includes(id))
        : [],
    );
    results.push({
      id,
      ok: match.design_status !== 'DESIGNED' || previewOk,
      design_status: match.design_status,
      preview_exists: previewOk,
      screenshot_artifacts: screenshotHits,
      level_a_browser_suite: fs.existsSync(path.join(REPO_ROOT, 'qa-output', 'batch-8', 'batch8-qa-results.json'))
        ? 'See qa-output/batch-8/batch8-qa-results.json'
        : 'See the template-specific batch QA artifact',
      level_b_client_render: 'NOT RUN',
    });
  }
  const ok = results.every((r) => r.ok);
  const lines = [
    ok ? 'PASS qa (artifact evidence only)' : 'FAIL qa',
    '  NOTE: This command inventories artifacts; use the dedicated batch harness for fresh browser QA.',
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
    'active_design_task=none (8-template batch completed; owner review required before final seven)',
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
