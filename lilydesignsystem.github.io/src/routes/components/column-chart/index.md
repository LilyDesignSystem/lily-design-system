# ColumnChart

A categorical visualization with bars running vertically, used to compare a measured value across a set of named categories. Vertical orientation reads naturally for time-ordered categories (months, quarters, releases) and works well when category labels are short.

The component is a headless wrapper around an inline `<svg>`: it renders a `<figure role="img">` containing the columns, names the figure via `aria-label` (from `label`), and references an extended `description` and an optional `dataTable` slot via `aria-describedby`. The data table is the canonical accessible alternative — screen readers and exports both benefit from a real `<table>` rendering of the same numbers, and Lily™ encourages always providing it.

For the same comparison with horizontal bars (better for long labels) use `BarChart`. For trends over continuous data use `LineChart` or `AreaChart`. For tiny inline summaries use `Sparkline`.

## Implementation Notes

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of vertical columns
- Data is supplied as `categories` (each with a label and value)
- Columns run vertically; values are read along the y-axis
- An optional accessible data table is rendered via the `dataTable` slot
- Spreads `restProps` onto the root `<figure>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible name |
| `description` | string | — | Extended description |
| `categories` | array of `{ label: string; value: number }` | [] | Categories to plot |
| `dataTable` | slot | — | Optional fallback `<table>` |
| `...restProps` | HTML attributes | — | Spread onto the root `<figure>` |

## Usage

```html
<ColumnChart label="Monthly revenue" categories={monthlyRevenue} description="Revenue per month for the last year" />
```

## Keyboard Interactions

- No keyboard interactions on the rendered columns
- Data table (when rendered) follows native table keyboard behaviour

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## When to Use

- Comparing categorical values where the categories have short labels (months, quarters)
- Time series at low resolution

## When Not to Use

- Use `BarChart` (horizontal) when category labels are long
- Use `LineChart` or `AreaChart` for high-resolution time series

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.column-chart` as the root class. No default styles are included.

## Related components

- `bar-chart` — horizontal bar equivalent
- `line-chart` / `area-chart` — continuous-data alternatives
- `graphic-block` — chart wrapper with title/notes

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)

---

Lily™ and Lily Design System™ are trademarks.
