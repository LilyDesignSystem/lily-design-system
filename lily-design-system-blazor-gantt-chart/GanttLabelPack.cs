// The Gantt chart's labels from a label pack. See LabelPacks.cs in LilyDesignSystem.Blazor.DataGrid.
//
// Not in a pack, because they depend on how the locale writes dates: ColumnLabel and DateTimePickerLabels. Build those with the
// culture and set them on the record the builder returns (`with { … }`).

using LilyDesignSystem.Blazor.Helpers;

namespace LilyDesignSystem.Blazor.Helpers;

public static class GanttLabelPack
{
    private const string H = "gantt-chart";

    private static string UnitId(GanttTimeUnit u) => u switch { GanttTimeUnit.Day => "day", GanttTimeUnit.Week => "week", _ => "month" };

    /// <summary>Builds <see cref="GanttLabels"/> from <paramref name="pack"/>. A key the pack lacks leaves its label null.</summary>
    public static GanttLabels ToGanttLabels(this LabelPack pack)
    {
        var headers = pack.Group(H, "exportHeaders");
        string? Header(string name) => headers is not null && headers.TryGetValue(name, out var v) ? v : null;
        return new GanttLabels
        {
            TaskColumnHeader = pack.Text(H, "taskColumnHeader"),
            ZoomIn = pack.Text(H, "zoomIn"),
            ZoomOut = pack.Text(H, "zoomOut"),
            ZoomAnnouncement = pack.Pick<GanttTimeUnit>(H, "zoomAnnouncement", UnitId, _ => Array.Empty<(string, object?)>()),
            EditButton = pack.Fn<GanttTask>(H, "editButton", t => new[] { ("task", (object?)LabelPack.OrId(t.Label, t.Id)) }),
            StartLabel = pack.Text(H, "startLabel"),
            EndLabel = pack.Text(H, "endLabel"),
            SaveLabel = pack.Text(H, "saveLabel"),
            CancelLabel = pack.Text(H, "cancelLabel"),
            CriticalLabel = pack.Text(H, "criticalLabel"),
            DependencySummary = pack.Fn<IReadOnlyList<string>>(H, "dependencySummary", tasks => new[] { ("tasks", (object?)tasks) }),
            DateAnnouncement = pack.Fn<string, string, string>(H, "dateAnnouncement", (t, s, e) => new[] { ("task", (object?)t), ("start", s), ("end", e) }),
            PercentLabel = pack.Text(H, "percentLabel"),
            DependencyDetail = pack.Pick<string, string, int>(H, "dependencyDetail", (_, type, _) => type, (p, _, lag) => new[] { ("predecessor", (object?)p), ("lag", lag) }),
            BaselineSummary = pack.Fn<string, GanttBaseline, int>(H, "baselineSummary", (t, b, v) => new[] { ("task", (object?)t), ("baselineStart", b.Start), ("baselineEnd", b.End), ("variance", v) }),
            CollapseButton = pack.Pick<GanttTask, bool>(H, "collapseButton", (_, collapsed) => collapsed ? "true" : "false", (t, _) => new[] { ("task", (object?)LabelPack.OrId(t.Label, t.Id)) }),
            ExpandAll = pack.Text(H, "expandAll"),
            CollapseAll = pack.Text(H, "collapseAll"),
            Export = pack.Text(H, "export"),
            ExportCsv = pack.Text(H, "exportCsv"),
            ExportTsv = pack.Text(H, "exportTsv"),
            ExportExcel = pack.Text(H, "exportExcel"),
            ExportAnnouncement = pack.Fn<DataGridExportFormat, int, string>(H, "exportAnnouncement", (f, n, name) => new[] { ("format", (object?)LabelPack.Id(f)), ("count", n), ("filename", name) }),
            ExportHeaders = Header("task") is { } task && Header("start") is { } start && Header("end") is { } end
                ? new GanttExportHeaders(task, start, end, Header("percentComplete"), Header("parent"), Header("dependsOn"), Header("baselineStart"), Header("baselineEnd"))
                : null,
            EditAnnouncement = pack.Fn<string, string, string>(H, "editAnnouncement", (t, f, x) => new[] { ("task", (object?)t), ("field", f), ("text", x) }),
            EditInvalid = pack.Fn<string, string>(H, "editInvalid", (t, f) => new[] { ("task", (object?)t), ("field", f) }),
            EditRefused = pack.Fn<string, string, string>(H, "editRefused", (t, f, m) => new[] { ("task", (object?)t), ("field", f), ("message", m) }),
            // The Blazor Gantt names these FieldUndoAnnouncement / FieldRedoAnnouncement; the pack, like Svelte, undoAnnouncement / redoAnnouncement.
            FieldUndoAnnouncement = pack.Fn<string, string, string>(H, "undoAnnouncement", (t, f, x) => new[] { ("task", (object?)t), ("field", f), ("text", x) }),
            FieldRedoAnnouncement = pack.Fn<string, string, string>(H, "redoAnnouncement", (t, f, x) => new[] { ("task", (object?)t), ("field", f), ("text", x) }),
            Search = pack.Text(H, "search"),
            SearchAnnouncement = pack.Fn<int, int>(H, "searchAnnouncement", (m, t) => new[] { ("matches", (object?)m), ("total", t) }),
            Copy = pack.Text(H, "copy"),
            CopyAnnouncement = pack.Fn<int>(H, "copyAnnouncement", n => new[] { ("count", (object?)n) }),
            CopyFailed = pack.Text(H, "copyFailed"),
        };
    }
}
