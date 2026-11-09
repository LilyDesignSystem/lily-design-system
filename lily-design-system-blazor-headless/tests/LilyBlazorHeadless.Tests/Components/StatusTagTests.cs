using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class StatusTagTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<StatusTag>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".status-tag");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<StatusTag>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".status-tag");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<StatusTag>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".status-tag");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_a_static_label_with_label_as_hidden_text()
    {
        var cut = RenderComponent<StatusTag>(p => p
            .AddChildContent("Done")
            .Add(x => x.Label, "Status:"));
        var root = cut.Find(".status-tag");
        Assert.False(root.HasAttribute("role"));
        Assert.False(root.HasAttribute("aria-label"));
        Assert.Equal("Status: ", cut.Find(".screen-reader-span").TextContent);
    }

    [Fact]
    public void Renders_Type_as_data_type_default_when_unset_as_Svelte_does()
    {
        Assert.Equal("default", RenderComponent<StatusTag>(p => p.AddChildContent("Draft")).Find(".status-tag").GetAttribute("data-type"));
        Assert.Equal("error", RenderComponent<StatusTag>(p => p.AddChildContent("Failed").Add(x => x.Type, "error")).Find(".status-tag").GetAttribute("data-type"));
    }
}
