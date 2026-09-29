/**
 * Post-original-scope Kit preview additions (#49, #50).
 * Historic approved Preview scope remains 48 — these are current Kit previews only.
 */
const EN = Object.freeze(['en']);

function definition({ id, kitNumber, master, backendFamily, subfolder, locales, variants }) {
  return Object.freeze({
    id,
    kitNumber,
    label: `${master === 'COMMERCE' ? '02-Commerce' : '03-Notification'} / ${subfolder} — ${id} [Kit #${kitNumber} · post-original-scope]`,
    master,
    backendFamily,
    subfolder,
    designStatus: 'DESIGNED',
    reviewStatus: 'CURRENT KIT PREVIEW · POST-ORIGINAL-SCOPE ADDITION · DESIGN-SYSTEM REVIEWED',
    previewStatus: 'current Kit preview · post-original-scope addition · design-system reviewed',
    figma: 'HTML only (Kit design system)',
    locales,
    variants,
    postOriginalScope: true,
  });
}

export const POST_SCOPE_EMAIL_IDS = Object.freeze([
  definition({
    id: 'organizer_team_invitation',
    kitNumber: 49,
    master: 'NOTIFICATION',
    backendFamily: 'Workflow/Status',
    subfolder: 'Organizer-Team',
    locales: EN,
    variants: Object.freeze(['existingUser', 'newUser']),
  }),
  definition({
    id: 'festival_end_of_day_report',
    kitNumber: 50,
    master: 'NOTIFICATION',
    backendFamily: 'Internal/Operational',
    subfolder: 'Organizer-Reports',
    locales: EN,
    variants: Object.freeze(['multiFestival', 'singleFestival', 'noSales']),
  }),
]);

export const POST_SCOPE_PREVIEW_IDS = Object.freeze(POST_SCOPE_EMAIL_IDS.map(({ id }) => id));

export const HISTORIC_APPROVED_PREVIEW_SCOPE = 48;
export const CURRENT_KIT_PREVIEW_SCOPE = HISTORIC_APPROVED_PREVIEW_SCOPE + POST_SCOPE_EMAIL_IDS.length;

if (POST_SCOPE_EMAIL_IDS.length !== 2 || new Set(POST_SCOPE_PREVIEW_IDS).size !== 2) {
  throw new Error('Post-scope definitions must contain exactly two distinct IDs (#49, #50)');
}

if (CURRENT_KIT_PREVIEW_SCOPE !== 50) {
  throw new Error(`Current Kit preview scope must be 50, got ${CURRENT_KIT_PREVIEW_SCOPE}`);
}
