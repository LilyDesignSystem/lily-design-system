// CalendarView — code-behind. See spec/index.md for the contract.
//
// Ported from the canonical Svelte package (lily-design-system-svelte-calendar),
// translated to this catalog's own idioms: partial-class code-behind, bindable
// parameters as Value + ValueChanged pairs, AdditionalAttributes splatting for
// the roving-tabindex attributes the headless CalendarTableTD does not expose,
// and JS-eval-by-id focus calls (mirrors KanbanBoard and DateTimePicker).

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>Which period is shown.</summary>
public enum CalendarViewMode
{
    Week,
    FourWeek,
    Month,
}

/// <summary>A calendar event: a single-day <c>Date</c>, or an inclusive <c>Start</c>/<c>End</c> range.</summary>
public sealed class CalendarEvent
{
    /// <summary>Stable event identifier.</summary>
    public required string Id { get; init; }

    /// <summary>Single-day event date (ISO). Mutually exclusive with Start/End.</summary>
    public string? Date { get; init; }

    /// <summary>Multi-day event start (ISO, inclusive).</summary>
    public string? Start { get; init; }

    /// <summary>Multi-day event end (ISO, inclusive).</summary>
    public string? End { get; init; }

    /// <summary>Text for the default event button. Without it no default button renders.</summary>
    public string? Title { get; init; }
}

/// <summary>What the <c>Day</c> template receives for one day cell.</summary>
public sealed class CalendarDayContext
{
    public required string Date { get; init; }
    public required IReadOnlyList<CalendarEvent> Events { get; init; }
    public bool IsToday { get; init; }
    public bool OutsidePeriod { get; init; }
    public bool Selected { get; init; }
    public bool Disabled { get; init; }

    /// <summary>Call from an event's own click handler to raise <c>OnEventClick</c>.</summary>
    public required Func<CalendarEvent, Task> OpenEvent { get; init; }
}

/// <summary>
/// Every field is optional, but its presence gates the control it names — no
/// baked-in English fallback. See <c>spec/index.md</c>.
/// </summary>
public sealed record CalendarViewLabels
{
    public string? WeekView { get; init; }
    public string? FourWeekView { get; init; }
    public string? MonthView { get; init; }
    public Func<CalendarViewMode, string>? Previous { get; init; }
    public Func<CalendarViewMode, string>? Next { get; init; }
    public string? Today { get; init; }

    /// <summary>Announcement after navigation: (view, start, end).</summary>
    public Func<CalendarViewMode, string, string, string>? PeriodAnnouncement { get; init; }

    /// <summary>Full weekday name; 0 = Sunday … 6 = Saturday.</summary>
    public Func<int, string>? Weekday { get; init; }

    /// <summary>Short weekday form for the column header.</summary>
    public Func<int, string>? WeekdayAbbr { get; init; }

    /// <summary>Full accessible name for one day cell: (iso date, weekday, outside period).</summary>
    public Func<string, int, bool, string>? Day { get; init; }
}

public partial class CalendarView : ComponentBase
{
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the calendar, passed through to CalendarTable.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Which period is shown. Bindable: <c>@bind-View</c>.</summary>
    [Parameter] public CalendarViewMode View { get; set; } = CalendarViewMode.Month;
    [Parameter] public EventCallback<CalendarViewMode> ViewChanged { get; set; }

    /// <summary>ISO date the visible period is computed around. Bindable: <c>@bind-AnchorDate</c>.</summary>
    [Parameter] public string AnchorDate { get; set; } = "";
    [Parameter] public EventCallback<string> AnchorDateChanged { get; set; }

    /// <summary>ISO date the user has picked; distinct from the keyboard cursor. Bindable: <c>@bind-SelectedDate</c>.</summary>
    [Parameter] public string? SelectedDate { get; set; }
    [Parameter] public EventCallback<string?> SelectedDateChanged { get; set; }

    /// <summary>Events to place into day cells.</summary>
    [Parameter] public IReadOnlyList<CalendarEvent> Events { get; set; } = Array.Empty<CalendarEvent>();

    /// <summary>ISO date marking "today"; never computed internally (stays SSR-safe).</summary>
    [Parameter] public string? Today { get; set; }

    /// <summary>Earliest pickable ISO date.</summary>
    [Parameter] public string? MinDate { get; set; }

    /// <summary>Latest pickable ISO date.</summary>
    [Parameter] public string? MaxDate { get; set; }

