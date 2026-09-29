package email

// festival_eod_data_mapping_test.go — proves Kit card layout preserves every
// Legacy-rendered report metric/condition for festival_end_of_day_report.
// Presentation-only: does not require table markup parity.

import (
	"bytes"
	"context"
	"regexp"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"zemind.ca/rescounts/email/utils"
	"zemind.ca/rescounts/model"
)

func TestFestivalEOD_LegacyTableToKitCardDataMapping(t *testing.T) {
	cases := []struct {
		persona string
		fn      func() ([]*model.Festival, *model.OrganizerEndOfDayReport)
	}{
		{"multi_festival", fixedEODReportMulti},
		{"single_festival", fixedEODReportSingle},
		{"no_sales", fixedEODReportNoSales},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.persona, func(t *testing.T) {
			festivals, report := tc.fn()
			organizer := fixedOrganizer()

			legacyRaw, legacyHTML := captureEODMessage(t, false, organizer, festivals, report)
			kitRaw, kitHTML := captureEODMessage(t, true, organizer, festivals, report)

			require.NotEmpty(t, legacyHTML)
			require.NotEmpty(t, kitHTML)

			sections := buildEndOfDayReportFestivalSections(report, festivals)
			facts := eodBusinessFacts(organizer, report, sections)

			var missingLegacy, missingKit []string
			for _, f := range facts {
				if !strings.Contains(legacyHTML, f) {
					missingLegacy = append(missingLegacy, f)
				}
				if !strings.Contains(kitHTML, f) {
					missingKit = append(missingKit, f)
				}
			}
			if len(missingLegacy) > 0 {
				t.Fatalf("facts expected in Legacy HTML missing (%s): %v", tc.persona, missingLegacy)
			}
			if len(missingKit) > 0 {
				t.Fatalf("DATA MAPPING FAIL — facts in Legacy path missing from Kit (%s): %v", tc.persona, missingKit)
			}

			for _, phrase := range eodConditionPhrases(sections) {
				require.Contains(t, legacyHTML, phrase, "legacy must emit condition copy %q", phrase)
				require.Contains(t, kitHTML, phrase, "kit must emit same condition copy %q", phrase)
			}

			// Multi-festival path column labels (Legacy table headers → Kit card labels).
			if eodSectionsHaveSales(sections) {
				for _, label := range []string{"Items", "Transactions", "Total", "Sold To Date", "% Sold", "Subtotal", "Day Total"} {
					require.Contains(t, legacyHTML, label)
					require.Contains(t, kitHTML, label)
				}
			}

			// Envelope recipient (Legacy RFC822 To; Kit envelope + branded footer).
			require.Contains(t, string(legacyRaw), organizer.Email)
			require.Contains(t, string(kitRaw), organizer.Email)
			require.Contains(t, kitHTML, organizer.Email)

			// Kit must keep card layout — not restore Legacy wide table.
			require.NotContains(t, kitHTML, "min-width: 680px")
			require.NotContains(t, kitHTML, "min-width:680px")
			require.NotContains(t, kitHTML, "eod-table")
		})
	}
}

func captureEODMessage(t *testing.T, kitActive bool, organizer *model.FestivalOrganizer, festivals []*model.Festival, report *model.OrganizerEndOfDayReport) (raw []byte, html string) {
	t.Helper()
	var client *smtpClient
	var buf *bytes.Buffer
	if kitActive {
		client, buf = newCapturingKitSMTP(t)
	} else {
		client, buf = newCapturingSMTP(t)
	}
	require.NoError(t, client.SendOrganizerEndOfDayReportToOrganizer(context.Background(), organizer, festivals, report))
	require.NotEmpty(t, buf.Bytes())
	raw = append([]byte(nil), buf.Bytes()...)
	html = extractEODHTMLBody(raw)
	require.NotEmpty(t, html, "expected HTML body in capture")
	return raw, html
}

func extractEODHTMLBody(rfc822 []byte) string {
	s := string(rfc822)
	idx := strings.Index(s, "<!DOCTYPE html>")
	if idx < 0 {
		idx = strings.Index(s, "<html")
	}
	if idx < 0 {
		return ""
	}
	html := s[idx:]
	end := strings.LastIndex(html, "</html>")
	if end >= 0 {
		html = html[:end+7]
	}
	return decodeEODQuotedPrintable(html)
}

func decodeEODQuotedPrintable(s string) string {
	reSoft := regexp.MustCompile(`=\r?\n`)
	s = reSoft.ReplaceAllString(s, "")
	reHex := regexp.MustCompile(`=([0-9A-Fa-f]{2})`)
	return reHex.ReplaceAllStringFunc(s, func(m string) string {
		b, err := strconv.ParseUint(m[1:], 16, 8)
		if err != nil {
			return m
		}
		return string([]byte{byte(b)})
	})
}

func eodBusinessFacts(organizer *model.FestivalOrganizer, report *model.OrganizerEndOfDayReport, sections []endOfDayReportFestivalSection) []string {
	// Body-rendered facts only (envelope ToEmail checked separately).
	facts := []string{
		utils.GetOrganizerName(organizer),
	}
	if reportDate := report.ReportDay(); reportDate != "" {
		facts = append(facts, formatEndOfDayReportDate(reportDate, time.UTC))
	}
	for _, section := range sections {
		facts = append(facts,
			section.FestivalName,
			section.TimeZone,
			section.CurrencyLabel,
			section.Currency,
			section.From,
			section.To,
		)
		for _, day := range section.Days {
			facts = append(facts, day.Date)
			if day.HasSales {
				facts = append(facts, day.RawDate, day.TotalSubtotal)
				facts = append(facts, strconv.FormatInt(day.TotalItems, 10))
				facts = append(facts, strconv.FormatInt(day.TotalTransactions, 10))
				for _, st := range day.SaleTypes {
					facts = append(facts,
						st.SaleType,
						st.SaleTypeKey,
						strconv.FormatInt(st.ItemsCount, 10),
						strconv.FormatInt(st.TransactionsCount, 10),
						strconv.FormatInt(st.TotalItems, 10),
						strconv.FormatInt(st.TotalSoldItems, 10),
						st.SoldPercentage,
						st.Subtotal,
						st.Currency,
					)
				}
			}
		}
	}
	seen := map[string]bool{}
	out := make([]string, 0, len(facts))
	for _, f := range facts {
		if f == "" || seen[f] {
			continue
		}
		seen[f] = true
		out = append(out, f)
	}
	return out
}

func eodConditionPhrases(sections []endOfDayReportFestivalSection) []string {
	phrases := []string{"Here is the sales summary for your festivals for"}
	for _, section := range sections {
		if !section.HasSales {
			phrases = append(phrases, "No sales were recorded for this festival on this day.")
			continue
		}
		for _, day := range section.Days {
			if !day.HasSales {
				phrases = append(phrases, "No sales were recorded for this day.")
			} else {
				phrases = append(phrases,
					"Day Total",
					"% Sold is the share of the total sold to date. A dash means the sale type has no total.",
				)
			}
		}
	}
	phrases = append(phrases, "Need Help?", "info@eveenty.com")
	seen := map[string]bool{}
	out := make([]string, 0, len(phrases))
	for _, p := range phrases {
		if seen[p] {
			continue
		}
		seen[p] = true
		out = append(out, p)
	}
	return out
}

func eodSectionsHaveSales(sections []endOfDayReportFestivalSection) bool {
	for _, section := range sections {
		if section.HasSales {
			return true
		}
	}
	return false
}
