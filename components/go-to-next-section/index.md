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

- See `index.md` description: a link that takes users to the next section of the current page.

## When Not to Use

- See related components for alternative patterns.

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.go-to-next-section` as the root class. No default styles are included.

## References

- Documentation: index.md
- CSS class: `.go-to-next-section` in css-style-sheet-template.css
