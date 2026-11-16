// ThemePicker — code-behind. See spec/index.md for the contract.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Context passed to a custom <c>ChildContent</c> render fragment. The
/// fragment replaces the default icon inside the button; it does not
/// render options. See <c>spec/index.md §4.1</c>.
/// </summary>
public sealed class ThemePickerContext
{
    /// <summary>Currently selected theme slug.</summary>
    public required string Value { get; init; }

    /// <summary>Is the listbox open?</summary>
    public required bool Open { get; init; }

    /// <summary>Resolve a slug to its display label.</summary>
    public required Func<string, string> LabelFor { get; init; }
}

/// <summary>The light and dark themes the <c>"system"</c> choice applies.</summary>
public sealed record ThemePickerSystemThemes(string Light, string Dark);

public partial class ThemePicker : ComponentBase, IAsyncDisposable
{
    /// <summary>The value of the option that follows the device's colour scheme.</summary>
    public const string SystemTheme = "system";

    /// <summary>400 days, the longest a browser keeps a cookie (RFC 6265bis).</summary>
    public const int ThemeCookieMaxAge = 400 * 24 * 60 * 60;

    // Default button icon: a bundled SVG (contrast/half-circle), not a
    // Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
    // convention (was U+25D1 CIRCLE WITH RIGHT HALF BLACK, exposed as the
    // constant CircleWithRightHalfBlack — removed, not renamed, since there
    // is no longer a single swappable character value). See ThemePicker.razor.

    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §4.1.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the button and the listbox. Required.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

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

    /// <summary>Resolve <c>prefers-color-scheme</c> to a supported theme on
    /// first visit. Mirrors <c>DetectFromNavigator</c> on LocalePicker.</summary>
    [Parameter] public bool DetectFromSystem { get; set; }

    /// <summary>The visible name of a first option, value <c>"system"</c> (<see cref="SystemTheme"/>), that follows
    /// the device: it applies <see cref="SystemThemes"/> from <c>prefers-color-scheme</c>, and changes when the device
    /// does, for example "Follow this device". Without it there is no such option. No English default.</summary>
    [Parameter] public string? SystemLabel { get; set; }

    /// <summary>The themes the <c>"system"</c> option applies. Default light and dark.</summary>
    [Parameter] public ThemePickerSystemThemes SystemThemes { get; set; } = new("light", "dark");

    /// <summary>If set, keep the choice in a first-party cookie of this name (<c>Path=/</c>, <c>SameSite=Lax</c>,
    /// <c>Secure</c> on https, 400 days), so a server can read it (<see cref="ReadThemeCookie"/>) and send the page in
    /// the right theme.</summary>
    [Parameter] public string? CookieName { get; set; }

    /// <summary>Also set <c>&lt;meta name="theme-color"&gt;</c> from the theme's
    /// <c>--lily-brand</c> once its stylesheet has loaded, so the browser chrome
    /// follows the theme. Off by default; a theme without <c>--lily-brand</c>
    /// leaves the tag alone.</summary>
    [Parameter] public bool ThemeColor { get; set; }

    /// <summary>Shared <c>name</c> attribute for the hidden input and the
    /// <c>data-lily-theme-picker</c> discriminator on the managed <c>&lt;link&gt;</c>.</summary>
    [Parameter] public string Name { get; set; } = "theme";

    /// <summary>File extension appended to each slug when constructing the URL.</summary>
    [Parameter] public string Extension { get; set; } = ".css";

    /// <summary>Optional pretty labels per slug.</summary>
    [Parameter] public IReadOnlyDictionary<string, string> ThemeLabels { get; set; }
        = new Dictionary<string, string>();

    /// <summary>Replaces the default half-circle icon inside the button.</summary>
    [Parameter] public RenderFragment<ThemePickerContext>? ChildContent { get; set; }

