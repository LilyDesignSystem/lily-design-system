# Masonry

a masonry layout container for variable-height items

## Description

Masonry uses the CSS multi-column layout approach (`column-count`,
`column-gap`) to lay out variable-height items in vertically packed
columns. To keep individual cards intact, consumers should add
`break-inside: avoid` to the children.

## HTML tag

`<div>`

## CSS class

`masonry`

## Params

- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `columns` — number. Number of columns. Default `3`.
- `gap` — string. Gap CSS value. Default `"1rem"`.
- `label` — string. Optional `aria-label`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/masonry/macro.njk" import masonry %}

{% call masonry({ columns: 4, gap: "1.5rem" }) %}
  <article>Card one</article>
  <article>Card two</article>
  <article>Card three</article>
{% endcall %}
```

## Consumer CSS

```css
.masonry > * {
  break-inside: avoid;
  margin-bottom: 1rem;
}
```

## Accessibility

- Reading order follows the source order — keep children in a
  logical order.

## When to use

- Pinterest-style image / card galleries with varied heights.

## When not to use

- For consistent cell heights, prefer `Grid`.
- For one-axis stacks, prefer `FlexStack`.

## Headless

Only the inline column-count / column-gap styles are emitted.

## Testing

`components/masonry/macro.test.js` verifies the base class,
`data-columns`, and the inline `column-count` / `column-gap` styles.

---

Lily™ and Lily Design System™ are trademarks.
