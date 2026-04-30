# EmojiCharacterPicker

## Metadata

- Component: emoji-character-picker
- PascalCase: EmojiCharacterPicker
- Description: a picker for browsing and selecting emoji characters
- HTML tag: <div>
- CSS class: .emoji-character-picker
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="grid"` for structured grid navigation semantics
- Consumer provides grid rows and cells containing emoji characters
- Consumer implements selection behavior and category filtering
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper

## ARIA

- `role="grid"` -- identifies the container as a grid widget for structured cell navigation
- `aria-label={label}` -- provides an accessible name for the emoji picker

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the picker, applied via `aria-label`
- `children`: slot (required) -- the grid content containing emoji characters

## Acceptance Criteria

- [ ] Renders <div> element with class="emoji-character-picker"
- [ ] Has aria-label attribute
- [ ] Has role="grid"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .emoji-character-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/emoji-character-picker.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
