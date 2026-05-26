# CharacterCounter

## Metadata

- Component: character-counter
- PascalCase: CharacterCounter
- Description: a counter showing remaining or used characters in a text field
- HTML tag: <span>
- CSS class: .character-counter
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element with `role="status"` and `aria-live="polite"` for non-intrusive screen reader announcements
- Uses derived value to compute `remaining` count and `overLimit` boolean from `count` and `max` props
- Displays "count / max" when `max` is provided, otherwise displays just the count
- Exposes data attributes for consumer CSS: `data-count`, `data-max`, `data-remaining`, `data-over-limit`
- The `data-over-limit` attribute is only present when the count exceeds the max, enabling conditional styling
- Spreads `...restProps` on the root `<span>` element for consumer customization

## ARIA

- `role="status"` -- identifies the element as a live region that presents advisory information
- `aria-live="polite"` -- screen readers announce updates at the next convenient pause, without interrupting the user
- `aria-label` -- set from the `label` prop to provide context for what the counter represents

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `count`: number (default: 0) -- current character count
- `max`: number (optional) -- maximum allowed characters; when provided, enables remaining/over-limit tracking
- `label`: string (optional) -- accessible label for the counter via aria-label

## Acceptance Criteria

- [ ] Renders <span> element with class="character-counter"
- [ ] Has aria-label attribute
- [ ] Has role="status"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .character-counter in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/character-counter.html
