# Text Area With Character Counter

## Metadata

- Component: text-area-with-character-counter
- PascalCase: TextAreaWithCharacterCounter
- Description: a multi-line text area with a caption below that is a character counter "[number] of [maximum] characters"
- HTML tag: <div>
- CSS class: .text-area-with-character-counter
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing a `<textarea>` and a character counter caption
- The character counter displays "[number] of [maximum] characters" below the textarea
- The counter updates reactively as the user types
- Uses `aria-describedby` to link the textarea to the counter for screen readers
- Supports two-way binding on the `value` prop
- The counter uses `aria-live="polite"` so screen readers announce changes
- Spreads `restProps` onto the wrapper `<div>` for consumer extensibility

## ARIA

- `aria-label={label}` -- provides an accessible name for the textarea
- `aria-describedby` -- links the textarea to the character counter
- `aria-live="polite"` -- on the counter so screen readers announce updates

## Keyboard

- Tab: Moves focus to and from the textarea (native browser behavior)
- Standard textarea keyboard interactions (native browser behavior)

## Props

- `label`: string (required) -- accessible name for the textarea via `aria-label`
- `value`: string (default: "") -- bindable textarea value
- `maxLength`: number (required) -- maximum number of characters allowed
- `counterTemplate`: string (default: "{count} of {max} characters") -- template for the counter text; `{count}` and `{max}` are replaced with actual values
- `rows`: number (optional) -- number of visible text rows
- `placeholder`: string (optional) -- placeholder text for the textarea
- `required`: boolean (default: false) -- whether the textarea is required
- `disabled`: boolean (default: false) -- whether the textarea is disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="text-area-with-character-counter"
- [ ] Contains <textarea> with aria-label and aria-describedby
- [ ] Contains character counter with aria-live="polite"
- [ ] Counter displays "[number] of [maximum] characters"
- [ ] Counter updates reactively as user types
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .text-area-with-character-counter in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/text-area-with-character-counter.html
- MDN textarea: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
