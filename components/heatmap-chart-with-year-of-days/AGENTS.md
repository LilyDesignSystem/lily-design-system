# HeatmapChartWithYearOfDays

## Metadata

- Component: heatmap-chart-with-year-of-days
- PascalCase: HeatmapChartWithYearOfDays
- Description: a heatmap chart of one year of days, one cell per day in week columns and weekday rows
- Status: experimental — added 2026-10-22; implemented and unit-tested in all nine headless catalogs
- HTML tag: <figure>
- CSS class: .heatmap-chart-with-year-of-days
- Interactive: no

## Key Behaviors

- Renders a `<figure>` holding a `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>` containing the consumer-supplied inline `<svg>`
- Names the figure via `aria-label` from `label`
- Reflects `year` and `weekStart` as `data-year` and `data-week-start` on the `<figure>`; the layout is `row = (weekday − weekStart + 7) mod 7`, `column = floor((dayOfYear − 1 + row(1 January)) / 7)`, 53 or 54 columns
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
- `year`: number (required) -- the calendar year shown (`data-year`)
- `weekStart`: number (required) -- first weekday row, 0 = Sunday … 6 = Saturday (`data-week-start`); no default, it is locale-dependent
- `children`: slot (required) -- the inline `<svg>`
- `...restProps`: HTML attributes -- spread onto the root `<figure>`

## Acceptance Criteria

- [ ] Renders <figure> element with class="heatmap-chart-with-year-of-days"
- [ ] Graphic wrapper has role="img" and aria-label
- [ ] `data-year` and `data-week-start` reflect `year` and `weekStart`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="heatmap-chart-with-year-of-days-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).

## References

- Documentation: index.md
- CSS class: `.heatmap-chart-with-year-of-days` in css-style-sheet-template.css
- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
