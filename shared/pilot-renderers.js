import {
  brandedFooter,
  brandedHeader,
  esc,
  kvRow,
  sectionTitle,
  statusAlert,
  wrapEmailDocument,
} from './email-kit.js';
import { LOCALES, SAMPLE } from './sample-data.js';
import { PILOT_SAMPLE, pilotText } from './pilot-data.js';
import { TOKENS as T } from './tokens.js';

function fonts(dir) {
  return {
    body: dir === 'rtl' ? T.fontBodyRtl : T.fontBody,
    heading: dir === 'rtl' ? T.fontBodyRtl : T.fontHeading,
  };
}

function interpolate(value, data) {
  return Object.entries(data).reduce((text, [key, replacement]) => text.replaceAll(`{{${key}}}`, replacement), value);
}

function localizedTotals(rows, dir) {
  const align = dir === 'rtl' ? 'right' : 'left';
  const valueAlign = dir === 'rtl' ? 'left' : 'right';
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="280" style="width:280px;max-width:100%;background-color:${T.primary};border-radius:8px;"><tr><td style="padding:20px 20px 8px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows.map((row, index) => `<tr><td align="${align}" style="padding:0 0 12px;font-family:${T.fontStack};font-size:${index === rows.length - 1 ? 16 : 14}px;font-weight:${index === rows.length - 1 ? 700 : 500};color:${T.heading};">${esc(row.label)}</td><td align="${valueAlign}" dir="ltr" style="padding:0 0 12px;font-family:${T.fontStack};font-size:${index === rows.length - 1 ? 16 : 14}px;font-weight:${index === rows.length - 1 ? 700 : 500};color:${T.heading};">${esc(row.value)}</td></tr>`).join('')}</table></td></tr></table>`;
}

export function renderPilotEmail(emailId, { locale = 'en', variant = 'default', longContent = false } = {}) {
  const L = LOCALES[locale] || LOCALES.en;
  switch (emailId) {
    case 'password_reset': return renderPasswordReset(L, locale, longContent);
    case 'refund_receipt_user': return renderRefund(L, locale, variant, longContent);
    case 'festival_ticket_registration_reject': return renderRegistrationReject(L, locale, variant, longContent);
    case 'festival_approval_status_changed': return renderFestivalApproval(L, locale, variant, longContent);
    case 'contact_submission': return renderContact(longContent);
    case 'organizer_announcement': return renderAnnouncement(longContent);
    default: throw new Error(`Unknown pilot email id: ${emailId}`);
  }
}

function renderPasswordReset(L, locale, longContent) {
  const p = pilotText(locale, 'password');
  const { body, heading } = fonts(L.dir);
  const name = longContent ? `${SAMPLE.user.fullName} ${'Extended Name '.repeat(3).trim()}` : SAMPLE.user.fullName;
  const rows = `
    ${brandedHeader({ locale: L.logo, dir: L.dir, logoWidth: 160 })}
    <tr><td align="${L.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:32px 30px 16px;background-color:${T.surface};font-family:${body};">
      <h1 style="margin:0 0 18px;font-family:${heading};font-size:24px;line-height:1.3;font-weight:600;color:${T.heading};">${esc(p.heading)}</h1>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${T.body};">${esc(p.hello)} <bdi>${esc(name)}</bdi>,</p>
      <p style="margin:0;font-size:16px;line-height:1.6;color:${T.body};">${esc(p.body)}</p>
    </td></tr>
    <tr><td align="center" class="stack-pad" style="padding:8px 30px 24px;background-color:${T.surface};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.primary50};border:1px solid ${T.border};border-radius:8px;"><tr><td align="center" dir="ltr" style="padding:20px;font-family:${body};font-size:30px;line-height:1.2;font-weight:700;letter-spacing:6px;color:${T.heading};">${esc(PILOT_SAMPLE.resetCode)}</td></tr></table>
    </td></tr>
    <tr><td align="${L.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};font-family:${body};font-size:14px;line-height:1.6;color:${T.body};">
      ${esc(p.ignoreBefore)}<a href="mailto:info@eveenty.com" style="color:${T.secondary};text-decoration:underline;">${esc(p.ignoreLink)}</a>${esc(p.ignoreAfter)}
    </td></tr>
    ${brandedFooter({ email:SAMPLE.user.email, copyright:p.copyright, dir:L.dir, fontFamily:body, footerLead:p.sentTo, footerSuffix:'.' })}`;
  return wrapEmailDocument({ lang:L.lang, dir:L.dir, title:p.title, preheader:p.heading, bodyRows:rows, fontFamily:body });
}

