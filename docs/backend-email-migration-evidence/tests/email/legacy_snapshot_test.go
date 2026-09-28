package email

// legacy_snapshot_test.go — golden-file snapshot test for all legacy email templates.
//
// Usage:
//   go test ./email/ -run TestLegacyOutputSnapshots             # compare
//   go test ./email/ -run TestLegacyOutputSnapshots -update     # (re)generate goldens
//
// Golden files: email/testdata/legacy_snapshots/<templateID>/<persona>__<locale>.eml
//
// Each .eml file contains the raw RFC 822 bytes produced by the corresponding
// Send* call with volatile headers normalised (see legacy_snapshot_normalize_test.go).

import (
	"context"
	"flag"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/require"
)

// update flag: -update rewrites golden files from the current output.
var update = flag.Bool("update", false, "rewrite golden snapshot files")

// goldensDir is the directory where .eml golden files are stored.
const goldensDir = "testdata/legacy_snapshots"

func TestLegacyOutputSnapshots(t *testing.T) {
	flag.Parse()

	for _, tc := range allSnapshotCases {
		tc := tc // capture loop variable
		name := tc.templateID + "/" + tc.persona + "__" + tc.locale
		t.Run(name, func(t *testing.T) {
			// Skip cases that are explicitly marked un-runnable.
			if tc.skip != "" {
				t.Skip(tc.skip)
			}

			c, buf := newCapturingSMTP(t)
			ctx := context.Background()

			err := tc.invoke(ctx, c)
			require.NoError(t, err, "Send* returned an error")
			require.NotEmpty(t, buf.Bytes(), "captured buffer must be non-empty")

			got := normalizeVolatile(buf.Bytes())

			goldenPath := filepath.Join(goldensDir,
				tc.templateID,
				tc.persona+"__"+tc.locale+".eml")

			if *update {
				// (Re)write the golden file.
				require.NoError(t, os.MkdirAll(filepath.Dir(goldenPath), 0o755))
				require.NoError(t, os.WriteFile(goldenPath, got, 0o644))
				t.Logf("wrote golden: %s (%d bytes)", goldenPath, len(got))
				return
			}

			// Compare against the existing golden.
			goldenRaw, err := os.ReadFile(goldenPath)
			if os.IsNotExist(err) {
				t.Fatalf("golden file missing: %s\n  run with -update to generate it", goldenPath)
			}
			require.NoError(t, err)

			golden := normalizeVolatile(goldenRaw)

			if string(got) != string(golden) {
				require.Equal(t, string(golden), string(got),
					"email output differs from golden %s\n  run with -update to refresh", goldenPath)
			}
		})
	}
}
