# DescriptionListItem

One key-value pair in a description list using dt and dd elements.

## Implementation Notes

- Renders a `<div>` wrapping a `<dt>` (term) and a `<dd>` (description) so each item is a single styling unit while preserving native list semantics
- Per HTML5, wrapping `<dt>`/`<dd>` pairs in a `<div>` inside `<dl>` is valid
- Term and description text come through props or slots
- Spreads `restProps` onto the root `<div>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `term` | string (required) | — | Term shown in the `<dt>` |
| `description` | string | — | Description shown in the `<dd>` (when no children slot) |
| `children` | slot | — | Custom description content (overrides `description`) |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```html
<DescriptionListItem term="Email" description="user@example.com" />
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
