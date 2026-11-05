using Microsoft.JSInterop;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// One attached element of a small ES module: the module's <c>attach</c> returns a handle with <c>dispose</c>, and
/// sometimes <c>set</c>. Call it after the first render, so prerendered markup is unaffected.
/// </summary>
internal sealed class ElementModule : IAsyncDisposable
{
    private readonly IJSObjectReference _module;
    private readonly IJSObjectReference _handle;

    private ElementModule(IJSObjectReference module, IJSObjectReference handle)
    {
        _module = module;
        _handle = handle;
    }

    public static async Task<ElementModule> AttachAsync(IJSRuntime js, string path, params object?[] args)
    {
        var module = await js.InvokeAsync<IJSObjectReference>("import", path);
        return new ElementModule(module, await module.InvokeAsync<IJSObjectReference>("attach", args));
    }

    public ValueTask SetAsync(params object?[] args) => _handle.InvokeVoidAsync("set", args);

    public async ValueTask DisposeAsync()
    {
        try
        {
            await _handle.InvokeVoidAsync("dispose");
            await _handle.DisposeAsync();
            await _module.DisposeAsync();
        }
        catch (JSDisconnectedException) { }
    }
}
