## Theme design principle rules

Themes live entirely in the example subprojects' CSS and the optional `ThemeProvider` component. The headless components do not bake colour, spacing, typography, or breakpoints into their markup.

### Reference palette (default examples)

The example apps default to an NHS-aligned palette so the demos look familiar to public-sector users; teams can swap any value via CSS custom properties without touching component code.

- primary `#2563eb`
- NHS blue `#005eb8`
- danger `#dc2626`
- warning `#f59e0b`
- success `#16a34a`
- page background `#f9fafb`
- card background `#ffffff`

### Token shape

The theme is exposed as a flat object whose keys flatten into `--theme-{path}` CSS custom properties via the `ThemeProvider` component:

```ts
{
  color: { primary: "#2563eb", danger: "#dc2626", success: "#16a34a" },
  space: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "2rem" },
  font: { body: "system-ui, sans-serif", heading: "system-ui, sans-serif" },
  radius: { sm: "0.25rem", md: "0.5rem", lg: "1rem" },
}
```

Consumer CSS reads `var(--theme-color-primary)`, `var(--theme-space-md)`, etc.

### Light / dark / high-contrast

`ThemeProvider` accepts a `base` prop (`"light" | "dark"`) that is reflected as `data-theme` on the wrapper. Consumer CSS targets `[data-theme="light"]` and `[data-theme="dark"]` to swap variables. High-contrast themes are an additional `data-theme` value and are layered the same way.

### Forbidden in the headless layer

- Hard-coded hex values, named colours, RGB / HSL literals
- `font-family`, `font-size`, `line-height` declarations
- `padding`, `margin`, `gap`, `width`, `height` literals
- Breakpoint media queries
- Shadow, border-radius, opacity values

These all live in example-app CSS and consume the theme CSS custom properties. The headless components only set ARIA, semantic structure, class hooks, and `data-*` attributes.
