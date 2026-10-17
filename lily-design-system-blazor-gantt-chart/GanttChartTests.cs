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
    public void Section_8_8_Roving_Tab_Stop_Is_Not_Announced_As_Selection()
    {
        // Focus is not selection: the cursor cell is the tab stop only.
        var cut = RenderDefault();
        Assert.Single(cut.FindAll(".gantt-table-td[tabindex='0']"));
        Assert.Empty(cut.FindAll("td[aria-selected]"));
    }

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

    // =====================================================================
    // Focus, tab stop, hierarchy and edit edge cases
    // =====================================================================

    private IEnumerable<string> EvalScripts()
        => JSInterop.Invocations.Where(i => i.Identifier == "eval").Select(i => (string)i.Arguments[0]!);

    [Fact]
    public void Section_8_17_Depth_Is_A_Data_Depth_Attribute_Never_An_Inline_Style()
    {
        var cut = RenderDefault();
        var headers = Rows(cut).Select(r => r.QuerySelector(".gantt-table-th")!).ToList();
        Assert.Equal(new[] { "0", "0", "0", "0", "1", "1" }, headers.Select(h => h.GetAttribute("data-depth")));
        Assert.DoesNotContain(headers, h => h.HasAttribute("style"));
    }

    [Fact]
    public void Section_8_17_A_Task_Whose_ParentId_Names_No_Task_Renders_As_A_Top_Level_Row()
    {
        var orphan = new GanttTask { Id = "orphan", Label = "Orphan", Start = "2026-10-02", End = "2026-10-02", ParentId = "gone" };
        var rows = GanttChart.FlattenTasks(Tasks.Append(orphan).ToList(), new HashSet<string>());
        Assert.Contains(rows, r => r.Task.Id == "orphan" && r.Depth == 0);
    }

    [Fact]
    public void Section_8_17_A_ParentId_Cycle_Does_Not_Recurse_Forever()
    {
        var cycle = new[]
        {
            new GanttTask { Id = "a", Label = "A", Start = "2026-10-01", End = "2026-10-02", ParentId = "b" },
            new GanttTask { Id = "b", Label = "B", Start = "2026-10-03", End = "2026-10-04", ParentId = "a" },
        };
        var range = GanttChart.EffectiveRange(cycle[0], cycle);
        Assert.False(string.IsNullOrEmpty(range.Start));
    }

    [Fact]
    public void Section_8_8_When_Collapsing_Removes_The_Row_Under_The_Cursor_One_Cell_Stays_Tabbable()
    {
        var cut = RenderDefault(labels: Labels);
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "End", CtrlKey = true });
        Assert.Equal("5", TabbableCells(cut).Single().GetAttribute("data-row"));

        cut.Find("[aria-label='Collapse Phase 1']").Click();

        Assert.Equal(4, Rows(cut).Count);
        Assert.Single(cut.FindAll(".gantt-table-td[tabindex='0']"));
    }

    [Fact]
    public async Task Section_8_8_Focusing_A_Cell_By_Pointer_Moves_The_Cursor_There()
    {
        var cut = RenderDefault();
        var cell = Rows(cut)[2].QuerySelectorAll(".gantt-table-td")[4];
        await cell.TriggerEventAsync("onfocusin", new FocusEventArgs());

        var tabbable = TabbableCells(cut).Single();
        Assert.Equal("2", tabbable.GetAttribute("data-row"));
        Assert.Equal("4", tabbable.GetAttribute("data-col"));
    }

    [Fact]
    public void Section_8_9_Opening_The_Edit_Region_Moves_Focus_To_The_Start_Field()
    {
        var cut = RenderDefault(labels: Labels);
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });

        var startId = cut.Instance.EditStartInputId;
        Assert.NotNull(cut.Find($"#{startId}"));
        Assert.Contains(EvalScripts(), script => script.Contains(startId));
    }

    [Fact]
    public async Task Section_8_10_Save_And_Cancel_Return_Focus_To_The_Grid()
    {
        var cut = RenderDefault(labels: Labels);
        var cellId = TabbableCells(cut).Single().GetAttribute("id")!;

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var before = EvalScripts().Count();
        await cut.Find(".gantt-chart-save-button").ClickAsync(new MouseEventArgs());
        Assert.Contains(EvalScripts().Skip(before), script => script.Contains(cellId));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        before = EvalScripts().Count();
        await cut.Find(".gantt-chart-cancel-button").ClickAsync(new MouseEventArgs());
        Assert.Contains(EvalScripts().Skip(before), script => script.Contains(cellId));
    }

    [Fact]
    public async Task Section_8_10_A_Range_Entered_End_First_Is_Saved_Start_First()
    {
        (string, string, string)? captured = null;
        var cut = RenderDefault(
            labels: Labels,
            onTaskChange: EventCallback.Factory.Create<(string, string, string)>(this, args => captured = args));
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });

        var startField = cut.Find($"#{cut.Instance.EditStartInputId}");
        startField.Input("2026-10-09");
        startField.Blur();
        await cut.Find(".gantt-chart-save-button").ClickAsync(new MouseEventArgs());

        Assert.Equal(("design", "2026-10-03", "2026-10-09"), captured);
    }

    [Fact]
    public void Section_8_16_Controls_Whose_Labels_Are_Absent_Do_Not_Render_Unnamed()
    {
        var cut = RenderDefault(labels: new GanttLabels { DateTimePickerLabels = DtpLabels });
        Assert.Empty(cut.FindAll(".gantt-chart-collapse-button"));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(cut.FindAll(".gantt-chart-edit-row"));
    }

    [Fact]
    public void Section_8_16_Labels_TaskColumnHeader_Names_The_Leading_Header_Cell()
    {
        var cut = RenderDefault(labels: Labels with { TaskColumnHeader = "Task" });
        Assert.Equal("Task", cut.Find(".gantt-table-thead .gantt-table-th").TextContent.Trim());
    }

    // =====================================================================
    // Round 2 — progress field, baselines, typed dependencies
    // =====================================================================

    private IRenderedComponent<GanttChart> RenderWith(
        IReadOnlyList<GanttTask> tasks,
        GanttLabels labels,
        Action<ComponentParameterCollectionBuilder<GanttChart>>? configure = null)
        => RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, tasks);
            p.Add(x => x.Labels, labels);
            configure?.Invoke(p);
        });

    private static readonly GanttTask BaselineTask = new()
    {
        Id = "a", Label = "A", Start = "2026-10-04", End = "2026-10-06",
        Baseline = new GanttBaseline("2026-10-02", "2026-10-04"),
    };

    private static IReadOnlyList<AngleSharp.Dom.IElement> CellsOf(IRenderedComponent<GanttChart> cut, int row)
        => Rows(cut)[row].QuerySelectorAll(".gantt-table-td").ToList();

    [Fact]
    public void PercentLabel_Adds_A_Progress_Field_To_The_Edit_Region_And_Without_It_None_Renders()
    {
        var without = RenderDefault(labels: Labels);
        TabbableCells(without).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(without.FindAll(".gantt-chart-percent-input"));

        var with = RenderDefault(labels: Labels with { PercentLabel = "Percent complete" });
        TabbableCells(with).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Contains("Percent complete", with.Find(".gantt-chart-percent-label").TextContent);
    }

    [Fact]
    public async Task The_Progress_Field_Starts_At_PercentComplete_And_Save_Raises_OnTaskPercentChange()
    {
        (string TaskId, int Percent)? captured = null;
        var cut = RenderDefault(labels: Labels with { PercentLabel = "Percent complete" });
        cut.SetParametersAndRender(p => p.Add(x => x.OnTaskPercentChange, EventCallback.Factory.Create<(string, int)>(this, a => captured = a)));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("40", cut.Find(".gantt-chart-percent-input").GetAttribute("value"));
        cut.Find(".gantt-chart-percent-input").Change("75");
        await cut.Find("button.gantt-chart-save-button").ClickAsync(new MouseEventArgs());

        Assert.Equal(("build", 75), captured);
    }

    [Fact]
    public async Task Progress_Is_Clamped_To_0_100()
    {
        (string TaskId, int Percent)? captured = null;
        var cut = RenderDefault(labels: Labels with { PercentLabel = "Percent complete" });
        cut.SetParametersAndRender(p => p.Add(x => x.OnTaskPercentChange, EventCallback.Factory.Create<(string, int)>(this, a => captured = a)));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        cut.Find(".gantt-chart-percent-input").Change("250");
        await cut.Find("button.gantt-chart-save-button").ClickAsync(new MouseEventArgs());

        Assert.Equal(("design", 100), captured);
    }

    [Fact]
    public async Task Without_PercentLabel_Save_Raises_No_Percent_Change()
    {
        var raised = false;
        var cut = RenderDefault(labels: Labels);
        cut.SetParametersAndRender(p => p.Add(x => x.OnTaskPercentChange, EventCallback.Factory.Create<(string, int)>(this, _ => raised = true)));

        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        await cut.Find("button.gantt-chart-save-button").ClickAsync(new MouseEventArgs());

        Assert.False(raised);
    }

    [Fact]
    public void A_Baseline_Marks_The_Cells_It_Covers_With_Data_Baseline_Apart_From_The_Current_Span()
    {
        var cut = RenderWith(new[] { BaselineTask }, Labels);
        var cells = CellsOf(cut, 0);
        var withBaseline = Enumerable.Range(0, cells.Count).Where(i => cells[i].HasAttribute("data-baseline")).ToList();

        Assert.Equal(new[] { 1, 2, 3 }, withBaseline);
        Assert.True(cells[3].HasAttribute("data-in-range"));
        Assert.False(cells[1].HasAttribute("data-in-range"));
    }

    [Fact]
    public void BaselineSummary_Renders_Hidden_Text_With_The_Slip_And_Describes_The_Rows_Cells()
    {
        var cut = RenderWith(new[] { BaselineTask }, Labels with
        {
            BaselineSummary = (t, b, v) => $"{t}: planned {b.Start} to {b.End}, {v} days late",
        });
        var summary = cut.Find(".gantt-chart-baseline-summary");

        Assert.True(summary.HasAttribute("hidden"));
        Assert.Equal("A: planned 2026-10-02 to 2026-10-04, 2 days late", summary.TextContent.Trim());
        Assert.Contains(summary.Id!, CellsOf(cut, 0)[0].GetAttribute("aria-describedby"));
    }

    [Fact]
    public void A_Task_With_No_Baseline_Has_No_Baseline_Cells_Or_Summary()
    {
        var cut = RenderDefault(labels: Labels with { BaselineSummary = (_, _, _) => "x" });
        Assert.Empty(cut.FindAll("[data-baseline]"));
        Assert.Empty(cut.FindAll(".gantt-chart-baseline-summary"));
    }

    [Fact]
    public void Typed_Dependencies_Go_Through_DependencyDetail_And_Id_Only_Ones_Keep_The_Label()
    {
        var tasks = new[]
        {
            new GanttTask { Id = "a", Label = "Design", Start = "2026-10-01", End = "2026-10-02" },
            new GanttTask
            {
                Id = "b", Label = "Build", Start = "2026-10-03", End = "2026-10-04",
                DependsOn = new[] { "a" },
                Dependencies = new[] { new GanttDependency("a", "s2s", 2) },
            },
        };
        var cut = RenderWith(tasks, Labels with
        {
            DependencySummary = p => $"After: {string.Join("; ", p)}",
            DependencyDetail = (l, t, g) => $"{l} ({t}, lag {g})",
        });

        Assert.Equal("After: Design; Design (s2s, lag 2)", cut.Find(".gantt-chart-dependency-summary").TextContent.Trim());
    }

    [Fact]
    public void A_Typed_Dependency_Without_A_Type_Or_Lag_Defaults_To_E2s_And_0()
    {
        var tasks = new[]
        {
            new GanttTask { Id = "a", Label = "Design", Start = "2026-10-01", End = "2026-10-02" },
            new GanttTask { Id = "b", Label = "Build", Start = "2026-10-03", End = "2026-10-04", Dependencies = new[] { new GanttDependency("a") } },
        };
        var cut = RenderWith(tasks, Labels with
        {
            DependencySummary = p => string.Join(",", p),
            DependencyDetail = (l, t, g) => $"{l}/{t}/{g}",
        });

        Assert.Equal("Design/e2s/0", cut.Find(".gantt-chart-dependency-summary").TextContent.Trim());
    }

    // =====================================================================
    // Round 3 — zoom, resize handles, selection, Alt+Arrow, TaskAttributes
    // =====================================================================

    private static AngleSharp.Dom.IElement ZoomButton(IRenderedComponent<GanttChart> cut, string name)
        => cut.FindAll("button").First(b => b.GetAttribute("aria-label") == name);

    private static AngleSharp.Dom.IElement CellIn(IRenderedComponent<GanttChart> cut, int row, int col)
        => Rows(cut)[row].QuerySelectorAll(".gantt-table-td")[col];

    [Fact]
    public void No_Zoom_Buttons_Without_Labels_ZoomIn_Or_ZoomOut()
    {
        var cut = RenderDefault(labels: Labels);
        Assert.Empty(cut.FindAll(".gantt-chart-zoom"));
    }

    [Fact]
    public void Zoom_Out_Steps_To_Coarser_Columns_Announcing_Each_Unit_And_The_Buttons_Disable_At_The_Ends()
    {
        var cut = RenderDefault(labels: Labels with { ZoomIn = "Zoom in", ZoomOut = "Zoom out", ZoomAnnouncement = u => $"Showing {u}" });
        Assert.True(ZoomButton(cut, "Zoom in").HasAttribute("disabled"));
        var day = cut.FindAll(".gantt-table-thead .gantt-table-th").Count;
        ZoomButton(cut, "Zoom out").Click();
        Assert.True(cut.FindAll(".gantt-table-thead .gantt-table-th").Count < day);
        Assert.Equal("Showing Week", cut.Find(".gantt-chart-status").TextContent);
        ZoomButton(cut, "Zoom out").Click();
        Assert.True(ZoomButton(cut, "Zoom out").HasAttribute("disabled"));
        Assert.False(ZoomButton(cut, "Zoom in").HasAttribute("disabled"));
    }

    [Fact]
    public void A_Leaf_Tasks_Bar_Has_A_Start_Handle_And_The_Last_In_Range_Cell_An_End_Handle_None_When_Readonly_Or_For_A_Parent()
    {
        var cut = RenderDefault();
        Assert.NotNull(Rows(cut)[0].QuerySelector(".gantt-chart-bar-handle-start"));
        Assert.NotNull(CellIn(cut, 0, 2).QuerySelector(".gantt-chart-bar-handle-end"));
        Assert.Null(Rows(cut)[3].QuerySelector(".gantt-chart-bar-handle"));

        var ro = RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, Tasks);
            p.Add(x => x.Readonly, true);
        });
        Assert.Empty(ro.FindAll(".gantt-chart-bar-handle"));
    }

    [Fact]
    public async Task The_End_Handle_Extends_The_End_And_The_Start_Handle_Moves_The_Start_And_The_Range_Cannot_Invert()
    {
        var changes = new List<(string, string, string)>();
        var cut = RenderDefault(onTaskChange: EventCallback.Factory.Create<(string, string, string)>(this, a => changes.Add(a)));
        await CellIn(cut, 0, 2).QuerySelector(".gantt-chart-bar-handle-end")!.TriggerEventAsync("ondragstart", new DragEventArgs());
        await CellIn(cut, 0, 5).TriggerEventAsync("ondrop", new DragEventArgs());
        await Rows(cut)[0].QuerySelector(".gantt-chart-bar-handle-start")!.TriggerEventAsync("ondragstart", new DragEventArgs());
        await CellIn(cut, 0, 1).TriggerEventAsync("ondrop", new DragEventArgs());
        await Rows(cut)[0].QuerySelector(".gantt-chart-bar-handle-start")!.TriggerEventAsync("ondragstart", new DragEventArgs());
        await CellIn(cut, 0, 7).TriggerEventAsync("ondrop", new DragEventArgs());

        Assert.Equal(new[] { ("design", "2026-10-01", "2026-10-06"), ("design", "2026-10-02", "2026-10-03") }, changes);
    }

    [Fact]
    public async Task Clicking_A_Row_Selects_It_Again_Deselects_The_S_Key_Selects_And_SelectedTaskId_Starts_Selected()
    {
        var cut = RenderDefault();
        await CellIn(cut, 1, 0).ClickAsync(new MouseEventArgs());
        Assert.Equal("true", Rows(cut)[1].GetAttribute("aria-selected"));
        Assert.NotNull(Rows(cut)[1].GetAttribute("data-selected"));
        await CellIn(cut, 1, 0).ClickAsync(new MouseEventArgs());
        Assert.Null(Rows(cut)[1].GetAttribute("data-selected"));
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "s" });
        Assert.Equal("true", Rows(cut)[0].GetAttribute("aria-selected"));

        var g = RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, Tasks);
            p.Add(x => x.SelectedTaskId, "launch");
        });
        Assert.NotNull(Rows(g)[2].GetAttribute("data-selected"));
    }

    [Fact]
    public void Alt_Arrow_Shifts_The_Task_Alt_Shift_Arrow_Moves_The_End_Not_Before_The_Range_And_Readonly_Ignores()
    {
        var changes = new List<(string, string, string)>();
        var cut = RenderDefault(onTaskChange: EventCallback.Factory.Create<(string, string, string)>(this, a => changes.Add(a)));
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowLeft", AltKey = true });
        Assert.Empty(changes);
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        TabbableCells(cut).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true, ShiftKey = true });
        Assert.Equal(("design", "2026-10-02", "2026-10-04"), changes[0]);

        var roChanges = new List<(string, string, string)>();
        var ro = RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, Tasks);
            p.Add(x => x.Readonly, true);
            p.Add(x => x.OnTaskChange, EventCallback.Factory.Create<(string, string, string)>(this, a => roChanges.Add(a)));
        });
        TabbableCells(ro).Single().KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.Empty(roChanges);
    }

    [Fact]
    public void TaskAttributes_Adds_Attributes_To_Each_Tasks_Row()
    {
        var cut = RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, Tasks);
            p.Add(x => x.TaskAttributes, t => new Dictionary<string, object> { ["data-team"] = t.Id == "design" ? "ux" : "eng" });
        });
        Assert.Equal("ux", Rows(cut)[0].GetAttribute("data-team"));
        Assert.Equal("eng", Rows(cut)[1].GetAttribute("data-team"));
    }
}

