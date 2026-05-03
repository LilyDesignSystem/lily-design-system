# ColorInput

An input for selecting a color value <input type="color">.

See `components/color-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `color-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ColorInput Label="...">
    Content
</ColorInput>
```
