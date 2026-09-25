import { EMAIL_IDS, SAMPLE } from './shared/sample-data.js';
import { renderEmail } from './shared/render-emails.js';

const els = {
  email: document.getElementById('emailSelect'),
  locale: document.getElementById('localeSelect'),
  variant: document.getElementById('variantSelect'),
  viewport: document.getElementById('viewportSelect'),
  blocked: document.getElementById('blockedImages'),
  long: document.getElementById('longContent'),
  frame: document.getElementById('previewFrame'),
  wrap: document.getElementById('frameWrap'),
  label: document.getElementById('viewportLabel'),
  annotation: document.getElementById('previewAnnotation'),
  meta: document.getElementById('metaPanel'),
  sourcePanel: document.getElementById('sourcePanel'),
  sourcePre: document.getElementById('sourcePre'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnDownload: document.getElementById('btnDownload'),
  btnToggleSource: document.getElementById('btnToggleSource'),
  catalogFamily: document.getElementById('catalogFamily'),
  catalogStatus: document.getElementById('catalogStatus'),
  catalogList: document.getElementById('catalogList'),
};

/** @type {null | { emails: Array<Record<string, unknown>> }} */
let catalog = null;

let currentHtml = '';

function currentDef() {
  return EMAIL_IDS.find((e) => e.id === els.email.value) || EMAIL_IDS[0];
}

function fillSelect(select, options, selected) {
  select.innerHTML = '';
  for (const opt of options) {
    const o = document.createElement('option');
    if (typeof opt === 'string') {
      o.value = opt;
      o.textContent = opt;
    } else {
      o.value = opt.id;
      o.textContent = opt.label;
    }
    select.appendChild(o);
  }
  if (selected) select.value = selected;
}

function syncDependentControls() {
  const def = currentDef();
  fillSelect(els.locale, def.locales, def.locales[0]);
  fillSelect(els.variant, def.variants, def.variants[0]);
}

function updateMeta() {
  const def = currentDef();
  els.meta.innerHTML = `
    <dt>Template</dt><dd>${def.id}</dd>
    <dt>Design Kit family</dt><dd>${def.master}</dd>
    <dt>Backend family</dt><dd>${def.backendFamily || '—'}</dd>
    <dt>Subfolder</dt><dd>${def.subfolder || '—'}</dd>
    <dt>Figma node</dt><dd>${def.figma}</dd>
    <dt>Design status</dt><dd>${def.designStatus || 'DESIGNED'} — owner visual approval pending</dd>
  `;
}

function renderCatalogList() {
  if (!els.catalogList || !catalog) return;
  const family = els.catalogFamily?.value || 'all';
  const status = els.catalogStatus?.value || 'all';
  const items = catalog.emails.filter((e) => {
    const famKey = e.scope === 'EXCLUDED' ? 'Excluded' : e.design_kit_family;
    if (family !== 'all' && famKey !== family) return false;
    if (status !== 'all' && e.design_status !== status) return false;
    return true;
  });
  els.catalogList.innerHTML = items
    .map((e) => {
      const selectable = e.preview_selectable;
      const statusLabel = e.design_status === 'DESIGNED' ? 'DESIGNED' : e.design_status === 'UNDESIGNED' ? 'UNDESIGNED' : 'EXCLUDED';
      if (selectable) {
        return `<li><button type="button" class="catalog-link" data-email-id="${e.id}">${e.id}</button> <span class="catalog-tag">${statusLabel}</span> <span class="catalog-path">${e.functional_subfolder}</span></li>`;
      }
      return `<li><span class="catalog-id">${e.id}</span> <span class="catalog-tag muted">${statusLabel}</span> <span class="catalog-path">${e.functional_subfolder}</span></li>`;
    })
    .join('');
  els.catalogList.querySelectorAll('[data-email-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      els.email.value = btn.getAttribute('data-email-id');
      syncDependentControls();
      render();
    });
  });
}

async function loadCatalog() {
  try {
    const res = await fetch('./catalog/email-catalog.json');
    if (!res.ok) throw new Error(String(res.status));
    catalog = await res.json();
    renderCatalogList();
  } catch (err) {
    if (els.catalogList) {
      els.catalogList.innerHTML = `<li class="catalog-error">Catalog unavailable (${err.message}). Seven previews still work.</li>`;
    }
  }
}

