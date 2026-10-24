// MarkdownFormat tests: the same cases as shared/markdown-format.test.ts, in C#.
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class MarkdownFormatTests
{
    private static string Selected(MarkdownEdit e) => e.Text[e.Start..e.End];

    // ---- ToggleWrap ----

    [Fact]
    public void Wrap_wraps_the_selection_and_keeps_it_selected()
    {
        var e = MarkdownFormat.ToggleWrap("say hello now", 4, 9, "**");
        Assert.Equal("say **hello** now", e.Text);
        Assert.Equal("hello", Selected(e));
    }

    [Fact]
    public void Wrap_with_no_selection_puts_the_caret_between_the_markers()
    {
        var e = MarkdownFormat.ToggleWrap("ab", 1, 1, "**");
        Assert.Equal(new MarkdownEdit("a****b", 3, 3), e);
    }

    [Fact]
    public void Wrap_unwraps_when_the_markers_sit_just_outside_the_selection()
    {
        var e = MarkdownFormat.ToggleWrap("say **hello** now", 6, 11, "**");
        Assert.Equal("say hello now", e.Text);
        Assert.Equal("hello", Selected(e));
    }

    [Fact]
    public void Wrap_unwraps_when_the_markers_are_inside_the_selection()
    {
        var e = MarkdownFormat.ToggleWrap("say **hello** now", 4, 13, "**");
        Assert.Equal("say hello now", e.Text);
        Assert.Equal("hello", Selected(e));
    }

    [Fact]
    public void Wrap_applied_twice_is_the_identity()
    {
        var once = MarkdownFormat.ToggleWrap("hello", 0, 5, "~~");
        var twice = MarkdownFormat.ToggleWrap(once.Text, once.Start, once.End, "~~");
        Assert.Equal("hello", twice.Text);
    }

    [Fact]
    public void Italic_inside_bold_adds_a_marker_rather_than_removing_one() =>
        Assert.Equal("***hello***", MarkdownFormat.ToggleWrap("**hello**", 2, 7, "*").Text);

    [Fact]
    public void Italic_is_removed_from_bold_italic_leaving_bold() =>
        Assert.Equal("**hello**", MarkdownFormat.ToggleWrap("***hello***", 3, 8, "*").Text);

    [Fact]
    public void Bold_is_removed_from_bold_italic_leaving_italic() =>
        Assert.Equal("*hello*", MarkdownFormat.ToggleWrap("***hello***", 3, 8, "**").Text);

    [Fact]
    public void Bold_is_not_mistaken_for_present_around_plain_italic() =>
        Assert.Equal("***hello***", MarkdownFormat.ToggleWrap("*hello*", 1, 6, "**").Text);

    [Fact]
    public void Code_uses_a_backtick() =>
        Assert.Equal("`x = 1`", MarkdownFormat.ToggleWrap("x = 1", 0, 5, "`").Text);

    // ---- InsertLink ----

    [Fact]
    public void Link_wraps_the_selection_and_selects_the_address()
    {
        var e = MarkdownFormat.InsertLink("see docs here", 4, 8);
        Assert.Equal("see [docs](https://) here", e.Text);
        Assert.Equal("https://", Selected(e));
    }

    [Fact]
    public void Link_with_no_selection_puts_the_caret_in_the_empty_brackets()
    {
        var e = MarkdownFormat.InsertLink("ab", 1, 1);
        Assert.Equal("a[](https://)b", e.Text);
        Assert.Equal(2, e.Start);
        Assert.Equal(2, e.End);
    }

    // ---- ToggleLines ----

    [Fact]
    public void Lines_prefix_the_line_the_caret_is_on() =>
        Assert.Equal("one\n- two\nthree", MarkdownFormat.ToggleLines("one\ntwo\nthree", 5, 5, "bulletList").Text);

    [Fact]
    public void Lines_prefix_every_selected_line() =>
        Assert.Equal("- one\n- two\nthree", MarkdownFormat.ToggleLines("one\ntwo\nthree", 0, 7, "bulletList").Text);

    [Fact]
    public void Lines_take_the_prefix_off_when_every_line_has_it() =>
        Assert.Equal("one\ntwo", MarkdownFormat.ToggleLines("- one\n- two", 0, 11, "bulletList").Text);

    [Fact]
    public void Lines_number_from_1_and_skip_blank_lines_without_consuming_a_number() =>
        Assert.Equal("1. a\n\n2. b", MarkdownFormat.ToggleLines("a\n\nb", 0, 4, "numberedList").Text);

    [Fact]
    public void Lines_replace_a_different_list_prefix_rather_than_stacking() =>
        Assert.Equal("1. one", MarkdownFormat.ToggleLines("- one", 0, 5, "numberedList").Text);

    [Fact]
    public void Heading_uses_the_given_level_and_toggles_off()
    {
        var on = MarkdownFormat.ToggleLines("Title", 0, 5, "heading", 3);
        Assert.Equal("### Title", on.Text);
        Assert.Equal("Title", MarkdownFormat.ToggleLines(on.Text, 0, on.Text.Length, "heading", 3).Text);
    }

    [Fact]
    public void A_quote_is_not_doubled() =>
        Assert.Equal("a", MarkdownFormat.ToggleLines("> a", 0, 3, "quote").Text);

    [Fact]
    public void A_selection_ending_at_the_start_of_the_next_line_leaves_that_line_alone() =>
        Assert.Equal("> one\ntwo", MarkdownFormat.ToggleLines("one\ntwo", 0, 4, "quote").Text);

    [Fact]
    public void Lines_keep_the_selection_on_the_same_text()
    {
        var e = MarkdownFormat.ToggleLines("one two", 4, 7, "bulletList");
        Assert.Equal("- one two", e.Text);
        Assert.Equal("two", Selected(e));
    }

    [Fact]
    public void Lines_reject_a_tool_that_is_not_a_line_tool() =>
        Assert.Throws<ArgumentException>(() => MarkdownFormat.ToggleLines("a", 0, 1, "bold"));

    // ---- ApplyTool ----

    [Fact]
    public void ApplyTool_dispatches_wrap_link_and_line_tools()
    {
        Assert.Equal("**a**", MarkdownFormat.ApplyTool("bold", "a", 0, 1).Text);
        Assert.Equal("[a](https://)", MarkdownFormat.ApplyTool("link", "a", 0, 1).Text);
        Assert.Equal("> a", MarkdownFormat.ApplyTool("quote", "a", 0, 1).Text);
    }

    [Fact]
    public void ApplyTool_passes_the_heading_level_through() =>
        Assert.Equal("# a", MarkdownFormat.ApplyTool("heading", "a", 0, 1, 1).Text);
}
