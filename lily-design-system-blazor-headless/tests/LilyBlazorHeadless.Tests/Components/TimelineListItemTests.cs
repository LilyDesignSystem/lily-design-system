using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TimelineListItemTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<TimelineListItem>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".timeline-list-item");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<TimelineListItem>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".timeline-list-item");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<TimelineListItem>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".timeline-list-item");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Withheld_shows_only_the_words_and_in_error_strikes_the_content_through()
    {
        var withheld = RenderComponent<TimelineListItem>(p => p
            .Add(x => x.EntryState, "withheld")
            .Add(x => x.EntryStateLabel, "Restricted")
            .AddChildContent("Sensitive note"));
        var li = withheld.Find("li.timeline-list-item");
        Assert.Equal("withheld", li.GetAttribute("data-entry-state"));
        Assert.DoesNotContain("Sensitive note", li.TextContent);
        Assert.Equal("Restricted", withheld.Find(".timeline-list-item-entry-state").TextContent);
        var inError = RenderComponent<TimelineListItem>(p => p
            .Add(x => x.EntryState, "entered-in-error")
            .Add(x => x.EntryStateLabel, "Entered in error")
            .AddChildContent("Sensitive note"));
        Assert.Equal("Sensitive note", inError.Find("del.timeline-list-item-entry").TextContent);
        Assert.Equal("Entered in error", inError.Find(".timeline-list-item-entry-state").TextContent);
    }
}
