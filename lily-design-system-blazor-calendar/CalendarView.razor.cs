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
    Day,
    Week,
    FourWeek,
    Month,
    /// <summary>The month as a list of the days that have events.</summary>
    Agenda,
}

/// <summary>A marked range (a holiday, a closure, a school term). <c>Label</c> is text a <c>Day</c> template can show.</summary>
public sealed record CalendarRange(string Start, string End, string? Kind = null, string? Label = null);

/// <summary>The user's picked range, inclusive.</summary>
public sealed record CalendarSelectedRange(string Start, string End);

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

    /// <summary>Inside the picked range.</summary>
    public bool InRange { get; init; }

    /// <summary>The marked ranges this day falls in.</summary>
    public IReadOnlyList<CalendarRange> Ranges { get; init; } = Array.Empty<CalendarRange>();

    /// <summary>The first <c>MaxEvents</c> events (all of them without the cap).</summary>
    public IReadOnlyList<CalendarEvent> VisibleEvents { get; init; } = Array.Empty<CalendarEvent>();

    /// <summary>How many events the cap hides, for a "+N more" control.</summary>
    public int HiddenCount { get; init; }

    /// <summary>Splat onto an event's element (<c>@attributes</c>) to make it draggable (<c>draggable</c>, <c>data-event-id</c>). Empty without <c>MoveEvents</c>.</summary>
    public Func<CalendarEvent, Dictionary<string, object>> EventAttributes { get; init; } = _ => new Dictionary<string, object>();

    /// <summary>Call from the event element's <c>@ondragstart</c> so a drop on a day moves it.</summary>
    public Action<CalendarEvent> BeginDrag { get; init; } = _ => { };

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

    /// <summary>Switcher label for the agenda (list) view of the month. Gates its button.</summary>
    public string? AgendaView { get; init; }

    /// <summary>Agenda view: the message when the shown month has no events (and <c>AgendaEmptyDays</c> is off). Gates the message.</summary>
    public string? AgendaEmpty { get; init; }
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

    /// <summary>Visible text for the week-number column header (e.g. "Wk").</summary>
    public string? WeekNumberHeader { get; init; }

    /// <summary>Accessible name for a week-number cell (e.g. "Week 3"). Without it the bare number is the name.</summary>
    public Func<int, string>? WeekNumber { get; init; }

    /// <summary>Announced as a range is extended with Shift+arrows or confirmed: (start, end).</summary>
    public Func<string, string, string>? RangeAnnouncement { get; init; }

    /// <summary>Switcher label for the one-day view. Gates its button.</summary>
    public string? DayView { get; init; }

    /// <summary>Announced after an event is moved to another day: (event, to date).</summary>
    public Func<CalendarEvent, string, string>? EventMoveAnnouncement { get; init; }

    /// <summary>Visible title of the shown period, rendered between the previous and next buttons: (view, start, end). Gates the title.</summary>
    public Func<CalendarViewMode, string, string, string>? PeriodTitle { get; init; }

    /// <summary>Text of the "+N more" button on a day that <c>MaxEvents</c> caps: (hidden count, date). Gates the button.</summary>
    public Func<int, string, string>? MoreEvents { get; init; }
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

    /// <summary>Show an ISO week-number column (a row header per week).</summary>
    [Parameter] public bool ShowWeekNumbers { get; set; }

    /// <summary>Marked ranges (holidays, closures): each day inside gets <c>data-range="{kind}"</c>.</summary>
    [Parameter] public IReadOnlyList<CalendarRange> Ranges { get; set; } = Array.Empty<CalendarRange>();

    /// <summary>The picked range. Shift+arrows extend it from the cursor; Shift+click picks one; Escape clears it. Bindable: <c>@bind-SelectedRange</c>.</summary>
    [Parameter] public CalendarSelectedRange? SelectedRange { get; set; }
    [Parameter] public EventCallback<CalendarSelectedRange?> SelectedRangeChanged { get; set; }

    /// <summary>Raised when a range is confirmed: Enter on an extended range, or Shift+click.</summary>
    [Parameter] public EventCallback<CalendarSelectedRange> OnRangeSelect { get; set; }

    /// <summary>Agenda view: also list days with no events. Default false (only days with events).</summary>
    [Parameter] public bool AgendaEmptyDays { get; set; }

    /// <summary>Cap on events shown per day; a day with more shows a "+N more" button (<c>Labels.MoreEvents</c>) that raises <c>OnMoreClick</c>.</summary>
    [Parameter] public int? MaxEvents { get; set; }

    /// <summary>Raised with the date when a day's "+N more" button is pressed.</summary>
    [Parameter] public EventCallback<string> OnMoreClick { get; set; }

    /// <summary>Turns on event drag-and-drop between days and Alt+arrow keys on a focused event button; <c>OnEventMove</c> fires when one moves.</summary>
    [Parameter] public bool MoveEvents { get; set; }

    /// <summary>Raised when an event is moved to another day: (event, to date).</summary>
    [Parameter] public EventCallback<(CalendarEvent Event, string ToDate)> OnEventMove { get; set; }

    /// <summary>Month view: leave days outside the shown month empty (the cell keeps <c>data-outside-period</c>).</summary>
    [Parameter] public bool HideOutsideDays { get; set; }

    /// <summary>Weekday numbers (0 = Sunday … 6 = Saturday) that are the weekend; those cells get <c>data-weekend</c>.</summary>
    [Parameter] public IReadOnlyList<int>? WeekendDays { get; set; }

    /// <summary><c>Multiple</c>: Enter/Space or a click toggles a day in <c>SelectedDates</c> instead of setting <c>SelectedDate</c>.</summary>
    [Parameter] public bool MultipleSelection { get; set; }

    /// <summary>The picked days when <c>MultipleSelection</c> is on. Bindable: <c>@bind-SelectedDates</c>.</summary>
    [Parameter] public IReadOnlyList<string> SelectedDates { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> SelectedDatesChanged { get; set; }

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
    private string? _rangeAnchor;
    private static readonly HashSet<string> MoveKeys = new()
    {
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown",
    };

    internal string RootId => $"{_baseId}-root";
    private string RootClass => $"calendar-view {CssClass}".Trim();
    private string CellId(string date) => $"{_baseId}-cell-{date}";

    private int FirstDay => DateTimePicker.FirstDayOfWeekFor(Locale);

    private string EffectiveAnchor => !string.IsNullOrEmpty(AnchorDate) ? AnchorDate : (!string.IsNullOrEmpty(Today) ? Today! : "1970-01-01");

    private string[][] Days => PeriodDays(View, EffectiveAnchor, FirstDay);

    /// <summary>The days of the shown month the agenda lists: those with events, or all of them with <c>AgendaEmptyDays</c>.</summary>
    private List<string> AgendaDayList(IReadOnlyDictionary<string, IReadOnlyList<CalendarEvent>> eventMap)
    {
        var (start, end) = PeriodRange(CalendarViewMode.Agenda, EffectiveAnchor, FirstDay);
        var days = new List<string>();
        for (var d = start; string.CompareOrdinal(d, end) <= 0; d = DateTimePicker.AddDays(d, 1))
        {
            if (AgendaEmptyDays || (eventMap.TryGetValue(d, out var list) && list.Count > 0)) days.Add(d);
        }
        return days;
    }

    private string? _draggingEventId;
    private bool _eventKeyHandled;

    private bool IsPicked(string d) => MultipleSelection ? SelectedDates.Contains(d) : SelectedDate == d;

    private IReadOnlyList<CalendarEvent> VisibleEvents(IReadOnlyList<CalendarEvent> all)
        => MaxEvents is { } max ? all.Take(Math.Max(0, max)).ToList() : all;

    private int HiddenCount(IReadOnlyList<CalendarEvent> all)
        => MaxEvents is { } max ? Math.Max(0, all.Count - Math.Max(0, max)) : 0;

    private Dictionary<string, object> EventAttributes(CalendarEvent calendarEvent)
        => MoveEvents
            ? new Dictionary<string, object> { ["draggable"] = "true", ["data-event-id"] = calendarEvent.Id }
            : new Dictionary<string, object>();

    private void BeginEventDrag(CalendarEvent calendarEvent)
    {
        if (MoveEvents) _draggingEventId = calendarEvent.Id;
    }

    private void OnEventDragStart(CalendarEvent calendarEvent) => BeginEventDrag(calendarEvent);

    private async Task MoveEventToAsync(CalendarEvent calendarEvent, string toDate)
    {
        if (!MoveEvents || IsDisabledDay(toDate)) return;
        await OnEventMove.InvokeAsync((calendarEvent, toDate));
        var message = Labels.EventMoveAnnouncement?.Invoke(calendarEvent, toDate);
        if (message is not null) _statusMessage = message;
    }

    private async Task OnDayDropAsync(string isoDate)
    {
        var id = _draggingEventId;
        _draggingEventId = null;
        if (id is null) return;
        var calendarEvent = Events.FirstOrDefault(e => e.Id == id);
        if (calendarEvent is not null) await MoveEventToAsync(calendarEvent, isoDate);
    }

    /// <summary>Alt+arrow keys on an event's own button move it a day (left/right) or a week (up/down).</summary>
    private async Task OnEventKeyDownAsync(CalendarEvent calendarEvent, string fromDate, KeyboardEventArgs args)
    {
        if (!MoveEvents || !args.AltKey) return;
        var week = View == CalendarViewMode.Day ? 1 : 7;
        int? delta = args.Key switch { "ArrowLeft" => -1, "ArrowRight" => 1, "ArrowUp" => -week, "ArrowDown" => week, _ => null };
        if (delta is null) return;
        _eventKeyHandled = true;
        await MoveEventToAsync(calendarEvent, DateTimePicker.AddDays(fromDate, delta.Value));
    }

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
        if (view == CalendarViewMode.Agenda) return Array.Empty<string[]>();
        if (view == CalendarViewMode.Month)
        {
            var parsed = DateTimePicker.ParseIsoDate(anchorDate);
            if (parsed is null) return Array.Empty<string[]>();
            return DateTimePicker.MonthMatrix(parsed.Value.Year, parsed.Value.Month, firstDayOfWeek);
        }
        if (view == CalendarViewMode.Day) return new[] { new[] { anchorDate } };
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
        if (view == CalendarViewMode.Month || view == CalendarViewMode.Agenda)
        {
            var parsed = DateTimePicker.ParseIsoDate(anchorDate);
            if (parsed is null) return (anchorDate, anchorDate);
            var p = parsed.Value;
            return (
                DateTimePicker.FormatIsoDate(new CivilDate(p.Year, p.Month, 1)),
                DateTimePicker.FormatIsoDate(new CivilDate(p.Year, p.Month, DateTimePicker.DaysInMonth(p.Year, p.Month))));
        }
        if (view == CalendarViewMode.Day) return (anchorDate, anchorDate);
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

    // -------------------------------------------------------------------
    // Range selection: Shift+arrows extend from an anchor; Enter confirms.
    // -------------------------------------------------------------------

    private bool InSelectedRange(string d)
        => SelectedRange is { } r && string.CompareOrdinal(d, r.Start) >= 0 && string.CompareOrdinal(d, r.End) <= 0;

    private IReadOnlyList<CalendarRange> RangesFor(string d)
        => Ranges.Where(r => string.CompareOrdinal(d, r.Start) >= 0 && string.CompareOrdinal(d, r.End) <= 0).ToList();

    /// <summary>The ISO week number of the week shown in <paramref name="row"/> (its Thursday decides, as ISO 8601 says).</summary>
    private static int WeekNumberOf(string[] row)
        => DateTimePicker.IsoWeek(row.FirstOrDefault(d => DateTimePicker.WeekdayOf(d) == 4) ?? row[0]);

    private async Task SetRangeAsync(string a, string b)
    {
        var (start, end) = string.CompareOrdinal(a, b) <= 0 ? (a, b) : (b, a);
        SelectedRange = new CalendarSelectedRange(start, end);
        await SelectedRangeChanged.InvokeAsync(SelectedRange);
        var message = Labels.RangeAnnouncement?.Invoke(start, end);
        if (message is not null) _statusMessage = message;
    }

    private async Task ConfirmRangeAsync()
    {
        if (SelectedRange is not { } range) return;
        _rangeAnchor = null;
        await OnRangeSelect.InvokeAsync(range);
    }

    private async Task PickAsync(string isoDate)
    {
        if (IsDisabledDay(isoDate)) return;
        if (MultipleSelection)
        {
            SelectedDates = SelectedDates.Contains(isoDate)
                ? SelectedDates.Where(x => x != isoDate).ToList()
                : SelectedDates.Append(isoDate).OrderBy(x => x, StringComparer.Ordinal).ToList();
            await SelectedDatesChanged.InvokeAsync(SelectedDates);
        }
        else
        {
            SelectedDate = isoDate;
            await SelectedDateChanged.InvokeAsync(isoDate);
        }
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
            case CalendarViewMode.Day: await NavigateToAsync(DateTimePicker.AddDays(anchor, delta)); break;
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
        else if (View == CalendarViewMode.Day)
        {
            if (next != anchor) await NavigateToAsync(next);
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
            case CalendarViewMode.Day: await MoveCursorAsync(DateTimePicker.AddDays(cursor, delta)); break;
            case CalendarViewMode.Week: await MoveCursorAsync(DateTimePicker.AddDays(cursor, delta * 7)); break;
            case CalendarViewMode.FourWeek: await MoveCursorAsync(DateTimePicker.AddDays(cursor, delta * 28)); break;
            default: await MoveCursorAsync(DateTimePicker.AddMonths(cursor, delta)); break;
        }
    }

    private async Task OnGridKeyDownAsync(KeyboardEventArgs args)
    {
        if (_eventKeyHandled)
        {
            _eventKeyHandled = false;
            return;
        }
        var cursor = EffectiveCursor(Days);
        var offset = View == CalendarViewMode.Day ? 0 : (DateTimePicker.WeekdayOf(cursor) - FirstDay + 7) % 7;
        var extending = args.ShiftKey && MoveKeys.Contains(args.Key);
        if (extending && _rangeAnchor is null)
        {
            _rangeAnchor = !string.IsNullOrEmpty(SelectedDate) && SelectedRange is null ? SelectedDate : cursor;
        }
        if (!extending && MoveKeys.Contains(args.Key)) _rangeAnchor = null;
        switch (args.Key)
        {
            case "ArrowLeft": await MoveCursorAsync(DateTimePicker.AddDays(cursor, -1)); break;
            case "ArrowRight": await MoveCursorAsync(DateTimePicker.AddDays(cursor, 1)); break;
            case "ArrowUp": await MoveCursorAsync(DateTimePicker.AddDays(cursor, View == CalendarViewMode.Day ? -1 : -7)); break;
            case "ArrowDown": await MoveCursorAsync(DateTimePicker.AddDays(cursor, View == CalendarViewMode.Day ? 1 : 7)); break;
            case "Home": await MoveCursorAsync(DateTimePicker.AddDays(cursor, -offset)); break;
            case "End": await MoveCursorAsync(DateTimePicker.AddDays(cursor, View == CalendarViewMode.Day ? 0 : 6 - offset)); break;
            case "PageUp": await PageCursorAsync(-1, cursor); break;
            case "PageDown": await PageCursorAsync(1, cursor); break;
            case "Enter":
            case " ":
                if (_rangeAnchor is not null && SelectedRange is not null)
                {
                    await ConfirmRangeAsync();
                    _focusCursorPending = true;
                }
                else await PickAsync(cursor);
                break;
            case "Escape":
                if (SelectedRange is not null || _rangeAnchor is not null)
                {
                    _rangeAnchor = null;
                    SelectedRange = null;
                    await SelectedRangeChanged.InvokeAsync(null);
                    _focusCursorPending = true;
                }
                break;
            case "t":
            case "T":
                if (string.IsNullOrEmpty(Today) || args.CtrlKey || args.MetaKey || args.AltKey) break;
                await NavigateToAsync(Today!);
                await MoveCursorAsync(Today!);
                break;
        }
        if (extending && _rangeAnchor is not null && _cursor is not null)
        {
            await SetRangeAsync(_rangeAnchor, _cursor);
        }
    }

    private async Task OnDayCellClickAsync(string isoDate, MouseEventArgs args)
    {
        if (args.ShiftKey && !IsDisabledDay(isoDate))
        {
            // Shift+click picks a range from the picked day (or the cursor) to here, and confirms it.
            var from = !string.IsNullOrEmpty(SelectedDate) && SelectedRange is null ? SelectedDate! : EffectiveCursor(Days);
            _cursor = isoDate;
            await SetRangeAsync(from, isoDate);
            await ConfirmRangeAsync();
            return;
        }
        _cursor = isoDate;
        _rangeAnchor = null;
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
