# Theme principles (shared)

Adapted from the repo-root
[`AGENTS/theme.md`](../../../AGENTS/theme.md) for the HTML helpers
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

## How the HTML theme-picker fits in

The HTML `<theme-picker>` custom element writes one extra signal to
the document root: a `data-theme="<slug>"` attribute. Theme CSS
files scope their rules to `:root[data-theme="<slug>"]` so the
picker's attribute mutation is enough to switch the live theme.

```css
:root[data-theme="dark"] {
    --theme-color-primary: #60a5fa;
    --theme-color-base-background: #0b1220;
    --theme-color-base-content: #f9fafb;
}
```

The picker does not write CSS custom properties directly. Theme
authors do, via the `<link>` the picker swaps into `<head>`.

## Light / dark / high-contrast

The picker's `value` is just a string. Convention says `light`,
`dark`, and `high-contrast` slugs map to those three modes, but the
picker doesn't enforce that — any slug is valid.

A `prefers-color-scheme: dark` integration is one-line in the
consumer:

```ts
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const initial = prefersDark ? "dark" : "light";
document.querySelector("theme-picker")!.setAttribute("default-value", initial);
```

See
`lily-design-system-html-theme-picker/examples/06-system-preference.html`.

## Forbidden in the headless layer

- Hard-coded hex values, named colours, RGB / HSL literals
- `font-family`, `font-size`, `line-height` declarations
- `padding`, `margin`, `gap`, `width`, `height` literals
- Breakpoint media queries
- Shadow, border-radius, opacity values

These all live in example-app CSS and consume the theme CSS custom
properties. The headless helpers only set ARIA, semantic structure,
class hooks, and `data-*` attributes.

## Custom-element-specific notes

### Imperative `document.head.appendChild`

The HTML helpers manage a single `<link rel="stylesheet"
data-lily-theme-picker="{name}">` in `document.head` via imperative
DOM mutation. This is simpler than any framework abstraction
(`<svelte:head>`, `useHead`, `<Teleport to="head">`) because the
helper *is* vanilla JS — there is no framework boundary to cross.

The `data-lily-theme-picker` attribute disambiguates the managed
link from any other `<link>` the consumer or framework has
inserted; the helper never touches a `<link>` it didn't create.

### Multiple pickers via `name`

The host element's `name` attribute (default `"theme"`) doubles as:

- The `name` shared by the radio inputs (so multiple radiogroups
  don't conflict).
- The discriminator on the managed `<link>` (so multiple pickers
  manage their own stylesheets).

When two pickers share a `name`, they manage the same `<link>` and
the same radio group — useful for paired UI but rarely what you
want. Pass distinct names for independent operation.

### Disconnect cleanup

`disconnectedCallback` removes the managed `<link>` *only* when no
other `<theme-picker>` with the same `name` remains in the document.
This lets two pickers coordinate while still cleaning up when both
unmount.

### Reactive token swap

CSS custom properties scoped to `:root[data-theme]` are reactive by
construction — changing the attribute on `<html>` instantly switches
which rules apply. There is no JS-side reactivity to wire; the
browser does it.
