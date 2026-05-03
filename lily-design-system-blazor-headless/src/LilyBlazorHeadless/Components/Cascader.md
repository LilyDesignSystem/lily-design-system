# Cascader

A multi-level dropdown for selecting a value from a hierarchy.

See `components/cascader/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `cascader`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Cascader Label="...">
    Content
</Cascader>
```
