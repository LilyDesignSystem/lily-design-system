# Resizable

A container that the user can resize by dragging.

See `components/resizable/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `resizable`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Resizable Label="...">
    Content
</Resizable>
```
