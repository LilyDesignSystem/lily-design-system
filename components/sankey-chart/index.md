# SankeyChart

A headless wrapper for a flow chart where link width encodes the quantity moving between nodes. Use it for flows between stages or categories where the quantity moved matters, such as funnels, budgets or energy transfer.

**Status:** beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows.

The component renders a `<figure>` holding a `<div class="sankey-chart-graphic" role="img" aria-label>` around an inline `<svg>` that the consumer draws, names the figure with `aria-label` (from `label`), and lets the consumer reference a longer description or a real data `<table>` through `aria-describedby`. The component draws nothing and ships no scales, colours or animation; it exists to give every chart in the catalog the same accessible, stylable shell.

## Implementation Notes

- Renders `<figure class="sankey-chart {class}>` containing the children
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
<SankeyChart label="Sankey Chart of example data" aria-describedby="sankey-chart-data">
  <svg viewBox="0 0 100 100">…</svg>
</SankeyChart>
<table id="sankey-chart-data">…</table>
```

## Keyboard Interactions

- None. The chart is a single image to assistive technology.
- A referenced data table follows native table behaviour.

## ARIA

- `role="img"` exposes the chart as one image (its children are presentational)
- `aria-label` provides the accessible name
- `aria-describedby` (consumer-supplied) references the description or data table

## When to Use

- Flows between stages or categories where the quantity moved matters, such as funnels, budgets or energy transfer
- When the chart needs the catalog's standard accessible shell and a stable class hook
- When a real data table accompanies the drawing as the accessible alternative

## When Not to Use

- Use `BarChart` — comparing totals, not flows between them
- Use `TimelineList` — sequential events rather than quantities moving between nodes
- Use `DataTable` — when only the flow figures are needed

## Headless

This component decides semantics only: the figure element, the image role and the name. It decides no geometry, scale, colour, legend or motion.

## Styles

Target `.sankey-chart` for the figure and style the supplied `<svg>` from consumer CSS. No default styles are included.

## Testing

- Renders a `<figure>` with class `sankey-chart` and a `.sankey-chart-graphic` child with `role="img"`
- `label` sets `aria-label`
- `aria-describedby` and other rest props reach the figure
- The consumer svg renders inside the figure

## Advice

Pass the node and link `<svg>` as children. The links carry the meaning, so supply the source, target and quantity of each as a `<table>` referenced by `aria-describedby`.

Because `role="img"` makes descendants presentational, never put interactive controls inside the figure; place legends and toggles next to it.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="sankey-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="sankey-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).

## Related components

- `bar-chart`
- `timeline-list`
- `data-table`
- `line-chart`
- `graphic-block` — chart wrapper with title and notes

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
- [W3C WAI: Complex images](https://www.w3.org/WAI/tutorials/images/complex/)

---

Lily™ and Lily Design System™ are trademarks.
