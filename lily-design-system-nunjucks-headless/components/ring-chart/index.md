# RingChart

RingChart is a headless wrapper for a pie chart with a hollow centre, often used to show progress or a share of a total. It renders a `<figure>` holding a `<div class="ring-chart-graphic" role="img" aria-label>` around the consumer-supplied inline `<svg>`. No drawing happens in the macro (headless).

## Implementation Notes

- Root `<figure>` with the base class `ring-chart` first, then `params.classes`
- `role="img"`, `aria-label` from `params.label`, `aria-describedby` from `params.describedBy`
- Content from `params.html` (raw), `params.text` (escaped) or the caller block
- Mirrors `bar-chart` (which this library's placeholder omitted `role="img"` from); follows the Svelte canonical contract

## Props

- `label`: string (required) -- accessible name
- `describedBy`: string (optional) -- id of a description or a real data table (Svelte: `aria-describedby` via restProps)
- `id`, `classes`, `attributes`, `html` / `text` / caller content

## Usage

```njk
{% from "components/ring-chart/macro.njk" import ringChart %}
{% call ringChart({ label: "Example", describedBy: "desc" }) %}<svg>...</svg>{% endcall %}
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

Consumer CSS targets `.ring-chart`.

## Testing

See `macro.test.js`: base class, role, aria-label, describedby, html/caller content, attribute pass-through, no styles.

## Deviations

None from the Svelte contract; `aria-describedby` is the named `describedBy` param (idiom: Nunjucks has no rest props, `params.attributes` also works).

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="ring-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `params.dataTable` (raw HTML) renders the accessible table in `<div class="ring-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. `params.describedBy` now sets `aria-describedby` on the image wrapper; `id`, `classes` and `attributes` stay on the `<figure>`. Without a data table the wrapper is not rendered (except Angular, noted above).

## References

- bar-chart

---

Lily™ and Lily Design System™ are trademarks.
