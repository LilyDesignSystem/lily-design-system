# RedAmberGreenRadioInput

A radio input for one choice of a red/amber/green status <input type="radio">.

See `components/red-amber-green-radio-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `red-amber-green-radio-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<RedAmberGreenRadioInput Label="...">
    Content
</RedAmberGreenRadioInput>
```
