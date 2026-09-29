/**
 * Official Preview renderers for post-original-scope Kit #49 / #50.
 * Structure mirrors current Kit templates in rescounts-backend/email/templates/kit/.
 * Fixtures are inert preview values; logo uses local Design Kit assets.
 */
import {
  wrapEmailDocument,
  brandedHeader,
  brandedFooter,
  primaryCtaYellow,
  esc,
} from './email-kit.js';
import { TOKENS as T } from './tokens.js';

const COPYRIGHT = '© Eveenty. All rights reserved.';
const REPORT_DATE = 'Saturday, March 14, 2026';
const RAW_DATE = '2026-03-14';

const OTI = Object.freeze({
  existingUser: Object.freeze({
    heading: 'Organizer Team Invitation',
    subHeading: "You've been invited to collaborate with a team of organizers on Eveenty.",
    bodyFirst:
      'Great news! You have been invited to join an organizer team on Eveenty. This is your chance to manage festivals and collaborate with your teammates in one place.',
    bodySecond:
      'Click the button below to review and accept your invitation. For your security, this invitation will expire after 7 days.',
    buttonText: 'Accept invitation',
    buttonURL: 'https://www.example.com/organizer-team/invites/preview-token-existing',
    secondaryURL: 'https://www.example.com/organizer-team/invites/preview-token-existing',
    email: 'invitee.existing@example.com',
  }),
  newUser: Object.freeze({
    heading: 'Create your account to get started',
    subHeading: "You've been invited to collaborate with a team of organizers on Eveenty.",
    bodyFirst:
      'Good news! You have been invited to join an organizer team on Eveenty. To accept this invitation, you first need to create a free account using this email address.',
    bodySecond:
      'Once your account is created, you can return to your invitation and accept it to start collaborating with your team.',
    buttonText: 'Create your account',
    buttonURL: 'https://www.eveenty.com/register',
    secondaryURL: 'https://www.example.com/organizer-team/invites/preview-token-new',
    email: 'invitee.new@example.com',
  }),
});

function metricRow(label, valueHtml) {
  return `<tr>
                              <td align="left" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:13px;font-weight:600;color:#4d4c49;width:48%;">${esc(label)}</td>
                              <td align="right" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:14px;font-weight:500;color:#2b2a28;">${valueHtml}</td>
                            </tr>`;
}

function saleTypeCard(saleType) {
  const subtotalWeight = 'font-weight:600';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid #ebebeb;border-radius:8px;background-color:#ffffff;margin:0 0 12px 0;">
                      <tr>
                        <td style="padding:12px 14px;font-size:15px;font-weight:600;color:#2b2a28;">${esc(saleType.SaleType)}</td>
                      </tr>
                      <tr>
                        <td style="padding:0 6px 8px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                            ${metricRow('Items', `<span dir="ltr">${esc(String(saleType.ItemsCount))}</span>`)}
                            ${metricRow('Transactions', `<span dir="ltr">${esc(String(saleType.TransactionsCount))}</span>`)}
                            ${metricRow('Total', `<span dir="ltr">${esc(String(saleType.TotalItems))}</span>`)}
                            ${metricRow('Sold To Date', `<span dir="ltr">${esc(String(saleType.TotalSoldItems))}</span>`)}
                            ${metricRow('% Sold', `<span dir="ltr">${esc(saleType.SoldPercentage)}</span>`)}
                            <tr>
                              <td align="left" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:13px;font-weight:600;color:#4d4c49;">Subtotal</td>
                              <td align="right" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:14px;${subtotalWeight};color:#2b2a28;"><span dir="ltr">${esc(saleType.Subtotal)}</span></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>`;
}