public class GanttChartExtrasTests : TestContext
{
    private static readonly GanttRange Range = new() { Start = "2026-10-01", End = "2026-10-10" };

    private static readonly IReadOnlyList<GanttTask> Tasks = new[]
    {
        new GanttTask { Id = "design", Label = "Design", Start = "2026-10-01", End = "2026-10-03" },
        new GanttTask { Id = "parent", Label = "Phase 1", Start = "2026-10-01", End = "2026-10-01" },
        new GanttTask { Id = "child1", Label = "Child A", Start = "2026-10-08", End = "2026-10-08", ParentId = "parent" },
    };

    private static readonly DateTimePickerLabels DtpLabels = new()
    {
        PreviousYear = "Previous year", PreviousMonth = "Previous month", PreviousWeek = "Previous week",
        PreviousDay = "Previous day", NextDay = "Next day", NextWeek = "Next week",
        NextMonth = "Next month", NextYear = "Next year", Confirm = "Confirm", Cancel = "Cancel",
    };

    private static readonly GanttLabels Labels = new()
    {
        StartLabel = "Start date", EndLabel = "End date", DateTimePickerLabels = DtpLabels,
        SaveLabel = "Save", CancelLabel = "Cancel",
        CollapseButton = (task, collapsed) => collapsed ? $"Expand {task.Label}" : $"Collapse {task.Label}",
    };

