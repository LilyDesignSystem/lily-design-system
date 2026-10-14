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
}
