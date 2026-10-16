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
        Assert.Single(TabbableCells(cut));
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
        Assert.Single(TabbableCells(cut));
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
}
