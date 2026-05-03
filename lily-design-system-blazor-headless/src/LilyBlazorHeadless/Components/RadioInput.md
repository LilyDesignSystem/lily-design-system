# RadioInput

A single radio button input <input type="radio">.

See `components/radio-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `radio-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<RadioInput Label="...">
    Content
</RadioInput>
```
