package model

import (
	"strings"
	"testing"
	"time"
	"unicode/utf8"
)

func TestGenerateICSRFC5545(t *testing.T) {
	place := "Hall, A"
	address := "1 Main; Street"
	description := "Line one\nLine two, with comma; and \\ slash"
	start := time.Date(2026, 6, 1, 18, 0, 0, 0, time.UTC)
	end := start.Add(3 * time.Hour)
	name := strings.Repeat("A", 74) + "好"
	business := `Acme "Events"`
	festival := &Festival{
		FestivalID:  "fest-1",
		Name:        name,
		Description: &description,
		StartTime:   start,
		EndTime:     end,
		PlaceName:   &place,
		Address:     &address,
	}
	org := &FestivalOrganizer{
		BusinessName: &business,
		User:         &User{Email: "org@example.com"},
	}

	ics := festival.GenerateICS(festival, org)
	if !strings.Contains(ics, "METHOD:PUBLISH\r\n") {
		t.Fatalf("missing METHOD:PUBLISH:\n%s", ics)
	}
	// Current HEAD emits @eveenty.com (model/festival.go GenerateICS).
	if !strings.Contains(ics, "UID:fest-1@eveenty.com\r\n") {
		t.Fatalf("missing UID:\n%s", ics)
	}

	unfolded := strings.ReplaceAll(ics, "\r\n ", "")
	if !strings.Contains(unfolded, `DESCRIPTION:Line one\nLine two\, with comma\; and \\ slash`) {
		t.Fatalf("description was not escaped:\n%s", unfolded)
	}
	if !strings.Contains(unfolded, `LOCATION:Hall\, A - 1 Main\; Street`) {
		t.Fatalf("location was not escaped:\n%s", unfolded)
	}
	if !strings.Contains(unfolded, `ORGANIZER;CN="Acme \"Events\"":mailto:org@example.com`) {
		t.Fatalf("organizer was not escaped:\n%s", unfolded)
	}
	if strings.Contains(unfolded, "SUMMARY:"+name) && strings.Contains(ics, name) && !strings.Contains(ics, "\r\n ") {
		t.Fatalf("long summary was not folded")
	}

	for _, line := range strings.Split(strings.TrimSuffix(ics, "\r\n"), "\r\n") {
		if len(line) > 75 {
			t.Fatalf("line exceeds 75 octets (%d): %q", len(line), line)
		}
		if !utf8.ValidString(line) {
			t.Fatalf("folded line split a UTF-8 rune: %q", line)
		}
	}
}
