# ContainerWithFixedWidth

a centered content wrapper with a fixed max-width breakpoint

## Description

ContainerWithFixedWidth constrains its children to a maximum width and
centers them horizontally using `margin-inline: auto`. Use it for page
gutters, article columns, and any layout where the content should not
exceed a specific breakpoint.

## HTML tag

`<div>`

## CSS class

`container-with-fixed-width`

## Params

- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `maxWidth` — string. Max width CSS value. Default `"1200px"`.
- `label` — string. Optional `aria-label`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/container-with-fixed-width/macro.njk" import containerWithFixedWidth %}

{% call containerWithFixedWidth({ maxWidth: "960px" }) %}
  <p>Page content.</p>
{% endcall %}
```

## Accessibility

- Purely structural; no ARIA semantics by default.

## When to use

- Page-level centered content columns.
- Section wrappers that should not exceed a specific width.

## When not to use

- For full-bleed sections, use `ContainerWithFluidWidth`.

## Headless

This component sets only the inline styles required for centering and
width capping. All other styling (padding, background, typography) is
the consumer's responsibility.

## Testing

`components/container-with-fixed-width/macro.test.js` verifies the
base class, `data-max-width`, and the inline `max-width` /
`margin-inline` styles.

---

Lily™ and Lily Design System™ are trademarks.
