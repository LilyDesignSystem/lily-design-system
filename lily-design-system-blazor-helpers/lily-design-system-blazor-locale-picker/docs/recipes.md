# Recipes

Task-shaped solutions. Each one is self-contained; the conceptual
background lives in [`concepts.md`](concepts.md).

## Follow the browser's language on first visit

```razor
<LocaleChooser Label="Language"
              Locales="@(new[] { "en", "fr", "de", "ar" })"
              DetectFromNavigator="true"
              StorageKey="lily-locale"
              @bind-Value="locale" />
```

`DetectFromNavigator` matches `navigator.languages` against your list —
exact match first, then language-only, so a browser asking for `fr-CH`
settles for `fr`. Pair it with `StorageKey` so a user who corrects the
guess is not re-guessed at on every visit.

Resolution order:

```
Value > StorageKey > DetectFromNavigator > DefaultValue > "en" > Locales[0]
```

Detection only ever decides the first visit.

## Show each language in its own language (endonyms)

The single highest-value change you can make to a language chooser. A
user who cannot read the current interface language is exactly the user
who needs this control, and "Welsh" is useless to someone scanning for
"Cymraeg".

```razor
<LocaleChooser Label="Language"
              Locales="@codes"
              LocaleLabels="@Endonyms"
              @bind-Value="locale" />

@code {
    private readonly string[] codes = { "en", "cy", "fr", "ar", "zh_Hans" };

    private static readonly Dictionary<string, string> Endonyms = new()
    {
        ["en"]      = "English",
        ["cy"]      = "Cymraeg",
        ["fr"]      = "Français",
        ["ar"]      = "العربية",
        ["zh_Hans"] = "简体中文",
    };
}
```

Each option already carries its own `lang`, so screen readers pronounce
each endonym with the right voice and the browser picks the right font.
See [`NhsStyle.razor`](../examples/NhsStyle.razor).

## Read a locale cookie before render (Blazor Web App)

The only way to avoid a first-paint flash of the wrong language, since
`localStorage` is not readable by the server. Full recipe in
[`ssr.md`](ssr.md); the shape is:

```razor
<LocaleChooser Label="Language"
              Locales="@codes"
              Value="@serverResolvedLocale"
              OnChange="PersistLocale"
              @bind-Value:after="() => { }" />
```

An explicit non-empty `Value` wins over storage and detection, which is
precisely why the cookie strategy works.

## Switch `CultureInfo` when the locale changes

The component applies `lang` and `dir`. It does not translate anything —
that is yours, and `OnChange` is the seam:

```razor
<LocaleChooser Label="Language" Locales="@codes"
              @bind-Value="locale" OnChange="OnLocaleChange" />

@code {
    private async Task OnLocaleChange(string code)
    {
        var culture = new CultureInfo(Locales.Bcp47LocaleTag(code));
        CultureInfo.DefaultThreadCurrentCulture   = culture;
        CultureInfo.DefaultThreadCurrentUICulture = culture;
        await InvokeAsync(StateHasChanged);
    }
}
```

Note the `Bcp47LocaleTag` conversion: `CultureInfo` wants `"pt-BR"`, and
your `Locales` list may hold `"pt_BR"`. Full wiring for
`IStringLocalizer<T>` and ResX is in
[`i18n-integration.md`](i18n-integration.md).

## Persist to a cookie instead of localStorage

```razor
<LocaleChooser Label="Language" Locales="@codes"
              Value="@initialLocale"
              OnChange="PersistLocale" />

@code {
    [Inject] private HttpClient Http { get; set; } = default!;

    private async Task PersistLocale(string code)
        => await Http.PostAsJsonAsync("/api/locale", new { locale = code });
}
```

Server endpoint:

```csharp
app.MapPost("/api/locale", (HttpContext ctx, LocaleDto dto) =>
{
    ctx.Response.Cookies.Append("locale", dto.Locale, new CookieOptions
    {
        Path = "/",
        MaxAge = TimeSpan.FromDays(365),
        HttpOnly = false,
        SameSite = SameSiteMode.Lax,
    });
    return Results.NoContent();
});
```

Leave `StorageKey` unset when you do this, or the two persistence
mechanisms can disagree after a server-side change.

## Sort the list sensibly

The component never reorders `Locales` — the right order is a product
decision. Two common shapes:

```csharp
// Alphabetical by the label the user actually sees (endonym-aware).
var sorted = codes
    .OrderBy(c => Endonyms.TryGetValue(c, out var n) ? n : Locales.LocaleName(c),
             StringComparer.CurrentCulture)
    .ToArray();

// Likely candidates pinned on top, remainder alphabetical.
var pinned    = new[] { "en", "cy" };
var remainder = codes.Except(pinned).OrderBy(Locales.LocaleName).ToArray();
var ordered   = pinned.Concat(remainder).ToArray();
```

