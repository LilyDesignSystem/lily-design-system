# Theme principles (shared)

Adapted from the repo-root
[`AGENTS/theme.md`](../../../AGENTS/theme.md) for the Svelte helpers
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

```ts
{
    color: { primary: "#2563eb", danger: "#dc2626", success: "#16a34a" },
    space: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "2rem" },
    font: { body: "system-ui, sans-serif", heading: "system-ui, sans-serif" },
    radius: { sm: "0.25rem", md: "0.5rem", lg: "1rem" },
}
```

Consumer CSS reads `var(--theme-color-primary)`,
`var(--theme-space-md)`, etc.

## How the Svelte theme-chooser fits in

The Svelte `ThemeChooser` helper writes two signals to the document
root on every change:

1. The `href` of a managed `<link rel="stylesheet"
   data-lily-theme-chooser="{name}">` in `document.head`, pointing to
   `${themesUrl}${slug}${extension}`.
2. A `data-theme="<slug>"` attribute on the resolved target
   (defaults to `document.documentElement`).

Theme CSS files scope their rules to `:root[data-theme="<slug>"]` so
the attribute mutation is enough to switch the live theme without a
network round-trip — assuming all themes are preloaded — and the
managed `<link>` ensures only the active theme is fetched in the
default "swap-link" strategy.

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

The select's `value` is just a string. Convention says `light`,
`dark`, and `high-contrast` slugs map to those three modes, but the
select doesn't enforce that — any slug is valid.

A `prefers-color-scheme: dark` integration is one-line in the
consumer:

```ts
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const initial = prefersDark ? "dark" : "light";
```

Pass `initial` as `defaultValue`. See
`lily-design-system-svelte-theme-chooser/examples/system-preference.svelte`.

## Forbidden in the headless layer

- Hard-coded hex values, named colours, RGB / HSL literals
- `font-family`, `font-size`, `line-height` declarations
- `padding`, `margin`, `gap`, `width`, `height` literals
- Breakpoint media queries
- Shadow, border-radius, opacity values

These all live in example-app CSS and consume the theme CSS custom
properties. The headless components only set ARIA, semantic
structure, class hooks, and `data-*` attributes.

## Svelte-specific notes

### Reactive token swap

When a consumer wants tokens to be reactive in Svelte templates (not
just in CSS), they can use a `$state` store at the root layout:

```svelte
<script lang="ts">
    let tokens = $state({
        color: { primary: "#2563eb" },
        space: { md: "1rem" },
    });
</script>
```

This is **outside** the catalog's scope; the helpers themselves
don't `getContext` / `setContext` anything theme-shaped. CSS custom
properties cover the common case; a reactive token store is the
consumer's choice.

### `<svelte:head>` vs imperative `document.head` mutation

`<svelte:head>` is Svelte's declarative head-mutation slot. The
catalog's `ThemeChooser` uses imperative `document.head.appendChild`
for the managed `<link>` because:

- The managed `<link>` is a singleton across the select's lifetime,
  not a render-bound element. Putting it in `<svelte:head>` would
  destroy and recreate the `<link>` on every render.
- The select writes `link.href` directly on every change, which is
  cheap and avoids any chance of duplicate `<link>` tags from
  concurrent renders.
- SSR-safe: the imperative mutation only happens inside `$effect`,
  so the server never touches `document.head`.

Consumers who already manage their `<head>` via `<svelte:head>` in a
layout should leave the helper to its own `<link>` — the two coexist
without conflict.

### Server-rendered `data-theme`

SvelteKit's `app.html` accepts a placeholder that
`hooks.server.ts`'s `transformPageChunk` substitutes with the
cookie-resolved theme. See the parent [`ssr.md`](../ssr.md) for the
end-to-end recipe. The select hydrates over the pre-set
`data-theme` without writing anything visible.

### Multiple selects in one app

A consumer can mount more than one `ThemeChooser` (e.g. a quick
toggle in the header, a full radio list in the settings page) by
passing distinct `name` props. Each select manages its own `<link>`
identified by `data-lily-theme-chooser="{name}"`. Selections do not
sync between selects unless the consumer wires them together via
the bindable `value`.
