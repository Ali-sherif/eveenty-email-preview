package email

import (
	"bytes"
	"log"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"text/template"

	"zemind.ca/rescounts/config"
	"zemind.ca/rescounts/email/utils"
)

func TestTryLoadKitTemplates_MissingDirNoPanic(t *testing.T) {
	dir := t.TempDir()
	set, count, reason := tryLoadKitTemplates(dir)
	if set != nil || count != 0 {
		t.Fatalf("missing kit dir: set=%v count=%d", set != nil, count)
	}
	if !strings.Contains(reason, "missing") {
		t.Fatalf("expected missing reason, got %s", reason)
	}
}

func TestTryLoadKitTemplates_EmptyKitDirNoPanic(t *testing.T) {
	dataDir := t.TempDir()
	kitDir := filepath.Join(dataDir, "email", "templates", "kit")
	if err := os.MkdirAll(filepath.Join(kitDir, "partials"), 0o755); err != nil {
		t.Fatal(err)
	}
	set, count, reason := tryLoadKitTemplates(dataDir)
	if count != 0 {
		t.Fatalf("empty kit dir should parse 0 templates, got %d", count)
	}
	if set == nil {
		t.Fatal("empty kit dir should still return a set shell for partials")
	}
	if !strings.Contains(reason, "no kit templates") {
		t.Fatalf("unexpected reason: %s", reason)
	}
}

func TestLoadKitTemplates_ZeroTemplates_Inactive(t *testing.T) {
	dataDir := t.TempDir()
	if err := os.MkdirAll(filepath.Join(dataDir, "email", "templates", "kit", "partials"), 0o755); err != nil {
		t.Fatal(err)
	}

	var logBuf bytes.Buffer
	prevLog := log.Writer()
	log.SetOutput(&logBuf)
	t.Cleanup(func() { log.SetOutput(prevLog) })

	client := &smtpClient{}
	loadKitTemplates(client, dataDir)
	if client.KitActive() {
		t.Fatal("zero kit templates must leave kit inactive")
	}
	if !strings.Contains(logBuf.String(), "inactive") {
		t.Fatalf("expected inactive log line, got: %s", logBuf.String())
	}
}

func TestLoadKitTemplates_MissingKitDir_Inactive(t *testing.T) {
	var logBuf bytes.Buffer
	prevLog := log.Writer()
	log.SetOutput(&logBuf)
	t.Cleanup(func() { log.SetOutput(prevLog) })

	client := &smtpClient{}
	loadKitTemplates(client, t.TempDir())
	if client.KitActive() {
		t.Fatal("missing kit dir must leave kit inactive")
	}
	if !strings.Contains(logBuf.String(), "inactive") {
		t.Fatalf("expected inactive log, got %s", logBuf.String())
	}
}

