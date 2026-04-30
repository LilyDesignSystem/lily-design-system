# Emoji

## Metadata

- Component: emoji
- PascalCase: Emoji
- Description: a single emoji character with accessible name
- HTML tag: <span>
- CSS class: .emoji
- Interactive: no

## Key Behaviors

- Renders a `<span>` with `role="img"` to treat the emoji as an image element
- Requires an `aria-label` describing the emoji meaning for screen readers
- Displays the emoji character as text content inside the span
- Spreads `restProps` onto the `<span>` element for consumer customization

## ARIA

- `role="img"` -- identifies the emoji as an image for assistive technologies
- `aria-label` -- provides a textual description of the emoji character for screen readers

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `emoji`: string (required) -- the emoji character(s) to display
- `label`: string (required) -- accessible name describing the emoji for screen readers

## Acceptance Criteria

- [ ] Renders <span> element with class="emoji"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .emoji in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/emoji.html
