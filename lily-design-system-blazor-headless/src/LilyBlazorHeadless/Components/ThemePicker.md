# ThemePicker

A picker for selecting a visual theme.

See `components/theme-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `theme-picker`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ThemePicker Label="...">
    Content
</ThemePicker>
```
