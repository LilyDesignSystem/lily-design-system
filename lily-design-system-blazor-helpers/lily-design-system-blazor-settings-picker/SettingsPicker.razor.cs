// SettingsPicker — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Context passed to the <c>ChildContent</c> (panel) and <c>Icon</c> render fragments.
/// </summary>
public sealed class SettingsPickerContext
{
    /// <summary>Is the panel open?</summary>
    public required bool Open { get; init; }

    /// <summary>Close the panel and return focus to the button.</summary>
    public required Func<Task> Close { get; init; }
}

public partial class SettingsPicker : ComponentBase
{
    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the button, the panel and the tooltip. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Is the panel open? Bind with <c>@bind-Open</c>.</summary>
    [Parameter] public bool Open { get; set; }

    /// <summary>Fires whenever the open state changes.</summary>
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }

    /// <summary>
    /// Close the panel on any click inside it. Default <c>false</c>: Blazor cannot see which element
    /// was clicked, so the content closes the panel itself with <c>context.Close()</c>.
    /// </summary>
    [Parameter] public bool CloseOnSelect { get; set; }

    /// <summary>The panel's content: whatever the app provides.</summary>
    [Parameter] public RenderFragment<SettingsPickerContext>? ChildContent { get; set; }

    /// <summary>Replaces the default cog icon inside the button.</summary>
    [Parameter] public RenderFragment<SettingsPickerContext>? Icon { get; set; }

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    // -------------------------------------------------------------------
    // Instance state.
    // -------------------------------------------------------------------

    private readonly string _baseId = NextSettingsPickerId();

    private IconButton? _triggerComponent;
    private ElementReference _panelElement;

    private bool _focusPanelPending;
    private bool _focusTriggerPending;

    /// <summary>Set when a keydown already handled activation, so a click synthesised on top of it
    /// does not toggle the panel a second time. Cleared whenever the trigger regains focus.</summary>
    private bool _suppressNextClick;

    // -------------------------------------------------------------------
    // Ids and view helpers used by the .razor markup.
    // -------------------------------------------------------------------

    private string PanelId => $"{_baseId}-panel";

    private string RootClass => $"settings-picker {CssClass}".Trim();

    private SettingsPickerContext BuildContext() => new() { Open = Open, Close = () => SetOpenAsync(false, refocus: true) };

    /// <summary>Mint a stable per-instance id prefix; SSR-safe.</summary>
    public static string NextSettingsPickerId()
        => $"settings-picker-{Interlocked.Increment(ref _uid)}";

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    /// <summary>Focus moves are deferred to after render: the panel cannot take focus while it
    /// still carries <c>hidden</c>, and the trigger cannot be refocused until the close is painted.</summary>
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_focusPanelPending)
        {
            _focusPanelPending = false;
            await TryFocusAsync(_panelElement);
        }

        if (_focusTriggerPending)
        {
            _focusTriggerPending = false;
            if (_triggerComponent is not null) await TryFocusAsync(_triggerComponent.Element);
        }
    }

    // preventScroll: the panel is positioned by CSS, and an automatic scroll-into-view on focus
    // would slide the page sideways when the button sits near an edge.
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

    private async Task SetOpenAsync(bool next, bool refocus = false, bool focusPanel = false)
    {
        if (Open == next) return;
        Open = next;
        if (next)
        {
            if (focusPanel) _focusPanelPending = true;
        }
        else
        {
            _focusPanelPending = false;
            if (refocus) _focusTriggerPending = true;
        }
        await OpenChanged.InvokeAsync(next);
        StateHasChanged();
    }

    // -------------------------------------------------------------------
    // Event handlers.
    // -------------------------------------------------------------------

    private async Task OnTriggerClickAsync()
    {
        TipOnClick();
        if (_suppressNextClick)
        {
            _suppressNextClick = false;
            return;
        }
        await SetOpenAsync(!Open, refocus: false);
    }

    private void OnTriggerFocus()
    {
        OnTipButtonFocus();
        // A stale suppression flag must never eat a genuine click.
        _suppressNextClick = false;
    }

    private async Task OnTriggerKeyDownAsync(KeyboardEventArgs args)
    {
        TipOnKeyDown(args);
        if (args.Key == "Escape" && Open)
        {
            await SetOpenAsync(false, refocus: true);
        }
        else if (args.Key is "ArrowDown" or "ArrowUp")
        {
            // Enter and Space already produce a click; the arrows open and move into the panel.
            _suppressNextClick = true;
            if (!Open) await SetOpenAsync(true, focusPanel: true);
            else
            {
                _focusPanelPending = true;
                StateHasChanged();
            }
        }
    }

    private async Task OnPanelKeyDownAsync(KeyboardEventArgs args)
    {
        if (args.Key == "Escape")
        {
            await SetOpenAsync(false, refocus: true);
        }
    }

    private async Task OnPanelClickAsync()
    {
        if (CloseOnSelect) await SetOpenAsync(false, refocus: true);
    }

    // -------------------------------------------------------------------
    // Tooltip — purely visual; the text is the button's Label, so it is NOT linked with
    // aria-describedby. Blazor deviation (as share-picker): no JS interop, so keyboard focus
    // cannot be told apart with matches(':focus-visible'). A mousedown on the button immediately
    // before its focus event marks the focus as pointer-induced (no tooltip); any other focus
    // counts as keyboard. No document-level Escape listener either: Escape with focus outside the
    // root is not handled.
    // -------------------------------------------------------------------

    private bool _tipHoverButton;
    private bool _tipHoverTooltip;
    private bool _tipFocusButton;
    private bool _tipDismissed;
    private bool _tipPointerDown;

    private string TooltipId => $"{_baseId}-tooltip";

    private bool TooltipVisible
        => !Open && !_tipDismissed && (_tipHoverButton || _tipHoverTooltip || _tipFocusButton);

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

    /// <summary>Escape pressed anywhere inside the root dismisses a visible tooltip. Never moves
    /// focus, never prevents default.</summary>
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
