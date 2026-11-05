using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class GovernmentBannerTests : TestContext
{
    public GovernmentBannerTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<GovernmentBanner> Make(Action<ComponentParameterCollectionBuilder<GovernmentBanner>>? more = null) =>
        RenderComponent<GovernmentBanner>(p =>
        {
            p.Add(x => x.Label, "Official").Add(x => x.HeaderText, "An official site").Add(x => x.ExpandLabel, "How you know");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("aside.government-banner"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("aside.government-banner").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("aside.government-banner").GetAttribute("data-test"));

    [Fact]
    public void The_toggle_controls_the_panel()
    {
        bool? seen = null;
        var cut = Make(p => p.Add(x => x.PanelId, "panel").AddChildContent("details").Add(x => x.ExpandedChanged, (bool v) => seen = v));
        Assert.Equal("An official site", cut.Find(".government-banner-headline").TextContent);
        var toggle = cut.Find("button.government-banner-toggle");
        Assert.Equal("How you know", toggle.TextContent);
        Assert.Equal("panel", toggle.GetAttribute("aria-controls"));
        Assert.Equal("false", toggle.GetAttribute("aria-expanded"));
        Assert.True(cut.Find("#panel").HasAttribute("hidden"));
        toggle.Click();
        Assert.True(seen);
        Assert.Equal("true", cut.Find("button").GetAttribute("aria-expanded"));
        Assert.False(cut.Find("#panel").HasAttribute("hidden"));
    }

    [Fact]
    public void The_panel_has_an_id_without_one_given()
    {
        var cut = Make();
        Assert.Equal(cut.Find(".government-banner-details").Id, cut.Find("button").GetAttribute("aria-controls"));
    }
}
