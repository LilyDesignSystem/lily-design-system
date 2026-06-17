# ThemeSelectButton

A picker button for selecting a visual theme.

See `components/theme-select-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `theme-select-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ThemeSelectButton Label="...">
    Content
</ThemeSelectButton>
```
