# ColorRadioGroup

A fieldset radio group for selecting a color swatch.

See `components/color-radio-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `color-radio-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ColorRadioGroup Label="...">
    Content
</ColorRadioGroup>
```
