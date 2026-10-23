using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MiddleTruncationTests : TestContext
{
    private const string Text = "abcdefghijklmnopqrstuvwxyz";

    private IRenderedComponent<MiddleTruncation> Render(Action<Bunit.ComponentParameterCollectionBuilder<MiddleTruncation>>? extra = null) =>
        RenderComponent<MiddleTruncation>(p => { p.Add(x => x.Text, Text).Add(x => x.Ellipsis, "…"); extra?.Invoke(p); });

    [Fact] public void Renders_span_with_base_class_first_then_consumer_class() =>
        Assert.Equal("middle-truncation mine", Render(p => p.Add(x => x.CssClass, "mine")).Find("span.middle-truncation").GetAttribute("class"));

    [Fact] public void Shows_the_full_text_without_a_budget()
    {
        var c = Render();
        Assert.Equal(Text, c.Find(".middle-truncation-visual").TextContent);
        Assert.Null(c.Find(".middle-truncation").GetAttribute("data-truncated"));
    }

    [Fact] public void Shortens_to_MaxCharacters_and_marks_data_truncated()
    {
        var c = Render(p => p.Add(x => x.MaxCharacters, 8));
        Assert.Equal("abc…wxyz", c.Find(".middle-truncation-visual").TextContent);
        Assert.NotNull(c.Find(".middle-truncation").GetAttribute("data-truncated"));
    }

    [Fact] public void Keeps_the_full_text_in_the_accessibility_tree_and_hides_the_shortened_copy()
    {
        var c = Render(p => p.Add(x => x.MaxCharacters, 8));
        Assert.Equal("true", c.Find(".middle-truncation-visual").GetAttribute("aria-hidden"));
        Assert.Equal(Text, c.Find(".middle-truncation-full").TextContent);
        Assert.Empty(c.FindAll(".middle-truncation-full[aria-hidden]"));
    }

    [Fact] public void Fits_means_unchanged() =>
        Assert.Equal(Text, Render(p => p.Add(x => x.MaxCharacters, 100)).Find(".middle-truncation-visual").TextContent);

    [Fact] public void Uses_the_consumers_ellipsis() =>
        Assert.Equal("a[...]yz", RenderComponent<MiddleTruncation>(p => p.Add(x => x.Text, Text).Add(x => x.Ellipsis, "[...]").Add(x => x.MaxCharacters, 8)).Find(".middle-truncation-visual").TextContent);

    [Fact] public void Fixed_end_keeps_exactly_End_characters()
    {
        var c = Render(p => p.Add(x => x.Strategy, "fixed-end").Add(x => x.End, 4).Add(x => x.MaxCharacters, 12));
        Assert.Equal("abcdefg…wxyz", c.Find(".middle-truncation-visual").TextContent);
        Assert.Equal("fixed-end", c.Find(".middle-truncation").GetAttribute("data-strategy"));
    }

    [Fact] public void Min_end_keeps_at_least_End_characters() =>
        Assert.Equal("a…uvwxyz", Render(p => p.Add(x => x.Strategy, "min-end").Add(x => x.End, 6).Add(x => x.MaxCharacters, 8)).Find(".middle-truncation-visual").TextContent);

    [Fact] public void Fixed_end_with_zero_keeps_nothing_at_the_end() =>
        Assert.Equal("abcd…", MiddleTruncation.Truncate("abcdefghij", "…", "fixed-end", 0, 5));

    [Fact] public void Never_splits_an_emoji_sequence()
    {
        const string Family = "👩‍👩‍👧‍👦";
        var text = string.Concat(Enumerable.Repeat(Family, 5));
        Assert.Equal(Family + "…" + Family, MiddleTruncation.Truncate(text, "…", "even", null, 3));
    }

    [Fact] public void Spreads_unmatched_attributes_on_the_root()
    {
        var el = Render(p => p.AddUnmatched("id", "c1").AddUnmatched("data-test", "x")).Find("span.middle-truncation");
        Assert.Equal("c1", el.Id);
        Assert.Equal("x", el.GetAttribute("data-test"));
    }
}
