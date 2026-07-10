# ClampText

a text container that truncates content to a maximum number of lines

## Description

ClampText wraps content in a `<div>` and exposes the maximum number of
visible lines as both a `data-lines` attribute and a CSS custom property
(`--clamp-text-lines`). The full text remains in the DOM, so assistive
technologies can still read it. The visual truncation is left to the
consumer's stylesheet — typically with `line-clamp` or
`-webkit-line-clamp`.

## HTML tag

`<div>`

## CSS class

`clamp-text`

## Params

- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `lines` — number. Maximum number of visible lines. Default `2`.
- `label` — string. Optional `aria-label`.
- `id` — string. Element id.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/clamp-text/macro.njk" import clampText %}

{{ clampText({
  text: "Long paragraph that should be truncated after three lines.",
  lines: 3
}) }}
```

## Accessibility

- The full text content remains in the DOM and accessible to screen
  readers.
- `aria-label` is optional — only use it if the truncated visual
  output needs an alternative description.

## When to use

- Card descriptions, comment previews, and other UI where a maximum
  height is needed for layout.

## When not to use

- For collapsible long-form content with an explicit "Show more"
  toggle, use `Collapsible` or `Expander` instead.

## Headless

This component ships no CSS. Consumers apply truncation:

```css
.clamp-text {
  display: -webkit-box;
  -webkit-line-clamp: var(--clamp-text-lines);
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Testing

`components/clamp-text/macro.test.js` verifies the base class,
`data-lines`, and the inline `--clamp-text-lines` custom property.

## References

- [MDN: line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp)

---

Lily™ and Lily Design System™ are trademarks.
