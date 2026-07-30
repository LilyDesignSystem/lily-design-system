// DateTimePicker tests — one [Fact] (or [Theory]) per spec/index.md §7
// acceptance criterion. Clause numbers match the canonical Svelte suite's,
// so the two files can be read side by side.
//
// Two harness notes:
//
// 1. "Today" is deterministic via DateTimePicker.NowProvider, an internal
//    seam (visible here via InternalsVisibleTo) that plays the same role
//    vi.useFakeTimers() plays in the canonical Svelte suite. It is set in
//    the constructor and restored in Dispose so it never leaks between
//    tests.
//
// 2. Most assertions read rendered markup directly (tabindex, data-*,
//    aria-*) rather than real DOM focus — mirroring how the Svelte suite's
//    own cursorDate() helper works, by reading the tabbable day's
//    data-date rather than document.activeElement. bUnit has no live focus
//    model in the first place; JSInterop.Mode = Loose lets the
//    ElementReference.FocusAsync() calls (and the eval-based focus-trap
//    install) resolve harmlessly with no explicit setup.

using System;
using System.Linq;
using System.Threading.Tasks;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class DateTimePickerTests : TestContext, IDisposable
{
    /// <summary>A fixed "today": 2026-03-15, a Sunday.</summary>
    private static readonly DateTime Today = new(2026, 3, 15, 10, 30, 0);

    /// <summary>
    /// The six required strings. Deliberately not English-looking
    /// placeholders: every assertion that reads a label reads it from
    /// here, so a future hardcoded default sneaking back into the
    /// component would fail rather than blend in.
    /// </summary>
    private static readonly DateTimePickerLabels Labels = new()
    {
        PreviousYear = "PrevYear",
        PreviousMonth = "PrevMonth",
        NextMonth = "NextMonth",
        NextYear = "NextYear",
        Confirm = "Commit",
        Cancel = "Dismiss",
    };

    private static readonly DateTimePickerLabels TimeLabels = Labels with
    {
        Hour = "Hr",
        Minute = "Min",
        Meridiem = "Half",
    };

    public DateTimePickerTests()
    {
        DateTimePicker.NowProvider = () => Today;
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    public new void Dispose()
    {
        DateTimePicker.NowProvider = () => DateTime.Now;
        base.Dispose();
    }

    // =================================================================
    // Harness.
    // =================================================================

    private IRenderedComponent<DateTimePicker> Render(
        Action<ComponentParameterCollectionBuilder<DateTimePicker>>? extra = null,
        string locale = "en-GB",
        string label = "Pick a date",
        DateTimePickerLabels? labels = null)
        => RenderComponent<DateTimePicker>(p =>
        {
            p.Add(x => x.Label, label)
             .Add(x => x.Labels, labels ?? Labels)
             .Add(x => x.Locale, locale);
            extra?.Invoke(p);
        });

    private static async Task OpenAsync(IRenderedComponent<DateTimePicker> cut)
    {
        await cut.Find("button.date-time-picker-button").ClickAsync(new MouseEventArgs());
    }

    private static IElement Root(IRenderedComponent<DateTimePicker> cut)
        => cut.Find("div.date-time-picker");

    private static IElement Trigger(IRenderedComponent<DateTimePicker> cut)
        => cut.Find("button.date-time-picker-button");

    private static IElement Dialog(IRenderedComponent<DateTimePicker> cut)
        => cut.Find("div.date-time-picker-dialog");

    private static IElement Field(IRenderedComponent<DateTimePicker> cut)
        => cut.Find("input.date-time-picker-input");

    private static IElement Hidden(IRenderedComponent<DateTimePicker> cut)
        => cut.Find("input[type='hidden']");

    private static System.Collections.Generic.IReadOnlyList<IElement> Days(IRenderedComponent<DateTimePicker> cut)
        => cut.FindAll("button.date-time-picker-day").ToList();

    private static IElement Day(IRenderedComponent<DateTimePicker> cut, string iso)
        => cut.Find($"[data-date='{iso}']");

    private static string CursorDate(IRenderedComponent<DateTimePicker> cut)
        => Days(cut).FirstOrDefault(d => d.GetAttribute("tabindex") == "0")?.GetAttribute("data-date") ?? "";

    /// <summary>The interop identifier ElementReference.FocusAsync() uses.</summary>
    private const string FocusIdentifier = "Blazor._internal.domWrapper.focus";

    /// <summary>
    /// The ElementReference ids the component asked the browser to focus,
    /// oldest first. bUnit has no live focus model, but real focus moves
    /// ARE observable: FocusAsync() goes out over JS interop carrying the
    /// ElementReference of its target — the same technique
    /// SharePickerTests.cs uses. SharePicker maps ids to elements via the
    /// blazor:elementReference GUIDs bUnit stamps into the FIRST render's
    /// markup; this component re-renders immediately (today is seeded in
    /// OnAfterRenderAsync), which strips those GUIDs from the markup — so
    /// the ids are read from the component's own internal seams
    /// (FieldReferenceId / TriggerReferenceId / DayReferenceId, via
    /// InternalsVisibleTo) instead.
    /// </summary>
    private System.Collections.Generic.IReadOnlyList<string> FocusedRefIds()
        => JSInterop.Invocations
            .Where(i => i.Identifier == FocusIdentifier)
            .Select(i => ((ElementReference)i.Arguments[0]!).Id)
            .ToList();

    // =================================================================
    // §7.1–§7.9 — pure arithmetic.
    // =================================================================

    [Fact]
    public void Section_7_1_ParseIsoDate_Rejects_Impossible_Dates_And_Accepts_Real_Ones()
    {
        Assert.Null(DateTimePicker.ParseIsoDate("2026-02-31"));
        Assert.Null(DateTimePicker.ParseIsoDate("2026-13-01"));
        Assert.Null(DateTimePicker.ParseIsoDate("2026-00-10"));
        Assert.Null(DateTimePicker.ParseIsoDate("nonsense"));
        Assert.Equal(new CivilDate(2026, 2, 28), DateTimePicker.ParseIsoDate("2026-02-28"));
    }

    [Fact]
    public void Section_7_1_DaysInMonth_Handles_Leap_Years()
    {
        Assert.Equal(29, DateTimePicker.DaysInMonth(2024, 2));
        Assert.Equal(28, DateTimePicker.DaysInMonth(2026, 2));
        // 2100 is divisible by 100 but not 400, so it is not a leap year.
        Assert.Equal(28, DateTimePicker.DaysInMonth(2100, 2));
        Assert.Equal(29, DateTimePicker.DaysInMonth(2000, 2));
    }

    [Fact]
    public void Section_7_2_AddDays_Crosses_Month_And_Year_Boundaries_Both_Ways()
    {
        Assert.Equal("2026-02-01", DateTimePicker.AddDays("2026-01-31", 1));
        Assert.Equal("2026-02-28", DateTimePicker.AddDays("2026-03-01", -1));
        Assert.Equal("2027-01-01", DateTimePicker.AddDays("2026-12-31", 1));
        Assert.Equal("2025-12-31", DateTimePicker.AddDays("2026-01-01", -1));
        Assert.Equal("2024-02-29", DateTimePicker.AddDays("2024-02-28", 1));
    }

    [Fact]
    public void Section_7_2_AddMonths_Clamps_The_Day_Rather_Than_Rolling_Over()
    {
        Assert.Equal("2026-02-28", DateTimePicker.AddMonths("2026-01-31", 1));
        Assert.Equal("2024-02-29", DateTimePicker.AddMonths("2024-01-31", 1));
        Assert.Equal("2026-02-28", DateTimePicker.AddMonths("2026-03-31", -1));
        Assert.Equal("2026-02-15", DateTimePicker.AddMonths("2026-01-15", 1));
    }

    [Fact]
    public void Section_7_2_AddMonths_With_A_Negative_Delta_Crosses_The_Year_Boundary()
    {
        Assert.Equal("2025-12-15", DateTimePicker.AddMonths("2026-01-15", -1));
        Assert.Equal("2024-12-15", DateTimePicker.AddMonths("2026-01-15", -13));
        Assert.Equal("2027-06-15", DateTimePicker.AddMonths("2026-06-15", 12));
    }

    [Fact]
    public void Section_7_3_WeekdayOf_Returns_0_For_Sunday()
    {
        Assert.Equal(0, DateTimePicker.WeekdayOf("2026-03-15")); // Sunday
        Assert.Equal(1, DateTimePicker.WeekdayOf("2026-03-16")); // Monday
        Assert.Equal(6, DateTimePicker.WeekdayOf("2026-03-21")); // Saturday
    }

    [Fact]
    public void Section_7_3_IsoWeek_Matches_Iso8601_On_The_Hard_Cases()
    {
        // 2026-01-01 is a Thursday, so it is in week 1.
        Assert.Equal(1, DateTimePicker.IsoWeek("2026-01-01"));
        // 2021-01-03 is a Sunday belonging to week 53 of 2020.
        Assert.Equal(53, DateTimePicker.IsoWeek("2021-01-03"));
        // 2024-12-30 is a Monday belonging to week 1 of 2025.
        Assert.Equal(1, DateTimePicker.IsoWeek("2024-12-30"));
    }

    [Fact]
    public void Section_7_4_ToEpochDay_And_FromEpochDay_Round_Trip()
    {
        var date = new CivilDate(2026, 3, 15);
        Assert.Equal(date, DateTimePicker.FromEpochDay(DateTimePicker.ToEpochDay(date)));
        Assert.Equal(0, DateTimePicker.ToEpochDay(new CivilDate(1970, 1, 1)));
    }

    [Fact]
    public void Section_7_5_SplitValue_And_JoinValue_Round_Trip_Per_Mode()
    {
        Assert.Equal(("2026-03-15", ""), DateTimePicker.SplitValue("2026-03-15", DateTimeMode.Date));
        Assert.Equal(("", "09:30"), DateTimePicker.SplitValue("09:30", DateTimeMode.Time));
        Assert.Equal(("2026-03-15", "09:30"), DateTimePicker.SplitValue("2026-03-15T09:30", DateTimeMode.DateTime));
        Assert.Equal("2026-03-15T09:30", DateTimePicker.JoinValue("2026-03-15", "09:30", DateTimeMode.DateTime));
    }

    [Fact]
    public void Section_7_5_JoinValue_Refuses_A_Half_Datetime()
    {
        Assert.Equal("", DateTimePicker.JoinValue("2026-03-15", "", DateTimeMode.DateTime));
        Assert.Equal("", DateTimePicker.JoinValue("", "09:30", DateTimeMode.DateTime));
    }

    [Fact]
    public void Section_7_6_MonthMatrix_Is_Always_6x7_And_Starts_On_FirstDayOfWeek()
    {
        var mondayFirst = DateTimePicker.MonthMatrix(2026, 3, 1);
        Assert.Equal(6, mondayFirst.Length);
        Assert.All(mondayFirst, week => Assert.Equal(7, week.Length));
        Assert.Equal(1, DateTimePicker.WeekdayOf(mondayFirst[0][0]));

        var sundayFirst = DateTimePicker.MonthMatrix(2026, 3, 0);
        Assert.Equal(0, DateTimePicker.WeekdayOf(sundayFirst[0][0]));
        // February 2026 starts on a Sunday and has 28 days — the month that
        // most tempts a variable-height grid into 4 rows.
        Assert.Equal(6, DateTimePicker.MonthMatrix(2026, 2, 0).Length);
    }

    [Fact]
    public void Section_7_7_FirstDayOfWeekFor_Follows_The_Locale_Defaulting_To_Monday()
    {
        Assert.Equal(1, DateTimePicker.FirstDayOfWeekFor("en-GB"));
        Assert.Equal(0, DateTimePicker.FirstDayOfWeekFor("en-US"));
        Assert.Equal(1, DateTimePicker.FirstDayOfWeekFor("cy-GB"));
        // An unknown region falls through to the Monday default.
        Assert.Equal(1, DateTimePicker.FirstDayOfWeekFor("xx-ZZ"));
        Assert.Equal(1, DateTimePicker.FirstDayOfWeekFor(null));
    }

    [Fact]
    public void Section_7_8_ParseDateInput_Reads_Iso_Locale_Numerics_And_Written_Months()
    {
        Assert.Equal("2026-03-15", DateTimePicker.ParseDateInput("2026-03-15", "en-GB"));
        // The same digits mean different days in the two locales, and that
        // is the entire point of deriving the order from the culture.
        Assert.Equal("2026-04-03", DateTimePicker.ParseDateInput("03/04/2026", "en-GB"));
        Assert.Equal("2026-03-04", DateTimePicker.ParseDateInput("03/04/2026", "en-US"));
        // DHCW's own output format has to round-trip.
        Assert.Equal("2025-06-27", DateTimePicker.ParseDateInput("27-Jun-2025", "en-GB"));
        Assert.Equal("2025-06-27", DateTimePicker.ParseDateInput("27 June 2025", "en-GB"));
        Assert.Equal("2025-09-05", DateTimePicker.ParseDateInput("Sept 5 2025", "en-US"));
    }

    [Fact]
    public void Section_7_8_ParseDateInput_Returns_Null_For_Junk_And_Impossible_Dates()
    {
        Assert.Null(DateTimePicker.ParseDateInput("", "en-GB"));
        Assert.Null(DateTimePicker.ParseDateInput("not a date", "en-GB"));
        Assert.Null(DateTimePicker.ParseDateInput("31/02/2026", "en-GB"));
        Assert.Null(DateTimePicker.ParseDateInput("15/13/2026", "en-GB"));
        Assert.Null(DateTimePicker.ParseDateInput("2026", "en-GB"));
    }

    [Fact]
    public void Section_7_9_ParseTimeInput_Reads_The_Common_Forms_And_Rejects_Bad_Ones()
    {
        Assert.Equal("09:30", DateTimePicker.ParseTimeInput("9:30"));
        Assert.Equal("09:30", DateTimePicker.ParseTimeInput("09:30"));
        Assert.Equal("09:30", DateTimePicker.ParseTimeInput("0930"));
        Assert.Equal("09:30", DateTimePicker.ParseTimeInput("9.30"));
        Assert.Equal("13:30", DateTimePicker.ParseTimeInput("1:30pm"));
        Assert.Equal("00:15", DateTimePicker.ParseTimeInput("12:15am"));
        Assert.Null(DateTimePicker.ParseTimeInput("25:00"));
        Assert.Null(DateTimePicker.ParseTimeInput("09:75"));
        Assert.Null(DateTimePicker.ParseTimeInput("half nine"));
    }

    // =================================================================
    // §7.10–§7.17 — markup contract.
    // =================================================================

    [Fact]
    public void Section_7_10_Trigger_Wires_AriaHaspopup_AriaExpanded_And_AriaControls()
    {
        var cut = Render();
        var button = Trigger(cut);
        Assert.Equal("dialog", button.GetAttribute("aria-haspopup"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        var dialog = Dialog(cut);
        Assert.Equal(button.GetAttribute("aria-controls"), dialog.GetAttribute("id"));
        Assert.Equal("dialog", dialog.GetAttribute("role"));
        Assert.Equal("true", dialog.GetAttribute("aria-modal"));
    }

    [Fact]
    public void Section_7_10_The_Glyph_Is_Rendered_And_Hidden_From_Assistive_Technology()
    {
        var cut = Render();
        var icon = cut.Find(".date-time-picker-icon");
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
        // U+1F4C5 CALENDAR, with the text-presentation selector.
        Assert.Equal("\U0001F4C5\uFE0E", icon.TextContent);
        Assert.Equal("\U0001F4C5\uFE0E", DateTimePicker.Calendar);
    }

    [Fact]
    public void Section_7_11_AriaLabel_Names_Both_The_Trigger_And_The_Dialog()
    {
        var cut = Render(label: "Appointment date");
        Assert.Equal("Appointment date", Trigger(cut).GetAttribute("aria-label"));
        Assert.Equal("Appointment date", Dialog(cut).GetAttribute("aria-label"));
    }

    [Fact]
    public void Section_7_12_The_Hidden_Input_Carries_The_Iso_Value_The_Field_The_Display()
    {
        var cut = Render(p => p.Add(x => x.Name, "appointment").Add(x => x.Value, "2026-03-15"));
        Assert.Equal("appointment", Hidden(cut).GetAttribute("name"));
        Assert.Equal("2026-03-15", Hidden(cut).GetAttribute("value"));
        // The visible field is localised and, critically, has no `name`:
        // posting a display string next to the ISO value is how a backend
        // ends up guessing.
        Assert.Contains("2026", Field(cut).GetAttribute("value"));
        Assert.False(Field(cut).HasAttribute("name"));
    }

    [Fact]
    public async Task Section_7_13_The_Dialog_Is_Hidden_Until_The_Trigger_Is_Activated()
    {
        var cut = Render();
        Assert.True(Dialog(cut).HasAttribute("hidden"));
        await OpenAsync(cut);
        Assert.False(Dialog(cut).HasAttribute("hidden"));
        Assert.Equal("true", Trigger(cut).GetAttribute("aria-expanded"));
    }

    [Fact]
    public async Task Section_7_14_The_Grid_Is_6x7_With_DataOutside_On_Adjacent_Month_Days()
    {
        var cut = Render(p => p.Add(x => x.Value, "2026-03-15"));
        await OpenAsync(cut);
        Assert.Equal(6, cut.FindAll("tbody tr").Count());
        Assert.Equal(42, Days(cut).Count);
        // March 2026 starts on a Sunday; with a Monday-first grid the six
        // preceding days come from February.
        Assert.True(Day(cut, "2026-02-23").HasAttribute("data-outside"));
        Assert.False(Day(cut, "2026-03-15").HasAttribute("data-outside"));
    }

    [Fact]
    public async Task Section_7_15_Exactly_One_Day_Is_Tabbable()
    {
        var cut = Render(p => p.Add(x => x.Value, "2026-03-15"));
        await OpenAsync(cut);
        var tabbable = Days(cut).Where(d => d.GetAttribute("tabindex") == "0").ToList();
        Assert.Single(tabbable);
        Assert.Equal("2026-03-15", tabbable[0].GetAttribute("data-date"));
    }

    [Fact]
    public void Section_7_16_Rest_Props_Spread_Onto_The_Root_And_DataMode_Reflects_Mode()
    {
        var cut = Render(p => p
            .Add(x => x.Mode, DateTimeMode.DateTime)
            .AddUnmatched("data-testid", "dtp"), labels: TimeLabels);
        Assert.Equal("dtp", Root(cut).GetAttribute("data-testid"));
        Assert.Equal("datetime", Root(cut).GetAttribute("data-mode"));
    }

    [Fact]
    public async Task Section_7_17_Today_Carries_DataToday_And_AriaCurrent()
    {
        var cut = Render();
        await OpenAsync(cut);
        var todayCell = Day(cut, "2026-03-15");
        Assert.True(todayCell.HasAttribute("data-today"));
        Assert.Equal("date", todayCell.GetAttribute("aria-current"));
    }

    // =================================================================
    // §7.18–§7.23 — commit and discard.
    // =================================================================

    [Fact]
    public async Task Section_7_18_Clicking_A_Day_In_Date_Mode_Commits_Notifies_And_Closes()
    {
        string? changed = null;
        var cut = Render(p => p.Add(x => x.Value, "2026-03-15").Add(x => x.OnChange, v => changed = v));
        await OpenAsync(cut);
        await Day(cut, "2026-03-20").ClickAsync(new MouseEventArgs());
        Assert.Equal("2026-03-20", changed);
        Assert.Equal("2026-03-20", Hidden(cut).GetAttribute("value"));
        Assert.True(Dialog(cut).HasAttribute("hidden"));
    }

    [Fact]
    public async Task Section_7_19_With_ConfirmOnSelect_False_Only_Confirm_Commits()
    {
        string? changed = null;
        var cut = Render(p => p
            .Add(x => x.Value, "2026-03-15")
            .Add(x => x.ConfirmOnSelect, false)
            .Add(x => x.OnChange, v => changed = v));
        await OpenAsync(cut);
        await Day(cut, "2026-03-20").ClickAsync(new MouseEventArgs());
        Assert.Null(changed);
        Assert.Equal("2026-03-15", Hidden(cut).GetAttribute("value"));

        await cut.Find("button.date-time-picker-confirm").ClickAsync(new MouseEventArgs());
        Assert.Equal("2026-03-20", changed);
        Assert.Equal("2026-03-20", Hidden(cut).GetAttribute("value"));
    }

    [Fact]
    public async Task Section_7_20_Cancel_Closes_Without_Changing_The_Value()
    {
        string? changed = null;
        var cut = Render(p => p
            .Add(x => x.Value, "2026-03-15")
            .Add(x => x.ConfirmOnSelect, false)
            .Add(x => x.OnChange, v => changed = v));
        await OpenAsync(cut);
        await Day(cut, "2026-03-20").ClickAsync(new MouseEventArgs());
        await cut.Find("button.date-time-picker-cancel").ClickAsync(new MouseEventArgs());
        Assert.Null(changed);
        Assert.Equal("2026-03-15", Hidden(cut).GetAttribute("value"));
        Assert.True(Dialog(cut).HasAttribute("hidden"));
    }

    [Fact]
    public async Task Section_7_21_Escape_Closes_Without_Changing_The_Value()
    {
        string? changed = null;
        var cut = Render(p => p
            .Add(x => x.Value, "2026-03-15")
            .Add(x => x.ConfirmOnSelect, false)
            .Add(x => x.OnChange, v => changed = v));
        await OpenAsync(cut);
        await Day(cut, "2026-03-20").ClickAsync(new MouseEventArgs());
        await Dialog(cut).KeyDownAsync(new KeyboardEventArgs { Key = "Escape" });
        Assert.Null(changed);
        Assert.Equal("2026-03-15", Hidden(cut).GetAttribute("value"));
        Assert.True(Dialog(cut).HasAttribute("hidden"));
    }

    [Fact]
    public async Task Section_7_22_The_Clear_Button_Renders_Only_When_Labelled_And_Commits_Empty()
    {
        string? changed = null;
        var without = Render(p => p.Add(x => x.Value, "2026-03-15").Add(x => x.OnChange, v => changed = v));
        await OpenAsync(without);
        Assert.Empty(without.FindAll(".date-time-picker-clear"));

        var withClear = Render(p => p
            .Add(x => x.Value, "2026-03-15")
            .Add(x => x.OnChange, v => changed = v), labels: Labels with { Clear = "Wipe" });
        await OpenAsync(withClear);
        await withClear.Find("button.date-time-picker-clear").ClickAsync(new MouseEventArgs());
        Assert.Equal("", changed);
        Assert.Equal("", Hidden(withClear).GetAttribute("value"));
    }

    [Fact]
    public async Task Section_7_23_OnChange_Does_Not_Fire_When_The_Value_Is_Unchanged()
    {
        var fired = false;
        var cut = Render(p => p.Add(x => x.Value, "2026-03-15").Add(x => x.OnChange, _ => fired = true));
        await OpenAsync(cut);
        await Day(cut, "2026-03-15").ClickAsync(new MouseEventArgs());
        Assert.False(fired);
    }

    // =================================================================
    // §7.24–§7.28 — keyboard.
    // =================================================================

    private async Task<IRenderedComponent<DateTimePicker>> OpenAtAsync(
        string iso = "2026-03-15",
        Action<ComponentParameterCollectionBuilder<DateTimePicker>>? extra = null,
        string locale = "en-GB")
    {
        var cut = Render(p =>
        {
            p.Add(x => x.Value, iso);
            extra?.Invoke(p);
        }, locale);
        await OpenAsync(cut);
        return cut;
    }

    [Fact]
    public async Task Section_7_24_Arrows_Move_The_Cursor_By_A_Day_And_By_A_Week()
    {
        var cut = await OpenAtAsync();
        var grid = cut.Find("table.date-time-picker-calendar");
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal("2026-03-16", CursorDate(cut));
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "ArrowLeft" });
        Assert.Equal("2026-03-15", CursorDate(cut));
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Equal("2026-03-22", CursorDate(cut));
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "ArrowUp" });
        Assert.Equal("2026-03-15", CursorDate(cut));
    }

    [Fact]
    public async Task Section_7_25_Home_And_End_Reach_The_Ends_Of_The_Week_Per_FirstDayOfWeek()
    {
        // 2026-03-18 is a Wednesday. Monday-first: Home -> 16th, End -> 22nd.
        var cut = await OpenAtAsync("2026-03-18");
        var grid = cut.Find("table.date-time-picker-calendar");
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "Home" });
        Assert.Equal("2026-03-16", CursorDate(cut));
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "End" });
        Assert.Equal("2026-03-22", CursorDate(cut));
    }

    [Fact]
    public async Task Section_7_25_Home_Respects_A_Sunday_First_Week()
    {
        var cut = await OpenAtAsync("2026-03-18", locale: "en-US");
        var grid = cut.Find("table.date-time-picker-calendar");
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "Home" });
        Assert.Equal("2026-03-15", CursorDate(cut));
    }

    [Fact]
    public async Task Section_7_26_PageUp_And_PageDown_Page_The_Month_Shift_Pages_The_Year()
    {
        var cut = await OpenAtAsync();
        var grid = cut.Find("table.date-time-picker-calendar");
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "PageDown" });
        Assert.Equal("2026-04-15", CursorDate(cut));
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "PageUp" });
        Assert.Equal("2026-03-15", CursorDate(cut));
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "PageDown", ShiftKey = true });
        Assert.Equal("2027-03-15", CursorDate(cut));
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "PageUp", ShiftKey = true });
        Assert.Equal("2026-03-15", CursorDate(cut));
    }

    [Fact]
    public async Task Section_7_26_Paging_Into_A_Shorter_Month_Clamps_The_Cursor_Day()
    {
        var cut = await OpenAtAsync("2026-01-31");
        var grid = cut.Find("table.date-time-picker-calendar");
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "PageDown" });
        Assert.Equal("2026-02-28", CursorDate(cut));
    }

    [Fact]
    public async Task Section_7_27_Enter_On_The_Grid_Selects_The_Cursors_Day()
    {
        string? changed = null;
        var cut = await OpenAtAsync("2026-03-15", p => p.Add(x => x.OnChange, v => changed = v));
        var grid = cut.Find("table.date-time-picker-calendar");
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "ArrowRight" });
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("2026-03-16", changed);
    }

    [Fact]
    public async Task Section_7_28_AltArrowDown_On_The_Field_Opens_The_Dialog()
    {
        var cut = Render();
        Assert.True(Dialog(cut).HasAttribute("hidden"));
        await Field(cut).KeyDownAsync(new KeyboardEventArgs { Key = "ArrowDown", AltKey = true });
        Assert.False(Dialog(cut).HasAttribute("hidden"));
    }

    // =================================================================
    // §7.29–§7.33 — constraints and shortcuts.
    // =================================================================

    [Fact]
    public async Task Section_7_29_Days_Outside_MinMax_Are_AriaDisabled_Not_Disabled()
    {
        var cut = await OpenAtAsync("2026-03-15", p => p
            .Add(x => x.Min, "2026-03-10")
            .Add(x => x.Max, "2026-03-20"));
        Assert.Equal("true", Day(cut, "2026-03-09").GetAttribute("aria-disabled"));
        Assert.False(Day(cut, "2026-03-10").HasAttribute("aria-disabled"));
        Assert.False(Day(cut, "2026-03-20").HasAttribute("aria-disabled"));
        Assert.Equal("true", Day(cut, "2026-03-21").GetAttribute("aria-disabled"));
        // aria-disabled, not the `disabled` attribute: a vetoed day must
        // stay focusable so the roving cursor can land on it and a screen
        // reader can announce it as unavailable.
        Assert.False(((IHtmlButtonElement)Day(cut, "2026-03-09")).IsDisabled);
        Assert.False(Day(cut, "2026-03-09").HasAttribute("disabled"));
        // And the consumer's CSS hook rides along.
        Assert.True(Day(cut, "2026-03-09").HasAttribute("data-disabled"));
        Assert.False(Day(cut, "2026-03-10").HasAttribute("data-disabled"));
    }

    [Fact]
    public async Task Section_7_30_IsDateDisabled_Marks_Individual_Days_AriaDisabled()
    {
        // A weekends-closed clinic.
        bool IsClosed(string iso) => DateTimePicker.WeekdayOf(iso) is 0 or 6;
        var cut = await OpenAtAsync("2026-03-16", p => p.Add(x => x.IsDateDisabled, (Func<string, bool>)IsClosed));
        Assert.Equal("true", Day(cut, "2026-03-21").GetAttribute("aria-disabled")); // Saturday
        Assert.Equal("true", Day(cut, "2026-03-22").GetAttribute("aria-disabled")); // Sunday
        Assert.False(Day(cut, "2026-03-23").HasAttribute("aria-disabled")); // Monday
        Assert.False(Day(cut, "2026-03-21").HasAttribute("disabled"));
    }

    [Fact]
    public async Task Section_7_31_Clicking_A_Vetoed_Day_Does_Not_Commit()
    {
        var fired = false;
        var cut = await OpenAtAsync("2026-03-15", p => p
            .Add(x => x.Max, "2026-03-16")
            .Add(x => x.OnChange, _ => fired = true));
        await Day(cut, "2026-03-25").ClickAsync(new MouseEventArgs());
        Assert.False(fired);
    }

    [Fact]
    public async Task Section_7_32_A_Shortcut_Moves_The_Selection_And_Reports_Its_Id()
    {
        string? changed = null;
        (string Id, string IsoDate)? shortcut = null;
        var shortcuts = new[]
        {
            new DateTimeShortcut { Id = "today", Label = "Heddiw", Days = 0 },
            new DateTimeShortcut { Id = "two-weeks", Label = "+2", Days = 14 },
            new DateTimeShortcut { Id = "next-month", Label = "+1m", Months = 1 },
        };
        var cut = await OpenAtAsync("2026-03-15", p => p
            .Add(x => x.Shortcuts, shortcuts)
            .Add(x => x.OnChange, v => changed = v)
            .Add(x => x.OnShortcut, s => shortcut = s));
        await cut.Find("button[data-shortcut-id='two-weeks']").ClickAsync(new MouseEventArgs());
        Assert.Equal(("two-weeks", "2026-03-29"), shortcut);
        Assert.Equal("2026-03-29", changed);
    }

    [Fact]
    public async Task Section_7_32_A_Month_Shortcut_Uses_Calendar_Months_Not_30_Days()
    {
        string? changed = null;
        var shortcuts = new[] { new DateTimeShortcut { Id = "m", Label = "+1m", Months = 1 } };
        var cut = await OpenAtAsync("2026-03-15", p => p
            .Add(x => x.Shortcuts, shortcuts)
            .Add(x => x.OnChange, v => changed = v));
        await cut.Find("button[data-shortcut-id='m']").ClickAsync(new MouseEventArgs());
        Assert.Equal("2026-04-15", changed);
    }

    [Fact]
    public async Task Section_7_33_A_Shortcut_Resolving_To_A_Blocked_Date_Does_Nothing()
    {
        string? changed = null;
        (string Id, string IsoDate)? shortcut = null;
        var shortcuts = new[] { new DateTimeShortcut { Id = "far", Label = "+4w", Days = 28 } };
        var cut = await OpenAtAsync("2026-03-15", p => p
            .Add(x => x.Max, "2026-03-20")
            .Add(x => x.Shortcuts, shortcuts)
            .Add(x => x.OnChange, v => changed = v)
            .Add(x => x.OnShortcut, s => shortcut = s));
        await cut.Find("button[data-shortcut-id='far']").ClickAsync(new MouseEventArgs());
        Assert.Null(shortcut);
        Assert.Null(changed);
    }

    // =================================================================
    // §7.34–§7.39 — typed input.
    // =================================================================

    [Fact]
    public async Task Section_7_34_Typing_An_Iso_Date_And_Blurring_Commits_It()
    {
        string? changed = null;
        var cut = Render(p => p.Add(x => x.OnChange, v => changed = v));
        await Field(cut).InputAsync(new ChangeEventArgs { Value = "2026-03-15" });
        await Field(cut).BlurAsync(new FocusEventArgs());
        Assert.Equal("2026-03-15", changed);
        Assert.Equal("2026-03-15", Hidden(cut).GetAttribute("value"));
    }

    [Fact]
    public async Task Section_7_35_Typing_A_Locale_Ordered_Numeric_Date_Commits_The_Right_Day()
    {
        string? changed = null;
        var cut = Render(p => p.Add(x => x.OnChange, v => changed = v));
        await Field(cut).InputAsync(new ChangeEventArgs { Value = "03/04/2026" });
        await Field(cut).KeyDownAsync(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("2026-04-03", changed);
    }

    [Fact]
    public async Task Section_7_36_Unparseable_Text_Marks_Invalid_And_Does_Not_Commit()
    {
        var changed = false;
        string? invalid = null;
        var cut = Render(p => p
            .Add(x => x.Value, "2026-03-15")
            .Add(x => x.OnChange, _ => changed = true)
            .Add(x => x.OnInvalidInput, v => invalid = v));
        await Field(cut).InputAsync(new ChangeEventArgs { Value = "sometime soon" });
        await Field(cut).BlurAsync(new FocusEventArgs());
        Assert.Equal("sometime soon", invalid);
        Assert.False(changed);
        Assert.Equal("true", Field(cut).GetAttribute("aria-invalid"));
        // The text the user typed stays put: silently reverting it is how
        // someone submits a form still believing they changed the date.
        Assert.Equal("sometime soon", Field(cut).GetAttribute("value"));
        Assert.Equal("2026-03-15", Hidden(cut).GetAttribute("value"));
    }

    [Fact]
    public async Task Section_7_37_Text_Parsing_To_An_OutOfRange_Date_Is_Rejected_The_Same_Way()
    {
        var changed = false;
        string? invalid = null;
        var cut = Render(p => p
            .Add(x => x.Value, "2026-03-15")
            .Add(x => x.Max, "2026-03-20")
            .Add(x => x.OnChange, _ => changed = true)
            .Add(x => x.OnInvalidInput, v => invalid = v));
        await Field(cut).InputAsync(new ChangeEventArgs { Value = "2026-12-25" });
        await Field(cut).BlurAsync(new FocusEventArgs());
        Assert.Equal("2026-12-25", invalid);
        Assert.False(changed);
        Assert.Equal("true", Field(cut).GetAttribute("aria-invalid"));
    }

    [Fact]
    public async Task Section_7_38_Clearing_The_Field_Commits_An_Empty_Value()
    {
        string? changed = null;
        var cut = Render(p => p.Add(x => x.Value, "2026-03-15").Add(x => x.OnChange, v => changed = v));
        await Field(cut).InputAsync(new ChangeEventArgs { Value = "" });
        await Field(cut).BlurAsync(new FocusEventArgs());
        Assert.Equal("", changed);
        Assert.Equal("", Hidden(cut).GetAttribute("value"));
    }

    [Fact]
    public async Task Section_7_39_A_ParseInput_Parameter_Overrides_The_BuiltIn_Parser()
    {
        string? changed = null;
        string? Parse(string text) => text == "xmas" ? "2026-12-25" : null;
        var cut = Render(p => p
            .Add(x => x.ParseInput, (Func<string, string?>)Parse)
            .Add(x => x.OnChange, v => changed = v));
        await Field(cut).InputAsync(new ChangeEventArgs { Value = "xmas" });
        await Field(cut).BlurAsync(new FocusEventArgs());
        Assert.Equal("2026-12-25", changed);
    }

    // =================================================================
    // §7.40–§7.44 — time and datetime.
    // =================================================================

    [Fact]
    public async Task Section_7_40_Time_Mode_Renders_Hour_And_Minute_Selects_And_No_Grid()
    {
        var cut = Render(p => p
            .Add(x => x.Mode, DateTimeMode.Time)
            .Add(x => x.Value, "09:30"), labels: TimeLabels);
        await OpenAsync(cut);
        Assert.Empty(cut.FindAll("table.date-time-picker-calendar"));
        var hour = (IHtmlSelectElement)cut.Find(".date-time-picker-hour");
        var minute = (IHtmlSelectElement)cut.Find(".date-time-picker-minute");
        Assert.Equal("9", hour.Value);
        Assert.Equal("30", minute.Value);
    }

    [Fact]
    public async Task Section_7_41_MinuteStep_Controls_The_Minute_Options()
    {
        var cut = Render(p => p
            .Add(x => x.Mode, DateTimeMode.Time)
            .Add(x => x.Value, "09:30")
            .Add(x => x.MinuteStep, 15), labels: TimeLabels);
        await OpenAsync(cut);
        var options = cut.FindAll(".date-time-picker-minute option").Select(o => o.TextContent).ToList();
        Assert.Equal(new[] { "00", "15", "30", "45" }, options);
    }

    [Fact]
    public async Task Section_7_42_DateTime_Mode_Renders_Both_The_Grid_And_The_Time_Selects()
    {
        var cut = Render(p => p
            .Add(x => x.Mode, DateTimeMode.DateTime)
            .Add(x => x.Value, "2026-03-15T09:30"), labels: TimeLabels);
        await OpenAsync(cut);
        Assert.NotEmpty(cut.FindAll("table.date-time-picker-calendar"));
        Assert.NotEmpty(cut.FindAll(".date-time-picker-hour"));
    }

    [Fact]
    public async Task Section_7_43_DateTime_Commits_Date_And_Time_Together()
    {
        string? changed = null;
        var cut = Render(p => p
            .Add(x => x.Mode, DateTimeMode.DateTime)
            .Add(x => x.Value, "2026-03-15T09:30")
            .Add(x => x.OnChange, v => changed = v), labels: TimeLabels);
        await OpenAsync(cut);
        // In datetime mode a day click is pending only — the user still has
        // a time to set.
        await Day(cut, "2026-03-20").ClickAsync(new MouseEventArgs());
        Assert.Null(changed);
        await cut.Find("button.date-time-picker-confirm").ClickAsync(new MouseEventArgs());
        Assert.Equal("2026-03-20T09:30", changed);
    }

    [Fact]
    public async Task Section_7_44_Hour12_Renders_A_Meridiem_Select_Labelled_By_The_Locale()
    {
        var cut = Render(p => p
            .Add(x => x.Mode, DateTimeMode.Time)
            .Add(x => x.Value, "13:30")
            .Add(x => x.Hour12, true), locale: "en-US", labels: TimeLabels);
        await OpenAsync(cut);
        var meridiem = (IHtmlSelectElement)cut.Find(".date-time-picker-meridiem");
        Assert.Equal("pm", meridiem.Value);
        var labels = cut.FindAll(".date-time-picker-meridiem option").Select(o => o.TextContent).ToList();
        // Whatever en-US calls them — the point is that neither string is
        // hardcoded in the component.
        Assert.Equal(2, labels.Count);
        Assert.NotEqual(labels[0], labels[1]);
        // A 12-hour clock shows 1-12, not 13.
        var hourLabels = cut.FindAll(".date-time-picker-hour option").Select(o => o.TextContent).ToList();
        Assert.Contains("1", hourLabels);
        Assert.DoesNotContain("13", hourLabels);
    }

    // =================================================================
    // §7.45–§7.48 — locale.
    // =================================================================

    [Fact]
    public async Task Section_7_45_Weekday_Headings_Start_On_Monday_For_EnGb_Sunday_For_EnUs()
    {
        var gb = Render(p => p.Add(x => x.Value, "2026-03-15"));
        await OpenAsync(gb);
        var gbHeadings = gb.FindAll(".date-time-picker-weekday").Select(th => th.GetAttribute("abbr")).ToList();
        Assert.Equal("Monday", gbHeadings[0]);

        var us = Render(p => p.Add(x => x.Value, "2026-03-15"), locale: "en-US");
        await OpenAsync(us);
        var usHeadings = us.FindAll(".date-time-picker-weekday").Select(th => th.GetAttribute("abbr")).ToList();
        Assert.Equal("Sunday", usHeadings[0]);
    }

    [Fact]
    public async Task Section_7_46_FirstDayOfWeek_Overrides_The_Locale()
    {
        var cut = Render(p => p
            .Add(x => x.FirstDayOfWeek, 0)
            .Add(x => x.Value, "2026-03-15"));
        await OpenAsync(cut);
        var first = cut.Find(".date-time-picker-weekday").GetAttribute("abbr");
        Assert.Equal("Sunday", first);
    }

    [Fact]
    public async Task Section_7_47_Month_Names_And_Day_Labels_Follow_The_Locale()
    {
        var cut = Render(p => p.Add(x => x.Value, "2026-03-15"), locale: "cy-GB");
        await OpenAsync(cut);
        var period = cut.Find(".date-time-picker-period");
        // Welsh for March is "Mawrth"; the assertion is that the heading is
        // NOT the English month name, so the test does not depend on one
        // ICU version's exact spelling.
        Assert.DoesNotContain("March", period.TextContent);
        Assert.Contains("2026", period.TextContent);
        Assert.DoesNotContain("March", Day(cut, "2026-03-15").GetAttribute("aria-label"));
    }

    [Fact]
    public async Task Section_7_48_ShowWeekNumbers_Renders_Iso_Week_Numbers()
    {
        var cut = Render(p => p
            .Add(x => x.Value, "2026-03-15")
            .Add(x => x.ShowWeekNumbers, true), labels: Labels with { Week = "Wk" });
        await OpenAsync(cut);
        Assert.Equal("Wk", cut.Find(".date-time-picker-week-heading").TextContent.Trim());
        var weeks = cut.FindAll(".date-time-picker-week").Select(th => th.TextContent.Trim()).ToList();
        Assert.Equal(6, weeks.Count);
        // The grid's first row starts 2026-02-23, which is ISO week 9.
        Assert.Equal("9", weeks[0]);
    }

    // =================================================================
    // §7.49–§7.55 — assistive technology.
    //
    // Focus assertions here read the FocusAsync interop invocations (see
    // FocusedRefIds above) rather than a live document.activeElement,
    // which bUnit does not have. Where the canonical Svelte test asserts
    // "focus did not move", the equivalent here is "no focus interop call
    // was made" — the component never asked the browser to move focus, so
    // focus stays where the user left it.
    // =================================================================

    [Fact]
    public async Task Section_7_49_The_Cursor_Lands_On_A_Vetoed_Day_Which_Stays_Focusable_And_Refuses_Enter()
    {
        var fired = false;
        bool Veto(string iso) => iso == "2026-03-16";
        var cut = await OpenAtAsync("2026-03-15", p => p
            .Add(x => x.IsDateDisabled, (Func<string, bool>)Veto)
            .Add(x => x.OnChange, _ => fired = true));
        var grid = cut.Find("table.date-time-picker-calendar");
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "ArrowRight" });
        // The roving tabindex is on the blocked day, and — because it is
        // aria-disabled rather than `disabled` — the component asked the
        // browser for real focus on it too, so a screen reader announces
        // the day instead of going silent.
        Assert.Equal("2026-03-16", CursorDate(cut));
        var vetoed = Day(cut, "2026-03-16");
        Assert.Equal("true", vetoed.GetAttribute("aria-disabled"));
        Assert.False(vetoed.HasAttribute("disabled"));
        Assert.Equal("0", vetoed.GetAttribute("tabindex"));
        Assert.Equal(cut.Instance.DayReferenceId("2026-03-16"), FocusedRefIds().Last());
        // Enter refuses to select it.
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "Enter" });
        Assert.False(fired);
        // And the cursor can keep going, out the other side.
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal("2026-03-17", CursorDate(cut));
    }

    [Fact]
    public async Task Section_7_50_Escape_In_The_Field_Discards_The_Pending_Edit_Without_Committing()
    {
        var fired = false;
        var cut = Render(p => p
            .Add(x => x.Value, "2026-03-15")
            .Add(x => x.OnChange, _ => fired = true));
        // Mark the field invalid first, so the revert has state to clean up.
        await Field(cut).InputAsync(new ChangeEventArgs { Value = "sometime soon" });
        await Field(cut).KeyDownAsync(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("true", Field(cut).GetAttribute("aria-invalid"));

        await Field(cut).KeyDownAsync(new KeyboardEventArgs { Key = "Escape" });
        // The committed value is back on display, the invalid state is
        // gone, and nothing was committed.
        Assert.Contains("2026", Field(cut).GetAttribute("value"));
        Assert.False(Field(cut).HasAttribute("aria-invalid"));
        Assert.False(fired);
        Assert.Equal("2026-03-15", Hidden(cut).GetAttribute("value"));
    }

    [Fact]
    public async Task Section_7_51_LabelsInvalid_Renders_A_Status_Live_Region_Wired_To_The_Field()
    {
        // Without the label, no region renders — the component would rather
        // stay silent than announce in a language it invented.
        var without = Render();
        Assert.Empty(without.FindAll(".date-time-picker-status"));

        var cut = Render(p => p.Add(x => x.DescribedBy, "hint"),
            labels: Labels with { Invalid = "DimDyddiad" });
        // The region exists before it has content — a live region born with
        // its message is routinely not announced at all — and is empty
        // while the field is valid.
        var status = cut.Find(".date-time-picker-status");
        Assert.Equal("status", status.GetAttribute("role"));
        Assert.Equal("", status.TextContent.Trim());
        Assert.Equal("hint", Field(cut).GetAttribute("aria-describedby"));
        Assert.False(Field(cut).HasAttribute("aria-errormessage"));

        await Field(cut).InputAsync(new ChangeEventArgs { Value = "junk" });
        await Field(cut).BlurAsync(new FocusEventArgs());
        status = cut.Find(".date-time-picker-status");
        Assert.Equal("DimDyddiad", status.TextContent.Trim());
        Assert.Equal(status.GetAttribute("id"), Field(cut).GetAttribute("aria-errormessage"));
        // Chained after the consumer's hint, for the assistive technologies
        // that read aria-describedby but not aria-errormessage.
        Assert.Equal($"hint {status.GetAttribute("id")}", Field(cut).GetAttribute("aria-describedby"));
    }

    [Fact]
    public async Task Section_7_52_Focus_Returns_To_Whichever_Element_Opened_The_Dialog()
    {
        // Opened from the field with Alt+ArrowDown: Escape must return
        // focus to the field, not strand the user on the button.
        var cut = Render(p => p.Add(x => x.Value, "2026-03-15"));
        await Field(cut).KeyDownAsync(new KeyboardEventArgs { Key = "ArrowDown", AltKey = true });
        await Dialog(cut).KeyDownAsync(new KeyboardEventArgs { Key = "Escape" });
        Assert.Equal(cut.Instance.FieldReferenceId, FocusedRefIds().Last());

        // Opened from the button: focus returns to the button.
        var cut2 = Render(p => p.Add(x => x.Value, "2026-03-15"));
        await OpenAsync(cut2);
        await Dialog(cut2).KeyDownAsync(new KeyboardEventArgs { Key = "Escape" });
        Assert.Equal(cut2.Instance.TriggerReferenceId, FocusedRefIds().Last());
    }

    [Fact]
    public async Task Section_7_53_Header_Paging_Keeps_Focus_On_The_Header_Button_Grid_Paging_Follows_The_Cursor()
    {
        var cut = await OpenAtAsync("2026-03-15");
        var focusCallsAfterOpen = FocusedRefIds().Count;

        // Header route: the user activating "next month" stays on "next
        // month", so they can page again — the cursor carries silently,
        // and the component makes no focus call at all.
        await cut.Find("button.date-time-picker-next-month").ClickAsync(new MouseEventArgs());
        Assert.Equal("2026-04-15", CursorDate(cut));
        Assert.Equal(focusCallsAfterOpen, FocusedRefIds().Count);

        // Grid route: focus is in the grid, and paging must carry it —
        // the cell it sat on no longer exists.
        var grid = cut.Find("table.date-time-picker-calendar");
        await grid.KeyDownAsync(new KeyboardEventArgs { Key = "PageDown" });
        Assert.Equal("2026-05-15", CursorDate(cut));
        Assert.Equal(focusCallsAfterOpen + 1, FocusedRefIds().Count);
        Assert.Equal(cut.Instance.DayReferenceId("2026-05-15"), FocusedRefIds().Last());
    }

    [Fact]
    public void Section_7_54_LabelsInstructions_Renders_Keyboard_Help_Described_By_The_Dialog()
    {
        var without = Render();
        Assert.Empty(without.FindAll(".date-time-picker-instructions"));
        Assert.False(Dialog(without).HasAttribute("aria-describedby"));

        var cut = Render(labels: Labels with { Instructions = "SaethauSymud" });
        var help = cut.Find(".date-time-picker-instructions");
        Assert.Equal("SaethauSymud", help.TextContent.Trim());
        Assert.Equal(help.GetAttribute("id"), Dialog(cut).GetAttribute("aria-describedby"));
        // First child of the dialog, so it reads before the calendar.
        Assert.Equal(help.GetAttribute("id"), Dialog(cut).Children.First().GetAttribute("id"));
    }

    [Fact]
    public async Task Section_7_55_Clicking_The_Text_Field_While_The_Dialog_Is_Open_Closes_It()
    {
        var cut = await OpenAtAsync("2026-03-15");
        Assert.False(Dialog(cut).HasAttribute("hidden"));
        var focusCallsAfterOpen = FocusedRefIds().Count;
        // The dialog is aria-modal: interacting with anything behind it —
        // including the component's own field — dismisses it.
        await Field(cut).ClickAsync(new MouseEventArgs());
        Assert.True(Dialog(cut).HasAttribute("hidden"));
        Assert.Equal("2026-03-15", Hidden(cut).GetAttribute("value"));
        // Closed without moving focus: the click already put focus in the
        // field, so the component made no focus call of its own.
        Assert.Equal(focusCallsAfterOpen, FocusedRefIds().Count);
    }
}