    /// <summary>Extra disabled-day test. Disabled days stay focusable but cannot be picked.</summary>
    [Parameter] public Func<string, bool>? IsDisabled { get; set; }

    /// <summary>BCP 47 locale, passed to <c>DateTimePicker.FirstDayOfWeekFor</c>.</summary>
    [Parameter] public string? Locale { get; set; }

    [Parameter] public CalendarViewLabels Labels { get; set; } = new();

    /// <summary>Raised whenever the visible period changes: (view, start, end).</summary>
    [Parameter] public EventCallback<(CalendarViewMode View, string Start, string End)> OnNavigate { get; set; }

    /// <summary>Raised when an enabled day cell is activated (Enter/Space, or click).</summary>
    [Parameter] public EventCallback<string> OnDayClick { get; set; }

    /// <summary>Raised when an event is activated, via the default button or <c>CalendarDayContext.OpenEvent</c>.</summary>
    [Parameter] public EventCallback<CalendarEvent> OnEventClick { get; set; }

    /// <summary>Renders one day cell's content. Default: the day number plus a button per titled event.</summary>
    [Parameter] public RenderFragment<CalendarDayContext>? Day { get; set; }

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    // -------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------

    private readonly string _baseId = $"calendar-view-{Interlocked.Increment(ref _uid)}";
    private string? _cursor;
    private string _statusMessage = "";
    private bool _focusCursorPending;

    internal string RootId => $"{_baseId}-root";
    private string RootClass => $"calendar-view {CssClass}".Trim();
    private string CellId(string date) => $"{_baseId}-cell-{date}";

    private int FirstDay => DateTimePicker.FirstDayOfWeekFor(Locale);

    private string EffectiveAnchor => !string.IsNullOrEmpty(AnchorDate) ? AnchorDate : (!string.IsNullOrEmpty(Today) ? Today! : "1970-01-01");

    private string[][] Days => PeriodDays(View, EffectiveAnchor, FirstDay);

    // -------------------------------------------------------------------
    // Pure helpers (public so consumers can reuse them, as the other ports do)
    // -------------------------------------------------------------------

