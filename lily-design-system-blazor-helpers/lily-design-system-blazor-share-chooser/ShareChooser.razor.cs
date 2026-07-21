// ShareChooser — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// One destination in the share list.
/// </summary>
/// <remarks>
/// <see cref="Href"/> is a function, not a template string, so the consumer
/// owns the whole URL: this package ships no third-party endpoints and takes
/// no view on which networks exist. See <c>spec/index.md §3</c>.
/// </remarks>
public sealed class ShareTarget
{
    /// <summary>Stable identifier, passed back to <c>OnShare</c>.</summary>
    public required string Id { get; init; }

    /// <summary>Visible link text. Consumer-supplied, so it localises.</summary>
    public required string Label { get; init; }

    /// <summary>
    /// Build the destination URL from the shared page's metadata:
    /// <c>(url, title, text) =&gt; href</c>.
    /// </summary>
    public required Func<string, string, string, string> Href { get; init; }

    /// <summary>
    /// Open in a new browsing context. Defaults to <c>true</c>, which renders
    /// <c>target="_blank"</c>.
    /// </summary>
    public bool NewTab { get; init; } = true;
}

/// <summary>How the button behaves when activated.</summary>
public enum ShareStrategy
{
    /// <summary>Use the native sheet when the browser has one, else the list.</summary>
    Auto,

    /// <summary>Always attempt the native sheet; fall back to the list only
    /// when the browser has no sheet at all.</summary>
    Native,

    /// <summary>Never attempt the native sheet.</summary>
    List,
}

/// <summary>The outcome of an attempt to use the native share sheet.</summary>
public enum NativeShareOutcome
{
    /// <summary>The browser has no <c>navigator.share</c>, or JS interop is
    /// unavailable. The caller should fall back to the list.</summary>
    Unsupported,

    /// <summary>The sheet opened and the user completed the share.</summary>
    Shared,

    /// <summary>The sheet opened and the user dismissed it. This is not a
    /// failure, and it ends the interaction.</summary>
    Dismissed,
}

/// <summary>Payload for the <c>OnShare</c> callback.</summary>
public sealed class ShareEventArgs
{
    /// <summary>The <see cref="ShareTarget.Id"/> the user chose.</summary>
    public required string TargetId { get; init; }

    /// <summary>The URL that was shared.</summary>
    public required string Url { get; init; }
}

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment. The
/// fragment replaces the default glyph inside the button; it does not render
/// list items. See <c>spec/index.md §4.1</c>.
/// </summary>
public sealed class ShareChooserContext
{
    /// <summary>Is the list open?</summary>
    public required bool Open { get; init; }

    /// <summary>The URL that would be shared right now.</summary>
    public required string Url { get; init; }
}

public partial class ShareChooser : ComponentBase
{
    /// <summary>Default button glyph: U+27A4 BLACK RIGHTWARDS ARROWHEAD.</summary>
    /// <remarks>
    /// An in-font arrow rather than a pictograph, matching the other helpers'
    /// rule: it renders in the page's own font on every platform and stays
    /// monochrome alongside ThemeChooser's ◑, LocaleChooser's 🌐 and
    /// TextSizeChooser's "A".
    /// </remarks>
    public const string BlackRightwardsArrowhead = "➤";

    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the button. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Destinations to offer. Empty is valid when
    /// <see cref="CopyLabel"/> is supplied.</summary>
    [Parameter] public IReadOnlyList<ShareTarget> Targets { get; set; } = Array.Empty<ShareTarget>();

    /// <summary>URL to share. Defaults to the current page URL, read lazily
    /// from <see cref="NavigationManager"/> so prerendering is safe.</summary>
    [Parameter] public string? Url { get; set; }

    /// <summary>Title passed to <c>Href(...)</c> and to the native sheet.</summary>
    [Parameter] public string Title { get; set; } = "";

    /// <summary>Longer text passed to <c>Href(...)</c> and to the native sheet.</summary>
    [Parameter] public string Text { get; set; } = "";

    /// <summary>
    /// Label for the built-in copy-to-clipboard item. The item renders only
    /// when this is supplied — there is no default, because a default would
    /// be a hardcoded English string.
    /// </summary>
    [Parameter] public string? CopyLabel { get; set; }

