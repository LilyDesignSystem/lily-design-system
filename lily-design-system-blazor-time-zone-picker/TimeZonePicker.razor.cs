// TimeZonePicker — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment. The
/// fragment replaces the default icon inside the button; it does not
/// render options. See <c>spec/index.md §4.2</c>.
/// </summary>
public sealed class TimeZonePickerContext
{
    /// <summary>Currently selected zone, an IANA id.</summary>
    public required string Value { get; init; }

    /// <summary>Is the listbox open?</summary>
    public required bool Open { get; init; }

    /// <summary>Offset, name and label of any zone; null when the runtime does not know it.</summary>
    public required Func<string, ZoneEntry?> InfoFor { get; init; }
}

public partial class TimeZonePicker : ComponentBase
{
    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the button and the listbox. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>BCP 47 tag the zone names are sorted and matched in. Required: the picker never picks a language for you.</summary>
    [Parameter, EditorRequired] public string Locale { get; set; } = "";

    /// <summary>IANA zone ids to offer. Default <see cref="TimeZones.DefaultZones"/>. Shown ordered by offset, not in this order.</summary>
    [Parameter] public IReadOnlyList<string>? Zones { get; set; }

    /// <summary>The moment offsets and names are worked out for. Default: now, read once.</summary>
    [Parameter] public DateTimeOffset? Date { get; set; }

    /// <summary>
    /// Full zone names by IANA id, in the reader's language: <c>(Standard, Daylight)</c>, with a null daylight name for a
    /// zone that has one name all year. .NET has no per-locale zone-name API, so this is where a localized name comes
    /// from: the Unicode CLDR names in <c>LocaleTranslations.ZoneNames("fr-001")</c> (package
    /// <c>LilyDesignSystem.Blazor.LocaleTranslations</c>). A zone without an entry shows the platform's own name.
    /// </summary>
    [Parameter] public IReadOnlyDictionary<string, (string Standard, string? Daylight)>? Names { get; set; }

    /// <summary>Builds an option's text from its entry. Default <c>UTC+01:00 – Central European Standard Time</c>.</summary>
    [Parameter] public Func<ZoneEntry, string>? LabelFor { get; set; }

    /// <summary>Currently selected zone, an IANA id. Bindable via <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";

    /// <summary>Two-way binding callback for <see cref="Value"/>.</summary>
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Initial zone when nothing else is supplied.</summary>
    [Parameter] public string? DefaultValue { get; set; }

    /// <summary>If set, persist the selection to <c>localStorage</c>.</summary>
    [Parameter] public string? StorageKey { get; set; }

    /// <summary>Shared <c>name</c> attribute for the hidden input.</summary>
    [Parameter] public string Name { get; set; } = "time-zone";

    /// <summary>Replaces the default clock icon inside the button.</summary>
    [Parameter] public RenderFragment<TimeZonePickerContext>? ChildContent { get; set; }

    /// <summary>Called after the control applies a new zone.</summary>
    [Parameter] public EventCallback<string> OnChange { get; set; }

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Is the popup open? Bindable: <c>@bind-Open</c>. Setting it from the parent opens or closes the popup without moving focus.</summary>
    [Parameter] public bool Open { get; set; }

