using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ErrorSummaryTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ErrorSummary>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".error-summary");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ErrorSummary>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".error-summary");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ErrorSummary>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".error-summary");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_an_alert_named_by_its_title_and_can_take_focus()
    {
        var cut = RenderComponent<ErrorSummary>(p => p.Add(x => x.Title, "There is a problem"));
        var root = cut.Find(".error-summary");
        Assert.Equal("alert", root.GetAttribute("role"));
        Assert.Equal("-1", root.GetAttribute("tabindex"));
        Assert.Equal(cut.Find("h2").GetAttribute("id"), root.GetAttribute("aria-labelledby"));
        Assert.Equal("There is a problem", cut.Find("h2").TextContent);
    }

    [Fact]
    public void Without_a_title_the_label_names_it()
    {
        var cut = RenderComponent<ErrorSummary>(p => p.Add(x => x.Label, "Errors"));
        var root = cut.Find(".error-summary");
        Assert.Equal("Errors", root.GetAttribute("aria-label"));
        Assert.False(root.HasAttribute("aria-labelledby"));
    }
}
