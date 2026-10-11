using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TagTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Tag>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".tag");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Tag>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".tag");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Tag>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".tag");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_not_a_live_region_by_default_and_the_label_is_screen_reader_text()
    {
        var cut = RenderComponent<Tag>(p => p
            .Add(x => x.Label, "Priority: High")
            .AddChildContent("High"));
        var root = cut.Find("span.tag");
        Assert.False(root.HasAttribute("role"));
        Assert.False(root.HasAttribute("aria-label"));
        Assert.Equal("Priority: High", root.QuerySelector(".screen-reader-span")!.TextContent);
        Assert.Null(root.QuerySelector("[aria-hidden]"));
        Assert.StartsWith("High", root.TextContent);
    }

    [Fact]
    public void Live_renders_a_status_region_named_by_aria_label()
    {
        var cut = RenderComponent<Tag>(p => p
            .Add(x => x.Label, "Build: Passing")
            .Add(x => x.Live, true)
            .AddChildContent("Passing"));
        var root = cut.Find("span.tag");
        Assert.Equal("status", root.GetAttribute("role"));
        Assert.Equal("Build: Passing", root.GetAttribute("aria-label"));
    }
}
