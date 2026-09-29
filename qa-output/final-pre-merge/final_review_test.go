package email

import (
	"bytes"
	"context"
	"log"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"zemind.ca/rescounts/config"
	"zemind.ca/rescounts/model"
)

func TestFinalExport(t *testing.T) {
	root := os.Getenv("FINAL_REVIEW_OUTPUT")
	if root == "" {
		t.Fatal("output directory required")
	}
	legacy, lb := newCapturingSMTP(t)
	kit, kb := newCapturingKitSMTP(t)
	for _, tc := range allSnapshotCases {
		if tc.skip != "" {
			continue
		}
		name := tc.templateID + "__" + tc.persona + "__" + tc.locale
		for _, mode := range []string{"legacy", "kit"} {
			if mode == "kit" && (os.Getenv("FINAL_REVIEW_BASELINE") == "1" || !kitTemplateFileExists(tc.templateID)) {
				continue
			}
			c, b := legacy, lb
			if mode == "kit" {
				c, b = kit, kb
			}
			if err := tc.invoke(context.Background(), c); err != nil {
				t.Errorf("%s/%s: %v", mode, name, err)
				continue
			}
			d := filepath.Join(root, mode)
			if err := os.MkdirAll(d, 0755); err != nil {
				t.Fatal(err)
			}
			if err := os.WriteFile(filepath.Join(d, name+".eml"), b.Bytes(), 0644); err != nil {
				t.Fatal(err)
			}
			if mode == "kit" {
				if err := os.WriteFile(filepath.Join(d, name+".html"), extractHTMLBody(b.Bytes()), 0644); err != nil {
					t.Fatal(err)
				}
			}
		}
	}
}
func TestFinalRejectPartialKit(t *testing.T) {
	var sink bytes.Buffer
	prev := log.Writer()
	log.SetOutput(&sink)
	defer log.SetOutput(prev)
	root := t.TempDir()
	d := filepath.Join(root, "email", "templates", "kit")
	os.MkdirAll(d, 0755)
	os.WriteFile(filepath.Join(d, "activate_email.template"), []byte("<html>one</html>"), 0644)
	c := &smtpClient{}
	loadKitTemplates(c, root)
	if c.KitActive() {
		t.Fatal("partial Kit must remain inactive")
	}
}
func TestFinalWalletCID(t *testing.T) {
	for _, tc := range allSnapshotCases {
		if tc.templateID != "festival_ticket_sale" || !strings.Contains(tc.persona, "wallet") {
			continue
		}
		c, b := newCapturingKitSMTP(t)
		if err := tc.invoke(context.Background(), c); err != nil {
			t.Fatal(err)
		}
		html := string(extractHTMLBody(b.Bytes()))
		if !strings.Contains(html, "href=\"cid:ticket-1@snapshot.invalid\"") {
			t.Fatalf("Apple badge missing attachment link: %s/%s", tc.persona, tc.locale)
		}
		if !strings.Contains(b.String(), "Content-Id: <ticket-1@snapshot.invalid>") {
			t.Fatal("missing matching Content-ID")
		}
	}
}
func TestFinalLegacyCalendarEncoding(t *testing.T) {
	c, _ := newCapturingSMTP(t)
	if c.calendarData("festival_sales", "BEGIN:VCALENDAR") != "QkVHSU46VkNBTEVOREFS" {
		t.Fatal("legacy calendar must be base64")
	}
	c.kitActive = true
	if c.calendarData("festival_sales", "BEGIN:VCALENDAR") != "BEGIN:VCALENDAR" {
		t.Fatal("Kit MIME requires raw calendar")
	}
	_ = config.AppConfig
}
func TestFinalWalletAllLocales(t *testing.T) {
	users := []struct {
		lang string
		user func() *model.User
	}{{"en", fixedUser}, {"ar", fixedUserAR}, {"fr", fixedUserFR}, {"es", fixedUserES}, {"fa", fixedUserFA}}
	for _, u := range users {
		c, b := newCapturingKitSMTP(t)
		sale := fixedFestivalTicketSaleWithWallet(1)
		sale.User = u.user()
		if err := c.SendFestivalTicketSaleToBuyerUser(context.Background(), sale); err != nil {
			t.Fatal(err)
		}
		body := extractHTMLBody(b.Bytes())
		d := filepath.Join(os.Getenv("FINAL_REVIEW_OUTPUT"), "wallet-cases")
		os.MkdirAll(d, 0755)
		os.WriteFile(filepath.Join(d, "wallet-"+u.lang+".html"), body, 0644)
	}
}
func TestFinalTicketPriceName(t *testing.T) {
	for _, show := range []bool{true, false} {
		c, b := newCapturingKitSMTP(t)
		sale := fixedFestivalTicketSaleWithWallet(1)
		sale.DisplaySettings.ShowPrices = show
		sale.Tickets[0].TicketPriceName = "EARLY-BIRD-TIER"
		if err := c.SendFestivalTicketSaleToBuyerUser(context.Background(), sale); err != nil {
			t.Fatal(err)
		}
		if strings.Contains(string(extractHTMLBody(b.Bytes())), "EARLY-BIRD-TIER") != show {
			t.Fatal("ticket price name must follow ShowPrices")
		}
	}
}
