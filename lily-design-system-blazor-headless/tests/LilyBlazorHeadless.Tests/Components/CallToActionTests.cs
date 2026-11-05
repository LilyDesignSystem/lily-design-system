using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CallToActionTests : TestContext
{
    public CallToActionTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<CallToAction> Make(Action<ComponentParameterCollectionBuilder<CallToAction>>? more = null) =>
        RenderComponent<CallToAction>(p =>
        {
            p.AddUnmatched("data-root", "1");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.call-to-action"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.call-to-action").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.call-to-action").GetAttribute("data-test"));

    [Fact]
    public void With_Href_it_is_a_link()
    {
        var cut = Make(p => p.Add(x => x.Href, "/join").Add(x => x.Label, "Join us").AddChildContent("Join"));
        var link = cut.Find("div > a");
        Assert.Equal("/join", link.GetAttribute("href"));
        Assert.Equal("Join us", link.GetAttribute("aria-label"));
        Assert.Equal("Join", link.TextContent);
        Assert.Empty(cut.FindAll("button"));
    }

    [Fact]
    public void Without_Href_it_is_a_button_that_reports()
    {
        var clicks = 0;
        var cut = Make(p => p.Add(x => x.OnClick, () => clicks++));
        Assert.Equal("button", cut.Find("div > button").GetAttribute("type"));
        cut.Find("button").Click();
        Assert.Equal(1, clicks);
        Assert.Empty(cut.FindAll("a"));
    }

    [Fact]
    public void Disabled_reaches_the_button() =>
        Assert.True(Make(p => p.Add(x => x.Disabled, true)).Find("button").HasAttribute("disabled"));
}
