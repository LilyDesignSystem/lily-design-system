using System.ComponentModel;
using Microsoft.AspNetCore.Components;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// Renders <see cref="Content"/> only when <see cref="Version"/> changes (and on its first render). A counter puts its
/// status text in one, so the parent can re-render the visible count on every keystroke while the status, a live region,
/// takes the text only once typing pauses (spec/detent-lessons, P26-T9). Public only because Razor finds public components;
/// it is infrastructure for the counters, not part of the catalog.
/// </summary>
[EditorBrowsable(EditorBrowsableState.Never)]
public sealed class DelayedContent : ComponentBase
{
    [Parameter] public RenderFragment? Content { get; set; }
    [Parameter] public int Version { get; set; }

    private int _rendered = -1;

    protected override bool ShouldRender() => Version != _rendered;

    protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder builder)
    {
        _rendered = Version;
        builder.AddContent(0, Content);
    }
}

/// <summary>Waits for a pause: each <see cref="Restart"/> cancels the last wait, so only the last change runs its action.</summary>
internal sealed class Debounce : IDisposable
{
    private CancellationTokenSource? _cts;

    public void Restart(int delayMs, Func<Task> action)
    {
        _cts?.Cancel();
        _cts?.Dispose();
        var cts = _cts = new CancellationTokenSource();
        _ = Task.Delay(Math.Max(0, delayMs), cts.Token).ContinueWith(
            async t => { if (!t.IsCanceled) await action(); },
            TaskScheduler.Default);
    }

    public void Dispose()
    {
        _cts?.Cancel();
        _cts?.Dispose();
    }
}
