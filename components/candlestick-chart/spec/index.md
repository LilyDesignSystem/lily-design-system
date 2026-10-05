# CandlestickChart — Specification

Single source of truth for the CandlestickChart component: a financial chart showing open, high, low and close values for each period as candles.

## Goal

A headless `<figure>` holding a `<div class="candlestick-chart-graphic" role="img" aria-label>` around a consumer-drawn `<svg>`, with an optional sibling data-table wrapper outside the image.

## HTML Tag and CSS Class

- HTML tag: <figure>
- CSS class: .candlestick-chart

## Requirements

1. Root is `<figure>` with first attribute `class="candlestick-chart {class}"`.
2. The graphic wrapper `.candlestick-chart-graphic` has `role="img"`; the figure has no role.
3. `aria-label` is set from the optional `label` prop (omitted when absent).
4. Children (the consumer svg) render inside the graphic wrapper.
5. The optional data table renders in `.candlestick-chart-data-table`, a sibling after the graphic and outside `role="img"`.
6. `restProps` spread onto the root.
7. No drawing, CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
