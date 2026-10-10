// LinkPicker — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// One destination in the list. The app defines them all: this package ships no routes and no
/// English — <see cref="Label"/> is the consumer's text.
/// </summary>
public sealed class LinkItem
{
    /// <summary>Stable identifier, passed back to <c>OnNavigate</c>. Defaults to <see cref="Href"/>.</summary>
    public string? Id { get; init; }

    /// <summary>Visible link text. Consumer-supplied, so it localises.</summary>
    public required string Label { get; init; }

    /// <summary>Where the link goes: a route (<c>"/about/"</c>) or a full URL.</summary>
    public required string Href { get; init; }

    /// <summary>Marks this link as the current page (<c>aria-current="page"</c>).</summary>
    public bool Current { get; init; }

    /// <summary>Open in a new tab (<c>target="_blank"</c> with <c>rel="noopener noreferrer"</c>).</summary>
    public bool NewTab { get; init; }
}

/// <summary>Payload for the <c>OnNavigate</c> callback.</summary>
public sealed class LinkNavigateEventArgs
{
    /// <summary>The chosen link's id (its <see cref="LinkItem.Href"/> when it has none).</summary>
    public required string Id { get; init; }

    /// <summary>The chosen link's <see cref="LinkItem.Href"/>.</summary>
    public required string Href { get; init; }
}

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment. The fragment replaces the
/// default icon inside the button; it does not render list items.
/// </summary>
public sealed class LinkPickerContext
{
    /// <summary>Is the list open?</summary>
    public required bool Open { get; init; }
}

public partial class LinkPicker : ComponentBase
{
    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the button and the list. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>The page links to offer. Defined by the app. Required.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<LinkItem> Links { get; set; } = Array.Empty<LinkItem>();

    /// <summary>Replaces the default home icon inside the button.</summary>
    [Parameter] public RenderFragment<LinkPickerContext>? ChildContent { get; set; }

    /// <summary>Fires after a link is chosen, with its id and href.</summary>
    [Parameter] public EventCallback<LinkNavigateEventArgs> OnNavigate { get; set; }

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    // -------------------------------------------------------------------
    // Instance state.
    // -------------------------------------------------------------------

    private readonly string _baseId = NextLinkPickerId();

    private bool _open;

    private IconButton? _triggerComponent;
    private ElementReference _listElement;

    /// <summary>Element references for the focusable links, keyed by index.</summary>
    private readonly Dictionary<int, ElementReference> _itemElements = new();

    /// <summary>The link the component believes has focus.</summary>
    private int _focusIndex = -1;

    private int? _focusItemPending;
    private bool _focusTriggerPending;

    /// <summary>Set while the component itself is moving focus, so the root's focusout handler
    /// does not read the move as "focus left the control".</summary>
    private bool _suppressFocusOut;

    /// <summary>Set when a keydown already handled activation, so a click synthesised on top of it
    /// does not toggle the list a second time. Cleared whenever the trigger regains focus.</summary>
    private bool _suppressNextClick;

    // -------------------------------------------------------------------
    // Ids and view helpers used by the .razor markup.
    // -------------------------------------------------------------------

    private string ListId => $"{_baseId}-list";

    private string RootClass => $"link-picker {CssClass}".Trim();

    private int ItemCount => Links.Count;

    private LinkPickerContext BuildContext() => new() { Open = _open };

    /// <summary>The id a link reports: its explicit <c>Id</c>, else its <c>Href</c>.</summary>
    public static string LinkId(LinkItem link) => link.Id ?? link.Href;