    /// <summary>Announced in the status region after a successful copy.</summary>
    [Parameter] public string? CopiedLabel { get; set; }

    /// <summary>Announced in the status region when the clipboard write fails.</summary>
    [Parameter] public string? CopyFailedLabel { get; set; }

    /// <summary>Whether to prefer the native share sheet.</summary>
    [Parameter] public ShareStrategy Strategy { get; set; } = ShareStrategy.Auto;

    /// <summary>Replaces the default ➤ glyph inside the button.</summary>
    [Parameter] public RenderFragment<ShareChooserContext>? ChildContent { get; set; }

    /// <summary>Fires after a destination is chosen.</summary>
    [Parameter] public EventCallback<ShareEventArgs> OnShare { get; set; }

    /// <summary>Fires after the URL is copied, with the copied URL.</summary>
    [Parameter] public EventCallback<string> OnCopy { get; set; }

    /// <summary>Fires when the native sheet was used instead of the list.</summary>
    [Parameter] public EventCallback<string> OnNativeShare { get; set; }

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

    private readonly string _baseId = NextShareChooserId();

    private bool _open;
    private string _status = "";

    private ElementReference _triggerElement;
    private ElementReference _listElement;

    /// <summary>Element references for the focusable list items, keyed by
    /// index: destinations first, then the optional copy button.</summary>
    private readonly Dictionary<int, ElementReference> _itemElements = new();

    /// <summary>The item the component believes has focus. Kept in step with
    /// reality by each item's <c>onfocus</c>, so pointer focus and keyboard
    /// focus agree.</summary>
    private int _focusIndex = -1;

    private int? _focusItemPending;
    private bool _focusTriggerPending;

    /// <summary>Set while the component itself is moving focus, so the root's
    /// focusout handler does not read the move as "focus left the control".</summary>
    private bool _suppressFocusOut;

    /// <summary>Set when a keydown already handled activation, so a click
    /// synthesised on top of it does not toggle the list a second time. It is
    /// cleared whenever the trigger regains focus, so it can never swallow a
    /// genuine later click.</summary>
    private bool _suppressNextClick;

    // -------------------------------------------------------------------
    // Ids and view helpers used by the .razor markup.
    // -------------------------------------------------------------------

    private string ListId => $"{_baseId}-list";

    private string RootClass => $"share-chooser {CssClass}".Trim();

    private bool HasCopy => !string.IsNullOrEmpty(CopyLabel);

    /// <summary>Focusable items in the list: destinations, then copy.</summary>
    private int ItemCount => Targets.Count + (HasCopy ? 1 : 0);

    private ShareChooserContext BuildContext() => new()
    {
        Open = _open,
        Url = CurrentUrl(),
    };

    // -------------------------------------------------------------------
    // Helpers — exposed for tests and consumers.
    // -------------------------------------------------------------------

    /// <summary>Mint a stable per-instance id prefix; SSR-safe.</summary>
    public static string NextShareChooserId()
        => $"share-chooser-{Interlocked.Increment(ref _uid)}";

