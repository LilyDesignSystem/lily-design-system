# AreaChart

## Metadata

- Component: area-chart
- PascalCase: AreaChart
- Description: an area chart visualization showing sized components in continuous data
- HTML tag: <figure>
- CSS class: .area-chart
- Interactive: no

## Key Behaviors

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of the area chart
- The figure has an accessible name from the `label` prop and an extended description from the `description` prop
- Data is supplied as `series` (one or more series of `{ x, y }` points)
- A textual data table can be rendered inside the same figure via the `dataTable` slot for screen readers and as a fallback when SVG is not available
- Spreads `restProps` onto the root `<figure>`

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` (from `label`) names the chart
- `aria-describedby` references the chart caption / data table

## Keyboard

- No keyboard interactions on the rendered area itself
- If a data table is rendered, it follows native table keyboard behaviour

## Props

- `label`: string (required) (default: —) — Accessible name for the chart
- `description`: string (default: —) — Extended description (becomes a `<figcaption>` and is referenced via `aria-describedby`)
- `series`: array of series (default: []) — Each series is `{ name: string; points: { x: number; y: number }[] }`
- `dataTable`: slot (default: —) — Optional fallback `<table>` summarising the data
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<figure>`

## Acceptance Criteria

- [ ] Renders <figure> element with class="area-chart"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.area-chart` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