    /// <summary>Mint a stable per-instance id prefix; SSR-safe.</summary>
    public static string NextLinkPickerId()
        => $"link-picker-{Interlocked.Increment(ref _uid)}";

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    /// <summary>Focus moves are deferred to after render: a link cannot take focus while the list
    /// still carries <c>hidden</c>, and the trigger cannot be refocused until the close is painted.</summary>
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_focusItemPending is int index)
        {
            _focusItemPending = null;
            if (_itemElements.TryGetValue(index, out var element)) await TryFocusAsync(element);
        }

        if (_focusTriggerPending)
        {
            _focusTriggerPending = false;
            if (_triggerComponent is not null) await TryFocusAsync(_triggerComponent.Element);
        }
    }

    // preventScroll: the list is positioned by CSS, and an automatic scroll-into-view on focus
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

    /// <summary>Open the list, focusing the first link (or the last).</summary>
    private void OpenList(bool focusLast = false)
    {
        _open = true;
        if (ItemCount > 0) FocusItem(focusLast ? ItemCount - 1 : 0);
        StateHasChanged();
    }

    /// <summary>Close the list, optionally returning focus to the trigger.</summary>
    private void CloseList(bool refocus = true)
    {
        if (!_open) return;
        _open = false;
        _focusIndex = -1;
        _focusItemPending = null;
        if (refocus)
        {
            _focusTriggerPending = true;
            _suppressFocusOut = true;
        }
        StateHasChanged();
    }

    /// <summary>Queue a real focus move onto a link.</summary>
    private void FocusItem(int index)
    {
        if (index < 0 || index >= ItemCount) return;
        _focusIndex = index;
        _focusItemPending = index;
        // The component is moving focus itself; the focusout the browser emits for the move is
        // not a departure.
        _suppressFocusOut = true;
        StateHasChanged();
    }

    /// <summary>Move focus by <paramref name="delta"/>, clamping at the ends (no wrap).</summary>
    private void MoveFocus(int delta)
    {
        var count = ItemCount;
        if (count == 0) return;
        var from = _focusIndex < 0 ? 0 : _focusIndex;
        FocusItem(Math.Min(Math.Max(from + delta, 0), count - 1));
    }

    // -------------------------------------------------------------------
    // Event handlers.
    // -------------------------------------------------------------------

    private Task OnTriggerClickAsync()
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

    private void OnTriggerFocus()
    {
        OnTipButtonFocus();
        // A stale suppression flag must never eat a genuine click.
        _suppressNextClick = false;
    }

    private void OnItemFocus(int index) => _focusIndex = index;

    private Task OnTriggerKeyDownAsync(KeyboardEventArgs args)
    {
        TipOnKeyDown(args);
        // Enter and Space already produce a click; only the arrows need handling here.
        switch (args.Key)
        {
            case "ArrowDown":
                _suppressNextClick = true;
                if (!_open) OpenList(false);
                else FocusItem(0);
                break;
            case "ArrowUp":
                _suppressNextClick = true;
                if (!_open) OpenList(true);
                else FocusItem(ItemCount - 1);
                break;
        }
        return Task.CompletedTask;
    }

    private Task OnListKeyDownAsync(KeyboardEventArgs args)
    {
        switch (args.Key)
        {
            case "ArrowDown":
                MoveFocus(1);
                break;
            case "ArrowUp":
                MoveFocus(-1);
                break;
            case "Home":
                FocusItem(0);
                break;
            case "End":
                FocusItem(ItemCount - 1);
                break;
            case "Escape":
                CloseList();
                break;
            case "Tab":
                // Focus goes to the button FIRST, without cancelling the key: hiding the list
                // while a link has focus drops focus to <body>, and the user's next Tab would
                // restart from the top of the document.
                _focusTriggerPending = true;
                _suppressFocusOut = true;
                CloseList(false);
                break;
        }
        return Task.CompletedTask;
    }

    /// <summary>Focus leaving the root closes the list. Blazor's <see cref="FocusEventArgs"/> does
    /// not expose <c>relatedTarget</c>, so focus moves the component made itself are flagged.</summary>
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

    private async Task ChooseAsync(int index)
    {
        if (index < 0 || index >= Links.Count)
        {
            CloseList();
            return;
        }
        var link = Links[index];
        await OnNavigate.InvokeAsync(new LinkNavigateEventArgs { Id = LinkId(link), Href = link.Href });
        CloseList();
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
