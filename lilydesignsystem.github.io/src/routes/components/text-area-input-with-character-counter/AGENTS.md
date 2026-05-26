# TextAreaInputWithCharacterCounter

## Metadata

- Component: text-area-input-with-character-counter
- PascalCase: TextAreaInputWithCharacterCounter
- Description: a multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters"
- HTML tag: <div>
- CSS class: .text-area-input-with-character-counter
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing a `<textarea>` and a character counter caption
- The character counter displays "[number] of [maximum] characters" below the text-area-input
- The counter updates reactively as the user types
- Uses `aria-describedby` to link the text-area-input to the counter for screen readers
- Supports two-way binding on the `value` prop
- The counter uses `aria-live="polite"` so screen readers announce changes
- Spreads `restProps` onto the wrapper `<div>` for consumer extensibility

## ARIA

- `aria-label={label}` -- provides an accessible name for the text-area-input
- `aria-describedby` -- links the text-area-input to the character counter
- `aria-live="polite"` -- on the counter so screen readers announce updates

## Keyboard

- Tab: Moves focus to and from the text-area-input (native browser behavior)
- Standard text-area-input keyboard interactions (native browser behavior)

## Props

- `label`: string (required) -- accessible name for the text-area-input via `aria-label`
- `value`: string (default: "") -- bindable text-area-input value
- `maxLength`: number (required) -- maximum number of characters allowed
- `counterTemplate`: string (default: "{count} of {max} characters") -- template for the counter text; `{count}` and `{max}` are replaced with actual values
- `rows`: number (optional) -- number of visible text rows
- `placeholder`: string (optional) -- placeholder text for the text-area-input
- `required`: boolean (default: false) -- whether the text-area-input is required
- `disabled`: boolean (default: false) -- whether the text-area-input is disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="text-area-input-with-character-counter"
- [ ] Contains <textarea> with aria-label and aria-describedby
- [ ] Contains character counter with aria-live="polite"
- [ ] Counter displays "[number] of [maximum] characters"
- [ ] Counter updates reactively as user types
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .text-area-input-with-character-counter in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/text-area-input-with-character-counter.html
- MDN text-area-input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/text-area-input
