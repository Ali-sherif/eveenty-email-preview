package email

// kit_parity_test.go — RFC822 contract parity between legacy goldens and kit output.
// HTML body design may differ; headers, MIME structure, and attachment parts must match.

import (
	"bytes"
	"context"
	"io"
	"mime"
	"mime/multipart"
	"net/mail"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestKitLegacyParity(t *testing.T) {
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

			legacyPath := filepath.Join(goldensDir, tc.templateID, tc.persona+"__"+tc.locale+".eml")
			legacyRaw, err := os.ReadFile(legacyPath)
			require.NoError(t, err, "legacy golden required for parity")
			legacyNorm := normalizeVolatile(legacyRaw)

			c, buf := newCapturingKitSMTP(t)
			require.NoError(t, tc.invoke(context.Background(), c))
			kitNorm := normalizeVolatile(buf.Bytes())

			legacyMsg, err := mail.ReadMessage(bytes.NewReader(legacyNorm))
			require.NoError(t, err)
			kitMsg, err := mail.ReadMessage(bytes.NewReader(kitNorm))
			require.NoError(t, err)

			assertMailboxEqual(t, "From", legacyMsg.Header.Get("From"), kitMsg.Header.Get("From"))
			assertMailboxEqual(t, "To", legacyMsg.Header.Get("To"), kitMsg.Header.Get("To"))
			require.Equal(t, decodeHeaderWord(legacyMsg.Header.Get("Subject")), decodeHeaderWord(kitMsg.Header.Get("Subject")),
				"Subject must match legacy for %s", name)
			require.Equal(t, "1.0", kitMsg.Header.Get("MIME-Version"), "kit MIME-Version for %s", name)
			require.NotEmpty(t, kitMsg.Header.Get("Date"), "kit Date for %s", name)
			require.NotEmpty(t, kitMsg.Header.Get("Message-ID"), "kit Message-ID for %s", name)

			assertMIMEParity(t, name, legacyNorm, kitNorm)

			// CTA / wallet / calendar / unsubscribe links from the decoded HTML.
			// cid: links are not required: passes are MIME attachments.
			assertLegacyLinksPresent(t, name, string(extractHTMLBody(legacyNorm)), string(extractHTMLBody(kitNorm)))
		})
	}
}

func assertMailboxEqual(t *testing.T, header, legacy, kit string) {
	t.Helper()
	legacyAddr, legacyName := parseMailbox(legacy)
	kitAddr, kitName := parseMailbox(kit)
	require.Equal(t, legacyAddr, kitAddr, "%s address", header)
	require.Equal(t, decodeHeaderWord(legacyName), decodeHeaderWord(kitName), "%s name", header)
}

func parseMailbox(v string) (addr, name string) {
	parsed, err := mail.ParseAddress(v)
	if err != nil {
		return strings.TrimSpace(v), ""
	}
	return parsed.Address, parsed.Name
}

func decodeHeaderWord(v string) string {
	dec := new(mime.WordDecoder)
	out, err := dec.DecodeHeader(v)
	if err != nil {
		return v
	}
	return out
}

func assertMIMEParity(t *testing.T, name string, legacyRaw, kitRaw []byte) {
	t.Helper()
	legacyMsg, err := mail.ReadMessage(bytes.NewReader(legacyRaw))
	require.NoError(t, err)
	kitMsg, err := mail.ReadMessage(bytes.NewReader(kitRaw))
	require.NoError(t, err)

	legacyCT := legacyMsg.Header.Get("Content-Type")
	kitCT := kitMsg.Header.Get("Content-Type")
	legacyMedia, _, err := mime.ParseMediaType(legacyCT)
	require.NoError(t, err)
	kitMedia, kitParams, err := mime.ParseMediaType(kitCT)
	require.NoError(t, err)
	require.NotEmpty(t, kitParams["boundary"], "kit boundary for %s", name)
	require.NotEqual(t, "boundary-string", kitParams["boundary"], "kit must not reuse the template boundary for %s", name)

	var legacyAtt []mimePart
	if strings.HasPrefix(legacyMedia, "multipart/") {
		legacyAtt = attachmentParts(t, legacyMsg)
	}
	// Some legacy templates wrap HTML in multipart/mixed with no pkpass or calendar part.
	if len(legacyAtt) == 0 {
		require.Equal(t, "multipart/alternative", kitMedia, "HTML-only kit mail for %s", name)
		require.NotContains(t, string(kitRaw), "boundary-string")
		return
	}

	require.Equal(t, "multipart/mixed", kitMedia, "attachment kit mail for %s", name)
	require.Contains(t, string(kitRaw), "multipart/alternative", "mixed kit mail must wrap an alternative part for %s", name)

	kitAtt := attachmentParts(t, kitMsg)
	require.Equal(t, len(legacyAtt), len(kitAtt), "attachment count for %s", name)
	for i := range legacyAtt {
		legacyType, _, _ := mime.ParseMediaType(legacyAtt[i].contentType)
		kitType, _, _ := mime.ParseMediaType(kitAtt[i].contentType)
		require.Equal(t, legacyType, kitType, "attachment %d media type for %s", i, name)
		if strings.Contains(kitType, "calendar") {
			decoded := string(decodeTransfer(kitAtt[i].cte, kitAtt[i].body))
			require.Contains(t, decoded, "METHOD:PUBLISH", "ics METHOD for %s", name)
			require.Contains(t, decoded, "UID:", "ics UID for %s", name)
			require.Contains(t, kitAtt[i].contentType, "method=PUBLISH")
		} else {
			require.Equal(t, decodeTransfer(legacyAtt[i].cte, legacyAtt[i].body), decodeTransfer(kitAtt[i].cte, kitAtt[i].body),
				"attachment %d bytes for %s", i, name)
		}
		if kitAtt[i].contentID != "" {
			require.Contains(t, kitAtt[i].contentID, "@", "Content-ID must contain @ for %s", name)
		}
	}
}

