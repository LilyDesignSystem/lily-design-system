# HeatmapChart

A headless wrapper for a grid chart where cell colour encodes the value at each row and column. Use it for a value across two categorical or ordinal dimensions, such as activity by weekday and hour.

**Status:** beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows.

The component renders a `<figure>` holding a `<div class="heatmap-chart-graphic" role="img" aria-label>` around an inline `<svg>` that the consumer draws, names the figure with `aria-label` (from `label`), and lets the consumer reference a longer description or a real data `<table>` through `aria-describedby`. The component draws nothing and ships no scales, colours or animation; it exists to give every chart in the catalog the same accessible, stylable shell.

## Implementation Notes

- Renders `<figure class="heatmap-chart {class}>` containing the children
- The consumer supplies the `<svg>` (and any legend or caption markup)
- `restProps` — including `aria-describedby` — spread onto the `<figure>`
- No internal state, no drawing, no data handling

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `label` | string (required) | — | Accessible name |
| `children` | slot (required) | — | The consumer-drawn inline `<svg>` |
| `...restProps` | HTML attributes | — | Spread onto the root `<figure>`, e.g. `aria-describedby` |

## Usage

```svelte
<HeatmapChart label="Heatmap Chart of example data" aria-describedby="heatmap-chart-data">
  <svg viewBox="0 0 100 100">…</svg>
</HeatmapChart>
<table id="heatmap-chart-data">…</table>
```

## Keyboard Interactions

- None. The chart is a single image to assistive technology.
- A referenced data table follows native table behaviour.

## ARIA

- `role="img"` exposes the chart as one image (its children are presentational)
- `aria-label` provides the accessible name
- `aria-describedby` (consumer-supplied) references the description or data table

## When to Use

- A value across two categorical or ordinal dimensions, such as activity by weekday and hour
- When the chart needs the catalog's standard accessible shell and a stable class hook
- When a real data table accompanies the drawing as the accessible alternative

## When Not to Use

- Use `ScatterChart` — individual points on two continuous axes rather than a binned grid
- Use `DataTable` — when readers need exact values and not a pattern
- Use `CalendarMonthTable` — when the grid is literally a calendar

## Headless

This component decides semantics only: the figure element, the image role and the name. It decides no geometry, scale, colour, legend or motion.

## Styles

Target `.heatmap-chart` for the figure and style the supplied `<svg>` from consumer CSS. No default styles are included.

## Testing

- Renders a `<figure>` with class `heatmap-chart` and a `.heatmap-chart-graphic` child with `role="img"`
- `label` sets `aria-label`
- `aria-describedby` and other rest props reach the figure
- The consumer svg renders inside the figure

## Advice

Pass the grid `<svg>` as children. Colour alone must never carry the value (WCAG 1.4.1): supply the same numbers as a real `<table>` and point `aria-describedby` at it.

Because `role="img"` makes descendants presentational, never put interactive controls inside the figure; place legends and toggles next to it.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="heatmap-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="heatmap-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).

## Related components

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
