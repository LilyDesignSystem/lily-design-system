# SectionListItem

One section navigation item.

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

## Related components

- `section-list` — parent list
- `section-link` — link inside the item

## References

- [MDN li element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)

---

Lily™ and Lily Design System™ are trademarks.
