using LilyDesignSystem.Maui.Themes;
using Microsoft.Maui.Controls;
using Microsoft.Maui.Graphics;

namespace LilyDesignSystem.Maui.Tests;

// The generated tokens (bin/generate-mobile-tokens) as the web's contrast gate reads them: in light and dark every colour pair
// is at least 4.5:1 (WCAG 1.4.3), and the link colour on each base surface too.
public class ThemeTests
{
    private static double Luminance(Color c)
    {
        static double Channel(float v) => v <= 0.04045 ? v / 12.92 : Math.Pow((v + 0.055) / 1.055, 2.4);
        return 0.2126 * Channel(c.Red) + 0.7152 * Channel(c.Green) + 0.0722 * Channel(c.Blue);
    }

    private static double Contrast(Color a, Color b)
    {
        var (x, y) = (Luminance(a), Luminance(b));
        return (Math.Max(x, y) + 0.05) / (Math.Min(x, y) + 0.05);
    }

    public static TheoryData<string> Gated => new() { "light", "dark" };

    [Theory]
    [MemberData(nameof(Gated))]
    public void EveryColourPairIsAtLeast4_5To1(string slug)
    {
        var t = LilyTokens.All.Single(x => x.Slug == slug);
        var pairs = new (string Name, Color Fill, Color Text)[]
        {
            ("base-100", t.Base100, t.BaseContent), ("base-200", t.Base200, t.BaseContent), ("base-300", t.Base300, t.BaseContent),
            ("primary", t.Primary, t.PrimaryContent), ("secondary", t.Secondary, t.SecondaryContent), ("accent", t.Accent, t.AccentContent),
            ("neutral", t.Neutral, t.NeutralContent), ("info", t.Info, t.InfoContent), ("success", t.Success, t.SuccessContent),
            ("warning", t.Warning, t.WarningContent), ("error", t.Error, t.ErrorContent), ("link", t.Base100, t.Link),
        };
        foreach (var (name, fill, text) in pairs)
            Assert.True(Contrast(fill, text) >= 4.5, $"{slug} {name}: {Contrast(fill, text):F2}:1");
    }

    [Fact]
    public void ApplyWritesEveryTokenAndReplacesTheLastTheme()
    {
        var resources = new ResourceDictionary();
        LilyTheme.Apply(resources, LilyTokens.Light);
        Assert.Equal(LilyTokens.Light.Primary, resources["lily-color-primary"]);
        Assert.Equal(26, resources.Count); // 20 colour roles, the link, 4 sizes and the slug
        LilyTheme.Apply(resources, LilyTokens.Dark);
        Assert.Equal(LilyTokens.Dark.Primary, resources["lily-color-primary"]);
        Assert.Equal("dark", resources["lily-theme"]);
    }

    [Fact]
    public void SixThemesWithTheirWebSlugs()
    {
        Assert.Equal(6, LilyTokens.All.Count);
        Assert.Contains(LilyTokens.All, t => t.Slug == "united-kingdom-government-digital-service" && t.RadiusBox == 0);
    }
}
