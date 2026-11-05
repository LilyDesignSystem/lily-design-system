# HorizontalScroller

A horizontally scrollable content container.

See `components/horizontal-scroller/index.md` for canonical documentation.

ArrowLeft, ArrowRight, Home and End are in `HorizontalScroller.razor.js`, which needs an interactive render mode.

## Parameters

- `Label`: string (required) — accessible name of the region
- `Step`: double, default 100 — pixels per arrow key, rendered as `data-step`
- `CssClass`: string — extra CSS classes appended to `horizontal-scroller`
- `ChildContent`: RenderFragment — the content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<HorizontalScroller Label="Gallery" Step="200">
    ...
</HorizontalScroller>
```
