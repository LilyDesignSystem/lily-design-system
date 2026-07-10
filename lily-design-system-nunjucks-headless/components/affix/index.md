# Affix

a wrapper that pins its content to a viewport position while the page scrolls

## Description

Affix renders a `<div class="affix">` whose inline style uses
`position: sticky` to pin its content to the top or bottom of its
scrolling ancestor. The offset is exposed as `data-offset-top` or
`data-offset-bottom` for consumer CSS hooks.

The component is structural and decorative — it has no ARIA role
because it does not change the meaning of the content it wraps.

## HTML tag

`<div>`

## CSS class

`affix`

## Params

- `offsetTop` — number (px). Distance from the top edge when affixed.
- `offsetBottom` — number (px). Distance from the bottom edge when
  affixed. If both are omitted, defaults to `top: 0`.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `label` — string. Optional `aria-label`.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/affix/macro.njk" import affix %}

{% call affix({ offsetTop: 16 }) %}
  <nav class="page-toc">…</nav>
{% endcall %}
```

Sticky to bottom:

```njk
{% call affix({ offsetBottom: 0 }) %}
  <div class="cookie-banner">…</div>
{% endcall %}
```

## Behavior

The macro emits inline `style="position: sticky; top: Npx"` (or
`bottom: Npx`). Consumers may replace this with JavaScript-based
sticky logic by overriding the inline style or wrapping the affix in
their own component.

## Accessibility

Affix has no ARIA role. It is purely structural; the content it wraps
keeps its own semantics. If the affixed content is a navigation
landmark, mark it with the appropriate element (e.g., `<nav>`).

## Headless

No CSS or JavaScript is bundled. The single inline style is part of
the documented behavior so the component works on first paint.

## Testing

`components/affix/macro.test.js` verifies the base class, the inline
sticky positioning, the data offset attributes, and slot/attribute
pass-through.

## References

- [MDN: position: sticky](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky_positioning)
- [Ant Design: Affix](https://ant.design/components/affix)

---

Lily™ and Lily Design System™ are trademarks.
