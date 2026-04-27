# FlexStack

a flex layout container for vertical or horizontal stacking with
consistent gap

## Description

FlexStack arranges its children with `display: flex`, a configurable
`flex-direction`, and a single `gap` value. Optional `align-items`
and `justify-content` props let consumers tweak alignment without
writing custom CSS for simple cases.

## HTML tag

`<div>`

## CSS class

`flex-stack`

## Params

- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `direction` — `"row" | "column"`. Default `"column"`.
- `gap` — string. Gap CSS value. Default `"1rem"`.
- `align` — string. Optional `align-items` value.
- `justify` — string. Optional `justify-content` value.
- `label` — string. Optional `aria-label`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/flex-stack/macro.njk" import flexStack %}

{% call flexStack({ direction: "row", gap: "0.5rem" }) %}
  <button>One</button>
  <button>Two</button>
{% endcall %}
```

## Accessibility

- Purely structural; no ARIA role unless `label` is supplied.

## When to use

- Anywhere you need a consistent gap between adjacent items along a
  single axis.

## When not to use

- For two-dimensional grid layouts, use `Grid`.
- For variable-height masonry layouts, use `Masonry`.

## Headless

Only the inline styles needed for the flex behavior are emitted.

## Testing

`components/flex-stack/macro.test.js` verifies the base class,
`data-direction`, and the inline `display`, `flex-direction`,
`gap`, `align-items`, and `justify-content` styles.
