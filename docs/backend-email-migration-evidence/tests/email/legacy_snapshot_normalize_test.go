package email

// legacy_snapshot_normalize_test.go — volatile-value normaliser for RFC 822 output.
//
// Golden files capture deterministic HTML where possible. Send* paths that call
// dates.GetCurrentTimeInLocation / calendar DTSTAMP still embed wall-clock values.
// normalizeVolatile replaces ONLY those truly volatile values.
//
// Fixed MIME boundaries (e.g. boundary="boundary-string") are NOT volatile and
// must not be rewritten.

import (
	"encoding/base64"
	"fmt"
	"regexp"
	"sort"
	"strings"
)

var (
	// RFC 5322 Date header — not currently emitted by template Execute buffers,
	// kept for safety if a future path adds one.
	reDateHeader = regexp.MustCompile(`(?m)^Date: .+$`)

	// RFC 5322 Message-ID — same rationale as Date.
	reMessageIDHeader = regexp.MustCompile(`(?m)^Message-ID: .+$`)

	// Wall-clock times from dates.GetFormattedTime / GetFormattedLongDate, e.g.
	// "05:14 PM EDT", "05:14 PM", "at 05:14 PM".
	reClockTime = regexp.MustCompile(`\d{1,2}:\d{2} [AP]M(?: [A-Z]{2,5})?`)

	// Long formatted timestamps from dates.GetFormattedLongDate, e.g.
	// "Sunday. September 27, 2026 at NORMALIZED_TIME" (after clock rewrite) or
	// before rewrite: "Sunday. September 27, 2026 at 05:14 PM".
	reLongDatePrefix = regexp.MustCompile(
		`(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\. ` +
			`(?:January|February|March|April|May|June|July|August|September|October|November|December) ` +
			`\d{1,2}, \d{4}`,
	)

	// Calendar ISO dates from GetCurrentTimeInLocation (and fixture festival dates).
	// Both are collapsed so goldens do not depend on "today". Fixture festival
	// dates (2026-03-15) are intentionally included — see P1_FOUNDATION_REPORT.
	reISODate = regexp.MustCompile(`\d{4}-\d{2}-\d{2}`)

	// iCal DTSTAMP — wall-clock UTC when .ics is generated.
	reICalDTStamp = regexp.MustCompile(`DTSTAMP:\d{8}T\d{6}Z`)

	// Kit MIME builder boundaries are random. Legacy templates keep boundary-string.
	reBoundaryParam = regexp.MustCompile(`boundary="([^"]+)"`)
)

// normalizeVolatile strips values that change between runs so golden comparisons
// are stable. Does not alter fixed MIME boundaries or structural HTML.
func normalizeVolatile(rfc822 []byte) []byte {
	out := reDateHeader.ReplaceAll(rfc822, []byte("Date: NORMALIZED"))
	out = reMessageIDHeader.ReplaceAll(out, []byte("Message-ID: NORMALIZED"))
	out = reClockTime.ReplaceAll(out, []byte("NORMALIZED_TIME"))
	out = reLongDatePrefix.ReplaceAll(out, []byte("NORMALIZED_LONG_DATE"))
	out = reISODate.ReplaceAll(out, []byte("NORMALIZED_DATE"))
	out = reICalDTStamp.ReplaceAll(out, []byte("DTSTAMP:NORMALIZED"))
	out = normalizeInstallmentReminderIndex(out)
	out = normalizeMIMEBoundaries(out)
	out = normalizeBase64Calendars(out)
	return out
}

// normalizeInstallmentReminderIndex rewrites wall-clock days-since-due reminder
// counters from SecondPaymentReminderNumberDisplay ("(N)"). Skips phone forms
// like "1 (855) 552-1522" (digit-space before '(' and space-digit after ')').
func normalizeInstallmentReminderIndex(in []byte) []byte {
	s := string(in)
	var b strings.Builder
	for {
		i := strings.IndexByte(s, '(')
		if i < 0 {
			b.WriteString(s)
			return []byte(b.String())
		}
		j := strings.IndexByte(s[i:], ')')
		if j < 0 {
			b.WriteString(s)
			return []byte(b.String())
		}
		j = i + j
		inner := s[i+1 : j]
		if isAllASCIIDigits(inner) {
			phoneLeft := i >= 2 && s[i-1] == ' ' && s[i-2] >= '0' && s[i-2] <= '9'
			phoneRight := j+2 < len(s) && s[j+1] == ' ' && s[j+2] >= '0' && s[j+2] <= '9'
			if !phoneLeft && !phoneRight {
				b.WriteString(s[:i])
				b.WriteString("(NORMALIZED_REMINDER_INDEX)")
				s = s[j+1:]
				continue
			}
		}
		b.WriteString(s[:j+1])
		s = s[j+1:]
	}
}

