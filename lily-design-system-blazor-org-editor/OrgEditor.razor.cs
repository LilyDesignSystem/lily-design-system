using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>Code-behind for <c>OrgEditor.razor</c>. Contract: <c>spec/index.md</c>.</summary>
public partial class OrgEditor : ComponentBase
{
    private static int _counter;
    private readonly string _generatedId;
    private int _active;
    private ElementReference[] _buttons = Array.Empty<ElementReference>();

    public OrgEditor()
    {
        _generatedId = $"org-editor-{Interlocked.Increment(ref _counter)}";
    }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    /// <summary>The text, as Org. Two-way: <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Accessible name of the textarea. Required: there is no default English.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Accessible name of the toolbar. Required.</summary>
    [Parameter, EditorRequired] public string ToolbarLabel { get; set; } = "";

    /// <summary>The accessible name of each tool, keyed by tool id; a tool with no name is not rendered.</summary>
    [Parameter, EditorRequired] public IReadOnlyDictionary<string, string> Labels { get; set; } = new Dictionary<string, string>();

    /// <summary>Which tools to show, in order. Default: all 23.</summary>
    [Parameter] public IReadOnlyList<string>? Tools { get; set; }

    /// <summary>Stars the heading tool writes on a plain line (1 to 6). Default 1.</summary>
    [Parameter] public int HeadingLevel { get; set; } = 1;

    /// <summary>The task keywords the todo tool cycles through. Default TODO, DONE.</summary>
    [Parameter] public IReadOnlyList<string>? TodoKeywords { get; set; }

    /// <summary>The priority letters the priority tool cycles through. Default A, B, C.</summary>
    [Parameter] public IReadOnlyList<string>? Priorities { get; set; }

    /// <summary>Today as <c>YYYY-MM-DD</c>, for scheduled, deadline and timestamp. Default: the local date when the tool runs.</summary>
    [Parameter] public string? Today { get; set; }

    /// <summary>The property the property tool adds. Default ID.</summary>
    [Parameter] public string PropertyKey { get; set; } = "ID";

    /// <summary>The drawer the drawer tool writes. Default LOGBOOK.</summary>
    [Parameter] public string DrawerName { get; set; } = "LOGBOOK";

    /// <summary>The properties a contact entry gets. Default EMAIL, PHONE, ADDRESS, BIRTHDAY.</summary>
    [Parameter] public IReadOnlyList<string>? ContactProperties { get; set; }

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

    private string RootClass => $"org-editor {CssClass}".Trim();
    private string TextareaId => Id ?? _generatedId;

    private IReadOnlyList<string> Shown =>
        (Tools ?? OrgFormat.ToolIds).Where(t => Labels.TryGetValue(t, out var l) && !string.IsNullOrEmpty(l)).ToList();
    private int ActiveIndex => Math.Min(_active, Shown.Count - 1);

    protected override void OnParametersSet()
    {
        if (_buttons.Length != Shown.Count) _buttons = new ElementReference[Shown.Count];
    }

    private static readonly Dictionary<string, string> Icons = new()
    {
        ["heading"] = "M3 3v10M13 3v10M3 8h10",
        ["promote"] = "M13 8H3M7 4 3 8l4 4",
        ["demote"] = "M3 8h10M9 4l4 4-4 4",
        ["todo"] = "M3 3h10v10H3zM5.5 8l2 2 3-4",
        ["priority"] = "M5.5 3 4.5 13M11.5 3l-1 10M2.5 6h11M2 10h11",
        ["scheduled"] = "M2.5 4h11v9.5h-11zM2.5 7h11M5 2.5v3M11 2.5v3",
        ["deadline"] = "M4 14V2.5M4 3h8l-1.5 2.5L12 8H4",
        ["timestamp"] = "M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5v3l2 1.5",
        ["bold"] = "M4.5 3h4a2.5 2.5 0 0 1 0 5h-4zM4.5 8h5a2.5 2.5 0 0 1 0 5h-5z",
        ["italic"] = "M10 3H6.5M9.5 13H6M9 3 7 13",
        ["underline"] = "M4.5 3v5a3.5 3.5 0 0 0 7 0V3M3 14h10",
        ["strikethrough"] = "M2.5 8h11M10.5 5.2C10 4 9 3.5 8 3.5c-1.5 0-2.5.8-2.5 2 0 1 .6 1.6 2.5 2M6 11c.4.9 1.2 1.5 2.2 1.5 1.5 0 2.5-.8 2.5-2",
        ["code"] = "M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5",
        ["verbatim"] = "M3 6h10M3 10h10",
        ["link"] = "M6.5 9.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.7.7M9.5 6.5a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5l.7-.7",
        ["bulletList"] = "M6 4h8M6 8h8M6 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01",
        ["numberedList"] = "M7 4h7M7 8h7M7 12h7M2.5 3 3.5 2.5V6M2.5 9.5c.5-1 2-.8 2 .2 0 .8-1.5 1.3-2 2.3h2",
        ["checkbox"] = "M2.5 2.5h5v5h-5zM9.5 5h4M2.5 9.5h5v5h-5zM9.5 12h4",
        ["quote"] = "M3 4v8M6.5 5h7M6.5 8h7M6.5 11h5",
        ["sourceBlock"] = "M2 3h12v10H2zM6 6 4.5 8 6 10M10 6l1.5 2L10 10",
        ["property"] = "M2.5 5h4M2.5 8h4M2.5 11h4M8.5 5h5M8.5 8h5M8.5 11h5",
        ["drawer"] = "M2.5 3h11v4h-11zM2.5 9h11v4h-11zM6.5 5h3M6.5 11h3",
        ["contact"] = "M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 14c.5-3 2.5-4.5 5-4.5s4.5 1.5 5 4.5",
    };

    private static string Group(string tool) => OrgFormat.ToolGroups.TryGetValue(tool, out var g) ? g : "";

    private OrgOptions Options() => new()
    {
        HeadingLevel = Math.Clamp(HeadingLevel, 1, 6),
        TodoKeywords = TodoKeywords,
        Priorities = Priorities,
        Today = Today,
        PropertyKey = PropertyKey,
        DrawerName = DrawerName,
        ContactProperties = ContactProperties,
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
        var edit = OrgFormat.ApplyTool(tool, text, start, end, Options());
        if (edit.Text == text && edit.Start == start && edit.End == end) return;
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
