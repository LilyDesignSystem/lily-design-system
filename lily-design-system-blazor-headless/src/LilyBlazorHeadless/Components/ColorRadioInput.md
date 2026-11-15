# ColorRadioInput

A radio input for one choice of a color swatch <input type="radio">.

See `components/color-radio-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `color-radio-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ColorRadioInput Label="...">
    Content
</ColorRadioInput>
```
