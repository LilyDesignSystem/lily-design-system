# ColorPicker

A two-dimensional board for picking colors by hue and saturation.

See `components/color-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `color-picker`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ColorPicker Label="...">
    Content
</ColorPicker>
```
