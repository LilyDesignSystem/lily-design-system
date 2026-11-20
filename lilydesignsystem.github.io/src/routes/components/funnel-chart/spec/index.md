# FunnelChart — Specification

Single source of truth for the FunnelChart component: a chart of stages narrowing from top to bottom, showing how a quantity drops at each step.

## Goal

A headless `<figure>` holding a `<div class="funnel-chart-graphic" role="img" aria-label>` around a consumer-drawn `<svg>`, with an optional sibling data-table wrapper outside the image.

## HTML Tag and CSS Class

- HTML tag: <figure>
- CSS class: .funnel-chart

## Requirements

1. Root is `<figure>` with first attribute `class="funnel-chart {class}"`.
2. The graphic wrapper `.funnel-chart-graphic` has `role="img"`; the figure has no role.
3. `aria-label` is set from the optional `label` prop (omitted when absent).
4. Children (the consumer svg) render inside the graphic wrapper.
5. The optional data table renders in `.funnel-chart-data-table`, a sibling after the graphic and outside `role="img"`.
6. `restProps` spread onto the root.
7. No drawing, CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
