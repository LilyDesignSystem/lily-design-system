# LineChart

## Metadata

- Component: line-chart
- PascalCase: LineChart
- Description: a line chart visualization connecting data points to display data
- HTML tag: <figure>
- CSS class: .line-chart
- Interactive: no

## Key Behaviors

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of one or more line series
- Data is supplied as `series` (each a sequence of `{ x, y }` points)
- Lines are interpolated between points; markers are optional
- An optional accessible data table is rendered via the `dataTable` slot
- Spreads `restProps` onto the root `<figure>`

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## Keyboard

- No keyboard interactions on the rendered lines
- Data table (when rendered) follows native table keyboard behaviour

## Props

- `label`: string (required) (default: —) — Accessible name
- `description`: string (default: —) — Extended description
- `series`: array of series (default: []) — Each series is `{ name: string; points: { x: number; y: number }[] }`
- `dataTable`: slot (default: —) — Optional fallback `<table>`
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<figure>`

## Acceptance Criteria

- [ ] Renders <figure> element with class="line-chart"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.line-chart` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
