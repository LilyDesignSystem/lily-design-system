# AreaChart

A continuous-data visualization where the area below a line is filled, emphasising the magnitude of values over time rather than just the shape of the trend. Use it when the cumulative size of the value matters — page views, revenue, energy consumption — particularly when comparing two or three stacked or overlaid series.

The component is a headless wrapper around an inline `<svg>`: it renders a `<figure role="img">` with the chart inside, names the figure via `aria-label` (from `label`), and references an extended `description` and an optional `dataTable` slot via `aria-describedby`. The data table is the canonical accessible alternative — screen readers, users on text-only browsers, and exports all benefit from a real `<table>` rendering of the same numbers, and Lily™ encourages always providing it.

For trends without magnitude emphasis use `LineChart`; for categorical comparisons use `BarChart` or `ColumnChart`; for tiny inline trend marks use `Sparkline`.

## Implementation Notes

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of the area chart
- The figure has an accessible name from the `label` prop and an extended description from the `description` prop
- Data is supplied as `series` (one or more series of `{ x, y }` points)
- A textual data table can be rendered inside the same figure via the `dataTable` slot for screen readers and as a fallback when SVG is not available
- Spreads `restProps` onto the root `<figure>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible name for the chart |
| `description` | string | — | Extended description (becomes a `<figcaption>` and is referenced via `aria-describedby`) |
| `series` | array of series | [] | Each series is `{ name: string; points: { x: number; y: number }[] }` |
| `dataTable` | slot | — | Optional fallback `<table>` summarising the data |
| `...restProps` | HTML attributes | — | Spread onto the root `<figure>` |

## Usage

```html
<AreaChart label="Daily visits, last 30 days" series={visitSeries} description="Daily visit count for the past 30 days" />
```

## Keyboard Interactions

- No keyboard interactions on the rendered area itself
- If a data table is rendered, it follows native table keyboard behaviour

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` (from `label`) names the chart
- `aria-describedby` references the chart caption / data table

## When to Use

- Showing trends over time where the magnitude of the area emphasises the size of the value
- Comparing two or three series with stacked or overlaid areas

## When Not to Use

- Use `LineChart` when only the trend (not magnitude) matters
- Use `BarChart` or `ColumnChart` for discrete categorical data
- Use `Sparkline` for tiny inline trend indicators

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.area-chart` as the root class. No default styles are included.

## Related components

- `line-chart` — line chart for trend without area emphasis
- `bar-chart` / `column-chart` — categorical comparisons
- `scatter-chart` — relationship between two variables
- `graphic-block` — chart wrapper with title/notes
- `sparkline` — tiny inline trend

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)

---

Lily™ and Lily Design System™ are trademarks.
