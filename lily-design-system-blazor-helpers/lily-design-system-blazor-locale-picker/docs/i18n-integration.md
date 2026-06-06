# i18n integration

`LocalePicker` is intentionally not an i18n library. It changes the
document language and tells you when the user changed it; the
actual string substitution is your i18n library's job.

This page shows how to wire the picker to the three most common
.NET i18n stacks: **`Microsoft.Extensions.Localization`** (the
`IStringLocalizer<T>` interface), **ResX files**, and **custom
`CultureInfo` switching**.

The wiring pattern is always the same:

1. Bind `Value` to your locale state.
2. In `OnChange`, set `CultureInfo.DefaultThreadCurrentCulture`
   and `CultureInfo.DefaultThreadCurrentUICulture` (which
   `IStringLocalizer<T>` and ResX read).
3. (Optionally) pre-seed `Value` server-side for flicker-free SSR.

---

## `IStringLocalizer<T>` (Microsoft.Extensions.Localization)

The canonical .NET i18n stack. Resources live in
`.resx` files next to the component or in a shared
`SharedResources.cs`. `IStringLocalizer<T>` is injected into
your component and `Localizer["key"]` resolves the string for
the current `CultureInfo.CurrentUICulture`.

### `Program.cs`

```csharp
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
```

### Component using the picker

```razor
@page "/settings"
@using System.Globalization
@using LilyDesignSystem.Blazor.Helpers
@inject IStringLocalizer<SharedResources> Localizer

<LocalePicker
    Label="@Localizer["chooseLanguage"]"
    Locales="@(new[] { "en", "fr", "ar" })"
    LocaleLabels="@(new Dictionary<string, string>
    {
        ["en"] = Localizer["english"],
        ["fr"] = Localizer["french"],
        ["ar"] = Localizer["arabic"],
    })"
    @bind-Value="locale"
    StorageKey="app-locale"
    DetectFromNavigator="true"
    OnChange="OnLocaleChange" />

<p>@Localizer["greeting"]</p>

@code {
    private string locale = "";

    private void OnLocaleChange(string code)
    {
        var ci = new CultureInfo(Locales.Bcp47LocaleTag(code));
        CultureInfo.DefaultThreadCurrentCulture = ci;
        CultureInfo.DefaultThreadCurrentUICulture = ci;
        StateHasChanged();
    }
}
```

The `Localizer["greeting"]` call resolves against
`Resources/SharedResources.fr.resx` when the user picks French.

### Resource file layout

```
Resources/
├── SharedResources.cs
├── SharedResources.resx       (default — English)
├── SharedResources.fr.resx
├── SharedResources.ar.resx
└── …
```

`SharedResources.cs` is a marker class (empty, no methods).

---

## ResX files

When you don't want the indirection of `IStringLocalizer<T>` and
prefer per-component resource files:

```
Components/Pages/Settings/
├── Settings.razor
├── Settings.resx
├── Settings.fr.resx
└── Settings.ar.resx
```

In your `.resx` files you define keys like `chooseLanguage`,
`greeting`. Then in your Razor:

```razor
@inject IStringLocalizer<Settings> Loc

<LocalePicker
    Label="@Loc["chooseLanguage"]"
    Locales="@(new[] { "en", "fr", "ar" })"
    @bind-Value="locale"
    OnChange="OnChange" />
```

`IStringLocalizer<Settings>` automatically scopes lookups to
`Settings.{culture}.resx`.

---

## Custom `CultureInfo` switching

When you don't need a resource pipeline at all (small app, hand-
maintained string tables in C#):

```razor
@using System.Globalization
@using LilyDesignSystem.Blazor.Helpers

<LocalePicker
    Label="Language"
    Locales="@(new[] { "en", "fr", "ar" })"
    @bind-Value="locale"
    OnChange="OnLocaleChange" />

<p>@Greeting</p>
<p>Today: @DateTime.Now.ToString("d", CultureInfo.CurrentCulture)</p>
<p>Balance: @balance.ToString("C", CultureInfo.CurrentCulture)</p>

@code {
    private string locale = "en";
    private decimal balance = 1234.56m;

    private string Greeting => locale switch
    {
        "fr" => "Bonjour",
        "ar" => "مرحبا",
        _    => "Hello",
    };

    private void OnLocaleChange(string code)
    {
        var ci = new CultureInfo(Locales.Bcp47LocaleTag(code));
        CultureInfo.DefaultThreadCurrentCulture = ci;
        CultureInfo.DefaultThreadCurrentUICulture = ci;
    }
}
```

