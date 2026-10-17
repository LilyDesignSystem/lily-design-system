// The kanban board's labels from a label pack. See LabelPacks.cs in LilyDesignSystem.Blazor.DataGrid.

using LilyDesignSystem.Blazor.Helpers;

namespace LilyDesignSystem.Blazor.Helpers;

public static class KanbanLabelPack
{
    private const string H = "kanban-board";

    /// <summary>Builds <see cref="KanbanLabels"/> from <paramref name="pack"/>. A key the pack lacks leaves its label null.</summary>
    public static KanbanLabels ToKanbanLabels(this LabelPack pack)
    {
        var headers = pack.Group(H, "exportHeaders");
        string? Header(string name) => headers is not null && headers.TryGetValue(name, out var v) ? v : null;
        return new KanbanLabels
        {
            CardCount = pack.Fn<int>(H, "cardCount", n => new[] { ("count", (object?)n) }),
            OverLimit = pack.Fn<int, int>(H, "overLimit", (n, limit) => new[] { ("count", (object?)n), ("limit", limit) }),
            MoveButton = pack.Fn<KanbanCard>(H, "moveButton", c => new[] { ("card", (object?)LabelPack.OrId(c.Title, c.Id)) }),
            MoveMenuLabel = pack.Text(H, "moveMenuLabel"),
            MoveAnnouncement = pack.Fn<string, string>(H, "moveAnnouncement", (c, col) => new[] { ("card", (object?)c), ("column", col) }),
            MoveBlocked = pack.Fn<string, string>(H, "moveBlocked", (c, col) => new[] { ("card", (object?)c), ("column", col) }),
            ReorderAnnouncement = pack.Fn<string, int, int>(H, "reorderAnnouncement", (c, p, t) => new[] { ("card", (object?)c), ("position", p), ("total", t) }),
            CollapseColumn = pack.Pick<KanbanColumn, bool>(H, "collapseColumn", (_, collapsed) => collapsed ? "true" : "false", (col, _) => new[] { ("column", (object?)LabelPack.OrId(col.Title, col.Id)) }),
            AddCard = pack.Fn<KanbanColumn>(H, "addCard", col => new[] { ("column", (object?)LabelPack.OrId(col.Title, col.Id)) }),
            EmptyColumn = pack.Fn<KanbanColumn>(H, "emptyColumn", col => new[] { ("column", (object?)LabelPack.OrId(col.Title, col.Id)) }),
            MovePending = pack.Fn<string, string>(H, "movePending", (c, col) => new[] { ("card", (object?)c), ("column", col) }),
            MoveFailed = pack.Fn<string, string, Exception>(H, "moveFailed", (c, col, e) => new[] { ("card", (object?)c), ("column", col), ("error", e) }),
            CollapseLane = pack.Pick<KanbanLane, bool>(H, "collapseLane", (_, collapsed) => collapsed ? "true" : "false", (lane, _) => new[] { ("lane", (object?)LabelPack.OrId(lane.Title, lane.Id)) }),
            LaneCount = pack.Fn<KanbanLane, int>(H, "laneCount", (lane, n) => new[] { ("lane", (object?)LabelPack.OrId(lane.Title, lane.Id)), ("count", n) }),
            Search = pack.Text(H, "search"),
            TitleEditor = pack.Fn<string>(H, "titleEditor", t => new[] { ("title", (object?)t) }),
            TitleEditAnnouncement = pack.Fn<string, string>(H, "titleEditAnnouncement", (p, t) => new[] { ("previous", (object?)p), ("title", t) }),
            MoveManyAnnouncement = pack.Fn<int, string>(H, "moveManyAnnouncement", (n, col) => new[] { ("count", (object?)n), ("column", col) }),
            Undo = pack.Text(H, "undo"),
            UndoAnnouncement = pack.Fn<string, string>(H, "undoAnnouncement", (c, col) => new[] { ("card", (object?)c), ("column", col) }),
            UndoManyAnnouncement = pack.Fn<int>(H, "undoManyAnnouncement", n => new[] { ("count", (object?)n) }),
            ColumnMoveAnnouncement = pack.Fn<string, int, int>(H, "columnMoveAnnouncement", (col, p, n) => new[] { ("column", (object?)col), ("position", p), ("count", n) }),
            Export = pack.Text(H, "export"),
            ExportCsv = pack.Text(H, "exportCsv"),
            ExportTsv = pack.Text(H, "exportTsv"),
            ExportExcel = pack.Text(H, "exportExcel"),
            ExportAnnouncement = pack.Fn<DataGridExportFormat, int, string>(H, "exportAnnouncement", (f, n, name) => new[] { ("format", (object?)LabelPack.Id(f)), ("count", n), ("filename", name) }),
            ExportHeaders = Header("title") is { } title && Header("column") is { } column
                ? new KanbanExportHeaders(title, column, Header("lane"), Header("subtitle"), Header("badges"), Header("flag"))
                : null,
            EditAnnouncement = pack.Fn<string, string, string>(H, "editAnnouncement", (c, f, t) => new[] { ("card", (object?)c), ("field", f), ("text", t) }),
            EditInvalid = pack.Fn<string, string>(H, "editInvalid", (c, f) => new[] { ("card", (object?)c), ("field", f) }),
            EditRefused = pack.Fn<string, string, string>(H, "editRefused", (c, f, m) => new[] { ("card", (object?)c), ("field", f), ("message", m) }),
            FieldUndoAnnouncement = pack.Fn<string, string, string>(H, "fieldUndoAnnouncement", (c, f, t) => new[] { ("card", (object?)c), ("field", f), ("text", t) }),
            FieldRedoAnnouncement = pack.Fn<string, string, string>(H, "fieldRedoAnnouncement", (c, f, t) => new[] { ("card", (object?)c), ("field", f), ("text", t) }),
            SearchAnnouncement = pack.Fn<int, int>(H, "searchAnnouncement", (m, t) => new[] { ("matches", (object?)m), ("total", t) }),
            Copy = pack.Text(H, "copy"),
            CopyAnnouncement = pack.Fn<int>(H, "copyAnnouncement", n => new[] { ("count", (object?)n) }),
            CopyFailed = pack.Text(H, "copyFailed"),
        };
    }
}
