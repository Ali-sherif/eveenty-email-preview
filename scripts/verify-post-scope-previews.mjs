import { readFileSync, existsSync } from 'node:fs';
import { renderEmail } from '../shared/render-emails.js';

function check(name, preview, assertions) {
  const results = {};
  for (const [key, fn] of Object.entries(assertions)) {
    results[key] = Boolean(fn(preview));
  }
  const failed = Object.entries(results).filter(([, ok]) => !ok).map(([k]) => k);
  console.log(name, failed.length ? `FAIL ${failed.join(',')}` : 'PASS', results);
  return failed.length === 0;
}

const otiExisting = renderEmail('organizer_team_invitation', { variant: 'existingUser', assetBase: '../' });
const otiNew = renderEmail('organizer_team_invitation', { variant: 'newUser', assetBase: '../' });
const eodMulti = renderEmail('festival_end_of_day_report', { variant: 'multiFestival', assetBase: '../' });
const eodSingle = renderEmail('festival_end_of_day_report', { variant: 'singleFestival', assetBase: '../' });
const eodNoSales = renderEmail('festival_end_of_day_report', { variant: 'noSales', assetBase: '../' });

const kitOti = readFileSync(
  'docs/agent/production-migration/baselines/organizer_team_invitation/existing_user__en.kit.html',
  'utf8',
);
const kitEod = readFileSync(
  'docs/agent/production-migration/baselines/festival_end_of_day_report/multi_festival__en.fresh.kit.html',
  'utf8',
);

let ok = true;
ok =
  check('oti-existing', otiExisting, {
    heading: (h) => h.includes('Organizer Team Invitation'),
    sub: (h) => h.includes('collaborate with a team of organizers'),
    body: (h) => h.includes('Great news! You have been invited'),
    cta: (h) => h.includes('Accept invitation') && h.includes('preview-token-existing'),
    secondary: (h) => h.includes('Or open the invitation link directly'),
    kitColors: (h) => h.includes('#e9d023') && h.includes('#fefdf4') && h.includes('#d80073') && h.includes('#4d4c49'),
    footer: (h) => h.includes('invited to join an organizer team'),
    localLogo: (h) => h.includes('../assets/logos/eveenty-logo-en.png'),
  }) && ok;

ok =
  check('oti-new', otiNew, {
    heading: (h) => h.includes('Create your account to get started'),
    body: (h) => h.includes('create a free account'),
    ctaSignup: (h) => h.includes('Create your account') && h.includes('https://www.eveenty.com/register'),
    secondaryInvite: (h) => h.includes('preview-token-new'),
  }) && ok;

ok =
  check('eod-multi', eodMulti, {
    title: (h) => h.includes('End of Day Sales Report'),
    date: (h) => h.includes('Saturday, March 14, 2026'),
    festivals: (h) => h.includes('Snapshot Festival 2026') && h.includes('Second Snapshot Fest'),
    metrics: (h) =>
      ['Items', 'Transactions', 'Total', 'Sold To Date', '% Sold', 'Subtotal', 'Day Total'].every((l) =>
        h.includes(l),
      ),
    cards: (h) => h.includes('Tickets') && h.includes('Booths') && h.includes('Donations'),
    noSalesFest: (h) => h.includes('No sales were recorded for this festival on this day.'),
    noLegacyTable: (h) => !h.includes('eod-table') && !h.includes('min-width:680px'),
    help: (h) => h.includes('Need Help?') && h.includes('mailto:info@eveenty.com'),
    kitChrome: (h) => h.includes('#fefdf4') && h.includes('#fffbeb') && h.includes('#d80073'),
  }) && ok;

ok =
  check('eod-single', eodSingle, {
    singleIntro: (h) => h.includes('sales summary for') && h.includes('Snapshot Festival 2026'),
    activities: (h) => h.includes('Activities'),
    totalCard: (h) => h.includes('>Total</td>') || h.includes('>Total</'),
  }) && ok;

ok =
  check('eod-noSales', eodNoSales, {
    empty: (h) => h.includes('No sales were recorded for this festival on this day.'),
  }) && ok;

// Kit baseline still has expected chrome tokens
ok =
  check('kit-baselines-present', kitOti + kitEod, {
    otiKit: () => kitOti.includes('Accept invitation'),
    eodKit: () => kitEod.includes('Day Total') && !kitEod.includes('min-width:680px'),
  }) && ok;

ok =
  check('static-files', '', {
    otiFile: () => existsSync('emails/organizer_team_invitation.html'),
    eodFile: () => existsSync('emails/festival_end_of_day_report.html'),
    otiStaticMatchesExisting: () =>
      readFileSync('emails/organizer_team_invitation.html', 'utf8').includes('Accept invitation'),
    eodStaticMatchesMulti: () =>
      readFileSync('emails/festival_end_of_day_report.html', 'utf8').includes('Second Snapshot Fest'),
  }) && ok;

console.log(ok ? 'ALL STRUCTURE CHECKS PASS' : 'STRUCTURE CHECKS FAILED');
process.exit(ok ? 0 : 1);