    /// <summary>Called after the control applies a new theme, with the theme applied. With "Follow this device" the
    /// choice (<c>"system"</c>) is <see cref="Value"/>, and this is the theme.</summary>
    [Parameter] public EventCallback<string> OnChange { get; set; }

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Is the popup open? Bindable: <c>@bind-Open</c>. Setting it from the parent opens or closes the popup without moving focus.</summary>
    [Parameter] public bool Open { get; set; }

    /// <summary>Raised with the new open state whenever the picker changes it (the user's action, or <c>Disabled</c> closing it).</summary>
    [Parameter] public EventCallback<bool> OpenChanged { get; set; }

    /// <summary>Disables the button; an open popup closes.</summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>
    /// <c>"select"</c> renders a native <c>&lt;select&gt;</c> instead of the button and listbox (RFC 3 prototype;
    /// ported from the Svelte reference 2026-10-30). Keyboard, typeahead and the mobile picker are the platform's;
    /// <see cref="Open"/> does not apply. Default <c>"listbox"</c>.
    /// </summary>
    [Parameter] public string Variant { get; set; } = "listbox";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    // -------------------------------------------------------------------
    // Instance state.
    // -------------------------------------------------------------------

    private readonly string _baseId = $"theme-picker-{Interlocked.Increment(ref _uid)}";

    private bool _initialised;
    private bool _open;

    /// <summary>Records an open or close the picker made, for <c>@bind-Open</c>.</summary>
    private void ReportOpen(bool open)
    {
        Open = open;
        _ = OpenChanged.InvokeAsync(open);
    }

    /// <summary>Applies <c>Open</c> and <c>Disabled</c> from the parent: state only, focus stays put.</summary>
    protected override void OnParametersSet()
    {
        if (Disabled && Open)
        {
            Open = false;
            _ = OpenChanged.InvokeAsync(false);
        }
        var wanted = Open && !Disabled;
        if (wanted != _open) _open = wanted;
    }
    private int _activeIndex = -1;

    // Angular/React/Vue/Web-Components/Svelte all composed IconButton/
    // Listbox directly and reached their real DOM element via a bindable
    // ref exposed from the child. Blazor's `@ref` on a component captures
    // the COMPONENT INSTANCE, not an element — these fields hold that
    // instance, and every focus call below goes through its own `.Element`.
    private IconButton? _buttonComponent;
    private Listbox? _listComponent;

    private bool _focusListPending;
    private bool _focusButtonPending;

    /// <summary>Set while the component itself is moving focus, so the root's
    /// focusout handler does not read the move as "focus left the control".</summary>
    private bool _suppressFocusOut;

    /// <summary>Set when a keydown already handled activation, so the click that
    /// the browser synthesises for Enter / Space does not toggle a second time.</summary>
    private bool _suppressNextClick;

    // -------------------------------------------------------------------
    // Ids and view helpers used by the .razor markup.
    // -------------------------------------------------------------------

    private string ListId => $"{_baseId}-list";

    private string OptionId(int index) => $"{_baseId}-option-{index}";

    private string RootClass => $"theme-picker {CssClass}".Trim();

    /// <summary>The choices offered: <c>"system"</c> first when it has a label, then the themes.</summary>
    private IReadOnlyList<string> Choices => string.IsNullOrEmpty(SystemLabel)
        ? Themes
        : new[] { SystemTheme }.Concat(Themes).ToList();

    /// <summary>The class list of one option: the <c>"system"</c> option also carries
    /// <c>theme-picker-option-system</c>, the hook the themes draw the line under.</summary>
    private static string OptionClass(string theme) => theme == SystemTheme
        ? "theme-picker-option theme-picker-option-system"
        : "theme-picker-option";

    // -------------------------------------------------------------------
    // Helpers — exposed for tests and consumers.
    // -------------------------------------------------------------------

    /// <summary>Normalise the themes directory URL to end with exactly one "/".</summary>
    public static string NormaliseThemesUrl(string themesUrl)
        => themesUrl.EndsWith('/') ? themesUrl : themesUrl + "/";

