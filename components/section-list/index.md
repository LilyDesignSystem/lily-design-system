# SectionList

A list of section navigation items.

## Implementation Notes

- Renders an `<ol>` containing `SectionListItem` children
- Used inside `SectionNav` to enumerate the section's pages
- Spreads `restProps` onto the root `<ol>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children` | slot (required) | — | `SectionListItem` elements |
| `...restProps` | HTML attributes | — | Spread onto the root `<ol>` |

## Usage

```html
<SectionList>
  <SectionListItem><SectionLink href="/a">A</SectionLink></SectionListItem>
  <SectionListItem><SectionLink href="/b" current>B</SectionLink></SectionListItem>
</SectionList>
```

## Keyboard Interactions

- No keyboard interactions on the list itself

## ARIA

- Native ordered list semantics announce the count of items

## When to Use

- As the list element inside a `SectionNav`

## When Not to Use

- Use `BreadcrumbList`, `ContentsList`, `PaginationList`, or `TreeList` in their respective navs

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.section-list` as the root class. No default styles are included.

## Related components

- `section-nav` — parent landmark
- `section-list-item` — child list item
- `section-link` — link rendered inside each list item

## References

- [MDN ol element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
