using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// An element rendered with <c>popover="manual"</c> and shown from a parameter, through Popover.razor.js. A manual popover
/// has no light dismiss or Escape, so only that parameter opens or closes it.
/// </summary>
public abstract class ManualPopoverBase : ComponentBase, IAsyncDisposable
{
    [Inject] private IJSRuntime JS { get; set; } = default!;

    /// <summary>The popover element.</summary>
    protected ElementReference Root;

    /// <summary>Whether it is showing.</summary>
    protected abstract bool Shown { get; }

    private ElementModule? _module;
    private DotNetObjectReference<ManualPopoverBase>? _self;
    private bool _synced;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            _self = DotNetObjectReference.Create(this);
            _module = await ElementModule.AttachAsync(JS, Popover.ModulePath, Root, _self, Shown, null);
            _synced = Shown;
        }
        else if (_module is not null && _synced != Shown)
        {
            _synced = Shown;
            await _module.SetAsync(Shown);
        }
    }

    /// <summary>Called from the element's toggle event, which here only echoes the parameter.</summary>
    [JSInvokable]
    public Task OnPopoverToggle(bool open) => Task.CompletedTask;

    public async ValueTask DisposeAsync()
    {
        if (_module is not null) await _module.DisposeAsync();
        _self?.Dispose();
        GC.SuppressFinalize(this);
    }
}