// TestLoadKitTemplates_AllInScope_Active — kit is always selected when templates parse;
// CDN eligibility is not a gate (assets use config.CdnURL).
func TestLoadKitTemplates_AllInScope_Active(t *testing.T) {
	prev := config.AppConfig
	t.Cleanup(func() { config.AppConfig = prev })

	kitDir := findKitDir(t)
	dataDir := filepath.Clean(filepath.Join(kitDir, "..", "..", ".."))

	config.AppConfig = &config.Config{
		CdnURL: utils.KitAssetTestCDNBase,
	}

	var logBuf bytes.Buffer
	prevLog := log.Writer()
	log.SetOutput(&logBuf)
	t.Cleanup(func() { log.SetOutput(prevLog) })

	client := &smtpClient{}
	loadKitTemplates(client, dataDir)
	if !client.KitActive() {
		t.Fatalf("expected kit active with parsed templates; count=%d", client.KitTemplateCount())
	}
	if client.KitTemplateCount() != ExpectedInScopeKitTemplateCount {
		t.Fatalf("expected %d kit templates, got %d", ExpectedInScopeKitTemplateCount, client.KitTemplateCount())
	}
	if !strings.Contains(logBuf.String(), "ACTIVE") {
		t.Fatalf("expected ACTIVE log, got %s", logBuf.String())
	}

	// Spot-check: every IN_SCOPE id from snapshot cases must resolve via templateFor.
	seen := map[string]bool{}
	for _, tc := range allSnapshotCases {
		if seen[tc.templateID] {
			continue
		}
		seen[tc.templateID] = true
		if !kitTemplateFileExists(tc.templateID) {
			continue // EXCLUDED stems snapshotted in P1 but not in the Kit set
		}
		legacyStub := template.New("legacy-stub-" + tc.templateID)
		got := client.templateFor(tc.templateID, legacyStub)
		if got == legacyStub {
			t.Fatalf("kitActive but templateFor(%s) fell back to legacy", tc.templateID)
		}
	}

	// Excluded restaurant/marketing stems must NOT be in the kit set.
	excluded := []string{
		"receipt", "invoice", "restaurant_approval", "restaurant_decline",
		"marketing", "marketing2", "marketing3", "marketing4",
		"marketing_approval_1", "marketing_sms_approval", "marketing_notification_approval",
	}
	for _, id := range excluded {
		if _, ok := client.kitTemplates.templates[id]; ok {
			t.Fatalf("excluded template %s must not be in kit set", id)
		}
		legacyStub := template.New("legacy-excluded-" + id)
		if client.templateFor(id, legacyStub) != legacyStub {
			t.Fatalf("excluded template %s must keep legacy path via templateFor", id)
		}
	}

	// festival_end_of_day_report stays Legacy-only (never Kit).
	if _, ok := client.kitTemplates.templates["festival_end_of_day_report"]; ok {
		t.Fatal("festival_end_of_day_report must not be in kit set")
	}
}

func TestLoadKitTemplates_PartialSet_Inactive(t *testing.T) {
	prev := config.AppConfig
	t.Cleanup(func() { config.AppConfig = prev })

	kitDir := findKitDir(t)
	dataDir := filepath.Clean(filepath.Join(kitDir, "..", "..", ".."))
	config.AppConfig = &config.Config{CdnURL: utils.KitAssetTestCDNBase}

	full, count, reason := tryLoadKitTemplates(dataDir)
	if full == nil || count != ExpectedInScopeKitTemplateCount {
		t.Fatalf("expected full kit set of %d, got %d (%s)", ExpectedInScopeKitTemplateCount, count, reason)
	}

	// Clone set and drop one template to prove fail-closed below expected count.
	partial := &kitTemplateSet{
		templatesDir: full.templatesDir,
		partialsDir:  full.partialsDir,
		partialPaths: full.partialPaths,
		templates:    make(map[string]*template.Template, count-1),
		funcMap:      full.funcMap,
	}
	dropped := false
	for name, tmpl := range full.templates {
		if !dropped && name == "organizer_team_invitation" {
			dropped = true
			continue
		}
		partial.templates[name] = tmpl
	}
	if !dropped {
		t.Fatal("expected organizer_team_invitation in full kit set")
	}

	client := &smtpClient{kitTemplates: partial, kitActive: len(partial.templates) == ExpectedInScopeKitTemplateCount}
	if client.KitActive() {
		t.Fatalf("partial kit set (%d) must leave kit inactive", len(partial.templates))
	}
	legacyStub := template.New("legacy-oti")
	if client.templateFor("organizer_team_invitation", legacyStub) != legacyStub {
		t.Fatal("inactive kit must fall back to legacy for organizer_team_invitation")
	}
}

