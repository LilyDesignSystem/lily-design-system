# SSR — Lily Blazor Helpers

The helpers run cleanly under every Blazor 10 hosting model:
Blazor Server, Blazor WebAssembly, Blazor Web App (interactive +
prerendered), and the new static SSR (server-rendered, no
interactivity). This page lists the rules they follow so SSR +
hydration stays consistent and provides the cookie-backed wiring
recipes.

## Rules every helper follows

1. **No DOM access during render.** Nothing touches `document.*` or
   `window.*` during `OnInitializedAsync`, `OnParametersSetAsync`,
   or the `.razor` markup itself.
2. **All interop lives in `OnAfterRenderAsync(firstRender)`.** That
   hook only runs when the component is interactive (in a Blazor
   Server circuit or after the WASM module loads). Under static
   SSR / prerender, it never fires.
3. **Initial state comes from parameters.** Each helper renders its
   markup using whatever `Value` the consumer supplied. With no
   `Value`, nothing is marked as chosen on the server: `TextSizeSelect`
   emits no `selected` `<option>`, and the listbox helpers
   (`ThemeSelect`, `LocaleSelect`) emit `aria-selected="false"` on
   every `<li role="option">` and an empty hidden input.
4. **Interop is wrapped in try/catch.** A prerender circuit can
   throw `InvalidOperationException` if it hasn't established
   interactivity yet; the helpers swallow that so the first paint
   succeeds.

## Blazor hosting models in one table

| Model                              | When `OnAfterRenderAsync(true)` fires      | Notes                                       |
| ---------------------------------- | ------------------------------------------ | ------------------------------------------- |
| **Blazor Server**                  | After SignalR circuit established          | Single hop for every JS interop call.       |
| **Blazor WebAssembly (standalone)**| After WASM module loads                    | Synchronous JS interop available.           |
| **Blazor WebAssembly (hosted)**    | After WASM module loads                    | Same as standalone for component code.      |
| **Blazor Web App (interactive Server)** | After interactive render-mode activation | Static prerender first, then circuit.       |
| **Blazor Web App (interactive WebAssembly)** | After WASM module loads             | Static prerender first, then WASM.          |
| **Blazor Web App (Auto)**          | After WASM module loads (or circuit if WASM not cached) | Helper code is identical.   |
| **Blazor Web App (static SSR)**    | **Never** (no interactivity)               | Markup arrives, no DOM mutations happen.    |

The helpers' markup is identical across all models because the only
difference is *when* the post-render hook fires.

## Static SSR (no interactivity)

Under fully-static SSR, `OnAfterRenderAsync` never fires and no JS
interop is possible. Each helper:

- Renders its full markup with whatever `Value` the consumer supplied
  (a server-resolved cookie value is the common pattern). For
  `TextSizeSelect` that is the `<select>` and its `<option>` children;
  for the listbox helpers it is the root `<div>`, the hidden input, the
  icon button, and the closed `<ul role="listbox" hidden>` with its
  options.
- Does **not** write `<link>` / `data-theme` / `lang` / `dir` — the
  consumer is responsible for those on the server side.

This means static SSR is supported, but the consumer has to
pre-resolve the user-preference state and emit the right `<html>`
attributes themselves. The helpers don't break; they just don't
mutate the DOM when there's no DOM to mutate.

One shape difference matters here. A static-SSR `TextSizeSelect` is
still a working native control: the browser will open it and, inside a
`<form>`, post the chosen value without any JavaScript. The listbox
helpers are not — opening the listbox, moving the active option, and
selecting are all component-implemented, so with no interactivity they
render as an inert button and a hidden list. The hidden input still
posts the server-supplied `Value`, but the user cannot change it until
the component becomes interactive. Under Blazor Web App "auto" or
"interactive" render modes this is a non-issue; under genuinely static
SSR, plan for a no-JS fallback (a plain `<form>` posting to an
endpoint) if theme and locale switching must work without
interactivity.

## Cookie + interactive recipe (Blazor Web App)

For an interactive Blazor Web App, the easiest cookie strategy:

### `Program.cs` (server)

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents().AddInteractiveServerComponents();
var app = builder.Build();
app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
app.Run();
```

### A server endpoint to write the cookie

```csharp
app.MapPost("/api/theme", async (HttpContext ctx) =>
{
    var body = await ctx.Request.ReadFromJsonAsync<ThemeBody>();
    var slug = body?.Theme ?? "light";
    if (slug is not ("light" or "dark" or "abyss"))
        return Results.BadRequest();

    ctx.Response.Cookies.Append("theme", slug, new CookieOptions
    {
        Path = "/",
        SameSite = SameSiteMode.Lax,
        MaxAge = TimeSpan.FromDays(365),
        HttpOnly = false,
    });
    return Results.NoContent();
});

record ThemeBody(string Theme);
```

### A `_Host.cshtml` (or `App.razor`) that reads the cookie server-side

```cshtml
@inject IHttpContextAccessor HttpContextAccessor
@{
    var cookieTheme = HttpContextAccessor.HttpContext?
        .Request.Cookies["theme"] ?? "light";
}
<html lang="en" data-theme="@cookieTheme">
    <head>
        <link rel="stylesheet" href="@($"/assets/themes/{cookieTheme}.css")" />
    </head>
    <body>
        <Routes @rendermode="InteractiveServer" InitialTheme="@cookieTheme" />
    </body>
