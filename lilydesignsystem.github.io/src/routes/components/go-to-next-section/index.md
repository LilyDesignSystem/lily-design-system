# GoToNextSection

A link that takes users to the next section of the current page.

## Implementation Notes

- Renders an `<a>` with class `go-to-next-section` linking to a section anchor on the same page
- Accepts a `href` prop pointing at the next section's anchor (e.g. `#section-3`)
- Accepts a `label` prop for the visible link text
- Companion to `GoToPreviousSection` and `GoToTop`

## Props

- `href`: string (required) — anchor URL of the next section, typically `#section-id`
- `label`: string (required) — visible link text
- `className`: string (optional) — extra CSS classes appended to `go-to-next-section`

## Usage

```html
<GoToNextSection href="#section-3" label="Next section: Implementation" />
```

## Keyboard Interactions

- Tab: moves focus onto the link
- Enter: navigates to the linked anchor (native browser behavior)

## ARIA

- Native anchor accessibility — the `href` provides the destination, the link text provides the accessible name

## When to Use

- On long single-page documents where users benefit from sequential navigation between adjacent sections.
- Together with `GoToPreviousSection` to give readers symmetric forward/back movement at the end of each section.
- When section anchor IDs are stable enough to link to.

## When Not to Use

- Do not use to navigate between separate pages — use a regular link or breadcrumb pattern.
- Do not use as the primary on-page navigation for an article — use `ContentsNav` or `SectionNav` instead.
- Do not use when there is no logical "next" section (e.g. on the last section of a page).

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.go-to-next-section` as the root class. No default styles are included.

## Related components

- `go-to-previous-section` — a link that takes users to the previous section of the current page
- `go-to-top` — a link that returns users to the top of a long page
- `section-nav` — a navigation container for section navigation links

## References

- Documentation: index.md
- CSS class: `.go-to-next-section` in css-style-sheet-template.css

---

Lily™ and Lily Design System™ are trademarks.
