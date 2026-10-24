# SectionListItem

One section navigation item.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders a `<li>` containing a `SectionLink`
- Used inside `SectionList`
- Spreads `restProps` onto the root `<li>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children` | slot (required) | — | Typically a single `SectionLink` |
| `...restProps` | HTML attributes | — | Spread onto the root `<li>` |

## Usage

```html
<SectionListItem><SectionLink href="/a">A</SectionLink></SectionListItem>
```

## Keyboard Interactions

- No keyboard interactions on the list item itself; the inner link receives focus

## ARIA

- Native `<li>` semantics

## When to Use

- As a child of `SectionList` enumerating section navigation links

## When Not to Use

- Use the appropriate `*ListItem` for other navigation patterns (e.g. `BreadcrumbListItem`)

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.section-list-item` as the root class. No default styles are included.

## Advice

- **Developers**: `current` sets `data-current` on the `<li>` and nothing else: the item sets no `aria-current`. Put `aria-current="page"` on the link inside (or pass it as a rest prop on the item) so assistive technology announces the current section.
- **Designers**: Style the current section with more than colour (weight, a marker, or an underline), selecting it with `[data-current]` or `[aria-current="page"]`.

## Related components

- `section-list` — parent list
- `section-link` — link inside the item

## References

- [MDN li element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)

---

Lily™ and Lily Design System™ are trademarks.