    /// <summary>Raised with the new open state whenever the picker changes it (the user's action, or <c>Disabled</c> closing it).</summary>
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }

    /// <summary>Disables the button; an open popup closes.</summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    // -------------------------------------------------------------------
    // Instance state.
    // -------------------------------------------------------------------

    private readonly string _baseId = $"time-zone-picker-{Interlocked.Increment(ref _uid)}";

    private bool _initialised;
    private bool _open;

    /// <summary>Records an open or close the picker made, for <c>@bind-Open</c>.</summary>
    private void ReportOpen(bool open)
    {
        Open = open;
        _ = OpenChanged.InvokeAsync(open);
    }

    /// <summary>Applies <c>Open</c> and <c>Disabled</c> from the parent: state only, focus stays put.</summary>
    protected override void OnParametersSet()
    {
        _infos = TimeZones.Ordered(Zones ?? TimeZones.DefaultZones, Locale, When, Names, LabelFor);
        if (Disabled && Open)
        {
            Open = false;
            _ = OpenChanged.InvokeAsync(false);
        }
        var wanted = Open && !Disabled;
        if (wanted != _open) _open = wanted;
    }
    private int _activeIndex = -1;

    // The zones as the listbox shows them, ordered by offset. The date is read once when none is given: a picker that
    // re-sorted itself while open would move the option under the pointer.
    private readonly DateTimeOffset _whenInitial = DateTimeOffset.UtcNow;
    private DateTimeOffset When => Date ?? _whenInitial;
    private IReadOnlyList<ZoneEntry> _infos = Array.Empty<ZoneEntry>();
    private IReadOnlyList<string> Ids => _infos.Select(z => z.Id).ToList();

    private IconButton? _buttonComponent;
    private Listbox? _listComponent;

    private bool _focusListPending;
    private bool _focusButtonPending;

    /// <summary>Set while the component itself is moving focus, so the root's
    /// focusout handler does not read the move as "focus left the control".</summary>
    private bool _suppressFocusOut;

    /// <summary>Set when a keydown already handled activation, so the click that
    /// the browser synthesises for Enter / Space does not toggle a second time.</summary>
    private bool _suppressNextClick;

    // -------------------------------------------------------------------
    // Ids and view helpers used by the .razor markup.
    // -------------------------------------------------------------------

    private string ListId => $"{_baseId}-list";

    private string OptionId(int index) => $"{_baseId}-option-{index}";

    private string RootClass => $"time-zone-picker {CssClass}".Trim();

    // -------------------------------------------------------------------
    // Helpers — exposed for tests and consumers.
    // -------------------------------------------------------------------

    private TimeZonePickerContext BuildContext() => new()
    {
        Value = Value ?? "",
        Open = _open,
        InfoFor = id => TimeZones.Info(id, When, Names, LabelFor),
    };

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && !_initialised)
        {
            _initialised = true;

            var initial = await ResolveInitialAsync();
            if (!string.IsNullOrEmpty(initial))
            {
                if (initial != Value)
                {
                    Value = initial;
                    await ValueChanged.InvokeAsync(Value);
                    StateHasChanged();
                }
                await ApplyZoneAsync(initial);
            }
        }

        // Focus moves are deferred to after render: the listbox cannot take
        // focus while it still carries `hidden`.
        if (_focusListPending)
        {
            _focusListPending = false;
            if (_listComponent is not null) await TryFocusAsync(_listComponent.Element);
        }
        if (_focusButtonPending)
        {
            _focusButtonPending = false;
            if (_buttonComponent is not null) await TryFocusAsync(_buttonComponent.Element);
        }
    }

    // preventScroll stops the browser's default scroll-into-view: the
    // listbox/list is positioned by CSS (see AGENTS/theme.md), and without
    // a consumer override for a right-edge header it can render partly
    // off-screen, and focusing it then auto-scrolled the whole page --
    // which reads as the page jumping sideways the instant the picker
    // opens.
    private static async Task TryFocusAsync(ElementReference element)
    {
        try
        {
            await element.FocusAsync(preventScroll: true);
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private async Task<string> ResolveInitialAsync()
    {
        if (!string.IsNullOrEmpty(Value)) return Value;
        var ids = Ids;

        // A stored zone that is no longer offered is not restored.
        if (!string.IsNullOrEmpty(StorageKey))
        {
            try
            {
                var stored = await JS.InvokeAsync<string?>(
                    "eval",
                    $"(function(){{try{{return localStorage.getItem({JsonString(StorageKey!)});}}catch(e){{return null;}}}})()");
                if (!string.IsNullOrEmpty(stored) && ids.Contains(stored!)) return stored!;
            }
            catch { /* prerender / interop unavailable */ }
        }

        if (!string.IsNullOrEmpty(DefaultValue)) return DefaultValue!;
        if (ids.Count == 0) return "";

        // The reader's own zone (the browser's, not the server's) when it is listed, or its listed twin.
        try
        {
            var system = await JS.InvokeAsync<string?>(
                "eval",
                "(function(){try{return new Intl.DateTimeFormat().resolvedOptions().timeZone||null;}catch(e){return null;}})()");
            var matched = TimeZones.MatchZone(system, _infos, When, Names);
            if (!string.IsNullOrEmpty(matched)) return matched!;
        }
        catch { /* prerender / interop unavailable */ }

        return ids.Contains("UTC") ? "UTC" : ids[0];
    }

    // -------------------------------------------------------------------
    // Open / close.
    // -------------------------------------------------------------------

    /// <summary>Open the listbox. The active option defaults to the selected
    /// one (or the first), unless <paramref name="startIndex"/> overrides it.</summary>
    private void OpenList(int? startIndex = null)
    {
        if (Disabled) return;
        var selected = IndexOfValue();
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        _activeIndex = _infos.Count == 0
            ? -1
            : startIndex ?? (selected >= 0 ? selected : 0);
        _open = true;
        ReportOpen(true);
        _focusListPending = true;
        _suppressFocusOut = true;
        StateHasChanged();
    }

    /// <summary>Close the listbox, optionally returning focus to the button.</summary>
    private void CloseList(bool refocus = true)
    {
        if (!_open) return;
        _open = false;
        ReportOpen(false);
        _activeIndex = -1;
        if (refocus)
        {
            _focusButtonPending = true;
            _suppressFocusOut = true;
        }
        StateHasChanged();
    }

    private int IndexOfValue()
    {
        for (var i = 0; i < _infos.Count; i++)
        {
            if (_infos[i].Id == Value) return i;
        }
        return -1;
    }

    private async Task ChooseAsync(int index)
    {
        if (index >= 0 && index < _infos.Count)
        {
            var slug = _infos[index].Id;
            CloseList();
            if (!string.IsNullOrEmpty(slug)) await SetZoneAsync(slug);
            return;
        }
        CloseList();
    }

    // -------------------------------------------------------------------
    // Event handlers.
    //
    // Arrow/Home/End/PageUp/PageDown/typeahead/Escape/Tab keyboard
    // handling inside the open list is owned by the composed `Listbox`'s
    // `Navigation="active-descendant"` mode (see
    // LilyBlazorHeadless.Components); this component only decides what
    // open/close/choose mean.
    // -------------------------------------------------------------------

    private Task OnButtonClickAsync()
    {
        TipOnClick();
        if (_suppressNextClick)
        {
            _suppressNextClick = false;
            return Task.CompletedTask;
        }
        if (_open) CloseList();
        else OpenList();
        return Task.CompletedTask;
    }

    private Task OnButtonKeyDownAsync(KeyboardEventArgs args)
    {
        TipOnKeyDown(args);
        switch (args.Key)
        {
            case "ArrowDown":
            case "Enter":
            case " ":
                // Enter and Space also synthesise a click on a <button>;
                // swallow it so the listbox is not toggled twice.
                _suppressNextClick = true;
                OpenList();
                break;
            case "ArrowUp":
                _suppressNextClick = true;
                OpenList(_infos.Count - 1);
                break;
        }
        return Task.CompletedTask;
    }

    /// <summary>
    /// Focus leaving the root closes the listbox. Blazor's
    /// <see cref="FocusEventArgs"/> does not expose <c>relatedTarget</c>, so
    /// focus moves the component made itself are flagged instead.
    /// </summary>
    private Task OnRootFocusOutAsync()
    {
        if (_suppressFocusOut)
        {
            _suppressFocusOut = false;
            return Task.CompletedTask;
        }
        CloseList(false);
        return Task.CompletedTask;
    }

    // -------------------------------------------------------------------
    // Test seams (InternalsVisibleTo). bUnit has no live focus model, so
    // the suite asserts which element a FocusAsync interop call targeted
    // by comparing ElementReference ids — the same technique the
    // DateTimePicker suite uses.
    // -------------------------------------------------------------------

    /// <summary>The trigger button's ElementReference id, once rendered.</summary>
    internal string? ButtonReferenceId => _buttonComponent?.Element.Id;

    /// <summary>The listbox's ElementReference id, once rendered.</summary>
    internal string? ListReferenceId => _listComponent?.Element.Id;

    // -------------------------------------------------------------------
    // Apply / set.
    // -------------------------------------------------------------------

    /// <summary>Apply a zone imperatively. Public so consumers can drive the
    /// control from their own UI.</summary>
    public async Task SetZoneAsync(string slug)
    {
        if (string.IsNullOrEmpty(slug)) return;
        if (slug == Value)
        {
            await ApplyZoneAsync(slug);
            return;
        }
        Value = slug;
        await ValueChanged.InvokeAsync(Value);
        await ApplyZoneAsync(slug);
        StateHasChanged();
    }

    private async Task ApplyZoneAsync(string slug)
    {
        var script = BuildApplyScript(slug, StorageKey);
        try
        {
            await JS.InvokeVoidAsync("eval", script);
        }
        catch
        {
            // ignore prerender / interop failure
        }
        await OnChange.InvokeAsync(slug);
    }

    /// <summary>Build the JS snippet that mutates the DOM. Exposed for tests.</summary>
    internal static string BuildApplyScript(string slug, string? storageKey)
    {
        var slugLit = JsonString(slug);
        var storageLine = string.IsNullOrEmpty(storageKey)
            ? ""
            : $"try{{localStorage.setItem({JsonString(storageKey!)},{slugLit});}}catch(e){{}}";

        return "(function(){"
            + $"document.documentElement.setAttribute('data-time-zone',{slugLit});"
            + storageLine
            + "})();";
    }

    private static string JsonString(string s)
    {
        var sb = new System.Text.StringBuilder(s.Length + 2);
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

    // -------------------------------------------------------------------
    // Tooltip — spec/index.md §4.2 "Tooltip". Purely visual; the text is
    // the button's Label, so it is NOT linked with aria-describedby.
    // Blazor deviation (spec §9): no JS interop, so keyboard focus cannot
    // be told apart with matches(':focus-visible'). A mousedown on the
    // button immediately before its focus event marks the focus as
    // pointer-induced (no tooltip); any other focus counts as keyboard.
    // -------------------------------------------------------------------

    private bool _tipHoverButton;
    private bool _tipHoverTooltip;
    private bool _tipFocusButton;
    private bool _tipDismissed;
    private bool _tipPointerDown;

    private string TooltipId => $"{_baseId}-tooltip";

    private bool TooltipVisible
        => !_open && !_tipDismissed && (_tipHoverButton || _tipHoverTooltip || _tipFocusButton);

    private void OnTipButtonEnter() { _tipHoverButton = true; _tipDismissed = false; }

    private void OnTipButtonLeave() => _tipHoverButton = false;

    private void OnTipButtonMouseDown() => _tipPointerDown = true;

    private void OnTipButtonFocus()
    {
        _tipFocusButton = !_tipPointerDown;
        _tipPointerDown = false;
    }

    private void OnTipButtonBlur()
    {
        _tipFocusButton = false;
        _tipDismissed = false;
        _tipPointerDown = false;
    }

    private void OnTipTooltipEnter() => _tipHoverTooltip = true;

    private void OnTipTooltipLeave() => _tipHoverTooltip = false;

    /// <summary>Clicking the button clears hover (the popup toggle follows).</summary>
    private void TipOnClick() => _tipHoverButton = false;

    /// <summary>Escape pressed anywhere inside the root (focus on any child while the
    /// tooltip is visible by hover) dismisses it. Blazor deviation: no document-level
    /// listener without JS interop, so Escape with focus outside the root is not
    /// handled. Never moves focus, never prevents default.</summary>
    private void OnTipRootKeyDown(KeyboardEventArgs args)
    {
        if (args.Key == "Escape" && TooltipVisible) _tipDismissed = true;
    }

    /// <summary>Escape dismisses a visible tooltip without moving focus.</summary>
    private void TipOnKeyDown(KeyboardEventArgs args)
    {
        _tipPointerDown = false;
        if (args.Key == "Escape" && TooltipVisible) _tipDismissed = true;
    }
}
