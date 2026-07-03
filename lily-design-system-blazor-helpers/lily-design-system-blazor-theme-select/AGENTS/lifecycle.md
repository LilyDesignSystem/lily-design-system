# Lifecycle — ThemeSelect (Blazor)

The Blazor-flavoured walk-through of the select's lifecycle. The
canonical contract is in [`../spec/index.md`](../spec/index.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to Blazor's
`OnAfterRenderAsync`.

## Lifecycle diagram

```
mount (server-side render of markup)
  │
  ▼
SSR / prerender produces <select> markup with options — no DOM mutation, no IJSRuntime call.
  │
  ▼
interactivity activates (Blazor Server circuit established, or WASM loaded)
  │
  ▼
OnAfterRenderAsync(firstRender: true) ─► resolve initial value
  │                                       (props.Value > storage > DefaultValue > "light" > Themes[0])
  │                                       │
  │                                       ▼
  │                                     if resolved != Value:
  │                                         Value = resolved
  │                                         await ValueChanged.InvokeAsync(Value)
  │                                         StateHasChanged()
  │                                     await ApplyThemeAsync(resolved)
  │
  ▼
ApplyThemeAsync(slug):
  1. JS eval: locate / create <link data-lily-theme-select="{Name}">, set href = ThemeHref(...)
  2. JS eval: document.documentElement.setAttribute('data-theme', slug)
  3. JS eval: if StorageKey: localStorage.setItem(StorageKey, slug)
  4. await OnChange.InvokeAsync(slug)

user picks a different option
  │
  ▼
onchange handler ─► SetThemeAsync(next)
  │                   │
  │                   ▼
  │                 Value = next
  │                 await ValueChanged.InvokeAsync(Value)
  │                 await ApplyThemeAsync(next)
  │                 StateHasChanged()
```

## Why `OnAfterRenderAsync`, not `OnInitializedAsync`

`OnInitializedAsync` runs during prerender; `IJSRuntime` isn't
guaranteed available there and a call would throw
`InvalidOperationException`. `OnAfterRenderAsync(firstRender)` is the
canonical hook for "run once the DOM is interactive" work — which
includes every interop call this helper makes.

The `_initialised` guard prevents a second invocation if the render
tree replays first-render for the same component instance (rare but
possible during re-render with `firstRender` semantics).

## Initial-value resolution

Inside `OnAfterRenderAsync`:

```csharp
protected override async Task OnAfterRenderAsync(bool firstRender)
{
    if (!firstRender || _initialised) return;
    _initialised = true;

    var initial = await ResolveInitialAsync();
    if (string.IsNullOrEmpty(initial)) return;

    if (initial != Value)
    {
        Value = initial;
        await ValueChanged.InvokeAsync(Value);
        StateHasChanged();
    }
    await ApplyThemeAsync(initial);
}
```

`ResolveInitialAsync`:

```csharp
private async Task<string> ResolveInitialAsync()
{
    if (!string.IsNullOrEmpty(Value)) return Value;

    if (!string.IsNullOrEmpty(StorageKey))
    {
        try
        {
            var stored = await JS.InvokeAsync<string?>("eval",
                $"(function(){{try{{return localStorage.getItem({JsonString(StorageKey!)});}}catch(e){{return null;}}}})()");
            if (!string.IsNullOrEmpty(stored)) return stored!;
        }
        catch { /* prerender / interop unavailable */ }
    }

    if (!string.IsNullOrEmpty(DefaultValue)) return DefaultValue!;
    if (Themes.Count == 0) return "";
    foreach (var t in Themes) if (t == "light") return "light";
    return Themes[0];
}
```

Resolving + emitting `ValueChanged` triggers a re-render so the
right `<option>` is selected. The subsequent `ApplyThemeAsync` writes
the DOM.

## Apply

```csharp
public async Task SetThemeAsync(string slug)
{
    if (string.IsNullOrEmpty(slug)) return;
    if (slug == Value) { await ApplyThemeAsync(slug); return; }
    Value = slug;
    await ValueChanged.InvokeAsync(Value);
    await ApplyThemeAsync(slug);
    StateHasChanged();
}

private async Task ApplyThemeAsync(string slug)
{
    var href = ThemeHref(ThemesUrl, slug, Extension);
    var script = BuildApplyScript(Name, href, slug, StorageKey);
    try { await JS.InvokeVoidAsync("eval", script); } catch { /* … */ }
    await OnChange.InvokeAsync(slug);
}
```

`SetThemeAsync` is `public` so the `ChildContent`
`RenderFragment<ThemeSelectContext>` can call it via
`ctx.SetTheme(slug)`.

## Why one giant `eval` call per change

Each `InvokeVoidAsync` call is a round-trip over the SignalR
connection (Blazor Server) or a WASM boundary crossing (Blazor
WebAssembly). Bundling four DOM mutations into one JS evaluation
makes the change atomic and cheap:

1. Locate / create the `<link>`.
2. Set its `href`.
3. Set `data-theme` on `<html>`.
4. Persist to `localStorage` (if requested).

A consumer who wants finer-grained interop can override
`ChildContent` and bypass `SetTheme` entirely, but the default path
is one round-trip per change.

## Reactivity

Only `Value` triggers re-apply. Other parameters
(`ThemesUrl`, `Extension`, `Name`) are read inside the apply
function on every fire, so changes take effect on the next theme
change, not retroactively. This matches the Svelte canonical's
contract (spec/index.md §5.4).

If a consumer wants to re-apply when, e.g., `ThemesUrl` changes
mid-session, they can write back to `Value`:

```razor
@code {
    private string theme = "light";
    private string themesUrl = "/assets/themes/";

    private async Task OnThemesUrlChange(string newUrl)
    {
        themesUrl = newUrl;
        var current = theme;
        theme = "";
        await Task.Yield();
        theme = current;
    }
}
```

The intermediate empty `Value` doesn't trigger an apply (initial-
value resolution skips when `Value` is empty), then the restored
`theme` triggers the re-apply.

## SSR

During static SSR (Blazor Web App with non-interactive render mode),
`OnAfterRenderAsync` never fires. The select's markup arrives with
whatever `Value` the consumer passed; no DOM mutation occurs because
there is no DOM yet — just an HTML response.

That's the recipe for flicker-free SSR: pre-resolve the theme on
the server (cookie), emit `<html data-theme="…">` and the matching
`<link>` in `App.razor` / `_Host.cshtml`, and pass the resolved slug
as `Value`. See [`./ssr.md`](./ssr.md).

## Unmount

The component does not clean up the managed `<link>` or the
`data-theme` attribute on unmount. That's intentional:

- The select may be unmounted because the consumer navigated away
  from the settings page; the theme should stay applied.
- The next select mount reuses the same managed `<link>` (located
  by `data-lily-theme-select="{Name}"`).

If a consumer wants to fully tear down the theme on unmount, they
can implement `IAsyncDisposable` in a wrapping component themselves.

## State machine summary

| State           | Trigger                                       | Effect                                              |
| --------------- | --------------------------------------------- | --------------------------------------------------- |
| `_initialised = false` | construction                            | Select is ready to render its markup.               |
| `OnAfterRenderAsync(true)` | first interactive render             | Resolve initial value, apply, fire callbacks.       |
| `_initialised = true` | after first render                       | Future renders skip the initial-value path.         |
| `SetThemeAsync(slug)` | user click / `ChildContent` invocation   | Mutate state, fire callbacks, apply, re-render.     |
| dispose / unmount | parent removed from render tree              | No-op; theme persists.                              |
