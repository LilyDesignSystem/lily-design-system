using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class StickyPromoBannerTests : TestContext
{
    public StickyPromoBannerTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<StickyPromoBanner> Make(Action<ComponentParameterCollectionBuilder<StickyPromoBanner>>? more = null) =>
        RenderComponent<StickyPromoBanner>(p =>
        {
            p.Add(x => x.Label, "Offer").Add(x => x.DismissLabel, "Dismiss");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("aside.sticky-promo-banner"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("aside.sticky-promo-banner").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("aside.sticky-promo-banner").GetAttribute("data-test"));

    [Fact]
    public void Open_and_Position_drive_the_root()
    {
        var root = Make().Find("aside");
        Assert.False(root.HasAttribute("hidden"));
        Assert.Equal("bottom", root.GetAttribute("data-position"));
        Assert.Contains("bottom: 0", root.GetAttribute("style"));
        root = Make(p => p.Add(x => x.Open, false).Add(x => x.Position, "top")).Find("aside");
        Assert.True(root.HasAttribute("hidden"));
        Assert.Equal("top", root.GetAttribute("data-position"));
        Assert.Contains("top: 0", root.GetAttribute("style"));
    }

    [Fact]
    public void The_button_exists_only_with_a_handler()
    {
        Assert.Empty(Make().FindAll("button"));
        var dismissed = 0;
        var cut = Make(p => p.Add(x => x.OnDismiss, () => dismissed++));
        Assert.Equal("Dismiss", cut.Find("button.sticky-promo-banner-dismiss").GetAttribute("aria-label"));
        cut.Find("button").Click();
        Assert.Equal(1, dismissed);
    }

    [Fact]
    public void Content_is_in_its_own_part() =>
        Assert.Equal("Sale", Make(p => p.AddChildContent("Sale")).Find(".sticky-promo-banner-content").TextContent);
}
