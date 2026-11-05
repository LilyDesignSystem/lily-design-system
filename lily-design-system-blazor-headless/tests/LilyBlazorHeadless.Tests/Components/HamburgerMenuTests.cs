using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class HamburgerMenuTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<HamburgerMenu>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".hamburger-menu");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<HamburgerMenu>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".hamburger-menu");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<HamburgerMenu>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".hamburger-menu");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void The_toggle_is_a_named_button_linked_to_the_navigation()
    {
        var cut = RenderComponent<HamburgerMenu>(p => p
            .Add(x => x.Label, "Main menu")
            .AddChildContent("<a href=\"/\">Home</a>"));
        Assert.Equal("DIV", cut.Find(".hamburger-menu").TagName);
        var button = cut.Find(".hamburger-menu > button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Null(button.GetAttribute("role"));
        Assert.Equal("Main menu", button.GetAttribute("aria-label"));
        Assert.Equal("Main menu", button.TextContent);
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        Assert.Empty(cut.FindAll("nav"));

        button.Click();
        var nav = cut.Find("nav");
        Assert.Equal("true", cut.Find("button").GetAttribute("aria-expanded"));
        Assert.Equal("Main menu", nav.GetAttribute("aria-label"));
        Assert.Equal(nav.GetAttribute("id"), cut.Find("button").GetAttribute("aria-controls"));
    }

    [Fact]
    public void Open_is_two_way()
    {
        var seen = new List<bool>();
        var cut = RenderComponent<HamburgerMenu>(p => p
            .Add(x => x.Label, "Main menu")
            .Add(x => x.Open, true)
            .Add(x => x.OpenChanged, (bool v) => seen.Add(v)));
        Assert.NotEmpty(cut.FindAll("nav"));
        cut.Find("button").Click();
        Assert.Equal(new[] { false }, seen);
        Assert.Empty(cut.FindAll("nav"));
    }
}
