// DateTimePicker — code-behind. See spec/index.md for the contract.
//
// Civil-date arithmetic (§3, §4.4) is backed by DateOnly / TimeOnly — .NET's
// zone-less civil-date and civil-time types, introduced for exactly the
// local-midnight-Date problem the Svelte canonical works around by going
// through UTC epoch days. DateOnly has no time zone attached at all, so it
// cannot reproduce that bug by construction. The epoch-day helpers
// (ToEpochDay / FromEpochDay) are still exported as pure functions, for
// parity with the other language ports' surface area, but internally they
// are thin wrappers over DateOnly.DayNumber.

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>What the control collects. See <c>spec/index.md §4.1</c>.</summary>
public enum DateTimeMode
{
    /// <summary>A civil date only. Value shape: <c>YYYY-MM-DD</c>.</summary>
    Date,

    /// <summary>A wall-clock time only. Value shape: <c>HH:MM</c>.</summary>
    Time,

    /// <summary>Both. Value shape: <c>YYYY-MM-DDTHH:MM</c>.</summary>
    DateTime,
}

/// <summary>
/// A civil date: no time zone, no instant. Backed by <see cref="DateOnly"/>.
/// </summary>
public readonly record struct CivilDate(int Year, int Month, int Day)
{
    /// <summary>Convert to the .NET civil-date type.</summary>
    public DateOnly ToDateOnly() => new(Year, Month, Day);

    /// <summary>Convert from the .NET civil-date type.</summary>
    public static CivilDate FromDateOnly(DateOnly date) => new(date.Year, date.Month, date.Day);
}

/// <summary>A wall-clock time, 24-hour, no seconds.</summary>
public readonly record struct CivilTime(int Hour, int Minute);

/// <summary>One quick-pick button in the dialog. See <c>spec/index.md §4.1</c>.</summary>
public sealed class DateTimeShortcut
{
    /// <summary>Stable identifier, passed back to <c>OnShortcut</c>.</summary>
    public required string Id { get; init; }

    /// <summary>Visible button text. Consumer-supplied, so it localises.</summary>
    public required string Label { get; init; }

    /// <summary>Days from today. Mutually exclusive with <see cref="Months"/> and <see cref="Date"/>.</summary>
    public int? Days { get; init; }

    /// <summary>Calendar months from today.</summary>
    public int? Months { get; init; }

    /// <summary>An absolute ISO date, for shortcuts that are not relative.</summary>
    public string? Date { get; init; }
}

/// <summary>
/// Every user-facing string the dialog needs. See <c>spec/index.md §4.2</c>.
/// </summary>
/// <remarks>
/// Grouped into one object rather than spread across ten flat parameters —
/// the same reasoning as the canonical Svelte <c>DateTimePickerLabels</c>
/// type. The four navigation labels and the two footer labels are required
/// because they name buttons that always render; the rest gate optional UI.
/// </remarks>
public sealed record DateTimePickerLabels
{
    /// <summary>Accessible name for the previous-year button.</summary>
    public required string PreviousYear { get; init; }

    /// <summary>Accessible name for the previous-month button.</summary>
    public required string PreviousMonth { get; init; }

    /// <summary>Accessible name for the next-month button.</summary>
    public required string NextMonth { get; init; }

    /// <summary>Accessible name for the next-year button.</summary>
    public required string NextYear { get; init; }

    /// <summary>Visible text of the commit button.</summary>
    public required string Confirm { get; init; }

    /// <summary>Visible text of the dismiss button.</summary>
    public required string Cancel { get; init; }

    /// <summary>Label for the hour select. Required when <c>Mode</c> includes a time.</summary>
    public string? Hour { get; init; }

    /// <summary>Label for the minute select. Required when <c>Mode</c> includes a time.</summary>
    public string? Minute { get; init; }

    /// <summary>Label for the AM/PM select, when <c>Hour12</c> resolves true.</summary>
    public string? Meridiem { get; init; }

    /// <summary>Column heading for week numbers. Required when <c>ShowWeekNumbers</c>.</summary>
    public string? Week { get; init; }

    /// <summary>Visible text of the clear button. The button renders only when set.</summary>
    public string? Clear { get; init; }

    /// <summary>
    /// Message announced when typed text will not parse or is out of range.
    /// When set, a <c>role="status"</c> live region renders after the field
    /// and is wired to it via <c>aria-errormessage</c> — without it,
    /// <c>aria-invalid</c> flips silently and a screen-reader user who has
    /// already left the field never hears that their date was refused.
    /// </summary>
    public string? Invalid { get; init; }

