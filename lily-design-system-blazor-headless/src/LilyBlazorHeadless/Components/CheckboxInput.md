# CheckboxInput

A checkbox input for toggling a boolean value <input type="checkbox">.

See `components/checkbox-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `checkbox-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CheckboxInput Label="...">
    Content
</CheckboxInput>
```
