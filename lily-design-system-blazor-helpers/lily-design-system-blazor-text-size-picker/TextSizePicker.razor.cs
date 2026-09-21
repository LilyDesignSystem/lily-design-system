// TextSizePicker — code-behind. See spec/index.md for the contract.

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
public sealed class TextSizePickerContext
{
    /// <summary>Currently selected size slug.</summary>
    public required string Value { get; init; }

    /// <summary>Is the listbox open?</summary>
    public required bool Open { get; init; }

    /// <summary>Resolve a slug to its display label.</summary>
    public required Func<string, string> LabelFor { get; init; }
}

public partial class TextSizePicker : ComponentBase
{
    // Default button icon: a bundled SVG (a stroke-drawn "A"), not a
    // Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
    // convention (was the plain letter U+0041, exposed as the constant
    // LatinCapitalLetterA -- removed, not renamed). See TextSizePicker.razor.

    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the button and the listbox. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Available text-size slugs.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<string> Sizes { get; set; } = Array.Empty<string>();

    /// <summary>Currently selected size slug. Bindable via <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";

    /// <summary>Two-way binding callback for <see cref="Value"/>.</summary>
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Initial size when nothing else is supplied.</summary>
    [Parameter] public string? DefaultValue { get; set; }

    /// <summary>If set, persist the selection to <c>localStorage</c>.</summary>
    [Parameter] public string? StorageKey { get; set; }

    /// <summary>Shared <c>name</c> attribute for the hidden input.</summary>
    [Parameter] public string Name { get; set; } = "text-size";

    /// <summary>Optional pretty labels per size slug.</summary>
    [Parameter] public IReadOnlyDictionary<string, string> SizeLabels { get; set; }
        = new Dictionary<string, string>();

    /// <summary>Replaces the default "A" icon inside the button.</summary>
    [Parameter] public RenderFragment<TextSizePickerContext>? ChildContent { get; set; }

    /// <summary>Called after the control applies a new size.</summary>
    [Parameter] public EventCallback<string> OnChange { get; set; }

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    // -------------------------------------------------------------------
    // Instance state.
    // -------------------------------------------------------------------

    private readonly string _baseId = $"text-size-picker-{Interlocked.Increment(ref _uid)}";

    private bool _initialised;
    private bool _open;
    private int _activeIndex = -1;

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

    private string RootClass => $"text-size-picker {CssClass}".Trim();

    // -------------------------------------------------------------------
    // Helpers — exposed for tests and consumers.
    // -------------------------------------------------------------------

    /// <summary>
    /// Resolve a size slug to its display label: each hyphen-separated
    /// word title-cased, so <c>"x-large"</c> renders as <c>"X Large"</c>.
    /// Mirrors <c>ThemePicker.ThemeName</c> and <c>Locales.LocaleName</c>.
    /// </summary>
    /// <remarks>
    /// Public and pure, so consumers driving the control from their own
    /// UI can render matching labels without duplicating the rule.
    /// </remarks>
    public static string SizeName(string slug)
    {
        if (string.IsNullOrEmpty(slug)) return slug;
        return string.Join(" ", slug.Split('-')
            .Select(word => word.Length == 0 ? word : char.ToUpperInvariant(word[0]) + word[1..]));
    }

    /// <summary>Instance label resolution: consumer override first, then
    /// the shared <see cref="SizeName"/> rule.</summary>
    private string LabelFor(string slug)
    {
        if (SizeLabels.TryGetValue(slug, out var pretty)) return pretty;
        return SizeName(slug);
    }

    private TextSizePickerContext BuildContext() => new()
    {
        Value = Value ?? "",
        Open = _open,
        LabelFor = LabelFor,
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
                await ApplySizeAsync(initial);
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

        if (!string.IsNullOrEmpty(StorageKey))
        {
            try
            {
                var stored = await JS.InvokeAsync<string?>(
                    "eval",
                    $"(function(){{try{{return localStorage.getItem({JsonString(StorageKey!)});}}catch(e){{return null;}}}})()");
                if (!string.IsNullOrEmpty(stored)) return stored!;
            }
            catch { /* prerender / interop unavailable */ }
        }

        if (!string.IsNullOrEmpty(DefaultValue)) return DefaultValue!;
        if (Sizes.Count == 0) return "";

        foreach (var s in Sizes)
        {
            if (s == "medium") return "medium";
        }
        return Sizes[0];
    }

    // -------------------------------------------------------------------
    // Open / close.
    // -------------------------------------------------------------------

    /// <summary>Open the listbox. The active option defaults to the selected
    /// one (or the first), unless <paramref name="startIndex"/> overrides it.</summary>
    private void OpenList(int? startIndex = null)
    {
        var selected = IndexOfValue();
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        _activeIndex = Sizes.Count == 0
            ? -1
            : startIndex ?? (selected >= 0 ? selected : 0);
        _open = true;
        _focusListPending = true;
        _suppressFocusOut = true;
        StateHasChanged();
    }

    /// <summary>Close the listbox, optionally returning focus to the button.</summary>
    private void CloseList(bool refocus = true)
    {
        if (!_open) return;
        _open = false;
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
        for (var i = 0; i < Sizes.Count; i++)
        {
            if (Sizes[i] == Value) return i;
        }
        return -1;
    }

    private async Task ChooseAsync(int index)
    {
        if (index >= 0 && index < Sizes.Count)
        {
            var slug = Sizes[index];
            CloseList();
            if (!string.IsNullOrEmpty(slug)) await SetSizeAsync(slug);
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
                OpenList(Sizes.Count - 1);
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

    /// <summary>Apply a size imperatively. Public so consumers can drive the
    /// control from their own UI.</summary>
    public async Task SetSizeAsync(string slug)
    {
        if (string.IsNullOrEmpty(slug)) return;
        if (slug == Value)
        {
            await ApplySizeAsync(slug);
            return;
        }
        Value = slug;
        await ValueChanged.InvokeAsync(Value);
        await ApplySizeAsync(slug);
        StateHasChanged();
    }

    private async Task ApplySizeAsync(string slug)
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
            + $"document.documentElement.setAttribute('data-text-size',{slugLit});"
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
}
