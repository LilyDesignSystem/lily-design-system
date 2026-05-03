# HorizontalScroller

A horizontally scrollable content container.

See `components/horizontal-scroller/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `horizontal-scroller`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<HorizontalScroller Label="...">
    Content
</HorizontalScroller>
```