function applyBlockedImages(html) {
  if (!els.blocked.checked) return html;
  // Simulate blocked images without injecting script into email: strip src, keep alt/dimensions.
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs) => {
    const alt = (attrs.match(/\balt=("([^"]*)"|'([^']*)')/i) || [])[2] || (attrs.match(/\balt=("([^"]*)"|'([^']*)')/i) || [])[3] || 'Image';
    const width = (attrs.match(/\bwidth=("([^"]*)"|'([^']*)'|\s*=\s*(\d+))/i) || [])[2] || '200';
    const height = (attrs.match(/\bheight=("([^"]*)"|'([^']*)'|\s*=\s*(\d+))/i) || [])[2] || '80';
    return `<div role="img" aria-label="${alt}" style="display:inline-block;width:${width}px;max-width:100%;min-height:${height}px;border:1px dashed #acacac;background:#eee;color:#7b7b79;font-family:Arial,sans-serif;font-size:11px;line-height:1.3;padding:8px;text-align:center;box-sizing:border-box;">[blocked image]<br>${alt}</div>`;
  });
}

function updatePreviewAnnotation(def) {
  if (!els.annotation) return;
  // Preview-only notes stay outside the email canvas.
  if (def.id === 'activate_email') {
    els.annotation.hidden = false;
    els.annotation.innerHTML =
      `<strong>PREVIEW ANNOTATION</strong> — Hidden inbox preheader (not in email body): ${SAMPLE.activate.preheader}`;
  } else if (def.id === 'festival_donation') {
    els.annotation.hidden = false;
    els.annotation.innerHTML =
      `<strong>PREVIEW ANNOTATION</strong> — Hidden inbox preheader outside canvas. Totals SAMPLE. Admin donation path is EN-forced in production.`;
  } else if (def.id === 'festival_ticket_sale') {
    els.annotation.hidden = false;
    els.annotation.innerHTML =
      `<strong>PREVIEW ANNOTATION</strong> — Hidden inbox preheader outside canvas. QR/Wallet/Calendar use SAMPLE fixtures (example.com). MIME attachments not rendered.`;
  } else if (def.id === 'festival_ticket_registration_approval') {
    els.annotation.hidden = false;
    els.annotation.innerHTML =
      `<strong>PREVIEW ANNOTATION</strong> — Complete Order CTA uses design-kit yellow (Activation standard). Production template still uses magenta #d80073 — owner decision.`;
  } else if (def.id === 'support') {
    els.annotation.hidden = false;
    els.annotation.innerHTML =
      `<strong>PREVIEW ANNOTATION</strong> — EN-only internal ops. No primary CTA in production contract. Preview uses branded header (design kit), not production header_3 footer CDN logo.`;
  } else if (def.id === 'dispute_notification') {
    els.annotation.hidden = false;
    els.annotation.innerHTML =
      `<strong>PREVIEW ANNOTATION</strong> — Organizer uses locale; admin variant forces EN. View Payment CTA only when variant=withPaymentLink.`;
  } else if (def.id === 'festival_marketing_email_target') {
    els.annotation.hidden = false;
    els.annotation.innerHTML =
      `<strong>PREVIEW ANNOTATION</strong> — Author body + festival assets. Unsubscribe URL is SAMPLE (example.com).`;
  } else if (def.id === 'password_reset') {
    els.annotation.hidden = false;
    els.annotation.innerHTML = `<strong>PILOT · OWNER REVIEW PENDING</strong> — Five backend locales. Verification code and account data are synthetic.`;
  } else if (def.id === 'refund_receipt_user') {
    els.annotation.hidden = false;
    els.annotation.innerHTML = `<strong>PILOT · OWNER REVIEW PENDING</strong> — Five backend locales. Variants cover refunded/canceled conditionals; all money and item data are synthetic.`;
  } else if (def.id === 'festival_ticket_registration_reject') {
    els.annotation.hidden = false;
    els.annotation.innerHTML = `<strong>PILOT · OWNER REVIEW PENDING</strong> — User/organizer follow profile locale; admin renders EN in production and is forced to EN here.`;
  } else if (def.id === 'festival_approval_status_changed') {
    els.annotation.hidden = false;
    els.annotation.innerHTML = `<strong>PILOT · OWNER REVIEW PENDING</strong> — Five backend locales; approved/rejected and optional review-note states included.`;
  } else if (def.id === 'contact_submission') {
    els.annotation.hidden = false;
    els.annotation.innerHTML = `<strong>PILOT · OWNER REVIEW PENDING</strong> — EN-only internal operational email; contact fields are synthetic.`;
  } else if (def.id === 'organizer_announcement') {
    els.annotation.hidden = false;
    els.annotation.innerHTML = `<strong>PILOT · OWNER REVIEW PENDING</strong> — Caller-supplied subject/body with no backend locale selection; sample author content is synthetic.`;
  } else {
    els.annotation.hidden = true;
    els.annotation.textContent = '';
  }
}

function render() {
  const def = currentDef();
  const locale = els.locale.value;
  const variant = els.variant.value;
  let html = renderEmail(def.id, {
    locale,
    variant,
    longContent: els.long.checked,
  });
  html = applyBlockedImages(html);
  currentHtml = html;
  // Isolated document — preview chrome JS never runs inside email
  els.frame.srcdoc = html;
  els.sourcePre.textContent = html;
  updateMeta();
  updatePreviewAnnotation(def);
}

function setViewport() {
  const w = els.viewport.value;
  els.wrap.style.width = `${w}px`;
  els.label.textContent = `${w}px viewport`;
}

function downloadHtml() {
  const def = currentDef();
  // Rewrite preview-root asset paths so the file works from emails/
  const standalone = currentHtml.replace(/(src|href)=(["'])\.\/assets\//g, '$1=$2../assets/');
  const blob = new Blob([standalone], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${def.id}-${els.locale.value}-${els.variant.value}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

fillSelect(els.email, EMAIL_IDS, EMAIL_IDS[0].id);
syncDependentControls();
setViewport();
render();
loadCatalog();

els.email.addEventListener('change', () => {
  syncDependentControls();
  render();
});
els.locale.addEventListener('change', render);
els.variant.addEventListener('change', render);
els.long.addEventListener('change', render);
els.blocked.addEventListener('change', render);
els.viewport.addEventListener('change', setViewport);
els.btnRefresh.addEventListener('click', render);
els.btnDownload.addEventListener('click', downloadHtml);
els.btnToggleSource.addEventListener('click', () => {
  els.sourcePanel.hidden = !els.sourcePanel.hidden;
});
els.catalogFamily?.addEventListener('change', renderCatalogList);
els.catalogStatus?.addEventListener('change', renderCatalogList);
