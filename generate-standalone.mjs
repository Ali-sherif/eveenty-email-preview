/**
 * Writes default EN standalone HTML files into emails/.
 * Run: node generate-standalone.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderEmail } from './shared/render-emails.js';
import { BATCH20_EMAIL_IDS } from './shared/batch20-definitions.js';
import { BATCH8_EMAIL_IDS } from './shared/batch8-definitions.js';
import { FINAL7_EMAIL_IDS } from './shared/final7-definitions.js';
import { POST_SCOPE_EMAIL_IDS } from './shared/post-scope-definitions.js';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, 'emails');
mkdirSync(outDir, { recursive: true });

const ids = [
  'activate_email',
  'festival_donation',
  'festival_ticket_sale',
  'festival_ticket_registration_approval',
  'support',
  'dispute_notification',
  'festival_marketing_email_target',
  'password_reset',
  'refund_receipt_user',
  'festival_ticket_registration_reject',
  'festival_approval_status_changed',
  'contact_submission',
  'organizer_announcement',
  ...BATCH20_EMAIL_IDS.map(({ id }) => id),
  ...BATCH8_EMAIL_IDS.map(({ id }) => id),
  ...FINAL7_EMAIL_IDS.map(({ id }) => id),
  ...POST_SCOPE_EMAIL_IDS.map(({ id }) => id),
];

const defaults = {
  activate_email: { locale: 'en', variant: 'default' },
  festival_donation: { locale: 'en', variant: 'donatorUser' },
  festival_ticket_sale: { locale: 'en', variant: 'buyerUser' },
  festival_ticket_registration_approval: { locale: 'en', variant: 'user_completeOrder' },
  support: { locale: 'en', variant: 'default' },
  dispute_notification: { locale: 'en', variant: 'organizer' },
  festival_marketing_email_target: { locale: 'en', variant: 'default' },
  password_reset: { locale: 'en', variant: 'default' },
  refund_receipt_user: { locale: 'en', variant: 'refundAndCanceled' },
  festival_ticket_registration_reject: { locale: 'en', variant: 'user' },
  festival_approval_status_changed: { locale: 'en', variant: 'approvedWithNote' },
  contact_submission: { locale: 'en', variant: 'default' },
  organizer_announcement: { locale: 'en', variant: 'default' },
  ...Object.fromEntries(
    BATCH20_EMAIL_IDS.map((definition) => [
      definition.id,
      { locale: definition.locales[0], variant: definition.variants[0] },
    ]),
  ),
  ...Object.fromEntries(
    BATCH8_EMAIL_IDS.map((definition) => [
      definition.id,
      { locale: definition.locales[0], variant: definition.variants[0] },
    ]),
  ),
  ...Object.fromEntries(
    FINAL7_EMAIL_IDS.map((definition) => [
      definition.id,
      { locale: definition.locales[0], variant: definition.variants[0] },
    ]),
  ),
  ...Object.fromEntries(
    POST_SCOPE_EMAIL_IDS.map((definition) => [
      definition.id,
      { locale: definition.locales[0], variant: definition.variants[0] },
    ]),
  ),
};

for (const id of ids) {
  const html = renderEmail(id, { ...defaults[id], assetBase: '../' });
  const path = join(outDir, `${id}.html`);
  writeFileSync(path, html, 'utf8');
  console.log('wrote', path);
}
