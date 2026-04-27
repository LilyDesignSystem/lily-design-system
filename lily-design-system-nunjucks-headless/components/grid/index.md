# Grid

a CSS grid layout container with configurable columns and gap

## Description

Grid renders a `<div>` with `display: grid` and a configurable
`grid-template-columns`. When `columns` is a number, the template is
`repeat({columns}, minmax(0, 1fr))`. When `columns` is a string, the
value is used verbatim — useful for custom track lists.

## HTML tag

`<div>`

## CSS class

`grid`

## Params

- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `columns` — number | string. Column count or
  `grid-template-columns` value. Default `12`.
- `gap` — string. Gap CSS value. Default `"1rem"`.
- `label` — string. Optional `aria-label`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/grid/macro.njk" import grid %}

{% call grid({ columns: 3, gap: "1.5rem" }) %}
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
{% endcall %}
```

```njk
{% call grid({ columns: "200px 1fr 200px" }) %}
  <aside>Side</aside>
  <main>Main</main>
  <aside>Side</aside>
{% endcall %}
```

## Accessibility

- Purely structural; no ARIA role unless `label` is supplied.

## When to use

- Two-dimensional layouts with consistent column counts.

## When not to use

- For one-axis stacks, prefer `FlexStack`.
- For variable-height collage layouts, prefer `Masonry`.

## Headless

Only the inline styles required for the grid behavior are emitted.

## Testing

`components/grid/macro.test.js` verifies the base class,
`data-columns`, and the inline `display`, `grid-template-columns`,
and `gap` styles.
