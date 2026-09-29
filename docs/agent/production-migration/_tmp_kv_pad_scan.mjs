import fs from 'fs';
import path from 'path';

const catalog = JSON.parse(fs.readFileSync('./catalog/email-catalog.json', 'utf8'));
const ids48 = catalog.emails.filter((e) => e.scope === 'IN_SCOPE').map((e) => e.id);
const idsPost = catalog.post_scope_emails.map((e) => e.id);
const ids50 = [...ids48, ...idsPost];

const kitDir = 'D:/last/rescounts-backend/email/templates/kit';
const flushRe = /padding:\s*6px\s+0/g;
const okRe = /padding:\s*10px\s+16px/g;
const vertOnlyRe = /padding:\s*(?:6|8|10|12)px\s+0(?!\s*\d)/g;
const borderedRe = /border:\s*1px\s+solid\s+#ebebeb/g;

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (/\.(template|html|js|mjs)$/.test(ent.name)) out.push(p);
  }
  return out;
}

console.log('=== PREVIEW emails/*.html ===');
const previewRows = [];
for (const id of ids50) {
  const f = path.join('./emails', id + '.html');
  if (!fs.existsSync(f)) {
    previewRows.push({ id, status: 'MISSING' });
    continue;
  }
  const html = fs.readFileSync(f, 'utf8');
  const flush6 = (html.match(flushRe) || []).length;
  const ok16 = (html.match(okRe) || []).length;
  const bordered = (html.match(borderedRe) || []).length;
  const vertOnly = (html.match(vertOnlyRe) || []).length;
  previewRows.push({ id, flush6, ok16, bordered, vertOnly });
}
console.log('flush6:', previewRows.filter((r) => r.flush6 > 0).map((r) => `${r.id}(${r.flush6})`).join(', ') || 'NONE');
console.log('vertOnly:', previewRows.filter((r) => r.vertOnly > 0).map((r) => `${r.id}(${r.vertOnly})`).join(', ') || 'NONE');
console.log('ok16 count emails:', previewRows.filter((r) => r.ok16 > 0).length);
console.log(
  'bordered no ok16:',
  previewRows.filter((r) => r.bordered > 0 && r.ok16 === 0).map((r) => `${r.id}(b=${r.bordered})`).join(', ') || 'NONE',
);
console.log('no bordered:', previewRows.filter((r) => r.bordered === 0).map((r) => r.id).join(', '));

console.log('\n=== KIT templates + partials ===');
const kitFiles = walk(kitDir);
const kitHits = [];
for (const p of kitFiles) {
  const t = fs.readFileSync(p, 'utf8');
  const n6 = (t.match(flushRe) || []).length;
  const n16 = (t.match(okRe) || []).length;
  const vert = (t.match(vertOnlyRe) || []).length;
  if (n6 || n16 || vert) {
    kitHits.push({
      file: path.relative(kitDir, p).replace(/\\/g, '/'),
      n6,
      n16,
      vert,
    });
  }
}
for (const h of kitHits.sort((a, b) => a.file.localeCompare(b.file))) {
  console.log(JSON.stringify(h));
}

console.log('\n=== Which of 50 use kit_registration_details partial? ===');
for (const id of ids50) {
  const f = path.join(kitDir, id + '.template');
  if (!fs.existsSync(f)) {
    console.log(id, 'MISSING TEMPLATE');
    continue;
  }
  const t = fs.readFileSync(f, 'utf8');
  const uses = [];
  if (t.includes('kit_registration_details_reject')) uses.push('reject');
  if (t.includes('kit_registration_details_approval')) uses.push('approval');
  if (t.includes('kit_registration_details"') || t.includes('kit_registration_details ')) uses.push('table');
  if (/template "kit_registration_details"/.test(t)) uses.push('table-exact');
  const n6 = (t.match(flushRe) || []).length;
  const n16 = (t.match(okRe) || []).length;
  if (uses.length || n6 || n16) console.log(id, { uses, n6, n16 });
}

console.log('\n=== SHARED helpers flush6 / ok16 ===');
for (const p of walk('./shared')) {
  const t = fs.readFileSync(p, 'utf8');
  const n6 = (t.match(flushRe) || []).length;
  const n16 = (t.match(okRe) || []).length;
  if (n6 || n16) console.log(path.relative('.', p).replace(/\\/g, '/'), { n6, n16 });
}