    /// <summary>Start of the week containing <paramref name="isoDate"/>, for a given first day of week (0 = Sunday).</summary>
    public static string WeekStart(string isoDate, int firstDayOfWeek)
    {
        var offset = (DateTimePicker.WeekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
        return DateTimePicker.AddDays(isoDate, -offset);
    }

    /// <summary>The visible days for <paramref name="view"/>, anchored around <paramref name="anchorDate"/>, as rows of 7.</summary>
    public static string[][] PeriodDays(CalendarViewMode view, string anchorDate, int firstDayOfWeek)
    {
        if (view == CalendarViewMode.Month)
        {
            var parsed = DateTimePicker.ParseIsoDate(anchorDate);
            if (parsed is null) return Array.Empty<string[]>();
            return DateTimePicker.MonthMatrix(parsed.Value.Year, parsed.Value.Month, firstDayOfWeek);
        }
        var start = WeekStart(anchorDate, firstDayOfWeek);
        var rows = view == CalendarViewMode.Week ? 1 : 4;
        var weeks = new string[rows][];
        for (var row = 0; row < rows; row++)
        {
            weeks[row] = new string[7];
            for (var col = 0; col < 7; col++) weeks[row][col] = DateTimePicker.AddDays(start, row * 7 + col);
        }
        return weeks;
    }

    /// <summary>The inclusive [start, end] ISO range <paramref name="view"/> covers.</summary>
    public static (string Start, string End) PeriodRange(CalendarViewMode view, string anchorDate, int firstDayOfWeek)
    {
        if (view == CalendarViewMode.Month)
        {
            var parsed = DateTimePicker.ParseIsoDate(anchorDate);
            if (parsed is null) return (anchorDate, anchorDate);
            var p = parsed.Value;
            return (
                DateTimePicker.FormatIsoDate(new CivilDate(p.Year, p.Month, 1)),
                DateTimePicker.FormatIsoDate(new CivilDate(p.Year, p.Month, DateTimePicker.DaysInMonth(p.Year, p.Month))));
        }
        var start = WeekStart(anchorDate, firstDayOfWeek);
        var len = view == CalendarViewMode.Week ? 7 : 28;
        return (start, DateTimePicker.AddDays(start, len - 1));
    }

    /// <summary>Whether <paramref name="isoDate"/> falls outside the anchor's own calendar month. Always false for week/four-week.</summary>
    public static bool IsOutsidePeriod(CalendarViewMode view, string isoDate, string anchorDate)
    {
        if (view != CalendarViewMode.Month) return false;
        var d = DateTimePicker.ParseIsoDate(isoDate);
        var a = DateTimePicker.ParseIsoDate(anchorDate);
        if (d is null || a is null) return false;
        return d.Value.Year != a.Value.Year || d.Value.Month != a.Value.Month;
    }

    /// <summary>Map each event to every ISO date it covers.</summary>
    public static IReadOnlyDictionary<string, IReadOnlyList<CalendarEvent>> EventsByDay(IReadOnlyList<CalendarEvent> events)
    {
        var map = new Dictionary<string, List<CalendarEvent>>();
        void Add(string iso, CalendarEvent e)
        {
            if (!map.TryGetValue(iso, out var list)) map[iso] = list = new List<CalendarEvent>();
            list.Add(e);
        }
        foreach (var e in events)
        {
            if (!string.IsNullOrEmpty(e.Date))
            {
                Add(e.Date!, e);
            }
            else if (!string.IsNullOrEmpty(e.Start) && !string.IsNullOrEmpty(e.End))
            {
                var cursor = e.Start!;
                var guard = 0;
                while (string.CompareOrdinal(cursor, e.End) <= 0 && guard++ < 10000)
                {
                    Add(cursor, e);
                    cursor = DateTimePicker.AddDays(cursor, 1);
                }
            }
        }
        return map.ToDictionary(kv => kv.Key, kv => (IReadOnlyList<CalendarEvent>)kv.Value);
    }

    // -------------------------------------------------------------------
    // Cursor and navigation
    // -------------------------------------------------------------------

    /// <summary>The roving cursor, kept inside the visible days when the period changes from outside.</summary>
    private string EffectiveCursor(string[][] weeks)
    {
        var flat = weeks.SelectMany(w => w).ToList();
        var cursor = _cursor ?? EffectiveAnchor;
        if (flat.Contains(cursor)) return cursor;
        return flat.Contains(EffectiveAnchor) ? EffectiveAnchor : (flat.Count > 0 ? flat[0] : cursor);
    }

    private bool IsDisabledDay(string isoDate)
    {
        if (!string.IsNullOrEmpty(MinDate) && string.CompareOrdinal(isoDate, MinDate) < 0) return true;
        if (!string.IsNullOrEmpty(MaxDate) && string.CompareOrdinal(isoDate, MaxDate) > 0) return true;
        return IsDisabled?.Invoke(isoDate) ?? false;
    }

    private async Task PickAsync(string isoDate)
    {
        if (IsDisabledDay(isoDate)) return;
        SelectedDate = isoDate;
        await SelectedDateChanged.InvokeAsync(isoDate);
        await OnDayClick.InvokeAsync(isoDate);
    }

    private Task OpenEventAsync(CalendarEvent calendarEvent) => OnEventClick.InvokeAsync(calendarEvent);

    private void Announce(CalendarViewMode view, string anchor)
    {
        if (Labels.PeriodAnnouncement is null) return;
        var (start, end) = PeriodRange(view, anchor, FirstDay);
        _statusMessage = Labels.PeriodAnnouncement(view, start, end);
    }

    private async Task NavigateToAsync(string nextAnchor)
    {
        AnchorDate = nextAnchor;
        await AnchorDateChanged.InvokeAsync(nextAnchor);
        var (start, end) = PeriodRange(View, nextAnchor, FirstDay);
        await OnNavigate.InvokeAsync((View, start, end));
        Announce(View, nextAnchor);
    }

    private async Task StepViewAsync(int delta)
    {
        var anchor = EffectiveAnchor;
        switch (View)
        {
            case CalendarViewMode.Week: await NavigateToAsync(DateTimePicker.AddDays(anchor, delta * 7)); break;
            case CalendarViewMode.FourWeek: await NavigateToAsync(DateTimePicker.AddDays(anchor, delta * 28)); break;
            default: await NavigateToAsync(DateTimePicker.AddMonths(anchor, delta)); break;
        }
    }

    private async Task GoTodayAsync()
    {
        if (string.IsNullOrEmpty(Today)) return;
        await NavigateToAsync(Today!);
    }

    private async Task SetViewAsync(CalendarViewMode next)
    {
        View = next;
        await ViewChanged.InvokeAsync(next);
        var (start, end) = PeriodRange(next, EffectiveAnchor, FirstDay);
        await OnNavigate.InvokeAsync((next, start, end));
        Announce(next, EffectiveAnchor);
    }

    /// <summary>Move the cursor, re-paging the visible period when it leaves it.</summary>
    private async Task MoveCursorAsync(string next)
    {
        _cursor = next;
        var anchor = EffectiveAnchor;
        if (View == CalendarViewMode.Month)
        {
            var cp = DateTimePicker.ParseIsoDate(next);
            var a = DateTimePicker.ParseIsoDate(anchor);
            if (cp is not null && a is not null && (cp.Value.Year != a.Value.Year || cp.Value.Month != a.Value.Month))
            {
                await NavigateToAsync(DateTimePicker.FormatIsoDate(new CivilDate(cp.Value.Year, cp.Value.Month, 1)));
            }
        }
        else
        {
            var len = View == CalendarViewMode.Week ? 7 : 28;
            var start = WeekStart(anchor, FirstDay);
            if (string.CompareOrdinal(next, start) < 0)
            {
                while (string.CompareOrdinal(next, start) < 0) start = DateTimePicker.AddDays(start, -7);
                await NavigateToAsync(start);
            }
            else
            {
                var end = DateTimePicker.AddDays(start, len - 1);
                if (string.CompareOrdinal(next, end) > 0)
                {
                    while (string.CompareOrdinal(next, end) > 0)
                    {
                        start = DateTimePicker.AddDays(start, 7);
                        end = DateTimePicker.AddDays(start, len - 1);
                    }
                    await NavigateToAsync(start);
                }
            }
        }
        // Focus follows the cursor after the render that flips tabindex lands.
        _focusCursorPending = true;
    }

    private async Task PageCursorAsync(int delta, string cursor)
    {
        switch (View)
        {
            case CalendarViewMode.Week: await MoveCursorAsync(DateTimePicker.AddDays(cursor, delta * 7)); break;
            case CalendarViewMode.FourWeek: await MoveCursorAsync(DateTimePicker.AddDays(cursor, delta * 28)); break;
            default: await MoveCursorAsync(DateTimePicker.AddMonths(cursor, delta)); break;
        }
    }

    private async Task OnGridKeyDownAsync(KeyboardEventArgs args)
    {
        var cursor = EffectiveCursor(Days);
        var offset = (DateTimePicker.WeekdayOf(cursor) - FirstDay + 7) % 7;
        switch (args.Key)
        {
            case "ArrowLeft": await MoveCursorAsync(DateTimePicker.AddDays(cursor, -1)); break;
            case "ArrowRight": await MoveCursorAsync(DateTimePicker.AddDays(cursor, 1)); break;
            case "ArrowUp": await MoveCursorAsync(DateTimePicker.AddDays(cursor, -7)); break;
            case "ArrowDown": await MoveCursorAsync(DateTimePicker.AddDays(cursor, 7)); break;
            case "Home": await MoveCursorAsync(DateTimePicker.AddDays(cursor, -offset)); break;
            case "End": await MoveCursorAsync(DateTimePicker.AddDays(cursor, 6 - offset)); break;
            case "PageUp": await PageCursorAsync(-1, cursor); break;
            case "PageDown": await PageCursorAsync(1, cursor); break;
            case "Enter":
            case " ":
                await PickAsync(cursor);
                break;
            case "t":
            case "T":
                if (string.IsNullOrEmpty(Today) || args.CtrlKey || args.MetaKey || args.AltKey) break;
                await NavigateToAsync(Today!);
                await MoveCursorAsync(Today!);
                break;
        }
    }

    private async Task OnDayCellClickAsync(string isoDate)
    {
        _cursor = isoDate;
        await PickAsync(isoDate);
    }

    // -------------------------------------------------------------------
    // Focus — deferred to after render, like KanbanBoard.
    // -------------------------------------------------------------------

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!_focusCursorPending) return;
        _focusCursorPending = false;
        var cursor = EffectiveCursor(Days);
        var script = $"document.getElementById({System.Text.Json.JsonSerializer.Serialize(CellId(cursor))})?.focus({{preventScroll:true}})";
        try
        {
            await JS.InvokeVoidAsync("eval", script);
        }
        catch
        {
            // ignore prerender / interop failure — see KanbanBoard's FocusActiveCellAsync.
        }
    }
}
