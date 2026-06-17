# Theme principles (shared)

Adapted from the repo-root
[`AGENTS/theme.md`](../../../AGENTS/theme.md) for the Nunjucks
helpers catalog. Themes live entirely in the consumer's CSS and the
optional `ThemeProvider` component. The helpers in this catalog do
not bake colour, spacing, typography, or breakpoints into their
markup.

## Reference palette (default examples)

The example apps default to an NHS-aligned palette so the demos
look familiar to public-sector users; teams can swap any value via
CSS custom properties without touching macro code.

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

## How the Nunjucks theme-select fits in

The Nunjucks `themeSelect` macro emits a native `<select>`; the companion
`theme-select.client.js` writes one signal to the document root: a
`data-theme="<slug>"` attribute. Theme CSS files scope their rules
to `:root[data-theme="<slug>"]` so the picker's attribute mutation
is enough to switch the live theme.

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

A `prefers-color-scheme: dark` integration is two lines in the
consumer's host code:

```js
// In your Eleventy edge function or Express handler:
const prefersDark = req.headers["sec-ch-prefers-color-scheme"] === "dark";
const initial = prefersDark ? "dark" : "light";
```

Pass `initial` as `opts.defaultValue`. See the theme picker's
`examples/06-system-preference.njk`.

## Forbidden in the headless layer

- Hard-coded hex values, named colours, RGB / HSL literals
- `font-family`, `font-size`, `line-height` declarations
- `padding`, `margin`, `gap`, `width`, `height` literals
- Breakpoint media queries
- Shadow, border-radius, opacity values

These all live in example-app CSS and consume the theme CSS custom
properties. The helpers only set ARIA, semantic structure, class
hooks, and `data-*` attributes.

## Nunjucks-specific notes

### Reactive token swap

Nunjucks renders templates server-side or at build time; there is
no "reactive token swap" inside the template. If a consumer wants
token-aware components in the browser, they read CSS custom
properties via JavaScript (`getComputedStyle(document.documentElement).getPropertyValue("--theme-color-primary")`)
or watch for the `data-theme` mutation via `MutationObserver`.

### Eleventy-data theme catalog

A common pattern: store the list of available themes in an Eleventy
data file so the picker auto-renders every theme that exists on
disk:

```js
// _data/themes.js
import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src", "assets", "themes");
export default readdirSync(dir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => f.replace(/\.css$/, ""));
```

```njk
{{ themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: themes
}) }}
```

This is **outside** the catalog's scope; the helpers themselves
never read the file system. Auto-discovery is the consumer's
choice.

### Preloading via `<link rel="preload">`

When a consumer wants instant theme switching with no network
round-trip, they preload all theme CSS files in the document head:

```njk
{# layouts/base.njk #}
<head>
    {% for theme in themes %}
    <link rel="preload" as="style" href="/assets/themes/{{ theme }}.css">
    {% endfor %}
</head>
```

The picker still swaps its managed `<link>` href; the browser
serves the preloaded response from cache. See the theme picker's
`docs/preloading.md`.