</html>
```

### Wiring the select

```razor
@inject NavigationManager Nav

<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[]{ "light", "dark", "abyss" })"
    @bind-Value="theme"
    StorageKey="lily-theme"
    OnChange="OnThemeChange" />

@code {
    [Parameter] public string InitialTheme { get; set; } = "light";
    private string theme = "";

    protected override void OnInitialized()
    {
        theme = InitialTheme;
    }

    private async Task OnThemeChange(string slug)
    {
        await using var client = new HttpClient { BaseAddress = new Uri(Nav.BaseUri) };
        await client.PostAsJsonAsync("/api/theme", new { theme = slug });
    }
}
```

Result: the first paint arrives with `<html data-theme="dark">` and
the right `<link>`. The select hydrates with `Value="dark"` so no
attribute swap happens; subsequent picks call the endpoint, which
writes the cookie so the next request paints with the new theme.

## Locale cookie recipe

Same shape; substitute `lang` and `dir`:

```cshtml
@inject IHttpContextAccessor HttpContextAccessor
@{
    var cookieLocale = HttpContextAccessor.HttpContext?
        .Request.Cookies["locale"] ?? "en";
    var dir = LocaleSelectDirection(cookieLocale);
}
<html lang="@cookieLocale" dir="@dir">
    <head>…</head>
    <body>
        <Routes @rendermode="InteractiveServer" InitialLocale="@cookieLocale" />
    </body>
</html>
```

Where `LocaleSelectDirection` can call the public helper
`Locales.IsRtlLocale(code)` from `lily-design-system-blazor-locale-select`.

```csharp
private static string LocaleSelectDirection(string code) =>
    LilyDesignSystem.Blazor.Helpers.Locales.IsRtlLocale(code) ? "rtl" : "ltr";
```

## CultureInfo and the locale select

For a Blazor app that also switches CLR culture (so
`Microsoft.Extensions.Localization` and `IStringLocalizer<T>` resolve
the right resource set), wire the select's `OnChange` to set
`CultureInfo.DefaultThreadCurrentCulture`:

```razor
<LocaleSelect
    Label="Language"
    Locales="@(new[]{ "en", "fr", "ar" })"
    @bind-Value="locale"
    OnChange="OnLocaleChange" />

@code {
    private string locale = "en";
    private async Task OnLocaleChange(string code)
    {
        var ci = new System.Globalization.CultureInfo(
            LilyDesignSystem.Blazor.Helpers.Locales.Bcp47LocaleTag(code));
        System.Globalization.CultureInfo.DefaultThreadCurrentCulture = ci;
        System.Globalization.CultureInfo.DefaultThreadCurrentUICulture = ci;
        // Optionally trigger a server-side cookie write here.
        await Task.CompletedTask;
    }
}
```

For Blazor WebAssembly culture switching, see
[Microsoft Learn — ASP.NET Core Blazor globalization and localization](https://learn.microsoft.com/aspnet/core/blazor/globalization-localization).

## Hydration warnings

Blazor's prerender + interactivity hydration is forgiving: as long
as the markup the server emitted matches what the client renders
on first interactive pass, there are no warnings. The helpers stay
consistent because:

- Their markup is a pure function of parameters.
- Parameters that affect markup (`Value`, `Themes`, `Locales`,
  `Label`) are deterministic; they don't depend on `document.*`,
  `window.*`, or `localStorage`.
- DOM mutations only happen *after* hydration, so they don't
  conflict with the SSR DOM.

## Static SSR without a cookie

If you don't want to deal with cookies and accept a one-frame
flash, the select still works under static SSR — the user gets the
default theme on first paint, and the moment they interact (which
implicitly triggers interactivity in Blazor Web App "auto" mode),
the select's `OnAfterRenderAsync` fires and the theme switches.

The flash is small but visible. Cookies are the right answer for
production.

## What the helpers don't try to solve

- **Per-tenant theme defaults from the server.** Pass them via
  a render-mode parameter (`InitialTheme`) instead.
- **Server-Sent-Events sync across tabs.** Use the `storage` event
  on `localStorage` writes (client-side); see
  [Microsoft Learn — JavaScript interop with Blazor](https://learn.microsoft.com/aspnet/core/blazor/javascript-interoperability/).
- **OIDC-claim-based personalisation.** That belongs in the
  consumer's authentication pipeline; the select still works on
  top.

## Diagnostics

If the helpers don't seem to apply their changes:

1. Check the browser console for the `eval` call. The helpers log
   nothing themselves but their interop appears as a single
   `eval(…)` evaluation in DevTools.
2. Confirm the component is actually rendered with an interactive
   render-mode. Static-rendered components don't get
   `OnAfterRenderAsync(true)`.
3. Confirm `IJSRuntime` is injected. A `null` injection means the
   service is missing from DI — add `builder.Services.AddRazorComponents()`
   in `Program.cs`.
