# RangeInput

A slider input for selecting a value within a range <input type="range">.

See `components/range-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `range-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<RangeInput Label="...">
    Content
</RangeInput>
```