    public GanttChartExtrasTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<GanttChart> Render(
        Action<ComponentParameterCollectionBuilder<GanttChart>>? configure = null,
        IReadOnlyList<GanttTask>? tasks = null)
        => RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, tasks ?? Tasks);
            p.Add(x => x.Labels, Labels);
            configure?.Invoke(p);
        });

    private static IReadOnlyList<AngleSharp.Dom.IElement> Heads(IRenderedComponent<GanttChart> cut)
        => cut.FindAll(".gantt-table-thead .gantt-table-th").Skip(1).ToList();

    [Fact]
    public void Markers_Mark_The_Containing_Column_And_A_Label_Renders_As_Text()
    {
        var cut = Render(p => p.Add(x => x.Markers, new[] { new GanttMarker { Date = "2026-10-05", Kind = "holiday", Label = "Bank holiday" } }));

        Assert.Equal("holiday", Heads(cut)[4].GetAttribute("data-marker"));
        Assert.Contains("Bank holiday", Heads(cut)[4].TextContent);
        Assert.False(Heads(cut)[3].HasAttribute("data-marker"));
        Assert.Equal(cut.FindAll(".gantt-table-tbody > .gantt-table-tr").Count, cut.FindAll(".gantt-table-td[data-marker]").Count);
    }

    [Fact]
    public void IsNonWorking_Marks_A_Column_Only_When_Every_Day_In_It_Is_Non_Working()
    {
        var cut = Render(p => p.Add(x => x.IsNonWorking, d => d == "2026-10-03" || d == "2026-10-04"));

        Assert.True(Heads(cut)[2].HasAttribute("data-non-working"));
        Assert.True(Heads(cut)[3].HasAttribute("data-non-working"));
        Assert.False(Heads(cut)[1].HasAttribute("data-non-working"));
    }

    [Fact]
    public void Week_Columns_Are_Non_Working_Only_If_All_Seven_Days_Are()
    {
        var cut = Render(p =>
        {
            p.Add(x => x.TimeUnit, GanttTimeUnit.Week);
            p.Add(x => x.IsNonWorking, d => d == "2026-10-03");
        });

        Assert.Empty(cut.FindAll(".gantt-table-thead [data-non-working]"));
    }

    [Fact]
    public void Task_Type_Critical_And_Slack_Become_Data_Attributes_On_The_Row()
    {
        var tasks = new[] { new GanttTask { Id = "a", Label = "A", Start = "2026-10-01", End = "2026-10-02", Type = "design", Critical = true, Slack = 2 } };
        var cut = Render(tasks: tasks);

        var row = cut.FindAll(".gantt-table-tbody > .gantt-table-tr")[0];
        Assert.Equal("design", row.GetAttribute("data-task-type"));
        Assert.True(row.HasAttribute("data-critical"));
        Assert.Equal("2", row.GetAttribute("data-slack"));
    }

    [Fact]
    public async Task Readonly_Opens_No_Edit_Region_Or_Drag_And_Navigation_And_Collapse_Still_Work()
    {
        var cut = Render(p => p.Add(x => x.Readonly, true));

        cut.FindAll(".gantt-table-td[tabindex='0']").Single().KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(cut.FindAll(".gantt-chart-edit-row"));
        Assert.Empty(cut.FindAll(".gantt-chart-bar[draggable='true']"));
        Assert.True(cut.Find("div.gantt-chart").HasAttribute("data-readonly"));

        cut.FindAll(".gantt-table-td[tabindex='0']").Single().KeyDown(new KeyboardEventArgs { Key = "ArrowRight" });
        Assert.Equal("1", cut.FindAll(".gantt-table-td[tabindex='0']").Single().GetAttribute("data-col"));

        await cut.Find("[aria-label='Collapse Phase 1']").ClickAsync(new MouseEventArgs());
        Assert.NotEmpty(cut.FindAll("[aria-label='Expand Phase 1']"));
    }

    // ---- Unscheduled tasks and collapse-all ----

    private static readonly IReadOnlyList<GanttTask> WithUnscheduled = new[]
    {
        new GanttTask { Id = "a", Label = "Alpha", Start = "2026-10-01", End = "2026-10-02" },
        new GanttTask { Id = "u", Label = "To be planned" },
    };

    private static readonly IReadOnlyList<GanttTask> WithParent = new[]
    {
        new GanttTask { Id = "design", Label = "Design", Start = "2026-10-01", End = "2026-10-03" },
        new GanttTask { Id = "parent", Label = "Phase 1", Start = "2026-10-01", End = "2026-10-01" },
        new GanttTask { Id = "child1", Label = "Child A", Start = "2026-10-08", End = "2026-10-08", ParentId = "parent" },
        new GanttTask { Id = "child2", Label = "Child B", Start = "2026-10-09", End = "2026-10-09", ParentId = "parent" },
    };

    private static AngleSharp.Dom.IElement? TaskRow(IRenderedComponent<GanttChart> cut, string id)
        => cut.FindAll($"[data-task-id='{id}']").FirstOrDefault();

    [Fact]
    public void Section_14_18_A_Task_With_No_Dates_Renders_A_Row_With_No_Bar_And_DataUnscheduled()
    {
        var cut = Render(tasks: WithUnscheduled);
        var row = TaskRow(cut, "u")!;
        Assert.NotNull(row.GetAttribute("data-unscheduled"));
        Assert.Empty(row.QuerySelectorAll(".gantt-chart-bar"));
        Assert.Empty(row.QuerySelectorAll("[data-in-range]"));
        Assert.Null(TaskRow(cut, "a")!.GetAttribute("data-unscheduled"));
    }

    [Fact]
    public void Section_14_19_An_Unscheduled_Child_Does_Not_Shape_Its_Parents_Span()
    {
        var tasks = new[]
        {
            new GanttTask { Id = "p", Label = "P" },
            new GanttTask { Id = "c1", Label = "C1", ParentId = "p", Start = "2026-10-03", End = "2026-10-04" },
            new GanttTask { Id = "c2", Label = "C2", ParentId = "p" },
        };
        Assert.Equal(new GanttDateRange("2026-10-03", "2026-10-04"), GanttChart.EffectiveRange(tasks[0], tasks));
    }

    [Fact]
    public void Section_14_20_Enter_On_An_Unscheduled_Task_Opens_The_Edit_Region_Save_Is_Disabled_Until_Both_Dates_Are_Set()
    {
        var cut = Render(tasks: WithUnscheduled);
        var cell = TaskRow(cut, "u")!.QuerySelector("[data-row][data-col='0']")!;
        cell.FocusIn(new FocusEventArgs());
        cell.KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.NotNull(cut.Find(".gantt-chart-save-button").GetAttribute("disabled"));
    }

    [Fact]
    public void Section_14_21_Alt_Arrow_On_An_Unscheduled_Task_Changes_Nothing()
    {
        var changed = false;
        var cut = Render(p => p.Add(x => x.OnTaskChange, EventCallback.Factory.Create<(string, string, string)>(this, _ => changed = true)), WithUnscheduled);
        var cell = TaskRow(cut, "u")!.QuerySelector("[data-row][data-col='0']")!;
        cell.FocusIn(new FocusEventArgs());
        cell.KeyDown(new KeyboardEventArgs { Key = "ArrowRight", AltKey = true });
        Assert.False(changed);
    }

    [Fact]
    public void Section_14_22_CollapsedTaskIds_Starts_Parents_Collapsed_And_The_Change_Is_Raised()
    {
        IReadOnlyList<string> changed = new List<string> { "unset" };
        var cut = Render(p =>
        {
            p.Add(x => x.CollapsedTaskIds, new[] { "parent" });
            p.Add(x => x.CollapsedTaskIdsChanged, EventCallback.Factory.Create<IReadOnlyList<string>>(this, v => changed = v));
        }, WithParent);
        Assert.Null(TaskRow(cut, "child1"));
        Assert.Equal("false", cut.Find("button[aria-label='Expand Phase 1']").GetAttribute("aria-expanded"));
        cut.Find("button[aria-label='Expand Phase 1']").Click();
        Assert.Empty(changed);
        Assert.NotNull(TaskRow(cut, "child1"));
    }

    [Fact]
    public void Section_14_23_CollapseAll_And_ExpandAll_Gate_Buttons_That_Collapse_And_Expand_Every_Parent()
    {
        var cut = RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, WithParent);
            p.Add(x => x.Labels, new GanttLabels { ExpandAll = "Expand all", CollapseAll = "Collapse all" });
        });
        Assert.NotNull(cut.Find(".gantt-chart-expand-all-button").GetAttribute("disabled"));
        cut.Find(".gantt-chart-collapse-all-button").Click();
        Assert.Null(TaskRow(cut, "child1"));
        Assert.NotNull(cut.Find(".gantt-chart-collapse-all-button").GetAttribute("disabled"));
        cut.Find(".gantt-chart-expand-all-button").Click();
        Assert.NotNull(TaskRow(cut, "child1"));
    }

    [Fact]
    public void Section_14_24_No_CollapseAll_Buttons_Without_Labels_Or_Without_Parents()
    {
        Assert.Empty(Render(tasks: WithParent).FindAll(".gantt-chart-collapse-all"));
        var noParents = RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4 plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, WithUnscheduled);
            p.Add(x => x.Labels, new GanttLabels { ExpandAll = "Expand all", CollapseAll = "Collapse all" });
        });
        Assert.Empty(noParents.FindAll(".gantt-chart-collapse-all"));
    }

    // =====================================================================
    // §14.25-§14.40 — typed fields, inline editing, export, virtualization
    // =====================================================================

    private static readonly IReadOnlyList<DataGridColumn> FieldDefs = new[]
    {
        new DataGridColumn { Id = "owner", Header = "Owner", Type = DataGridCellType.Select, Editable = true, Options = new[] { new DataGridOption("a", "Ann"), new DataGridOption("b", "Bo") } },
        new DataGridColumn { Id = "points", Header = "Points", Type = DataGridCellType.Number, Editable = true },
    };

    private static DataGridRow Values(params (string Key, object? Value)[] values)
        => new(values.Select(v => new KeyValuePair<string, object?>(v.Key, v.Value)));

    private static readonly IReadOnlyList<GanttTask> FieldTasks = new[]
    {
        new GanttTask { Id = "t1", Label = "Design", Start = "2026-10-01", End = "2026-10-03", PercentComplete = 50, Values = Values(("owner", "a"), ("points", 3)), Baseline = new GanttBaseline("2026-10-01", "2026-10-02") },
        new GanttTask { Id = "t2", Label = "Build =x", Start = "2026-10-04", End = "2026-10-06", DependsOn = new[] { "t1" }, Values = Values(("points", 5)) },
        new GanttTask { Id = "p", Label = "Phase" },
        new GanttTask { Id = "k", Label = "Kid", Start = "2026-10-08", End = "2026-10-09", ParentId = "p" },
    };

    private static readonly GanttLabels ExportLabels = new()
    {
        Export = "Export",
        ExportCsv = "CSV",
        ExportTsv = "TSV",
        ExportExcel = "Excel",
        ExportHeaders = new GanttExportHeaders("Task", "Start", "End", PercentComplete: "Done", Parent: "Parent", DependsOn: "After"),
        ExportAnnouncement = (format, count, name) => $"{count} tasks as {format.ToString().ToLowerInvariant()}: {name}",
        EditAnnouncement = (task, field, text) => $"{task} {field} is {text}",
        EditInvalid = (task, field) => $"{task}: bad {field}",
    };

    private IRenderedComponent<GanttChart> RenderFields(Action<ComponentParameterCollectionBuilder<GanttChart>>? configure = null, bool editable = true, List<GanttFieldEdit>? edits = null,
        IReadOnlyList<DataGridColumn>? fields = null, IReadOnlyList<GanttTask>? tasks = null, GanttLabels? labels = null)
        => RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, tasks ?? FieldTasks);
            p.Add(x => x.Fields, fields ?? FieldDefs);
            p.Add(x => x.Labels, labels ?? ExportLabels);
            if (editable) p.Add(x => x.OnFieldEdit, EventCallback.Factory.Create<GanttFieldEdit>(this, e => edits?.Add(e)));
            configure?.Invoke(p);
        });

    private static AngleSharp.Dom.IElement RowOf(IRenderedComponent<GanttChart> cut, string id) => cut.Find($"[data-task-id='{id}']");

    [Fact]
    public void Section_14_25_Each_Field_Is_A_Column_Between_The_Task_Name_And_The_Timeline()
    {
        var cut = RenderFields(editable: false);
        var heads = cut.FindAll(".gantt-table-thead th").Take(3).Select(e => e.TextContent.Trim()).ToArray();
        Assert.Equal(new[] { "", "Owner", "Points" }, heads);
        var cells = RowOf(cut, "t1").QuerySelectorAll("[data-field]").Select(c => c.TextContent.Trim()).ToArray();
        Assert.Equal(new[] { "Ann", "3" }, cells);
    }

    [Fact]
    public void Section_14_26_Fields_Are_Plain_Text_Without_A_Handler_And_In_A_Readonly_Chart()
    {
        Assert.Empty(RenderFields(editable: false).FindAll(".gantt-chart-field-button"));
        Assert.Empty(RenderFields(p => p.Add(x => x.Readonly, true)).FindAll(".gantt-chart-field-button"));
        Assert.NotEmpty(RenderFields().FindAll(".gantt-chart-field-button"));
    }

    [Fact]
    public void Section_14_27_Clicking_A_Value_Opens_A_Typed_Editor_And_Enter_Commits_The_Parsed_Value_And_Announces()
    {
        var edits = new List<GanttFieldEdit>();
        var cut = RenderFields(edits: edits);
        cut.FindAll("[data-task-id='t1'] .gantt-chart-field-button")[1].Click();
        var input = cut.Find("input.gantt-chart-field-editor");
        Assert.Equal("number", input.GetAttribute("type"));
        Assert.Equal("Points", input.GetAttribute("aria-label"));
        input.Input("8");
        input.KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var edit = Assert.Single(edits);
        Assert.Equal(("t1", "points"), (edit.TaskId, edit.FieldId));
        Assert.Equal(8.0, edit.Value);
        Assert.Equal(3, edit.Previous);
        Assert.Equal("Design Points is 8", cut.Find(".gantt-chart-status").TextContent);
        Assert.Empty(cut.FindAll(".gantt-chart-field-editor"));
    }

    [Fact]
    public void Section_14_28_A_Select_Field_Edits_Through_Its_Options()
    {
        var edits = new List<GanttFieldEdit>();
        var cut = RenderFields(edits: edits);
        cut.FindAll("[data-task-id='t2'] .gantt-chart-field-button")[0].Click();
        cut.Find("select.gantt-chart-field-editor").Change("b");
        var edit = Assert.Single(edits);
        Assert.Equal(("t2", "owner", "b"), (edit.TaskId, edit.FieldId, (string?)edit.Value));
        Assert.Null(edit.Previous);
    }

    [Fact]
    public void Section_14_29_Escape_Cancels_And_An_Unchanged_Value_Reports_Nothing()
    {
        var edits = new List<GanttFieldEdit>();
        var cut = RenderFields(edits: edits);
        void Open() => cut.FindAll("[data-task-id='t1'] .gantt-chart-field-button")[1].Click();
        Open();
        cut.Find(".gantt-chart-field-editor").Input("9");
        cut.Find(".gantt-chart-field-editor").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Open();
        cut.Find(".gantt-chart-field-editor").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(edits);
    }

    [Fact]
    public void Section_14_30_A_Number_That_Does_Not_Fit_The_Type_Is_Refused_The_Editor_Stays_Open_And_The_Refusal_Is_Announced()
    {
        var edits = new List<GanttFieldEdit>();
        var cut = RenderFields(edits: edits,
            fields: new[] { new DataGridColumn { Id = "p", Header = "P", Type = DataGridCellType.Number, Editable = true, Parse = (_, _) => double.NaN } },
            tasks: new[] { new GanttTask { Id = "t1", Label = "Design", Start = "2026-10-01", End = "2026-10-03", Values = Values(("p", 1)) } });
        cut.Find(".gantt-chart-field-button").Click();
        cut.Find(".gantt-chart-field-editor").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(edits);
        Assert.NotNull(cut.Find(".gantt-chart-field-editor"));
        Assert.Equal("Design: bad P", cut.Find(".gantt-chart-status").TextContent);
    }

    [Fact]
    public void Section_14_31_F2_Edits_The_First_Editable_Field_And_The_Editors_Keys_Do_Not_Reach_The_Grid()
    {
        var cut = RenderFields();
        cut.Find("[role='grid']").KeyDown(new KeyboardEventArgs { Key = "F2" });
        var editor = cut.Find(".gantt-chart-field-editor");
        Assert.Equal("SELECT", editor.TagName);
        editor.KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.Equal("0", cut.Find("[data-row='0'][data-col='0']").GetAttribute("tabindex"));
    }

    [Fact]
    public void Section_14_32_IME_Enter_While_Composing_Does_Not_Commit()
    {
        var edits = new List<GanttFieldEdit>();
        var cut = RenderFields(edits: edits,
            fields: new[] { new DataGridColumn { Id = "n", Header = "N", Editable = true } },
            tasks: new[] { new GanttTask { Id = "t1", Label = "Design", Start = "2026-10-01", End = "2026-10-03", Values = Values(("n", "a")) } });
        cut.Find(".gantt-chart-field-button").Click();
        var input = cut.Find(".gantt-chart-field-editor");
        input.Input("かな");
        input.KeyDown(new KeyboardEventArgs { Key = "Process" });
        Assert.Empty(edits);
        input.KeyDown(new KeyboardEventArgs { Key = "Enter" });
        var edit = Assert.Single(edits);
        Assert.Equal("かな", edit.Value);
        Assert.Equal("a", edit.Previous);
    }

    private (DataGridExport File, string Text) Exported(Action<ComponentParameterCollectionBuilder<GanttChart>>? configure = null, string format = "csv",
        IReadOnlyList<DataGridColumn>? fields = null, GanttLabels? labels = null)
    {
        DataGridExport? captured = null;
        var cut = RenderFields(p =>
        {
            p.Add(x => x.ExportHandler, file => { captured = file; return false; });
            configure?.Invoke(p);
        }, fields: fields, labels: labels);
        cut.Find($"[data-gantt-export-format='{format}']").Click();
        Assert.NotNull(captured);
        return (captured!, System.Text.Encoding.UTF8.GetString(captured!.Bytes));
    }

    [Fact]
    public void Section_14_33_Export_Buttons_Need_A_Label_And_ExportHeaders_Each_Label_Gates_Its_Button()
    {
        Assert.Empty(RenderFields(labels: new GanttLabels()).FindAll(".gantt-chart-export"));
        Assert.Empty(RenderFields(labels: new GanttLabels { ExportCsv = "CSV" }).FindAll(".gantt-chart-export"));
        var cut = RenderFields(labels: new GanttLabels { Export = "Export", ExportExcel = "Excel", ExportHeaders = ExportLabels.ExportHeaders });
        Assert.Equal("Export", cut.Find("[role='group'].gantt-chart-export").GetAttribute("aria-label"));
        Assert.Single(cut.FindAll(".gantt-chart-export-button"));
    }

    [Fact]
    public void Section_14_34_Csv_Holds_Task_Effective_Start_End_Percent_Parent_Predecessors_And_The_Fields()
    {
        var (file, text) = Exported();
        Assert.Equal("gantt-chart.csv", file.Filename);
        Assert.Equal(4, file.RowCount);
        var lines = text.Replace("\uFEFF", "").Split("\r\n");
        Assert.Equal("Task,Start,End,Done,Parent,After,Owner,Points", lines[0]);
        Assert.Equal("Design,2026-10-01,2026-10-03,50,,,Ann,3", lines[1]);
        Assert.Equal("Build =x,2026-10-04,2026-10-06,,,Design,,5", lines[2]);
        Assert.StartsWith("Phase,2026-10-08,2026-10-09,,,,", lines[3]);
        Assert.StartsWith("Kid,2026-10-08,2026-10-09,,Phase,,", lines[4]);
    }

    [Fact]
    public void Section_14_35_ExportScope_Visible_Leaves_Out_Tasks_Under_A_Collapsed_Parent()
    {
        var (file, _) = Exported(p => { p.Add(x => x.CollapsedTaskIds, new[] { "p" }); p.Add(x => x.ExportScope, GanttExportScope.Visible); });
        Assert.Equal(3, file.RowCount);
    }

    [Fact]
    public void Section_14_36_Baseline_Columns_And_Exportable_False()
    {
        var (_, text) = Exported(
            fields: new[] { FieldDefs[0] with { Exportable = false }, FieldDefs[1] },
            labels: ExportLabels with { ExportHeaders = ExportLabels.ExportHeaders! with { BaselineStart = "BS", BaselineEnd = "BE" } });
        var lines = text.Replace("\uFEFF", "").Split("\r\n");
        Assert.Equal("Task,Start,End,Done,Parent,After,BS,BE,Points", lines[0]);
        Assert.Equal("Design,2026-10-01,2026-10-03,50,,,2026-10-01,2026-10-02,3", lines[1]);
    }

    [Fact]
    public void Section_14_37_Saving_Announces_Unless_The_Handler_Vetoes_And_No_Tasks_Disables_The_Buttons()
    {
        var cut = RenderFields();
        cut.Find("[data-gantt-export-format='tsv']").Click();
        Assert.Equal("4 tasks as tsv: gantt-chart.tsv", cut.Find(".gantt-chart-status").TextContent);
        var empty = RenderFields(tasks: Array.Empty<GanttTask>());
        Assert.NotNull(empty.Find("[data-gantt-export-format='csv'][disabled]"));
    }

    private static readonly IReadOnlyList<GanttTask> Many = Enumerable.Range(0, 200)
        .Select(i => new GanttTask { Id = $"r{i}", Label = $"Task {i}", Start = "2026-10-01", End = "2026-10-02" }).ToList();

    [Fact]
    public void Section_14_38_Virtualize_Renders_Only_The_Rows_In_View_Plus_Spacers_With_AriaRowcount_And_AriaRowindex()
    {
        var cut = RenderFields(p => p.Add(x => x.Virtualize, new GanttVirtualize(20, 100, 1)), tasks: Many, fields: Array.Empty<DataGridColumn>());
        var rendered = cut.FindAll("tr[data-task-id]").Count;
        Assert.InRange(rendered, 1, 19);
        Assert.Equal("201", cut.Find(".gantt-table").GetAttribute("aria-rowcount"));
        Assert.Equal("2", cut.Find("[data-task-id='r0']").GetAttribute("aria-rowindex"));
        Assert.NotNull(cut.Find(".gantt-chart-spacer"));
        Assert.Contains("height: 100px", cut.Find(".gantt-chart-scroll").GetAttribute("style"));
    }

    [Fact]
    public void Section_14_39_Keyboard_Focus_To_The_Last_Row_Reveals_It()
    {
        var cut = RenderFields(p => p.Add(x => x.Virtualize, new GanttVirtualize(20, 100)), tasks: Many, fields: Array.Empty<DataGridColumn>());
        Assert.Empty(cut.FindAll("[data-task-id='r199']"));
        cut.Find("[role='grid']").KeyDown(new KeyboardEventArgs { Key = "End", CtrlKey = true });
        Assert.NotEmpty(cut.FindAll("[data-task-id='r199']"));
        Assert.Empty(cut.FindAll("tr[data-task-id='r1']")); // r0 left the window too, but only r199's row holds the tab stop now
    }

    [Fact]
    public void Section_14_40_Without_Virtualize_Every_Row_Renders_And_The_Roving_Tab_Stop_Stays_Unique()
    {
        var cut = RenderFields(tasks: Many, fields: Array.Empty<DataGridColumn>());
        Assert.Equal(200, cut.FindAll("tr[data-task-id]").Count);
        Assert.Single(cut.FindAll(".gantt-table-td[tabindex='0']"));
    }
}

