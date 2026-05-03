# Combobox

A text input combined with a dropdown list for filtering options.

See `components/combobox/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `combobox`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Combobox Label="...">
    Content
</Combobox>
```
