using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// A native <c>details</c> element with <c>@bind-Open</c>. The browser opens it, with the keys and find-in-page;
/// Details.razor.js reads the element's state on its toggle event, because the event alone says nothing about which way
/// it went, and flipping <see cref="Open"/> would undo a change that came from C#.
/// </summary>
public abstract class DetailsBase : ComponentBase, IAsyncDisposable
{
    /// <summary>Module path, relative to the app base (static web asset of this library).</summary>
    public const string ModulePath = "./_content/LilyDesignSystem.Blazor.Headless/Components/Details.razor.js";

    [Inject] private IJSRuntime JS { get; set; } = default!;

    [Parameter] public bool Open { get; set; }
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }

    /// <summary>The details element.</summary>
    protected ElementReference Root;

    private ElementModule? _module;
    private DotNetObjectReference<DetailsBase>? _self;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        _self = DotNetObjectReference.Create(this);
        _module = await ElementModule.AttachAsync(JS, ModulePath, Root, _self, Open);
    }

    /// <summary>Called from JS: the element opened or closed.</summary>
    [JSInvokable]
    public async Task OnDetailsToggle(bool open)
    {
        if (Open == open) return;
        Open = open;
        await OpenChanged.InvokeAsync(open);
        StateHasChanged();
    }

    public async ValueTask DisposeAsync()
    {
        if (_module is not null) await _module.DisposeAsync();
        _self?.Dispose();
        GC.SuppressFinalize(this);
    }
}
