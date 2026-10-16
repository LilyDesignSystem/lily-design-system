// CalendarView tests — one or more [Fact]s per spec/index.md §8 acceptance
// clause (the canonical Svelte spec's numbering, §8.1–§8.21).

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class CalendarViewTests : TestContext
{
    private static readonly string[] Weekdays = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };

    private static readonly CalendarViewLabels Labels = new()
    {
        WeekView = "Week",
        FourWeekView = "4 weeks",
        MonthView = "Month",
        Previous = view => $"Previous {view}",
        Next = view => $"Next {view}",
        Today = "Today",
        PeriodAnnouncement = (view, start, end) => $"{view}: {start} to {end}",
        Weekday = wd => Weekdays[wd],
        WeekdayAbbr = wd => Weekdays[wd][..3],
        Day = (iso, wd, outside) => $"{int.Parse(iso[8..])}, {Weekdays[wd]}{(outside ? " (outside)" : "")}",
    };

    private static readonly IReadOnlyList<CalendarEvent> Events = new[]
    {
        new CalendarEvent { Id = "e1", Date = "2026-01-06", Title = "Single-day" },
        new CalendarEvent { Id = "e2", Start = "2026-01-09", End = "2026-01-11", Title = "Multi-day" },
    };

    public CalendarViewTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<CalendarView> Render(
        CalendarViewMode view = CalendarViewMode.Week,
        string anchor = "2026-01-06",
        Action<ComponentParameterCollectionBuilder<CalendarView>>? configure = null)
        => RenderComponent<CalendarView>(p =>
        {
            p.Add(x => x.Label, "Appointments");
            p.Add(x => x.View, view);
            p.Add(x => x.AnchorDate, anchor);
            configure?.Invoke(p);
        });

    private static IReadOnlyList<AngleSharp.Dom.IElement> Cells(IRenderedComponent<CalendarView> cut)
        => cut.FindAll(".calendar-table-td");

    private static AngleSharp.Dom.IElement Tabbable(IRenderedComponent<CalendarView> cut)
        => cut.FindAll(".calendar-table-td[tabindex='0']").Single();

    private static AngleSharp.Dom.IElement Cell(IRenderedComponent<CalendarView> cut, string iso)
        => cut.Find($".calendar-table-td[data-date='{iso}']");

    private static AngleSharp.Dom.IElement Button(IRenderedComponent<CalendarView> cut, string name)
        => cut.FindAll("button").First(b => (b.GetAttribute("aria-label") ?? b.TextContent).Trim() == name);

    private static void Key(IRenderedComponent<CalendarView> cut, string key, bool alt = false)
        => cut.Find(".calendar-table").KeyDown(new KeyboardEventArgs { Key = key, AltKey = alt });

    // =====================================================================
    // Pure helpers
    // =====================================================================

    [Fact]
    public void WeekStart_Finds_The_Monday_On_Or_Before_A_Tuesday()
        => Assert.Equal("2026-01-05", CalendarView.WeekStart("2026-01-06", 1));

    [Fact]
    public void PeriodDays_Shapes_Week_FourWeek_And_Month()
    {
        Assert.Equal(7, CalendarView.PeriodDays(CalendarViewMode.Week, "2026-01-06", 1).SelectMany(w => w).Count());
        var four = CalendarView.PeriodDays(CalendarViewMode.FourWeek, "2026-01-06", 1);
        Assert.Equal(4, four.Length);
        Assert.Equal("2026-02-01", four[3][6]);
        var month = CalendarView.PeriodDays(CalendarViewMode.Month, "2026-01-15", 1);
        Assert.Equal(42, month.SelectMany(w => w).Count());
        Assert.Equal("2025-12-29", month[0][0]);
        Assert.Equal("2026-02-08", month[5][6]);
    }

    [Fact]
    public void IsOutsidePeriod_Is_True_Only_For_Month_Padding_Days()
    {
        Assert.True(CalendarView.IsOutsidePeriod(CalendarViewMode.Month, "2025-12-29", "2026-01-15"));
        Assert.False(CalendarView.IsOutsidePeriod(CalendarViewMode.Month, "2026-01-15", "2026-01-15"));
        Assert.False(CalendarView.IsOutsidePeriod(CalendarViewMode.Week, "2025-12-29", "2026-01-06"));
    }

    [Fact]
    public void PeriodRange_Returns_The_Months_Own_First_And_Last_Day()
    {
        Assert.Equal(("2026-01-01", "2026-01-31"), CalendarView.PeriodRange(CalendarViewMode.Month, "2026-01-15", 1));
        Assert.Equal(("2026-01-05", "2026-01-11"), CalendarView.PeriodRange(CalendarViewMode.Week, "2026-01-06", 1));
        Assert.Equal(("2026-01-05", "2026-02-01"), CalendarView.PeriodRange(CalendarViewMode.FourWeek, "2026-01-06", 1));
    }

    [Fact]
    public void EventsByDay_Places_A_Multi_Day_Event_On_Every_Date_In_Its_Range()
    {
        var map = CalendarView.EventsByDay(Events);
        Assert.Equal("e1", map["2026-01-06"].Single().Id);
        Assert.Equal("e2", map["2026-01-10"].Single().Id);
        Assert.False(map.ContainsKey("2026-01-12"));
    }

    // =====================================================================
    // Markup
    // =====================================================================

    [Fact]
    public void Section_8_1_Renders_A_Root_Wrapping_A_Role_Grid_Table_Labelled_By_Label()
    {
        var cut = Render();
        Assert.NotNull(cut.Find("div.calendar-view"));
        var grid = cut.Find("[role='grid']");
        Assert.Equal("Appointments", grid.GetAttribute("aria-label"));
        Assert.Equal("table", grid.TagName.ToLowerInvariant());
    }

    [Fact]
    public void Section_8_2_Week_Renders_7_Cells_None_Outside_Period()
    {
        var cut = Render();
        Assert.Single(cut.FindAll(".calendar-table-body .calendar-table-row"));
        Assert.Equal(7, Cells(cut).Count);
        Assert.DoesNotContain(Cells(cut), c => c.HasAttribute("data-outside-period"));
    }

    [Fact]
    public void Section_8_3_FourWeek_Renders_28_Cells_In_4_Rows()
    {
        var cut = Render(CalendarViewMode.FourWeek);
        Assert.Equal(4, cut.FindAll(".calendar-table-body .calendar-table-row").Count);
        Assert.Equal(28, Cells(cut).Count);
    }

    [Fact]
    public void Section_8_4_Month_Renders_42_Cells_And_Padding_Days_Carry_Data_Outside_Period()
    {
        var cut = Render(CalendarViewMode.Month, "2026-01-15");
        Assert.Equal(6, cut.FindAll(".calendar-table-body .calendar-table-row").Count);
        Assert.Equal(42, Cells(cut).Count);
        Assert.True(Cell(cut, "2025-12-29").HasAttribute("data-outside-period"));
        Assert.False(Cell(cut, "2026-01-15").HasAttribute("data-outside-period"));
    }

    [Fact]
    public void Section_8_5_The_Day_Matching_Today_Carries_Aria_Current_Date()
    {
        var cut = Render(configure: p => p.Add(x => x.Today, "2026-01-08"));
        Assert.Equal("date", Cell(cut, "2026-01-08").GetAttribute("aria-current"));
        Assert.Single(Cells(cut).Where(c => c.GetAttribute("aria-current") == "date"));
    }

    [Fact]
    public void Section_8_15_Omitting_Today_Renders_No_Aria_Current_And_Disables_The_Today_Button()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        Assert.DoesNotContain(Cells(cut), c => c.HasAttribute("aria-current"));
        Assert.True(Button(cut, "Today").HasAttribute("disabled"));
    }

    [Fact]
    public void Section_8_16_Extra_Attributes_Spread_Onto_The_Root()
    {
        var cut = Render(configure: p => p.AddUnmatched("data-testid", "cal-root"));
        Assert.NotNull(cut.Find("[data-testid='cal-root']"));
    }

    [Fact]
    public void Default_Rendering_Shows_Each_Cells_Day_Of_Month_Number()
    {
        var cut = Render();
        Assert.StartsWith("6", Cell(cut, "2026-01-06").TextContent.Trim());
        Assert.Equal("11", Cell(cut, "2026-01-11").TextContent.Trim());
    }

    // =====================================================================
    // View switcher and navigation
    // =====================================================================

    [Fact]
    public void Section_8_8_The_Switcher_Renders_Only_Labelled_Buttons_And_Marks_The_Active_One()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, new CalendarViewLabels { WeekView = "Week", MonthView = "Month" }));
        Assert.Equal("true", Button(cut, "Week").GetAttribute("aria-pressed"));
        Assert.Equal("false", Button(cut, "Month").GetAttribute("aria-pressed"));
        Assert.DoesNotContain(cut.FindAll("button"), b => b.TextContent.Trim() == "4 weeks");
    }

    [Fact]
    public async Task Section_8_6_Next_And_Previous_Step_By_The_Views_Length_And_Raise_OnNavigate()
    {
        var navs = new List<(CalendarViewMode, string, string)>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Labels, Labels);
            p.Add(x => x.OnNavigate, EventCallback.Factory.Create<(CalendarViewMode, string, string)>(this, a => navs.Add(a)));
        });

        await Button(cut, "Next Week").ClickAsync(new MouseEventArgs());
        Assert.Equal((CalendarViewMode.Week, "2026-01-12", "2026-01-18"), navs[0]);
        await Button(cut, "Previous Week").ClickAsync(new MouseEventArgs());
        await Button(cut, "Previous Week").ClickAsync(new MouseEventArgs());
        Assert.Equal((CalendarViewMode.Week, "2025-12-29", "2026-01-04"), navs[^1]);
    }

    [Fact]
    public async Task Section_8_6_FourWeek_Steps_28_Days_And_Month_Steps_One_Month()
    {
        var navs = new List<(CalendarViewMode, string, string)>();
        var cb = EventCallback.Factory.Create<(CalendarViewMode, string, string)>(this, a => navs.Add(a));
        var four = Render(CalendarViewMode.FourWeek, configure: p => { p.Add(x => x.Labels, Labels); p.Add(x => x.OnNavigate, cb); });
        await Button(four, "Next FourWeek").ClickAsync(new MouseEventArgs());
        Assert.Equal((CalendarViewMode.FourWeek, "2026-02-02", "2026-03-01"), navs[0]);

        var month = Render(CalendarViewMode.Month, "2026-01-15", p => { p.Add(x => x.Labels, Labels); p.Add(x => x.OnNavigate, cb); });
        await Button(month, "Next Month").ClickAsync(new MouseEventArgs());
        Assert.Equal((CalendarViewMode.Month, "2026-02-01", "2026-02-28"), navs[^1]);
    }

    [Fact]
    public async Task Section_8_7_Today_Sets_The_Anchor_To_Today_Without_Changing_View()
    {
        var navs = new List<(CalendarViewMode, string, string)>();
        var cut = Render(anchor: "2026-02-20", configure: p =>
        {
            p.Add(x => x.Labels, Labels);
            p.Add(x => x.Today, "2026-01-08");
            p.Add(x => x.OnNavigate, EventCallback.Factory.Create<(CalendarViewMode, string, string)>(this, a => navs.Add(a)));
        });

        await Button(cut, "Today").ClickAsync(new MouseEventArgs());

        Assert.Equal((CalendarViewMode.Week, "2026-01-05", "2026-01-11"), navs[0]);
        Assert.NotNull(Cell(cut, "2026-01-08"));
    }

    [Fact]
    public async Task Section_8_13_Every_Navigation_Announces_The_New_Period()
    {
        var cut = Render(configure: p => p.Add(x => x.Labels, Labels));
        await Button(cut, "Next Week").ClickAsync(new MouseEventArgs());
        Assert.Equal("Week: 2026-01-12 to 2026-01-18", cut.Find(".calendar-view-status").TextContent);
    }

    [Fact]
    public void Section_8_14_A_Sunday_First_Locale_Shifts_The_Computed_Week_Start()
    {
        var cut = Render(configure: p => p.Add(x => x.Locale, "en-US"));
        Assert.NotNull(Cell(cut, "2026-01-04"));
        Assert.Equal(7, Cells(cut).Count);
    }

    // =====================================================================
    // Keyboard
    // =====================================================================

    [Fact]
    public void Section_8_9_One_Tab_Stop_Arrows_Move_By_Day_And_Week_Home_End_Clamp_To_The_Row()
    {
        var cut = Render(CalendarViewMode.FourWeek);
        Assert.Equal("2026-01-06", Tabbable(cut).GetAttribute("data-date"));
        Key(cut, "ArrowRight");
        Assert.Equal("2026-01-07", Tabbable(cut).GetAttribute("data-date"));
        Key(cut, "ArrowDown");
        Assert.Equal("2026-01-14", Tabbable(cut).GetAttribute("data-date"));
        Key(cut, "Home");
        Assert.Equal("2026-01-12", Tabbable(cut).GetAttribute("data-date"));
        Key(cut, "End");
        Assert.Equal("2026-01-18", Tabbable(cut).GetAttribute("data-date"));
    }

    [Fact]
    public void Section_8_10_PageDown_Steps_The_Cursor_By_The_Views_Length_And_Re_Pages()
    {
        var navs = new List<(CalendarViewMode, string, string)>();
        var cut = Render(configure: p =>
            p.Add(x => x.OnNavigate, EventCallback.Factory.Create<(CalendarViewMode, string, string)>(this, a => navs.Add(a))));

        Key(cut, "PageDown");

        Assert.Equal((CalendarViewMode.Week, "2026-01-12", "2026-01-18"), navs[0]);
        Assert.Equal("2026-01-13", Tabbable(cut).GetAttribute("data-date"));
    }

    [Fact]
    public void Section_8_10_In_Month_View_Moving_Onto_A_Padding_Cell_Re_Pages_To_That_Month()
    {
        var navs = new List<(CalendarViewMode, string, string)>();
        var cut = Render(CalendarViewMode.Month, "2026-01-01", p =>
            p.Add(x => x.OnNavigate, EventCallback.Factory.Create<(CalendarViewMode, string, string)>(this, a => navs.Add(a))));

        for (var i = 0; i < 3; i++) Key(cut, "ArrowLeft");

        Assert.Equal((CalendarViewMode.Month, "2025-12-01", "2025-12-31"), navs[0]);
        Assert.False(Cell(cut, "2025-12-29").HasAttribute("data-outside-period"));
    }

    [Fact]
    public void Section_8_11_Enter_Raises_OnDayClick_With_The_Focused_Cells_Date()
    {
        var clicks = new List<string>();
        var cut = Render(configure: p => p.Add(x => x.OnDayClick, EventCallback.Factory.Create<string>(this, d => clicks.Add(d))));

        Key(cut, "ArrowRight");
        Key(cut, "Enter");

        Assert.Equal(new[] { "2026-01-07" }, clicks);
    }

    [Fact]
    public async Task Clicking_A_Day_Cell_Moves_The_Cursor_There_And_Raises_OnDayClick()
    {
        var clicks = new List<string>();
        var cut = Render(configure: p => p.Add(x => x.OnDayClick, EventCallback.Factory.Create<string>(this, d => clicks.Add(d))));

        await Cell(cut, "2026-01-10").ClickAsync(new MouseEventArgs());

        Assert.Equal(new[] { "2026-01-10" }, clicks);
        Assert.Equal("2026-01-10", Tabbable(cut).GetAttribute("data-date"));
    }

    // =====================================================================
    // Events and interaction (§8.12, §8.17–§8.21)
    // =====================================================================

    [Fact]
    public void Section_8_12_Events_Render_As_Buttons_Inside_Every_Day_They_Cover()
    {
        var cut = Render(configure: p => p.Add(x => x.Events, Events));
        string[] Titles(string iso) => Cell(cut, iso).QuerySelectorAll(".calendar-view-event").Select(b => b.TextContent.Trim()).ToArray();

        Assert.Equal(new[] { "Single-day" }, Titles("2026-01-06"));
        Assert.Equal(new[] { "Multi-day" }, Titles("2026-01-09"));
        Assert.Equal(new[] { "Multi-day" }, Titles("2026-01-11"));
        Assert.Empty(Titles("2026-01-07"));
    }

    [Fact]
    public async Task Section_8_17_Picking_A_Day_Marks_It_Data_Selected_Distinct_From_The_Cursor()
    {
        var cut = Render(configure: p => p.Add(x => x.Today, "2026-01-08"));

        await Cell(cut, "2026-01-07").ClickAsync(new MouseEventArgs());
        Key(cut, "ArrowRight");

        Assert.True(Cell(cut, "2026-01-07").HasAttribute("data-selected"));
        Assert.False(Cell(cut, "2026-01-08").HasAttribute("data-selected"));
        Assert.Equal("2026-01-08", Tabbable(cut).GetAttribute("data-date"));
    }

    [Fact]
    public async Task Section_8_18_Disabled_Days_Are_Aria_Disabled_Focusable_And_Not_Pickable()
    {
        var clicks = new List<string>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.MinDate, "2026-01-06");
            p.Add(x => x.MaxDate, "2026-01-10");
            p.Add(x => x.IsDisabled, d => d == "2026-01-07");
            p.Add(x => x.OnDayClick, EventCallback.Factory.Create<string>(this, d => clicks.Add(d)));
        });

        Assert.Equal("true", Cell(cut, "2026-01-05").GetAttribute("aria-disabled"));
        Assert.Equal("true", Cell(cut, "2026-01-07").GetAttribute("aria-disabled"));
        Assert.Equal("true", Cell(cut, "2026-01-11").GetAttribute("aria-disabled"));
        Assert.False(Cell(cut, "2026-01-06").HasAttribute("aria-disabled"));

        await Cell(cut, "2026-01-07").ClickAsync(new MouseEventArgs());
        Assert.Empty(clicks);
        Assert.Equal("2026-01-07", Tabbable(cut).GetAttribute("data-date"));

        await Cell(cut, "2026-01-09").ClickAsync(new MouseEventArgs());
        Assert.Equal(new[] { "2026-01-09" }, clicks);
    }

    [Fact]
    public void Section_8_19_Pressing_T_Moves_The_Cursor_To_Today_And_Navigates()
    {
        var navs = new List<(CalendarViewMode, string, string)>();
        var cut = Render(anchor: "2026-03-02", configure: p =>
        {
            p.Add(x => x.Today, "2026-01-08");
            p.Add(x => x.OnNavigate, EventCallback.Factory.Create<(CalendarViewMode, string, string)>(this, a => navs.Add(a)));
        });

        Key(cut, "t");

        Assert.Equal((CalendarViewMode.Week, "2026-01-05", "2026-01-11"), navs[0]);
        Assert.Equal("2026-01-08", Tabbable(cut).GetAttribute("data-date"));
    }

    [Fact]
    public void Section_8_20_T_Does_Nothing_When_Today_Is_Not_Supplied()
    {
        var navs = new List<(CalendarViewMode, string, string)>();
        var cut = Render(configure: p =>
            p.Add(x => x.OnNavigate, EventCallback.Factory.Create<(CalendarViewMode, string, string)>(this, a => navs.Add(a))));

        Key(cut, "t");

        Assert.Empty(navs);
    }

    [Fact]
    public async Task Section_8_21_An_Event_Button_Raises_OnEventClick_Without_Picking_The_Day()
    {
        var events = new List<string>();
        var clicks = new List<string>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Events, Events);
            p.Add(x => x.OnEventClick, EventCallback.Factory.Create<CalendarEvent>(this, e => events.Add(e.Id)));
            p.Add(x => x.OnDayClick, EventCallback.Factory.Create<string>(this, d => clicks.Add(d)));
        });

        await Cell(cut, "2026-01-06").QuerySelector(".calendar-view-event")!.ClickAsync(new MouseEventArgs());

        Assert.Equal(new[] { "e1" }, events);
        Assert.Empty(clicks);
    }

    [Fact]
    public void Section_8_21_The_Day_Template_Receives_Selected_Disabled_And_OpenEvent()
    {
        var cut = Render(configure: p =>
        {
            p.Add(x => x.SelectedDate, "2026-01-06");
            p.Add(x => x.MinDate, "2026-01-06");
            p.Add(x => x.Day, ctx => builder => builder.AddMarkupContent(0, $"<i data-ctx='{ctx.Selected}-{ctx.Disabled}'></i>"));
        });

        Assert.Equal("True-False", Cell(cut, "2026-01-06").QuerySelector("[data-ctx]")!.GetAttribute("data-ctx"));
        Assert.Equal("False-True", Cell(cut, "2026-01-05").QuerySelector("[data-ctx]")!.GetAttribute("data-ctx"));
    }

    // =====================================================================
    // Round 2 — week numbers, marked ranges, range selection (§8.22–§8.30)
    // =====================================================================

    private static readonly CalendarViewLabels RangeLabels = Labels with
    {
        WeekNumberHeader = "Wk",
        WeekNumber = n => $"Week {n}",
        RangeAnnouncement = (s, e) => $"Selected {s} to {e}",
    };

    private IRenderedComponent<CalendarView> RenderMonth(Action<ComponentParameterCollectionBuilder<CalendarView>>? configure = null)
        => Render(CalendarViewMode.Month, "2026-01-15", p =>
        {
            p.Add(x => x.Today, "2026-01-08");
            configure?.Invoke(p);
        });

    private static void ShiftKeyDown(IRenderedComponent<CalendarView> cut, string key)
        => cut.Find(".calendar-table").KeyDown(new KeyboardEventArgs { Key = key, ShiftKey = true });

    [Fact]
    public void Section_8_22_ShowWeekNumbers_Adds_A_Leading_Header_And_A_Row_Header_Per_Week()
    {
        var cut = RenderMonth(p =>
        {
            p.Add(x => x.ShowWeekNumbers, true);
            p.Add(x => x.Labels, RangeLabels);
        });

        Assert.Equal("Wk", cut.Find("[data-week-number-header]").TextContent.Trim());
        var rowHeaders = cut.FindAll("[data-week-number]");
        Assert.Equal(6, rowHeaders.Count);
        var week2 = rowHeaders.First(h => h.GetAttribute("data-week-number") == "2");
        Assert.Equal("2", week2.TextContent.Trim());
        Assert.Equal("Week 2", week2.GetAttribute("aria-label"));
        Assert.Equal("row", week2.GetAttribute("scope"));
    }

    [Fact]
    public void Section_8_22_Week_Numbers_Are_Off_By_Default()
    {
        var cut = RenderMonth();
        Assert.Empty(cut.FindAll("[data-week-number]"));
        Assert.Empty(cut.FindAll("[data-week-number-header]"));
    }

    [Fact]
    public void Section_8_23_Ranges_Mark_Each_Day_Inside_With_Data_Range_Kind()
    {
        var cut = RenderMonth(p => p.Add(x => x.Ranges, new[]
        {
            new CalendarRange("2026-01-05", "2026-01-07", "holiday"),
            new CalendarRange("2026-01-07", "2026-01-08"),
        }));

        Assert.Equal("holiday", Cell(cut, "2026-01-05").GetAttribute("data-range"));
        Assert.Equal("holiday range", Cell(cut, "2026-01-07").GetAttribute("data-range"));
        Assert.Equal("range", Cell(cut, "2026-01-08").GetAttribute("data-range"));
        Assert.Null(Cell(cut, "2026-01-09").GetAttribute("data-range"));
    }

    [Fact]
    public void Section_8_24_Shift_ArrowRight_Extends_A_Range_From_The_Cursor()
    {
        var cut = RenderMonth(p => p.Add(x => x.Labels, RangeLabels));
        ShiftKeyDown(cut, "ArrowRight");
        ShiftKeyDown(cut, "ArrowRight");

        Assert.NotNull(Cell(cut, "2026-01-15").GetAttribute("data-range-start"));
        Assert.NotNull(Cell(cut, "2026-01-17").GetAttribute("data-range-end"));
        Assert.NotNull(Cell(cut, "2026-01-16").GetAttribute("data-in-range"));
        Assert.Null(Cell(cut, "2026-01-18").GetAttribute("data-in-range"));
        Assert.Equal("Selected 2026-01-15 to 2026-01-17", cut.Find(".calendar-view-status").TextContent);
    }

    [Fact]
    public void Section_8_24_Extending_Backwards_Orders_The_Range()
    {
        var cut = RenderMonth();
        ShiftKeyDown(cut, "ArrowLeft");

        Assert.NotNull(Cell(cut, "2026-01-14").GetAttribute("data-range-start"));
        Assert.NotNull(Cell(cut, "2026-01-15").GetAttribute("data-range-end"));
    }

    [Fact]
    public void Section_8_25_Enter_On_An_Extended_Range_Raises_OnRangeSelect_Once_And_Not_OnDayClick()
    {
        var ranges = new List<CalendarSelectedRange>();
        var clicks = new List<string>();
        var cut = RenderMonth(p =>
        {
            p.Add(x => x.OnRangeSelect, EventCallback.Factory.Create<CalendarSelectedRange>(this, r => ranges.Add(r)));
            p.Add(x => x.OnDayClick, EventCallback.Factory.Create<string>(this, d => clicks.Add(d)));
        });
        ShiftKeyDown(cut, "ArrowRight");
        Key(cut, "Enter");

        Assert.Equal(new[] { new CalendarSelectedRange("2026-01-15", "2026-01-16") }, ranges);
        Assert.Empty(clicks);
    }

    [Fact]
    public void Section_8_26_A_Plain_Arrow_After_Extending_Stops_Extending_But_Keeps_The_Range()
    {
        var cut = RenderMonth();
        ShiftKeyDown(cut, "ArrowRight");
        Key(cut, "ArrowRight");

        Assert.NotNull(Cell(cut, "2026-01-16").GetAttribute("data-range-end"));
        Assert.Null(Cell(cut, "2026-01-17").GetAttribute("data-in-range"));
    }

    [Fact]
    public void Section_8_27_Escape_Clears_The_Range()
    {
        var cut = RenderMonth();
        ShiftKeyDown(cut, "ArrowRight");
        Key(cut, "Escape");

        Assert.Empty(cut.FindAll("[data-in-range]"));
    }

    [Fact]
    public async Task Section_8_28_Shift_Click_Picks_A_Range_From_The_Cursor_And_Confirms_It()
    {
        var ranges = new List<CalendarSelectedRange>();
        var cut = RenderMonth(p => p.Add(x => x.OnRangeSelect, EventCallback.Factory.Create<CalendarSelectedRange>(this, r => ranges.Add(r))));
        await Cell(cut, "2026-01-20").ClickAsync(new MouseEventArgs { ShiftKey = true });

        Assert.Equal(new[] { new CalendarSelectedRange("2026-01-15", "2026-01-20") }, ranges);
        Assert.NotNull(Cell(cut, "2026-01-18").GetAttribute("data-in-range"));
    }

    [Fact]
    public async Task Section_8_29_A_Plain_Click_After_A_Range_Clears_Extension_And_Picks_That_Day()
    {
        var clicks = new List<string>();
        var cut = RenderMonth(p => p.Add(x => x.OnDayClick, EventCallback.Factory.Create<string>(this, d => clicks.Add(d))));
        ShiftKeyDown(cut, "ArrowRight");
        await Cell(cut, "2026-01-22").ClickAsync(new MouseEventArgs());

        Assert.Equal(new[] { "2026-01-22" }, clicks);
    }

    [Fact]
    public void Section_8_30_The_Day_Template_Receives_InRange_And_Ranges()
    {
        var cut = RenderMonth(p =>
        {
            p.Add(x => x.SelectedRange, new CalendarSelectedRange("2026-01-06", "2026-01-07"));
            p.Add(x => x.Ranges, new[] { new CalendarRange("2026-01-06", "2026-01-06", "holiday") });
            p.Add(x => x.Day, ctx => builder => builder.AddMarkupContent(0, $"<i data-ctx='{ctx.InRange}-{string.Join(",", ctx.Ranges.Select(r => r.Kind))}'></i>"));
        });

        Assert.Equal("True-holiday", Cell(cut, "2026-01-06").QuerySelector("[data-ctx]")!.GetAttribute("data-ctx"));
        Assert.Equal("True-", Cell(cut, "2026-01-07").QuerySelector("[data-ctx]")!.GetAttribute("data-ctx"));
    }

    // =====================================================================
    // Round 3 — day view, maxEvents, event drag-and-drop, title, weekends, multiple selection
    // =====================================================================

    private static readonly IReadOnlyList<CalendarEvent> ThreeEvents = new[]
    {
        new CalendarEvent { Id = "a", Date = "2026-01-06", Title = "A" },
        new CalendarEvent { Id = "b", Date = "2026-01-06", Title = "B" },
        new CalendarEvent { Id = "c", Date = "2026-01-06", Title = "C" },
    };

    private IRenderedComponent<CalendarView> RenderDay(Action<ComponentParameterCollectionBuilder<CalendarView>>? configure = null)
        => Render(CalendarViewMode.Day, "2026-01-06", p =>
        {
            p.Add(x => x.Today, "2026-01-08");
            p.Add(x => x.Labels, Labels with { DayView = "Day" });
            configure?.Invoke(p);
        });

    [Fact]
    public void Section_8_33_The_Day_View_Shows_Exactly_One_Day_Under_One_Weekday_Header()
    {
        var cut = RenderDay();
        Assert.Single(Cells(cut));
        Assert.Equal("2026-01-06", Cells(cut)[0].GetAttribute("data-date"));
        Assert.Single(cut.FindAll(".calendar-table-head .calendar-table-th"));
    }

    [Fact]
    public void Section_8_34_Labels_DayView_Adds_A_Pressed_Switcher_Button()
    {
        var cut = Render(CalendarViewMode.Week, "2026-01-06", p => p.Add(x => x.Labels, Labels with { DayView = "Day" }));
        Assert.Equal("false", Button(cut, "Day").GetAttribute("aria-pressed"));
        Button(cut, "Day").Click();
        Assert.Equal("true", Button(cut, "Day").GetAttribute("aria-pressed"));
        Assert.Single(Cells(cut));
    }

    [Fact]
    public void Section_8_35_Next_Steps_One_Day_And_Reports_The_One_Day_Period()
    {
        (CalendarViewMode View, string Start, string End)? last = null;
        var cut = RenderDay(p => p.Add(x => x.OnNavigate, EventCallback.Factory.Create<(CalendarViewMode, string, string)>(this, a => last = a)));
        Button(cut, "Next Day").Click();
        Assert.Equal("2026-01-07", Cells(cut)[0].GetAttribute("data-date"));
        Assert.Equal((CalendarViewMode.Day, "2026-01-07", "2026-01-07"), last);
    }

    [Fact]
    public void Section_8_36_Arrows_And_Page_Keys_Move_By_A_Day()
    {
        var cut = RenderDay();
        Key(cut, "ArrowRight");
        Assert.Equal("2026-01-07", Cells(cut)[0].GetAttribute("data-date"));
        Key(cut, "ArrowDown");
        Assert.Equal("2026-01-08", Cells(cut)[0].GetAttribute("data-date"));
        Key(cut, "PageUp");
        Assert.Equal("2026-01-07", Cells(cut)[0].GetAttribute("data-date"));
    }

    [Fact]
    public void Section_8_31_MaxEvents_Caps_The_Events_Shown_And_A_More_Button_Raises_OnMoreClick()
    {
        string? more = null;
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Events, ThreeEvents);
            p.Add(x => x.MaxEvents, 2);
            p.Add(x => x.Labels, Labels with { MoreEvents = (n, _) => $"+{n} more" });
            p.Add(x => x.OnMoreClick, EventCallback.Factory.Create<string>(this, d => more = d));
        });

        Assert.Equal(2, cut.FindAll(".calendar-view-event").Count);
        var button = cut.Find(".calendar-view-more-button");
        Assert.Equal("+1 more", button.TextContent.Trim());
        button.Click();
        Assert.Equal("2026-01-06", more);
    }

    [Fact]
    public void Section_8_32_Without_MaxEvents_Every_Event_Shows_And_There_Is_No_More_Button()
    {
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Events, ThreeEvents);
            p.Add(x => x.Labels, Labels with { MoreEvents = (n, _) => $"+{n} more" });
        });
        Assert.Equal(3, cut.FindAll(".calendar-view-event").Count);
        Assert.Empty(cut.FindAll(".calendar-view-more-button"));
    }

    [Fact]
    public async Task Section_8_38_Event_Buttons_Are_Draggable_Only_With_MoveEvents_And_A_Drop_Raises_OnEventMove()
    {
        var plain = Render(configure: p => p.Add(x => x.Events, ThreeEvents));
        Assert.Null(plain.Find(".calendar-view-event").GetAttribute("draggable"));

        (CalendarEvent Event, string ToDate)? moved = null;
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Events, ThreeEvents);
            p.Add(x => x.MoveEvents, true);
            p.Add(x => x.OnEventMove, EventCallback.Factory.Create<(CalendarEvent, string)>(this, a => moved = a));
        });
        var button = cut.Find(".calendar-view-event");
        Assert.Equal("true", button.GetAttribute("draggable"));
        await button.TriggerEventAsync("ondragstart", new DragEventArgs());
        await Cell(cut, "2026-01-09").TriggerEventAsync("ondrop", new DragEventArgs());

        Assert.Equal("a", moved?.Event.Id);
        Assert.Equal("2026-01-09", moved?.ToDate);
    }

    [Fact]
    public async Task Section_8_40_Alt_Arrow_On_A_Focused_Event_Moves_It_A_Day_Or_A_Week_And_A_Disabled_Day_Refuses()
    {
        var moves = new List<string>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.Events, ThreeEvents);
            p.Add(x => x.MoveEvents, true);
            p.Add(x => x.OnEventMove, EventCallback.Factory.Create<(CalendarEvent, string)>(this, a => moves.Add(a.Item2)));
        });
        await cut.Find(".calendar-view-event").TriggerEventAsync("onkeydown", new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        await cut.Find(".calendar-view-event").TriggerEventAsync("onkeydown", new KeyboardEventArgs { Key = "ArrowDown", AltKey = true });
        Assert.Equal(new[] { "2026-01-07", "2026-01-13" }, moves);

        var refused = new List<string>();
        var g = Render(configure: p =>
        {
            p.Add(x => x.Events, ThreeEvents);
            p.Add(x => x.MoveEvents, true);
            p.Add(x => x.MinDate, "2026-01-07");
            p.Add(x => x.OnEventMove, EventCallback.Factory.Create<(CalendarEvent, string)>(this, a => refused.Add(a.Item2)));
        });
        await g.Find(".calendar-view-event").TriggerEventAsync("onkeydown", new KeyboardEventArgs { Key = "ArrowLeft", AltKey = true });
        Assert.Empty(refused);
    }

    [Fact]
    public void Section_8_42_Labels_PeriodTitle_Renders_The_Shown_Periods_Title_And_Updates_On_Navigation()
    {
        var cut = RenderMonth(p => p.Add(x => x.Labels, Labels with { PeriodTitle = (v, s, e) => $"{v}:{s}..{e}" }));
        Assert.Equal("Month:2026-01-01..2026-01-31", cut.Find(".calendar-view-title").TextContent);
        Button(cut, "Next Month").Click();
        Assert.Equal("Month:2026-02-01..2026-02-28", cut.Find(".calendar-view-title").TextContent);
    }

    [Fact]
    public void Section_8_44_HideOutsideDays_Leaves_Outside_Cells_Empty_But_In_The_Grid()
    {
        var cut = RenderMonth(p => p.Add(x => x.HideOutsideDays, true));
        Assert.Equal("", cut.Find(".calendar-table-td[data-outside-period]").TextContent.Trim());
        Assert.Equal("15", Cell(cut, "2026-01-15").TextContent.Trim());
        Assert.Equal(42, Cells(cut).Count);
    }

    [Fact]
    public void Section_8_46_WeekendDays_Marks_Those_Weekdays_With_Data_Weekend()
    {
        var cut = Render(configure: p => p.Add(x => x.WeekendDays, new[] { 0, 6 }));
        Assert.NotNull(Cell(cut, "2026-01-10").GetAttribute("data-weekend"));
        Assert.NotNull(Cell(cut, "2026-01-11").GetAttribute("data-weekend"));
        Assert.Null(Cell(cut, "2026-01-07").GetAttribute("data-weekend"));
    }

    [Fact]
    public async Task Section_8_48_Multiple_Selection_Toggles_Days_And_Enter_Toggles_The_Cursor_Day()
    {
        var clicks = new List<string>();
        var cut = Render(configure: p =>
        {
            p.Add(x => x.MultipleSelection, true);
            p.Add(x => x.OnDayClick, EventCallback.Factory.Create<string>(this, d => clicks.Add(d)));
        });
        await Cell(cut, "2026-01-06").ClickAsync(new MouseEventArgs());
        await Cell(cut, "2026-01-08").ClickAsync(new MouseEventArgs());
        Assert.NotNull(Cell(cut, "2026-01-06").GetAttribute("data-selected"));
        Assert.NotNull(Cell(cut, "2026-01-08").GetAttribute("data-selected"));
        await Cell(cut, "2026-01-06").ClickAsync(new MouseEventArgs());
        Assert.Null(Cell(cut, "2026-01-06").GetAttribute("data-selected"));
        Key(cut, "Enter");
        Assert.Equal("2026-01-06", clicks[^1]);
    }

    // ---- Agenda view ----

    private IRenderedComponent<CalendarView> RenderAgenda(Action<ComponentParameterCollectionBuilder<CalendarView>>? configure = null)
        => Render(CalendarViewMode.Agenda, "2026-01-15", p =>
        {
            p.Add(x => x.Events, Events);
            p.Add(x => x.Today, "2026-01-09");
            configure?.Invoke(p);
        });

    [Fact]
    public void Agenda_Lists_Only_The_Days_With_Events_As_An_Ordered_List_Of_Time_Headings()
    {
        var cut = RenderAgenda();
        var items = cut.FindAll(".calendar-view-agenda-day");
        Assert.Equal(new[] { "2026-01-06", "2026-01-09", "2026-01-10", "2026-01-11" }, items.Select(li => li.GetAttribute("data-date")).ToArray());
        Assert.Equal("Appointments", cut.Find("ol.calendar-view-agenda").GetAttribute("aria-label"));
        Assert.Equal("2026-01-06", items[0].QuerySelector("time")!.GetAttribute("datetime"));
        Assert.Empty(cut.FindAll(".calendar-view-table"));
    }

    [Fact]
    public void Agenda_AgendaEmptyDays_Lists_Every_Day_Of_The_Month()
    {
        var cut = RenderAgenda(p => p.Add(x => x.AgendaEmptyDays, true));
        Assert.Equal(31, cut.FindAll(".calendar-view-agenda-day").Count);
    }

    [Fact]
    public void Agenda_Each_Event_Is_A_Button_That_Raises_OnEventClick_And_Today_Has_AriaCurrent()
    {
        string? clicked = null;
        var cut = RenderAgenda(p => p.Add(x => x.OnEventClick, EventCallback.Factory.Create<CalendarEvent>(this, e => clicked = e.Id)));
        cut.FindAll(".calendar-view-event").First(b => b.TextContent.Trim() == "Single-day").Click();
        Assert.Equal("e1", clicked);
        Assert.Equal("date", cut.Find("[data-date='2026-01-09']").GetAttribute("aria-current"));
    }

    [Fact]
    public void Agenda_AgendaEmpty_Shows_For_An_Empty_Month_The_Switcher_Selects_The_View_And_Next_Steps_A_Month()
    {
        (CalendarViewMode View, string Start, string End) last = default;
        var cut = Render(CalendarViewMode.Agenda, "2026-01-15", p =>
        {
            p.Add(x => x.Labels, Labels with { AgendaView = "Agenda", AgendaEmpty = "Nothing this month" });
            p.Add(x => x.OnNavigate, EventCallback.Factory.Create<(CalendarViewMode View, string Start, string End)>(this, e => last = e));
        });
        Assert.Equal("Nothing this month", cut.Find(".calendar-view-agenda-empty").TextContent.Trim());
        Assert.Equal("true", cut.FindAll("button").First(b => b.TextContent.Trim() == "Agenda").GetAttribute("aria-pressed"));
        cut.Find(".calendar-view-next-button").Click();
        Assert.Equal((CalendarViewMode.Agenda, "2026-02-01", "2026-02-28"), last);
    }

    [Fact]
    public void Agenda_PeriodRange_Treats_Agenda_As_The_Month_And_PeriodDays_Is_Empty()
    {
        Assert.Equal(("2026-01-01", "2026-01-31"), CalendarView.PeriodRange(CalendarViewMode.Agenda, "2026-01-15", 0));
        Assert.Empty(CalendarView.PeriodDays(CalendarViewMode.Agenda, "2026-01-15", 0));
    }
}