`DateTime.ToString("d", ci)` and `decimal.ToString("C", ci)` give
you locale-correct date and currency formatting for free.

---

## Blazor WebAssembly culture switching

Blazor WASM doesn't pre-load all satellite assemblies. To switch
to a culture that wasn't the launch one, you must request its
satellite assembly:

```csharp
private async Task SetCulture(string code)
{
    var tag = Locales.Bcp47LocaleTag(code);
    var ci = CultureInfo.GetCultureInfo(tag);

    // Load satellite assemblies for the new culture.
    if (CultureInfo.CurrentCulture.Name != tag)
    {
        await JS.InvokeVoidAsync("Blazor._internal.applyHotReload"); // placeholder
        CultureInfo.DefaultThreadCurrentCulture = ci;
        CultureInfo.DefaultThreadCurrentUICulture = ci;
    }
}
```

In practice, the official pattern is to navigate the app to a
small "culture initialiser" page that triggers a reload:

```csharp
private void SetCulture(string code)
{
    var tag = Locales.Bcp47LocaleTag(code);
    var url = Nav.GetUriWithQueryParameter("culture", tag);
    Nav.NavigateTo(url, forceLoad: true);
}
```

Then in `Program.cs` of the WASM app:

```csharp
var culture = await js.InvokeAsync<string>("eval",
    "new URL(window.location).searchParams.get('culture') ?? 'en'");
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo(culture);
CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo(culture);
```

This trade-off (full reload to switch culture) is documented in
[Microsoft Learn — Blazor globalization and localization](https://learn.microsoft.com/aspnet/core/blazor/globalization-localization).

---

## Cookie-based persistence (Blazor Server / Web App)

`localStorage` persistence flickers on first paint because the
server renders the default locale before the client reads
storage. Prefer a cookie when you have a server:

```csharp
// Program.cs
builder.Services.AddHttpContextAccessor();

app.MapPost("/api/locale", async (HttpContext ctx) =>
{
    var body = await ctx.Request.ReadFromJsonAsync<LocaleBody>();
    ctx.Response.Cookies.Append("locale", body?.Locale ?? "en", new CookieOptions
    {
        Path = "/",
        SameSite = SameSiteMode.Lax,
        MaxAge = TimeSpan.FromDays(365),
    });
    return Results.NoContent();
});

record LocaleBody(string Locale);
```

```razor
@* App.razor *@
@inject IHttpContextAccessor HttpContextAccessor

@{
    var cookieLocale = HttpContextAccessor.HttpContext?
        .Request.Cookies["locale"] ?? "en";
    var ci = new CultureInfo(Locales.Bcp47LocaleTag(cookieLocale));
    CultureInfo.DefaultThreadCurrentCulture = ci;
    CultureInfo.DefaultThreadCurrentUICulture = ci;
}
<html lang="@Locales.Bcp47LocaleTag(cookieLocale)"
      dir="@(Locales.IsRtlLocale(cookieLocale) ? "rtl" : "ltr")">
    …
</html>
```

The page arrives with the correct `lang` and `dir`, and
`IStringLocalizer<T>` already resolves the right resource set
because `CultureInfo.CurrentUICulture` is set before any component
renders.

---

## Third-party i18n libraries

The picker doesn't depend on any third-party library. If you use
one of these, wire its locale setter in `OnChange`:

| Library                  | Setter                                              |
| ------------------------ | --------------------------------------------------- |
| `Microsoft.Extensions.Localization` | `CultureInfo.DefaultThreadCurrentCulture` + `…UICulture` |
| Karambolo.PO             | `POLocalizer.SetCulture(ci)`                        |
| OrchardCore.Localization | `ICultureManager.SetCurrentCulture`                 |
| BlazorIntl               | binding to its `LocaleService.Current` ref          |

The picker's `OnChange` callback fires after the apply lands, so
synchronous library calls are safe.

---

## Picking the right strategy

| Need                                       | Strategy                  |
| ------------------------------------------ | ------------------------- |
| One small SPA, English + French only       | Custom `CultureInfo`      |
| Resource-file-based, per-component         | ResX                      |
| Shared resources across the app            | `IStringLocalizer<T>` + `SharedResources` |
| SEO-friendly URLs per locale               | URL prefix + Blazor Web App routing       |
| No FOUC, cookie-backed, server-rendered    | Cookie + `App.razor`      |

The picker is the same in every case. Only the `@bind-Value`
target and the `OnChange` body change.