// =====================================================================
// §17 weekend shading and dependency arrows (0.6.0)
// =====================================================================

public class GanttChartWeekendAndArrowTests : TestContext
{
    private static readonly GanttRange Range = new() { Start = "2026-10-01", End = "2026-10-10" };

    private static readonly IReadOnlyList<GanttTask> Tasks = new[]
    {
        new GanttTask { Id = "design", Label = "Design", Start = "2026-10-01", End = "2026-10-03" },
        new GanttTask { Id = "build", Label = "Build", Start = "2026-10-04", End = "2026-10-06", DependsOn = new[] { "design" } },
        new GanttTask { Id = "launch", Label = "Launch", Start = "2026-10-07", End = "2026-10-07" },
    };

    private static readonly GanttLabels Labels = new()
    {
        ColumnLabel = (start, _, _) => start,
        DependencySummary = preds => $"Blocked by: {string.Join(", ", preds)}",
    };

    public GanttChartWeekendAndArrowTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    /// <summary>What the browser's measuring call would return: design ends at x=60, build starts at x=60 one row down.</summary>
    private void Measured(string json)
        => JSInterop.Setup<string?>("eval", i => i.Arguments[0]?.ToString()?.Contains("getBoundingClientRect") == true).SetResult(json);

    private const string TwoBars = "{\"w\":400,\"h\":100,\"b\":{\"design\":[0,60,0,20],\"build\":[60,120,20,40]}}";

