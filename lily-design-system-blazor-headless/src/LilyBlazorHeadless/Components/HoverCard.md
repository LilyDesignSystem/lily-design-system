# HoverCard

A card that appears on hover over a trigger element.

See `components/hover-card/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `hover-card`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<HoverCard Label="...">
    Content
</HoverCard>
```
