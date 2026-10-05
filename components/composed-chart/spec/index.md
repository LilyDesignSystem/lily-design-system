# ComposedChart — Specification

Single source of truth for the ComposedChart component: a chart that combines several chart types, such as bars and a line, on shared axes.

## Goal

A headless `<figure>` holding a `<div class="composed-chart-graphic" role="img" aria-label>` around a consumer-drawn `<svg>`, with an optional sibling data-table wrapper outside the image.

## HTML Tag and CSS Class

- HTML tag: <figure>
- CSS class: .composed-chart

## Requirements

1. Root is `<figure>` with first attribute `class="composed-chart {class}"`.
2. The graphic wrapper `.composed-chart-graphic` has `role="img"`; the figure has no role.
3. `aria-label` is set from the optional `label` prop (omitted when absent).
4. Children (the consumer svg) render inside the graphic wrapper.
5. The optional data table renders in `.composed-chart-data-table`, a sibling after the graphic and outside `role="img"`.
6. `restProps` spread onto the root.
7. No drawing, CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
