// GanttChart tests — one or more [Fact]s per spec/index.md §8 acceptance
// clause, mirroring the canonical Svelte suite's own §8 numbering
// (GanttChart.test.ts). Selectors are read from the actual rendered
// markup (GanttChart.razor / the headless GanttTable family / the
// composed sibling DateTimePicker), not guessed.

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

public class GanttChartTests : TestContext
{
    private static readonly GanttRange Range = new() { Start = "2026-10-01", End = "2026-10-10" };

    private static readonly IReadOnlyList<GanttTask> Tasks = new[]
    {
        new GanttTask { Id = "design", Label = "Design", Start = "2026-10-01", End = "2026-10-03" },
        new GanttTask { Id = "build", Label = "Build", Start = "2026-10-04", End = "2026-10-06", DependsOn = new[] { "design" }, PercentComplete = 40 },
        new GanttTask { Id = "launch", Label = "Launch", Start = "2026-10-07", End = "2026-10-07" }, // milestone
        new GanttTask { Id = "parent", Label = "Phase 1", Start = "2026-10-01", End = "2026-10-01" },
        new GanttTask { Id = "child1", Label = "Child A", Start = "2026-10-08", End = "2026-10-08", ParentId = "parent" },
        new GanttTask { Id = "child2", Label = "Child B", Start = "2026-10-09", End = "2026-10-09", ParentId = "parent" },
    };

    private static readonly DateTimePickerLabels DtpLabels = new()
    {
        PreviousYear = "Previous year",
        PreviousMonth = "Previous month",
        PreviousWeek = "Previous week",
        PreviousDay = "Previous day",
        NextDay = "Next day",
        NextWeek = "Next week",
        NextMonth = "Next month",
        NextYear = "Next year",
        Confirm = "Confirm",
        Cancel = "Cancel",
    };

    private static readonly GanttLabels Labels = new()
    {
        ColumnLabel = (start, _, _) => start,
        StartLabel = "Start date",
        EndLabel = "End date",
        DateTimePickerLabels = DtpLabels,
        SaveLabel = "Save",
        CancelLabel = "Cancel",
        DependencySummary = preds => $"Blocked by: {string.Join(", ", preds)}",
        DateAnnouncement = (title, start, end) => $"{title} moved to {start} - {end}",
        CollapseButton = (task, collapsed) => collapsed ? $"Expand {task.Label}" : $"Collapse {task.Label}",
    };