    /// <summary>Construct the href for a given theme slug.</summary>
    public static string ThemeHref(string themesUrl, string slug, string extension)
        => NormaliseThemesUrl(themesUrl) + slug + extension;

    /// <summary>
    /// Map an OS colour-scheme preference onto a supported theme slug.
    /// Mirrors <c>Locales.MatchNavigatorLanguage</c>: the browser reading
    /// happens in the interop probe, and this function is the pure,
    /// separately-testable decision.
    /// </summary>
    /// <param name="prefersDark">
    /// The result of <c>matchMedia("(prefers-color-scheme: dark)").matches</c>,
    /// or <c>null</c> when <c>matchMedia</c> is unavailable — prerender /
    /// static SSR, or a host without the API. Null always yields "".
    /// </param>
    /// <param name="themes">The supported theme slugs.</param>
    /// <returns>"dark" / "light" when supported, otherwise "".</returns>
    public static string MatchSystemTheme(bool? prefersDark, IReadOnlyList<string> themes)
    {
        if (prefersDark is null) return "";
        var wanted = prefersDark.Value ? "dark" : "light";
        foreach (var theme in themes)
        {
            if (theme == wanted) return wanted;
        }
        return "";
    }

    /// <summary>The theme a choice applies: <c>"system"</c> becomes the dark or light theme by
    /// <paramref name="prefersDark"/>; any other slug is itself. Mirrors <c>shared/theme-choice.ts</c>.</summary>
    public static string ResolveTheme(string choice, bool prefersDark, ThemePickerSystemThemes systemThemes)
        => choice != SystemTheme ? choice : prefersDark ? systemThemes.Dark : systemThemes.Light;

    /// <summary>The <c>document.cookie</c> (or <c>Set-Cookie</c>) string that keeps a theme choice.</summary>
    public static string ThemeCookie(string name, string value, bool secure = false)
        => $"{name}={Uri.EscapeDataString(value)}; Path=/; Max-Age={ThemeCookieMaxAge}; SameSite=Lax"
            + (secure ? "; Secure" : "");

    /// <summary>
    /// Read the theme cookie from a <c>Cookie</c> header or <c>document.cookie</c>. Returns "" when it is absent, or
    /// when <paramref name="allowed"/> is given and does not hold it: never trust a cookie into a stylesheet URL
    /// unchecked. A server reads it with this and passes it as <see cref="Value"/>.
    /// </summary>
    public static string ReadThemeCookie(string? cookies, string name, IReadOnlyList<string>? allowed = null)
    {
        foreach (var part in (cookies ?? "").Split(';'))
        {
            var eq = part.IndexOf('=');
            if (eq < 0 || part[..eq].Trim() != name) continue;
            string value;
            try { value = Uri.UnescapeDataString(part[(eq + 1)..].Trim()); }
            catch (UriFormatException) { return ""; }
            return allowed is null || allowed.Contains(value) ? value : "";
        }
        return "";
    }

    /// <summary>
    /// Resolve a theme slug to its display label: each hyphen-separated
    /// word title-cased, so a slug like
    /// "united-kingdom-national-health-service-england-for-patients"
    /// renders as "United Kingdom National Health Service England For
    /// Patients". Mirrors <c>Locales.LocaleName</c> in LocalePicker.
    /// </summary>
    /// <remarks>
    /// Public and pure, so consumers driving the control from their own
    /// UI can render matching labels without duplicating the rule.
    /// </remarks>
    public static string ThemeName(string slug)
    {
        if (string.IsNullOrEmpty(slug)) return slug;
        return string.Join(" ", slug.Split('-')
            .Select(word => word.Length == 0 ? word : char.ToUpperInvariant(word[0]) + word[1..]));
    }

