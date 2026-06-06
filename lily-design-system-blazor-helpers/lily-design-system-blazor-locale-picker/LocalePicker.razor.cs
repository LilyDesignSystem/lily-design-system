// LocalePicker — code-behind. See spec.md for the contract.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment.
/// See <c>spec.md §4.2</c>.
/// </summary>
public sealed class LocalePickerContext
{
    public required IReadOnlyList<string> Locales { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetLocale { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
    public required Func<string, string> TagFor { get; init; }
    public required Func<string, bool> IsRtl { get; init; }
}

public partial class LocalePicker : ComponentBase
{
    // -------------------------------------------------------------------
    // Parameters — see spec.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the radiogroup. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Available locale codes.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<string> Locales { get; set; } = Array.Empty<string>();

    /// <summary>Currently selected locale code. Bindable via <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";

    /// <summary>Two-way binding callback for <see cref="Value"/>.</summary>
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Initial locale when nothing else is supplied.</summary>
    [Parameter] public string? DefaultValue { get; set; }

    /// <summary>If set, persist the selection to <c>localStorage</c>.</summary>
    [Parameter] public string? StorageKey { get; set; }

    /// <summary>Resolve <c>navigator.languages</c> on first visit.</summary>
    [Parameter] public bool DetectFromNavigator { get; set; }

    /// <summary>Shared <c>name</c> attribute for the radio inputs.</summary>
    [Parameter] public string Name { get; set; } = "locale";

    /// <summary>If false, the picker only writes <c>lang</c> and never touches <c>dir</c>.</summary>
    [Parameter] public bool ApplyDir { get; set; } = true;

    /// <summary>Optional pretty labels per locale code.</summary>
    [Parameter] public IReadOnlyDictionary<string, string> LocaleLabels { get; set; }
        = new Dictionary<string, string>();

    /// <summary>Custom rendering of the options.</summary>
    [Parameter] public RenderFragment<LocalePickerContext>? ChildContent { get; set; }

    /// <summary>Called after the picker applies a new locale (consumer-form code, not BCP 47).</summary>
    [Parameter] public EventCallback<string> OnChange { get; set; }

    /// <summary>Extra CSS class merged into the &lt;fieldset&gt; root.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    private bool _initialised;

    // -------------------------------------------------------------------
    // View helpers used by the .razor markup.
    // -------------------------------------------------------------------

    private string RootClass => $"locale-picker {CssClass}".Trim();

    internal string LabelFor(string locale)
    {
        if (LocaleLabels.TryGetValue(locale, out var pretty)) return pretty;
        if (Helpers.Locales.DefaultLocaleLabels.TryGetValue(locale, out var built)) return built;
        return locale;
    }

    internal string TagFor(string locale) => Helpers.Locales.Bcp47LocaleTag(locale);

    private LocalePickerContext BuildContext() => new()
    {
        Locales = Locales,
        Value = Value ?? "",
        SetLocale = SetLocaleAsync,
        Name = Name,
        LabelFor = LabelFor,
        TagFor = TagFor,
        IsRtl = Helpers.Locales.IsRtlLocale,
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
        await ApplyLocaleAsync(initial);
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

        if (DetectFromNavigator)
        {
            try
            {
                var langs = await JS.InvokeAsync<string[]?>(
                    "eval",
                    "(function(){try{if(navigator.languages&&navigator.languages.length>0)return Array.from(navigator.languages);if(navigator.language)return [navigator.language];return [];}catch(e){return [];}})()");
                if (langs is not null)
                {
                    var match = Helpers.Locales.MatchNavigatorLanguage(langs, Locales);
                    if (!string.IsNullOrEmpty(match)) return match;
                }
            }
            catch { /* prerender / interop unavailable */ }
        }

        if (!string.IsNullOrEmpty(DefaultValue)) return DefaultValue!;
        if (Locales.Count == 0) return "";

        foreach (var l in Locales)
        {
            if (l == "en") return "en";
        }
        return Locales[0];
    }

    // -------------------------------------------------------------------
    // Apply / set.
    // -------------------------------------------------------------------

    /// <summary>Apply a locale imperatively. Public so the ChildContent render fragment can call it.</summary>
    public async Task SetLocaleAsync(string code)
    {
        if (string.IsNullOrEmpty(code)) return;
        if (code == Value)
        {
            await ApplyLocaleAsync(code);
            return;
        }
        Value = code;
        await ValueChanged.InvokeAsync(Value);
        await ApplyLocaleAsync(code);
        StateHasChanged();
    }

    private Task OnInputChangeAsync(string code) => SetLocaleAsync(code);

    private async Task ApplyLocaleAsync(string code)
    {
        var script = BuildApplyScript(code, ApplyDir, StorageKey);
        try
        {
            await JS.InvokeVoidAsync("eval", script);
        }
        catch
        {
            // ignore prerender / interop failure
        }
        await OnChange.InvokeAsync(code);
    }

    /// <summary>Build the JS snippet that mutates the DOM. Exposed for tests.</summary>
    internal static string BuildApplyScript(string code, bool applyDir, string? storageKey)
    {
        var tag = Helpers.Locales.Bcp47LocaleTag(code);
        var dir = Helpers.Locales.IsRtlLocale(code) ? "rtl" : "ltr";

        var tagLit = JsonString(tag);
        var codeLit = JsonString(code);
        var dirLine = applyDir
            ? $"document.documentElement.setAttribute('dir',{JsonString(dir)});"
            : "";
        var storageLine = string.IsNullOrEmpty(storageKey)
            ? ""
            : $"try{{localStorage.setItem({JsonString(storageKey!)},{codeLit});}}catch(e){{}}";

        return "(function(){"
            + $"document.documentElement.setAttribute('lang',{tagLit});"
            + dirLine
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
