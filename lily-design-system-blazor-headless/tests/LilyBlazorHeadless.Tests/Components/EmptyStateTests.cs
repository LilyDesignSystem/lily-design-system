using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class EmptyStateTests : TestContext
{
    [Fact]
    public void Renders_a_div_with_the_empty_state_class()
    {
        var root = RenderComponent<EmptyState>(p => p.AddChildContent("x")).Find(".empty-state");
        Assert.Equal("DIV", root.TagName);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
        => Assert.Equal("empty-state extra", RenderComponent<EmptyState>(p => p.Add(x => x.CssClass, "extra")).Find("div").GetAttribute("class"));

    [Fact]
    public void Renders_consumer_children()
        => Assert.Contains("Nothing here", RenderComponent<EmptyState>(p => p.AddChildContent("<h2>Nothing here</h2>")).Markup);

    [Fact]
    public void Without_label_there_is_no_role_and_no_aria_label()
    {
        var root = RenderComponent<EmptyState>(p => p.AddChildContent("x")).Find(".empty-state");
        Assert.Null(root.GetAttribute("role"));
        Assert.Null(root.GetAttribute("aria-label"));
    }

    [Fact]
    public void With_label_it_is_a_labelled_group()
    {
        var root = RenderComponent<EmptyState>(p => p.Add(x => x.Label, "No results")).Find(".empty-state");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("No results", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Is_not_a_live_region()
    {
        var root = RenderComponent<EmptyState>(p => p.Add(x => x.Label, "No results")).Find(".empty-state");
        Assert.Null(root.GetAttribute("aria-live"));
        Assert.NotEqual("status", root.GetAttribute("role"));
        Assert.NotEqual("alert", root.GetAttribute("role"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
        => Assert.Equal("value", RenderComponent<EmptyState>(p => p.AddUnmatched("data-test", "value")).Find(".empty-state").GetAttribute("data-test"));
}