    /// <summary>
    /// Is a native share sheet available? Asynchronous because the browser is
    /// only reachable over JS interop; returns <c>false</c> during prerender.
    /// </summary>
    public static async Task<bool> CanShareNativelyAsync(IJSRuntime js)
    {
        try
        {
            return await js.InvokeAsync<bool>("eval", CanShareScript);
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Is an async clipboard available? Asynchronous for the same reason as
    /// <see cref="CanShareNativelyAsync"/>; returns <c>false</c> during prerender.
    /// </summary>
    public static async Task<bool> CanCopyAsync(IJSRuntime js)
    {
        try
        {
            return await js.InvokeAsync<bool>("eval", CanCopyScript);
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// The URL to share. Resolved lazily so the default works without the
    /// consumer threading the location through, and so nothing reads the
    /// browser during prerender — <see cref="NavigationManager.Uri"/> is
    /// server-known.
    /// </summary>
    private string CurrentUrl()
    {
        if (!string.IsNullOrEmpty(Url)) return Url!;
        try
        {
            return Navigation.Uri;
        }
        catch
        {
            return "";
        }
    }

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    /// <summary>
    /// Focus moves are deferred to after render: an item cannot take focus
    /// while the list still carries <c>hidden</c>, and the trigger cannot be
    /// refocused until the close has been painted.
    /// </summary>
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_focusItemPending is int index)
        {
            _focusItemPending = null;
            if (_itemElements.TryGetValue(index, out var element))
            {
                await TryFocusAsync(element);
            }
        }

        if (_focusTriggerPending)
        {
            _focusTriggerPending = false;
            await TryFocusAsync(_triggerElement);
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
            // ignore prerender / interop failure
        }
    }

    // -------------------------------------------------------------------
    // Open / close.
    // -------------------------------------------------------------------

    /// <summary>Open the list, focusing the first item (or the last).</summary>
    private void OpenList(bool focusLast = false)
    {
        _open = true;
        // The status region is per-interaction: a stale "Link copied" must not
        // still be sitting there when the list reopens.
        _status = "";
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

    /// <summary>Queue a real focus move onto an item.</summary>
    private void FocusItem(int index)
    {
        if (index < 0 || index >= ItemCount) return;
        _focusIndex = index;
        _focusItemPending = index;
        // The component is moving focus itself; the focusout that the browser
        // emits for the move is not a departure.
        _suppressFocusOut = true;
        StateHasChanged();
    }

    /// <summary>Move focus by <paramref name="delta"/>, clamping at the ends.
    /// The disclosure pattern does not wrap.</summary>
    private void MoveFocus(int delta)
    {
        var count = ItemCount;
        if (count == 0) return;
        var from = _focusIndex < 0 ? 0 : _focusIndex;
        var next = Math.Min(Math.Max(from + delta, 0), count - 1);
        FocusItem(next);
    }

    // -------------------------------------------------------------------
    // Event handlers.
    // -------------------------------------------------------------------

    private async Task OnTriggerClickAsync()
    {
        if (_suppressNextClick)
        {
            _suppressNextClick = false;
            return;
        }
        if (_open)
        {
            CloseList();
            return;
        }
        await ActivateAsync();
    }

    private void OnTriggerFocus()
    {
        // A stale suppression flag must never eat a genuine click.
        _suppressNextClick = false;
    }

    private void OnItemFocus(int index) => _focusIndex = index;

    private async Task OnTriggerKeyDownAsync(KeyboardEventArgs args)
    {
        // Enter and Space are the button's own activation keys and already
        // produce a click; only the arrows need handling here.
        switch (args.Key)
        {
            case "ArrowDown":
                _suppressNextClick = true;
                if (!_open) await ActivateFromKeyboardAsync(false);
                else FocusItem(0);
                break;
            case "ArrowUp":
                _suppressNextClick = true;
                if (!_open) await ActivateFromKeyboardAsync(true);
                else FocusItem(ItemCount - 1);
                break;
        }
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
                // Tab leaves the control: close, but let focus go where the
                // browser was already sending it.
                CloseList(false);
                break;
        }
        return Task.CompletedTask;
    }

    /// <summary>
    /// Focus leaving the root closes the list. Blazor's
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
    // Activation.
    // -------------------------------------------------------------------

    /// <summary>
    /// Open the native sheet if the strategy allows and the browser has one,
    /// otherwise open the list. Public so consumers can drive the control from
    /// their own UI.
    /// </summary>
    public async Task ActivateAsync()
    {
        if (Strategy != ShareStrategy.List)
        {
            var outcome = await ShareNativelyAsync();
            // Shared and Dismissed both END the interaction. Falling through
            // to the list on a dismissal would resurrect UI the user just
            // dismissed — which is why the script distinguishes a rejected
            // share from an absent one.
            if (outcome is NativeShareOutcome.Shared or NativeShareOutcome.Dismissed) return;
        }
        OpenList();
    }

    private async Task ActivateFromKeyboardAsync(bool focusLast)
    {
        if (Strategy != ShareStrategy.List)
        {
            var outcome = await ShareNativelyAsync();
            if (outcome is NativeShareOutcome.Shared or NativeShareOutcome.Dismissed) return;
        }
        OpenList(focusLast);
    }

    /// <summary>
    /// Attempt the native share sheet, awaiting the user's interaction with it.
    /// </summary>
    /// <remarks>
    /// The three outcomes must stay distinct. A single try/catch around the
    /// interop call would conflate "this browser has no share sheet" (fall
    /// back to the list) with "the user dismissed the sheet" (stop), so the
    /// script resolves to a sentinel instead of rejecting.
    /// </remarks>
    public async Task<NativeShareOutcome> ShareNativelyAsync()
    {
        var url = CurrentUrl();
        string? outcome;
        try
        {
            outcome = await JS.InvokeAsync<string?>("eval", BuildNativeShareScript(url, Title, Text));
        }
        catch
        {
            // Interop itself failed: prerender, or JS disabled. Treated as an
            // absent sheet so the list still works.
            return NativeShareOutcome.Unsupported;
        }

        switch (outcome)
        {
            case SharedSentinel:
                await OnNativeShare.InvokeAsync(url);
                return NativeShareOutcome.Shared;
            case DismissedSentinel:
                return NativeShareOutcome.Dismissed;
            default:
                return NativeShareOutcome.Unsupported;
        }
    }

    private async Task ChooseAsync(int index)
    {
        if (index < 0 || index >= Targets.Count)
        {
            CloseList();
            return;
        }
        var target = Targets[index];
        await OnShare.InvokeAsync(new ShareEventArgs { TargetId = target.Id, Url = CurrentUrl() });
        CloseList();
    }

    /// <summary>
    /// Copy the URL. A failure — including a browser with no clipboard API at
    /// all — announces <see cref="CopyFailedLabel"/> and never throws.
    /// </summary>
    public async Task CopyAsync()
    {
        var url = CurrentUrl();
        bool copied;
        try
        {
            copied = await JS.InvokeAsync<bool>("eval", BuildCopyScript(url));
        }
        catch
        {
            copied = false;
        }

        if (copied)
        {
            await OnCopy.InvokeAsync(url);
            if (!string.IsNullOrEmpty(CopiedLabel)) _status = CopiedLabel!;
        }
        else if (!string.IsNullOrEmpty(CopyFailedLabel))
        {
            _status = CopyFailedLabel!;
        }

        CloseList();
    }

    // -------------------------------------------------------------------
    // Interop scripts. Exposed to the test project for direct assertion.
    // -------------------------------------------------------------------

    internal const string SharedSentinel = "shared";
    internal const string DismissedSentinel = "dismissed";
    internal const string UnsupportedSentinel = "unsupported";

    internal const string CanShareScript =
        "(function(){try{return typeof navigator!=='undefined'"
        + "&&typeof navigator.share==='function';}catch(e){return false;}})()";

    internal const string CanCopyScript =
        "(function(){try{return typeof navigator!=='undefined'&&!!navigator.clipboard"
        + "&&typeof navigator.clipboard.writeText==='function';}catch(e){return false;}})()";

    /// <summary>
    /// Build the JS snippet that opens the native sheet. It resolves — never
    /// rejects — to one of three sentinels, so the .NET side can tell an
    /// absent sheet from a dismissed one.
    /// </summary>
    internal static string BuildNativeShareScript(string url, string title, string text)
        => "(function(){"
            + "try{"
            + "if(typeof navigator==='undefined'||typeof navigator.share!=='function')"
            + $"return {JsonString(UnsupportedSentinel)};"
            + $"return navigator.share({{url:{JsonString(url)},title:{JsonString(title)},text:{JsonString(text)}}})"
            + $".then(function(){{return {JsonString(SharedSentinel)};}})"
            // A rejection here is almost always the user dismissing the sheet,
            // which is not an error and must not fall through to the list.
            + $".catch(function(){{return {JsonString(DismissedSentinel)};}});"
            + $"}}catch(e){{return {JsonString(UnsupportedSentinel)};}}"
            + "})()";

    /// <summary>
    /// Build the JS snippet that writes the URL to the clipboard. Resolves to
    /// <c>true</c> or <c>false</c>; an absent clipboard is <c>false</c>, not a
    /// throw.
    /// </summary>
    internal static string BuildCopyScript(string url)
        => "(function(){"
            + "try{"
            + "if(typeof navigator==='undefined'||!navigator.clipboard"
            + "||typeof navigator.clipboard.writeText!=='function')return false;"
            + $"return navigator.clipboard.writeText({JsonString(url)})"
            + ".then(function(){return true;})"
            + ".catch(function(){return false;});"
            + "}catch(e){return false;}"
            + "})()";

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
