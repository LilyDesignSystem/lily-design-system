using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class NavigationMenuTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<NavigationMenu>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".navigation-menu");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<NavigationMenu>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".navigation-menu");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<NavigationMenu>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".navigation-menu");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Overflow_unset_renders_as_before_with_no_list_no_More_and_no_JS()
    {
        var cut = RenderComponent<NavigationMenu>(p => p
            .Add(x => x.Label, "Main")
            .AddChildContent("body"));
        Assert.Empty(cut.FindAll(".navigation-menu-list"));
        Assert.Empty(cut.FindAll(".navigation-menu-more"));
        Assert.Null(cut.Find("nav").GetAttribute("data-overflow"));
        Assert.Empty(JSInterop.Invocations);
    }

    private IRenderedComponent<NavigationMenu> RenderOverflow()
    {
        var module = JSInterop.SetupModule(NavigationMenu.ModulePath);
        module.Mode = JSRuntimeMode.Loose;
        return RenderComponent<NavigationMenu>(p => p
            .Add(x => x.Label, "Main")
            .Add(x => x.Overflow, true)
            .Add(x => x.MoreLabel, "Mwy")
            .AddChildContent("<li><a href=\"/\">Home</a></li><li><a href=\"/b\" aria-current=\"page\">B</a></li>"));
    }

    [Fact]
    public void Overflow_publishes_data_overflow_and_renders_a_hidden_More_item()
    {
        var cut = RenderOverflow();
        Assert.Equal("true", cut.Find("nav").GetAttribute("data-overflow"));
        var list = cut.Find("ul.navigation-menu-list");
        Assert.Equal(3, list.Children.Length);
        var more = cut.Find("li.navigation-menu-more");
        Assert.True(more.HasAttribute("hidden"));
        Assert.True(cut.Find("ul.navigation-menu-more-list").HasAttribute("hidden"));
        Assert.NotNull(cut.Find("[aria-current=page]"));
    }

    [Fact]
    public void Overflow_button_is_named_by_MoreLabel_and_starts_collapsed()
    {
        var button = RenderOverflow().Find("button.navigation-menu-more-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        Assert.Equal("Mwy", button.TextContent);
    }

    [Fact]
    public void Overflow_attaches_the_measuring_module_after_first_render()
    {
        var cut = RenderOverflow();
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == NavigationMenu.ModulePath);
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "attach");
        Assert.EndsWith("/Components/NavigationMenu.razor.js", NavigationMenu.ModulePath);
    }
}
