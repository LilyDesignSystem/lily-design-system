# FunnelChart

## Metadata

- Component: funnel-chart
- PascalCase: FunnelChart
- Description: a chart of stages narrowing from top to bottom, showing how a quantity drops at each step
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <figure>
- CSS class: .funnel-chart
- Interactive: no

## Key Behaviors

- Renders a `<figure>` holding a `<div class="funnel-chart-graphic" role="img" aria-label>` containing the consumer-supplied inline `<svg>`
- Names the image wrapper via `aria-label` from `label` (optional)
- An optional data table renders in `<div class="funnel-chart-data-table">`, a sibling outside `role="img"`
- Draws nothing; spreads `restProps` onto the root `<figure>`

## ARIA

- `role="img"` on the graphic wrapper exposes the chart as a single image
- `aria-label` provides the accessible name

## Keyboard

- No keyboard interactions on the chart
- A data table (when rendered) follows native table keyboard behaviour

## Props

- `class`: string (default: `""`) -- appended to the base class
- `label`: string (optional) -- accessible name
- `children`: slot (required) -- the inline `<svg>`
- `dataTable`: slot (optional) -- the accessible table alternative
- `...restProps`: HTML attributes -- spread onto the root `<figure>`

## Acceptance Criteria

- [ ] Renders <figure> element with class="funnel-chart"
- [ ] Graphic wrapper has role="img" and aria-label
- [ ] Data table renders outside role="img", only when supplied
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="funnel-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>`. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="funnel-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, which always renders an empty wrapper because it cannot detect projected content).

## References

- Documentation: index.md
- CSS class: `.funnel-chart` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
