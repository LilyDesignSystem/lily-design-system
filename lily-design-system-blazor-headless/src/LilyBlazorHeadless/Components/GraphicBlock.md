# GraphicBlock

A wrapper for charts and graphics with title, description, notes, and ARIA description.

See `components/graphic-block/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `graphic-block`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<GraphicBlock Label="...">
    Content
</GraphicBlock>
```
