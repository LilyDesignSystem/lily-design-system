# SSR and hydration

The select is SSR-safe out of the box but does not, on its own,
deliver a flicker-free first paint. This guide explains why and how
to close the gap.

## What the select does on the server

Under Blazor's static SSR / prerender, no `OnAfterRenderAsync`
callback fires and the select does not touch the DOM. The rendered
HTML looks like:

```html
<select class="theme-select" aria-label="Theme" name="theme">
    <option class="theme-select-option" value="light">Light</option>
    …
</select>
```

No option is selected unless the consumer supplied a non-empty `Value`.

## What happens on hydration

When the render mode activates (Blazor Server circuit established,
or WebAssembly module loaded), the select's `OnAfterRenderAsync`
callback runs once:

1. Resolves the initial slug per
   [spec/index.md §5.2](../spec/index.md#52-initial-value-resolution).
2. Fires `ValueChanged` (driving `@bind-Value` back to the parent).
3. Injects / sets the managed `<link>` href.
4. Sets `data-theme` on `<html>`.

If the resolved slug differs from the one that the server rendered
with, the user sees one frame of unstyled (or wrongly-themed)
content before the lifecycle hook runs. This is the "flash of
unstyled theme" (FOUT).

## How to get a flicker-free first paint

The fix is to **resolve the theme on the server** and inline both:

- `<html data-theme="<slug>">` in the document shell, and
- the `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted. The select can
then hydrate without changing anything visible.

### Blazor Web App recipe

End-to-end code lives in
[`../examples/BlazorServerCookie/`](../examples/BlazorServerCookie/).
The shape:

1. A server endpoint (`POST /api/theme`) writes a `theme` cookie.
2. `App.razor` reads `HttpContext.Request.Cookies["theme"]`
   server-side via `IHttpContextAccessor`.
3. `App.razor` writes `<html data-theme="@cookieTheme">` and the
   matching `<link>` in `<head>` so the first paint is correct.
4. The cookie value is forwarded to the select as a parameter
   (typically a cascading or constructor parameter).
5. The select mounts with `Value="<cookieTheme>"` — its
   `OnAfterRenderAsync` resolves to the same value and the apply is
   a no-op (no DOM swap is needed).

### Blazor Server (legacy `_Host.cshtml`)

```cshtml
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

### Plain Blazor WebAssembly

Without a server it's hard to get a flicker-free first paint via
cookie. Use an inline `<script>` in `wwwroot/index.html`:

```html
<head>
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

The select's first `OnAfterRenderAsync` is then a no-op because the
markup already shows the right theme.

## Why we don't auto-resolve from the cookie

The select has no opinion about transport (cookie? header?
IndexedDB? URL parameter?). Cookies are the right answer for a
Blazor Server / Web App, but not for standalone WebAssembly, embedded
contexts, or apps that already have a server-side preference store.
The select stays transport-agnostic and lets the consumer wire the
integration.

## Blazor Web App render-mode tips

- Use `@rendermode="InteractiveServer"` on the routes that need the
  select. Static-rendered routes won't run
  `OnAfterRenderAsync(firstRender:true)`.
- For `InteractiveAuto`, the select behaves the same way; it's the
  framework that decides Server vs WebAssembly.
- For `InteractiveWebAssembly`, the cookie approach still works
  because cookies are sent on every request the WASM bundle makes.
- The select doesn't care about the render mode of its surrounding
  components; it just needs to run interactively itself.

## What `OnInitializedAsync` vs `OnAfterRenderAsync` means here

- `OnInitializedAsync` runs during prerender. The select doesn't
  use it because `IJSRuntime` isn't available there.
- `OnParametersSetAsync` runs every time parameters change.
  Same problem.
- `OnAfterRenderAsync(firstRender:true)` only runs once
  interactivity is established. The select waits for this.

If a consumer needs to resolve a value during prerender (for SEO,
meta tags, etc.), they pass it as `Value` from outside. The select
itself never reaches `IJSRuntime` until interactive.

## Hydration mismatch warnings

Blazor's interactive hydration is forgiving — there's no Vue-style
warning about DOM mismatch. The select stays consistent because:

- Its markup is a pure function of parameters.
- DOM mutations only happen *after* hydration, so they don't
  conflict with the prerender DOM.

The two cases that produce noticeable behaviour drift:

1. Server rendered `Value=""` (no option selected), client
   `OnAfterRenderAsync` resolved `Value="dark"` from
   `localStorage`. The first paint sees no selection; the
   subsequent render frame sees one. Pre-seed `Value` server-side
   to avoid.
2. Consumer passes `Value="@SomeAsyncResolvedValue"` whose result
   differs between prerender and the first interactive render.
   Ensure the source is deterministic across the boundary.

## Static SSR support (no interactivity at all)

For a fully-static SSR-only Blazor Web App page (no interactive
render mode), `OnAfterRenderAsync` never fires. The select:

- Renders its `<select>` markup with the server-supplied `Value`.
- Does not mutate the DOM (there is no DOM yet — just an HTML
  response).
- Does not run `IJSRuntime` calls (would throw under static SSR).

The consumer is responsible for emitting `<html data-theme="…">`
and the right `<link>` on the server. The select is purely
presentational under static SSR.

## Testing SSR

The bUnit suite runs in a synthetic interactive context, so it
doesn't directly exercise the static-SSR path. To test:

- **Markup determinism**: assert that
  `RenderComponent<ThemeSelect>(...)` produces the expected
  `<select>` for a given `Value` parameter. The same markup is
  what static SSR would emit.
- **No-throw on first render**: catch any exception during the
  first synchronous render. The select's `[Inject] IJSRuntime JS`
  is loaded lazily — it's not touched until
  `OnAfterRenderAsync(true)`.
- **Integration tests**: run a real Blazor Web App with the select
  on a static-render page and check the HTTP response body for the
  expected `<select>` markup.
