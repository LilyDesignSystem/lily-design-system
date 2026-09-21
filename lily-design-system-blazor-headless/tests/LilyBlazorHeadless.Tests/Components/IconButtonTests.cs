using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class IconButtonTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<IconButton>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".icon-button");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<IconButton>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".icon-button");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<IconButton>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".icon-button");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Defaults_to_type_button_not_submit()
    {
        var cut = RenderComponent<IconButton>(p => p.AddChildContent("body"));
        Assert.Equal("button", cut.Find("button").GetAttribute("type"));
    }

    [Fact]
    public void BaseCssClass_replaces_the_default_class_token_outright()
    {
        var cut = RenderComponent<IconButton>(p => p
            .AddChildContent("body")
            .Add(x => x.BaseCssClass, "theme-picker-button"));
        var root = cut.Find("button");
        Assert.Equal("theme-picker-button", root.GetAttribute("class"));
        Assert.Throws<Bunit.ElementNotFoundException>(() => cut.Find(".icon-button"));
    }

    [Fact]
    public void AriaHaspopup_expanded_controls_pass_through_via_AdditionalAttributes()
    {
        var cut = RenderComponent<IconButton>(p => p
            .AddChildContent("body")
            .AddUnmatched("aria-haspopup", "listbox")
            .AddUnmatched("aria-expanded", "false")
            .AddUnmatched("aria-controls", "some-list"));
        var root = cut.Find("button");
        Assert.Equal("listbox", root.GetAttribute("aria-haspopup"));
        Assert.Equal("false", root.GetAttribute("aria-expanded"));
        Assert.Equal("some-list", root.GetAttribute("aria-controls"));
    }

    [Fact]
    public void Element_exposes_the_rendered_button_for_FocusAsync()
    {
        var cut = RenderComponent<IconButton>(p => p.AddChildContent("body"));
        // A real ElementReference.Id is only assigned once bUnit's renderer
        // has captured the @ref against a live element — a non-null/empty
        // id is the same "did @ref actually bind" proof ThemePickerTests
        // relies on for its own ButtonReferenceId test seam.
        Assert.False(string.IsNullOrEmpty(cut.Instance.Element.Id));
    }
}
