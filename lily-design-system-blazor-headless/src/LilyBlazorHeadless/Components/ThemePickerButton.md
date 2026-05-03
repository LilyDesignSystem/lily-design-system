# ThemePickerButton

A picker button for selecting a visual theme.

See `components/theme-picker-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `theme-picker-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ThemePickerButton Label="...">
    Content
</ThemePickerButton>
```
