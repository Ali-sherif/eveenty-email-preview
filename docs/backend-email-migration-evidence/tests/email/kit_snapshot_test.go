package email

// kit_snapshot_test.go — golden-file snapshots for kit email output (dormant path).
//
// Usage:
//   go test ./email/ -run TestKitOutputSnapshots             # compare
//   go test ./email/ -run TestKitOutputSnapshots -update     # (re)generate goldens
//
// Goldens: email/testdata/kit_snapshots/<templateID>/<persona>__<locale>.eml

import (
	"bytes"
	"context"
	"encoding/base64"
	"flag"
	"io"
	"mime"
	"mime/multipart"
	"mime/quotedprintable"
	"net/mail"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

const kitGoldensDir = "testdata/kit_snapshots"

func TestKitOutputSnapshots(t *testing.T) {
	flag.Parse()

	for _, tc := range allSnapshotCases {
		tc := tc
		if !kitTemplateFileExists(tc.templateID) {
			continue
		}
		name := tc.templateID + "/" + tc.persona + "__" + tc.locale
		t.Run(name, func(t *testing.T) {
			if tc.skip != "" {
				t.Skip(tc.skip)
			}

			c, buf := newCapturingKitSMTP(t)
			require.True(t, c.KitActive(), "kit capture client must be kit-active")
			require.NotNil(t, c.kitTemplates.templates[tc.templateID],
				"kit template %s must be parsed", tc.templateID)

			err := tc.invoke(context.Background(), c)
			require.NoError(t, err, "Send* returned an error")
			require.NotEmpty(t, buf.Bytes(), "captured buffer must be non-empty")

			got := normalizeVolatile(buf.Bytes())

			// Kit path must use CdnURL for static kit assets (never production host
			// or the retired kit-cdn.invalid placeholder).
			gotStr := string(got)
			require.NotContains(t, gotStr, "cdn.eveenty.com",
				"kit output must not use production CDN host in snapshot harness")
			require.NotContains(t, gotStr, "kit-cdn.invalid",
				"kit output must not use retired EMAIL_KIT_CDN_BASE_URL placeholder")
			require.NotContains(t, gotStr, "logo_transparent_",
				"kit output must not use obsolete transparent logos")
			require.NotContains(t, gotStr, "/eveenty/email-assets/",
				"kit static assets must use flat CDN keys (/logos, /condensed, /apple)")
			if strings.Contains(gotStr, "/logos/eveenty-logo-") ||
				strings.Contains(gotStr, "/condensed/") ||
				strings.Contains(gotStr, "/apple/") {
				require.Contains(t, gotStr, "cdn.snapshot.invalid/",
					"kit static assets must be rooted at CdnURL")
			}

			goldenPath := filepath.Join(kitGoldensDir,
				tc.templateID,
				tc.persona+"__"+tc.locale+".eml")

			if *update {
				require.NoError(t, os.MkdirAll(filepath.Dir(goldenPath), 0o755))
				require.NoError(t, os.WriteFile(goldenPath, got, 0o644))
				t.Logf("wrote kit golden: %s (%d bytes)", goldenPath, len(got))
			} else {
				goldenRaw, err := os.ReadFile(goldenPath)
				if os.IsNotExist(err) {
					t.Fatalf("kit golden missing: %s\n  run with -update to generate it", goldenPath)
				}
				require.NoError(t, err)
				golden := normalizeVolatile(goldenRaw)
				if string(got) != string(golden) {
					require.Equal(t, string(golden), string(got),
						"kit email output differs from golden %s\n  run with -update to refresh", goldenPath)
				}
			}

			body := extractHTMLBody(got)
			htmlKB := float64(len(body)) / 1024.0
			require.Less(t, htmlKB, 102.0,
				"kit HTML body must be < 102 KB (Gmail clip); got %.1f KB for %s", htmlKB, name)
			t.Logf("kit HTML size: %.2f KB (%s)", htmlKB, name)
		})
	}
}

func kitTemplateFileExists(templateID string) bool {
	candidates := []string{
		filepath.Join("templates", "kit", templateID+".template"),
		filepath.Join("email", "templates", "kit", templateID+".template"),
	}
	for _, p := range candidates {
		if st, err := os.Stat(p); err == nil && !st.IsDir() {
			return true
		}
	}
	return false
}

// extractHTMLBody returns the decoded text/html part.
// Kit messages are multipart with quoted-printable HTML. Legacy messages may be
// a single text/html body or multipart/mixed with a raw HTML part.
func extractHTMLBody(rfc822 []byte) []byte {
	if html, ok := htmlFromRFC822(rfc822); ok {
		return html
	}
	return extractHTMLFallback(rfc822)
}

func htmlFromRFC822(raw []byte) ([]byte, bool) {
	msg, err := mail.ReadMessage(bytes.NewReader(raw))
	if err != nil {
		return nil, false
	}
	body, err := io.ReadAll(msg.Body)
	if err != nil {
		return nil, false
	}
	return htmlFromPart(msg.Header.Get("Content-Type"), msg.Header.Get("Content-Transfer-Encoding"), body)
}

func htmlFromPart(contentType, cte string, body []byte) ([]byte, bool) {
	media, params, err := mime.ParseMediaType(contentType)
	if err != nil {
		if bytes.Contains(body, []byte("<!DOCTYPE")) || bytes.Contains(bytes.ToLower(body), []byte("<html")) {
			return decodeTransfer(cte, body), true
		}
		return nil, false
	}
	if strings.HasPrefix(media, "multipart/") {
		boundary := params["boundary"]
		if boundary == "" {
			return nil, false
		}
		mr := multipart.NewReader(bytes.NewReader(body), boundary)
		for {
			p, err := mr.NextPart()
			if err != nil {
				break
			}
			b, err := io.ReadAll(p)
			if err != nil {
				continue
			}
			if html, ok := htmlFromPart(p.Header.Get("Content-Type"), p.Header.Get("Content-Transfer-Encoding"), b); ok {
				return html, true
			}
		}
		return nil, false
	}
	if media == "text/html" || strings.Contains(strings.ToLower(contentType), "text/html") {
		return decodeTransfer(cte, body), true
	}
	return nil, false
}

func decodeTransfer(cte string, body []byte) []byte {
	switch strings.ToLower(strings.TrimSpace(strings.Split(cte, ";")[0])) {
	case "quoted-printable":
		out, err := io.ReadAll(quotedprintable.NewReader(bytes.NewReader(body)))
		if err != nil {
			return body
		}
		return out
	case "base64":
		cleaned := bytes.Map(func(r rune) rune {
			if r == '\r' || r == '\n' || r == ' ' || r == '\t' {
				return -1
			}
			return r
		}, body)
		out, err := base64.StdEncoding.DecodeString(string(cleaned))
		if err != nil {
			return body
		}
		return out
	default:
		return body
	}
}

func extractHTMLFallback(rfc822 []byte) []byte {
	s := string(rfc822)
	idx := strings.Index(s, "<!DOCTYPE")
	if idx < 0 {
		idx = strings.Index(strings.ToLower(s), "<html")
	}
	if idx < 0 {
		return rfc822
	}
	return []byte(s[idx:])
}
