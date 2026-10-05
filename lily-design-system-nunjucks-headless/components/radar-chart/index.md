# RadarChart

RadarChart is a headless wrapper for a radar (spider) chart comparing several variables on radial axes. It renders a `<figure role="img">` around the consumer-supplied inline `<svg>`. No drawing happens in the macro (headless).

## Implementation Notes

- Root `<figure>` with the base class `radar-chart` first, then `params.classes`
- `role="img"`, `aria-label` from `params.label`, `aria-describedby` from `params.describedBy`
- Content from `params.html` (raw), `params.text` (escaped) or the caller block
- Mirrors `bar-chart` (which this library's placeholder omitted `role="img"` from); follows the Svelte canonical contract

## Props

- `label`: string (required) -- accessible name
- `describedBy`: string (optional) -- id of a description or a real data table (Svelte: `aria-describedby` via restProps)
- `id`, `classes`, `attributes`, `html` / `text` / caller content

## Usage

```njk
{% from "components/radar-chart/macro.njk" import radarChart %}
{% call radarChart({ label: "Example", describedBy: "desc" }) %}<svg>...</svg>{% endcall %}
```

## Keyboard Interactions

None. The chart is a single image to assistive technology.

## ARIA

`role="img"`, `aria-label`, optional `aria-describedby`.

## When to Use

- When a chart image needs a name and a text or table alternative.

## When Not to Use

- When the data is better shown as a real table, use `data-table`.

## Headless

No drawing, no CSS, no inline styles; the consumer supplies the svg.

## Styles

Consumer CSS targets `.radar-chart`.

## Testing

See `macro.test.js`: base class, role, aria-label, describedby, html/caller content, attribute pass-through, no styles.

## Deviations

None from the Svelte contract; `aria-describedby` is the named `describedBy` param (idiom: Nunjucks has no rest props, `params.attributes` also works).

## References

- bar-chart

---

Lily™ and Lily Design System™ are trademarks.
