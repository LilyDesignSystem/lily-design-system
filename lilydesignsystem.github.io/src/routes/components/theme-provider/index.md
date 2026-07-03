# ThemeProvider

A container that applies CSS custom properties from a theme object to its children, enabling scoped visual theming without affecting layout.

This headless component uses a `<div>` element with `display: contents` that flattens a nested theme object into `--theme-*` CSS custom properties on its style attribute.

## Implementation Notes

- Uses `<div>` element with `display: contents` to avoid affecting layout
- Flattens nested theme object keys into `--theme-*` CSS custom properties
- Merges custom theme with a base light or dark theme
- Nested ThemeProvider components can override parent theme values
- CSS custom property output: `{ color: { text: "#1a1a1a" } }` becomes `--theme-color-text: #1a1a1a`

## Props

- `theme`: object (required) -- theme object with key-value pairs flattened to CSS custom properties
- `base`: "light" | "dark" (default: "light") -- base theme to merge with
- `children`: slot (required) -- themed content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<ThemeProvider theme={{ color: { text: "#1a1a1a", background: "#ffffff", accent: "#2563eb" } }} base="light">
  <Card>
    <p>This content uses the custom theme colors.</p>
  </Card>
</ThemeProvider>
```

```html
<ThemeProvider theme={{ color: { text: "#f0f0f0", background: "#1a1a1a" } }} base="dark">
  <Panel>
    <p>Dark-themed content area.</p>
  </Panel>
</ThemeProvider>
```

```html
<ThemeProvider theme={{ spacing: { sm: "0.5rem", md: "1rem", lg: "2rem" } }}>
  <ThemeProvider theme={{ color: { accent: "#dc2626" } }}>
    <p>Nested theme overrides the accent color while inheriting spacing.</p>
  </ThemeProvider>
</ThemeProvider>
```

## Keyboard Interactions

- None -- presentational wrapper; interactive children handle their own keyboard interactions

## ARIA

- None -- presentational wrapper. Ensure sufficient color contrast in custom themes to maintain WCAG 2.2 AAA compliance.

## When to Use

- Use to scope visual themes to sections of a page
- Use to provide light and dark mode variants within the same page
- Use to allow nested theme overrides for specific content areas
- Use when different sections of a page require different visual styling

## When Not to Use

- Do not use for global app theming -- set CSS custom properties on `:root` instead
- Do not use when only a single style property needs to change -- use inline styles directly
- Do not use for layout concerns -- ThemeProvider is purely for visual theming

## Headless

This component provides a `<div>` element with `display: contents` that applies CSS custom properties from a theme object, with zero visual styling. The consumer is responsible for referencing the `--theme-*` custom properties in their CSS and ensuring all themed content uses these properties consistently.

## Styles

The consumer provides all CSS styling. The component renders with a `.theme-provider` class for targeting. No default styles are included -- this is a fully headless component. The component sets `display: contents` to avoid affecting layout.

## Testing

- Verify the component renders a `<div>` element with class `theme-provider`
- Verify nested theme object is flattened into `--theme-*` CSS custom properties
- Verify base theme values are applied when no custom override is provided
- Verify nested ThemeProvider overrides parent theme values
- Verify `display: contents` is applied
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure all theme color combinations meet WCAG 2.2 AAA contrast ratios. Define a complete theme object so that no component is left unstyled. Test themes at multiple viewport sizes.
- **Developers**: Use consistent naming conventions in theme objects. Always provide a base theme to ensure all custom properties have fallback values. Use CSS `var()` with fallbacks when referencing theme properties.

## Related components

- `theme-select` — a select dropdown for choosing a theme
- `theme-view` — a read-only display of the current theme

## References

- [Reuters Graphics Theme component](https://github.com/reuters-graphics/graphics-components)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
