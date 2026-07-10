# SectionNav

A navigation container for section navigation links.

## Implementation Notes

- Renders a `<nav>` landmark with `aria-label` to identify it (e.g. "In this section")
- Wraps a `SectionList` of `SectionListItem` containing `SectionLink` children
- Companion components: `SectionList`, `SectionListItem`, `SectionLink`
- Spreads `restProps` onto the root `<nav>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible label for the navigation landmark |
| `children` | slot (required) | — | The `SectionList` and its children |
| `...restProps` | HTML attributes | — | Spread onto the root `<nav>` |

## Usage

```html
<SectionNav label="In this section">
  <SectionList>
    <SectionListItem><SectionLink href="/section-a">Section A</SectionLink></SectionListItem>
    <SectionListItem><SectionLink href="/section-b" current>Section B</SectionLink></SectionListItem>
  </SectionList>
</SectionNav>
```

## Keyboard Interactions

- Tab moves focus through the contained links

## ARIA

- `<nav>` element is a navigation landmark
- `aria-label` (from `label`) names the landmark
- `aria-current="page"` should be applied by the consumer to the current `SectionLink`

## When to Use

- Showing a sibling-page menu for a content section (typically rendered as a left-side or top sub-navigation)

## When Not to Use

- Use `BreadcrumbNav` for hierarchical position navigation
- Use `ContentsNav` for in-page anchor links
- Use `NavigationMenu` for global site navigation

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.section-nav` as the root class. No default styles are included.

## Related components

- `section-list` — list element used inside `SectionNav`
- `section-list-item` — list item
- `section-link` — individual link
- `contents-nav` — in-page anchor navigation
- `breadcrumb-nav` — hierarchical breadcrumb

## References

- [MDN nav element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)

---

Lily™ and Lily Design System™ are trademarks.
