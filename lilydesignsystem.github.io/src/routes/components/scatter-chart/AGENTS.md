# ScatterChart

## Metadata

- Component: scatter-chart
- PascalCase: ScatterChart
- Description: a scatter chart visualization using dots to display data
- HTML tag: <figure>
- CSS class: .scatter-chart
- Interactive: no

## Key Behaviors

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of dots positioned at `(x, y)` coordinates
- Each series is plotted as a distinct set of dots
- An optional accessible data table is rendered via the `dataTable` slot
- Spreads `restProps` onto the root `<figure>`

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## Keyboard

- No keyboard interactions on the rendered dots
- Data table (when rendered) follows native table keyboard behaviour

## Props

- `label`: string (required) (default: —) — Accessible name
- `description`: string (default: —) — Extended description
- `series`: array of series (default: []) — Each series is `{ name: string; points: { x: number; y: number }[] }`
- `dataTable`: slot (default: —) — Optional fallback `<table>`
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<figure>`

## Acceptance Criteria

- [ ] Renders <figure> element with class="scatter-chart"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.scatter-chart` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
