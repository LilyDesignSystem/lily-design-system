# ContainerWithFluidWidth

a full-width content wrapper with horizontal padding

## Description

ContainerWithFluidWidth fills the full width of its parent and applies
configurable horizontal padding. Use it as a full-bleed wrapper that
keeps content from touching the viewport edges.

## HTML tag

`<div>`

## CSS class

`container-with-fluid-width`

## Params

- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `paddingInline` — string. Horizontal padding CSS value. Default `"1rem"`.
- `label` — string. Optional `aria-label`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/container-with-fluid-width/macro.njk" import containerWithFluidWidth %}

{% call containerWithFluidWidth({ paddingInline: "2rem" }) %}
  <p>Full-bleed content.</p>
{% endcall %}
```

## Accessibility

- Purely structural; no ARIA semantics by default.

## When to use

- Full-bleed background bands that still need inner padding.
- Top-level page wrappers that span the viewport.

## When not to use

- For width-constrained columns, use `ContainerWithFixedWidth`.

## Headless

Only the inline styles required for full-width and horizontal padding
are emitted. Backgrounds, vertical padding, and typography belong to
the consumer.

## Testing

`components/container-with-fluid-width/macro.test.js` verifies the
base class, `data-padding-inline`, and the inline `width` /
`padding-inline` styles.

---

Lily™ and Lily Design System™ are trademarks.
