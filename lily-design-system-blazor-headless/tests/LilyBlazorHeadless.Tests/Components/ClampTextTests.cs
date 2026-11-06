using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ClampTextTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ClampText>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".clamp-text");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ClampText>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".clamp-text");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ClampText>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".clamp-text");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_a_named_group_when_labelled()
    {
        var cut = RenderComponent<ClampText>(p => p.Add(x => x.Label, "Story"));
        var root = cut.Find(".clamp-text");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Story", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Has_no_role_without_a_label()
    {
        var cut = RenderComponent<ClampText>();
        Assert.False(cut.Find(".clamp-text").HasAttribute("role"));
    }
}
