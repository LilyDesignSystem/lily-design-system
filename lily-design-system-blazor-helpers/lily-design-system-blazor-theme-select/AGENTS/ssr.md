# SSR — ThemeSelect (Blazor)

The select runs cleanly under every Blazor 10 hosting model.
This page lists the Blazor-specific recipes; the canonical rules
live in [`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the select does on the server

Under static SSR / prerender, no `OnAfterRenderAsync` callback fires
and the select does not touch the DOM. The rendered HTML looks like:

```html
<div class="theme-select">
    <input type="hidden" name="theme" value="light" />
    <button type="button" class="theme-select-button" aria-label="Theme"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="theme-select-1-list">
        <span class="theme-select-icon" aria-hidden="true">◑</span>
    </button>
    <ul class="theme-select-list" id="theme-select-1-list" role="listbox"
        aria-label="Theme" tabindex="-1" hidden>
        <li class="theme-select-option" id="theme-select-1-option-0"
            role="option" aria-selected="true">Light</li>
        …
    </ul>
</div>
```

The listbox arrives closed: `hidden` on the `<ul>`,
`aria-expanded="false"` on the button, and no
`aria-activedescendant`. The selection is visible server-side in
three places — the hidden input's `value`, `aria-selected="true"` on
the matching option, and (once the consumer pre-seeds it)
`data-theme` on the document root.

Ids come from a monotonic process-wide counter, so they are stable
across the SSR / interactive boundary within a render.

The managed `<link>` is **not** created on the server. `data-theme`
is **not** written to `<html>` on the server. Those happen on
hydration (when the interactive render mode activates).

## Why this matters

If `<html>` arrives with no `data-theme` and the theme CSS
references `:root[data-theme="dark"] { … }`, the first paint shows
the default browser styles, then on hydration the select sets
`data-theme="dark"` and the page repaints. That's the flash of
unstyled theme (FOUT).

Fix: resolve the theme on the server and inline both
`<html data-theme="…">` and a `<link rel="stylesheet">` for the
chosen theme so CSS is in place before any pixel is painted.

## Blazor Web App + cookie recipe

End-to-end code lives in
[`../examples/BlazorServerCookie/`](../examples/BlazorServerCookie/).
The shape:

### `Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents().AddInteractiveServerComponents();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

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

app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
app.Run();

record ThemeBody(string Theme);
```

### `Components/App.razor`

```razor
@inject IHttpContextAccessor HttpContextAccessor

@{
    var cookieTheme = HttpContextAccessor.HttpContext?
        .Request.Cookies["theme"] ?? "light";
}

<!DOCTYPE html>
<html lang="en" data-theme="@cookieTheme">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <link rel="stylesheet" href="@($"/assets/themes/{cookieTheme}.css")" />
    <HeadOutlet />
</head>
<body>
    <Routes InitialTheme="@cookieTheme" @rendermode="InteractiveServer" />
    <script src="_framework/blazor.web.js"></script>
</body>
</html>
```

### Component using the select

```razor
@page "/settings"
@using LilyDesignSystem.Blazor.Helpers

<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[]{ "light", "dark", "abyss" })"
    @bind-Value="theme"
    StorageKey="lily-theme"
    OnChange="OnThemeChange" />

@code {
    [CascadingParameter] public string InitialTheme { get; set; } = "light";
    private string theme = "";
    [Inject] private HttpClient Http { get; set; } = default!;

    protected override void OnInitialized()
    {
        theme = InitialTheme;
    }

    private async Task OnThemeChange(string slug)
    {
        await Http.PostAsJsonAsync("/api/theme", new { theme = slug });
    }
}
```

Result: the first paint arrives with `<html data-theme="dark">` and
the right `<link>`. The select hydrates with `Value="dark"` so no
attribute swap happens. When the user picks a new theme, the
endpoint writes the cookie so the next request paints with the new
theme.

## Blazor WebAssembly (standalone)

There's no server to read a cookie before render in standalone
WebAssembly. The select hydrates from `localStorage` like a SPA,
which means a one-frame flash of the default theme on first paint.

```razor
<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[]{ "light", "dark", "abyss" })"
    @bind-Value="theme"
    StorageKey="lily-theme" />

