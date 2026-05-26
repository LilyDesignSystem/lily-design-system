# GoToPreviousSection

## Metadata

- Component: go-to-previous-section
- PascalCase: GoToPreviousSection
- Description: a link that takes users to the previous section of the current page
- HTML tag: <a>
- CSS class: .go-to-previous-section
- Interactive: yes

## Key Behaviors

- Renders an `<a>` with class `go-to-previous-section` linking to a section anchor on the same page
- Accepts a `href` prop pointing at the previous section's anchor (e.g. `#section-2`)
- Accepts a `label` prop for the visible link text
- Companion to `GoToNextSection` and `GoToTop`

## ARIA

- Native anchor accessibility — the `href` provides the destination, the link text provides the accessible name

## Keyboard

- Tab: moves focus onto the link
- Enter: navigates to the linked anchor (native browser behavior)

## Props

- `href`: string (required) — anchor URL of the previous section, typically `#section-id`
- `label`: string (required) — visible link text
- `className`: string (optional) — extra CSS classes appended to `go-to-previous-section`

## Acceptance Criteria

- [ ] Renders `<a>` element with class="go-to-previous-section"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.go-to-previous-section` in css-style-sheet-template.css
