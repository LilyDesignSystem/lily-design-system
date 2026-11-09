# DescriptionListItem

One key-value pair in a description list using dt and dd elements.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders a `<div>` around the consumer's `<dt>` (term) and `<dd>` (description) so each item is a single styling unit while preserving native list semantics
- Per HTML5, wrapping `<dt>`/`<dd>` pairs in a `<div>` inside `<dl>` is valid
- The consumer supplies the `<dt>` and `<dd>` as children; the component builds neither and takes no `label` (a `<div>` is generic, and ARIA does not allow naming one)
- Spreads `restProps` onto the root `<div>`

## Props

| Prop           | Type            | Default | Description                    |
| -------------- | --------------- | ------- | ------------------------------ |
| `children`     | slot (required) | —       | The `<dt>` and `<dd>` elements |
| `...restProps` | HTML attributes | —       | Spread onto the root `<div>`   |

## Usage

```html
<DescriptionListItem>
  <dt>Email</dt>
  <dd>user@example.com</dd>
</DescriptionListItem>
```

## Keyboard Interactions

- No keyboard interactions

## ARIA

- `<dt>` and `<dd>` retain their native term/description semantics inside the wrapper

## When to Use

- As a child of `DescriptionList`

## When Not to Use

- Use `SummaryListItem` when the row also needs an inline change link

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.description-list-item` as the root class. No default styles are included.

## Related components

- `description-list` — parent list
- `summary-list-item` — change-link summary list item

## References

- [MDN dt element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt)
- [MDN dd element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd)

---

Lily™ and Lily Design System™ are trademarks.
