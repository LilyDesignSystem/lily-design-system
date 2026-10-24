// OrgFormat tests: the cases of shared/org-format.test.ts, in C#.
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class OrgFormatTests
{
    private const string Today = "2026-10-24";
    private static string Selected(OrgEdit e) => e.Text[e.Start..e.End];

    // ---- dates ----

    [Theory]
    [InlineData("2026-10-24", "2026-10-24 Sat")]
    [InlineData("2026-10-25", "2026-10-25 Sun")]
    [InlineData("2024-02-29", "2024-02-29 Thu")]
    [InlineData("2000-01-01", "2000-01-01 Sat")]
    public void DayStamp_names_the_weekday(string iso, string expected) => Assert.Equal(expected, OrgFormat.DayStamp(iso));

    [Fact]
    public void LocalToday_is_the_local_calendar_date()
    {
        Assert.Equal("2026-10-24", OrgFormat.LocalToday(new DateTime(2026, 10, 24, 23, 59, 0)));
        Assert.Equal("2026-01-05", OrgFormat.LocalToday(new DateTime(2026, 1, 5)));
    }

    [Fact]
    public void A_timestamp_replaces_the_selection_and_selects_the_date()
    {
        var e = OrgFormat.InsertTimestamp("due: soon", 5, 9, Today);
        Assert.Equal("due: <2026-10-24 Sat>", e.Text);
        Assert.Equal("2026-10-24 Sat", Selected(e));
    }

    // ---- wrap and link ----

    [Theory]
    [InlineData("*", "say *hi* now")]
    [InlineData("/", "say /hi/ now")]
    [InlineData("_", "say _hi_ now")]
    [InlineData("+", "say +hi+ now")]
    [InlineData("~", "say ~hi~ now")]
    [InlineData("=", "say =hi= now")]
    public void Wrap_wraps_with_each_org_marker_and_selects_the_text(string marker, string expected)
    {
        var e = OrgFormat.ToggleWrap("say hi now", 4, 6, marker);
        Assert.Equal(expected, e.Text);
        Assert.Equal("hi", Selected(e));
    }

    [Fact]
    public void Wrap_unwraps_markers_outside_the_selection_or_inside_it()
    {
        Assert.Equal("say hi now", OrgFormat.ToggleWrap("say *hi* now", 5, 7, "*").Text);
        Assert.Equal("say hi now", OrgFormat.ToggleWrap("say *hi* now", 4, 8, "*").Text);
    }

    [Fact]
    public void Wrap_with_no_selection_inserts_a_pair_with_the_caret_between() =>
        Assert.Equal(new OrgEdit("a==b", 2, 2), OrgFormat.ToggleWrap("ab", 1, 1, "="));

    [Fact]
    public void Wrap_twice_is_the_identity()
    {
        var once = OrgFormat.ToggleWrap("hi", 0, 2, "/");
        Assert.Equal("hi", OrgFormat.ToggleWrap(once.Text, once.Start, once.End, "/").Text);
    }

    [Fact]
    public void Link_with_a_selection_and_without()
    {
        var a = OrgFormat.InsertLink("see docs here", 4, 8);
        Assert.Equal("see [[https://][docs]] here", a.Text);
        Assert.Equal("https://", Selected(a));
        var b = OrgFormat.InsertLink("ab", 1, 1);
        Assert.Equal("a[[https://]]b", b.Text);
        Assert.Equal("https://", Selected(b));
    }

    // ---- headings ----

    [Fact]
    public void Heading_puts_stars_on_every_selected_line_and_takes_them_off()
    {
        var on = OrgFormat.ToggleHeading("one\ntwo", 0, 7);
        Assert.Equal("* one\n* two", on.Text);
        Assert.Equal("one\ntwo", OrgFormat.ToggleHeading(on.Text, 0, on.Text.Length).Text);
    }

    [Fact]
    public void Heading_uses_the_level_and_replaces_a_list_prefix()
    {
        Assert.Equal("*** one", OrgFormat.ToggleHeading("one", 0, 3, 3).Text);
        Assert.Equal("* one", OrgFormat.ToggleHeading("- one", 0, 5).Text);
    }

    [Fact]
    public void Promote_and_demote_move_headings_and_leave_other_lines()
    {
        Assert.Equal("** a\n*** b\nplain", OrgFormat.ShiftHeadings("* a\n** b\nplain", 0, 14, 1).Text);
        Assert.Equal("* a\n** b", OrgFormat.ShiftHeadings("** a\n*** b", 0, 10, -1).Text);
    }

    [Fact]
    public void Promote_never_goes_below_one_star_and_shifting_nothing_changes_nothing()
    {
        Assert.Equal("* a", OrgFormat.ShiftHeadings("* a", 0, 3, -1).Text);
        Assert.Equal(new OrgEdit("plain", 0, 5), OrgFormat.ShiftHeadings("plain", 0, 5, 1));
        Assert.Equal("*bold* text", OrgFormat.ShiftHeadings("*bold* text", 0, 11, 1).Text);
    }

    // ---- lists and checkbox ----

    [Fact]
    public void Lists_prefix_lines_number_from_1_skip_blanks_and_toggle_off()
    {
        Assert.Equal("- a\n- b", OrgFormat.ToggleList("a\nb", 0, 3, "bulletList").Text);
        Assert.Equal("1. a\n\n2. b", OrgFormat.ToggleList("a\n\nb", 0, 4, "numberedList").Text);
        Assert.Equal("a\nb", OrgFormat.ToggleList("- a\n- b", 0, 7, "bulletList").Text);
    }

    [Fact]
    public void Lists_replace_a_competing_prefix()
    {
        Assert.Equal("1. a", OrgFormat.ToggleList("* a", 0, 3, "numberedList").Text);
        Assert.Equal("1. a", OrgFormat.ToggleList("- a", 0, 3, "numberedList").Text);
        Assert.Equal("a", OrgFormat.ToggleList("- [ ] a", 0, 7, "bulletList").Text);
    }

    [Fact]
    public void Checkbox_cycles_none_open_done_none()
    {
        var one = OrgFormat.CycleCheckbox("a", 0, 1);
        Assert.Equal("- [ ] a", one.Text);
        var two = OrgFormat.CycleCheckbox(one.Text, 0, one.Text.Length);
        Assert.Equal("- [X] a", two.Text);
        Assert.Equal("a", OrgFormat.CycleCheckbox(two.Text, 0, two.Text.Length).Text);
    }

    [Fact]
    public void Checkbox_applies_the_first_lines_state_to_every_line()
    {
        Assert.Equal("- [ ] a\n- [ ] b", OrgFormat.CycleCheckbox("a\nb", 0, 3).Text);
        Assert.Equal("- [X] a\n- [X] b", OrgFormat.CycleCheckbox("- [ ] a\nb", 0, 9).Text);
        Assert.Equal("- [ ] a", OrgFormat.CycleCheckbox("- a", 0, 3).Text);
        Assert.Equal(new OrgEdit("\n", 0, 0), OrgFormat.CycleCheckbox("\n", 0, 0));
    }

    // ---- blocks ----

    private static OrgEdit Quote(string t, int a, int b) => OrgFormat.ApplyTool("quote", t, a, b);

    [Fact]
    public void Quote_wraps_the_selected_lines_and_selects_what_is_inside()
    {
        var e = Quote("one\ntwo", 0, 7);
        Assert.Equal("#+BEGIN_QUOTE\none\ntwo\n#+END_QUOTE", e.Text);
        Assert.Equal("one\ntwo", Selected(e));
        Assert.Equal("a\n#+BEGIN_QUOTE\nb\n#+END_QUOTE\nc", Quote("a\nb\nc", 2, 2).Text);
    }

    [Fact]
    public void Quote_unwraps_when_the_selection_holds_the_wrapper_or_the_wrapper_is_around_it()
    {
        Assert.Equal("x", Quote("#+BEGIN_QUOTE\nx\n#+END_QUOTE", 0, 27).Text);
        Assert.Equal("x", Quote("#+BEGIN_QUOTE\nx\n#+END_QUOTE", 14, 15).Text);
        Assert.Equal("x", Quote("#+begin_quote\nx\n#+end_quote", 0, 27).Text);
    }

    [Fact]
    public void Quote_twice_is_the_identity()
    {
        var once = Quote("hello", 0, 5);
        Assert.Equal("hello", Quote(once.Text, once.Start, once.End).Text);
    }

    [Fact]
    public void A_quote_is_not_unwrapped_by_a_source_blocks_end() =>
        Assert.Equal("#+BEGIN_SRC\n#+BEGIN_QUOTE\nx\n#+END_QUOTE\n#+END_SRC", Quote("#+BEGIN_SRC\nx\n#+END_SRC", 12, 13).Text);

    [Fact]
    public void Source_block_and_drawer()
    {
        Assert.Equal("#+BEGIN_SRC\nx = 1\n#+END_SRC", OrgFormat.ApplyTool("sourceBlock", "x = 1", 0, 5).Text);
        var on = OrgFormat.ApplyTool("drawer", "note", 0, 4, new OrgOptions { DrawerName = "NOTES" });
        Assert.Equal(":NOTES:\nnote\n:END:", on.Text);
        Assert.Equal("note", OrgFormat.ApplyTool("drawer", on.Text, 0, on.Text.Length).Text);
        Assert.Equal(":LOGBOOK:\nx\n:END:", OrgFormat.ApplyTool("drawer", "x", 0, 1).Text);
    }

    // ---- todo and priority ----

    [Fact]
    public void Todo_cycles_none_TODO_DONE_none()
    {
        var a = OrgFormat.CycleTodo("* Task", 0, 0);
        Assert.Equal("* TODO Task", a.Text);
        var b = OrgFormat.CycleTodo(a.Text, 0, 0);
        Assert.Equal("* DONE Task", b.Text);
        Assert.Equal("* Task", OrgFormat.CycleTodo(b.Text, 0, 0).Text);
    }

    [Fact]
    public void Todo_turns_plain_and_list_lines_into_headings_and_keeps_level_priority_title()
    {
        Assert.Equal("* TODO Buy milk", OrgFormat.CycleTodo("Buy milk", 3, 3).Text);
        Assert.Equal("* TODO Buy milk", OrgFormat.CycleTodo("- Buy milk", 0, 0).Text);
        Assert.Equal("*** TODO [#A] Ship", OrgFormat.CycleTodo("*** [#A] Ship", 0, 0).Text);
        Assert.Equal("** TODO x", OrgFormat.CycleTodo("x", 0, 0, new[] { "TODO" }, 2).Text);
    }

    [Fact]
    public void Todo_acts_on_the_caret_line_with_custom_keywords_and_exact_matches()
    {
        Assert.Equal("* a\n* TODO b\n* c", OrgFormat.CycleTodo("* a\n* b\n* c", 4, 4).Text);
        var kw = new[] { "NEXT", "WAIT", "DONE" };
        Assert.Equal("* NEXT t", OrgFormat.CycleTodo("* t", 0, 0, kw).Text);
        Assert.Equal("* WAIT t", OrgFormat.CycleTodo("* NEXT t", 0, 0, kw).Text);
        Assert.Equal("* t", OrgFormat.CycleTodo("* DONE t", 0, 0, kw).Text);
        Assert.Equal("* TODO TODOS", OrgFormat.CycleTodo("* TODOS", 0, 0).Text);
    }

    [Fact]
    public void Todo_keeps_the_caret_on_the_same_text()
    {
        var e = OrgFormat.CycleTodo("* Task", 4, 4);
        Assert.Equal("sk", e.Text[e.Start..]);
    }

    [Fact]
    public void Priority_cycles_none_A_B_C_none_and_goes_after_the_keyword()
    {
        var a = OrgFormat.CyclePriority("* Task", 0, 0);
        Assert.Equal("* [#A] Task", a.Text);
        var b = OrgFormat.CyclePriority(a.Text, 0, 0);
        Assert.Equal("* [#B] Task", b.Text);
        var c = OrgFormat.CyclePriority(b.Text, 0, 0);
        Assert.Equal("* [#C] Task", c.Text);
        Assert.Equal("* Task", OrgFormat.CyclePriority(c.Text, 0, 0).Text);
        Assert.Equal("* TODO [#A] Task", OrgFormat.CyclePriority("* TODO Task", 0, 0).Text);
        Assert.Equal("* [#A] Task", OrgFormat.CyclePriority("Task", 0, 0).Text);
        Assert.Equal("* [#1] t", OrgFormat.CyclePriority("* t", 0, 0, new[] { "1", "2" }).Text);
    }

    // ---- planning ----

    [Fact]
    public void Planning_adds_a_line_under_the_heading_with_the_date_selected()
    {
        var e = OrgFormat.TogglePlanning("* Task\nbody", 0, 0, "SCHEDULED", Today);
        Assert.Equal("* Task\nSCHEDULED: <2026-10-24 Sat>\nbody", e.Text);
        Assert.Equal("2026-10-24 Sat", Selected(e));
        Assert.Equal("* Task\nDEADLINE: <2026-10-24 Sat>\nbody\nmore", OrgFormat.TogglePlanning("* Task\nbody\nmore", 12, 12, "DEADLINE", Today).Text);
    }

    [Fact]
    public void Planning_puts_the_second_keyword_on_the_same_line_and_removes_each_again()
    {
        var one = OrgFormat.TogglePlanning("* Task", 0, 0, "DEADLINE", Today);
        var two = OrgFormat.TogglePlanning(one.Text, 0, 0, "SCHEDULED", "2026-10-25");
        Assert.Equal("* Task\nDEADLINE: <2026-10-24 Sat> SCHEDULED: <2026-10-25 Sun>", two.Text);
        Assert.Equal("2026-10-25 Sun", Selected(two));
        Assert.Equal("* Task\nDEADLINE: <2026-10-24 Sat>", OrgFormat.TogglePlanning(two.Text, 0, 0, "SCHEDULED", Today).Text);
        var s = OrgFormat.TogglePlanning("* Task\nbody", 0, 0, "SCHEDULED", Today);
        Assert.Equal("* Task\nbody", OrgFormat.TogglePlanning(s.Text, 0, 0, "SCHEDULED", Today).Text);
    }

    [Fact]
    public void Planning_does_nothing_without_a_heading_works_on_the_last_line_and_uses_the_nearest_heading()
    {
        Assert.Equal(new OrgEdit("plain", 0, 0), OrgFormat.TogglePlanning("plain", 0, 0, "SCHEDULED", Today));
        Assert.Equal("* Task\nDEADLINE: <2026-10-24 Sat>", OrgFormat.TogglePlanning("* Task", 3, 3, "DEADLINE", Today).Text);
        Assert.Equal("* A\n** B\nSCHEDULED: <2026-10-24 Sat>\ntext", OrgFormat.TogglePlanning("* A\n** B\ntext", 11, 11, "SCHEDULED", Today).Text);
    }

    // ---- properties and contacts ----

    [Fact]
    public void Property_creates_the_drawer_under_the_heading_after_the_planning_line()
    {
        var e = OrgFormat.AddProperty("* Task\nbody", 0, 0);
        Assert.Equal("* Task\n:PROPERTIES:\n:ID: \n:END:\nbody", e.Text);
        Assert.EndsWith(":ID: ", e.Text[..e.Start]);
        Assert.Equal(e.Start, e.End);
        Assert.Equal("* Task\nSCHEDULED: <2026-10-24 Sat>\n:PROPERTIES:\n:CUSTOM_ID: \n:END:\nbody",
            OrgFormat.AddProperty("* Task\nSCHEDULED: <2026-10-24 Sat>\nbody", 0, 0, "CUSTOM_ID").Text);
    }

    [Fact]
    public void Property_adds_to_an_existing_drawer_without_repeating_a_key()
    {
        Assert.Equal("* Task\n:PROPERTIES:\n:A: 1\n:B: \n:END:\nbody", OrgFormat.AddProperty("* Task\n:PROPERTIES:\n:A: 1\n:END:\nbody", 0, 0, "B").Text);
        var t = "* Task\n:PROPERTIES:\n:ID: 42\n:END:";
        var e = OrgFormat.AddProperty(t, 0, 0);
        Assert.Equal(t, e.Text);
        Assert.EndsWith(":ID: 42", t[..e.Start]);
    }

    [Fact]
    public void Property_with_no_heading_goes_at_the_top_of_the_file() =>
        Assert.Equal(":PROPERTIES:\n:ID: \n:END:\nplain", OrgFormat.AddProperty("plain", 0, 0).Text);

    [Fact]
    public void Contact_makes_a_heading_with_the_drawer_and_the_selection_as_the_name()
    {
        var e = OrgFormat.InsertContact("Ada Lovelace", 0, 12);
        Assert.Equal("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:", e.Text);
        Assert.EndsWith(":EMAIL: ", e.Text[..e.Start]);
    }

    [Fact]
    public void Contact_is_one_level_under_the_heading_above_and_starts_on_its_own_line()
    {
        Assert.StartsWith("* People\n** \n:PROPERTIES:", OrgFormat.InsertContact("* People\n", 9, 9).Text);
        Assert.Equal("ab\n* X\n:PROPERTIES:\n:EMAIL: \n:END:cd", OrgFormat.InsertContact("abXcd", 2, 3, new[] { "EMAIL" }).Text);
    }

    [Fact]
    public void Contact_properties_are_an_option()
    {
        Assert.Equal("* \n:PROPERTIES:\n:NICKNAME: \n:END:", OrgFormat.InsertContact("", 0, 0, new[] { "NICKNAME" }).Text);
        Assert.Equal("* A\n:PROPERTIES:\n:END:", OrgFormat.InsertContact("A", 0, 1, Array.Empty<string>()).Text);
    }

    // ---- dispatch ----

    [Fact]
    public void Every_tool_has_a_group_and_runs_on_empty_and_small_documents()
    {
        Assert.Equal(OrgFormat.ToolIds.Count, OrgFormat.ToolGroups.Count);
        var doc = "* Task\nSCHEDULED: <2026-10-24 Sat>\n:PROPERTIES:\n:ID: 1\n:END:\nbody text\n";
        foreach (var id in OrgFormat.ToolIds)
        {
            Assert.Contains(OrgFormat.ToolGroups[id], new[] { "structure", "task", "text", "data" });
            OrgFormat.ApplyTool(id, "", 0, 0, new OrgOptions { Today = Today });
            var e = OrgFormat.ApplyTool(id, doc, 40, 44, new OrgOptions { Today = Today });
            Assert.InRange(e.Start, 0, e.End);
            Assert.True(e.End <= e.Text.Length);
        }
    }

    [Fact]
    public void ApplyTool_passes_options_through()
    {
        Assert.Equal("** a", OrgFormat.ApplyTool("heading", "a", 0, 1, new OrgOptions { HeadingLevel = 2 }).Text);
        Assert.Equal("* NEXT a", OrgFormat.ApplyTool("todo", "* a", 0, 0, new OrgOptions { TodoKeywords = new[] { "NEXT" } }).Text);
        Assert.Equal("<2026-01-01 Thu>", OrgFormat.ApplyTool("timestamp", "", 0, 0, new OrgOptions { Today = "2026-01-01" }).Text);
    }
}
