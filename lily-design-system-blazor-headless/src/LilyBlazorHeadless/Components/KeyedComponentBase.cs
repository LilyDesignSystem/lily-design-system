using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// The plumbing for a component whose keys live in <c>ActionBar.razor.js</c>, generated from shared/widget-keys.ts: C#
/// cannot read or move focus, and the children are the consumer's. A derived component names its <see cref="Kind"/> and
/// renders <see cref="Root"/>. The module loads after the first interactive render, so prerendered markup is unaffected.
/// </summary>
public abstract class KeyedComponentBase : ComponentBase, IAsyncDisposable
{
    /// <summary>Module path, relative to the app base (static web asset of this library).</summary>
    public const string ModulePath = "./_content/LilyDesignSystem.Blazor.Headless/Components/ActionBar.razor.js";

    [Inject] private IJSRuntime JS { get; set; } = default!;

    /// <summary>The element the keys attach to.</summary>
    protected ElementReference Root;

    private IJSObjectReference? _module;
    private IJSObjectReference? _handle;
    private DotNetObjectReference<KeyedComponentBase>? _self;

    /// <summary>Which attach function in the module.</summary>
    protected abstract string Kind { get; }

    /// <summary>Options for the attach function.</summary>
    protected virtual object? KeyOptions => null;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        _module = await JS.InvokeAsync<IJSObjectReference>("import", ModulePath);
        _self = DotNetObjectReference.Create(this);
        _handle = await _module.InvokeAsync<IJSObjectReference>("attach", Kind, Root, KeyOptions, _self);
    }

    /// <summary>The keys changed a value; a derived component that holds one overrides this.</summary>
    [JSInvokable]
    public virtual Task OnKeyedChange(double value) => Task.CompletedTask;

    /// <summary>The keys opened or closed a popup.</summary>
    [JSInvokable]
    public virtual Task OnKeyedOpen(bool open) => Task.CompletedTask;

    /// <summary>The keys chose an item: its value, its path, and every selected value.</summary>
    [JSInvokable]
    public virtual Task OnKeyedSelect(string value, string[] path, string[] selected) => Task.CompletedTask;

    public async ValueTask DisposeAsync()
    {
        try
        {
            if (_handle is not null)
            {
                await _handle.InvokeVoidAsync("dispose");
                await _handle.DisposeAsync();
            }
            if (_module is not null) await _module.DisposeAsync();
        }
        catch (JSDisconnectedException) { }
        _self?.Dispose();
        GC.SuppressFinalize(this);
    }
}

/// <summary>A choice in a Cascader or TreeSelect.</summary>
public sealed record TreeSelection(string Value, string[] Path, string[] Selected);
