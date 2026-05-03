# Listbox

A list of selectable options with keyboard navigation.

See `components/listbox/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `listbox`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Listbox Label="...">
    Content
</Listbox>
```