function dayTotalCard(day) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:#fffbeb;border:1px solid #e6d1b9;border-radius:8px;margin:0 0 8px 0;">
                      <tr>
                        <td style="padding:12px 14px 4px;font-size:14px;font-weight:700;color:#2b2a28;">Day Total</td>
                      </tr>
                      <tr>
                        <td style="padding:0 6px 10px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                            <tr>
                              <td align="left" style="padding:6px 10px;font-size:13px;font-weight:600;color:#4d4c49;">Items</td>
                              <td align="right" style="padding:6px 10px;font-size:14px;font-weight:700;color:#2b2a28;"><span dir="ltr">${esc(String(day.TotalItems))}</span></td>
                            </tr>
                            <tr>
                              <td align="left" style="padding:6px 10px;font-size:13px;font-weight:600;color:#4d4c49;">Transactions</td>
                              <td align="right" style="padding:6px 10px;font-size:14px;font-weight:700;color:#2b2a28;"><span dir="ltr">${esc(String(day.TotalTransactions))}</span></td>
                            </tr>
                            <tr>
                              <td align="left" style="padding:6px 10px;font-size:13px;font-weight:600;color:#4d4c49;">Subtotal</td>
                              <td align="right" style="padding:6px 10px;font-size:14px;font-weight:700;color:#2b2a28;"><span dir="ltr">${esc(day.TotalSubtotal)}</span></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 16px 0;font-size:12px;line-height:1.5;color:#4d4c49;">
                      % Sold is the share of the total sold to date. A dash means the sale type has no total.
                    </p>`;
}

function festivalSection(festival) {
  let body;
  if (!festival.HasSales) {
    body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:#f9f9f9;border:1px solid #ebebeb;border-radius:8px;">
                      <tr>
                        <td style="padding:16px;font-size:15px;line-height:1.5;color:#4d4c49;">No sales were recorded for this festival on this day.</td>
                      </tr>
                    </table>`;
  } else {
    body = festival.Days.map((day) => {
      if (!day.HasSales) {
        return `<h3 style="margin:0 0 8px 0;font-size:15px;font-weight:600;line-height:1.3;color:#2b2a28;">${esc(day.Date)}</h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:#f9f9f9;border:1px solid #ebebeb;border-radius:8px;margin:0 0 16px 0;">
                      <tr>
                        <td style="padding:14px 16px;font-size:15px;line-height:1.5;color:#4d4c49;">No sales were recorded for this day.</td>
                      </tr>
                    </table>`;
      }
      return `<h3 style="margin:0 0 12px 0;font-size:15px;font-weight:600;line-height:1.3;color:#2b2a28;">${esc(day.Date)}</h3>
                    ${day.SaleTypes.map(saleTypeCard).join('\n')}
                    ${dayTotalCard(day)}`;
    }).join('\n');
  }

  return `<tr>
            <td class="stack-pad" style="padding:16px 30px 8px 30px;background-color:#ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid #ebebeb;border-radius:12px;background-color:#ffffff;">
                <tr>
                  <td style="padding:16px 18px;background-color:#fefdf4;border-bottom:1px solid #ebebeb;font-family:Arial, Helvetica, 'Roboto', Tahoma, sans-serif;">
                    <h2 style="margin:0 0 6px 0;font-size:17px;font-weight:600;line-height:1.3;color:#2b2a28;"><bdi>${esc(festival.FestivalName)}</bdi></h2>
                    <p style="margin:0;font-size:14px;line-height:1.5;color:#4d4c49;">${esc(festival.TimeZone)} &nbsp;•&nbsp; ${esc(festival.CurrencyLabel)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;font-family:Arial, Helvetica, 'Roboto', Tahoma, sans-serif;">
                    ${body}
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function singlePathSaleCard(saleType) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid #ebebeb;border-radius:8px;background-color:#ffffff;margin:0 0 12px 0;">
                <tr>
                  <td style="padding:12px 14px;font-size:15px;font-weight:600;color:#2b2a28;">${esc(saleType.SaleType)}</td>
                </tr>
                <tr>
                  <td style="padding:0 6px 10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td align="left" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:13px;font-weight:600;color:#4d4c49;">Items</td>
                        <td align="right" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:14px;font-weight:500;color:#2b2a28;"><span dir="ltr">${esc(String(saleType.ItemsCount))}</span></td>
                      </tr>
                      <tr>
                        <td align="left" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:13px;font-weight:600;color:#4d4c49;">Transactions</td>
                        <td align="right" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:14px;font-weight:500;color:#2b2a28;"><span dir="ltr">${esc(String(saleType.TransactionsCount))}</span></td>
                      </tr>
                      <tr>
                        <td align="left" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:13px;font-weight:600;color:#4d4c49;">% Sold</td>
                        <td align="right" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:14px;font-weight:500;color:#2b2a28;"><span dir="ltr">${esc(saleType.SoldPercentage)}</span></td>
                      </tr>
                      <tr>
                        <td align="left" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:13px;font-weight:600;color:#4d4c49;">Subtotal</td>
                        <td align="right" style="padding:8px 10px;border-top:1px solid #ebebeb;font-size:14px;font-weight:600;color:#2b2a28;"><span dir="ltr">${esc(saleType.Subtotal)}</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>`;
}

