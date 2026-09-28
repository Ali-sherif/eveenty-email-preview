package email

// legacy_snapshot_harness_test.go — capture harness for legacy email snapshot tests.
//
// Package email (internal) so mailSender is accessible without reflection.
// No network I/O: mailSender is replaced with a bytes.Buffer capture.

import (
	"bytes"
	"io"
	"testing"
	"time"

	"github.com/emersion/go-sasl"
	"github.com/stretchr/testify/require"
	"zemind.ca/rescounts/config"
)

// newCapturingSMTP sets up a *smtpClient whose deliver() call writes the
// complete RFC 822 message into the returned buffer instead of dialing SMTP.
//
// It sets config.AppConfig and *config.DataDirectory to deterministic values
// so template loading points at the real email/templates directory and all
// config.AppConfig.* references resolve without panic.
//
// Call this once per test (or sub-test) to get an isolated buffer.
func newCapturingSMTP(t *testing.T) (*smtpClient, *bytes.Buffer) {
	t.Helper()

	// ── 1. Minimal config.AppConfig ──────────────────────────────────────────
	// All fields that are used inside Send* functions or templates must be set.
	// Fields that are merely passed through to URLs/strings need non-empty
	// values to prevent empty-string surprises in golden files.
	config.AppConfig = &config.Config{
		// SMTP (not actually dialed — mailSender replaces smtp.SendMail)
		SMTPServer:   "smtp.snapshot.invalid:587",
		SMTPUser:     "snap@snapshot.invalid",
		SMTPPassword: "snap-password",
		SMTPFrom:     "noreply@snapshot.invalid",

		// App URLs
		GoEnv:  "test",
		URL:    "https://api.snapshot.invalid/api/v1",
		CdnURL: "https://cdn.snapshot.invalid",

		// Admin identities
		AdminName:            "Snapshot Admin",
		AdminEmail:           "admin@snapshot.invalid",
		RestaurantAdminEmail: "restaurant-admin@snapshot.invalid",
		EveentyAdminName:     "Eveenty Snapshot",
		EveentyAdminEmail:    "eveenty-admin@snapshot.invalid",

		// Asset URLs (required by config struct)
		EVEENTY_LOGO_LINK: "https://cdn.snapshot.invalid/eveenty-logo.png",
		EVEENTY_ICON_LINK: "https://cdn.snapshot.invalid/eveenty-icon.png",

		// Required-but-unused fields (non-empty to satisfy required:"true" tags
		// if envconfig.Process were called; we set directly so no validation runs)
		StripeNorthAmericaPlatformAccountID:                    "acct_snap_na",
		StripeNorthAmericaAPIKey:                               "sk_snap_na",
		StripeNorthAmericaWebhookSecret:                        "whsec_snap_na",
		StripeNorthAmericaWebhookConnectSecret:                 "whsec_conn_snap_na",
		StripeNorthAmericaConnectedAccountsUpdateWebhookSecret: "whsec_conn_update_snap_na",
		StripeUnitedKingdomPlatformAccountID:                   "acct_snap_uk",
		StripeUnitedKingdomAPIKey:                              "sk_snap_uk",
		StripeUnitedKingdomWebhookSecret:                       "whsec_snap_uk",
		StripeUnitedKingdomWebhookConnectSecret:                "whsec_conn_snap_uk",
		StripeUnitedKingdomConnectedAccountsUpdateWebhookSecret: "whsec_conn_update_snap_uk",
		StripeMarketingWebhookSecret:                           "whsec_mkt_snap",
		DatabaseURL:                                            "postgres://snap:snap@localhost/snap_test",
		REDIS_URL:                                              "redis://localhost:6379/15",
		APISecret:                                              "snap-api-secret",
		GoogleCalendarUserToImpersonate:                        "cal@snapshot.invalid",
		GoogleCalendarID:                                       "cal-snap-id@group.calendar.google.com",
		GoogleCalendarServiceAccountBase64Encoded:              "c25hcC1zZXJ2aWNlLWFjY291bnQ=", // base64("snap-service-account")
		GoogleWalletIssuerID:                                   "3388000000000000000",
		GoogleApplicationCredentialsJson:                       `{"type":"service_account"}`,
		APPLE_WALLET_P12_PASSWORD:                              "snap-p12-pass",
		APPLE_WALLET_P12_CONTENT:                               "c25hcC1wMTI=", // base64("snap-p12")
		APPLE_WALLET_WWDR_CONTENT:                              "c25hcC13d2Ry", // base64("snap-wwdr")
		APPLE_WALLET_SECRET_KEY:                                "snap-apple-secret",
		FacebookAppID:                                          "111111111111",
		FacebookAppSecret:                                      "snap-fb-secret",
		GotenbergAPIURL:                                        "http://gotenberg.snapshot.invalid",
		GotenbergUsername:                                      "snap",
		GotenbergPassword:                                      "snap-goten-pass",
		GHLPrivateToken:                                        "snap-ghl-token",
		GHLLocationID:                                          "snap-ghl-loc",
		GHLUnitedStatesFromPhoneNumber:                         "+15550000000",
	}

	// ── 2. DataDirectory → repo root ─────────────────────────────────────────
	// initTemplatesSettings builds:
	//   filepath.Join(*config.DataDirectory, "email", "templates", "archive", "legacy")
	// so DataDirectory must point to the repo root (one level above the email/ dir).
	// When tests run, the working directory is the package directory (email/).
	// Therefore "../../" would be wrong; "../" is correct when CWD = email/.
	// Actually go test sets CWD to the package directory, so:
	//   *DataDirectory/email/templates/archive/legacy must exist.
	// We set it to ".." (parent of email/) so the join resolves correctly.
	repoRoot := ".."
	*config.DataDirectory = repoRoot

	// ── 3. Build a capturing smtpClient ──────────────────────────────────────
	var buf bytes.Buffer

	client := newTestSMTPClient(nil, nil)

	// Legacy goldens intentionally capture the pre-kit path. Production clients
	// leave kitActive as loaded by loadKitTemplates (always on when kit parses).
	client.kitActive = false

	// Replace the real smtp.SendMail with a capture function.
	client.mailSender = func(_ string, _ sasl.Client, _ string, _ []string, r io.Reader) error {
		buf.Reset()
		_, err := io.Copy(&buf, r)
		return err
	}

	// Sanity: templates must have loaded (non-nil pointers).
	require.NotNil(t, client.passwordResetTemplate, "templates must load; check DataDirectory")

	return client, &buf
}

// fixedPaidAt is a fixed PaidAt time used in ticket-sale fixtures.
var fixedPaidAt = ptrTime(time.Date(2026, 3, 15, 12, 0, 0, 0, time.UTC))

func ptrTime(t time.Time) *time.Time { return &t }
func ptrStr(s string) *string        { return &s }
func ptrBool(b bool) *bool           { return &b }
func ptrInt64(i int64) *int64        { return &i }