function renderRefund(L, locale, variant, longContent) {
  const r = pilotText(locale, 'refund');
  const { body, heading } = fonts(L.dir);
  const showRefund = variant !== 'canceledOnly';
  const showCanceled = variant !== 'refundOnly';
  const headline = interpolate(r.headline, { user:SAMPLE.user.fullName, festival:SAMPLE.festival.name });
  const refundRows = PILOT_SAMPLE.refund.items.map((item) => `<tr>
    <td dir="ltr" style="padding:12px 8px;border-bottom:1px solid ${T.border};font-family:${body};font-size:13px;color:${T.body};">${esc(item.id)}</td>
    <td style="padding:12px 8px;border-bottom:1px solid ${T.border};font-family:${body};font-size:13px;color:${T.body};"><bdi>${esc(item.name)}</bdi></td>
    <td dir="ltr" style="padding:12px 8px;border-bottom:1px solid ${T.border};font-family:${body};font-size:13px;color:${T.body};">${esc(item.quantity)}</td>
    <td dir="ltr" style="padding:12px 8px;border-bottom:1px solid ${T.border};font-family:${body};font-size:13px;font-weight:600;color:${T.heading};">${esc(item.total)}</td>
  </tr>`).join('');
  const canceledRows = PILOT_SAMPLE.refund.canceled.map((item) => `<tr><td dir="ltr" style="padding:12px;border-bottom:1px solid ${T.border};font-family:${body};font-size:13px;color:${T.body};">${esc(item.id)}</td><td style="padding:12px;border-bottom:1px solid ${T.border};font-family:${body};font-size:13px;color:${T.body};"><bdi>${esc(item.name)}</bdi></td><td dir="ltr" style="padding:12px;border-bottom:1px solid ${T.border};font-family:${body};font-size:13px;color:${T.body};">${esc(item.quantity)}</td></tr>`).join('');
  const rows = `
    ${brandedHeader({ locale:L.logo, dir:L.dir, logoWidth:160 })}
    <tr><td align="center" class="stack-pad" style="padding:28px 30px 16px;background-color:${T.surface};font-family:${body};"><h1 style="margin:0;font-family:${heading};font-size:22px;line-height:1.4;font-weight:600;color:${T.heading};">${esc(headline)}</h1></td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 20px;background-color:${T.surface};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${kvRow(r.name, `<bdi>${esc(SAMPLE.user.fullName)}</bdi>`, L.dir)}
      ${kvRow(r.address, `<bdi>${esc(SAMPLE.user.address)}</bdi>`, L.dir)}
      ${kvRow(r.phone, `<span dir="ltr">${esc(SAMPLE.user.phone)}</span>`, L.dir)}
      ${kvRow(r.email, `<span dir="ltr">${esc(SAMPLE.user.email)}</span>`, L.dir)}
      ${kvRow(r.date, `<span dir="ltr">${esc(SAMPLE.money.date)} ${esc(SAMPLE.money.time)}</span>`, L.dir)}
      ${kvRow(r.payment, `<bdi>${esc(r.creditCard)}</bdi>`, L.dir)}
    </table></td></tr>
    ${showRefund ? `<tr><td class="stack-pad" style="padding:8px 30px 24px;background-color:${T.surface};">${statusAlert({ variant:'success', title:r.refunded, bodyHtml:esc(r.success), dir:L.dir, titleFontFamily:heading, bodyFontFamily:body })}</td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">${sectionTitle({ title:r.refunded, dir:L.dir, fontFamily:heading, fontWeight:600 })}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:8px;"><tr><th align="left" style="padding:10px 8px;background-color:${T.primary50};font:600 12px ${body};color:${T.heading};">${esc(r.id)}</th><th align="left" style="padding:10px 8px;background-color:${T.primary50};font:600 12px ${body};color:${T.heading};">${esc(r.item)}</th><th align="left" style="padding:10px 8px;background-color:${T.primary50};font:600 12px ${body};color:${T.heading};">${esc(r.qty)}</th><th align="left" style="padding:10px 8px;background-color:${T.primary50};font:600 12px ${body};color:${T.heading};">${esc(r.total)}</th></tr>${refundRows}</table><p style="margin:10px 0 0;font-family:${body};font-size:13px;color:${T.body};">${esc(r.fees)}: <span dir="ltr">${esc(SAMPLE.money.processingFee)}</span> · ${esc(r.tax)}: <span dir="ltr">${esc(SAMPLE.money.tax)}</span></p></td></tr>
    <tr><td align="${L.dir === 'rtl' ? 'left' : 'right'}" class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">${localizedTotals([{ label:r.amount, value:SAMPLE.money.subtotal }, { label:r.fees, value:SAMPLE.money.processingFee }, { label:r.bank, value:'CA$0.00' }, { label:r.totalRefunded, value:SAMPLE.money.grandTotal }], L.dir)}</td></tr>` : ''}
    ${showCanceled ? `<tr><td class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">${sectionTitle({ title:r.canceled, dir:L.dir, fontFamily:heading, fontWeight:600 })}<p style="margin:0 0 12px;font-family:${body};font-size:14px;line-height:1.5;color:${T.body};">${esc(longContent ? `${r.canceledIntro} ${r.canceledIntro}` : r.canceledIntro)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:8px;">${canceledRows}</table></td></tr>` : ''}
    ${brandedFooter({ email:SAMPLE.user.email, copyright:'© Eveenty. All rights reserved.', dir:L.dir, fontFamily:body })}`;
  return wrapEmailDocument({ lang:L.lang, dir:L.dir, title:r.title, preheader:headline, bodyRows:rows, fontFamily:body });
}

function renderRegistrationReject(L, locale, variant, longContent) {
  const effectiveLocale = variant === 'admin' ? 'en' : locale;
  const E = LOCALES[effectiveLocale] || LOCALES.en;
  const r = pilotText(effectiveLocale, 'reject');
  const common = E.regApproval;
  const { body, heading } = fonts(E.dir);
  const greetingSource = variant === 'organizer' ? r.organizer : variant === 'admin' ? r.admin : r.user;
  const greeting = interpolate(greetingSource, { festival:SAMPLE.festival.name, name:SAMPLE.user.displayName });
  const ticketExtra = longContent ? '<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#4d4c49;">Answers: Dietary requirements — Vegetarian; Accessibility notes — quiet entrance requested.</p>' : '';
  const rows = `
    ${brandedHeader({ locale:E.logo, dir:E.dir, logoWidth:160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">${statusAlert({ variant:'error', title:r.alert, bodyHtml:'', dir:E.dir, titleFontFamily:heading, bodyFontFamily:body })}</td></tr>
    <tr><td align="${E.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:8px 30px 20px;background-color:${T.surface};font-family:${body};font-size:16px;line-height:1.6;color:${T.body};"><p style="margin:0;">${esc(greeting)}</p><p style="margin:10px 0 0;font-size:14px;color:${T.dark500};">${esc(common.summarySubtitle)}</p></td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">${sectionTitle({ title:common.summaryTitle, dir:E.dir, fontFamily:heading, fontWeight:600 })}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:8px;"><tbody>
      ${kvRow(r.registrationId, `<span dir="ltr">${esc(SAMPLE.registration.id)}</span>`, E.dir)}
      ${kvRow(r.registrationDate, `<span dir="ltr">${esc(SAMPLE.registration.dateTime)}</span>`, E.dir)}
      ${kvRow(r.currentStatus, `<strong>${esc(r.status)}</strong>`, E.dir)}
      ${kvRow(r.reviewDeadline, `<span dir="ltr">Sep 24, 2026 · 5:00 PM</span>`, E.dir)}
    </tbody></table></td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">${sectionTitle({ title:common.buyerTitle, dir:E.dir, fontFamily:heading, fontWeight:600 })}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:8px;"><tbody>${kvRow(r.name, `<bdi>${esc(SAMPLE.user.fullName)}</bdi>`, E.dir)}${kvRow(r.email, `<span dir="ltr">${esc(SAMPLE.user.email)}</span>`, E.dir)}${kvRow(r.phone, `<span dir="ltr">${esc(SAMPLE.user.phone)}</span>`, E.dir)}</tbody></table></td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 20px;background-color:${T.surface};">${sectionTitle({ title:`${common.ticketsTitle} (1)`, dir:E.dir, fontFamily:heading, fontWeight:600 })}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:12px;"><tr><td style="padding:20px;font-family:${body};font-size:14px;color:${T.body};"><p style="margin:0 0 8px;"><strong>${esc(r.ticketType)}:</strong> <bdi>${esc(SAMPLE.ticket.type)}</bdi></p><p style="margin:0 0 8px;"><strong>${esc(r.ticketHolder)}:</strong> <bdi>${esc(SAMPLE.user.fullName)}</bdi></p><p style="margin:0;"><strong>${esc(r.email)}:</strong> <span dir="ltr">${esc(SAMPLE.user.email)}</span></p>${ticketExtra}</td></tr></table></td></tr>
    <tr><td class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">${sectionTitle({ title:common.eventTitle, dir:E.dir, fontFamily:heading, fontWeight:600 })}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${T.border};border-radius:12px;"><tr><td style="padding:20px;font-family:${body};font-size:14px;line-height:1.6;color:${T.body};"><p style="margin:0 0 8px;font-size:17px;font-weight:600;color:${T.heading};"><bdi>${esc(SAMPLE.festival.name)}</bdi></p><p style="margin:0 0 6px;">${esc(SAMPLE.festival.start)}</p><p style="margin:0 0 6px;"><bdi>${esc(SAMPLE.festival.place)}</bdi></p><p style="margin:0;"><bdi>${esc(SAMPLE.festival.address)}</bdi></p></td></tr></table></td></tr>
    ${brandedFooter({ email:SAMPLE.user.email, copyright:common.copyright, dir:E.dir, fontFamily:body })}`;
  return wrapEmailDocument({ lang:E.lang, dir:E.dir, title:r.alert, preheader:r.alert, bodyRows:rows, fontFamily:body });
}

function renderFestivalApproval(L, locale, variant, longContent) {
  const a = pilotText(locale, 'approval');
  const { body, heading } = fonts(L.dir);
  const rejected = variant.startsWith('rejected');
  const withNote = variant.endsWith('WithNote');
  const greeting = interpolate(a.greeting, { name:SAMPLE.user.displayName });
  const message = interpolate(rejected ? a.rejected : a.approved, { festival:SAMPLE.festival.name });
  const rows = `
    ${brandedHeader({ locale:L.logo, dir:L.dir, logoWidth:160 })}
    <tr><td class="stack-pad" style="padding:24px 30px 12px;background-color:${T.surface};">${statusAlert({ variant:rejected ? 'error' : 'success', title:rejected ? a.rejectedTitle : a.approvedTitle, bodyHtml:'', dir:L.dir, titleFontFamily:heading, bodyFontFamily:body })}</td></tr>
    <tr><td align="${L.dir === 'rtl' ? 'right' : 'left'}" class="stack-pad" style="padding:12px 30px 20px;background-color:${T.surface};font-family:${body};"><p style="margin:0 0 14px;font-size:18px;font-weight:600;color:${T.heading};">${esc(greeting)}</p><p style="margin:0;font-size:16px;line-height:1.65;color:${T.body};">${esc(longContent ? `${message} ${message}` : message)}</p></td></tr>
    ${withNote ? `<tr><td class="stack-pad" style="padding:0 30px 24px;background-color:${T.surface};">${sectionTitle({ title:a.notes, dir:L.dir, fontFamily:heading, fontWeight:600 })}<p style="margin:0 0 10px;font-family:${body};font-size:14px;color:${T.body};">${esc(a.notesIntro)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.primary50};border:1px solid ${T.border};border-radius:8px;"><tr><td style="padding:16px;font-family:${body};font-size:14px;line-height:1.5;color:${T.body};white-space:pre-wrap;word-break:break-word;">${esc(PILOT_SAMPLE.reviewNote)}</td></tr></table></td></tr>` : ''}
    ${brandedFooter({ email:SAMPLE.user.email, copyright:'© Eveenty. All rights reserved.', dir:L.dir, fontFamily:body })}`;
  return wrapEmailDocument({ lang:L.lang, dir:L.dir, title:a.title, preheader:a.title, bodyRows:rows, fontFamily:body });
}

function renderContact(longContent) {
  const message = longContent ? `${PILOT_SAMPLE.contact.message} ${PILOT_SAMPLE.contact.message}` : PILOT_SAMPLE.contact.message;
  const rows = `
    ${brandedHeader({ locale:'en', dir:'ltr', logoWidth:160 })}
    <tr><td class="stack-pad" style="padding:28px 30px 12px;background-color:${T.surface};font-family:${T.fontBody};"><h1 style="margin:0 0 12px;font-family:${T.fontHeading};font-size:22px;font-weight:600;color:${T.heading};">New Contact Form Submission</h1><p style="margin:0;font-size:16px;line-height:1.5;color:${T.body};">Hi Team, a new “Contact Us” submission has arrived. Please follow up with this customer.</p></td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 16px;background-color:${T.surface};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${kvRow('Name', `<bdi>${esc(SAMPLE.user.fullName)}</bdi>`, 'ltr')}${kvRow('Email', `<span dir="ltr">${esc(SAMPLE.user.email)}</span>`, 'ltr')}${kvRow('Phone', `<span dir="ltr">${esc(SAMPLE.user.phone)}</span>`, 'ltr')}${kvRow('Business Name', `<bdi>${esc(PILOT_SAMPLE.contact.business)}</bdi>`, 'ltr')}${kvRow('Topic', `<bdi>${esc(PILOT_SAMPLE.contact.topic)}</bdi>`, 'ltr')}</table></td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 24px;background-color:${T.surface};">${sectionTitle({ title:'Message', dir:'ltr', fontFamily:T.fontHeading, fontWeight:600 })}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.light100};border:1px solid ${T.border};border-radius:8px;"><tr><td style="padding:16px;font-family:${T.fontBody};font-size:15px;line-height:1.6;color:${T.body};white-space:pre-wrap;word-break:break-word;">${esc(message)}</td></tr></table></td></tr>
    ${brandedFooter({ email:'info@eveenty.com', copyright:'Internal operational notification · Eveenty', dir:'ltr', fontFamily:T.fontBody })}`;
  return wrapEmailDocument({ lang:'en', dir:'ltr', title:'Contact Submission Email', preheader:'New Contact Form Submission', bodyRows:rows, fontFamily:T.fontBody });
}

function renderAnnouncement(longContent) {
  const message = longContent ? `${PILOT_SAMPLE.announcement.body} ${PILOT_SAMPLE.announcement.body}` : PILOT_SAMPLE.announcement.body;
  const rows = `
    ${brandedHeader({ locale:'en', dir:'ltr', logoWidth:160 })}
    <tr><td class="stack-pad" style="padding:32px 30px 14px;background-color:${T.surface};font-family:${T.fontBody};"><h1 style="margin:0;font-family:${T.fontHeading};font-size:24px;line-height:1.35;font-weight:600;color:${T.heading};">${esc(PILOT_SAMPLE.announcement.subject)}</h1></td></tr>
    <tr><td class="stack-pad" style="padding:8px 30px 32px;background-color:${T.surface};font-family:${T.fontBody};font-size:16px;line-height:1.7;color:${T.body};"><p style="margin:0;">${esc(message)}</p></td></tr>`;
  return wrapEmailDocument({ lang:'en', dir:'ltr', title:PILOT_SAMPLE.announcement.subject, preheader:PILOT_SAMPLE.announcement.subject, bodyRows:rows, fontFamily:T.fontBody });
}