function helpCallout() {
  return `<tr>
            <td class="stack-pad" style="padding:8px 30px 16px 30px;background-color:#ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:#f9f9f9;border-left:4px solid #d80073;border-radius:8px;">
                <tr>
                  <td style="padding:16px 18px;font-family:Arial, Helvetica, 'Roboto', Tahoma, sans-serif;">
                    <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;line-height:1.3;color:#2b2a28;">Need Help?</h3>
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#4d4c49;">
                      If you have any questions or need assistance, please contact us at <a href="mailto:info@eveenty.com" style="color:#d80073;text-decoration:none;font-weight:600;">info@eveenty.com</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

const MULTI_FESTIVALS = Object.freeze([
  Object.freeze({
    FestivalName: 'Snapshot Festival 2026',
    TimeZone: 'America/Toronto',
    CurrencyLabel: 'CAD',
    Currency: 'CAD',
    From: RAW_DATE,
    To: RAW_DATE,
    HasSales: true,
    Days: Object.freeze([
      Object.freeze({
        Date: REPORT_DATE,
        RawDate: RAW_DATE,
        HasSales: true,
        TotalItems: 17,
        TotalTransactions: 10,
        TotalSubtotal: 'CA$1,400.00',
        SaleTypes: Object.freeze([
          Object.freeze({
            SaleType: 'Tickets',
            SaleTypeKey: 'tickets',
            ItemsCount: 12,
            TransactionsCount: 5,
            TotalItems: 100,
            TotalSoldItems: 40,
            SoldPercentage: '40%',
            Subtotal: 'CA$450.00',
            Currency: 'CAD',
          }),
          Object.freeze({
            SaleType: 'Booths',
            SaleTypeKey: 'booths',
            ItemsCount: 2,
            TransactionsCount: 2,
            TotalItems: 20,
            TotalSoldItems: 8,
            SoldPercentage: '40%',
            Subtotal: 'CA$800.00',
            Currency: 'CAD',
          }),
          Object.freeze({
            SaleType: 'Donations',
            SaleTypeKey: 'donations',
            ItemsCount: 3,
            TransactionsCount: 3,
            TotalItems: 0,
            TotalSoldItems: 3,
            SoldPercentage: '—',
            Subtotal: 'CA$150.00',
            Currency: 'CAD',
          }),
        ]),
      }),
    ]),
  }),
  Object.freeze({
    FestivalName: 'Second Snapshot Fest',
    TimeZone: 'America/Toronto',
    CurrencyLabel: 'CAD',
    Currency: 'CAD',
    From: RAW_DATE,
    To: RAW_DATE,
    HasSales: false,
    Days: Object.freeze([]),
  }),
]);

const SINGLE_FESTIVAL_SALE_TYPES = Object.freeze([
  Object.freeze({
    SaleType: 'Tickets',
    SaleTypeKey: 'tickets',
    ItemsCount: 12,
    TransactionsCount: 5,
    TotalItems: 100,
    TotalSoldItems: 40,
    SoldPercentage: '40%',
    Subtotal: 'CA$450.00',
    Currency: 'CAD',
  }),
  Object.freeze({
    SaleType: 'Activities',
    SaleTypeKey: 'activities',
    ItemsCount: 4,
    TransactionsCount: 2,
    TotalItems: 50,
    TotalSoldItems: 10,
    SoldPercentage: '20%',
    Subtotal: 'CA$220.00',
    Currency: 'CAD',
  }),
]);

const NO_SALES_FESTIVALS = Object.freeze([
  Object.freeze({
    FestivalName: 'Snapshot Festival 2026',
    TimeZone: 'America/Toronto',
    CurrencyLabel: 'CAD',
    Currency: 'CAD',
    From: RAW_DATE,
    To: RAW_DATE,
    HasSales: false,
    Days: Object.freeze([]),
  }),
]);

function renderOrganizerTeamInvitation(variant, longContent) {
  const key = variant === 'newUser' ? 'newUser' : 'existingUser';
  const copy = OTI[key];
  const bodyFirst = longContent
    ? `${copy.bodyFirst} ${'Additional collaboration guidance for preview wrapping. '.repeat(4)}`
    : copy.bodyFirst;
  const bodySecond = longContent
    ? `${copy.bodySecond} ${'Please review team permissions carefully before accepting. '.repeat(3)}`
    : copy.bodySecond;

  const rows = `
          <tr>
            <td align="center" class="stack-pad" style="padding:40px 30px 16px 30px;background-color:#ffffff;">
              <h1 style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:24px;font-weight:600;line-height:1.3;color:#2b2a28;text-align:center;">${esc(copy.heading)}</h1>
              <p style="margin:0;font-family:Arial, Helvetica, 'Roboto', Tahoma, sans-serif;font-size:16px;line-height:1.6;color:#4d4c49;text-align:center;">${esc(copy.subHeading)}</p>
            </td>
          </tr>
          <tr>
            <td align="left" class="stack-pad" style="padding:8px 30px 24px 30px;background-color:#ffffff;font-family:Arial, Helvetica, 'Roboto', Tahoma, sans-serif;">
              <p style="margin:0 0 18px 0;font-size:16px;line-height:1.6;color:#4d4c49;">${esc(bodyFirst)}</p>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#4d4c49;">${esc(bodySecond)}</p>
            </td>
          </tr>
          <tr>
            <td align="center" class="stack-pad" style="padding:0 30px 12px 30px;background-color:#ffffff;">
              ${primaryCtaYellow({ href: copy.buttonURL, label: copy.buttonText })}
            </td>
          </tr>
          <tr>
            <td align="center" class="stack-pad" style="padding:0 30px 24px 30px;background-color:#ffffff;">
              <a href="${esc(copy.secondaryURL)}" style="font-family:Arial, Helvetica, 'Roboto', Tahoma, sans-serif;font-size:15px;line-height:1.4;color:#4d4c49;text-decoration:underline;">Or open the invitation link directly</a>
            </td>
          </tr>
          ${brandedFooter({
            email: copy.email,
            copyright: COPYRIGHT,
            dir: 'ltr',
            footerLead:
              'You are receiving this email because you were invited to join an organizer team on Eveenty. Sent to',
            footerSuffix: '.',
          })}`;

  return wrapEmailDocument({
    lang: 'en',
    dir: 'ltr',
    title: copy.heading,
    bodyRows: `${brandedHeader({ locale: 'en', dir: 'ltr', logoWidth: 160 })}${rows}`,
  });
}

function renderFestivalEndOfDayReport(variant, longContent) {
  const toName = longContent ? 'Bob Organizer With A Very Long Display Name For Wrapping' : 'Bob Organizer';
  const footerEmail = 'organizer@example.com';
  let festivalRows;
  let intro;

  if (variant === 'singleFestival') {
    // Dead-path Kit branch (.SaleTypes without .Festivals) — preserved for contract coverage.
    intro = `Here is the sales summary for <strong>${esc('Snapshot Festival 2026')}</strong> for <strong>${esc(REPORT_DATE)}</strong>.`;
    const totals = { TotalItems: 16, TotalTransactions: 7, TotalSubtotal: 'CA$670.00' };
    festivalRows = `<tr>
            <td class="stack-pad" style="padding:16px 30px 8px 30px;background-color:#ffffff;font-family:Arial, Helvetica, 'Roboto', Tahoma, sans-serif;">
              ${SINGLE_FESTIVAL_SALE_TYPES.map(singlePathSaleCard).join('\n')}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:#fffbeb;border:1px solid #e6d1b9;border-radius:8px;margin:0 0 8px 0;">
                <tr>
                  <td style="padding:12px 14px 4px;font-size:14px;font-weight:700;color:#2b2a28;">Total</td>
                </tr>
                <tr>
                  <td style="padding:0 6px 10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td align="left" style="padding:6px 10px;font-size:13px;font-weight:600;color:#4d4c49;">Items</td>
                        <td align="right" style="padding:6px 10px;font-size:14px;font-weight:700;color:#2b2a28;"><span dir="ltr">${totals.TotalItems}</span></td>
                      </tr>
                      <tr>
                        <td align="left" style="padding:6px 10px;font-size:13px;font-weight:600;color:#4d4c49;">Transactions</td>
                        <td align="right" style="padding:6px 10px;font-size:14px;font-weight:700;color:#2b2a28;"><span dir="ltr">${totals.TotalTransactions}</span></td>
                      </tr>
                      <tr>
                        <td align="left" style="padding:6px 10px;font-size:13px;font-weight:600;color:#4d4c49;">Subtotal</td>
                        <td align="right" style="padding:6px 10px;font-size:14px;font-weight:700;color:#2b2a28;"><span dir="ltr">${esc(totals.TotalSubtotal)}</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px 0;font-size:12px;line-height:1.5;color:#4d4c49;">
                % Sold is the share of the total sold to date. A dash means the sale type has no total.
              </p>
            </td>
          </tr>`;
  } else if (variant === 'noSales') {
    intro = `Here is the sales summary for your festivals for <strong>${esc(REPORT_DATE)}</strong>.`;
    festivalRows = NO_SALES_FESTIVALS.map(festivalSection).join('\n');
  } else {
    // Default / multiFestival — production sender path (.Festivals)
    intro = `Here is the sales summary for your festivals for <strong>${esc(REPORT_DATE)}</strong>.`;
    festivalRows = MULTI_FESTIVALS.map(festivalSection).join('\n');
  }

  const rows = `
          <tr>
            <td align="left" class="stack-pad" style="padding:32px 30px 8px 30px;background-color:#ffffff;font-family:Arial, Helvetica, 'Roboto', Tahoma, sans-serif;">
              <h1 style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:24px;font-weight:600;line-height:1.3;color:#2b2a28;">End of Day Sales Report</h1>
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#4d4c49;">Dear <bdi>${esc(toName)}</bdi>,</p>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#4d4c49;">
                ${intro}
              </p>
            </td>
          </tr>
          ${festivalRows}
          ${helpCallout()}
          ${brandedFooter({
            email: footerEmail,
            copyright: COPYRIGHT,
            dir: 'ltr',
            footerLead: 'You are receiving this email because you are an organizer on Eveenty. Sent to',
            footerSuffix: '.',
          })}`;

  return wrapEmailDocument({
    lang: 'en',
    dir: 'ltr',
    title: 'End of Day Sales Report',
    bodyRows: `${brandedHeader({ locale: 'en', dir: 'ltr', logoWidth: 160 })}${rows}`,
  });
}

export function renderPostScopeEmail(emailId, options = {}) {
  const variant = options.variant || 'default';
  const longContent = !!options.longContent;
  switch (emailId) {
    case 'organizer_team_invitation':
      return renderOrganizerTeamInvitation(variant === 'default' ? 'existingUser' : variant, longContent);
    case 'festival_end_of_day_report':
      return renderFestivalEndOfDayReport(variant === 'default' ? 'multiFestival' : variant, longContent);
    default:
      throw new Error(`Unknown post-scope email id: ${emailId}`);
  }
}
