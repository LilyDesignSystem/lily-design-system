# CharacterCounter

## Metadata

- Component: character-counter
- PascalCase: CharacterCounter
- Description: a counter showing remaining or used characters in a text field
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <span>
- CSS class: .character-counter
- Interactive: no

## Key Behaviors

- Renders as a `<span>` holding `.character-counter-text` (the visible count, `aria-hidden="true"`) and `.character-counter-status` (a visually hidden `role="status"`, named by `label`), which takes the same text once the count has stopped changing for `announceDelay` ms (default 1000)
- Uses derived value to compute `remaining` count and `overLimit` boolean from `count` and `max` props
- Displays "count / max" when `max` is provided, otherwise displays just the count
- Exposes data attributes for consumer CSS: `data-count`, `data-max`, `data-remaining`, `data-over-limit`
- The `data-over-limit` attribute is only present when the count exceeds the max, enabling conditional styling
- Spreads `...restProps` on the root `<span>` element for consumer customization

## ARIA

- `role="status"` on `.character-counter-status`, updated only after a pause in typing, so a run of keystrokes is one announcement
- `aria-hidden="true"` on the visible count, so it is not read twice
- `aria-label` (from `label`) names the status
- `aria-label` -- set from the `label` prop to provide context for what the counter represents

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `count`: number (default: 0) -- current character count
- `max`: number (optional) -- maximum allowed characters; when provided, enables remaining/over-limit tracking
- `label`: string (optional) -- names the status, via `aria-label`
- `announceDelay`: number (default: 1000) -- milliseconds of quiet before the status takes the new count

## Acceptance Criteria

- [ ] Renders <span> element with class="character-counter"
- [ ] Has aria-label attribute
- [ ] Has a role="status" inside it that is updated only after a pause in typing
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .character-counter in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/character-counter.html
