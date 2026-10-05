# ChoroplethChart

A headless wrapper for a map chart that shades regions by the value of a measure. It gives the drawing the catalog's standard accessible shell: a named image plus an optional data-table alternative.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The component renders a `<figure>` holding a `<div class="choropleth-chart-graphic" role="img" aria-label>` around an inline `<svg>` that the consumer draws, and an optional sibling `<div class="choropleth-chart-data-table">` for the accessible table. The component draws nothing and ships no scales, colours or animation.

## Implementation Notes

- Renders `<figure class="choropleth-chart {class}">` containing the image wrapper and, when supplied, the data-table wrapper
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
<ChoroplethChart label="Describe the chart">
  <svg viewBox="0 0 100 100">…</svg>
  {#snippet dataTable()}
    <table><caption>Values</caption>…</table>
  {/snippet}
</ChoroplethChart>
```

## Keyboard Interactions

- None on the graphic. The chart is a single image to assistive technology.
- The data table follows native table behaviour.

## ARIA

- `role="img"` on the graphic wrapper exposes the chart as one image (its children are presentational)
- `aria-label` provides the accessible name
- The data table is outside `role="img"` so assistive technology can read it

## When to Use

- A measure compared across regions such as countries, counties or postcodes
- Showing geographic patterns at a glance
- When a real data table accompanies the drawing as the accessible alternative

## When Not to Use

- Use `TileMap` — a map with pins or a map of places rather than shaded regions
- Use `BarChart` — when exact comparison between regions matters more than geography
- Use a table — when the user needs to look up a specific region

## Headless

This component decides semantics only: the figure element, the image role, the name and the table placement. It decides no geometry, scale, colour, legend or motion.

## Styles

Target `.choropleth-chart` for the figure, `.choropleth-chart-graphic` for the image wrapper and `.choropleth-chart-data-table` for the table wrapper. Style the supplied `<svg>` from consumer CSS. No default styles are included.

## Testing

- Renders a `<figure>` with class `choropleth-chart` and a `.choropleth-chart-graphic` child with `role="img"`
- `label` sets `aria-label`
- The consumer svg renders inside the image wrapper
- The data table renders in a `.choropleth-chart-data-table` sibling, outside `role="img"`, only when supplied
- Rest props reach the figure

## Advice

Pass the shaded regions as `<svg>` paths. Region size misleads (large, sparse regions dominate), so give every region and its value in the data table and never rely on colour alone.

Because `role="img"` makes descendants presentational, never put interactive controls inside the graphic; place legends and toggles next to it.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="choropleth-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>`. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="choropleth-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, which always renders an empty wrapper because it cannot detect projected content).

## Related components

- `tile-map`
- `bar-chart`
- `heatmap-chart`
- `graphic-block`

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
- [W3C WAI: Complex images](https://www.w3.org/WAI/tutorials/images/complex/)

---

Lily™ and Lily Design System™ are trademarks.
