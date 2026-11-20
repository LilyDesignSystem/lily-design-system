# SectionLink

One section link in the navigation.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders an `<a>` linking to a section page
- When `current` is true, sets `aria-current="page"` to mark the active section
- Spreads `restProps` onto the root `<a>`

## Props

| Prop           | Type              | Default | Description                                   |
| -------------- | ----------------- | ------- | --------------------------------------------- |
| `href`         | string (required) | —       | Link target                                   |
| `current`      | boolean           | false   | Whether this link represents the current page |
| `children`     | slot (required)   | —       | Link text                                     |
| `...restProps` | HTML attributes   | —       | Spread onto the root `<a>`                    |

## Usage

```html
<SectionLink
  href="/section-a"
  current
  >Section A</SectionLink
>
```

## Keyboard Interactions

- Tab moves focus onto the link
- Enter activates the link (native browser behaviour)

## ARIA

- Native anchor accessibility
- `aria-current="page"` when `current` is true

## When to Use

- As the clickable element inside `SectionListItem`

## When Not to Use

- Use `BreadcrumbLink`, `ContentsLink`, `PaginationLink`, or `TreeLink` in their respective navs

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.section-link` as the root class. No default styles are included.

## Related components

- `section-nav` — landmark wrapper
- `section-list` / `section-list-item` — structural ancestors

## Known limitations

### Disabled links and link look-alikes

A link has no disabled state: the `disabled` attribute has no effect. Prefer not rendering an unavailable link. When the unavailable item must remain visible, set `aria-disabled="true"`, omit `href` (or guard every pointer and keyboard activation if the URL must remain), and use `tabindex="-1"` so it is not a misleading tab stop. Add `role="link"` when an anchor without `href` must retain link semantics.

Use a native `<button>` for an action. Styling an anchor as a button does not give it button keyboard or disabled behavior.

## References

- [MDN aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)

---

Lily™ and Lily Design System™ are trademarks.
