package email

// kit_snapshot_harness_test.go — capture harness for kit email snapshot/parity/preview tests.
// Asset URLs come from config.CdnURL (https://cdn.snapshot.invalid in the capture harness).

import (
	"bytes"
	"io"
	"testing"

	"github.com/emersion/go-sasl"
	"github.com/stretchr/testify/require"
	"zemind.ca/rescounts/config"
)

// newCapturingKitSMTP builds a capturing client with kit templates loaded and
// kitActive enabled. Relies on config.CdnURL from newCapturingSMTP for assets.
func newCapturingKitSMTP(t *testing.T) (*smtpClient, *bytes.Buffer) {
	t.Helper()

	client, buf := newCapturingSMTP(t)

	set, count, reason := tryLoadKitTemplates(*config.DataDirectory)
	require.NotNil(t, set, "kit set must load: %s", reason)
	require.Greater(t, count, 0, "expected at least one kit template for kit capture: %s", reason)

	client.kitTemplates = set
	client.kitActive = true

	// Re-bind capture after any potential rebuild (same buffer).
	client.mailSender = func(_ string, _ sasl.Client, _ string, _ []string, r io.Reader) error {
		buf.Reset()
		_, err := io.Copy(buf, r)
		return err
	}

	return client, buf
}
