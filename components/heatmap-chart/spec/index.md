# HeatmapChart — Specification

Single source of truth for the HeatmapChart component: a grid chart where cell colour encodes the value at each row and column.

## Goal

A headless `<figure role="img">` shell, identical in contract to `bar-chart`, around a consumer-drawn `<svg>`.

## HTML Tag and CSS Class

- HTML tag: <figure>
- CSS class: .heatmap-chart

## Requirements

1. Root is `<figure>` with first attribute `class="heatmap-chart {class}"`.
2. `role="img"`.
3. `aria-label` is set from the required `label` prop.
4. Children (the consumer svg) render inside the figure.
5. `restProps`, including `aria-describedby`, spread onto the root.
6. No drawing, CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Svelte canonical implemented with one test per requirement above
- [ ] Ported to the other headless libraries
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
