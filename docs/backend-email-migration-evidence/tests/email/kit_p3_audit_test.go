package email

// kit_p3_audit_test.go — P3 static client-compatibility + link audits (test-only).

import (
	"bytes"
	"context"
	"net/mail"
	"net/url"
	"regexp"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
	"zemind.ca/rescounts/email/utils"
)

var (
	reImgTag      = regexp.MustCompile(`(?is)<img\b[^>]*>`)
	reAttr        = regexp.MustCompile(`(?i)\b(alt|width|height|src)\s*=\s*"([^"]*)"`)
	reHrefOrSrc   = regexp.MustCompile(`(?i)\b(href|src)\s*=\s*"([^"]*)"`)
	reMSOOpen     = regexp.MustCompile(`(?i)<!--\s*\[if\b`)
	reMSOClose    = regexp.MustCompile(`(?i)<!\[endif\]`)
	reTableLayout = regexp.MustCompile(`(?i)<table\b`)
	reHTTPAsset   = regexp.MustCompile(`(?i)\b(src|href)\s*=\s*"http://[^"]+"`)
	reEmptySrc    = regexp.MustCompile(`(?i)\bsrc\s*=\s*""`)
	reYellowBadge = regexp.MustCompile(`(?i)(google_wallet\.png|apple_wallet\.png)`)
	reLegacyLogo  = regexp.MustCompile(`(?i)cdn\.eveenty\.com/.*(eveenty-logo|logo_transparent)`)
	reHTMLLangDir = regexp.MustCompile(`(?is)<html[^>]*>`)
)

func TestP3KitStaticClientCompatibilityAudit(t *testing.T) {
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
			require.NoError(t, tc.invoke(context.Background(), c))
			html := string(extractHTMLBody(buf.Bytes()))

			require.True(t, reTableLayout.MatchString(html),
				"kit HTML must use table-based layout for %s", name)

			opens := len(reMSOOpen.FindAllStringIndex(html, -1))
			closes := len(reMSOClose.FindAllStringIndex(html, -1))
			require.Equal(t, opens, closes,
				"MSO conditionals must be balanced for %s (open=%d close=%d)", name, opens, closes)

			for _, tag := range reImgTag.FindAllString(html, -1) {
				attrs := map[string]string{}
				for _, m := range reAttr.FindAllStringSubmatch(tag, -1) {
					attrs[strings.ToLower(m[1])] = m[2]
				}
				_, hasAlt := attrs["alt"]
				_, hasW := attrs["width"]
				_, hasH := attrs["height"]
				require.True(t, hasAlt, "img missing alt for %s: %s", name, truncateAudit(tag, 120))
				require.True(t, hasW, "img missing width for %s: %s", name, truncateAudit(tag, 120))
				require.True(t, hasH, "img missing height for %s: %s", name, truncateAudit(tag, 120))
			}

			require.False(t, reHTTPAsset.MatchString(html),
				"kit HTML must not use http:// asset URLs for %s", name)
			require.False(t, reEmptySrc.MatchString(html),
				"kit HTML must not have empty src=\"\" for %s", name)
			require.False(t, reYellowBadge.MatchString(html),
				"kit HTML must not use yellow/legacy wallet badges for %s", name)
			require.False(t, reLegacyLogo.MatchString(html),
				"kit HTML must not use cdn.eveenty.com legacy logos for %s", name)

			for _, m := range reHrefOrSrc.FindAllStringSubmatch(html, -1) {
				val := m[2]
				if strings.Contains(val, "/logos/eveenty-logo-") ||
					strings.Contains(val, "/condensed/") ||
					strings.Contains(val, "/apple/") {
					require.True(t, strings.HasPrefix(val, utils.KitAssetTestCDNBase+"/"),
						"kit static assets must use CdnURL base for %s: %s", name, val)
				}
			}

			htmlOpen := reHTMLLangDir.FindString(html)
			require.NotEmpty(t, htmlOpen, "missing <html> for %s", name)
			lowerOpen := strings.ToLower(htmlOpen)
			require.Contains(t, lowerOpen, "lang=", "html lang missing for %s", name)
			require.Contains(t, lowerOpen, "dir=", "html dir missing for %s", name)

			if tc.locale == "ar" || tc.locale == "fa" {
				// Only assert RTL when the rendered document claims that locale.
				// Some Send* paths hardcode en regardless of profile language.
				if strings.Contains(lowerOpen, `lang="ar"`) || strings.Contains(lowerOpen, `lang="fa"`) {
					require.Contains(t, lowerOpen, `dir="rtl"`,
						"RTL locale %s must render dir=rtl for %s", tc.locale, name)
				}
			}
			if tc.locale == "xx" {
				require.NotContains(t, lowerOpen, `dir="rtl"`,
					"unknown locale xx must fall back to en/LTR for %s", name)
			}

			htmlKB := float64(len(html)) / 1024.0
			require.Less(t, htmlKB, 102.0,
				"kit HTML body must be < 102 KB; got %.1f KB for %s", htmlKB, name)

			if tc.locale == "fa" && strings.Contains(html, "/apple/") {
				require.NotContains(t, html, "/apple/fa.png",
					"Apple fa must use en artwork for %s", name)
				require.Contains(t, html, "/apple/en.png",
					"Apple fa badge must resolve to en artwork for %s", name)
			}
		})
	}
}

