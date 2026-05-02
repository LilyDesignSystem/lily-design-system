# ThemeProvider

Applies a theme object to the consumer's content by flattening the object's keys into CSS custom properties on a wrapping `<div>`. The wrapper uses inline `display: contents` so it doesn't affect layout — children render in place but inherit the CSS variables.

## Props

- `className`: string (optional) — CSS class appended to `theme-provider`
- `theme`: Record (required) — theme object; nested keys are flattened into `--theme-{path}` CSS custom properties (e.g. `{ color: { primary: "#fff" } }` → `--theme-color-primary: #fff`)
- `base`: `"light" | "dark"` (default `"light"`) — base theme, reflected as `data-theme`
- `children`: ReactNode (required) — themed content
- `...restProps`: unknown — additional attributes spread onto the `<div>`

## Usage

```tsx
<ThemeProvider
  theme={{
    color: { primary: "#2563eb", danger: "#dc2626" },
    space: { xs: "0.25rem", sm: "0.5rem" },
  }}
  base="light"
>
  <App />
</ThemeProvider>
```

The CSS in your app can then refer to `var(--theme-color-primary)`, etc.

## References

- CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
