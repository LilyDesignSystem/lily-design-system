# BarChart

## Metadata

- Component: bar-chart
- PascalCase: BarChart
- Description: a horizontal bar chart visualization for displaying data
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <figure>
- CSS class: .bar-chart
- Interactive: no

## Key Behaviors

- Renders a `<figure>` holding a `<div class="bar-chart-graphic" role="img" aria-label>` containing an inline `<svg>` rendering of horizontal bars
- Data is supplied as `categories` (each with a label and value)
- Bars run horizontally; values are read along the x-axis
- An optional accessible data table is rendered via the `dataTable` slot
- Spreads `restProps` onto the root `<figure>`

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## Keyboard

- No keyboard interactions on the rendered bars
- Data table (when rendered) follows native table keyboard behaviour

## Props

- `label`: string (required) (default: —) — Accessible name
- `description`: string (default: —) — Extended description
- `categories`: array of `{ label: string; value: number }` (default: []) — Categories to plot
- `dataTable`: slot (default: —) — Optional fallback `<table>`
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<figure>`

## Acceptance Criteria

- [ ] Renders <figure> element with class="bar-chart"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="bar-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="bar-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above). **Breaking** for consumers that styled or queried `role="img"` on the figure.

## References

- Documentation: index.md
- CSS class: `.bar-chart` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