    /// <summary>
    /// Keyboard help for the dialog, e.g. "Use the arrow keys to choose a
    /// date". When set, it renders inside the dialog and becomes the
    /// dialog's <c>aria-describedby</c>, so a screen reader speaks it once
    /// on open — the APG date-picker dialog ships exactly this affordance.
    /// </summary>
    public string? Instructions { get; init; }
}

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment (the
/// button glyph). See <c>spec/index.md §4.1</c>.
/// </summary>
public sealed class DateTimePickerContext
{
    /// <summary>The committed value, in ISO form.</summary>
    public required string Value { get; init; }

    /// <summary>Is the dialog open?</summary>
    public required bool Open { get; init; }

    /// <summary>The value as the user sees it in the field.</summary>
    public required string Display { get; init; }
}

public partial class DateTimePicker : ComponentBase, IAsyncDisposable
{
    /// <summary>
    /// Default button glyph: U+1F4C5 CALENDAR, followed by U+FE0E VARIATION
    /// SELECTOR-15 to request text (monochrome) presentation.
    /// </summary>
    /// <remarks>
    /// Same construction as LocalePicker's globe: written as an escape,
    /// never a bare character, because a variation selector has no visual
    /// form at all and a bare one is invisible in an editor and trivially
    /// lost to a careless edit.
    /// </remarks>
    public const string Calendar = "📅︎";

    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    /// <summary>
    /// Seam for a deterministic "today" in tests. Production code never
    /// touches this; the test project (via <c>InternalsVisibleTo</c>) swaps
    /// it out for a fixed instant, the same role <c>vi.useFakeTimers()</c>
    /// plays in the canonical Svelte suite.
    /// </summary>
    internal static Func<DateTime> NowProvider = () => DateTime.Now;

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the trigger button and the dialog. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Every other user-facing string. Required.</summary>
    [Parameter, EditorRequired] public DateTimePickerLabels Labels { get; set; } = default!;

    /// <summary>What to collect: a date, a time, or both.</summary>
    [Parameter] public DateTimeMode Mode { get; set; } = DateTimeMode.Date;

    /// <summary>ISO value: <c>YYYY-MM-DD</c>, <c>HH:MM</c>, or <c>YYYY-MM-DDTHH:MM</c>.</summary>
    [Parameter] public string Value { get; set; } = "";

    /// <summary>Fires whenever <see cref="Value"/> changes, for <c>@bind-Value</c>.</summary>
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>BCP 47 tag driving month names, weekday names and first weekday.</summary>
    [Parameter] public string? Locale { get; set; }

    /// <summary>Earliest selectable date, ISO. Inclusive.</summary>
    [Parameter] public string? Min { get; set; }

    /// <summary>Latest selectable date, ISO. Inclusive.</summary>
    [Parameter] public string? Max { get; set; }

    /// <summary>Veto individual dates — true means "cannot be picked".</summary>
    [Parameter] public Func<string, bool>? IsDateDisabled { get; set; }

    /// <summary>0 = Sunday … 6 = Saturday. Defaults to the locale's convention.</summary>
    [Parameter] public int? FirstDayOfWeek { get; set; }

    /// <summary>Granularity of the minute select.</summary>
    [Parameter] public int MinuteStep { get; set; } = 1;

    /// <summary>12-hour clock. Defaults to the locale's convention.</summary>
    [Parameter] public bool? Hour12 { get; set; }

    /// <summary>Render an ISO-8601 week-number column.</summary>
    [Parameter] public bool ShowWeekNumbers { get; set; }

    /// <summary>Quick-pick buttons.</summary>
    [Parameter] public IReadOnlyList<DateTimeShortcut> Shortcuts { get; set; } = Array.Empty<DateTimeShortcut>();

    /// <summary>Commit and close as soon as a day is chosen. Defaults to date-only.</summary>
    [Parameter] public bool? ConfirmOnSelect { get; set; }

    /// <summary><c>name</c> of the hidden input that carries the value in a form post.</summary>
    [Parameter] public string Name { get; set; } = "date-time";

    /// <summary><c>id</c> of the text field, so a consumer <c>&lt;label for&gt;</c> can name it.</summary>
    [Parameter] public string? InputId { get; set; }

    /// <summary>Forwarded to the text field as <c>aria-describedby</c>.</summary>
    [Parameter] public string? DescribedBy { get; set; }

    /// <summary>Placeholder for the text field.</summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <summary>Disable the whole control.</summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>Show the value but refuse edits.</summary>
    [Parameter] public bool ReadOnly { get; set; }

    /// <summary>Mark the field required.</summary>
    [Parameter] public bool Required { get; set; }

    /// <summary>Override how a committed value is rendered into the text field.</summary>
    [Parameter] public Func<string, string>? FormatValue { get; set; }

    /// <summary>Override how typed text is turned back into an ISO value.</summary>
    [Parameter] public Func<string, string?>? ParseInput { get; set; }

    /// <summary>Replaces the default calendar glyph inside the trigger button.</summary>
    [Parameter] public RenderFragment<DateTimePickerContext>? ChildContent { get; set; }

    /// <summary>Fires after a new value is committed.</summary>
    [Parameter] public EventCallback<string> OnChange { get; set; }

    /// <summary>Fires when a shortcut is used, before the value settles.</summary>
    [Parameter] public EventCallback<(string Id, string IsoDate)> OnShortcut { get; set; }

    /// <summary>Fires when typed text cannot be parsed.</summary>
    [Parameter] public EventCallback<string> OnInvalidInput { get; set; }

    /// <summary>Extra CSS class merged onto the root <c>&lt;div&gt;</c>.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    // -------------------------------------------------------------------
    // Instance state — mirrors the Svelte $state fields one for one.
    // -------------------------------------------------------------------

    private readonly string _baseId = NextDateTimePickerId();

    private bool _open;
    private bool _invalid;

    /// <summary>
    /// Text the user has typed but not yet resolved. <c>null</c> means "no
    /// pending edit, show the formatted value"; an empty string is a real
    /// state (the user cleared the field) and must not collapse into null.
    /// </summary>
    private string? _typed;

    /// <summary>
    /// The pending selection, live only while the dialog is open. Kept
    /// separate from <see cref="Value"/> so Cancel and Escape can genuinely
    /// revert — see spec/index.md §3.
    /// </summary>
    private string _pendingDate = "";
    private string _pendingTime = "";

    private int _viewYear = 1970;
    private int _viewMonth = 1;

    /// <summary>The day the grid's roving tabindex sits on.</summary>
    private string _cursor = "";

    /// <summary>
    /// Today, sampled once the client is live and refreshed on every open.
    /// Left empty during prerender so SSR markup never depends on a clock
    /// read that could differ between the server and the client.
    /// </summary>
    private string _today = "";

    private bool _todaySeeded;
    private bool _trapInstalled;

    /// <summary>Set while the component itself is moving focus, so the
    /// root's focusout handler does not read the move as "focus left the
    /// control". Same mechanism as SharePicker; see spec/index.md §9.</summary>
    private bool _suppressFocusOut;

    private bool _focusCursorAfterRender;
    private bool _focusFirstControlAfterRender;
    private bool _focusOpenerAfterRender;

    /// <summary>
    /// Did the text field open the dialog (Alt+ArrowDown)? Close returns
    /// focus to whichever element opened it — the APG rule is "focus
    /// returns to the element that invoked the dialog", which is the
    /// trigger button on a click but the *text field* after
    /// Alt+ArrowDown. Always refocusing the button strands a keyboard
    /// user one Tab stop past where they were. The canonical Svelte
    /// implementation records <c>document.activeElement</c> at open;
    /// Blazor cannot read the active element without interop, so the two
    /// open paths record which one ran instead — same outcome, see §9.
    /// </summary>
    private bool _openerIsField;

    private ElementReference _buttonElement;
    private ElementReference _fieldElement;
    private ElementReference _hourElement;

    /// <summary>
    /// Day-button element references, keyed by grid cell index
    /// (row × 7 + column) — by POSITION, not by date. Blazor invokes an
    /// element-reference capture only when the element is first created,
    /// and the grid reuses its 42 buttons across month paging, so a
    /// date-keyed map goes stale the first time the view pages and the
    /// cursor-focus call silently targets nothing. The button at a given
    /// position is the same DOM element for the life of the dialog, so a
    /// position-keyed reference stays correct whatever date the cell
    /// currently shows.
    /// </summary>
    private readonly Dictionary<int, ElementReference> _dayElements = new();

    /// <summary>The grid cell index currently showing <paramref name="isoDate"/>, or -1.</summary>
    private int CellIndexOf(string isoDate)
    {
        if (string.IsNullOrEmpty(isoDate)) return -1;
        var weeks = Weeks;
        for (var row = 0; row < weeks.Length; row++)
        {
            var col = Array.IndexOf(weeks[row], isoDate);
            if (col >= 0) return row * 7 + col;
        }
        return -1;
    }

    // -------------------------------------------------------------------
    // Test seams (InternalsVisibleTo). bUnit has no live focus model, so
    // the suite asserts which element a FocusAsync interop call targeted
    // by comparing ElementReference ids — these expose the ids the
    // component holds, playing the role document.activeElement plays in
    // the canonical Svelte suite.
    // -------------------------------------------------------------------

    /// <summary>The text field's ElementReference id, once rendered.</summary>
    internal string? FieldReferenceId => _fieldElement.Id;

    /// <summary>The trigger button's ElementReference id, once rendered.</summary>
    internal string? TriggerReferenceId => _buttonElement.Id;

    /// <summary>The ElementReference id of the day button currently showing
    /// <paramref name="isoDate"/>, or null when it is not on screen.</summary>
    internal string? DayReferenceId(string isoDate)
        => _dayElements.TryGetValue(CellIndexOf(isoDate), out var dayRef) ? dayRef.Id : null;

    // -------------------------------------------------------------------
    // Ids.
    // -------------------------------------------------------------------

    private string RootId => $"{_baseId}-root";
    private string DialogId => $"{_baseId}-dialog";
    private string PeriodId => $"{_baseId}-period";
    private string HourId => $"{_baseId}-hour";
    private string MinuteId => $"{_baseId}-minute";
    private string MeridiemId => $"{_baseId}-meridiem";
    private string StatusId => $"{_baseId}-status";
    private string InstructionsId => $"{_baseId}-instructions";
    private string FieldId => InputId ?? $"{_baseId}-input";

    // -------------------------------------------------------------------
    // Computed view state.
    // -------------------------------------------------------------------

    private string SafeValue => Value ?? "";

    private (string Date, string Time) Committed => SplitValue(SafeValue, Mode);

    private int WeekStart => FirstDayOfWeek ?? FirstDayOfWeekFor(Locale);

    private bool CommitOnDay => ConfirmOnSelect ?? Mode == DateTimeMode.Date;

    private bool UsesDate => Mode != DateTimeMode.Time;

    private bool UsesTime => Mode != DateTimeMode.Date;

    private bool Clock12 => Hour12 ?? LocaleUsesHour12(Locale);

    private string RootClass => $"date-time-picker {CssClass}".Trim();

    private string ModeAttribute => Mode switch
    {
        DateTimeMode.Date => "date",
        DateTimeMode.Time => "time",
        _ => "datetime",
    };

    private string Display => _typed ?? (FormatValue ?? DefaultFormatValue)(SafeValue);

    private bool HasInvalidLabel => !string.IsNullOrEmpty(Labels.Invalid);

    private bool HasInstructionsLabel => !string.IsNullOrEmpty(Labels.Instructions);

    /// <summary>
    /// <c>aria-describedby</c> for the field: the consumer's hint, plus —
    /// while invalid, with <c>Labels.Invalid</c> supplied — the status
    /// region, for the assistive technologies that read
    /// <c>aria-describedby</c> but not the newer <c>aria-errormessage</c>.
    /// The consumer's id comes first, so the hint is spoken before the
    /// error.
    /// </summary>
    private string? FieldDescribedBy
    {
        get
        {
            var status = _invalid && HasInvalidLabel ? StatusId : null;
            var joined = string.Join(
                " ",
                new[] { DescribedBy, status }.Where(s => !string.IsNullOrEmpty(s)));
            return joined.Length > 0 ? joined : null;
        }
    }

    private string[][] Weeks => MonthMatrix(_viewYear, _viewMonth, WeekStart);

    private string PeriodText
    {
        get
        {
            var culture = ResolveCulture(Locale);
            var anchor = new DateOnly(_viewYear, _viewMonth, 1);
            try
            {
                return anchor.ToString("MMMM yyyy", culture);
            }
            catch (ArgumentOutOfRangeException)
            {
                return $"{_viewYear:D4}-{Pad(_viewMonth)}";
            }
        }
    }

    private sealed record WeekdayName(string Short, string Long);

    private IReadOnlyList<WeekdayName> Weekdays
    {
        get
        {
            var culture = ResolveCulture(Locale);
            var list = new List<WeekdayName>(7);
            for (var i = 0; i < 7; i++)
            {
                var dow = (DayOfWeek)((WeekStart + i) % 7);
                list.Add(new WeekdayName(
                    culture.DateTimeFormat.GetAbbreviatedDayName(dow),
                    culture.DateTimeFormat.GetDayName(dow)));
            }
            return list;
        }
    }

    private sealed record HourOption(int Value, string Label);

    private CivilTime PendingTimeParsed => ParseIsoTime(_pendingTime) ?? new CivilTime(0, 0);

    private int PendingHour => PendingTimeParsed.Hour;

    private int PendingMinute => PendingTimeParsed.Minute;

    /// <summary>
    /// The hours offered. On a 12-hour clock this lists only the half of
    /// the day the meridiem select is currently on, so the two controls
    /// together name exactly one hour — see spec/index.md §5.
    /// </summary>
    private IReadOnlyList<HourOption> HourOptions
    {
        get
        {
            var list = new List<HourOption>();
            for (var h = 0; h < 24; h++)
            {
                if (Clock12 && h < 12 != PendingHour < 12) continue;
                var label = Clock12
                    ? (((h + 11) % 12) + 1).ToString(CultureInfo.InvariantCulture)
                    : Pad(h);
                list.Add(new HourOption(h, label));
            }
            return list;
        }
    }

    private IReadOnlyList<int> MinuteOptions
    {
        get
        {
            var list = new List<int>();
            var step = Math.Max(1, MinuteStep);
            for (var m = 0; m < 60; m += step) list.Add(m);
            return list;
        }
    }

    private DateTimePickerContext BuildContext() => new()
    {
        Value = SafeValue,
        Open = _open,
        Display = Display,
    };

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    /// <summary>
    /// Seed the view synchronously from <see cref="Value"/>, mirroring the
    /// Svelte canonical's synchronous <c>initialAnchor</c>. Today is
    /// deliberately NOT read here: a clock read during prerender could
    /// differ from the client's render and produce a hydration mismatch.
    /// That waits for <see cref="OnAfterRenderAsync"/>.
    /// </summary>
    protected override void OnInitialized()
    {
        var anchor = ParseIsoDate(Committed.Date);
        if (anchor is { } a)
        {
            _viewYear = a.Year;
            _viewMonth = a.Month;
            _cursor = FormatIsoDate(a);
        }
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await InstallFocusTrapAsync();

            if (!_todaySeeded)
            {
                _todaySeeded = true;
                _today = TodayIso();
                var anchor = ParseIsoDate(Committed.Date) ?? ParseIsoDate(_today);
                if (anchor is { } a)
                {
                    _viewYear = a.Year;
                    _viewMonth = a.Month;
                    _cursor = FormatIsoDate(a);
                }
                StateHasChanged();
            }
        }

        if (_focusCursorAfterRender)
        {
            _focusCursorAfterRender = false;
            if (_dayElements.TryGetValue(CellIndexOf(_cursor), out var dayRef))
            {
                await TryFocusAsync(dayRef);
            }
        }

        if (_focusFirstControlAfterRender)
        {
            _focusFirstControlAfterRender = false;
            await TryFocusAsync(_hourElement);
        }

        if (_focusOpenerAfterRender)
        {
            _focusOpenerAfterRender = false;
            await TryFocusAsync(_openerIsField ? _fieldElement : _buttonElement);
        }
    }

    private async Task InstallFocusTrapAsync()
    {
        if (_trapInstalled) return;
        _trapInstalled = true;
        try
        {
            await JS.InvokeVoidAsync("eval", BuildInstallFocusTrapScript(DialogId));
        }
        catch
        {
            // Prerender, or JS interop unavailable. The dialog still works
            // by keyboard; only the Tab wraparound is unavailable.
        }
    }

    private static async Task TryFocusAsync(ElementReference element)
    {
        try
        {
            await element.FocusAsync();
        }
        catch
        {
            // Prerender / interop unavailable, or the element no longer
            // exists in this render (e.g. paged out of the grid).
        }
    }

    /// <summary>No persistent interop to release; the Tab-trap listener is
    /// scoped to the dialog element and is garbage-collected with it.</summary>
    public ValueTask DisposeAsync() => ValueTask.CompletedTask;

    // -------------------------------------------------------------------
    // Today / default time — routed through NowProvider for testability.
    // -------------------------------------------------------------------

    private static string TodayIso()
    {
        var now = NowProvider();
        return FormatIsoDate(new CivilDate(now.Year, now.Month, now.Day));
    }

    /// <summary>Where an unset time starts: now, snapped down to the step.</summary>
    private string DefaultTime()
    {
        if (!UsesTime) return "";
        var now = NowProvider();
        var step = Math.Max(1, MinuteStep);
        return FormatIsoTime(new CivilTime(now.Hour, now.Minute / step * step));
    }

    // -------------------------------------------------------------------
    // Selectability.
    // -------------------------------------------------------------------

    private bool DayDisabled(string isoDate)
    {
        if (!WithinRange(isoDate, Min, Max)) return true;
        return IsDateDisabled?.Invoke(isoDate) == true;
    }

    /// <summary>The nearest selectable day to <paramref name="isoDate"/>,
    /// searching outwards. Bounded to a year either way, far beyond any
    /// real min/max window, so a predicate that disables everything cannot
    /// hang this.</summary>
    private string NearestSelectable(string isoDate)
    {
        if (!DayDisabled(isoDate)) return isoDate;
        for (var delta = 1; delta <= 366; delta++)
        {
            var after = AddDays(isoDate, delta);
            if (!DayDisabled(after)) return after;
            var before = AddDays(isoDate, -delta);
            if (!DayDisabled(before)) return before;
        }
        return isoDate;
    }

    // -------------------------------------------------------------------
    // Open / close / commit.
    // -------------------------------------------------------------------

    private void OnTriggerClick()
    {
        if (_open) CloseDialog();
        else OpenDialog(openedFromField: false);
    }

    private void OpenDialog(bool openedFromField)
    {
        if (Disabled || ReadOnly) return;
        _openerIsField = openedFromField;
        _today = TodayIso();
        var committed = Committed;
        _pendingDate = !string.IsNullOrEmpty(committed.Date) ? committed.Date : NearestSelectable(_today);
        _pendingTime = !string.IsNullOrEmpty(committed.Time) ? committed.Time : DefaultTime();
        _cursor = _pendingDate;
        var anchor = ParseIsoDate(_pendingDate) ?? ParseIsoDate(_today);
        if (anchor is { } a)
        {
            _viewYear = a.Year;
            _viewMonth = a.Month;
        }
        _open = true;
        _suppressFocusOut = true;
        if (UsesDate) _focusCursorAfterRender = true;
        else _focusFirstControlAfterRender = true;
    }

    private void CloseDialog(bool refocus = true)
    {
        if (!_open) return;
        _open = false;
        if (refocus)
        {
            // Focus returns to whichever element opened the dialog — the
            // trigger button after a click, the text field after
            // Alt+ArrowDown — per the APG dialog pattern. Click-outside
            // passes refocus: false, since the user has already put focus
            // somewhere.
            _focusOpenerAfterRender = true;
            _suppressFocusOut = true;
        }
    }

    /// <summary>Commit the pending selection to <see cref="Value"/> and notify.</summary>
    private async Task CommitAsync()
    {
        var next = JoinValue(_pendingDate, _pendingTime, Mode);
        // An incomplete datetime is not committed. Half a timestamp is not
        // a smaller truth; it is a different one.
        if (string.IsNullOrEmpty(next)) return;
        _typed = null;
        _invalid = false;
        if (next != SafeValue)
        {
            Value = next;
            await ValueChanged.InvokeAsync(next);
            await OnChange.InvokeAsync(next);
        }
        CloseDialog();
    }

    private async Task ClearAsync()
    {
        _typed = null;
        _invalid = false;
        if (SafeValue != "")
        {
            Value = "";
            await ValueChanged.InvokeAsync("");
            await OnChange.InvokeAsync("");
        }
        CloseDialog();
    }

    // -------------------------------------------------------------------
    // Grid navigation.
    // -------------------------------------------------------------------

    /// <summary>
    /// Move the cursor, paging the view when the target is off-screen.
    /// Vetoed days are still reachable — the cursor lands on them with
    /// real focus, because the button is <c>aria-disabled</c> rather than
    /// <c>disabled</c>, so arrowing across a blocked range works and the
    /// day is announced. What is refused is leaving the min/max window
    /// entirely.
    /// </summary>
    private void MoveCursor(string nextIso)
    {
        if (!WithinRange(nextIso, Min, Max)) return;
        _cursor = nextIso;
        var parsed = ParseIsoDate(nextIso);
        if (parsed is { } p && (p.Year != _viewYear || p.Month != _viewMonth))
        {
            _viewYear = p.Year;
            _viewMonth = p.Month;
        }
        _suppressFocusOut = true;
        _focusCursorAfterRender = true;
    }

    private async Task SelectDayAsync(string isoDate)
    {
        if (DayDisabled(isoDate)) return;
        _pendingDate = isoDate;
        _cursor = isoDate;
        _suppressFocusOut = true;
        if (CommitOnDay) await CommitAsync();
        else _focusCursorAfterRender = true;
    }

    /// <summary>
    /// Page the view by whole months, carrying the cursor (clamped into
    /// the new month) so the roving tabindex never sits on an unrendered
    /// cell.
    /// </summary>
    /// <param name="delta">Whole months to move the view by.</param>
    /// <param name="refocusCursor">
    /// True only for grid-originated paging (<c>PageUp</c>/<c>PageDown</c>),
    /// where focus is in the grid and must follow the cursor or die with
    /// the unrendered cell. The header buttons pass false: their user must
    /// stay on "next month" and be able to page repeatedly, not be yanked
    /// into the grid after one activation. The canonical Svelte
    /// implementation decides this by asking whether
    /// <c>document.activeElement</c> is inside the grid; Blazor cannot
    /// read the active element without interop, so the decision rides on
    /// which code path is paging instead — see spec §9.
    /// </param>
    private void ShiftMonth(int delta, bool refocusCursor)
    {
        var anchor = FormatIsoDate(new CivilDate(_viewYear, _viewMonth, 1));
        var next = ParseIsoDate(AddMonths(anchor, delta));
        if (next is not { } n) return;
        _viewYear = n.Year;
        _viewMonth = n.Month;
        // Carry the cursor into the new month rather than leaving the
        // roving tabindex on a cell that is no longer rendered.
        var c = ParseIsoDate(_cursor);
        if (c is { } cur)
        {
            var day = Math.Min(cur.Day, DaysInMonth(n.Year, n.Month));
            _cursor = FormatIsoDate(new CivilDate(n.Year, n.Month, day));
            if (refocusCursor)
            {
                _suppressFocusOut = true;
                _focusCursorAfterRender = true;
            }
        }
    }

    private void ShiftYear(int delta, bool refocusCursor) => ShiftMonth(delta * 12, refocusCursor);

    private async Task OnGridKeyDownAsync(KeyboardEventArgs args)
    {
        switch (args.Key)
        {
            case "ArrowLeft":
                MoveCursor(AddDays(_cursor, -1));
                break;
            case "ArrowRight":
                MoveCursor(AddDays(_cursor, 1));
                break;
            case "ArrowUp":
                MoveCursor(AddDays(_cursor, -7));
                break;
            case "ArrowDown":
                MoveCursor(AddDays(_cursor, 7));
                break;
            case "Home":
            {
                var offset = ((WeekdayOf(_cursor) - WeekStart) % 7 + 7) % 7;
                MoveCursor(AddDays(_cursor, -offset));
                break;
            }
            case "End":
            {
                var offset = ((WeekdayOf(_cursor) - WeekStart) % 7 + 7) % 7;
                MoveCursor(AddDays(_cursor, 6 - offset));
                break;
            }
            case "PageUp":
                if (args.ShiftKey) ShiftYear(-1, refocusCursor: true);
                else ShiftMonth(-1, refocusCursor: true);
                break;
            case "PageDown":
                if (args.ShiftKey) ShiftYear(1, refocusCursor: true);
                else ShiftMonth(1, refocusCursor: true);
                break;
            case "Enter":
            case " ":
                await SelectDayAsync(_cursor);
                break;
        }
    }

    // -------------------------------------------------------------------
    // Dialog keys. Tab-trapping is real, but lives in JS — see
    // BuildInstallFocusTrapScript — because Blazor cannot conditionally
    // preventDefault a key from a server round trip. Escape needs no
    // preventDefault (a plain <div role="dialog"> has no native action to
    // cancel), so it stays a normal Razor handler.
    // -------------------------------------------------------------------

    private void OnDialogKeyDown(KeyboardEventArgs args)
    {
        if (args.Key == "Escape") CloseDialog();
    }

    private void OnRootFocusOut()
    {
        if (_suppressFocusOut)
        {
            _suppressFocusOut = false;
            return;
        }
        CloseDialog(false);
    }

    // -------------------------------------------------------------------
    // Text field.
    // -------------------------------------------------------------------

    private void OnFieldInput(ChangeEventArgs args) => _typed = args.Value?.ToString() ?? "";

    private static readonly Regex DateTimeSplitRegex = new(@"^(.*?)[T\s]+([^\sT]+)$", RegexOptions.Compiled);

    /// <summary>Default text parsing, per mode.</summary>
    private string? ParseTypedForMode(string text)
    {
        if (Mode == DateTimeMode.Time) return ParseTimeInput(text);
        if (Mode == DateTimeMode.Date) return ParseDateInput(text, Locale);
        var match = DateTimeSplitRegex.Match(text.Trim());
        if (!match.Success) return null;
        var date = ParseDateInput(match.Groups[1].Value, Locale);
        var time = ParseTimeInput(match.Groups[2].Value);
        return date is not null && time is not null ? $"{date}T{time}" : null;
    }

    /// <summary>Resolve typed text on blur or Enter.</summary>
    private async Task ResolveTypedAsync()
    {
        if (_typed is null) return;
        var text = _typed;

        if (string.IsNullOrWhiteSpace(text))
        {
            _typed = null;
            _invalid = false;
            if (SafeValue != "")
            {
                Value = "";
                await ValueChanged.InvokeAsync("");
                await OnChange.InvokeAsync("");
            }
            return;
        }

        var parsed = ParseInput is not null ? ParseInput(text) : ParseTypedForMode(text);
        if (parsed is null)
        {
            _invalid = true;
            await OnInvalidInput.InvokeAsync(text);
            return;
        }

        var (date, _) = SplitValue(parsed, Mode);
        if (UsesDate && !string.IsNullOrEmpty(date) && DayDisabled(date))
        {
            // Parseable but out of bounds. Same outcome as unparseable: the
            // text stays put and the field is marked invalid, rather than
            // silently snapping to some nearby legal date the user never typed.
            _invalid = true;
            await OnInvalidInput.InvokeAsync(text);
            return;
        }

        _typed = null;
        _invalid = false;
        if (parsed != SafeValue)
        {
            Value = parsed;
            await ValueChanged.InvokeAsync(parsed);
            await OnChange.InvokeAsync(parsed);
        }
    }

    private async Task OnFieldKeyDownAsync(KeyboardEventArgs args)
    {
        if (args.Key == "Enter")
        {
            await ResolveTypedAsync();
        }
        else if (args.Key == "ArrowDown" && args.AltKey)
        {
            // The platform convention for "open the picker" from a field,
            // matching <input type="date"> in every major browser. Close
            // will return focus to the field, not the trigger button.
            OpenDialog(openedFromField: true);
        }
        else if (args.Key == "Escape" && _typed is not null)
        {
            // Discard the pending edit and show the committed value again —
            // the same contract Escape has inside the dialog. When no edit
            // is pending the key is left alone. The canonical Svelte
            // implementation also stops propagation so a surrounding dialog
            // does not close on a text-editing keystroke; Blazor cannot
            // stop propagation conditionally per key — see spec §9.
            _typed = null;
            _invalid = false;
        }
    }

    /// <summary>
    /// A click on the text field while the dialog is open closes it —
    /// without committing, and without moving focus (the click has already
    /// put focus in the field). The dialog claims <c>aria-modal="true"</c>,
    /// and a modal that stays open while the user edits the field behind it
    /// is telling assistive technology one thing and doing another. The
    /// trigger button needs no such handler: its own click handler toggles.
    /// </summary>
    private void OnFieldClick()
    {
        if (_open) CloseDialog(refocus: false);
    }

    // -------------------------------------------------------------------
    // Formatting — every visible string comes from CultureInfo or a parameter.
    // -------------------------------------------------------------------

    private static CultureInfo ResolveCulture(string? locale)
    {
        if (string.IsNullOrEmpty(locale)) return CultureInfo.InvariantCulture;
        try
        {
            return CultureInfo.GetCultureInfo(locale);
        }
        catch (CultureNotFoundException)
        {
            return CultureInfo.InvariantCulture;
        }
    }

    /// <summary>Does this locale write times on a 12-hour clock?</summary>
    private static bool LocaleUsesHour12(string? locale)
        => ResolveCulture(locale).DateTimeFormat.ShortTimePattern.Contains('h');

    /// <summary>The locale's own AM / PM strings, so neither is hardcoded.</summary>
    private string DayPeriodName(bool pm)
    {
        var dtfi = ResolveCulture(Locale).DateTimeFormat;
        return pm ? dtfi.PMDesignator : dtfi.AMDesignator;
    }

    private string FormatTimeForDisplay(string isoTime)
    {
        var parsed = ParseIsoTime(isoTime);
        if (parsed is null) return isoTime;
        var culture = ResolveCulture(Locale);
        var time = new TimeOnly(parsed.Value.Hour, parsed.Value.Minute);
        try
        {
            return time.ToString(Clock12 ? "h:mm tt" : "HH:mm", culture);
        }
        catch
        {
            return isoTime;
        }
    }

    /// <summary>Render an ISO value the way this locale writes it.</summary>
    private string DefaultFormatValue(string isoValue)
    {
        if (string.IsNullOrEmpty(isoValue)) return "";
        var (date, time) = SplitValue(isoValue, Mode);
        var culture = ResolveCulture(Locale);
        var chunks = new List<string>();
        var parsed = !string.IsNullOrEmpty(date) ? ParseIsoDate(date) : null;
        if (parsed is { } p)
        {
            try
            {
                chunks.Add(p.ToDateOnly().ToString("dd MMM yyyy", culture));
            }
            catch
            {
                chunks.Add(date);
            }
        }
        if (!string.IsNullOrEmpty(time)) chunks.Add(FormatTimeForDisplay(time));
        return string.Join(" ", chunks);
    }

    /// <summary>Accessible name for one day cell, e.g. "Sunday 1 March 2026".</summary>
    private string DayLabel(string isoDate)
    {
        var parsed = ParseIsoDate(isoDate);
        if (parsed is null) return isoDate;
        var culture = ResolveCulture(Locale);
        try
        {
            return parsed.Value.ToDateOnly().ToString("dddd d MMMM yyyy", culture);
        }
        catch
        {
            return isoDate;
        }
    }

    // -------------------------------------------------------------------
    // Time selects.
    // -------------------------------------------------------------------

    private void SetHour(int hour) => _pendingTime = FormatIsoTime(new CivilTime(hour, PendingMinute));

    private void SetMinute(int minute) => _pendingTime = FormatIsoTime(new CivilTime(PendingHour, minute));

    /// <summary>Cross between AM and PM without changing the minute of the hour.</summary>
    private void SetMeridiem(bool pm) => SetHour(PendingHour % 12 + (pm ? 12 : 0));

    private void OnHourChange(ChangeEventArgs args)
    {
        if (int.TryParse(args.Value?.ToString(), NumberStyles.Integer, CultureInfo.InvariantCulture, out var hour))
        {
            SetHour(hour);
        }
    }

    private void OnMinuteChange(ChangeEventArgs args)
    {
        if (int.TryParse(args.Value?.ToString(), NumberStyles.Integer, CultureInfo.InvariantCulture, out var minute))
        {
            SetMinute(minute);
        }
    }

    private void OnMeridiemChange(ChangeEventArgs args)
        => SetMeridiem(string.Equals(args.Value?.ToString(), "pm", StringComparison.Ordinal));

    // -------------------------------------------------------------------
    // Shortcuts.
    // -------------------------------------------------------------------

    private async Task ApplyShortcutAsync(DateTimeShortcut shortcut)
    {
        var baseDate = TodayIso();
        var target = shortcut.Date ?? baseDate;
        if (shortcut.Days is { } days) target = AddDays(baseDate, days);
        else if (shortcut.Months is { } months) target = AddMonths(baseDate, months);

        // A shortcut to a blocked date does nothing rather than landing
        // somewhere near it: "+4 weeks" that quietly means "+27 days" is a
        // booking error waiting to happen.
        if (DayDisabled(target)) return;

        _pendingDate = target;
        _cursor = target;
        var parsed = ParseIsoDate(target);
        if (parsed is { } p)
        {
            _viewYear = p.Year;
            _viewMonth = p.Month;
        }
        await OnShortcut.InvokeAsync((shortcut.Id, target));
        if (CommitOnDay)
        {
            await CommitAsync();
        }
        else
        {
            _suppressFocusOut = true;
            _focusCursorAfterRender = true;
        }
    }

    // -------------------------------------------------------------------
    // Civil-date arithmetic — pure and total: no throwing, null for "not a
    // date". Exported so consumers wiring min/max/shortcuts/isDateDisabled
    // do their own date maths without reaching for a zoned DateTime.
    // -------------------------------------------------------------------

    private static readonly Regex IsoDateRegex = new(@"^(\d{4})-(\d{2})-(\d{2})$", RegexOptions.Compiled);
    private static readonly Regex IsoTimeRegex = new(@"^(\d{2}):(\d{2})$", RegexOptions.Compiled);
    private static readonly Regex TimeWithMeridiemRegex = new(@"^(\d{1,2})[:.]?(\d{2})\s*([ap])\.?m\.?$", RegexOptions.Compiled);
    private static readonly Regex TimePlainRegex = new(@"^(\d{1,2})[:.]?(\d{2})$", RegexOptions.Compiled);
    private static readonly int UnixEpochDayNumber = new DateOnly(1970, 1, 1).DayNumber;

    /// <summary>Zero-pad to <paramref name="width"/>.</summary>
    private static string Pad(int n, int width = 2)
        => Math.Abs(n).ToString(CultureInfo.InvariantCulture).PadLeft(width, '0');

    /// <summary>Days in a month. <paramref name="month"/> is 1-12.</summary>
    public static int DaysInMonth(int year, int month) => DateTime.DaysInMonth(year, month);

    /// <summary><c>{2026, 3, 1}</c> → <c>"2026-03-01"</c>.</summary>
    public static string FormatIsoDate(CivilDate date) => $"{date.Year:D4}-{Pad(date.Month)}-{Pad(date.Day)}";

    /// <summary>
    /// <c>"2026-03-01"</c> → <c>{2026, 3, 1}</c>, or null. Rejects impossible
    /// components rather than rolling them over, so <c>"2026-02-31"</c> is
    /// null and not the 3rd of March.
    /// </summary>
    public static CivilDate? ParseIsoDate(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return null;
        var match = IsoDateRegex.Match(text.Trim());
        if (!match.Success) return null;
        var year = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
        var month = int.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture);
        var day = int.Parse(match.Groups[3].Value, CultureInfo.InvariantCulture);
        if (month is < 1 or > 12) return null;
        if (day < 1 || day > DaysInMonth(year, month)) return null;
        return new CivilDate(year, month, day);
    }

    /// <summary>Days since the Unix epoch. Backed by <see cref="DateOnly.DayNumber"/>.</summary>
    public static long ToEpochDay(CivilDate date) => date.ToDateOnly().DayNumber - UnixEpochDayNumber;

    /// <summary>Inverse of <see cref="ToEpochDay"/>.</summary>
    public static CivilDate FromEpochDay(long epochDay)
        => CivilDate.FromDateOnly(DateOnly.FromDayNumber((int)(epochDay + UnixEpochDayNumber)));

    /// <summary>Shift an ISO date by whole days.</summary>
    public static string AddDays(string isoDate, int days)
    {
        var date = ParseIsoDate(isoDate);
        if (date is null) return isoDate;
        return FormatIsoDate(CivilDate.FromDateOnly(date.Value.ToDateOnly().AddDays(days)));
    }

    /// <summary>
    /// Shift an ISO date by whole months, clamping the day: 31 January + 1
    /// month is 28 February (29 in a leap year), not 3 March. This is
    /// <see cref="DateOnly.AddMonths"/>'s own documented clamping behaviour.
    /// </summary>
    public static string AddMonths(string isoDate, int months)
    {
        var date = ParseIsoDate(isoDate);
        if (date is null) return isoDate;
        return FormatIsoDate(CivilDate.FromDateOnly(date.Value.ToDateOnly().AddMonths(months)));
    }

    /// <summary>Day of week: 0 = Sunday … 6 = Saturday.</summary>
    public static int WeekdayOf(string isoDate)
    {
        var date = ParseIsoDate(isoDate);
        if (date is null) return 0;
        return (int)date.Value.ToDateOnly().DayOfWeek;
    }

    /// <summary>ISO-8601 week number, via <see cref="ISOWeek"/>.</summary>
    public static int IsoWeek(string isoDate)
    {
        var date = ParseIsoDate(isoDate);
        if (date is null) return 0;
        return System.Globalization.ISOWeek.GetWeekOfYear(date.Value.ToDateOnly().ToDateTime(TimeOnly.MinValue));
    }

    /// <summary><c>"09:30"</c> → <c>{9, 30}</c>, or null.</summary>
    public static CivilTime? ParseIsoTime(string text)
    {
        var match = IsoTimeRegex.Match(text.Trim());
        if (!match.Success) return null;
        var hour = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
        var minute = int.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture);
        if (hour > 23 || minute > 59) return null;
        return new CivilTime(hour, minute);
    }

    /// <summary><c>{9, 30}</c> → <c>"09:30"</c>.</summary>
    public static string FormatIsoTime(CivilTime time) => $"{Pad(time.Hour)}:{Pad(time.Minute)}";

    /// <summary>Pull the date and time halves out of a mode-appropriate ISO value.</summary>
    public static (string Date, string Time) SplitValue(string value, DateTimeMode mode)
    {
        if (string.IsNullOrEmpty(value)) return ("", "");
        if (mode == DateTimeMode.Time)
        {
            return ("", ParseIsoTime(value) is not null ? value : "");
        }
        var parts = value.Split('T', 2);
        var datePart = parts.Length > 0 ? parts[0] : "";
        var timePart = parts.Length > 1 ? parts[1] : "";
        var date = ParseIsoDate(datePart) is not null ? datePart : "";
        var time = mode == DateTimeMode.DateTime && ParseIsoTime(timePart) is not null ? timePart : "";
        return (date, time);
    }

    /// <summary>Recombine the halves. Returns "" when the value is incomplete.</summary>
    public static string JoinValue(string date, string time, DateTimeMode mode)
    {
        if (mode == DateTimeMode.Date) return date;
        if (mode == DateTimeMode.Time) return time;
        return !string.IsNullOrEmpty(date) && !string.IsNullOrEmpty(time) ? $"{date}T{time}" : "";
    }

    /// <summary>Is <paramref name="isoDate"/> inside the inclusive [min, max] window? Empty bounds pass.</summary>
    public static bool WithinRange(string isoDate, string? min, string? max)
    {
        if (!string.IsNullOrEmpty(min) && string.CompareOrdinal(isoDate, min) < 0) return false;
        if (!string.IsNullOrEmpty(max) && string.CompareOrdinal(isoDate, max) > 0) return false;
        return true;
    }

    /// <summary>
    /// First day of the week for a locale: 0 = Sunday … 6 = Saturday.
    /// Sourced from <see cref="DateTimeFormatInfo.FirstDayOfWeek"/>, whose
    /// enum values already agree with this encoding. An unresolvable tag
    /// falls back to Monday — the ISO-8601 rule and the majority convention.
    /// </summary>
    public static int FirstDayOfWeekFor(string? locale)
    {
        if (string.IsNullOrEmpty(locale)) return 1;
        try
        {
            var culture = CultureInfo.GetCultureInfo(locale);
            if (Equals(culture, CultureInfo.InvariantCulture)) return 1;
            return (int)culture.DateTimeFormat.FirstDayOfWeek;
        }
        catch (CultureNotFoundException)
        {
            return 1;
        }
    }

    /// <summary>
    /// The dates of one month's grid, always six rows of seven. See
    /// spec/index.md §3 for why the height is fixed.
    /// </summary>
    public static string[][] MonthMatrix(int year, int month, int firstDayOfWeek)
    {
        var first = FormatIsoDate(new CivilDate(year, month, 1));
        var lead = ((WeekdayOf(first) - firstDayOfWeek) % 7 + 7) % 7;
        var start = AddDays(first, -lead);
        var weeks = new string[6][];
        for (var row = 0; row < 6; row++)
        {
            var week = new string[7];
            for (var col = 0; col < 7; col++)
            {
                week[col] = AddDays(start, row * 7 + col);
            }
            weeks[row] = week;
        }
        return weeks;
    }

    /// <summary>Long and short month names for a locale, index 0 = January.</summary>
    public static (string[] Long, string[] Short) MonthNames(string? locale)
    {
        var dtfi = ResolveCulture(locale).DateTimeFormat;
        var longNames = new string[12];
        var shortNames = new string[12];
        for (var i = 0; i < 12; i++)
        {
            longNames[i] = dtfi.GetMonthName(i + 1);
            shortNames[i] = dtfi.GetAbbreviatedMonthName(i + 1);
        }
        return (longNames, shortNames);
    }

    private static string StripDiacritics(string s)
    {
        var normalized = s.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(normalized.Length);
        foreach (var c in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark) sb.Append(c);
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }

    private static string NormalizeToken(string s) => StripDiacritics(s.Trim().TrimEnd('.').ToLowerInvariant());

    /// <summary>Match a token against a locale's month names. Returns 1-12, or 0.</summary>
    private static int MatchMonthName(string token, (string[] Long, string[] Short) names)
    {
        var t = NormalizeToken(token);
        if (t.Length == 0 || t.All(char.IsDigit)) return 0;
        for (var i = 0; i < 12; i++)
        {
            if (NormalizeToken(names.Long[i]) == t) return i + 1;
            if (NormalizeToken(names.Short[i]) == t) return i + 1;
        }
        // Prefix match, so "Sept" finds September. Three characters
        // minimum: "Ma" cannot choose between March and May.
        if (t.Length >= 3)
        {
            for (var i = 0; i < 12; i++)
            {
                var longName = NormalizeToken(names.Long[i]);
                if (longName.Length > 0 && longName.StartsWith(t, StringComparison.Ordinal)) return i + 1;
            }
        }
        return 0;
    }

    /// <summary>
    /// The order a locale writes a numeric date in — <c>["day","month","year"]</c>
    /// for en-GB, <c>["month","day","year"]</c> for en-US. Derived from
    /// <see cref="DateTimeFormatInfo.ShortDatePattern"/>'s letter order.
    /// </summary>
    public static string[] NumericFieldOrder(string? locale)
    {
        var pattern = ResolveCulture(locale).DateTimeFormat.ShortDatePattern;
        var dIndex = pattern.IndexOf('d');
        var mIndex = pattern.IndexOf('M');
        var yIndex = pattern.IndexOf('y');
        if (dIndex < 0 || mIndex < 0 || yIndex < 0) return new[] { "day", "month", "year" };
        return new[] { ("day", dIndex), ("month", mIndex), ("year", yIndex) }
            .OrderBy(x => x.Item2)
            .Select(x => x.Item1)
            .ToArray();
    }

    /// <summary>
    /// Parse typed text into an ISO date. Accepts, in order: ISO
    /// <c>YYYY-MM-DD</c>; a numeric form whose field order follows the
    /// locale; and a form with a written month matched against the
    /// locale's own long and short month names. Anything else is null.
    /// </summary>
    public static string? ParseDateInput(string text, string? locale)
    {
        var trimmed = text.Trim();
        if (trimmed.Length == 0) return null;

        var iso = ParseIsoDate(trimmed);
        if (iso is { } isoDate) return FormatIsoDate(isoDate);

        var parts = Regex.Split(trimmed, @"[\s./-]+").Where(p => p.Length > 0).ToArray();
        if (parts.Length != 3) return null;

        // Look for a written month first. Whichever field it is, the other
        // two are the day and the year, and their order is then decidable
        // without knowing the locale: the larger number is the year.
        var names = MonthNames(locale);
        var month = 0;
        var monthIndex = -1;
        for (var i = 0; i < parts.Length; i++)
        {
            var found = MatchMonthName(parts[i], names);
            if (found != 0)
            {
                month = found;
                monthIndex = i;
                break;
            }
        }

        int day;
        int year;

        if (monthIndex >= 0)
        {
            var rest = new List<int>();
            for (var i = 0; i < parts.Length; i++)
            {
                if (i == monthIndex) continue;
                if (!int.TryParse(parts[i], NumberStyles.Integer, CultureInfo.InvariantCulture, out var n)) return null;
                rest.Add(n);
            }
            if (rest[0] > rest[1]) { day = rest[1]; year = rest[0]; }
            else { day = rest[0]; year = rest[1]; }
        }
        else
        {
            var nums = new int[3];
            for (var i = 0; i < 3; i++)
            {
                if (!int.TryParse(parts[i], NumberStyles.Integer, CultureInfo.InvariantCulture, out nums[i])) return null;
            }
            var order = NumericFieldOrder(locale);
            year = nums[Array.IndexOf(order, "year")];
            day = nums[Array.IndexOf(order, "day")];
            month = nums[Array.IndexOf(order, "month")];
        }

        // Two-digit years: the usual 70 pivot. Documented rather than
        // clever, because any choice here is wrong for someone.
        if (year < 100) year += year < 70 ? 2000 : 1900;
        if (month is < 1 or > 12) return null;
        if (day < 1 || day > DaysInMonth(year, month)) return null;
        return FormatIsoDate(new CivilDate(year, month, day));
    }

    /// <summary>Accepts <c>9:30</c>, <c>09:30</c>, <c>0930</c>, <c>9.30</c>, and a trailing am/pm.</summary>
    public static string? ParseTimeInput(string text)
    {
        var t = text.Trim().ToLowerInvariant();
        int hour, minute;
        string? meridiem = null;

        var withMeridiem = TimeWithMeridiemRegex.Match(t);
        if (withMeridiem.Success)
        {
            hour = int.Parse(withMeridiem.Groups[1].Value, CultureInfo.InvariantCulture);
            minute = int.Parse(withMeridiem.Groups[2].Value, CultureInfo.InvariantCulture);
            meridiem = withMeridiem.Groups[3].Value;
        }
        else
        {
            var plain = TimePlainRegex.Match(t);
            if (!plain.Success) return null;
            hour = int.Parse(plain.Groups[1].Value, CultureInfo.InvariantCulture);
            minute = int.Parse(plain.Groups[2].Value, CultureInfo.InvariantCulture);
        }

        if (meridiem == "p" && hour < 12) hour += 12;
        if (meridiem == "a" && hour == 12) hour = 0;
        if (hour > 23 || minute > 59) return null;
        return FormatIsoTime(new CivilTime(hour, minute));
    }

    /// <summary>Mint a stable per-instance id prefix; SSR-safe.</summary>
    public static string NextDateTimePickerId() => $"date-time-picker-{Interlocked.Increment(ref _uid)}";

    // -------------------------------------------------------------------
    // JS interop scripts. Exposed to the test project for direct assertion.
    // -------------------------------------------------------------------

    /// <summary>
    /// Build the script that installs a real Tab focus trap on the dialog.
    /// This is the one piece of behaviour Blazor's declarative
    /// <c>@onkeydown</c> genuinely cannot provide: whether Tab's default
    /// action should be prevented depends on <c>document.activeElement</c>
    /// at the moment of the keypress, which is only knowable synchronously
    /// in the browser. Idempotent per dialog element (guarded by a marker
    /// property), and needs no callback into .NET — it only ever redirects
    /// focus at the two edges, exactly like the canonical Svelte
    /// <c>onDialogKeydown</c>; every other Tab keeps its native action.
    /// </summary>
    internal static string BuildInstallFocusTrapScript(string dialogId)
        => "(function(){"
            + $"var dialog=document.getElementById({JsonString(dialogId)});"
            + "if(!dialog||dialog.__lilyDateTimePickerTrap)return;"
            + "dialog.__lilyDateTimePickerTrap=true;"
            + "dialog.addEventListener('keydown',function(e){"
            + "if(e.key!=='Tab')return;"
            + "var focusable=dialog.querySelectorAll('button:not([disabled]):not([tabindex=\"-1\"]), select:not([disabled])');"
            + "if(focusable.length===0)return;"
            + "var first=focusable[0],last=focusable[focusable.length-1];"
            + "var active=document.activeElement;"
            + "if(e.shiftKey&&(active===first||!dialog.contains(active))){e.preventDefault();last.focus();}"
            + "else if(!e.shiftKey&&active===last){e.preventDefault();first.focus();}"
            + "});"
            + "})()";

    private static string JsonString(string s)
    {
        var sb = new StringBuilder(s.Length + 2);
        sb.Append('"');
        foreach (var c in s)
        {
            switch (c)
            {
                case '"': sb.Append("\\\""); break;
                case '\\': sb.Append("\\\\"); break;
                case '\n': sb.Append("\\n"); break;
                case '\r': sb.Append("\\r"); break;
                case '\t': sb.Append("\\t"); break;
                default:
                    if (c < 0x20) sb.Append($"\\u{(int)c:X4}");
                    else sb.Append(c);
                    break;
            }
        }
        sb.Append('"');
        return sb.ToString();
    }
}
