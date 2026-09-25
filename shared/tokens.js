/**
 * Eveenty Email Design Kit tokens
 * Source: Original Design System + owner-approved email accessibility corrections (2026-09-25).
 * Email-safe: hex literals inlined into HTML; this file is documentation + preview helpers.
 *
 * Accessibility policy (email kit only — DS palette unchanged):
 * - Dark-700 #2B2A28 — important headings / values
 * - Dark-500 #4D4C49 — body, small secondary, meaningful muted
 * - Dark-200 #7B7B79 — only when size/weight/bg meet contrast
 * - Dark-50 #898988 — non-essential decorative / non-text where applicable
 */
export const TOKENS = {
  viewport: '#f9f9f9',
  surface: '#ffffff',
  light100: '#f9f9f9',
  border: '#ebebeb',
  primary: '#e9d023',
  primary50: '#fefdf4',
  secondary: '#d80073',
  heading: '#2b2a28',
  body: '#4d4c49',
  /** Dark-500 — preferred for meaningful secondary / muted copy */
  dark500: '#4d4c49',
  /** Dark-200 — contrast-qualified use only */
  dark200: '#7b7b79',
  muted: '#7b7b79',
  /** Dark-50 — decorative / non-text */
  dark50: '#898988',
  footerMuted: '#4d4c49',
  successSurface: '#f0fdf4',
  successBorder: '#c5dfcf',
  /** AA-safe success text (not DS lighter #629a77) */
  successFg: '#166534',
  successBody: '#166534',
  errorSurface: '#fef2f2',
  errorBorder: '#e9c5c6',
  errorFg: '#991b1b',
  /** AA-safe error body (not DS lighter #b75c5e) */
  errorBody: '#4d4c49',
  warningSurface: '#fffbeb',
  warningBorder: '#e6d1b9',
  /** Title + AA-safe body (not DS lighter #ad6f45) */
  warningFg: '#92400e',
  warningBody: '#92400e',
  infoSurface: '#eff6ff',
  infoBorder: '#bfdbfe',
  infoFg: '#1e40af',
  infoBody: '#1e40af',
  statusAlertRadius: 16,
  statusAlertPadding: 16,
  statusAlertGap: 8,
  ctaRadius: 12,
  ctaPaddingY: 13,
  ctaPaddingX: 24,
  ctaFontSize: 16,
  ctaLineHeight: 1.4,
  ctaFontWeight: 500,
  ctaMinHeight: 48,
  /** Email container: Figma frame is 800px design canvas; content uses Fluid Hybrid 600 */
  containerMax: 600,
  /**
   * Legacy shared stack (other Phase-1 templates). Arial-first intentionally unchanged
   * outside Account Activation until those references are reviewed.
   */
  fontStack: "Arial, Helvetica, 'Roboto', Tahoma, sans-serif",
  /**
   * Account Activation (Figma-approved intent):
   * - Headings: Plus Jakarta Sans
   * - Body / CTA: Roboto
   * Realistic email-client fallbacks follow. Web-font loading is NOT claimed —
   * clients without the family fall through; formal client QA NOT EXECUTED.
   */
  fontHeading: "'Plus Jakarta Sans', Arial, Helvetica, sans-serif",
  fontBody: "'Roboto', Arial, Helvetica, Tahoma, sans-serif",
  /** AR/FA Activation preview: approved local-script fallbacks (Tahoma first). */
  fontBodyRtl: 'Tahoma, Arial, Helvetica, sans-serif',
  fontMono: "Consolas, 'Courier New', Courier, monospace",
};
