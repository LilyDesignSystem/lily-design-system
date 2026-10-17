// The calendar's labels from a label pack. See LabelPacks.cs in LilyDesignSystem.Blazor.DataGrid.
//
// Not in a pack, because they depend on how the locale writes dates: Weekday, WeekdayAbbr, Day, PeriodAnnouncement, PeriodTitle,
// RangeAnnouncement and MoreEvents. Build those with the culture and set them on the record the builder returns (`with { … }`).

using LilyDesignSystem.Blazor.Helpers;

namespace LilyDesignSystem.Blazor.Helpers;

public static class CalendarLabelPack
{
    private const string H = "calendar";

    private static string ViewId(CalendarViewMode v) => v switch
    {
        CalendarViewMode.Day => "day",
        CalendarViewMode.Week => "week",
        CalendarViewMode.FourWeek => "four-week",
        CalendarViewMode.Month => "month",
        _ => "agenda",
    };

    /// <summary>Builds <see cref="CalendarViewLabels"/> from <paramref name="pack"/>. A key the pack lacks leaves its label null.</summary>
    public static CalendarViewLabels ToCalendarLabels(this LabelPack pack)
    {
        var headers = pack.Group(H, "exportHeaders");
        string? Header(string name) => headers is not null && headers.TryGetValue(name, out var v) ? v : null;
        return new CalendarViewLabels
        {
            DayView = pack.Text(H, "dayView"),
            WeekView = pack.Text(H, "weekView"),
            FourWeekView = pack.Text(H, "fourWeekView"),
            MonthView = pack.Text(H, "monthView"),
            AgendaView = pack.Text(H, "agendaView"),
            AgendaEmpty = pack.Text(H, "agendaEmpty"),
            Previous = pack.Pick<CalendarViewMode>(H, "previous", ViewId, _ => Array.Empty<(string, object?)>()),
            Next = pack.Pick<CalendarViewMode>(H, "next", ViewId, _ => Array.Empty<(string, object?)>()),
            Today = pack.Text(H, "today"),
            WeekNumberHeader = pack.Text(H, "weekNumberHeader"),
            WeekNumber = pack.Fn<int>(H, "weekNumber", w => new[] { ("week", (object?)w) }),
            EventMoveAnnouncement = pack.Fn<CalendarEvent, string>(H, "eventMoveAnnouncement", (e, d) => new[] { ("event", (object?)LabelPack.OrId(e.Title, e.Id)), ("date", d) }),
            Export = pack.Text(H, "export"),
            ExportCsv = pack.Text(H, "exportCsv"),
            ExportTsv = pack.Text(H, "exportTsv"),
            ExportExcel = pack.Text(H, "exportExcel"),
            ExportAnnouncement = pack.Fn<DataGridExportFormat, int, string>(H, "exportAnnouncement", (f, n, name) => new[] { ("format", (object?)LabelPack.Id(f)), ("count", n), ("filename", name) }),
            ExportHeaders = Header("title") is { } title && Header("start") is { } start && Header("end") is { } end ? new CalendarExportHeaders(title, start, end) : null,
            EditAnnouncement = pack.Fn<string, string, string>(H, "editAnnouncement", (e, f, t) => new[] { ("event", (object?)e), ("field", f), ("text", t) }),
            EditInvalid = pack.Fn<string, string>(H, "editInvalid", (e, f) => new[] { ("event", (object?)e), ("field", f) }),
            EditRefused = pack.Fn<string, string, string>(H, "editRefused", (e, f, m) => new[] { ("event", (object?)e), ("field", f), ("message", m) }),
            // The Blazor calendar names these FieldUndoAnnouncement / FieldRedoAnnouncement; the pack, like Svelte, undoAnnouncement / redoAnnouncement.
            FieldUndoAnnouncement = pack.Fn<string, string, string>(H, "undoAnnouncement", (e, f, t) => new[] { ("event", (object?)e), ("field", f), ("text", t) }),
            FieldRedoAnnouncement = pack.Fn<string, string, string>(H, "redoAnnouncement", (e, f, t) => new[] { ("event", (object?)e), ("field", f), ("text", t) }),
            Search = pack.Text(H, "search"),
            SearchAnnouncement = pack.Fn<int, int>(H, "searchAnnouncement", (m, t) => new[] { ("matches", (object?)m), ("total", t) }),
            Copy = pack.Text(H, "copy"),
            CopyAnnouncement = pack.Fn<int>(H, "copyAnnouncement", n => new[] { ("count", (object?)n) }),
            CopyFailed = pack.Text(H, "copyFailed"),
        };
    }
}
