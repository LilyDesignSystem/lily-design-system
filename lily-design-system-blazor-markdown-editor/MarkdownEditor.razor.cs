using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>Code-behind for <c>MarkdownEditor.razor</c>. Contract: <c>spec/index.md</c>.</summary>
public partial class MarkdownEditor : ComponentBase
{
    private static int _counter;
    private readonly string _generatedId;
    private int _active;
    private ElementReference[] _buttons = Array.Empty<ElementReference>();

    public MarkdownEditor()
    {
        _generatedId = $"markdown-editor-{Interlocked.Increment(ref _counter)}";
    }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    /// <summary>The text, as Markdown. Two-way: <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Accessible name of the textarea. Required: there is no default English.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Accessible name of the toolbar. Required.</summary>
    [Parameter, EditorRequired] public string ToolbarLabel { get; set; } = "";

    /// <summary>The accessible name of each tool, keyed by tool id; a tool with no name is not rendered.</summary>
    [Parameter, EditorRequired] public IReadOnlyDictionary<string, string> Labels { get; set; } = new Dictionary<string, string>();

    /// <summary>Which tools to show, in order. Default: all nine.</summary>
    [Parameter] public IReadOnlyList<string>? Tools { get; set; }

    /// <summary>Hash count for the heading tool (1 to 6). Default 2.</summary>
    [Parameter] public int HeadingLevel { get; set; } = 2;

    [Parameter] public string? Name { get; set; }
    [Parameter] public string? Id { get; set; }
    [Parameter] public int? Rows { get; set; }
    [Parameter] public string? Placeholder { get; set; }
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public bool ReadOnly { get; set; }
    [Parameter] public bool Required { get; set; }

    /// <summary>Replaces a tool's icon; receives the tool id.</summary>
    [Parameter] public RenderFragment<string>? Icon { get; set; }

    [Parameter] public string CssClass { get; set; } = "";
    [Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => $"markdown-editor {CssClass}".Trim();
    private string TextareaId => Id ?? _generatedId;

    private IReadOnlyList<string> Shown =>
        (Tools ?? MarkdownFormat.ToolIds).Where(t => Labels.TryGetValue(t, out var l) && !string.IsNullOrEmpty(l)).ToList();
    private int ActiveIndex => Math.Min(_active, Shown.Count - 1);

    protected override void OnParametersSet()
    {
        if (_buttons.Length != Shown.Count) _buttons = new ElementReference[Shown.Count];
    }

    private static readonly Dictionary<string, string> Icons = new()
    {
        ["heading"] = "M3 3v10M13 3v10M3 8h10",
        ["bold"] = "M4.5 3h4a2.5 2.5 0 0 1 0 5h-4zM4.5 8h5a2.5 2.5 0 0 1 0 5h-5z",
        ["italic"] = "M10 3H6.5M9.5 13H6M9 3 7 13",
        ["strikethrough"] = "M2.5 8h11M10.5 5.2C10 4 9 3.5 8 3.5c-1.5 0-2.5.8-2.5 2 0 1 .6 1.6 2.5 2M6 11c.4.9 1.2 1.5 2.2 1.5 1.5 0 2.5-.8 2.5-2",
        ["code"] = "M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5",
        ["link"] = "M6.5 9.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.7.7M9.5 6.5a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5l.7-.7",
        ["quote"] = "M3 4v8M6.5 5h7M6.5 8h7M6.5 11h5",
        ["bulletList"] = "M6 4h8M6 8h8M6 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01",
        ["numberedList"] = "M7 4h7M7 8h7M7 12h7M2.5 3 3.5 2.5V6M2.5 9.5c.5-1 2-.8 2 .2 0 .8-1.5 1.3-2 2.3h2",
    };

    private static string IconPath(string tool) => Icons.TryGetValue(tool, out var d) ? d : "";

    // ---- Browser access (IJSRuntime "eval", from event handlers only) ----

    internal static string BuildSelectionScript(string id) =>
        $"(() => {{ const e = document.getElementById({JsonSerializer.Serialize(id)}); return e ? [e.selectionStart, e.selectionEnd] : null; }})()";

    /// <summary>
    /// Replace the text through the editing pipeline where the browser has one, so native undo / redo
    /// keeps working; otherwise set it directly; then restore the selection.
    /// </summary>
    internal static string BuildApplyScript(string id, string text, int start, int end) =>
        "(() => { const e = document.getElementById(" + JsonSerializer.Serialize(id) + "); if (!e) return;" +
        " const t = " + JsonSerializer.Serialize(text) + "; e.focus(); e.select();" +
        " let ok = false; try { ok = typeof document.execCommand === 'function' && document.execCommand('insertText', false, t); } catch (_) {}" +
        " if (!ok || e.value !== t) { e.value = t; e.dispatchEvent(new Event('input', { bubbles: true })); }" +
        " e.setSelectionRange(" + start + ", " + end + "); })()";

    private async Task RunAsync(string tool)
    {
        if (Disabled || ReadOnly) return;
        var selection = await JS.InvokeAsync<int[]?>("eval", BuildSelectionScript(TextareaId));
        var text = Value ?? "";
        var start = selection is { Length: 2 } ? Math.Clamp(selection[0], 0, text.Length) : text.Length;
        var end = selection is { Length: 2 } ? Math.Clamp(selection[1], start, text.Length) : text.Length;
        var edit = MarkdownFormat.ApplyTool(tool, text, start, end, Math.Clamp(HeadingLevel, 1, 6));
        await JS.InvokeVoidAsync("eval", BuildApplyScript(TextareaId, edit.Text, edit.Start, edit.End));
        await SetValueAsync(edit.Text);
    }

    private async Task OnInputAsync(ChangeEventArgs e) => await SetValueAsync(e.Value?.ToString() ?? "");

    private async Task SetValueAsync(string next)
    {
        Value = next;
        await ValueChanged.InvokeAsync(next);
    }

    private async Task OnToolbarKeyDownAsync(KeyboardEventArgs e, int index)
    {
        var last = Shown.Count - 1;
        var to = e.Key switch
        {
            "ArrowRight" => Math.Min(index + 1, last),
            "ArrowLeft" => Math.Max(index - 1, 0),
            "Home" => 0,
            "End" => last,
            _ => -1,
        };
        if (to < 0) return;
        _active = to;
        try { await _buttons[to].FocusAsync(preventScroll: true); }
        catch (Exception ex) when (ex is JSException or InvalidOperationException or JSDisconnectedException) { }
    }
}
