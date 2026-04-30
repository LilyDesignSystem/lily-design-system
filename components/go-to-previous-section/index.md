# GoToPreviousSection

A link that takes users to the previous section of the current page.

## Implementation Notes

- Renders an `<a>` with class `go-to-previous-section` linking to a section anchor on the same page
- Accepts a `href` prop pointing at the previous section's anchor (e.g. `#section-2`)
- Accepts a `label` prop for the visible link text
- Companion to `GoToNextSection` and `GoToTop`

## Props

- `href`: string (required) — anchor URL of the previous section, typically `#section-id`
- `label`: string (required) — visible link text
- `className`: string (optional) — extra CSS classes appended to `go-to-previous-section`

## Usage

```html
<GoToPreviousSection href="#section-1" label="Previous section: Introduction" />
```

## Keyboard Interactions

- Tab: moves focus onto the link
- Enter: navigates to the linked anchor (native browser behavior)

## ARIA

- Native anchor accessibility — the `href` provides the destination, the link text provides the accessible name

## When to Use

- See `index.md` description: a link that takes users to the previous section of the current page.

## When Not to Use

- See related components for alternative patterns.

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.go-to-previous-section` as the root class. No default styles are included.

## Related components

- `go-to-next-section` — a link that takes users to the next section of the current page
- `go-to-top` — a link that returns users to the top of a long page
- `section-nav` — a navigation container for section navigation links

## References

- Documentation: index.md
- CSS class: `.go-to-previous-section` in css-style-sheet-template.css
