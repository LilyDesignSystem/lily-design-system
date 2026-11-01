using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TourTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Tour>(p => p
            .Add(x => x.Active, true)
            .AddChildContent("body"));
        var root = cut.Find(".tour");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Tour>(p => p
            .Add(x => x.Active, true)
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".tour");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Tour>(p => p
            .Add(x => x.Active, true)
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".tour");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_nothing_while_inactive()
    {
        var cut = RenderComponent<Tour>(p => p.Add(x => x.Label, "Welcome").AddChildContent("body"));
        Assert.Empty(cut.FindAll(".tour"));
    }

    [Fact]
    public void Is_a_labelled_non_modal_dialog_that_can_take_focus()
    {
        var cut = RenderComponent<Tour>(p => p.Add(x => x.Active, true).Add(x => x.Label, "Welcome").AddChildContent("body"));
        var root = cut.Find(".tour");
        Assert.Equal("dialog", root.GetAttribute("role"));
        Assert.Equal("Welcome", root.GetAttribute("aria-label"));
        Assert.Equal("-1", root.GetAttribute("tabindex"));
        Assert.False(root.HasAttribute("aria-modal"));
    }

    [Fact]
    public void Escape_ends_the_tour_and_other_keys_do_not()
    {
        bool? reported = null;
        var cut = RenderComponent<Tour>(p => p
            .Add(x => x.Active, true)
            .Add(x => x.Label, "Welcome")
            .Add(x => x.ActiveChanged, (bool v) => reported = v)
            .AddChildContent("body"));
        cut.Find(".tour").KeyDown(new KeyboardEventArgs { Key = "Tab" });
        cut.Find(".tour").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Null(reported);
        cut.Find(".tour").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.False(reported);
        Assert.Empty(cut.FindAll(".tour"));
    }
}