    private IRenderedComponent<GanttChart> Render(Action<ComponentParameterCollectionBuilder<GanttChart>>? configure = null, IReadOnlyList<GanttTask>? tasks = null, GanttRange? range = null)
        => RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Q4");
            p.Add(x => x.Range, range ?? Range);
            p.Add(x => x.Tasks, tasks ?? Tasks);
            p.Add(x => x.Labels, Labels);
            configure?.Invoke(p);
        });

    private static string[] WeekendHeads(IRenderedComponent<GanttChart> cut)
        => cut.FindAll("thead th[data-weekend]").Select(h => h.TextContent.Trim()).ToArray();

    // 2026-10-03 is a Saturday, 2026-10-04 a Sunday.
    [Fact]
    public void Section_17_1_Weekends_Marks_Day_Columns_On_The_Header_And_Every_Cell()
    {
        var cut = Render(p => p.Add(x => x.Weekends, new[] { 0, 6 }));
        Assert.Equal(new[] { "2026-10-03", "2026-10-04", "2026-10-10" }, WeekendHeads(cut));
        Assert.Equal(3 * Tasks.Count, cut.FindAll("tbody td[data-weekend]").Count);
    }

    [Fact]
    public void Section_17_2_Without_Weekends_Nothing_Is_Shaded()
        => Assert.Empty(Render().FindAll("[data-weekend]"));

    [Fact]
    public void Section_17_3_A_Friday_Saturday_Weekend_Shades_Those_Days_Instead()
        => Assert.Equal(new[] { "2026-10-02", "2026-10-03", "2026-10-09", "2026-10-10" }, WeekendHeads(Render(p => p.Add(x => x.Weekends, new[] { 5, 6 }))));

    [Fact]
    public void Section_17_4_Week_Columns_Are_Not_Marked()
    {
        var cut = Render(p =>
        {
            p.Add(x => x.TimeUnit, GanttTimeUnit.Week);
            p.Add(x => x.Weekends, new[] { 0, 6 });
        }, range: new GanttRange { Start = "2026-10-01", End = "2026-12-31" });
        Assert.Empty(cut.FindAll("[data-weekend]"));
    }

    [Fact]
    public void Section_17_5_Weekends_Combine_With_IsNonWorking()
    {
        var cut = Render(p =>
        {
            p.Add(x => x.Weekends, new[] { 6 });
            p.Add(x => x.IsNonWorking, d => d == "2026-10-03");
        });
        var th = cut.FindAll("thead th").First(h => h.TextContent.Trim() == "2026-10-03");
        Assert.True(th.HasAttribute("data-weekend") && th.HasAttribute("data-non-working"));
    }

    [Fact]
    public void Section_17_6_DependencyArrows_Draws_One_Aria_Hidden_Arrow_From_The_Predecessors_End_To_The_Dependents_Start()
    {
        Measured(TwoBars);
        var cut = Render(p => p.Add(x => x.DependencyArrows, true));
        cut.WaitForAssertion(() => Assert.Single(cut.FindAll(".gantt-chart-dependency-arrow")));
        Assert.Equal("true", cut.Find(".gantt-chart-dependency-arrows").GetAttribute("aria-hidden"));
        var arrow = cut.Find(".gantt-chart-dependency-arrow");
        Assert.Equal("design", arrow.GetAttribute("data-from"));
        Assert.Equal("build", arrow.GetAttribute("data-to"));
        Assert.Equal("e2s", arrow.GetAttribute("data-dependency-type"));
        Assert.Equal("M60 10H68V19H52V30H60", arrow.GetAttribute("d"));
    }

    [Fact]
    public void Section_17_7_The_Dependency_Stays_Available_As_Text()
    {
        Measured(TwoBars);
        var cut = Render(p => p.Add(x => x.DependencyArrows, true));
        cut.WaitForAssertion(() => Assert.NotEmpty(cut.FindAll(".gantt-chart-dependency-arrow")));
        Assert.Equal("Blocked by: Design", cut.Find(".gantt-chart-dependency-summary").TextContent.Trim());
    }

    [Fact]
    public void Section_17_8_Typed_Dependencies_Use_Their_Own_Edges_And_A_Missing_Predecessor_Draws_Nothing()
    {
        Measured("{\"w\":400,\"h\":100,\"b\":{\"a\":[0,60,0,20],\"b\":[100,140,20,40]}}");
        var tasks = new[]
        {
            new GanttTask { Id = "a", Label = "A", Start = "2026-10-01", End = "2026-10-03" },
            new GanttTask { Id = "b", Label = "B", Start = "2026-10-05", End = "2026-10-06", Dependencies = new[] { new GanttDependency("a", "s2s"), new GanttDependency("ghost") } },
        };
        var cut = Render(p => p.Add(x => x.DependencyArrows, true), tasks);
        cut.WaitForAssertion(() => Assert.Single(cut.FindAll(".gantt-chart-dependency-arrow")));
        Assert.Equal("s2s", cut.Find(".gantt-chart-dependency-arrow").GetAttribute("data-dependency-type"));
    }

    [Fact]
    public void Section_17_9_Without_DependencyArrows_There_Is_No_Overlay()
    {
        Measured(TwoBars);
        Assert.Empty(Render().FindAll(".gantt-chart-dependency-arrows"));
    }

    [Theory]
    [InlineData("e2s", "M50 10H58V40H70")]
    [InlineData("s2s", "M10 10H2V29H62V40H70")]
    [InlineData("e2e", "M50 10H58V29H128V40H120")]
    [InlineData("s2e", "M10 10H2V29H128V40H120")]
    public void Section_17_10_The_Path_Geometry_Matches_The_Svelte_Package(string kind, string expected)
        => Assert.Equal(expected, DependencyArrowGeometry.Path(kind, new ArrowBox(10, 50, 0, 20), new ArrowBox(70, 120, 30, 50)));

    [Fact]
    public void Section_17_11_The_Weekday_Of_An_Epoch_Day_Is_Right()
    {
        Assert.Equal(4, DependencyArrowGeometry.WeekdayOfEpochDay(0));
        Assert.Equal(3, DependencyArrowGeometry.WeekdayOfEpochDay(-1));
        Assert.Equal(6, DependencyArrowGeometry.WeekdayOfEpochDay(20456));
    }
}

