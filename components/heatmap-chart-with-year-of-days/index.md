# HeatmapChartWithYearOfDays

A headless wrapper for a year-of-days heatmap: one cell per day of one year, laid out in week columns and weekday rows, with cell colour encoding the value of each day. It specialises `HeatmapChart` (same shell, same data-table sibling) and adds the two facts the layout needs, `year` and `weekStart`. Use it for a per-day measure across a year, such as contributions, visits, appointments or readings per day.

**Status:** experimental — added 2026-10-22 from the chanhdai.com `github-contributions` review ([chanhdai-lessons](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/chanhdai-lessons/index.md)); implemented and unit-tested in all nine headless catalogs, not yet exercised in composed flows.

The component renders a `<figure>` holding a `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>` around an inline `<svg>` that the consumer draws, names the figure with `aria-label` (from `label`), and lets the consumer reference a longer description or a real data `<table>` through `aria-describedby`. The component draws nothing and ships no scales, colours or animation; it exists to give every chart in the catalog the same accessible, stylable shell.

## Implementation Notes

- Renders `<figure class="heatmap-chart-with-year-of-days {class}" data-year data-week-start>` containing the children
- The consumer supplies the `<svg>` (and any legend or caption markup)
- `restProps` — including `aria-describedby` — spread onto the `<figure>`
- No internal state, no drawing, no data handling

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `label` | string (required) | — | Accessible name |
| `year` | number (required) | — | The calendar year shown; reflected as `data-year` |
| `weekStart` | number (required) | — | First weekday row, 0 = Sunday … 6 = Saturday; reflected as `data-week-start`. No default: it is locale-dependent |
| `children` | slot (required) | — | The consumer-drawn inline `<svg>` |
| `...restProps` | HTML attributes | — | Spread onto the root `<figure>`, e.g. `aria-describedby` |

## Usage

```svelte
<HeatmapChartWithYearOfDays label="Activity per day in 2026" year={2026} weekStart={1} aria-describedby="heatmap-chart-with-year-of-days-data">
  <svg viewBox="0 0 100 100">…</svg>
</HeatmapChartWithYearOfDays>
<table id="heatmap-chart-with-year-of-days-data">…</table>
```

## Layout contract

The consumer draws the grid; the component names it and carries the two numbers the drawing needs. The grid has seven weekday **rows** and one **column** per week, one cell per day of `year`:

- `row(d) = (weekday(d) − weekStart + 7) mod 7`, with `weekday` 0 = Sunday … 6 = Saturday, so the first row is the weekday `weekStart` names.
- `column(d) = floor((dayOfYear(d) − 1 + row(1 January)) / 7)`, with `dayOfYear(1 January) = 1`. The first column holds 1 January; the grid has 53 or 54 columns, and the first and last columns are partly empty.
- 365 cells, or 366 in a leap year; empty positions draw nothing.

`shared/year-of-days-layout.ts` implements this once (`yearOfDaysCells(year, weekStart)` returns `{ date, dayOfYear, column, row }` for every day; `columnCount` and `daysInYear` are alongside), in UTC calendar dates so a time zone cannot move a day. It is a pure module a drawing routine copies in, like the other `shared/` modules; the component itself does not call it.

`weekStart` has no default because the first day of the week depends on the reader's locale (Sunday, Monday and Saturday are all in use): the consumer passes it, from `Intl.Locale#getWeekInfo()` or its own setting. Month and weekday labels, and the legend, come from the consumer through `Intl`; the component supplies no strings.

## Accessible alternative

Colour must not be the only carrier of the value (WCAG 1.4.1), and 365 unnamed cells are not an accessible chart. Supply a `dataTable`: a real `<table>` with one row per day, or per week or month when the consumer summarises, listing the date and the value. Do not rely on a `<title>` inside each cell: the graphic is `role="img"`, so its children are presentational and those titles are never exposed.

## Keyboard Interactions

- None. The chart is a single image to assistive technology.
- A referenced data table follows native table behaviour.

## ARIA

- `role="img"` exposes the chart as one image (its children are presentational)
- `aria-label` provides the accessible name
- `aria-describedby` (consumer-supplied) references the description or data table

## When to Use

- A per-day measure across one year, where the reader looks for streaks, gaps and seasons
- When the chart needs the catalog's standard accessible shell and a stable class hook
- When a real data table accompanies the drawing as the accessible alternative

## When Not to Use

- Use `HeatmapChart` — when the two dimensions are not a calendar year (weekday by hour, for example)
- Use `LineChart` — when the trend matters more than the pattern of individual days
- Use `DataTable` — when readers need exact values and not a pattern
- Use `CalendarYearTable` or `CalendarMonthTable` — when readers pick or read specific dates, not scan a pattern

## Headless

This component decides semantics only: the figure element, the image role and the name. It decides no geometry, scale, colour, legend or motion.

## Styles

Target `.heatmap-chart-with-year-of-days` for the figure and style the supplied `<svg>` from consumer CSS. No default styles are included.

## Testing

- `year` and `weekStart` reach the figure as `data-year` and `data-week-start`
- Renders a `<figure>` with class `heatmap-chart-with-year-of-days` and a `.heatmap-chart-with-year-of-days-graphic` child with `role="img"`
- `label` sets `aria-label`
- `aria-describedby` and other rest props reach the figure
- The consumer svg renders inside the figure

## Advice

Fetching the per-day data, and any caching of it, is the consumer's job; the component takes the finished drawing. Pass the grid `<svg>` as children. Colour alone must never carry the value (WCAG 1.4.1): supply the same numbers as a real `<table>` and point `aria-describedby` at it.

Because `role="img"` makes descendants presentational, never put interactive controls inside the figure; place legends and toggles next to it.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="heatmap-chart-with-year-of-days-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).

## Related components

- `heatmap-chart` — the general grid this specialises
- `calendar-year-table`
- `scatter-chart`
- `data-table`
- `calendar-month-table`
- `line-chart`
- `graphic-block` — chart wrapper with title and notes

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
- [W3C WAI: Complex images](https://www.w3.org/WAI/tutorials/images/complex/)

---

Lily™ and Lily Design System™ are trademarks.
