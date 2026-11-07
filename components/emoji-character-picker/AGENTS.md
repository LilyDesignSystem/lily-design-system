# EmojiCharacterPicker

## Metadata

- Component: emoji-character-picker
- PascalCase: EmojiCharacterPicker
- Description: a picker for browsing and selecting emoji characters
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .emoji-character-picker
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="group"`, named by `label`
- Consumer provides the emoji as `<button>` elements, one per character
- Consumer implements selection behavior and category filtering
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper
- Not a grid: `role="grid"` would promise arrow-key cell navigation the component does not provide (tasks.md P25-T20)

## ARIA

- `role="group"` -- groups the emoji buttons under the picker's name
- `aria-label={label}` -- provides an accessible name for the emoji picker

## Keyboard

- Tab: moves between the emoji buttons
- Enter or Space: chooses the focused emoji (native buttons)

## Props

- `label`: string (required) -- accessible name describing the picker, applied via `aria-label`
- `children`: slot (required) -- the emoji buttons

## Acceptance Criteria

- [ ] Renders <div> element with class="emoji-character-picker"
- [ ] Has aria-label attribute
- [ ] Has role="group"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .emoji-character-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/emoji-character-picker.html
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
