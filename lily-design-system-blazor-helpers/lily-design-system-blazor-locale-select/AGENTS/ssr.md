# SSR — LocaleSelect (Blazor)

The select runs cleanly under every Blazor 10 hosting model.
This page lists the Blazor-specific recipes; the canonical rules
live in [`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the select does on the server

Under static SSR / prerender, no `OnAfterRenderAsync` callback
fires and the select does not touch the DOM. The rendered HTML
looks like:

```html
<select class="locale-select" aria-label="Language" name="locale">
    <option class="locale-select-option" value="en" lang="en">English</option>
    …
</select>
```

If the consumer passes `Value="ar"`, the corresponding `<option>`
gets `selected` rendered server-side.

The `lang` and `dir` attributes on the document root are **not**
written on the server. Those happen on hydration unless the consumer
pre-sets them in `App.razor`.

## Why this matters

If `<html>` arrives with `lang="en"` and the client picks `ar`,
the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page.
3. Hydration runs, select's `OnAfterRenderAsync` resolves
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. Fix by pre-resolving the locale
server-side.

## Blazor Web App cookie recipe (recommended)

End-to-end code lives in
[`../examples/08_SsrCookie.razor`](../examples/08_SsrCookie.razor).
The shape:

### `Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents().AddInteractiveServerComponents();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

app.MapPost("/api/locale", async (HttpContext ctx) =>
{
    var body = await ctx.Request.ReadFromJsonAsync<LocaleBody>();
    var code = body?.Locale ?? "en";
    if (code is not ("en" or "fr" or "ar"))
        return Results.BadRequest();

    ctx.Response.Cookies.Append("locale", code, new CookieOptions
    {
        Path = "/",
        SameSite = SameSiteMode.Lax,
        MaxAge = TimeSpan.FromDays(365),
        HttpOnly = false,
    });
    return Results.NoContent();
});

app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
app.Run();

record LocaleBody(string Locale);
```

### `App.razor`

```razor
@inject IHttpContextAccessor HttpContextAccessor

@{
    var cookieLocale = HttpContextAccessor.HttpContext?
        .Request.Cookies["locale"] ?? "en";
    var langTag = LilyDesignSystem.Blazor.Helpers.Locales
        .Bcp47LocaleTag(cookieLocale);
    var dir = LilyDesignSystem.Blazor.Helpers.Locales
        .IsRtlLocale(cookieLocale) ? "rtl" : "ltr";
}

<!DOCTYPE html>
<html lang="@langTag" dir="@dir">
<head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/css/site.css" />
    <HeadOutlet />
</head>
<body>
    <CascadingValue Value="@cookieLocale" Name="InitialLocale">
        <Routes @rendermode="InteractiveServer" />
    </CascadingValue>
    <script src="_framework/blazor.web.js"></script>
</body>
</html>
```

### Layout

```razor
@inject HttpClient Http

<LocaleSelect
    Label="Language"
    Locales="@(new[] { "en", "fr", "ar" })"
    @bind-Value="locale"
    OnChange="OnLocaleChange" />

@code {
    [CascadingParameter(Name = "InitialLocale")]
    public string InitialLocale { get; set; } = "en";
    private string locale = "";

    protected override void OnInitialized() => locale = InitialLocale;

    private async Task OnLocaleChange(string code)
    {
        await Http.PostAsJsonAsync("/api/locale", new { locale = code });
    }
}
```

Result: first paint arrives with the right `lang` and `dir`. The
select hydrates without writing anything visible.

## Accept-Language strategy

If no cookie has been set yet, fall back to the request's
`Accept-Language` header:

```csharp
private static readonly string[] SUPPORTED = { "en", "fr", "ar" };

private static string PickFromAcceptLanguage(HttpRequest req)
{
    var header = req.Headers["Accept-Language"].ToString();
    if (string.IsNullOrEmpty(header)) return "en";
    foreach (var item in header.Split(','))
    {
        var tag = item.Split(';')[0].Trim().ToLowerInvariant();
        if (SUPPORTED.Contains(tag)) return tag;
        var baseTag = tag.Split('-')[0];
        if (SUPPORTED.Contains(baseTag)) return baseTag;
    }
    return "en";
}
```

Use this in `App.razor` when the `locale` cookie is missing.

## URL-prefix strategy (SEO-friendly)

For URLs like `/en/about`, `/fr/about`, use a route segment:

```razor
@page "/{Locale}/{*Rest}"
@inject NavigationManager Nav

<LocaleSelect
    Label="Language"
    Locales="@(new[] { "en", "fr", "ar" })"
    Value="@Locale"
    OnChange="Navigate" />

@code {
    [Parameter] public string Locale { get; set; } = "en";
    [Parameter] public string? Rest { get; set; }

    private void Navigate(string next)
    {
        var newUrl = Nav.Uri.Replace($"/{Locale}/", $"/{next}/");
        Nav.NavigateTo(newUrl);
    }
}
```

Drive `<html lang dir>` from `Locale` in `App.razor` the same way
as the cookie strategy.

## Blazor WebAssembly (standalone)

There's no server to read a cookie before render in standalone
WebAssembly. The select hydrates from `localStorage` like a SPA,
which means a one-frame flash on first paint.

For flicker-free WASM, set the `lang` / `dir` attributes in an
inline `<script>` in `wwwroot/index.html`:

```html
<script>
    (function() {
        try {
            var stored = localStorage.getItem("app-locale") || "en";
            var tag = stored.replace(/_/g, "-");
            document.documentElement.setAttribute("lang", tag);
            // Cheap RTL detection: starts with any of these prefixes.
            if (/^(ar|he|fa|ur|ps|sd|ug)/.test(stored)) {
                document.documentElement.setAttribute("dir", "rtl");
            }
        } catch (e) {}
    })();
</script>
```

The select's first `OnAfterRenderAsync` is then a no-op because
the markup already shows the right locale.

## Hydration considerations

Blazor's prerender + interactivity hydration is forgiving. The
select stays consistent because:

- Its markup is a pure function of parameters.
- Parameters that affect markup (`Value`, `Locales`, `Label`) are
  deterministic; they don't depend on `document.*`, `window.*`, or
  `localStorage`.
- DOM mutations only happen after hydration.

The two cases that produce noticeable drift:

1. Server rendered `Value=""`, client `OnAfterRenderAsync`
   resolved `Value="ar"` from `localStorage`. The first paint is
   English; the next render frame is Arabic. Pre-seed `Value` on
   the server.
2. Consumer passes `Value="@SomeAsyncResolvedValue"` that differs
   between SSR and the first interactive render. Ensure
   determinism.

## CultureInfo switching

The select doesn't set `CultureInfo` automatically. Wire `OnChange`
if you need it:

```csharp
private void OnLocaleChange(string code)
{
    var ci = new CultureInfo(Locales.Bcp47LocaleTag(code));
    CultureInfo.DefaultThreadCurrentCulture = ci;
    CultureInfo.DefaultThreadCurrentUICulture = ci;
}
```

For Blazor WebAssembly culture switching, see
[Microsoft Learn — ASP.NET Core Blazor globalization and localization](https://learn.microsoft.com/aspnet/core/blazor/globalization-localization).
WebAssembly may need an extra rebuild to load satellite assemblies
for `IStringLocalizer<T>` resource lookups.

## Static SSR support

For a fully-static SSR-only page (no `@rendermode` directive on
either `Routes` or the page itself), `OnAfterRenderAsync` never
fires. The select renders markup but cannot mutate the DOM. Use
the cookie strategy above; the select is purely presentational
under static SSR.
