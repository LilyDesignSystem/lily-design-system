// SearchPicker — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>Payload for the <c>OnSearch</c> callback.</summary>
public sealed class SearchEventArgs
{
    /// <summary>The trimmed query.</summary>
    public required string Query { get; init; }

    /// <summary>The destination about to be navigated to.</summary>
    public required string Href { get; init; }
}

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment. The
/// fragment replaces the default icon inside the button. See
/// <c>spec/index.md §4.1</c>.
/// </summary>
public sealed class SearchPickerContext
{
    /// <summary>Is the search panel open?</summary>
    public required bool Open { get; init; }

    /// <summary>The current text in the search field.</summary>
    public required string Query { get; init; }
}

public partial class SearchPicker : ComponentBase
{
    /// <summary>
    /// The submit button's visible content: U+23CE RETURN SYMBOL, a bare
    /// literal character (never an escape — see <c>bin/test</c>'s glyph
    /// check). It is the button's visible label only; the accessible name
    /// comes from the required <see cref="SubmitLabel"/>, so assistive
    /// technology never has to announce a symbol.
    /// </summary>
    public const string ReturnSymbol = "⏎";

    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the icon button and the search landmark. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Accessible name for the search text field. Required.</summary>
    [Parameter, EditorRequired] public string InputLabel { get; set; } = "";

    /// <summary>Accessible name for the ⏎ submit button. Required.</summary>
    [Parameter, EditorRequired] public string SubmitLabel { get; set; } = "";

    /// <summary>Placeholder text for the search field. No default.</summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <summary>The search text. Two-way bindable via <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";

    /// <summary>Fires whenever the field's text changes.</summary>
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>
    /// Path the query is appended to. The search for <c>foo</c> navigates to
    /// <c>{Action}?foo</c>; the default <c>"/"</c> gives <c>/?foo</c>.
    /// </summary>
    [Parameter] public string Action { get; set; } = "/";

    /// <summary>
    /// Performs the navigation. Defaults to
    /// <c>NavigationManager.NavigateTo(href, forceLoad: true)</c> — a real
    /// GET request. Pass your own to keep the navigation in-app.
    /// </summary>
    [Parameter] public Action<string>? Navigate { get; set; }

    /// <summary>Fires with the trimmed query and the destination, before navigating.</summary>
    [Parameter] public EventCallback<SearchEventArgs> OnSearch { get; set; }

    /// <summary>Replaces the default magnifying-glass icon inside the button.</summary>
    [Parameter] public RenderFragment<SearchPickerContext>? ChildContent { get; set; }

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    [Inject] private NavigationManager Navigation { get; set; } = default!;

    // -------------------------------------------------------------------
    // Instance state.
    // -------------------------------------------------------------------

    private readonly string _baseId = NextSearchPickerId();

    private bool _open;

    private IconButton? _triggerComponent;
    private ElementReference _inputElement;

    private bool _focusInputPending;
    private bool _focusTriggerPending;

    // -------------------------------------------------------------------
    // Ids and view helpers used by the .razor markup.
    // -------------------------------------------------------------------

    private string PanelId => $"{_baseId}-panel";

    private string RootClass => $"search-picker {CssClass}".Trim();

    private SearchPickerContext BuildContext() => new()
    {
        Open = _open,
        Query = Value,
    };

    // -------------------------------------------------------------------
    // Helpers — exposed for tests and consumers.
    // -------------------------------------------------------------------

    /// <summary>Mint a stable per-instance id prefix; SSR-safe.</summary>
    public static string NextSearchPickerId()
        => $"search-picker-{Interlocked.Increment(ref _uid)}";

    /// <summary>
    /// The destination for a query: <paramref name="action"/> + <c>?</c> +
    /// the trimmed, URI-encoded query. <c>SearchHref("foo")</c> is
    /// <c>"/?foo"</c>; <c>SearchHref("foo bar")</c> is <c>"/?foo%20bar"</c>.
    /// </summary>
    public static string SearchHref(string query, string action = "/")
        => $"{action}?{EncodeUriComponent(query.Trim())}";

