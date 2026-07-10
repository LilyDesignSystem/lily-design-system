# LineChart

A continuous-data visualization that connects ordered points with line segments, emphasising the shape of the trend rather than its magnitude. The standard choice for showing change over time — temperatures, prices, response times — and for comparing the trend of multiple series side by side.

The component is a headless wrapper around an inline `<svg>`: it renders a `<figure role="img">` containing the chart, names the figure via `aria-label` (from `label`), and references an extended `description` and an optional `dataTable` slot via `aria-describedby`. The data table is the canonical accessible alternative — screen readers and exports both benefit from a real `<table>` rendering of the same numbers, and Lily™ encourages always providing it.

When the cumulative magnitude beneath the line matters more than the shape, use `AreaChart`. For categorical comparison use `BarChart` or `ColumnChart`. For tiny inline trends use `Sparkline`.

## Implementation Notes

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of one or more line series
- Data is supplied as `series` (each a sequence of `{ x, y }` points)
- Lines are interpolated between points; markers are optional
- An optional accessible data table is rendered via the `dataTable` slot
- Spreads `restProps` onto the root `<figure>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible name |
| `description` | string | — | Extended description |
| `series` | array of series | [] | Each series is `{ name: string; points: { x: number; y: number }[] }` |
| `dataTable` | slot | — | Optional fallback `<table>` |
| `...restProps` | HTML attributes | — | Spread onto the root `<figure>` |

## Usage

```html
<LineChart label="CPU usage over time" series={cpuSeries} description="CPU% over the last hour" />
```

## Keyboard Interactions

- No keyboard interactions on the rendered lines
- Data table (when rendered) follows native table keyboard behaviour

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## When to Use

- Showing trends over time, especially when only the line shape (not magnitude under it) matters
- Comparing multiple series of continuous data

## When Not to Use

- Use `AreaChart` to emphasise magnitude (area under the line)
- Use `BarChart` or `ColumnChart` for discrete categorical comparisons
- Use `Sparkline` for tiny inline trends

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.line-chart` as the root class. No default styles are included.

## Related components

- `area-chart` — area under the line
- `scatter-chart` — relationship between two variables
- `bar-chart` / `column-chart` — categorical alternatives
- `sparkline` — inline tiny trend
- `graphic-block` — chart wrapper with title/notes

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)

---

Lily™ and Lily Design System™ are trademarks.
