# ColorPickerButton

A button showing a color swatch in a color picker.

See `components/color-picker-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `color-picker-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ColorPickerButton Label="...">
    Content
</ColorPickerButton>
```
