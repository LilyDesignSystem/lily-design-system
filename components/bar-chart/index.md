# BarChart

A horizontal bar chart visualization for displaying data.

## Implementation Notes

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of horizontal bars
- Data is supplied as `categories` (each with a label and value)
- Bars run horizontally; values are read along the x-axis
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
<BarChart label="Top services by usage" categories={topServices} description="Usage counts for the top 10 services" />
```

## Keyboard Interactions

- No keyboard interactions on the rendered bars
- Data table (when rendered) follows native table keyboard behaviour

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## When to Use

- Comparing many categorical values where category labels are long (horizontal bars give labels more room)
- Ranking lists

## When Not to Use

- Use `ColumnChart` (vertical bars) when category labels are short and you have many time-series-like categories
- Use `LineChart` for continuous data

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.bar-chart` as the root class. No default styles are included.

## Related components

- `column-chart` — vertical column equivalent
- `line-chart` / `area-chart` — continuous-data alternatives
- `graphic-block` — chart wrapper with title/notes

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
