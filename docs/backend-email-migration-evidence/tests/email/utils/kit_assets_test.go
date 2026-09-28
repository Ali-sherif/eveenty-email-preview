package utils_test

import (
	"strings"
	"testing"

	"zemind.ca/rescounts/email/utils"
)

func TestKitAssetResolver_NotConfigured(t *testing.T) {
	cases := []string{"", "  ", "http://cdn.snapshot.invalid", "not-a-url", "https://"}
	for _, base := range cases {
		r := utils.NewKitAssetResolver(base)
		if r.Configured() {
			t.Fatalf("base %q should not be configured", base)
		}
		if u, ok := r.Resolve(utils.KitLogoEN); ok || u != "" {
			t.Fatalf("Resolve must return (\"\", false) for base %q; got %q ok=%v", base, u, ok)
		}
		if r.NotConfiguredReason() == "" {
			t.Fatalf("expected not-configured reason for base %q", base)
		}
	}
}

func TestKitAssetResolver_ConfiguredBase(t *testing.T) {
	r := utils.NewKitAssetResolver(utils.KitAssetTestCDNBase)
	if !r.Configured() {
		t.Fatalf("test CDN base should be configured: %s", r.NotConfiguredReason())
	}
	if !r.FullyConfigured() {
		t.Fatal("all 14 manifest assets must resolve against test CDN base")
	}

	u, ok := r.Resolve(utils.KitLogoEN)
	if !ok {
		t.Fatal("logo_en must resolve")
	}
	if !strings.HasPrefix(u, utils.KitAssetTestCDNBase+"/") {
		t.Fatalf("unexpected logo URL: %s", u)
	}
	if strings.Contains(u, "cdn.eveenty.com") || strings.Contains(u, "cdn-dv.eveenty.com") {
		t.Fatalf("must not return production/staging CDN host in unit test: %s", u)
	}
	if strings.Contains(u, "logo_transparent") || strings.Contains(u, "yellow") {
		t.Fatalf("must not return obsolete legacy logo/badge path: %s", u)
	}
	if u == "" {
		t.Fatal("must never return empty src on success")
	}
	if !strings.HasSuffix(u, "/logos/eveenty-logo-en.png") {
		t.Fatalf("expected kit object key path, got %s", u)
	}
}

func TestKitAssetResolver_LocaleRules(t *testing.T) {
	r := utils.NewKitAssetResolver(utils.KitAssetTestCDNBase)

	if id := utils.LogoAssetIDForLocale("admin"); id != utils.KitLogoEN {
		t.Fatalf("admin→en logo, got %s", id)
	}
	if id := utils.LogoAssetIDForLocale("zz"); id != utils.KitLogoEN {
		t.Fatalf("unknown→en logo, got %s", id)
	}
	if id := utils.LogoAssetIDForLocale("fa"); id != utils.KitLogoFA {
		t.Fatalf("fa logo expected logo_fa, got %s", id)
	}

	if id := utils.AppleWalletAssetIDForLocale("fa"); id != utils.KitWalletAppleEN {
		t.Fatalf("Apple fa→en, got %s", id)
	}
	if id := utils.GoogleWalletCondensedAssetIDForLocale("fa"); id != utils.KitWalletGoogleCondensedFA {
		t.Fatalf("Google fa condensed expected, got %s", id)
	}

	appleFA, ok := r.ResolveAppleWalletURL("fa")
	if !ok || !strings.HasSuffix(appleFA, "/apple/en.png") {
		t.Fatalf("Apple fa URL should use en.png, got %q", appleFA)
	}
	google, ok := r.ResolveGoogleWalletCondensedURL("en")
	if !ok || !strings.HasSuffix(google, "/condensed/en.png") {
		t.Fatalf("Google must be condensed only, got %q", google)
	}
	if strings.Contains(google, "/google/primary/") || strings.Contains(google, "wallet-button") {
		t.Fatalf("must not select Google Primary: %s", google)
	}
}

func TestKitAssetResolver_FourteenAssets(t *testing.T) {
	ids := utils.AllManifestAssetIDs()
	if len(ids) != 14 {
		t.Fatalf("expected 14 manifest assets, got %d", len(ids))
	}
	r := utils.NewKitAssetResolver(utils.KitAssetTestCDNBase)
	for _, id := range ids {
		u, ok := r.Resolve(id)
		if !ok || u == "" {
			t.Fatalf("asset %s must resolve", id)
		}
		if !strings.HasPrefix(u, "https://") {
			t.Fatalf("asset %s URL must be https: %s", id, u)
		}
	}
}

func TestKitAssetsConfigured(t *testing.T) {
	if utils.KitAssetsConfigured("") {
		t.Fatal("empty base must not be configured")
	}
	if !utils.KitAssetsConfigured(utils.KitAssetTestCDNBase) {
		t.Fatal("test CDN base must FullyConfigured for local render tests")
	}
	if !utils.KitAssetsConfigured("https://cdn.eveenty.com") {
		t.Fatal("production-shaped https base must FullyConfigured structurally")
	}
}
