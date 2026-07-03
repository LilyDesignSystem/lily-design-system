// TextSizeSelect — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment.
/// See <c>spec/index.md §4.2</c>.
/// </summary>
public sealed class TextSizeSelectContext
{
    public required IReadOnlyList<string> Sizes { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetSize { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}

public partial class TextSizeSelect : ComponentBase
{
    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the &lt;select&gt;. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Available text-size slugs.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<string> Sizes { get; set; } = Array.Empty<string>();

    /// <summary>Currently selected size slug. Bindable via <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";

    /// <summary>Two-way binding callback for <see cref="Value"/>.</summary>
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Initial size when nothing else is supplied.</summary>
    [Parameter] public string? DefaultValue { get; set; }

    /// <summary>If set, persist the selection to <c>localStorage</c>.</summary>
    [Parameter] public string? StorageKey { get; set; }

    /// <summary>Shared <c>name</c> attribute for the &lt;select&gt;.</summary>
    [Parameter] public string Name { get; set; } = "text-size";

    /// <summary>Optional pretty labels per size slug.</summary>
    [Parameter] public IReadOnlyDictionary<string, string> SizeLabels { get; set; }
        = new Dictionary<string, string>();

    /// <summary>Custom rendering of the options.</summary>
    [Parameter] public RenderFragment<TextSizeSelectContext>? ChildContent { get; set; }

    /// <summary>Called after the select applies a new size.</summary>
    [Parameter] public EventCallback<string> OnChange { get; set; }

    /// <summary>Extra CSS class merged into the &lt;select&gt; root.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    private bool _initialised;

    // -------------------------------------------------------------------
    // View helpers used by the .razor markup.
    // -------------------------------------------------------------------

    private string RootClass => $"text-size-select {CssClass}".Trim();

    internal string LabelFor(string slug)
    {
        if (SizeLabels.TryGetValue(slug, out var pretty)) return pretty;
        return TitleCase(slug);
    }

    /// <summary>
    /// Title-case a slug per hyphen-word: <c>x-large</c> → <c>X Large</c>.
    /// The word "default" is never emitted on its own.
    /// </summary>
    internal static string TitleCase(string slug)
    {
        if (string.IsNullOrEmpty(slug)) return "";
        var words = slug.Split('-', StringSplitOptions.RemoveEmptyEntries);
        var parts = new List<string>(words.Length);
        foreach (var word in words)
        {
            if (word.Equals("default", StringComparison.OrdinalIgnoreCase)) continue;
            if (word.Length == 0) continue;
            parts.Add(char.ToUpperInvariant(word[0]) + word.Substring(1));
        }
        return string.Join(" ", parts);
    }

    private TextSizeSelectContext BuildContext() => new()
    {
        Sizes = Sizes,
        Value = Value ?? "",
        SetSize = SetSizeAsync,
        Name = Name,
        LabelFor = LabelFor,
    };

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        if (_initialised) return;
        _initialised = true;

        var initial = await ResolveInitialAsync();
        if (string.IsNullOrEmpty(initial)) return;

        if (initial != Value)
        {
            Value = initial;
            await ValueChanged.InvokeAsync(Value);
            StateHasChanged();
        }
        await ApplySizeAsync(initial);
    }

    private async Task<string> ResolveInitialAsync()
    {
        if (!string.IsNullOrEmpty(Value)) return Value;

        if (!string.IsNullOrEmpty(StorageKey))
        {
            try
            {
                var stored = await JS.InvokeAsync<string?>(
                    "eval",
                    $"(function(){{try{{return localStorage.getItem({JsonString(StorageKey!)});}}catch(e){{return null;}}}})()");
                if (!string.IsNullOrEmpty(stored)) return stored!;
            }
            catch { /* prerender / interop unavailable */ }
        }

        if (!string.IsNullOrEmpty(DefaultValue)) return DefaultValue!;
        if (Sizes.Count == 0) return "";

        foreach (var s in Sizes)
        {
            if (s == "medium") return "medium";
        }
        return Sizes[0];
    }

    // -------------------------------------------------------------------
    // Apply / set.
    // -------------------------------------------------------------------

    /// <summary>Apply a size imperatively. Public so the ChildContent render fragment can call it.</summary>
    public async Task SetSizeAsync(string slug)
    {
        if (string.IsNullOrEmpty(slug)) return;
        if (slug == Value)
        {
            await ApplySizeAsync(slug);
            return;
        }
        Value = slug;
        await ValueChanged.InvokeAsync(Value);
        await ApplySizeAsync(slug);
        StateHasChanged();
    }

    private Task OnSelectAsync(ChangeEventArgs args)
        => SetSizeAsync(args.Value?.ToString() ?? "");

    private async Task ApplySizeAsync(string slug)
    {
        var script = BuildApplyScript(slug, StorageKey);
        try
        {
            await JS.InvokeVoidAsync("eval", script);
        }
        catch
        {
            // ignore prerender / interop failure
        }
        await OnChange.InvokeAsync(slug);
    }

    /// <summary>Build the JS snippet that mutates the DOM. Exposed for tests.</summary>
    internal static string BuildApplyScript(string slug, string? storageKey)
    {
        var slugLit = JsonString(slug);
        var storageLine = string.IsNullOrEmpty(storageKey)
            ? ""
            : $"try{{localStorage.setItem({JsonString(storageKey!)},{slugLit});}}catch(e){{}}";

        return "(function(){"
            + $"document.documentElement.setAttribute('data-text-size',{slugLit});"
            + storageLine
            + "})();";
    }

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
