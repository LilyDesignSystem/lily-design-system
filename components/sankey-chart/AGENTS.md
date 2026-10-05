# SankeyChart

## Metadata

- Component: sankey-chart
- PascalCase: SankeyChart
- Description: a flow chart where link width encodes the quantity moving between nodes
- Status: beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows
- HTML tag: <figure>
- CSS class: .sankey-chart
- Interactive: no

## Key Behaviors

- Renders a `<figure>` holding a `<div class="sankey-chart-graphic" role="img" aria-label>` containing the consumer-supplied inline `<svg>`
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

- [ ] Renders <figure> element with class="sankey-chart"
- [ ] Graphic wrapper has role="img" and aria-label
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="sankey-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="sankey-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).

## References

- Documentation: index.md
- CSS class: `.sankey-chart` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