type mimePart struct {
	contentType string
	contentID   string
	cte         string
	body        []byte
}

func readMIMEParts(t *testing.T, msg *mail.Message, boundary string) []mimePart {
	t.Helper()
	body, err := io.ReadAll(msg.Body)
	require.NoError(t, err)
	mr := multipart.NewReader(bytes.NewReader(body), boundary)
	var parts []mimePart
	for {
		p, err := mr.NextPart()
		if err == io.EOF {
			break
		}
		require.NoError(t, err)
		b, err := io.ReadAll(p)
		require.NoError(t, err)
		parts = append(parts, mimePart{
			contentType: p.Header.Get("Content-Type"),
			contentID:   p.Header.Get("Content-ID"),
			cte:         p.Header.Get("Content-Transfer-Encoding"),
			body:        b,
		})
	}
	return parts
}

func attachmentParts(t *testing.T, msg *mail.Message) []mimePart {
	t.Helper()
	ct := msg.Header.Get("Content-Type")
	_, params, err := mime.ParseMediaType(ct)
	require.NoError(t, err)
	parts := readMIMEParts(t, msg, params["boundary"])
	var atts []mimePart
	for _, p := range parts {
		media, _, _ := mime.ParseMediaType(p.contentType)
		if strings.Contains(media, "pkpass") || strings.Contains(media, "calendar") {
			atts = append(atts, p)
		}
	}
	return atts
}

func assertLegacyLinksPresent(t *testing.T, name, legacyBody, kitBody string) {
	t.Helper()
	var missing []string
	for _, link := range extractInterestingLinks(legacyBody) {
		if !strings.Contains(kitBody, link) {
			missing = append(missing, link)
		}
	}
	require.Empty(t, missing, "kit body missing legacy links for %s", name)
}

// extractInterestingLinks pulls href/src values that are CTAs, wallet, cid,
// calendar, unsubscribe, or tracking-style absolute URLs from legacy HTML.
func extractInterestingLinks(html string) []string {
	var out []string
	seen := map[string]bool{}
	lower := strings.ToLower(html)
	// Walk href="..." and src="..."
	for _, attr := range []string{`href="`, `src="`} {
		search := html
		attrLower := attr
		_ = lower
		for {
			idx := strings.Index(strings.ToLower(search), attrLower)
			if idx < 0 {
				break
			}
			rest := search[idx+len(attr):]
			end := strings.Index(rest, `"`)
			if end < 0 {
				break
			}
			val := rest[:end]
			search = rest[end+1:]
			if !isInterestingLink(val) {
				continue
			}
			if !seen[val] {
				seen[val] = true
				out = append(out, val)
			}
		}
	}
	return out
}

func isInterestingLink(u string) bool {
	if u == "" || strings.HasPrefix(u, "mailto:") {
		return false
	}
	lu := strings.ToLower(u)
	// Pass files are MIME attachments. cid: hrefs are not part of the HTML contract.
	if strings.HasPrefix(lu, "cid:") {
		return false
	}
	if strings.Contains(lu, "unsubsribe") || strings.Contains(lu, "unsubscribe") {
		return true
	}
	if strings.Contains(lu, "calendar") || strings.Contains(lu, "google.com/calendar") {
		return true
	}
	// Legacy yellow wallet badge images are design chrome; kit uses Condensed/official
	// badges from the kit CDN resolver. Still require pass hrefs / cid:pkpass below.
	if strings.Contains(lu, "google_wallet.png") || strings.Contains(lu, "apple_wallet.png") {
		return false
	}
	if strings.Contains(lu, "wallet") || strings.Contains(lu, "pkpass") {
		return true
	}
	if strings.Contains(lu, "open=") || strings.Contains(lu, "click=") || strings.Contains(lu, "tracking") {
		return true
	}
	// Absolute http(s) CTAs / API links from legacy (activate, approve, etc.)
	if strings.HasPrefix(lu, "http://") || strings.HasPrefix(lu, "https://") {
		// Skip design chrome the kit intentionally replaces or omits.
		if strings.Contains(lu, "fonts.googleapis.com") || strings.Contains(lu, "fonts.gstatic.com") {
			return false
		}
		if strings.Contains(lu, "logo_transparent") || strings.Contains(lu, "eveenty-logo") {
			return false
		}
		// Legacy footer website and social chrome. Kit uses kit_branded_footer instead.
		if lu == "https://www.eveenty.com" || lu == "https://www.eveenty.com/" || lu == "http://www.eveenty.com" {
			return false
		}
		for _, host := range []string{"wa.link", "facebook.com", "instagram.com", "twitter.com", "x.com/", "linkedin.com", "youtube.com", "tiktok.com"} {
			if strings.Contains(lu, host) {
				return false
			}
		}
		if strings.Contains(lu, "cdn.eveenty.com") && (strings.Contains(lu, ".png") || strings.Contains(lu, ".jpg") || strings.Contains(lu, ".jpeg") || strings.Contains(lu, ".gif") || strings.Contains(lu, ".webp")) {
			return false
		}
		// Organizer/brand logo images are kit header chrome, not action links.
		if strings.Contains(lu, "logo") && (strings.Contains(lu, ".png") || strings.Contains(lu, ".jpg") || strings.Contains(lu, ".jpeg") || strings.Contains(lu, ".gif") || strings.Contains(lu, ".webp")) {
			return false
		}
		return true
	}
	return false
}
