// GanttChart 0.7.0 feature tests — search, copy, keyboard (page keys, type-ahead, right-to-left), field validation and field-edit undo / redo.
// Numbered like the canonical Svelte suite's §14.100+ clauses.

using System.Collections.Generic;
using System.Linq;
using AngleSharp.Dom;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class GanttChartFeaturesTests : TestContext
{
    private static DataGridRow Values(params (string Key, object? Value)[] values)
        => new(values.Select(v => new KeyValuePair<string, object?>(v.Key, v.Value)));

    private static readonly GanttRange Range = new() { Start = "2026-10-01", End = "2026-10-10" };

    private static readonly IReadOnlyList<GanttTask> Tasks = new[]
    {
        new GanttTask { Id = "a", Label = "Design login", Start = "2026-10-01", End = "2026-10-03", Values = Values(("cost", 5)) },
        new GanttTask { Id = "b", Label = "Café menu", Start = "2026-10-04", End = "2026-10-06" },
        new GanttTask { Id = "c", Label = "Write docs", Start = "2026-10-07", End = "2026-10-08" },
    };

    private static readonly IReadOnlyList<DataGridColumn> Fields = new[]
    {
        new DataGridColumn { Id = "cost", Header = "Cost", Type = DataGridCellType.Number, Editable = true, Validate = (v, _) => v is double d && d < 0 ? "must not be negative" : null },
    };

    private static readonly GanttLabels Labels = new()
    {
        ColumnLabel = (start, _, _) => start,
        Search = "Search tasks",
        SearchAnnouncement = (m, t) => $"{m} of {t} tasks",
        Copy = "Copy",
        Export = "Export",
        CopyAnnouncement = n => $"{n} tasks copied",
        CopyFailed = "Copy failed",
        ExportHeaders = new GanttExportHeaders("Task", "Start", "End"),
        EditRefused = (task, field, message) => $"{task} {field}: {message}",
        FieldUndoAnnouncement = (task, field, text) => $"Undid {field}: {text}",
        FieldRedoAnnouncement = (task, field, text) => $"Redid {field}: {text}",
    };

    public GanttChartFeaturesTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    private IRenderedComponent<GanttChart> Render(Action<ComponentParameterCollectionBuilder<GanttChart>>? configure = null, IReadOnlyList<GanttTask>? tasks = null)
        => RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, tasks ?? Tasks);
            p.Add(x => x.Labels, Labels);
            configure?.Invoke(p);
        });

    private static string Status(IRenderedComponent<GanttChart> cut) => cut.Find(".gantt-chart-status").TextContent;
    private static IElement Active(IRenderedComponent<GanttChart> cut) => cut.Find(".gantt-table-td[tabindex='0']");
    private static KeyboardEventArgs Key(string key, bool ctrl = false, bool shift = false) => new() { Key = key, CtrlKey = ctrl, ShiftKey = shift };
    private static string Ids(IRenderedComponent<GanttChart> cut) => string.Join("|", cut.FindAll("[data-task-id]").Where(e => e.TagName == "TR").Select(e => e.GetAttribute("data-task-id")));

    [Fact]
    public void Section_14_100_Every_Search_Word_Must_Appear_Ignoring_Case_And_Diacritics()
    {
        var cut = Render();
        cut.Find(".gantt-chart-search").Input("LOGIN design");
        Assert.Equal("a", Ids(cut));
        cut.Find(".gantt-chart-search").Input("cafe");
        Assert.Equal("b", Ids(cut));
        Assert.Equal("1 of 3 tasks", Status(cut));
        Assert.Equal("search-input", cut.Find(".gantt-chart-search").ClassList.First());
    }

    [Fact]
    public void Section_14_101_Field_Text_Is_Searched_And_Escape_Clears()
    {
        var cut = Render(p => p.Add(x => x.Fields, Fields));
        cut.Find(".gantt-chart-search").Input("5");
        Assert.Contains("a", Ids(cut).Split('|'));
        Assert.DoesNotContain("c", Ids(cut).Split('|'));
        cut.Find(".gantt-chart-search").KeyDown(Key("Escape"));
        Assert.Equal("a|b|c", Ids(cut));
    }

    [Fact]
    public void Section_14_102_Copy_Puts_The_Tasks_On_The_Clipboard_Header_First_And_Announces()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", _ => true).SetVoidResult();
        DataGridCopy? seen = null;
        var cut = Render(p => p.Add(x => x.OnCopy, EventCallback.Factory.Create<DataGridCopy>(this, c => seen = c)));
        cut.Find("[data-gantt-export-format='copy']").Click();
        Assert.Equal("Task\tStart\tEnd", seen!.Text.Split("\r\n")[0]);
        Assert.Equal(3, seen.RowCount);
        Assert.Equal("3 tasks copied", Status(cut));
        Assert.Equal(seen.Text, JSInterop.Invocations["navigator.clipboard.writeText"].Single().Arguments[0]);
    }

    [Fact]
    public void Section_14_103_A_Refused_Clipboard_Announces_Failure_And_CopyHandler_Takes_Over()
    {
        JSInterop.SetupVoid("navigator.clipboard.writeText", _ => true).SetException(new InvalidOperationException("denied"));
        var cut = Render();
        cut.Find("[data-gantt-export-format='copy']").Click();
        Assert.Equal("Copy failed", Status(cut));
        var taken = Render(p => p.Add(x => x.CopyHandler, _ => false));
        taken.Find("[data-gantt-export-format='copy']").Click();
        Assert.Equal("", Status(taken));
    }

    [Fact]
    public void Section_14_104_Page_Keys_Clamp_And_Type_Ahead_Moves_To_The_Next_Matching_Row()
    {
        var cut = Render();
        Active(cut).KeyDown(Key("PageDown"));
        Assert.Equal("2", Active(cut).GetAttribute("data-row"));
        Active(cut).KeyDown(Key("Home", ctrl: true));
        Active(cut).KeyDown(Key("w"));
        Assert.Equal("2", Active(cut).GetAttribute("data-row"));
    }

    [Fact]
    public void Section_14_105_Right_To_Left_Swaps_The_Horizontal_Arrows()
    {
        var cut = Render(p => p.Add(x => x.Direction, "rtl"));
        Active(cut).KeyDown(Key("ArrowLeft"));
        Assert.Equal("1", Active(cut).GetAttribute("data-col"));
        Active(cut).KeyDown(Key("ArrowRight"));
        Assert.Equal("0", Active(cut).GetAttribute("data-col"));
    }

    private IRenderedComponent<GanttChart> RenderEditable(List<GanttFieldEdit> edits)
        => Render(p =>
        {
            p.Add(x => x.Fields, Fields);
            p.Add(x => x.OnFieldEdit, EventCallback.Factory.Create<GanttFieldEdit>(this, e => edits.Add(e)));
        });

    [Fact]
    public void Section_14_106_A_Value_Validate_Refuses_Keeps_The_Editor_Open_Invalid_And_Announces_The_Reason()
    {
        var edits = new List<GanttFieldEdit>();
        var cut = RenderEditable(edits);
        cut.Find("[data-task-id='a'] .gantt-chart-field-button").Click();
        var input = cut.Find("input.gantt-chart-field-editor");
        input.Input("-1");
        input.KeyDown(Key("Enter"));
        Assert.Empty(edits);
        Assert.Equal("true", cut.Find("input.gantt-chart-field-editor").GetAttribute("aria-invalid"));
        Assert.Equal("Design login Cost: must not be negative", Status(cut));
        cut.Find("input.gantt-chart-field-editor").Input("2");
        Assert.Null(cut.Find("input.gantt-chart-field-editor").GetAttribute("aria-invalid"));
    }

    [Fact]
    public void Section_14_107_Ctrl_Z_Reports_The_Earlier_Value_Through_OnFieldEdit_And_Redo_Re_Applies()
    {
        var edits = new List<GanttFieldEdit>();
        var cut = RenderEditable(edits);
        cut.Find("[data-task-id='a'] .gantt-chart-field-button").Click();
        var input = cut.Find("input.gantt-chart-field-editor");
        input.Input("9");
        input.KeyDown(Key("Enter"));
        Assert.Single(edits);
        Active(cut).KeyDown(Key("z", ctrl: true));
        Assert.Equal(2, edits.Count);
        Assert.Equal(5, Convert.ToInt32(edits[1].Value));
        Assert.Equal(9d, Convert.ToDouble(edits[1].Previous));
        Assert.Equal("Undid Cost: 5", Status(cut));
        Active(cut).KeyDown(Key("z", ctrl: true, shift: true));
        Assert.Equal(3, edits.Count);
        Assert.Equal(9d, Convert.ToDouble(edits[2].Value));
    }

    [Fact]
    public void Critical_Label_Is_Visible_Text_On_A_Critical_Task_Beside_Its_Unchanged_Label()
    {
        var tasks = new[]
        {
            new GanttTask { Id = "a", Label = "A", Start = "2026-10-01", End = "2026-10-02", Critical = true },
            new GanttTask { Id = "b", Label = "B", Start = "2026-10-03", End = "2026-10-04", DependsOn = new[] { "a" } },
        };
        var cut = RenderComponent<GanttChart>(p =>
        {
            p.Add(x => x.Label, "Plan");
            p.Add(x => x.Range, Range);
            p.Add(x => x.Tasks, tasks);
            p.Add(x => x.Labels, new GanttLabels { ColumnLabel = (start, _, _) => start, CriticalLabel = "Critical path", DependencySummary = l => "Depends on " + string.Join(", ", l) });
        });
        var found = cut.FindAll(".gantt-chart-critical-label");
        Assert.Single(found);
        Assert.Equal("Critical path", found[0].TextContent);
        Assert.Equal("Depends on A", cut.Find(".gantt-chart-dependency-summary").TextContent.Trim());
    }

    [Fact]
    public void Without_A_Critical_Label_No_Critical_Text_Renders()
    {
        var tasks = new[] { new GanttTask { Id = "a", Label = "A", Start = "2026-10-01", End = "2026-10-02", Critical = true } };
        var cut = Render(tasks: tasks);
        Assert.Empty(cut.FindAll(".gantt-chart-critical-label"));
    }
}
