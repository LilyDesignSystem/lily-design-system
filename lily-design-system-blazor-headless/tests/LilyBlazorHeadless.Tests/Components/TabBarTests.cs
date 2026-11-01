using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The keys live in TabBar.razor.js (bUnit runs no JavaScript); tests/js/tab-bar.test.mjs tests them.
public class TabBarTests : TestContext
{
    public TabBarTests()
    {
        var module = JSInterop.SetupModule(TabBar.ModulePath);
        module.SetupModule("attach", _ => true);
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<TabBar>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".tab-bar");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<TabBar>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".tab-bar");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<TabBar>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".tab-bar");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Attaches_the_keyboard_module_to_the_root()
    {
        RenderComponent<TabBar>(p => p.AddChildContent("body"));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == TabBar.ModulePath);
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "attach");
    }
}
