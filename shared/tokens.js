/**
 * Eveenty Email Design Kit tokens
 * Source: control-panel foundation/_tokens.scss + Figma Email Design Kit variables
 * Email-safe: hex literals inlined into HTML; this file is documentation + preview helpers.
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
  muted: '#7b7b79',
  dark500: '#4d4c49',
  footerMuted: '#888888',
  successSurface: '#f0fdf4',
  successBorder: '#c5dfcf',
  successBody: '#629a77',
  errorSurface: '#fef2f2',
  errorBorder: '#e9c5c6',
  errorFg: '#991b1b',
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
