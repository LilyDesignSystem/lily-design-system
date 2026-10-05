# RadarChart

## Metadata

- Component: radar-chart
- PascalCase: RadarChart
- Description: a chart plotting several axes from a shared centre as a polygon
- Status: beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows
- HTML tag: <figure>
- CSS class: .radar-chart
- Interactive: no

## Key Behaviors

- Renders a `<figure role="img">` containing the consumer-supplied inline `<svg>`
- Names the figure via `aria-label` from `label`
- `aria-describedby` (via restProps) references a description or data table
- Draws nothing; spreads `restProps` onto the root `<figure>`

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## Keyboard

- No keyboard interactions on the chart
- A data table (when rendered) follows native table keyboard behaviour

## Props

- `class`: string (default: `""`) -- appended to the base class
- `label`: string (required) -- accessible name
- `children`: slot (required) -- the inline `<svg>`
- `...restProps`: HTML attributes -- spread onto the root `<figure>`

## Acceptance Criteria

- [ ] Renders <figure> element with class="radar-chart"
- [ ] Has role="img" and aria-label
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.radar-chart` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
