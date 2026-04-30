# ColumnChart

## Metadata

- Component: column-chart
- PascalCase: ColumnChart
- Description: a vertical column chart visualization for displaying data
- HTML tag: <figure>
- CSS class: .column-chart
- Interactive: no

## Key Behaviors

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of vertical columns
- Data is supplied as `categories` (each with a label and value)
- Columns run vertically; values are read along the y-axis
- An optional accessible data table is rendered via the `dataTable` slot
- Spreads `restProps` onto the root `<figure>`

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## Keyboard

- No keyboard interactions on the rendered columns
- Data table (when rendered) follows native table keyboard behaviour

## Props

- `label`: string (required) (default: —) — Accessible name
- `description`: string (default: —) — Extended description
- `categories`: array of `{ label: string; value: number }` (default: []) — Categories to plot
- `dataTable`: slot (default: —) — Optional fallback `<table>`
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<figure>`

## Acceptance Criteria

- [ ] Renders <figure> element with class="column-chart"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.column-chart` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
