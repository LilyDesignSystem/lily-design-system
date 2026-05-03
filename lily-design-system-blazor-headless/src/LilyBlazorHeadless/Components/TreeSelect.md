# TreeSelect

A select dropdown showing a tree of hierarchical options.

See `components/tree-select/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tree-select`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TreeSelect Label="...">
    Content
</TreeSelect>
```
