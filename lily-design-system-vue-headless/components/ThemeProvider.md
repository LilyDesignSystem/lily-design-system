# ThemeProvider

Applies a theme object to the consumer's content by flattening the object's keys into CSS custom properties on a wrapping `<div>`. The wrapper uses inline `display: contents` so it doesn't affect layout.

## Props

- `theme`: Record (required) — theme object; nested keys flattened into `--theme-{path}` CSS custom properties
- `base`: `"light" | "dark"` (default `"light"`) — base theme, reflected as `data-theme`

## Slots

- default — themed content

## Usage

```vue
<ThemeProvider
  :theme="{ color: { primary: '#2563eb', danger: '#dc2626' } }"
  base="light"
>
  <App />
</ThemeProvider>
```

CSS in your app can refer to `var(--theme-color-primary)`, etc.

## References

- CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
