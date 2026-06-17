# SSR — Server-side rendering, cookies, and Accept-Language

The select compiles cleanly under every Blazor 10 hosting model
but renders nothing locale-specific on the server unless the
consumer pre-resolves the locale. This page covers the four
resolution strategies, ordered by quality.

## TL;DR

| Strategy                | Flash of default locale?  | Survives reload?      | SEO-friendly? |
| ----------------------- | ------------------------- | --------------------- | ------------- |
| `DetectFromNavigator`   | yes (until interactive)   | only if `StorageKey`  | no            |
| `localStorage`          | yes (until interactive)   | yes                   | no            |
| Cookie + `App.razor`    | **no**                    | yes                   | no            |
| URL prefix (`/fr/about`)| **no**                    | yes                   | **yes**       |

Use the **cookie** strategy unless you need SEO-distinct pages per
locale; then use **URL prefix**.

---

## Why SSR matters here

Blazor's static SSR / prerender pipeline emits HTML on the server
before any client-side code runs. If your `<html>` arrives with
`lang="en"` and the client picks `ar`, the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page (FOUC-style flash).
3. Hydration runs, `LocaleSelect`'s `OnAfterRenderAsync` reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. The select can't avoid it on its
own because `localStorage` and `navigator.languages` aren't
accessible server-side. The consumer fixes it by pre-resolving the
locale on the server and seeding `Value`.

---

## Strategy 1: Cookie + `App.razor` (recommended)

`IHttpContextAccessor` reads the request cookie during the
server-side render. Combined with `<html lang dir>` in
`App.razor`, it delivers a flicker-free first paint.

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
@using LilyDesignSystem.Blazor.Helpers

@{
    var cookieLocale = HttpContextAccessor.HttpContext?
        .Request.Cookies["locale"] ?? "en";
    var lang = Locales.Bcp47LocaleTag(cookieLocale);
    var dir = Locales.IsRtlLocale(cookieLocale) ? "rtl" : "ltr";
}

<!DOCTYPE html>
<html lang="@lang" dir="@dir">
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

### Page using the select

```razor
@page "/settings"
@using LilyDesignSystem.Blazor.Helpers
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

Result:

- First paint: `<html lang="fr" dir="ltr">` arrives in the HTML
  response. No flash, no layout shift.
- Select hydrates already showing the right option selected because
  `InitialLocale` was hydrated from the cookie.
- User picks `ar`. The endpoint writes the cookie. The select
  writes `<html lang="ar" dir="rtl">`. Next request re-paints the
  page in Arabic from the very first byte.

---

## Strategy 2: Accept-Language fallback

When no cookie is set yet, derive the locale from the request's
`Accept-Language` header:

```razor
@inject IHttpContextAccessor HttpContextAccessor

@{
    var ctx = HttpContextAccessor.HttpContext;
    var cookieLocale = ctx?.Request.Cookies["locale"];
    var initialLocale = cookieLocale
        ?? PickFromAcceptLanguage(ctx?.Request.Headers["Accept-Language"].ToString());
}

@code {
    private static readonly string[] SUPPORTED = { "en", "fr", "ar" };

    private static string PickFromAcceptLanguage(string? header)
    {
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
}
```

The select stays unchanged; the consumer's `App.razor` just gets
smarter about the initial value.

---

## Strategy 3: URL prefix (SEO-friendly)

URLs like `/en/about` and `/fr/about` are crawlable by search
engines and shareable as locale-specific links. Define
`{Locale}/{*Rest}` routes in your `App.razor`:

```razor
@page "/{Locale}/{*Rest}"
@inject NavigationManager Nav
@using LilyDesignSystem.Blazor.Helpers

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
        var newPath = Nav.Uri
            .Replace($"/{Locale}/", $"/{next}/", StringComparison.Ordinal);
        Nav.NavigateTo(newPath, forceLoad: true);
    }
}
```

`forceLoad: true` triggers a full navigation so the new locale's
data fetches re-run from the server.

Set `<html lang dir>` in `App.razor` from `Locale` in the same way
as the cookie strategy.

---

## Strategy 4: Client-only (`localStorage` / navigator)

The fallback when there is no server (standalone Blazor
WebAssembly). The select flickers (default paints first, then the
resolved locale takes over) but everything else works.

```razor
<LocaleSelect
    Label="Language"
    Locales="@(new[] { "en", "fr", "ar" })"
    @bind-Value="locale"
    StorageKey="app-locale"
    DetectFromNavigator="true" />
```

Acceptable for:

- Blazor WebAssembly SPAs with no server-render step.
- Docs sites where the flash is invisible.
- Embedded widgets inside another app where the host owns
  `<html>`.

---

## Hydration considerations

Blazor's prerender + interactivity hydration is forgiving — there's
no Vue-style warning about DOM mismatch. The select stays
consistent because:

- `OnAfterRenderAsync` never fires during prerender, so no DOM
  writes happen server-side.
- The options' `selected` state is rendered from `Value`, which
  the consumer controls and which is identical on both sides as
  long as it's seeded from the same source (cookie / route param /
  `CascadingParameter`).

The two cases that produce observable drift:

1. The server rendered with `Value=""` (no option selected), but the
   client `OnAfterRenderAsync` resolved `Value="fr"` from
   `localStorage`. The first paint sees no selection; the next
   render frame sees one. Fix by pre-seeding `Value` on the
   server.
2. The consumer uses `Value="@SomeServerOnlyComputedValue"` whose
   result differs between prerender and the first interactive
   render. Fix by ensuring the source is serialisable across the
   boundary.

---

## Astro / OWIN / other hosts

The cookie pattern works for any host that exposes
`HttpContext.Request.Cookies`. The select doesn't care about the
host framework; only the consumer's `App.razor` (or equivalent)
needs to know.

---

## Static SSR (no interactivity)

For a fully-static SSR Blazor Web App page (no `@rendermode`
attribute on either `Routes` or the page), `OnAfterRenderAsync`
never fires. The select:

- Renders the `<select>` markup with whatever `Value` the
  consumer supplied.
- Does **not** write `lang` / `dir` to `<html>` — the consumer
  is responsible for those on the server side.
- Does **not** run JS interop (would throw under static SSR).

This means static SSR is supported, but the consumer has to
pre-resolve the locale and emit the right `<html>` attributes
themselves. The select doesn't break; it just doesn't mutate the
DOM when there's no DOM to mutate.

---

## Tests for SSR

The bUnit suite runs in a synthetic interactive context. For full
SSR coverage:

- **Compile check** — the select's source uses no
  `document.*` / `window.*` outside `OnAfterRenderAsync`, so the
  compiler enforces SSR-safety.
- **End-to-end** — write a Playwright spec that hits the page,
  inspects the raw HTML response (no JS), and checks
  `<html lang="fr" dir="ltr">` appears before `Routes` activates.
- **Snapshot** — capture the rendered HTML from
  `RenderComponent<LocaleSelect>` and assert that the right
  `<option>` has `selected` when `Value` is non-empty.

The select itself has no SSR-specific code path to test beyond
"the component compiles under static SSR and renders the selected
`<option>` for the seeded `Value`".

---

## References

- Microsoft Learn — Blazor render modes:
  <https://learn.microsoft.com/aspnet/core/blazor/components/render-modes>
- Microsoft Learn — Blazor globalization and localization:
  <https://learn.microsoft.com/aspnet/core/blazor/globalization-localization>
- MDN — `Accept-Language` header:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
- MDN — Cookies (`document.cookie`):
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies>