    /// <summary>
    /// Byte-for-byte JavaScript <c>encodeURIComponent</c>.
    /// <see cref="Uri.EscapeDataString(string)"/> leaves only RFC 3986
    /// unreserved characters bare, so it also escapes <c>! ' ( ) *</c>,
    /// which <c>encodeURIComponent</c> leaves alone; those five are put
    /// back so a query produces the same URL in every Lily catalog.
    /// </summary>
    internal static string EncodeUriComponent(string value)
    {
        var escaped = Uri.EscapeDataString(value);
        if (escaped.IndexOf('%') < 0) return escaped;
        var sb = new StringBuilder(escaped.Length);
        for (var i = 0; i < escaped.Length; i++)
        {
            if (escaped[i] == '%' && i + 2 < escaped.Length)
            {
                var hex = escaped.Substring(i + 1, 2).ToUpperInvariant();
                var keep = hex switch
                {
                    "21" => '!',
                    "27" => '\'',
                    "28" => '(',
                    "29" => ')',
                    "2A" => '*',
                    _ => '\0',
                };
                if (keep != '\0')
                {
                    sb.Append(keep);
                    i += 2;
                    continue;
                }
            }
            sb.Append(escaped[i]);
        }
        return sb.ToString();
    }

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    /// <summary>
    /// Focus moves are deferred to after render: the field cannot take
    /// focus while the panel still carries <c>hidden</c>, and the trigger
    /// cannot be refocused until the close has been painted.
    /// </summary>
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_focusInputPending)
        {
            _focusInputPending = false;
            await TryFocusAsync(_inputElement);
        }

        if (_focusTriggerPending)
        {
            _focusTriggerPending = false;
            if (_triggerComponent is not null) await TryFocusAsync(_triggerComponent.Element);
        }
    }

    // preventScroll: the panel is positioned by consumer CSS, and focusing
    // a field rendered partly off-screen would otherwise scroll the whole
    // page — the same fix the sibling pickers carry.
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

    // -------------------------------------------------------------------
    // Open / close.
    // -------------------------------------------------------------------

    private void OpenPanel()
    {
        _open = true;
        _focusInputPending = true;
        StateHasChanged();
    }

    private void ClosePanel(bool refocus = true)
    {
        if (!_open) return;
        _open = false;
        _focusInputPending = false;
        if (refocus) _focusTriggerPending = true;
        StateHasChanged();
    }

    // -------------------------------------------------------------------
    // Event handlers.
    // -------------------------------------------------------------------

    private void OnTriggerClick()
    {
        TipOnClick();
        if (_open) ClosePanel();
        else OpenPanel();
    }

    private void OnPanelKeyDown(KeyboardEventArgs args)
    {
        if (args.Key == "Escape") ClosePanel();
    }

    private async Task OnInputAsync(ChangeEventArgs args)
    {
        Value = args.Value?.ToString() ?? "";
        await ValueChanged.InvokeAsync(Value);
    }

    /// <summary>
    /// Focus leaving the root closes the panel — but only when the browser
    /// confirms it left (see <see cref="FocusLeftScript"/>). Blazor's
    /// <see cref="FocusEventArgs"/> has no <c>relatedTarget</c>, so the
    /// component asks the browser instead. Anything short of a confirmed
    /// departure — including an interop failure — leaves the panel open:
    /// closing on an unconfirmed blur hid the panel under Safari's
    /// click-without-focus, so the icon button re-opened instead of closing.
    /// </summary>
    private async Task OnRootFocusOutAsync()
    {
        if (!_open) return;
        bool left;
        try
        {
            left = await JS.InvokeAsync<bool>("eval", FocusLeftScript(PanelId));
        }
        catch
        {
            left = false;
        }
        if (left) ClosePanel(false);
    }

    /// <summary>
    /// The submission. The native GET is cancelled in markup
    /// (<c>@onsubmit:preventDefault</c>); here the query is trimmed and,
    /// when non-empty, <c>OnSearch</c> fires, the panel closes, and the
    /// navigation runs.
    /// </summary>
    private async Task OnSubmitAsync()
    {
        var query = (Value ?? "").Trim();
        if (query.Length == 0) return;
        var href = SearchHref(query, Action);
        await OnSearch.InvokeAsync(new SearchEventArgs { Query = query, Href = href });
        ClosePanel(false);
        if (Navigate is not null) Navigate(href);
        else Navigation.NavigateTo(href, forceLoad: true);
    }

    // -------------------------------------------------------------------
    // Interop script. Exposed to the test project for direct assertion.
    // -------------------------------------------------------------------

    /// <summary>How long the focus-left script waits for the click that
    /// caused a focus-to-nowhere blur before giving up (and keeping the
    /// panel open).</summary>
    internal const int ClickWaitMilliseconds = 5000;

    /// <summary>
    /// Resolves whether focus has really left the root — the C# side of the
    /// canonical rule "close only when focus moves to a known element
    /// outside; a focusout with no <c>relatedTarget</c> never closes, and
    /// clicking outside is handled separately". After a <c>setTimeout(0)</c>
    /// (during <c>focusout</c> the active element is not yet settled):
    /// <list type="bullet">
    /// <item>Active element is a real element: <c>true</c> exactly when it
    /// is outside the root (canonical §7.18).</item>
    /// <item>Active element is <c>&lt;body&gt;</c> / none — Safari's click on
    /// a button, or a click on a non-focusable area: not a departure by
    /// itself (canonical §7.24). The script waits for the click that caused
    /// it and resolves <c>true</c> only if that click landed outside the
    /// root (canonical §7.17, the document click listener's job in Svelte).
    /// A click on the icon button is inside, so the trigger's own click
    /// handler toggles the panel closed. No click within
    /// <see cref="ClickWaitMilliseconds"/> resolves <c>false</c>.</item>
    /// </list>
    /// </summary>
    internal static string FocusLeftScript(string panelId)
        => "new Promise(function(r){setTimeout(function(){try{"
            + $"var p=document.getElementById({JsonString(panelId)});"
            + "var root=p&&p.parentElement;"
            + "if(!root){r(false);return;}"
            + "var a=document.activeElement;"
            + "if(a&&a!==document.body&&a!==document.documentElement){r(!root.contains(a));return;}"
            + "var done=false;"
            + "function finish(v){if(done)return;done=true;document.removeEventListener('click',h,true);r(v);}"
            + "function h(e){finish(!!(e.target&&!root.contains(e.target)));}"
            + "document.addEventListener('click',h,true);"
            + $"setTimeout(function(){{finish(false);}},{ClickWaitMilliseconds});"
            + "}catch(e){r(false);}},0);})";

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