func TestP3KitLinkAudit(t *testing.T) {
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
			require.NoError(t, tc.invoke(context.Background(), c))

			_, err := mail.ReadMessage(bytes.NewReader(buf.Bytes()))
			require.NoError(t, err)
			body := string(extractHTMLBody(buf.Bytes()))

			for _, m := range reHrefOrSrc.FindAllStringSubmatch(body, -1) {
				attr, val := strings.ToLower(m[1]), m[2]
				class := classifyLink(val)
				if val == "" {
					t.Errorf("empty %s for %s (class=%s)", attr, name, class)
					continue
				}
				if strings.HasPrefix(strings.ToLower(val), "javascript:") {
					t.Errorf("javascript %s for %s: %s", attr, name, val)
					continue
				}
				switch class {
				case "asset", "cta", "wallet", "calendar", "unsubscribe", "tracking":
					if strings.HasPrefix(strings.ToLower(val), "http://") {
						t.Errorf("http (non-https) %s for %s: %s", attr, name, val)
					}
					if u, err := url.Parse(val); err == nil && u.IsAbs() {
						host := strings.ToLower(u.Host)
						if host == "cdn.eveenty.com" && (class == "asset" || class == "wallet") {
							t.Errorf("production CDN asset/wallet URL in kit snapshot for %s: %s", name, val)
						}
					}
				}
			}
		})
	}
}

func classifyLink(u string) string {
	lu := strings.ToLower(u)
	switch {
	case u == "":
		return "empty"
	case strings.HasPrefix(lu, "mailto:"):
		return "mailto"
	case strings.HasPrefix(lu, "cid:"):
		return "cid"
	case strings.Contains(lu, "unsubscribe") || strings.Contains(lu, "unsubsribe"):
		return "unsubscribe"
	case strings.Contains(lu, "calendar") || strings.Contains(lu, "google.com/calendar"):
		return "calendar"
	case strings.Contains(lu, "wallet") || strings.Contains(lu, "pkpass"):
		return "wallet"
	case strings.Contains(lu, "open=") || strings.Contains(lu, "click=") || strings.Contains(lu, "tracking"):
		return "tracking"
	case strings.Contains(lu, "cdn.snapshot.invalid") || strings.Contains(lu, "/logos/eveenty-logo-") || strings.Contains(lu, "/condensed/") || strings.Contains(lu, "/apple/") || strings.HasSuffix(lu, ".png") || strings.HasSuffix(lu, ".jpg"):
		return "asset"
	case strings.HasPrefix(lu, "http://") || strings.HasPrefix(lu, "https://"):
		return "cta"
	default:
		return "other"
	}
}

func truncateAudit(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
