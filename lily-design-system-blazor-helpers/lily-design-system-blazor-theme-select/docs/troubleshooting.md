# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "CSS does not switch when I pick a new theme"

**Likely cause.** Your theme CSS files declare rules under `:root`
without scoping them to a `[data-theme="<slug>"]` selector. The
first-loaded theme then sets values that the next-loaded theme
cannot unset.

**Fix.** Scope every rule in every theme to
`:where(:root, :root[data-theme="<slug>"])`. The Lily™ themes
follow this convention.

## "404 on the theme href"

**Likely cause.** `ThemesUrl + slug + Extension` does not resolve
to a real file. Check that:

- The themes directory is actually served by your static asset
  pipeline (typically `wwwroot/assets/themes/` for a Blazor app).
- `Extension` matches the file extension (`.css`, `.module.css`,
  etc).
- The slug case matches the file name (case-sensitive on most
  servers).

## "OnAfterRenderAsync never fires"

**Likely cause.** The component hosting the select uses a static
(non-interactive) render mode. The select's lifecycle work runs
only after the component becomes interactive.

**Fix.** Add `@rendermode="InteractiveServer"` (or
`InteractiveWebAssembly` / `InteractiveAuto`) to the page or the
root `<Routes>` element in `App.razor`.

## "Prerender shows the wrong theme for one frame"

**Likely cause.** The select rendered server-side with no `Value`,
then on hydration its lifecycle hook resolved `Value="dark"` from
`localStorage` and switched the theme. The result is a visible flash.
(The `<select>` itself never shows the theme — it always shows the
placeholder — so the flash is in the page's theme CSS, not the
control.)

**Fix.** Resolve the theme on the server (cookie, header, session
store) and pass it to the select via `Value`. See [ssr.md](./ssr.md).

## "Theme does not persist across reloads"

Checklist:

- `StorageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.
- The select is interactive (not statically rendered).

## "The word 'default' appears in my select"

It does not come from this component. The select only emits the
slug (title-cased) or the value from `ThemeLabels`. Check the
consumer markup wrapping the select for hardcoded "(default)"
annotations.

## "Multiple selects fight over `<html data-theme>`"

When two selects share `document.documentElement` as the target,
the last apply wins. The helper writes to `<html>` regardless of
`Name`, so all instances target the same root attribute.

**Fix.** Designate one select as the "global" one. For region-
scoped theming, use a wrapper with `data-theme="…"` (set via
`OnChange`) and scope your theme CSS to that wrapper instead of
`:root`.

## "The select re-fetches the same CSS file on every render"

It shouldn't — the managed `<link>` is reused, and changing
`ThemesUrl` is not enough to re-trigger `ApplyThemeAsync`. If you
observe re-fetches:

- Confirm the surrounding component isn't remounting the select
  every render (e.g. inside a `@key="…"` whose value changes
  rapidly).
- Confirm no JS code is manually removing the managed `<link>`
  on each render.
- In Blazor Server, check the SignalR connection isn't dropping
  and reconnecting (each reconnect re-fires `OnAfterRenderAsync`).

## "@bind-Value doesn't update"

**Likely cause.** You wrote `Value="theme"` instead of
`@bind-Value="theme"`. The plain attribute doesn't wire
`ValueChanged`.

**Fix.** Use `@bind-Value="theme"`.

## "TypeScript-like type errors on @bind-Value"

C# requires the bound expression to be assignable. `theme` must be
a writeable `string` field or property:

```csharp
@code {
    private string theme = "";  // OK
}
```

Not:

```csharp
@code {
    private readonly string theme = "";  // Error
    private string theme => "light";     // Error (computed)
}
```

## "Theme switch works locally but not in production"

Almost always a caching issue. Either:

- Add a cache-busting suffix via `Extension` (e.g. `.css?v=1`), or
- Configure the static asset middleware to send `Cache-Control:
  must-revalidate` for theme CSS files:

```csharp
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        if (ctx.File.Name.EndsWith(".css"))
            ctx.Context.Response.Headers["Cache-Control"] =
                "no-cache, must-revalidate";
    },
});
```

## "IJSRuntime is null in tests"

bUnit's `TestContext` auto-injects a mock `IJSRuntime`. If your
tests get `null`, you forgot to derive from `Bunit.TestContext`:

```csharp
public class ThemeSelectTests : TestContext { /* … */ }
```

## "JSInterop.Invocations is empty after first render"

The `OnAfterRenderAsync` continuations may not have settled. Add
`await Task.Yield()` after `RenderComponent`:

```csharp
var cut = RenderComponent<ThemeSelect>(...);
await Task.Yield();
// JSInterop.Invocations is populated now.
```

## "ChildContent renders but SetTheme doesn't work"

Verify you're calling the async function correctly:

```razor
@onclick="@(async () => await ctx.SetTheme(t))"
```

A common mistake is `@onclick="@(() => ctx.SetTheme(t))"` — that
works at runtime but doesn't `await` the task, which can confuse
bUnit tests and may swallow exceptions silently.

## "Console: NullReferenceException in OnAfterRenderAsync"

The `IJSRuntime` is null. This happens when:

- The component is rendered server-side with a static render mode
  and the lifecycle hook ran by mistake (rare; verify the render
  mode).
- DI isn't configured. Add
  `builder.Services.AddRazorComponents()` in `Program.cs`.

## "Cookie-based theme doesn't survive page reload"

Common gotchas:

- Cookie `Path` is too narrow (`/settings` instead of `/`).
- `SameSite=Strict` is too restrictive for cross-origin navigation.
- Cookie write happens server-side but the select writes client-
  side `document.cookie` with different attributes; the next
  request reads the select's cookie, not the server's. Use a single
  cookie write path.

See [ssr.md](./ssr.md) for the recommended setup.

## "Diff between Server and WebAssembly render modes"

The select behaves identically in both modes. If you observe a
difference:

- Server uses SignalR for every interop call (slight latency).
- WebAssembly evaluates interop synchronously in-browser.
- The first paint differs: Server prerenders, WASM doesn't.

Use the same `Value`-from-cookie strategy in both cases; the select
is mode-agnostic.

## "Theme select mounts twice"

If a `<ThemeSelect>` is inside a `<Virtualize>` or a `<KeyedCollection>`
whose key changes, it can mount and unmount repeatedly. Avoid putting
the select in a virtualised list; mount it in a stable layout slot
(header, settings page) and bind its `Value` via a shared state
service.

---

Lily™ and Lily Design System™ are trademarks.
