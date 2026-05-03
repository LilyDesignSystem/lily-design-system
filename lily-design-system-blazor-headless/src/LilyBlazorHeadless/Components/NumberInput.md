# NumberInput

An input for entering a numeric value with validation <input type="number">.

See `components/number-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `number-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NumberInput Label="...">
    Content
</NumberInput>
```
