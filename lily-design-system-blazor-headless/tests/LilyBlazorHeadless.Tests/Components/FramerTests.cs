using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FramerTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Framer>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".framer");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Framer>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".framer");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Framer>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".framer");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_a_named_group_when_labelled()
    {
        var cut = RenderComponent<Framer>(p => p
            .AddChildContent("body")
            .Add(x => x.Label, "Story"));
        var root = cut.Find(".framer");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Story", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Has_no_role_without_a_label()
    {
        var cut = RenderComponent<Framer>(p => p.AddChildContent("body"));
        Assert.False(cut.Find(".framer").HasAttribute("role"));
    }
}
