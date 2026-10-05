# GaugeChart

A headless wrapper for a dial chart showing one value within a range, with optional thresholds. Use it for one measured value against a range such as a speedometer or a capacity dial.

**Status:** beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows.

The component renders a `<figure role="img">` around an inline `<svg>` that the consumer draws, names the figure with `aria-label` (from `label`), and lets the consumer reference a longer description or a real data `<table>` through `aria-describedby`. The component draws nothing and ships no scales, colours or animation; it exists to give every chart in the catalog the same accessible, stylable shell.

## Implementation Notes

- Renders `<figure class="gauge-chart {class}" role="img" aria-label={label}>` containing the children
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
<GaugeChart label="Gauge Chart of example data" aria-describedby="gauge-chart-data">
  <svg viewBox="0 0 100 100">…</svg>
</GaugeChart>
<table id="gauge-chart-data">…</table>
```

## Keyboard Interactions

- None. The chart is a single image to assistive technology.
- A referenced data table follows native table behaviour.

## ARIA

- `role="img"` exposes the chart as one image (its children are presentational)
- `aria-label` provides the accessible name
- `aria-describedby` (consumer-supplied) references the description or data table

## When to Use

- One measured value against a range such as a speedometer or a capacity dial
- When the chart needs the catalog's standard accessible shell and a stable class hook
- When a real data table accompanies the drawing as the accessible alternative

## When Not to Use

- Use `Meter` — a native `<meter>` for a value within a range with no dial; prefer it when no gauge drawing is needed
- Use `ProgressCircle` — progress toward completion rather than a reading on a scale
- Use `BarChart` or `ColumnChart` — comparing several values rather than one

## Headless

This component decides semantics only: the figure element, the image role and the name. It decides no geometry, scale, colour, legend or motion.

## Styles

Target `.gauge-chart` for the figure and style the supplied `<svg>` from consumer CSS. No default styles are included.

## Testing

- Renders a `<figure>` with class `gauge-chart` and `role="img"`
- `label` sets `aria-label`
- `aria-describedby` and other rest props reach the figure
- The consumer svg renders inside the figure

## Advice

Pass the dial `<svg>` (arc, needle, tick marks) as children. State the value, range and any threshold crossings in the accessible name or description, e.g. `aria-describedby` pointing at text that says "72 of 100, in the amber band".

Because `role="img"` makes descendants presentational, never put interactive controls inside the figure; place legends and toggles next to it.

## Related components

- `meter`
- `progress-circle`
- `bar-chart`
- `column-chart`
- `graphic-block` — chart wrapper with title and notes

## References

- [MDN figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
- [W3C WAI: Complex images](https://www.w3.org/WAI/tutorials/images/complex/)

---

Lily™ and Lily Design System™ are trademarks.