    /// <summary>Instance label resolution: consumer override first, then
    /// the shared <see cref="ThemeName"/> rule.</summary>
    private string LabelFor(string theme)
    {
        if (theme == SystemTheme && !string.IsNullOrEmpty(SystemLabel)) return SystemLabel!;
        if (ThemeLabels.TryGetValue(theme, out var pretty)) return pretty;
        return ThemeName(theme);
    }

    private ThemePickerContext BuildContext() => new()
    {
        Value = Value ?? "",
        Open = _open,
        LabelFor = LabelFor,
    };

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && !_initialised)
        {
            _initialised = true;

            var initial = await ResolveInitialAsync();
            if (!string.IsNullOrEmpty(initial))
            {
                if (initial != Value)
                {
                    Value = initial;
                    await ValueChanged.InvokeAsync(Value);
                    StateHasChanged();
                }
                await ApplyThemeAsync(initial);
            }
        }

        // Focus moves are deferred to after render: the listbox cannot take
        // focus while it still carries `hidden`.
        if (_focusListPending)
        {
            _focusListPending = false;
            if (_listComponent is not null) await TryFocusAsync(_listComponent.Element);
        }
        if (_focusButtonPending)
        {
            _focusButtonPending = false;
            if (_buttonComponent is not null) await TryFocusAsync(_buttonComponent.Element);
        }
    }

    // preventScroll stops the browser's default scroll-into-view: the
    // listbox/list is positioned by CSS (see AGENTS/theme.md), and without
    // a consumer override for a right-edge header it can render partly
    // off-screen, and focusing it then auto-scrolled the whole page --
    // which reads as the page jumping sideways the instant the picker
    // opens.
    private static async Task TryFocusAsync(ElementReference element)
    {
        try
        {
            await element.FocusAsync(preventScroll: true);
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private async Task<string> ResolveInitialAsync()
    {
        if (!string.IsNullOrEmpty(Value)) return Value;

        // The cookie, above storage; only a value that is one of the choices.
        if (!string.IsNullOrEmpty(CookieName))
        {
            try
            {
                var cookies = await JS.InvokeAsync<string?>(
                    "eval", "(function(){try{return document.cookie;}catch(e){return null;}})()");
                var kept = ReadThemeCookie(cookies, CookieName!, Choices);
                if (!string.IsNullOrEmpty(kept)) return kept;
            }
            catch
            {
                // ignore prerender / interop failure
            }
        }

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

        if (DetectFromSystem)
        {
            try
            {
                // matchMedia is absent during prerender and in some hosts;
                // the probe returns null there and MatchSystemTheme yields "".
                var prefersDark = await JS.InvokeAsync<bool?>(
                    "eval",
                    "(function(){try{if(typeof matchMedia!=='function')return null;"
                    + "return matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){return null;}})()");
                var match = MatchSystemTheme(prefersDark, Themes);
                if (!string.IsNullOrEmpty(match)) return match;
            }
            catch
            {
                // ignore prerender / interop failure
            }
        }

        if (!string.IsNullOrEmpty(DefaultValue)) return DefaultValue!;
        // With a "system" option, following the device is the natural start.
        if (!string.IsNullOrEmpty(SystemLabel)) return SystemTheme;
        if (Themes.Count == 0) return "";

        foreach (var t in Themes)
        {
            if (t == "light") return "light";
        }
        return Themes[0];
    }

    // -------------------------------------------------------------------
    // Open / close.
    // -------------------------------------------------------------------

    /// <summary>Open the listbox. The active option defaults to the selected
    /// one (or the first), unless <paramref name="startIndex"/> overrides it.</summary>
    private void OpenList(int? startIndex = null)
    {
        if (Disabled) return;
        var selected = IndexOfValue();
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        _activeIndex = Choices.Count == 0
            ? -1
            : startIndex ?? (selected >= 0 ? selected : 0);
        _open = true;
        ReportOpen(true);
        _focusListPending = true;
        _suppressFocusOut = true;
        StateHasChanged();
    }

    /// <summary>Close the listbox, optionally returning focus to the button.</summary>
    private void CloseList(bool refocus = true)
    {
        if (!_open) return;
        _open = false;
        ReportOpen(false);
        _activeIndex = -1;
        if (refocus)
        {
            _focusButtonPending = true;
            _suppressFocusOut = true;
        }
        StateHasChanged();
    }

    private int IndexOfValue()
    {
        var choices = Choices;
        for (var i = 0; i < choices.Count; i++)
        {
            if (choices[i] == Value) return i;
        }
        return -1;
    }

    private Task OnSelectChangeAsync(ChangeEventArgs args) => SetThemeAsync(args.Value?.ToString() ?? "");

    private async Task ChooseAsync(int index)
    {
        var choices = Choices;
        if (index >= 0 && index < choices.Count)
        {
            var slug = choices[index];
            CloseList();
            if (!string.IsNullOrEmpty(slug)) await SetThemeAsync(slug);
            return;
        }
        CloseList();
    }

    // -------------------------------------------------------------------
    // Event handlers.
    //
    // Arrow/Home/End/PageUp/PageDown/typeahead/Escape/Tab keyboard
    // handling inside the open list is owned by the composed `Listbox`'s
    // `Navigation="Listbox.ActiveDescendant"` mode (see
    // LilyBlazorHeadless.Components); this component only decides what
    // open/close/choose mean.
    // -------------------------------------------------------------------

    private Task OnButtonClickAsync()
    {
        TipOnClick();
        if (_suppressNextClick)
        {
            _suppressNextClick = false;
            return Task.CompletedTask;
        }
        if (_open) CloseList();
        else OpenList();
        return Task.CompletedTask;
    }

    private Task OnButtonKeyDownAsync(KeyboardEventArgs args)
    {
        TipOnKeyDown(args);
        switch (args.Key)
        {
            case "ArrowDown":
            case "Enter":
            case " ":
                // Enter and Space also synthesise a click on a <button>;
                // swallow it so the listbox is not toggled twice.
                _suppressNextClick = true;
                OpenList();
                break;
            case "ArrowUp":
                _suppressNextClick = true;
                OpenList(Choices.Count - 1);
                break;
        }
        return Task.CompletedTask;
    }

    /// <summary>
    /// Focus leaving the root closes the listbox. Blazor's
    /// <see cref="FocusEventArgs"/> does not expose <c>relatedTarget</c>, so
    /// focus moves the component made itself are flagged instead.
    /// </summary>
    private Task OnRootFocusOutAsync()
    {
        if (_suppressFocusOut)
        {
            _suppressFocusOut = false;
            return Task.CompletedTask;
        }
        CloseList(false);
        return Task.CompletedTask;
    }

    // -------------------------------------------------------------------
    // Test seams (InternalsVisibleTo). bUnit has no live focus model, so
    // the suite asserts which element a FocusAsync interop call targeted
    // by comparing ElementReference ids — the same technique the
    // DateTimePicker suite uses.
    // -------------------------------------------------------------------

    /// <summary>The trigger button's ElementReference id, once rendered.</summary>
    internal string? ButtonReferenceId => _buttonComponent?.Element.Id;

    /// <summary>The listbox's ElementReference id, once rendered.</summary>
    internal string? ListReferenceId => _listComponent?.Element.Id;

    // -------------------------------------------------------------------
    // Apply / set.
    // -------------------------------------------------------------------

    /// <summary>Apply a theme imperatively. Public so consumers can drive the
    /// control from their own UI.</summary>
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

    // The device's colour scheme, once read, and whether its change listener is installed.
    private bool? _prefersDark;
    private bool _watching;
    private DotNetObjectReference<ThemePicker>? _selfRef;

    /// <summary>Applies a choice: the theme it resolves to goes on the managed link and <c>data-theme</c>; the
    /// choice itself (not the theme) is kept in storage and the cookie, so <c>"system"</c> follows the device again
    /// next visit. While the choice is <c>"system"</c> the device's colour scheme is watched.</summary>
    private async Task ApplyThemeAsync(string choice)
    {
        var theme = choice;
        if (choice == SystemTheme)
        {
            _prefersDark ??= await ProbePrefersDarkAsync();
            await WatchColorSchemeAsync();
            theme = ResolveTheme(choice, _prefersDark == true, SystemThemes);
        }
        else
        {
            await UnwatchColorSchemeAsync();
        }
        var href = ThemeHref(ThemesUrl, theme, Extension);
        var script = BuildApplyScript(Name, href, theme, StorageKey, ThemeColor, choice, CookieName);
        try
        {
            await JS.InvokeVoidAsync("eval", script);
        }
        catch
        {
            // ignore prerender / interop failure
        }
        await OnChange.InvokeAsync(theme);
    }

    private async Task<bool?> ProbePrefersDarkAsync()
    {
        try
        {
            return await JS.InvokeAsync<bool?>(
                "eval",
                "(function(){try{if(typeof matchMedia!=='function')return null;"
                + "return matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){return null;}})()");
        }
        catch
        {
            return null; // prerender / interop failure
        }
    }

    /// <summary>The device switched between light and dark: called from the <c>matchMedia</c> listener.</summary>
    [JSInvokable]
    public async Task OnColorSchemeChanged(bool dark)
    {
        _prefersDark = dark;
        if (Value == SystemTheme) await InvokeAsync(() => ApplyThemeAsync(SystemTheme));
    }

    /// <summary>Defines, once per page, the two functions that install and remove one picker's listener.</summary>
    internal const string WatchSetupScript =
        "(function(){if(window.__lilyThemePickerWatch)return;var w={};"
        + "window.__lilyThemePickerWatch=function(id,ref){if(typeof matchMedia!=='function'||w[id])return;"
        + "var q=matchMedia('(prefers-color-scheme: dark)');"
        + "var f=function(e){ref.invokeMethodAsync('OnColorSchemeChanged',e.matches);};"
        + "q.addEventListener('change',f);w[id]=function(){q.removeEventListener('change',f);};};"
        + "window.__lilyThemePickerUnwatch=function(id){if(w[id]){w[id]();delete w[id];}};})()";

    private async Task WatchColorSchemeAsync()
    {
        if (_watching) return;
        _watching = true;
        _selfRef ??= DotNetObjectReference.Create(this);
        try
        {
            await JS.InvokeVoidAsync("eval", WatchSetupScript);
            await JS.InvokeVoidAsync("__lilyThemePickerWatch", _baseId, _selfRef);
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private async Task UnwatchColorSchemeAsync()
    {
        if (!_watching) return;
        _watching = false;
        try
        {
            await JS.InvokeVoidAsync("__lilyThemePickerUnwatch", _baseId);
        }
        catch
        {
            // ignore: the circuit may already be gone
        }
    }

    /// <summary>Removes the colour-scheme listener.</summary>
    public async ValueTask DisposeAsync()
    {
        await UnwatchColorSchemeAsync();
        _selfRef?.Dispose();
        _selfRef = null;
        GC.SuppressFinalize(this);
    }

    /// <summary>Build the JS snippet that mutates the DOM. Exposed for tests. <paramref name="choice"/> (default the
    /// slug) is what storage and the cookie keep.</summary>
    internal static string BuildApplyScript(string name, string href, string slug, string? storageKey, bool themeColor = false,
        string? choice = null, string? cookieName = null)
    {
        var nameLit = JsonString(name);
        var hrefLit = JsonString(href);
        var slugLit = JsonString(slug);
        var choiceLit = JsonString(choice ?? slug);
        var storageLine = string.IsNullOrEmpty(storageKey)
            ? ""
            : $"try{{localStorage.setItem({JsonString(storageKey!)},{choiceLit});}}catch(e){{}}";
        var cookieLine = string.IsNullOrEmpty(cookieName)
            ? ""
            : $"try{{var c={JsonString(ThemeCookie(cookieName!, choice ?? slug))};"
                + "if(location.protocol==='https:')c+='; Secure';document.cookie=c;}catch(e){}";

        // The same steps as shared/theme-color.ts: wait for the stylesheet, read --lily-brand, set the tag if it changed.
        var themeColorLine = themeColor
            ? "l.addEventListener('load',function(){"
                + "var c=getComputedStyle(document.documentElement).getPropertyValue('--lily-brand').trim();if(!c)return;"
                + "var m=document.head.querySelector('meta[name=\"theme-color\"]');"
                + "if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m);}"
                + "if(m.content!==c)m.content=c;},{once:true});"
            : "";

        return "(function(){"
            + $"var n={nameLit};var sel='link[data-lily-theme-picker=\"'+n+'\"]';"
            + "var l=document.head.querySelector(sel);"
            + "if(!l){l=document.createElement('link');l.rel='stylesheet';l.setAttribute('data-lily-theme-picker',n);document.head.appendChild(l);}"
            + themeColorLine
            + $"l.href={hrefLit};"
            + $"document.documentElement.setAttribute('data-theme',{slugLit});"
            + storageLine
            + cookieLine
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

    // -------------------------------------------------------------------
    // Tooltip — spec/index.md §4.2 "Tooltip". Purely visual; the text is
    // the button's Label, so it is NOT linked with aria-describedby.
    // Blazor deviation (spec §9): no JS interop, so keyboard focus cannot
    // be told apart with matches(':focus-visible'). A mousedown on the
    // button immediately before its focus event marks the focus as
    // pointer-induced (no tooltip); any other focus counts as keyboard.
    // -------------------------------------------------------------------

    private bool _tipHoverButton;
    private bool _tipHoverTooltip;
    private bool _tipFocusButton;
    private bool _tipDismissed;
    private bool _tipPointerDown;

    private string TooltipId => $"{_baseId}-tooltip";

    private bool TooltipVisible
        => !_open && !_tipDismissed && (_tipHoverButton || _tipHoverTooltip || _tipFocusButton);

    private void OnTipButtonEnter() { _tipHoverButton = true; _tipDismissed = false; }

    private void OnTipButtonLeave() => _tipHoverButton = false;

    private void OnTipButtonMouseDown() => _tipPointerDown = true;

    private void OnTipButtonFocus()
    {
        _tipFocusButton = !_tipPointerDown;
        _tipPointerDown = false;
    }

    private void OnTipButtonBlur()
    {
        _tipFocusButton = false;
        _tipDismissed = false;
        _tipPointerDown = false;
    }

    private void OnTipTooltipEnter() => _tipHoverTooltip = true;

    private void OnTipTooltipLeave() => _tipHoverTooltip = false;

    /// <summary>Clicking the button clears hover (the popup toggle follows).</summary>
    private void TipOnClick() => _tipHoverButton = false;

    /// <summary>Escape pressed anywhere inside the root (focus on any child while the
    /// tooltip is visible by hover) dismisses it. Blazor deviation: no document-level
    /// listener without JS interop, so Escape with focus outside the root is not
    /// handled. Never moves focus, never prevents default.</summary>
    private void OnTipRootKeyDown(KeyboardEventArgs args)
    {
        if (args.Key == "Escape" && TooltipVisible) _tipDismissed = true;
    }

    /// <summary>Escape dismisses a visible tooltip without moving focus.</summary>
    private void TipOnKeyDown(KeyboardEventArgs args)
    {
        _tipPointerDown = false;
        if (args.Key == "Escape" && TooltipVisible) _tipDismissed = true;
    }
}
