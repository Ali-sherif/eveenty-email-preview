# Seven-template completion matrix

| # | Backend id | Selector label | Present in selector | Renderer | Figma editable | Locales | Variants exercised | Viewports | Blocked | Long | RTL | Browser result |
|--:|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `activate_email` | Auth / Simple — activate_email | Yes | Synced | Yes (4:2+) | en fr es ar fa | default | 800/768/414/375/320 | Yes | Yes | AR/FA | 13/13 PASS |
| 2 | `festival_donation` | Financial / Receipt — festival_donation | Yes | Remediated | Yes (21:2) | en fr es ar fa | donatorUser, organizerNotify | 800/768/414/375/320 | Yes | Yes | AR/FA | 14/14 PASS |
| 3 | `festival_ticket_sale` | Ticket / Pass — festival_ticket_sale | Yes | Preserved | Yes (21:53) | en fr es ar fa | buyerUser, guestUser (+ org/admin in UI) | 800/768/414/375/320 | Yes | Yes | AR/FA | 14/14 PASS |
| 4 | `festival_ticket_registration_approval` | Workflow / Status — registration_approval | Yes | Remediated | Yes (48:45) | en fr es ar fa | user_completeOrder, user_noCta | 800/768/414/375/320 | Yes | Yes | AR/FA | 14/14 PASS |
| 5 | `support` | Internal / Operational — support | Yes | Remediated | Yes (22:113) | en | default, longDetails | 800/768/414/375/320 | Yes | Yes | N/A | 8/8 PASS |
| 6 | `dispute_notification` | Workflow / Status — dispute_notification | Yes | Integrated | Yes (72:44 / 72:111) | en fr es ar fa | organizer, admin, withPaymentLink, stripeConnect, noEvidence | 800/768/414/375/320 | — | Yes | Org AR/FA | 17/17 PASS |
| 7 | `festival_marketing_email_target` | Campaign / Announcement — festival_marketing_email_target | Yes | Integrated | Yes (72:175 / 72:192) | en | default | 800/768/414/375/320 | Yes | Yes | N/A | 7/7 PASS |

**Total browser automated checks: 87/87 PASS.**  
Email client compatibility (Gmail / Outlook / Apple Mail): **NOT EXECUTED**.
