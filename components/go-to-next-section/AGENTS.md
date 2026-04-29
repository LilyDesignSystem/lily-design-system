# GoToNextSection

## Metadata

- Component: go-to-next-section
- PascalCase: GoToNextSection
- Description: a link that takes users to the next section of the current page
- HTML tag: <a>
- CSS class: .go-to-next-section
- Interactive: yes

## Key Behaviors

- Renders an `<a>` with class `go-to-next-section` linking to a section anchor on the same page
- Accepts a `href` prop pointing at the next section's anchor (e.g. `#section-3`)
- Accepts a `label` prop for the visible link text
- Companion to `GoToPreviousSection` and `GoToTop`

## ARIA

- Native anchor accessibility — the `href` provides the destination, the link text provides the accessible name

## Keyboard

- Tab: moves focus onto the link
- Enter: navigates to the linked anchor (native browser behavior)

## Props

- `href`: string (required) — anchor URL of the next section, typically `#section-id`
- `label`: string (required) — visible link text
- `className`: string (optional) — extra CSS classes appended to `go-to-next-section`

## Acceptance Criteria

- [ ] Renders `<a>` element with class="go-to-next-section"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.go-to-next-section` in css-style-sheet-template.css
