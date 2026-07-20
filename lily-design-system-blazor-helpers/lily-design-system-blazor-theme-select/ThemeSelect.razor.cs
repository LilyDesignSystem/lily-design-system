// ThemeSelect — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment.
/// See <c>spec/index.md §4.1</c>.
/// </summary>
public sealed class ThemeSelectContext
{
    public required IReadOnlyList<string> Themes { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetTheme { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}

public partial class ThemeSelect : ComponentBase
{
    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the &lt;select&gt;. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>
    /// Text of the always-displayed placeholder option. The closed
    /// &lt;select&gt; shows this instead of the selected theme name, so the
    /// control stays as narrow as this word. Defaults to <see cref="Label"/>.
    /// </summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <summary>Base URL of the themes directory, e.g. "/assets/themes/".</summary>
    [Parameter, EditorRequired] public string ThemesUrl { get; set; } = "";

    /// <summary>Available theme slugs.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<string> Themes { get; set; } = Array.Empty<string>();

    /// <summary>Currently selected theme slug. Bindable via <c>@bind-Value</c>.</summary>
    [Parameter] public string Value { get; set; } = "";

    /// <summary>Two-way binding callback for <see cref="Value"/>.</summary>
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    /// <summary>Initial theme when nothing else is supplied.</summary>
    [Parameter] public string? DefaultValue { get; set; }

    /// <summary>If set, persist the selection to <c>localStorage</c> under this key.</summary>
    [Parameter] public string? StorageKey { get; set; }

    /// <summary>Shared <c>name</c> attribute for the &lt;select&gt; and the
    /// <c>data-lily-theme-select</c> discriminator on the managed <c>&lt;link&gt;</c>.</summary>
    [Parameter] public string Name { get; set; } = "theme";

    /// <summary>File extension appended to each slug when constructing the URL.</summary>
    [Parameter] public string Extension { get; set; } = ".css";

    /// <summary>Optional pretty labels per slug.</summary>
    [Parameter] public IReadOnlyDictionary<string, string> ThemeLabels { get; set; }
        = new Dictionary<string, string>();

    /// <summary>Custom rendering of the options.</summary>
    [Parameter] public RenderFragment<ThemeSelectContext>? ChildContent { get; set; }

    /// <summary>Called after the select applies a new theme.</summary>
    [Parameter] public EventCallback<string> OnChange { get; set; }

    /// <summary>Extra CSS class merged into the &lt;select&gt; root.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    private bool _initialised;

    /// <summary>Reference to the root &lt;select&gt;, used to snap its own DOM
    /// value back to the placeholder after every change.</summary>
    private ElementReference _selectElement;

    /// <summary>Text shown by the always-selected placeholder option.</summary>
    private string PlaceholderText => Placeholder ?? Label;

    // -------------------------------------------------------------------
    // Helpers — exposed for tests and consumers.
    // -------------------------------------------------------------------

    /// <summary>Normalise the themes directory URL to end with exactly one "/".</summary>
    public static string NormaliseThemesUrl(string themesUrl)
        => themesUrl.EndsWith('/') ? themesUrl : themesUrl + "/";

    /// <summary>Construct the href for a given theme slug.</summary>
    public static string ThemeHref(string themesUrl, string slug, string extension)
        => NormaliseThemesUrl(themesUrl) + slug + extension;

    private string RootClass => $"theme-select {CssClass}".Trim();

    private string LabelFor(string theme)
    {
        if (ThemeLabels.TryGetValue(theme, out var pretty)) return pretty;
        if (theme.Length == 0) return theme;
        // Title-case each hyphen-separated word so a slug renders as
        // "United Kingdom National Health Service England For Patients".
        return string.Join(" ", theme.Split('-')
            .Select(word => word.Length == 0 ? word : char.ToUpperInvariant(word[0]) + word[1..]));
    }

    private ThemeSelectContext BuildContext() => new()
    {
        Themes = Themes,
        Value = Value ?? "",
        SetTheme = SetThemeAsync,
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
        await ApplyThemeAsync(initial);
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
                    $"(function(){{try{{return localStorage.getItem({JsonString(StorageKey!)});}}catch(e){{return null;}}}})()"
                );
                if (!string.IsNullOrEmpty(stored)) return stored!;
            }
            catch
            {
                // ignore prerender / interop failure
            }
        }

        if (!string.IsNullOrEmpty(DefaultValue)) return DefaultValue!;
        if (Themes.Count == 0) return "";

        foreach (var t in Themes)
        {
            if (t == "light") return "light";
        }
        return Themes[0];
    }

    // -------------------------------------------------------------------
    // Apply / set.
    // -------------------------------------------------------------------

    /// <summary>Apply a theme imperatively. Public so the ChildContent render fragment can call it.</summary>
    public async Task SetThemeAsync(string slug)
    {
        if (string.IsNullOrEmpty(slug)) return;
        if (slug == Value)
        {
            await ApplyThemeAsync(slug);
            return;
        }
        Value = slug;
        await ValueChanged.InvokeAsync(Value);
        await ApplyThemeAsync(slug);
        StateHasChanged();
    }

    /// <summary>
    /// The &lt;select&gt; never tracks <see cref="Value"/>: its own DOM
    /// selection snaps back to the placeholder option after every change, so
    /// the closed control always reads <c>Placeholder ?? Label</c> rather than
    /// the active theme name. Everything downstream is unchanged.
    /// </summary>
    private async Task OnSelectAsync(ChangeEventArgs args)
    {
        var chosen = args.Value?.ToString() ?? "";
        await SnapBackToPlaceholderAsync();
        if (!string.IsNullOrEmpty(chosen)) await SetThemeAsync(chosen);
    }

    /// <summary>
    /// Reset the live &lt;select&gt; element's value to the placeholder.
    /// The rendered markup already marks the placeholder <c>selected</c>, but
    /// a browser ignores that once the user has interacted with the control,
    /// so the DOM property has to be written directly.
    /// </summary>
    private async Task SnapBackToPlaceholderAsync()
    {
        try
        {
            await JS.InvokeVoidAsync("Object.assign", _selectElement, new { value = "" });
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private async Task ApplyThemeAsync(string slug)
    {
        var href = ThemeHref(ThemesUrl, slug, Extension);
        var script = BuildApplyScript(Name, href, slug, StorageKey);
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
    internal static string BuildApplyScript(string name, string href, string slug, string? storageKey)
    {
        var nameLit = JsonString(name);
        var hrefLit = JsonString(href);
        var slugLit = JsonString(slug);
        var storageLine = string.IsNullOrEmpty(storageKey)
            ? ""
            : $"try{{localStorage.setItem({JsonString(storageKey!)},{slugLit});}}catch(e){{}}";

        return "(function(){"
            + $"var n={nameLit};var sel='link[data-lily-theme-select=\"'+n+'\"]';"
            + "var l=document.head.querySelector(sel);"
            + "if(!l){l=document.createElement('link');l.rel='stylesheet';l.setAttribute('data-lily-theme-select',n);document.head.appendChild(l);}"
            + $"l.href={hrefLit};"
            + $"document.documentElement.setAttribute('data-theme',{slugLit});"
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