func TestInventory_KitAnd11Excluded(t *testing.T) {
	kitDir := findKitDir(t)
	kitMatches, err := filepath.Glob(filepath.Join(kitDir, "*.template"))
	if err != nil {
		t.Fatal(err)
	}
	if len(kitMatches) != ExpectedInScopeKitTemplateCount {
		t.Fatalf("kit template files: want %d, got %d", ExpectedInScopeKitTemplateCount, len(kitMatches))
	}

	legacyDir := filepath.Clean(filepath.Join(kitDir, "..", "archive", "legacy"))
	legacyMatches, err := filepath.Glob(filepath.Join(legacyDir, "*.template"))
	if err != nil {
		t.Fatal(err)
	}
	// Original catalog archive was 59; organizer_team_invitation archive makes 60.
	if len(legacyMatches) != 60 {
		t.Fatalf("archived legacy templates: want 60, got %d under %s", len(legacyMatches), legacyDir)
	}

	partialMatches, err := filepath.Glob(filepath.Join(legacyDir, "partials", "*.template"))
	if err != nil {
		t.Fatal(err)
	}
	if len(partialMatches) != 12 {
		t.Fatalf("archived legacy partials: want 12, got %d", len(partialMatches))
	}

	kitIDs := map[string]struct{}{}
	for _, p := range kitMatches {
		kitIDs[strings.TrimSuffix(filepath.Base(p), ".template")] = struct{}{}
	}
	if _, ok := kitIDs["organizer_team_invitation"]; !ok {
		t.Fatal("organizer_team_invitation must be Kit #49")
	}
	if _, ok := kitIDs["festival_end_of_day_report"]; ok {
		t.Fatal("festival_end_of_day_report must remain outside the Kit set")
	}
	for _, id := range excludedLegacyTemplateIDs {
		if _, ok := kitIDs[id]; ok {
			t.Fatalf("excluded template %s must not have a kit file", id)
		}
		legacyPath := filepath.Join(legacyDir, id+".template")
		if _, err := os.Stat(legacyPath); err != nil {
			t.Fatalf("excluded legacy template missing from archive: %s", legacyPath)
		}
	}
	for id := range kitIDs {
		legacyPath := filepath.Join(legacyDir, id+".template")
		if _, err := os.Stat(legacyPath); err != nil {
			t.Fatalf("IN_SCOPE kit template %s missing archived legacy body at %s", id, legacyPath)
		}
	}
}

func TestLegacyArchivePath_LoadsViaInitiator(t *testing.T) {
	prevDir := *config.DataDirectory
	t.Cleanup(func() { *config.DataDirectory = prevDir })

	kitDir := findKitDir(t)
	repoRoot := filepath.Clean(filepath.Join(kitDir, "..", "..", ".."))
	*config.DataDirectory = repoRoot

	c := new(emailClientInitiator).initTemplatesSettings()
	wantLegacy := filepath.Join(repoRoot, "email", "templates", "archive", "legacy")
	if c.templatesDir != wantLegacy {
		t.Fatalf("legacy templatesDir: want %s, got %s", wantLegacy, c.templatesDir)
	}
	if len(c.partialFilesPaths) != 12 {
		t.Fatalf("legacy partial paths: want 12, got %d", len(c.partialFilesPaths))
	}

	// Smoke-load archived IN_SCOPE bodies (including Kit #49) and one EXCLUDED body.
	for _, name := range []string{"activate_email", "organizer_team_invitation", "receipt"} {
		tmpl, err := c.newEmailTemplate(name)
		if err != nil {
			t.Fatalf("parse archived legacy %s: %v", name, err)
		}
		if tmpl == nil {
			t.Fatalf("nil template for %s", name)
		}
	}

	// festival_end_of_day_report remains root-level Legacy-only.
	eod, err := c.newEmailTemplate("festival_end_of_day_report")
	if err != nil {
		t.Fatalf("festival_end_of_day_report must still load from root Legacy path: %v", err)
	}
	if eod == nil {
		t.Fatal("nil festival_end_of_day_report template")
	}
	rootPath := filepath.Join(repoRoot, "email", "templates", "festival_end_of_day_report.template")
	if _, err := os.Stat(rootPath); err != nil {
		t.Fatalf("festival_end_of_day_report root Legacy body missing: %v", err)
	}
	if _, err := os.Stat(filepath.Join(legacyDirFromKit(kitDir), "organizer_team_invitation.template")); err != nil {
		t.Fatalf("organizer_team_invitation must be archived, not root: %v", err)
	}
	if _, err := os.Stat(filepath.Join(repoRoot, "email", "templates", "organizer_team_invitation.template")); !os.IsNotExist(err) {
		t.Fatal("organizer_team_invitation must no longer exist at root templates path")
	}
}

