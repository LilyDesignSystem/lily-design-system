# Theme principles (shared)

Adapted from the repo-root
[`AGENTS/theme.md`](../../../AGENTS/theme.md) for the Blazor helpers
catalog. Themes live entirely in the consumer's CSS and the optional
`ThemeProvider` component. The helpers in this catalog do not bake
colour, spacing, typography, or breakpoints into their markup.

## Reference palette (default examples)

The example apps default to an NHS-aligned palette so the demos look
familiar to public-sector users; teams can swap any value via CSS
custom properties without touching component code.

- primary `#2563eb`
- NHS blue `#005eb8`
- danger `#dc2626`
- warning `#f59e0b`
- success `#16a34a`
- page background `#f9fafb`
- card background `#ffffff`

## Token shape

The theme is exposed as a flat object whose keys flatten into
`--theme-{path}` CSS custom properties via the consumer's
`ThemeProvider` component:

```csharp
new
{
    color = new { primary = "#2563eb", danger = "#dc2626", success = "#16a34a" },
    space = new { xs = "0.25rem", sm = "0.5rem", md = "1rem", lg = "2rem" },
    font  = new { body = "system-ui, sans-serif", heading = "system-ui, sans-serif" },
    radius = new { sm = "0.25rem", md = "0.5rem", lg = "1rem" },
}
```

Consumer CSS reads `var(--theme-color-primary)`,
`var(--theme-space-md)`, etc.

## How the Blazor theme-chooser fits in

The Blazor `ThemeChooser` helper writes two signals via a single
`IJSRuntime` call:

1. A managed `<link rel="stylesheet" data-lily-theme-chooser="{Name}">`
   in `document.head` whose `href` swaps on every change.
2. A `data-theme="<slug>"` attribute on the document root.

Theme CSS files scope their rules to `:root[data-theme="<slug>"]` so
the select's attribute mutation is enough to switch the live theme.

```css
:root[data-theme="dark"] {
    --theme-color-primary: #60a5fa;
    --theme-color-base-background: #0b1220;
    --theme-color-base-content: #f9fafb;
}
```

The select does not write CSS custom properties directly. Theme
authors do, via the `<link>` the select swaps into `<head>`.

## Light / dark / high-contrast

The select's `Value` is just a string. Convention says `light`,
`dark`, and `high-contrast` slugs map to those three modes, but the
select doesn't enforce that — any slug is valid.

A `prefers-color-scheme: dark` integration is one-line in the
consumer (server-side, e.g. via a media-query hint header
sent by the client, or client-side via JS interop):

```razor
@code {
    private string defaultTheme = "light";

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        var prefersDark = await JS.InvokeAsync<bool>(
            "eval",
            "window.matchMedia?.('(prefers-color-scheme: dark)').matches === true");
        if (prefersDark) defaultTheme = "dark";
    }
}
```

Pass `defaultTheme` as `DefaultValue`. See
`lily-design-system-blazor-theme-chooser/examples/SystemPreference.razor`.

## Forbidden in the headless layer

- Hard-coded hex values, named colours, RGB / HSL literals
- `font-family`, `font-size`, `line-height` declarations
- `padding`, `margin`, `gap`, `width`, `height` literals
- Breakpoint media queries
- Shadow, border-radius, opacity values

These all live in example-app CSS and consume the theme CSS custom
properties. The headless components only set ARIA, semantic
structure, class hooks, and `data-*` attributes.

## Blazor-specific notes

### Server-resolved initial theme (no flicker)

The cleanest theme strategy on Blazor Server / Blazor Web App is to
resolve the user's theme cookie server-side, emit
`<html data-theme="{slug}">` and the matching `<link>` in
`App.razor` / `_Host.cshtml`, then pass the slug as the select's
`Value` parameter so hydration is a no-op. See
[`../ssr.md`](../ssr.md) for the recipe.

### Reactive token swap

When a consumer wants tokens to be reactive in Razor templates (not
just in CSS), they can use a `CascadingValue<ThemeTokens>` ancestor:

```razor
<CascadingValue Value="@tokens">
    @ChildContent
</CascadingValue>
```

…and descendants `[CascadingParameter] public ThemeTokens Tokens
{ get; set; } = default!;`. This is **outside** the catalog's scope;
the helpers themselves don't cascade anything. CSS custom properties
cover the common case; a reactive token store is the consumer's
choice.

### Why imperative DOM mutation vs `<HeadContent>`

Blazor 10 ships `<HeadContent>` and `<PageTitle>` components for
declarative `<head>` manipulation. The catalog's `ThemeChooser` uses
imperative DOM mutation via `IJSRuntime` because:

- The managed `<link>` is a single element managed across the
  component's lifetime, not a render-bound element.
- `<HeadContent>` re-renders on every parameter change, which would
  thrash the `<link>` href and potentially trigger CSS reload more
  often than necessary.
- Imperative DOM mutation works equally well in Server, WebAssembly,
  and Web App modes — `<HeadContent>` requires `App.razor` setup
  that not all consumers have.

Consumers who already manage `<head>` via `<HeadContent>` can leave
the select to its own `<link>` — the two coexist without conflict.

### Theme switching across SignalR (Blazor Server)

Under Blazor Server every JS interop call is one SignalR round-trip.
Theme switching feels instantaneous because:

- The `<link>` href is cached after the first fetch.
- `data-theme` is one DOM-attribute write — sub-millisecond.

If you observe lag, profile the SignalR connection; the helper
itself is two interop calls per change (one to read storage on first
mount, one to apply each subsequent change).
