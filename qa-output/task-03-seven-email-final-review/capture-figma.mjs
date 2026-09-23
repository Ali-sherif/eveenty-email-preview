/**
 * Documents Figma export targets for final review.
 * PNGs are fetched via Figma MCP get_screenshot + curl (see FINAL_REVIEW_REPORT.md).
 */
export const FIGMA_FILE_KEY = 'yz7YggnG4H2RuUd23f9zPk';

export const EXPORTS = [
  { id: 'activate_email', nodeId: '4:2', file: 'activate-en-desktop-800.png' },
  { id: 'festival_donation', nodeId: '21:2', file: 'donation-en-desktop-800.png' },
  { id: 'festival_ticket_sale', nodeId: '21:53', file: 'ticket-sale-en-desktop-800.png' },
  {
    id: 'festival_ticket_registration_approval',
    nodeId: '48:45',
    file: 'reg-approval-en-desktop-800.png',
  },
  { id: 'support', nodeId: '22:113', file: 'support-en-desktop-800.png' },
  { id: 'dispute_notification', nodeId: '72:44', file: 'dispute-en-desktop-800.png' },
  {
    id: 'festival_marketing_email_target',
    nodeId: '72:175',
    file: 'marketing-en-desktop-800.png',
  },
];
