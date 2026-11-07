using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CodeBlockTests : TestContext
{
    [Fact]
    public void Is_a_region_only_when_labelled()
    {
        var plain = RenderComponent<CodeBlock>(p => p.AddChildContent("x")).Find(".code-block");
        Assert.Null(plain.GetAttribute("role"));
        Assert.Null(plain.GetAttribute("aria-label"));
        var named = RenderComponent<CodeBlock>(p => p.Add(x => x.Label, "Install").AddChildContent("x")).Find(".code-block");
        Assert.Equal("region", named.GetAttribute("role"));
        Assert.Equal("Install", named.GetAttribute("aria-label"));
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<CodeBlock>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".code-block");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<CodeBlock>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".code-block");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<CodeBlock>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".code-block");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