@code {
    private string theme = "";
}
```

For a flicker-free experience in standalone WebAssembly, set the
default theme via a small inline script in `wwwroot/index.html`:

```html
<head>
    …
    <script>
        (function() {
            try {
                var stored = localStorage.getItem("lily-theme") || "light";
                document.documentElement.setAttribute("data-theme", stored);
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "/assets/themes/" + stored + ".css";
                link.setAttribute("data-lily-theme-select", "theme");
                document.head.appendChild(link);
            } catch (e) {}
        })();
    </script>
</head>
```

The select's first `OnAfterRenderAsync` is then a no-op because
the markup already shows the right theme.

## Blazor Web App "Auto" render mode

In Auto mode, the first request renders server-side via the SignalR
circuit; subsequent navigations use WASM once the bundle is cached.
The select works in both modes — the server-side cookie strategy
above covers the first paint regardless of which mode the user ends
up in.

## Hydration considerations

Blazor's prerender + interactivity hydration compares the SSR DOM to
the interactive render. As long as the markup the server emitted
matches what the client renders on the first interactive pass, there
are no warnings.

The select stays consistent because:

- Its markup is a pure function of parameters.
- Parameters that affect markup (`Value`, `Themes`, `Label`) are
  deterministic; they don't depend on `document.*`, `window.*`, or
  `localStorage`.
- DOM mutations only happen *after* hydration, so they don't
  conflict with the SSR DOM.

The two cases that produce warnings:

1. The server rendered `Value=""` (no option `aria-selected`, empty
   hidden input), but the client `OnAfterRenderAsync` resolved
   `Value="dark"` from `localStorage`. The first paint sees no
   selection; the next render frame sees one. Pre-seed `Value`
   server-side to fix.
2. The consumer passes `Value="@SomeAsyncResolvedValue"` whose
   result differs between SSR and the first interactive render.
   Ensure the source is deterministic across the boundary.

## Plain Blazor Server (legacy)

For a classic Blazor Server app without the Web App template, read
the cookie in `_Host.cshtml`:

```cshtml
@page "/"
@namespace MyApp.Pages
@using LilyDesignSystem.Blazor.Helpers
@inject IHttpContextAccessor HttpContextAccessor

@{
    var cookieTheme = HttpContextAccessor.HttpContext?
        .Request.Cookies["theme"] ?? "light";
    Layout = null;
}

<!DOCTYPE html>
<html lang="en" data-theme="@cookieTheme">
    <head>
        <link rel="stylesheet" href="@($"/assets/themes/{cookieTheme}.css")" />
    </head>
    <body>
        <component type="typeof(App)"
                   render-mode="ServerPrerendered"
                   param-InitialTheme="@cookieTheme" />
        <script src="_framework/blazor.server.js"></script>
    </body>
</html>
```

The same `OnInitialized → theme = InitialTheme` pattern from the
Web App example applies.

## Plain Blazor WebAssembly (legacy)

There is no server-render step. The inline `<script>` approach in
`wwwroot/index.html` is the cleanest way to avoid the flash.

## Hosted WebAssembly

The same cookie strategy as Blazor Server can apply when there's a
hosting server: read the cookie in `wwwroot/index.html` server-side
via Razor (`@`), or via an `Index.cshtml` Razor Page that emits
WASM bootstrapping.

## Diagnostics

If the helpers don't seem to apply their changes:

1. Check the browser console for the `eval` call. The helpers log
   nothing themselves but their interop appears as a single
   `eval(…)` evaluation in DevTools.
2. Confirm the component is actually rendered with an interactive
   render-mode. Static-rendered components don't get
   `OnAfterRenderAsync(true)`.
3. Confirm `IJSRuntime` is injected. A `null` injection means the
   service is missing from DI.
4. In Blazor Server, confirm the SignalR connection is established
   (no red banner in DevTools). The select's first interop call
   waits for the circuit.
