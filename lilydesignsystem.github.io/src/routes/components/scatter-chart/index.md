# ScatterChart

A two-variable visualization where each observation is plotted as a single dot at its `(x, y)` coordinate, used to look at the relationship between two measurements — correlation, clustering, outliers — across a set of cases.

Unlike a line or area chart, the x-axis isn't ordered as a sequence and points aren't connected; each dot stands on its own. Multiple series can be plotted as distinct sets of dots so groups can be compared visually.

The component is a headless wrapper around an inline `<svg>`: it renders a `<figure role="img">` containing the dots, names the figure via `aria-label` (from `label`), and references an extended `description` and an optional `dataTable` slot via `aria-describedby`. The data table is the canonical accessible alternative — screen readers and exports both benefit from a real `<table>` rendering of the same numbers, and Lily™ encourages always providing it.

For ordered continuous data use `LineChart` or `AreaChart`. For categorical comparison use `BarChart` or `ColumnChart`.

## Implementation Notes

- Renders a `<figure role="img">` containing an inline `<svg>` rendering of dots positioned at `(x, y)` coordinates
- Each series is plotted as a distinct set of dots
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
<ScatterChart label="Height vs weight by age" series={healthSeries} description="Height vs weight for participants, grouped by age cohort" />
```

## Keyboard Interactions

- No keyboard interactions on the rendered dots
- Data table (when rendered) follows native table keyboard behaviour

## ARIA

- `role="img"` exposes the chart as a single image
- `aria-label` and `aria-describedby` provide the accessible name and description

## When to Use

- Visualising the relationship between two continuous variables
- Identifying clusters or outliers

## When Not to Use

- Use `LineChart` when the x-axis represents time or another ordered dimension and a connected trend is meaningful
- Use `BarChart` or `ColumnChart` for categorical comparisons

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.scatter-chart` as the root class. No default styles are included.

## Related components

- `line-chart` / `area-chart` — continuous-data alternatives
- `bar-chart` / `column-chart` — categorical alternatives
- `graphic-block` — chart wrapper with title/notes

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)

---

Lily™ and Lily Design System™ are trademarks.
