using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TourListTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<TourList>(p => p
            .Add(x => x.Active, true)
            .AddChildContent("body"));
        var root = cut.Find(".tour-list");
        Assert.NotNull(root);
    }

    [Fact]
    public void Is_a_focusable_labelled_list_not_a_dialog()
    {
        var cut = RenderComponent<TourList>(p => p
            .Add(x => x.Active, true)
            .Add(x => x.Label, "Getting started")
            .AddChildContent("body"));
        var root = cut.Find("ol.tour-list");
        Assert.Equal("Getting started", root.GetAttribute("aria-label"));
        Assert.Equal("-1", root.GetAttribute("tabindex"));
        Assert.False(root.HasAttribute("role"));
        Assert.False(root.HasAttribute("aria-modal"));
    }

    [Fact]
    public void Renders_nothing_while_inactive()
    {
        var cut = RenderComponent<TourList>(p => p.AddChildContent("body"));
        Assert.Empty(cut.FindAll(".tour-list"));
    }

    [Fact]
    public void Escape_closes_the_tour_and_reports_it()
    {
        bool? reported = null;
        var cut = RenderComponent<TourList>(p => p
            .Add(x => x.Active, true)
            .Add(x => x.ActiveChanged, (bool v) => reported = v)
            .AddChildContent("body"));
        cut.Find(".tour-list").KeyDown(key: "Escape");
        Assert.False(reported);
        Assert.Empty(cut.FindAll(".tour-list"));
    }

    [Fact]
    public void Other_keys_leave_it_open()
    {
        bool? reported = null;
        var cut = RenderComponent<TourList>(p => p
            .Add(x => x.Active, true)
            .Add(x => x.ActiveChanged, (bool v) => reported = v)
            .AddChildContent("body"));
        cut.Find(".tour-list").KeyDown(key: "Enter");
        cut.Find(".tour-list").KeyDown(key: "ArrowDown");
        Assert.Null(reported);
        Assert.Single(cut.FindAll(".tour-list"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<TourList>(p => p
            .Add(x => x.Active, true)
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".tour-list");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<TourList>(p => p
            .Add(x => x.Active, true)
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".tour-list");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
