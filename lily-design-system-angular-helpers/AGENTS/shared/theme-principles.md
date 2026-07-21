# Theme principles (shared)

Adapted from the repo-root
[`AGENTS/theme.md`](../../../AGENTS/theme.md) for the Angular helpers
catalog. Themes live entirely in the consumer's CSS and the optional
`ThemeProvider` component. The helpers in this catalog do not bake
colour, spacing, typography, or breakpoints into their markup.

## Reference palette (default examples)

The example apps default to an NHS-aligned palette so the demos
look familiar to public-sector users; teams can swap any value via
CSS custom properties without touching component code.

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

## How the Angular theme-chooser fits in

The Angular `ThemeChooser` helper writes one extra signal to the
document root: a `data-theme="<slug>"` attribute. Theme CSS files
scope their rules to `:root[data-theme="<slug>"]` so the select's
attribute mutation is enough to switch the live theme.

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
consumer's signal computation:

```ts
const prefersDark = typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const initial = prefersDark ? "dark" : "light";
```

Pass `initial` as `defaultValue`. See
`lily-design-system-angular-theme-chooser/examples/system-preference.component.ts`.

## Forbidden in the headless layer

- Hard-coded hex values, named colours, RGB / HSL literals
- `font-family`, `font-size`, `line-height` declarations
- `padding`, `margin`, `gap`, `width`, `height` literals
- Breakpoint media queries
- Shadow, border-radius, opacity values

These all live in example-app CSS and consume the theme CSS custom
properties. The headless components only set ARIA, semantic
structure, class hooks, and `data-*` attributes.

## Angular-specific notes

### Reactive token swap

When a consumer wants tokens to be reactive in Angular templates
(not just in CSS), they expose a `signal` from a service:

```ts
// theme-tokens.service.ts
import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ThemeTokensService {
    readonly tokens = signal({
        color: { primary: "#2563eb" },
        space: { md: "1rem" },
    });
}
```

Consumers inject the service and read `tokens()` from any
template. This is **outside** the catalog's scope; the helpers
themselves don't provide or inject anything. CSS custom properties
cover the common case; a reactive token store is the consumer's
choice.

### `DOCUMENT` injection token

Angular's `@angular/common` ships a `DOCUMENT` token whose default
factory returns `document` on the browser. The helpers don't use it:

- `DOCUMENT` adds an injection dependency where a `typeof
  document` guard is enough.
- The token's SSR fallback can return a stub document, but a stub
  document does not survive `document.head.querySelector` /
  `appendChild` calls cleanly.

The helpers use `typeof document !== "undefined"` and operate
directly on `document.head` / `document.documentElement`. This is
portable across Angular CLI, Analog, Storybook, and unit-test
contexts without an injection.

### `@HostBinding` for `data-theme`

A future variant could use `@HostBinding('attr.data-theme')` so the
attribute lives on the host element rather than on
`document.documentElement`. The current `ThemeChooser` writes to
the document root because:

- Theme CSS files conventionally scope to `:root[data-theme="..."]`.
- Multiple choosers can coexist by writing to different `target`
  elements (passed via the `target` input).
- The document-root write composes with SSR cookie bridges that set
  `<html data-theme>` server-side.

If a host-bound variant ever ships, it'll live alongside the
current `ThemeChooser` as a separate helper, not as a replacement.
