# HeatmapChart — Specification

Single source of truth for the HeatmapChart component: a grid chart where cell colour encodes the value at each row and column.

## Goal

A headless `<figure>` holding a `<div class="heatmap-chart-graphic" role="img" aria-label>` shell, like `bar-chart`, but with the image on an inner graphic wrapper and an optional data-table slot outside it, around a consumer-drawn `<svg>`.

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

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="heatmap-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="heatmap-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).