func isAllASCIIDigits(s string) bool {
	if s == "" {
		return false
	}
	for i := 0; i < len(s); i++ {
		if s[i] < '0' || s[i] > '9' {
			return false
		}
	}
	return true
}

// rePartBoundaryLine matches the next MIME part delimiter after a calendar body.
// Includes legacy fixed boundary-string and kit BOUNDARY_N after normalizeMIMEBoundaries.
var rePartBoundaryLine = regexp.MustCompile(`(?m)^--(?:BOUNDARY_\d+|boundary-string)--?[ \t]*\r?$`)

// normalizeBase64Calendars rewrites DTSTAMP inside base64 text/calendar parts.
// The stamp is wall-clock UTC, so the base64 body changes on every run until decoded.
func normalizeBase64Calendars(in []byte) []byte {
	s := string(in)
	const marker = "Content-Type: text/calendar"
	var b strings.Builder
	for {
		i := strings.Index(s, marker)
		if i < 0 {
			b.WriteString(s)
			return []byte(b.String())
		}
		blankRel := strings.Index(s[i:], "\r\n\r\n")
		sepLen := 4
		if blankRel < 0 {
			blankRel = strings.Index(s[i:], "\n\n")
			sepLen = 2
		}
		if blankRel < 0 {
			b.WriteString(s[i:])
			return []byte(b.String())
		}
		bodyStart := i + blankRel + sepLen
		b.WriteString(s[:bodyStart])
		loc := rePartBoundaryLine.FindStringIndex(s[bodyStart:])
		if loc == nil {
			b.WriteString(s[bodyStart:])
			return []byte(b.String())
		}
		rawBody := s[bodyStart : bodyStart+loc[0]]
		decoded, err := base64.StdEncoding.DecodeString(stripBase64Whitespace(rawBody))
		if err != nil {
			b.WriteString(rawBody)
			s = s[bodyStart+loc[0]:]
			continue
		}
		normalized := reICalDTStamp.ReplaceAll(decoded, []byte("DTSTAMP:NORMALIZED"))
		b.WriteString(wrapBase64(normalized))
		b.WriteString("\r\n")
		s = s[bodyStart+loc[0]:]
	}
}

func stripBase64Whitespace(s string) string {
	return strings.Map(func(r rune) rune {
		switch r {
		case '\r', '\n', ' ', '\t':
			return -1
		default:
			return r
		}
	}, s)
}

// normalizeMIMEBoundaries rewrites random kit boundaries to BOUNDARY_N.
// The legacy fixed token boundary-string is left unchanged.
func normalizeMIMEBoundaries(in []byte) []byte {
	s := string(in)
	matches := reBoundaryParam.FindAllStringSubmatch(s, -1)
	type pair struct{ old, new string }
	var pairs []pair
	seen := map[string]bool{}
	n := 0
	for _, m := range matches {
		b := m[1]
		if b == "boundary-string" || strings.HasPrefix(b, "BOUNDARY_") || seen[b] {
			continue
		}
		seen[b] = true
		n++
		pairs = append(pairs, pair{old: b, new: fmt.Sprintf("BOUNDARY_%d", n)})
	}
	sort.Slice(pairs, func(i, j int) bool { return len(pairs[i].old) > len(pairs[j].old) })
	for _, p := range pairs {
		s = strings.ReplaceAll(s, `boundary="`+p.old+`"`, `boundary="`+p.new+`"`)
		s = strings.ReplaceAll(s, "--"+p.old, "--"+p.new)
	}
	return []byte(s)
}