func legacyDirFromKit(kitDir string) string {
	return filepath.Clean(filepath.Join(kitDir, "..", "archive", "legacy"))
}

func TestKitPartialsParseInIsolation(t *testing.T) {
	kitDir := findKitDir(t)
	dataDir := filepath.Clean(filepath.Join(kitDir, "..", "..", ".."))

	set, count, reason := tryLoadKitTemplates(dataDir)
	if set == nil {
		t.Fatal("expected kit set with partials")
	}
	if count < 1 {
		t.Fatalf("expected kit templates present; got %d (%s)", count, reason)
	}
	if len(set.partialPaths) < 4 {
		t.Fatalf("expected shared kit chrome partials, got %d paths: %v", len(set.partialPaths), set.partialPaths)
	}

	files := append([]string{}, set.partialPaths...)
	tmpl, err := template.New("kit_partials_root").Funcs(set.funcMap).ParseFiles(files...)
	if err != nil {
		t.Fatalf("kit partials must parse in isolation: %v", err)
	}
	for _, name := range []string{"kit_branded_header", "kit_branded_footer", "kit_primary_button", "kit_wallet_badges"} {
		if tmpl.Lookup(name) == nil {
			t.Fatalf("missing kit define %q", name)
		}
	}

	cdn := utils.KitAssetTestCDNBase
	params := map[string]any{
		"BrandLogoURL":         cdn + "/logos/eveenty-logo-en.png",
		"LogoAlt":              "Eveenty",
		"LogoWidth":            160,
		"LogoHeight":           64,
		"CTAHref":              "https://example.invalid/activate",
		"CTALabel":             "Activate",
		"GoogleWalletHref":     "https://example.invalid/google",
		"GoogleWalletBadgeURL": cdn + "/condensed/en.png",
		"GoogleWalletLabel":    "Add to Google Wallet",
		"GoogleWalletWidth":    174,
		"AppleWalletHref":      "cid:ticket-1.pkpass",
		"AppleWalletBadgeURL":  cdn + "/apple/en.png",
		"AppleWalletLabel":     "Add to Apple Wallet",
		"AppleWalletWidth":     152,
		"WalletDisplayHeight":  48,
		"HTMLDir":              "ltr",
		"FooterLead":           "This message was sent to",
		"FooterEmail":          "user@example.com",
		"FooterSuffix":         ".",
		"Copyright":            "© Eveenty. All rights reserved.",
	}

	var buf bytes.Buffer
	if err := tmpl.ExecuteTemplate(&buf, "kit_branded_header", params); err != nil {
		t.Fatalf("execute kit_branded_header: %v", err)
	}
	out := buf.String()
	if !strings.Contains(out, "cdn.snapshot.invalid") {
		t.Fatalf("expected CdnURL-based asset URLs in output")
	}
	if strings.Contains(out, "cdn.eveenty.com") {
		t.Fatalf("kit partials must not emit legacy CDN host")
	}
}

func findKitDir(t *testing.T) string {
	t.Helper()
	candidates := []string{
		filepath.Join("templates", "kit"),
		filepath.Join("email", "templates", "kit"),
	}
	for _, c := range candidates {
		if st, err := os.Stat(c); err == nil && st.IsDir() {
			abs, err := filepath.Abs(c)
			if err != nil {
				t.Fatal(err)
			}
			return abs
		}
	}
	t.Fatal("could not locate email/templates/kit")
	return ""
}

// excludedLegacyTemplateIDs is the catalog EXCLUDED set (11). These must never
// appear in the kit parse set and must keep the Legacy Execute path.
var excludedLegacyTemplateIDs = []string{
	"receipt", "invoice", "restaurant_approval", "restaurant_decline",
	"marketing", "marketing2", "marketing3", "marketing4",
	"marketing_approval_1", "marketing_sms_approval", "marketing_notification_approval",
}
