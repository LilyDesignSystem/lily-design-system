# Internationalisation principles (shared)

Adapted from the repo-root
[`AGENTS/internationalization.md`](../../../AGENTS/internationalization.md)
for the Blazor helpers catalog. Every helper in this catalog follows
these rules without exception.

- No hardcoded user-facing strings inside components. Every label,
  description, placeholder, error message, action verb, and
  announcement is a parameter or `RenderFragment` supplied by the
  consumer.
- Naming conventions for text-bearing parameters are stable across
  helpers and frameworks: `Label`, `Description`, `Placeholder`,
  `Error`, `HelpText`, `DismissLabel`, `LoadingLabel`,
  `ConfirmLabel`, `CancelLabel`. New helpers reuse these names
  rather than inventing synonyms.
- Helpers that render dates, numbers, currencies, or measurements
  take the locale-relevant identifier (`CurrencyCode`, `Locale`,
  etc.) as a parameter and either pass it through to `CultureInfo`
  / `Intl.*` formatters or expose it via a `data-*` attribute so
  consumers can format. Helpers do not pick a default locale.
- Helpers that mark a region for screen-reader announcement
  (`Notification`, `Toast`, `Alert`, `SuperBanner`) accept the
  announced text and ARIA labels as parameters; the role /
  `aria-live` / `aria-atomic` attributes are baked in but the
  content is always consumer-supplied.
- Anchors and links never embed default visible text. The content
  comes from a `ChildContent` `RenderFragment` or, for icon-only
  links, an explicit `Label` parameter that drives `aria-label`.
- Plural forms, gendered phrasing, and conditional copy are the
  consumer's concern. Helpers do not embed
  `count != 1 ? "items" : "item"` logic; they accept the rendered
  string.
- Right-to-left and bidirectional text are inherited from the
  consumer's `dir` attribute and CSS — helpers do not assume LTR
  layout in their structural HTML. The `locale-chooser` helper goes
  one step further: it auto-detects the script direction and writes
  `dir="rtl"` / `dir="ltr"` to the document root on every change.

## Blazor-specific notes

### Wiring `Microsoft.Extensions.Localization`

The helpers don't depend on `IStringLocalizer<T>`, ResX, or any
other library. They expose:

- A bindable `Value` via `@bind-Value` so the consumer's locale
  store can both feed and receive the current selection.
- An `OnChange` `EventCallback<string>` so the consumer can run
  side effects (load message bundles, refetch locale-dependent
  data, navigate to a localised URL, set
  `CultureInfo.DefaultThreadCurrentCulture`).

The locale-chooser also writes `<html lang>` and `<html dir>`, which
many i18n libraries read on initialisation; that integration usually
needs no extra wiring.

### `IStringLocalizer<T>` wiring example

```razor
@inject IStringLocalizer<SharedResources> Localizer

<LocaleChooser
    Label="@Localizer["chooseLanguage"]"
    Locales="@(new[]{ "en", "fr", "ar" })"
    @bind-Value="locale"
    LocaleLabels="@(new Dictionary<string, string>
    {
        ["en"] = Localizer["english"],
        ["fr"] = Localizer["french"],
        ["ar"] = Localizer["arabic"],
    })"
    OnChange="OnLocaleChange" />

@code {
    private string locale = "";
    private async Task OnLocaleChange(string code)
    {
        var ci = new CultureInfo(Locales.Bcp47LocaleTag(code));
        CultureInfo.DefaultThreadCurrentCulture = ci;
        CultureInfo.DefaultThreadCurrentUICulture = ci;
        await Task.CompletedTask;
    }
}
```

The `Localizer["…"]` calls feed the select localised labels; the
select emits no English (or any other) hardcoded strings.

### ResX integration

Microsoft's recommended pattern for ASP.NET Core Blazor localisation
is the per-component `.resx` file. For example, `MyComponent.resx`,
`MyComponent.fr.resx`, `MyComponent.ar.resx` next to
`MyComponent.razor`. The helpers don't add anything to this story —
they're consumed by your component, and your component's
`IStringLocalizer<MyComponent>` injects translated strings into the
select's parameters.

### `IDataAnnotationsLocalizationProvider`

When using `EditForm` / `DataAnnotationsValidator`, validation
messages are localised by `IDataAnnotationsLocalizationProvider`.
The helpers don't participate in validation — they're presentation,
not form controls — so this story doesn't apply.

### `CultureInfo` and the locale select

The locale select's `OnChange` is the right hook for switching the
CLR culture so `IStringLocalizer<T>` resolves the right resource
set:

```csharp
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo(tag);
CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo(tag);
```

For Blazor WebAssembly culture switching, see
[Microsoft Learn — ASP.NET Core Blazor globalization and localization](https://learn.microsoft.com/aspnet/core/blazor/globalization-localization).

### `Intl` equivalents in .NET

| Need                  | .NET equivalent                                                    |
| --------------------- | ------------------------------------------------------------------ |
| `Intl.DateTimeFormat` | `DateTime.ToString(format, CultureInfo)` / `IFormatProvider`       |
| `Intl.NumberFormat`   | `decimal.ToString("N2", CultureInfo)` / `IFormatProvider`          |
| `Intl.DisplayNames`   | `CultureInfo.GetCultureInfo(tag).DisplayName`                       |
| `Intl.RelativeTimeFormat` | No direct equivalent; use a NuGet package (e.g. `Humanizer`)    |
| `Intl.PluralRules`    | `Humanizer.ToWords`, or `IStringLocalizer<T>` with `.resx` plurals |

The locale-chooser's `Locales.LocaleName(code)` consults a built-in
table; for richer names use `CultureInfo.GetCultureInfo(tag).DisplayName`
from the consumer's code.

### Locale negotiation

The locale select implements a simple two-step exact-then-prefix
matcher in `Locales.MatchNavigatorLanguage`. It does not implement
RFC 4647 best-fit lookup. If you need full RFC 4647 matching, run
your own resolver and pass the result as `Value`.

### `Accept-Language`

The catalog has no `Accept-Language` parsing helper. Blazor servers
read it via `HttpContext.Request.Headers["Accept-Language"]`; see
the locale-chooser's `docs/ssr.md` for the recipe.

### What "i18n-clean" looks like in a test

```csharp
[Fact]
public void Has_No_Hardcoded_English_In_Markup()
{
    var cut = RenderComponent<LocaleChooser>(p => p
        .Add(x => x.Label, "Langue")
        .Add(x => x.Locales, new[] { "en", "fr" }));

    Assert.Equal("Langue", cut.Find("select").GetAttribute("aria-label"));
    // The component renders no other natural-language strings of
    // its own — only the locale codes from the built-in table.
}
```

If a test ever needs to assert that an English word appears in the
markup, the helper has leaked a hardcoded string — fix the helper,
don't change the test.
