# PieChart

A headless wrapper for a circular chart divided into slices that show each part of a whole. It gives the drawing the catalog's standard accessible shell: a named image plus an optional data-table alternative.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The component renders a `<figure>` holding a `<div class="pie-chart-graphic" role="img" aria-label>` around an inline `<svg>` that the consumer draws, and an optional sibling `<div class="pie-chart-data-table">` for the accessible table. The component draws nothing and ships no scales, colours or animation.

## Implementation Notes

- Renders `<figure class="pie-chart {class}">` containing the image wrapper and, when supplied, the data-table wrapper
- The consumer supplies the `<svg>` (and any legend markup that belongs inside the image)
- `restProps` spread onto the `<figure>`
- No internal state, no drawing, no data handling

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `label` | string (optional) | — | Accessible name of the image wrapper |
| `children` | slot (required) | — | The consumer-drawn inline `<svg>` |
| `dataTable` | slot (optional) | — | The accessible table alternative, rendered outside `role="img"` |
| `...restProps` | HTML attributes | — | Spread onto the root `<figure>` |

## Usage

```svelte
<PieChart label="Describe the chart">
  <svg viewBox="0 0 100 100">…</svg>
  {#snippet dataTable()}
    <table><caption>Values</caption>…</table>
  {/snippet}
</PieChart>
```

## Keyboard Interactions

- None on the graphic. The chart is a single image to assistive technology.
- The data table follows native table behaviour.

## ARIA

- `role="img"` on the graphic wrapper exposes the chart as one image (its children are presentational)
- `aria-label` provides the accessible name
- The data table is outside `role="img"` so assistive technology can read it

## When to Use

- The parts of one whole, with only a few categories (about five or fewer)
- Showing a dominant share at a glance
- When a real data table accompanies the drawing as the accessible alternative

## When Not to Use

- Use `RingChart` — the same idea with a hollow centre, handy for a total or label in the middle
- Use `BarChart` or `ColumnChart` — comparing many categories or close values, which angles show poorly
- Use `Meter` or `ProgressCircle` — a single value within a range rather than parts of a whole

## Headless

This component decides semantics only: the figure element, the image role, the name and the table placement. It decides no geometry, scale, colour, legend or motion.

## Styles

Target `.pie-chart` for the figure, `.pie-chart-graphic` for the image wrapper and `.pie-chart-data-table` for the table wrapper. Style the supplied `<svg>` from consumer CSS. No default styles are included.

## Testing

- Renders a `<figure>` with class `pie-chart` and a `.pie-chart-graphic` child with `role="img"`
- `label` sets `aria-label`
- The consumer svg renders inside the image wrapper
- The data table renders in a `.pie-chart-data-table` sibling, outside `role="img"`, only when supplied
- Rest props reach the figure

## Advice

Pass the slices as `<svg>` paths. Label slices directly where they fit and always supply the exact values in the data table, because angle is hard to read precisely. Do not rely on colour alone to tell slices apart.

Because `role="img"` makes descendants presentational, never put interactive controls inside the graphic; place legends and toggles next to it.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="pie-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>`. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="pie-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, which always renders an empty wrapper because it cannot detect projected content).

## Related components

- `ring-chart`
- `bar-chart`
- `column-chart`
- `meter`
- `graphic-block`

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
- [W3C WAI: Complex images](https://www.w3.org/WAI/tutorials/images/complex/)

---

Lily™ and Lily Design System™ are trademarks.
