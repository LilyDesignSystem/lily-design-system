using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ExpanderTests : TestContext
{
    public ExpanderTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<Expander> Make(Action<ComponentParameterCollectionBuilder<Expander>>? more = null) =>
        RenderComponent<Expander>(p =>
        {
            p.Add(x => x.Label, "More");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.expander"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.expander").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.expander").GetAttribute("data-test"));

    [Fact]
    public void The_button_controls_a_region_that_exists_only_while_expanded()
    {
        var cut = Make(p => p.AddChildContent("body"));
        var button = cut.Find("button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        Assert.Equal("More", button.TextContent);
        Assert.Empty(cut.FindAll("[role=region]"));
        button.Click();
        var region = cut.Find("[role=region]");
        Assert.Equal("true", cut.Find("button").GetAttribute("aria-expanded"));
        Assert.Equal(region.Id, cut.Find("button").GetAttribute("aria-controls"));
        Assert.Equal("More", region.GetAttribute("aria-label"));
        Assert.Equal("body", region.TextContent);
    }

    [Fact]
    public void Toggling_reports()
    {
        bool? seen = null;
        var cut = Make(p => p.Add(x => x.ExpandedChanged, (bool v) => seen = v));
        cut.Find("button").Click();
        Assert.True(seen);
        cut.Find("button").Click();
        Assert.False(seen);
    }
}
