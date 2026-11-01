using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The keys live in TreeMenu.razor.js (bUnit runs no JavaScript); tests/js/tree-menu.test.mjs tests them.
public class TreeMenuTests : TestContext
{
    public TreeMenuTests()
    {
        var module = JSInterop.SetupModule(TreeMenu.ModulePath);
        module.SetupModule("attach", _ => true);
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<TreeMenu>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".tree-menu");
        Assert.NotNull(root);
    }

    [Fact]
    public void Is_a_labelled_tree()
    {
        var cut = RenderComponent<TreeMenu>(p => p
            .Add(x => x.Label, "Site")
            .AddChildContent("body"));
        var root = cut.Find("[role=tree]");
        Assert.Equal("Site", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<TreeMenu>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".tree-menu");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<TreeMenu>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".tree-menu");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Attaches_the_keyboard_module_to_the_tree()
    {
        RenderComponent<TreeMenu>(p => p.AddChildContent("body"));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == TreeMenu.ModulePath);
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "attach");
    }
}
