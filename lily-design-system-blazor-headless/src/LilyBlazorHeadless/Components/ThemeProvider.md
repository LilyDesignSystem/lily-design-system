# ThemeProvider

A container that applies CSS custom properties from a theme object to its children.

See `components/theme-provider/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `theme-provider`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ThemeProvider>
    Content
</ThemeProvider>
```
