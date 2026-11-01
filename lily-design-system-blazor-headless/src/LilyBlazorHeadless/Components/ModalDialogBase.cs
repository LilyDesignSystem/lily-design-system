using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// The real-modal plumbing shared by Dialog, AlertDialog, FileDialog and TimeoutDialog (tasks.md P14-T4). While
/// <see cref="Open"/> is true and the derived component has rendered its <c>&lt;dialog&gt;</c> into
/// <see cref="DialogElement"/>, it is opened through <c>Drawer.razor.js</c>: with <c>showModal()</c> when
/// <see cref="IsModal"/> (top layer, inert page behind, Tab trapped, Escape firing <c>cancel</c>), else with the
/// <c>open</c> attribute. Focus moves inside, and returns to the opener when it closes. The module is loaded after
/// the first interactive render, so prerendered and static SSR markup stays closed.
/// </summary>
public abstract class ModalDialogBase : ComponentBase, IAsyncDisposable
{
    [Inject] private IJSRuntime JS { get; set; } = default!;

    /// <summary>Whether the dialog is shown.</summary>
    [Parameter] public bool Open { get; set; }

    /// <summary>Raised when the dialog closes itself (Escape, the native cancel or close event).</summary>
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }

    /// <summary>The rendered <c>&lt;dialog&gt;</c>, captured with <c>@ref</c>.</summary>
    protected ElementReference DialogElement;

    /// <summary>Whether to open with <c>showModal()</c>. Default true.</summary>
    protected virtual bool IsModal => true;

    private IJSObjectReference? _module;
    private IJSObjectReference? _handle;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (Open && _handle is null)
        {
            _module ??= await JS.InvokeAsync<IJSObjectReference>("import", Drawer.ModulePath);
            _handle = await _module.InvokeAsync<IJSObjectReference>("open", DialogElement, IsModal);
        }
        else if (!Open && _handle is not null)
        {
            await ReleaseAsync();
        }
    }

    /// <summary>Close from inside (Escape, cancel, close): set <see cref="Open"/> false and report it.</summary>
    protected async Task CloseAsync()
    {
        if (!Open) return;
        Open = false;
        await OpenChanged.InvokeAsync(false);
    }

    private async Task ReleaseAsync()
    {
        var handle = _handle;
        _handle = null;
        if (handle is null) return;
        await handle.InvokeVoidAsync("close");
        await handle.DisposeAsync();
    }

    public async ValueTask DisposeAsync()
    {
        try
        {
            await ReleaseAsync();
            if (_module is not null) await _module.DisposeAsync();
        }
        catch (JSDisconnectedException) { }
        GC.SuppressFinalize(this);
    }
}
