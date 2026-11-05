# HoverCard

A card that appears on hover over a trigger element.

See `components/hover-card/index.md` for canonical documentation.

The consumer's trigger sets `Open` on hover and focus.

## Parameters

- `Label`: string (required)
- `Open`: bool — the consumer owns it
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<HoverCard Label="Profile" Open="open" style="position-anchor: --card">...</HoverCard>
```
