using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// A keyed component whose panel is <c>popover="manual"</c> and shown from a parameter, through Popover.razor.js, as
/// <see cref="ManualPopoverBase"/> does for a component with no keys. Where the Popover API is missing the module
/// falls back to <c>hidden</c>. A manual popover has no light dismiss or Escape, so the parameter and the keys open it.
/// </summary>
public abstract class KeyedPopoverBase : KeyedComponentBase
{
    [Inject] private IJSRuntime PopoverJS { get; set; } = default!;

    /// <summary>The popover element.</summary>
    protected ElementReference Panel;

    /// <summary>Whether the panel is showing.</summary>
    protected abstract bool Shown { get; }

    private ElementModule? _popover;
    private DotNetObjectReference<KeyedPopoverBase>? _popoverSelf;
    private bool _synced;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);
        if (firstRender)
        {
            _popoverSelf = DotNetObjectReference.Create(this);
            _popover = await ElementModule.AttachAsync(PopoverJS, Popover.ModulePath, Panel, _popoverSelf, Shown, null);
            _synced = Shown;
        }
        else if (_popover is not null && _synced != Shown)
        {
            _synced = Shown;
            await _popover.SetAsync(Shown);
        }
    }

    /// <summary>Called from the element's toggle event, which here only echoes the parameter.</summary>
    [JSInvokable]
    public Task OnPopoverToggle(bool open) => Task.CompletedTask;

    public override async ValueTask DisposeAsync()
    {
        if (_popover is not null) await _popover.DisposeAsync();
        _popoverSelf?.Dispose();
        await base.DisposeAsync();
    }
}
