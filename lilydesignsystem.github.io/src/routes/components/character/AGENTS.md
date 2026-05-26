# Character

## Metadata

- Component: character
- PascalCase: Character
- Description: a single character display element
- HTML tag: <span>
- CSS class: .character
- Interactive: no

## Key Behaviors

- Renders as a `<span>` wrapper around the character content
- Uses `role="img"` with `aria-label` for meaningful characters so assistive technology announces the character's purpose
- Uses `role="presentation"` with `aria-hidden="true"` for decorative characters to hide from screen readers
- Uses `slot` for children content
- Spreads `...restProps` on the root `<span>` element for consumer customization

## ARIA

- `role="img"` -- applied when the character is meaningful (decorative is false), indicating the span represents an image-like glyph
- `role="presentation"` -- applied when `decorative` is true, removing semantic meaning
- `aria-label` -- provides the accessible name for meaningful characters; omitted when decorative
- `aria-hidden="true"` -- applied when `decorative` is true, hiding the element from the accessibility tree

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (optional) -- accessible description of the character for screen readers
- `decorative`: boolean (default: false) -- when true, hides the character from assistive technology
- `children`: slot (required) -- the character to display

## Acceptance Criteria

- [ ] Renders <span> element with class="character"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .character in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/character.html