    public GanttChartTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    private IRenderedComponent<GanttChart> RenderDefault(
        GanttLabels? labels = null,
        EventCallback<(string, string, string)>? onTaskChange = null,
        string? today = null)
        => RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, Tasks);
            if (labels is not null) p.Add(x => x.Labels, labels);
            if (onTaskChange is not null) p.Add(x => x.OnTaskChange, onTaskChange.Value);
            if (today is not null) p.Add(x => x.Today, today);
        });

    private static IReadOnlyList<AngleSharp.Dom.IElement> Rows(IRenderedComponent<GanttChart> cut)
        => cut.FindAll(".gantt-table-tbody > .gantt-table-tr");

    private static IReadOnlyList<AngleSharp.Dom.IElement> TabbableCells(IRenderedComponent<GanttChart> cut)
        => cut.FindAll(".gantt-table-td[tabindex='0']");

    // =====================================================================
    // Pure helpers — civil-date arithmetic, column generation, hierarchy.
    // =====================================================================

    [Fact]
    public void CompareIso_Orders_Iso_Date_Strings()
    {
        Assert.True(GanttChart.CompareIso("2026-10-01", "2026-10-02") < 0);
        Assert.True(GanttChart.CompareIso("2026-10-02", "2026-10-01") > 0);
        Assert.Equal(0, GanttChart.CompareIso("2026-10-01", "2026-10-01"));
    }

    [Fact]
    public void AddDays_Is_Utc_Safe_Across_A_Month_Boundary()
        => Assert.Equal("2026-11-02", GanttChart.AddDays("2026-10-30", 3));

    [Fact]
    public void EndOfMonth_Returns_The_Last_Calendar_Day_Of_The_Month()
    {
        Assert.Equal("2026-02-28", GanttChart.EndOfMonth("2026-02-05")); // 2026 is not a leap year
        Assert.Equal("2026-10-31", GanttChart.EndOfMonth("2026-10-15"));
    }

    [Fact]
    public void GenerateColumns_Produces_One_Column_Per_Day_Across_The_Range()
    {
        var columns = GanttChart.GenerateColumns(Range, GanttTimeUnit.Day);
        Assert.Equal(10, columns.Count);
        Assert.Equal("2026-10-01", columns[0].Start);
        Assert.Equal("2026-10-01", columns[0].End);
        Assert.Equal("2026-10-10", columns[9].Start);
        Assert.Equal("2026-10-10", columns[9].End);
    }

    [Fact]
    public void GenerateColumns_Produces_SevenDay_Columns_For_Week_Clamped_To_Range_End()
    {
        var columns = GanttChart.GenerateColumns(Range, GanttTimeUnit.Week);
        Assert.Equal("2026-10-01", columns[0].Start);
        Assert.Equal("2026-10-07", columns[0].End);
        Assert.Equal("2026-10-08", columns[1].Start);
        Assert.Equal("2026-10-10", columns[1].End); // clamped
    }

    [Fact]
    public void GenerateColumns_Produces_CalendarMonth_Columns_For_Month()
    {
        var range = new GanttRange { Start = "2026-10-15", End = "2026-11-15" };
        var columns = GanttChart.GenerateColumns(range, GanttTimeUnit.Month);
        Assert.Equal("2026-10-15", columns[0].Start);
        Assert.Equal("2026-10-31", columns[0].End);
        Assert.Equal("2026-11-01", columns[1].Start);
        Assert.Equal("2026-11-15", columns[1].End);
    }

    [Fact]
    public void FlattenTasks_Orders_Rows_DepthFirst_And_Skips_Collapsed_Subtrees()
    {
        var flat = GanttChart.FlattenTasks(Tasks, new HashSet<string>());
        Assert.Equal(new[] { "design", "build", "launch", "parent", "child1", "child2" }, flat.Select(r => r.Task.Id));
        Assert.True(flat.Single(r => r.Task.Id == "parent").HasChildren);
        Assert.False(flat.Single(r => r.Task.Id == "design").HasChildren);

        var collapsedFlat = GanttChart.FlattenTasks(Tasks, new HashSet<string> { "parent" });
        Assert.Equal(new[] { "design", "build", "launch", "parent" }, collapsedFlat.Select(r => r.Task.Id));
    }

    [Fact]
    public void EffectiveRange_Derives_A_Parents_Start_End_From_Its_Descendants()
    {
        var range = GanttChart.EffectiveRange(Tasks.Single(t => t.Id == "parent"), Tasks);
        Assert.Equal("2026-10-08", range.Start);
        Assert.Equal("2026-10-09", range.End);
    }

    // =====================================================================
    // §8.1-§8.4 — markup
    // =====================================================================

    [Fact]
    public void Section_8_1_Renders_Root_Wrapping_Role_Grid_Labelled_By_Label()
    {
        var cut = RenderDefault();
        Assert.NotNull(cut.Find(".gantt-chart"));
        var grid = cut.Find("[role='grid']");
        Assert.Equal("Q4 plan", grid.GetAttribute("aria-label"));
    }

    [Fact]
    public void Section_8_1_Cells_Carry_Gridcell_Role_Not_The_Headless_Default_Of_Grid()
    {
        // Real bug found while composing this catalog's headless
        // GanttTable family: GanttTableTD.razor hardcodes role="grid" on
        // its own <td> (invalid — a grid cell nested inside a grid should
        // be role="gridcell"). Overridden here via the same
        // last-attribute-wins splat mechanism KanbanBoard uses; verified
        // against the actual rendered DOM, not just that it compiles.
        var cut = RenderDefault();
        var cell = cut.Find(".gantt-table-td");
        Assert.Equal("gridcell", cell.GetAttribute("role"));
    }

    [Fact]
    public void Section_8_2_Renders_One_Column_Header_Per_Day_Across_The_Range()
    {
        var cut = RenderDefault(labels: Labels);
        var headers = cut.FindAll(".gantt-table-thead .gantt-table-th");
        Assert.Equal(11, headers.Count); // 10 day columns + 1 leading blank column
    }

    [Fact]
    public void Section_8_3_Tasks_Range_Marks_Overlapping_Cells_DataInRange()
    {
        var cut = RenderDefault();
        var designRow = Rows(cut)[0];
        var cells = designRow.QuerySelectorAll(".gantt-table-td");
        Assert.True(cells[0].HasAttribute("data-in-range")); // Oct 1
        Assert.True(cells[2].HasAttribute("data-in-range")); // Oct 3
        Assert.False(cells[3].HasAttribute("data-in-range")); // Oct 4
    }

    [Fact]
    public void Section_8_3_Milestone_Marks_Exactly_One_Cell_DataMilestone()
    {
        var cut = RenderDefault();
        var launchRow = Rows(cut)[2];
        var milestoneCells = launchRow.QuerySelectorAll(".gantt-table-td")
            .Where(c => c.HasAttribute("data-milestone")).ToList();
        Assert.Single(milestoneCells);
        Assert.Equal("6", milestoneCells[0].GetAttribute("data-col")); // Oct 7 = index 6
    }

    [Fact]
    public void Section_8_4_PercentComplete_Renders_Only_On_The_Leading_InRange_Cell()
    {
        var cut = RenderDefault();
        var buildRow = Rows(cut)[1];
        var bars = buildRow.QuerySelectorAll(".gantt-chart-bar");
        Assert.Single(bars);
        Assert.Equal("40", bars[0].GetAttribute("data-percent-complete"));
    }

    // =====================================================================
    // §8.5-§8.6 — row hierarchy
    // =====================================================================

    [Fact]
    public void Section_8_5_Parent_Rows_Cells_Reflect_Its_Derived_Range_Not_Its_Own_StartEnd()
    {
        var cut = RenderDefault();
        var parentRow = Rows(cut)[3];
        var cells = parentRow.QuerySelectorAll(".gantt-table-td");
        Assert.False(cells[0].HasAttribute("data-in-range")); // Oct 1 (parent's own start) not in derived range
        Assert.True(cells[7].HasAttribute("data-in-range")); // Oct 8 (child1)
        Assert.True(cells[8].HasAttribute("data-in-range")); // Oct 9 (child2)
    }

    [Fact]
    public async Task Section_8_6_Collapsing_A_Parent_Removes_Descendant_Rows_From_The_Dom_Outright()
    {
        var cut = RenderDefault(labels: Labels);
        Assert.Equal(6, Rows(cut).Count);

        var collapseButton = cut.FindAll("button.gantt-chart-collapse-button")
            .Single(b => b.GetAttribute("aria-label") == "Collapse Phase 1");
        Assert.Equal("true", collapseButton.GetAttribute("aria-expanded"));

        await collapseButton.ClickAsync(new MouseEventArgs());

        Assert.Equal(4, Rows(cut).Count);
        Assert.DoesNotContain("Child A", cut.Find(".gantt-chart").TextContent);
        var expandButton = cut.FindAll("button.gantt-chart-collapse-button")
            .Single(b => b.GetAttribute("aria-label") == "Expand Phase 1");
        Assert.Equal("false", expandButton.GetAttribute("aria-expanded"));
    }

    // =====================================================================
    // §8.7 — dependencies
    // =====================================================================

    [Fact]
    public void Section_8_7_Task_With_DependsOn_Carries_AriaDescribedby_To_A_Generated_Summary()
    {
        var cut = RenderDefault(labels: Labels);
        var buildRow = Rows(cut)[1];
        var described = buildRow.QuerySelector(".gantt-table-td[aria-describedby]");
        Assert.NotNull(described);
        var id = described!.GetAttribute("aria-describedby")!;
        Assert.Equal("Blocked by: Design", cut.Find($"#{id}").TextContent);
    }

    [Fact]
    public void Section_8_7_Task_With_No_Dependencies_Carries_No_AriaDescribedby()
    {
        var cut = RenderDefault(labels: Labels);
        var designRow = Rows(cut)[0];
        Assert.Null(designRow.QuerySelector(".gantt-table-td[aria-describedby]"));
    }

    // =====================================================================
    // §8.8 — roving-tabindex keyboard navigation
    // =====================================================================

    [Fact]
    public void Section_8_8_Exactly_One_Cell_Tabindex_Zero_Arrows_Move_And_Clamp()
    {
        var cut = RenderDefault();
        var cells = TabbableCells(cut);
        Assert.Single(cells);
        Assert.Equal("0", cells[0].GetAttribute("data-row"));
        Assert.Equal("0", cells[0].GetAttribute("data-col"));

        cells[0].KeyDown(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal("1", TabbableCells(cut).Single().GetAttribute("data-col"));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowLeft" });
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowLeft" });
        var afterClamp = TabbableCells(cut);
        Assert.Single(afterClamp);
        Assert.Equal("0", afterClamp[0].GetAttribute("data-col")); // clamped, not wrapped
    }

    // =====================================================================
    // §8.9-§8.11 — edit region
    // =====================================================================

    [Fact]
    public void Section_8_9_Enter_On_Focused_NonParent_Row_Opens_Edit_Region_With_Two_Date_Pickers()
    {
        var cut = RenderDefault(labels: Labels);
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });

        Assert.Contains(cut.FindAll("button"), b => b.GetAttribute("aria-label") == "Start date");
        Assert.Contains(cut.FindAll("button"), b => b.GetAttribute("aria-label") == "End date");
    }

    [Fact]
    public void Section_8_9_Editing_Does_Not_Open_When_DateTimePickerLabels_Absent()
    {
        var cut = RenderDefault();
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(cut.FindAll(".gantt-chart-edit-row"));
    }

    [Fact]
    public void Section_8_9_Enter_On_A_Parent_Row_Does_Not_Open_An_Edit_Region()
    {
        var cut = RenderDefault(labels: Labels);
        for (var i = 0; i < 3; i++)
        {
            TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        }
        Assert.Equal("3", TabbableCells(cut).Single().GetAttribute("data-row"));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(cut.FindAll(".gantt-chart-edit-row"));
    }

    [Fact]
    public async Task Section_8_10_Save_Calls_OnTaskChange_With_Tasks_Id_And_Edited_Dates_Then_Closes()
    {
        (string TaskId, string Start, string End)? captured = null;
        var cut = RenderDefault(
            labels: Labels,
            onTaskChange: EventCallback.Factory.Create<(string, string, string)>(this, args => captured = args));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var saveButton = cut.FindAll("button.gantt-chart-save-button").Single();
        await saveButton.ClickAsync(new MouseEventArgs());

        Assert.Equal(("design", "2026-10-01", "2026-10-03"), captured);
        Assert.Empty(cut.FindAll(".gantt-chart-edit-row"));
    }

    [Fact]
    public async Task Section_8_11_Cancel_Closes_Edit_Region_Without_Calling_OnTaskChange()
    {
        var called = false;
        var cut = RenderDefault(
            labels: Labels,
            onTaskChange: EventCallback.Factory.Create<(string, string, string)>(this, _ => called = true));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var cancelButton = cut.FindAll("button.gantt-chart-cancel-button").Single();
        await cancelButton.ClickAsync(new MouseEventArgs());

        Assert.False(called);
        Assert.Empty(cut.FindAll(".gantt-chart-edit-row"));
    }

    // =====================================================================
    // §8.12-§8.14 — pointer drag and announcements
    // =====================================================================

    [Fact]
    public async Task Section_8_12_Dropping_A_Tasks_Bar_On_Another_Column_Calls_OnTaskChange_Preserving_Duration()
    {
        (string TaskId, string Start, string End)? captured = null;
        var cut = RenderDefault(onTaskChange: EventCallback.Factory.Create<(string, string, string)>(this, args => captured = args));

        var bar = Rows(cut)[0].QuerySelector(".gantt-chart-bar")!;
        await bar.DragStartAsync(new DragEventArgs());

        var targetCell = Rows(cut)[0].QuerySelectorAll(".gantt-table-td")[5]; // Oct 6
        await targetCell.DropAsync(new DragEventArgs());

        // design was Oct1-Oct3 (2-day duration); dropped on Oct6 keeps that duration.
        Assert.Equal(("design", "2026-10-06", "2026-10-08"), captured);
    }

    [Fact]
    public async Task Section_8_13_Successful_Edit_Announces_Via_Labels_DateAnnouncement()
    {
        var cut = RenderDefault(labels: Labels);
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var saveButton = cut.FindAll("button.gantt-chart-save-button").Single();
        await saveButton.ClickAsync(new MouseEventArgs());

        Assert.Equal("Design moved to 2026-10-01 - 2026-10-03", cut.Find(".gantt-chart-status").TextContent);
    }

    [Fact]
    public void Section_8_14_Today_Marks_Its_Column_DataToday_Omitting_It_Marks_Nothing()
    {
        var cut = RenderDefault(today: "2026-10-05");
        var headers = cut.FindAll(".gantt-table-thead .gantt-table-th");
        Assert.True(headers[5].HasAttribute("data-today")); // Oct 5 = index 4 + 1 leading column
        cut.Dispose();

        var cutNoToday = RenderDefault();
        Assert.Empty(cutNoToday.FindAll("[data-today]"));
    }

    // =====================================================================
    // §8.15 — extra attributes
    // =====================================================================

    [Fact]
    public void Section_8_15_Extra_Attributes_Spread_Onto_Root()
    {
        var cut = RenderComponent<GanttChart>(p => p
            .Add(x => x.Label, "Q4 plan")
            .Add(x => x.Range, Range)
            .Add(x => x.Tasks, Tasks)
            .AddUnmatched("data-testid", "chart-root"));

        Assert.NotNull(cut.Find("[data-testid='chart-root']"));
    }
}
