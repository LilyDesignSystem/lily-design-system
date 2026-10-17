// GridModules tests — the C# port of the canonical Svelte shared/ test vectors (search-text, typeahead, edit-history, grid-navigation, direction).

using System.Linq;
using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class GridModulesTests
{
    [Fact]
    public void Search_every_term_must_appear_in_any_order_ignoring_case_and_diacritics()
    {
        Assert.True(SearchText.Matches("Café menu", "MENU cafe"));
        Assert.False(SearchText.Matches("Café menu", "cafe tea"));
        Assert.True(SearchText.Matches("anything", "   "));
        Assert.True(SearchText.Matches("anything", null));
    }

    [Fact]
    public void Search_highlight_marks_matching_runs_and_leaves_others()
    {
        var segments = SearchText.Highlight("Design login page", "login");
        Assert.Equal(new[] { "Design ", "login", " page" }, segments.Select(s => s.Text));
        Assert.Equal(new[] { false, true, false }, segments.Select(s => s.Match));
        Assert.Single(SearchText.Highlight("abc", ""));
        var accented = SearchText.Highlight("Café", "cafe");
        Assert.Single(accented);
        Assert.True(accented[0].Match);
    }

    [Fact]
    public void Typeahead_prefix_grows_within_the_pause_then_resets()
    {
        var a = Typeahead.Next(new Typeahead.State("", 0), "d", 100);
        var b = Typeahead.Next(a, "e", 400);
        Assert.Equal("de", b.Prefix);
        Assert.Equal("x", Typeahead.Next(b, "x", 400 + Typeahead.ResetMs + 1).Prefix);
        Assert.True(Typeahead.IsKey("a"));
        Assert.False(Typeahead.IsKey(" "));
        Assert.False(Typeahead.IsKey("a", ctrl: true));
        Assert.False(Typeahead.IsKey("Enter"));
    }

    [Fact]
    public void Typeahead_finds_the_next_label_wrapping_and_cycling_a_repeated_letter()
    {
        var labels = new[] { "Alpha", "Beta", "Bravo", "Delta" };
        Assert.Equal(1, Typeahead.FindMatch(labels, 0, "b"));
        Assert.Equal(2, Typeahead.FindMatch(labels, 1, "b"));
        Assert.Equal(1, Typeahead.FindMatch(labels, 2, "b"));
        Assert.Equal(2, Typeahead.FindMatch(labels, 1, "br"));
        Assert.Equal(2, Typeahead.FindMatch(labels, 1, "bb"));
        Assert.Equal(-1, Typeahead.FindMatch(labels, 0, "z"));
    }

    [Fact]
    public void History_records_undoes_and_redoes_and_a_new_edit_ends_the_redo_chain()
    {
        var h = EditHistory.Empty.Record(new("r1", "c", 2, 1)).Record(new("r1", "c", 3, 2));
        var (afterUndo, undone) = h.UndoStep();
        Assert.Equal(3, undone!.Value);
        var (afterRedo, redone) = afterUndo.RedoStep();
        Assert.Equal(3, redone!.Value);
        Assert.Empty(afterRedo.Redo);
        var branched = afterUndo.Record(new("r1", "c", 9, 2));
        Assert.Empty(branched.Redo);
        Assert.Null(EditHistory.Empty.UndoStep().Record);
        Assert.Null(EditHistory.Empty.RedoStep().Record);
    }

    [Fact]
    public void History_keeps_only_the_latest_limit_steps()
    {
        var h = EditHistory.Empty;
        for (var i = 0; i < 5; i++) h = h.Record(new("r", "c", i + 1, i), limit: 3);
        Assert.Equal(new object?[] { 3, 4, 5 }, h.Undo.Select(r => r.Value));
    }

    [Theory]
    [InlineData("z", true, false, false, false, "undo")]
    [InlineData("Z", true, false, true, false, "redo")]
    [InlineData("y", true, false, false, false, "redo")]
    [InlineData("z", false, true, false, false, "undo")]
    [InlineData("y", true, false, true, false, null)]
    [InlineData("z", false, false, false, false, null)]
    [InlineData("z", true, false, false, true, null)]
    public void History_key_actions(string key, bool ctrl, bool meta, bool shift, bool alt, string? expected)
        => Assert.Equal(expected, EditHistory.KeyAction(key, ctrl, meta, shift, alt));

    private static readonly GridNavigation Nav = new(FirstRow: -1, LastRow: 20, LastCol: 5, PageStep: 10);

    [Fact]
    public void Move_arrows_clamp_and_page_keys_step()
    {
        Assert.Equal(new GridPosition(3, 2), GridMotion.Move("ArrowRight", false, new(3, 1), Nav));
        Assert.Equal(new GridPosition(3, 0), GridMotion.Move("ArrowLeft", false, new(3, 0), Nav));
        Assert.Equal(new GridPosition(13, 1), GridMotion.Move("PageDown", false, new(3, 1), Nav));
        Assert.Equal(new GridPosition(20, 1), GridMotion.Move("PageDown", false, new(15, 1), Nav));
        Assert.Equal(new GridPosition(-1, 1), GridMotion.Move("PageUp", false, new(3, 1), Nav));
        Assert.Null(GridMotion.Move("a", false, new(3, 1), Nav));
    }

    [Fact]
    public void Move_home_end_and_corners()
    {
        Assert.Equal(new GridPosition(3, 0), GridMotion.Move("Home", false, new(3, 4), Nav));
        Assert.Equal(new GridPosition(3, 5), GridMotion.Move("End", false, new(3, 4), Nav));
        Assert.Equal(new GridPosition(-1, 0), GridMotion.Move("Home", true, new(3, 4), Nav));
        Assert.Equal(new GridPosition(20, 5), GridMotion.Move("End", true, new(3, 4), Nav));
        var column = Nav with { FirstRow = 0, HomeEndMovesColumn = true };
        Assert.Equal(new GridPosition(0, 4), GridMotion.Move("Home", false, new(3, 4), column));
        Assert.Equal(new GridPosition(20, 4), GridMotion.Move("End", false, new(3, 4), column));
    }

    [Fact]
    public void Move_swaps_the_horizontal_arrows_in_right_to_left()
    {
        var rtl = Nav with { Rtl = true };
        Assert.Equal(new GridPosition(3, 2), GridMotion.Move("ArrowLeft", false, new(3, 1), rtl));
        Assert.Equal(new GridPosition(3, 0), GridMotion.Move("ArrowRight", false, new(3, 1), rtl));
        Assert.Equal(new GridPosition(4, 1), GridMotion.Move("ArrowDown", false, new(3, 1), rtl));
        Assert.Equal("ArrowRight", GridMotion.LogicalKey("ArrowLeft", true));
        Assert.Equal("ArrowLeft", GridMotion.LogicalKey("ArrowLeft", false));
    }
}
