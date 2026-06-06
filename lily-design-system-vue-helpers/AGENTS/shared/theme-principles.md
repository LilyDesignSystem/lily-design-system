# Theme principles (shared)

Adapted from the repo-root
[`AGENTS/theme.md`](../../../AGENTS/theme.md) for the Vue helpers
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

## How the Vue theme-picker fits in

The Vue `ThemePicker` helper writes one extra signal to the document
root: a `data-theme="<slug>"` attribute. Theme CSS files scope their
rules to `:root[data-theme="<slug>"]` so the picker's attribute
mutation is enough to switch the live theme.

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
```

Pass `initial` as `defaultValue`. See
`lily-design-system-vue-theme-picker/examples/system-preference.vue`.

## Forbidden in the headless layer

- Hard-coded hex values, named colours, RGB / HSL literals
- `font-family`, `font-size`, `line-height` declarations
- `padding`, `margin`, `gap`, `width`, `height` literals
- Breakpoint media queries
- Shadow, border-radius, opacity values

These all live in example-app CSS and consume the theme CSS custom
properties. The headless components only set ARIA, semantic
structure, class hooks, and `data-*` attributes.

## Vue-specific notes

### Reactive token swap

When a consumer wants tokens to be reactive in Vue templates (not
just in CSS), they can `provide`/`inject` a reactive ref:

```ts
// in a parent or root component
import { ref, provide } from "vue";
const tokens = ref({ /* … */ });
provide("theme-tokens", tokens);

// in any descendant
import { inject } from "vue";
const tokens = inject<Ref<...>>("theme-tokens");
```

This is **outside** the catalog's scope; the helpers themselves
don't `provide` or `inject` anything. CSS custom properties cover
the common case; a reactive token store is the consumer's choice.

### `<Teleport to="head">`

Vue's `<Teleport to="head">` is an alternative to the picker's
`document.head.appendChild` for the managed `<link>`. The catalog's
`ThemePicker` uses imperative DOM mutation because:

- It works during SSR (`<Teleport>` requires a hydrated DOM).
- It's a single element managed across the component's lifetime, not
  a render-bound element.

Consumers who already manage their `<head>` via Nuxt's `useHead`
should leave the helper to its own `<link>` — the two coexist
without conflict.
