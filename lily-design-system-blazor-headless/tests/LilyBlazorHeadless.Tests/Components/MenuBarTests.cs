using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The keys live in Menu.razor.js (bUnit runs no JavaScript); tests/js/menu-bar.test.mjs tests them.
public class MenuBarTests : TestContext
{
    public MenuBarTests()
    {
        var module = JSInterop.SetupModule(Menu.ModulePath);
        module.SetupModule("attach", _ => true);
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<MenuBar>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".menu-bar");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<MenuBar>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".menu-bar");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<MenuBar>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".menu-bar");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Attaches_the_keyboard_module_to_the_root()
    {
        RenderComponent<MenuBar>(p => p.AddChildContent("body"));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == Menu.ModulePath);
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "attach");
    }
}