Use `StringComparer.CurrentCulture`, not `Ordinal` — ordinal sorting
puts "Émilie" after "Zoe" and mis-sorts every non-ASCII endonym.

## Handle a very long locale list

The built-in table covers 436 codes. Rendering all of them in a listbox
is a poor experience; give users a type-ahead instead and drive the
component imperatively:

```razor
<input list="locale-options" @bind="query" @bind:event="oninput"
       aria-label="Search languages" />
<datalist id="locale-options">
    @foreach (var (code, name) in Locales.DefaultLocaleLabels)
    {
        <option value="@name" />
    }
</datalist>

<LocaleChooser @ref="localeSelect" Label="Language" Locales="@codes" @bind-Value="locale" />
```

Resolve the typed name back to a code and call `SetLocaleAsync`. Full
example: [`Combobox.razor`](../examples/Combobox.razor).

The component's own listbox also has a 500 ms typeahead over the labels,
which is adequate up to a few dozen options.

## Preview RTL without committing to it

Useful when testing a layout. `ApplyDir="false"` leaves `dir` alone
while still writing `lang`:

```razor
<LocaleChooser Label="Language" Locales="@codes" ApplyDir="false" @bind-Value="locale" />
```

Then apply direction to a subtree you control:

```razor
<div dir="@(Locales.IsRtlLocale(locale) ? "rtl" : "ltr")">
    <!-- preview pane only -->
</div>
```

See [`RtlDemo.razor`](../examples/RtlDemo.razor) and
[`rtl.md`](rtl.md#when-to-opt-out).

## Sync the locale across multiple tabs

`localStorage` fires a `storage` event in *other* tabs. Listen for it
and drive the component:

```razor
<LocaleChooser @ref="localeSelect" Label="Language" Locales="@codes"
              StorageKey="lily-locale" @bind-Value="locale" />

@code {
    private LocaleChooser? localeSelect;

    [JSInvokable]
    public async Task OnStorageLocale(string code)
        => await localeSelect!.SetLocaleAsync(code);

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        var self = DotNetObjectReference.Create(this);
        await JS.InvokeVoidAsync("eval", @"
            window.addEventListener('storage', function (e) {
                if (e.key === 'lily-locale' && e.newValue) {
                    window.__lilyLocaleRef.invokeMethodAsync('OnStorageLocale', e.newValue);
                }
            });");
        // assign self to window.__lilyLocaleRef via your own interop
    }
}
```

The `storage` event does not fire in the tab that made the change, so
this cannot loop.

## Put the chooser in a header utility bar

The conventional placement, and the one users look for first:

```razor
<header class="site-header">
    <a class="site-logo" href="/">…</a>
    <nav class="site-utility" aria-label="Site settings">
        <LocaleChooser Label="Language" Locales="@codes"
                      LocaleLabels="@Endonyms" StorageKey="lily-locale"
                      @bind-Value="locale" />
        <span class="locale-chooser-status" aria-live="polite"
              lang="@Locales.Bcp47LocaleTag(locale)">@Endonyms[locale]</span>
        <ThemeChooser Label="Theme" ThemesUrl="/assets/themes/"
                     Themes="@themes" StorageKey="lily-theme" />
    </nav>
</header>
```

The two helpers are designed to sit together: same markup shape, same
class-hook convention, matching monochrome glyphs.

## Test the applied lang and dir

The component writes through `IJSRuntime`, so assert on the interop
call rather than on a real DOM:

```csharp
[Fact]
public async Task Applies_Rtl_For_Arabic()
{
    var script = LocaleChooser.BuildApplyScript("ar", applyDir: true, storageKey: null);
    Assert.Contains("setAttribute('lang',\"ar\")", script);
    Assert.Contains("setAttribute('dir',\"rtl\")", script);
}
```

`BuildApplyScript` is `internal` and exposed to the test project, which
keeps the DOM-mutation logic testable without a browser. More in
[`ssr.md`](ssr.md#tests-for-ssr).

## See also

- [`concepts.md`](concepts.md) — the mental model behind these recipes.
- [`i18n-integration.md`](i18n-integration.md) — translation wiring.
- [`ssr.md`](ssr.md) — cookies, Accept-Language, FOUC.
- [`troubleshooting.md`](troubleshooting.md) — when a recipe misbehaves.

---

Lily™ and Lily Design System™ are trademarks.
