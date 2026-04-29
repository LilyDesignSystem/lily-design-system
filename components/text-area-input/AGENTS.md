# TextAreaInput

## Metadata

- Component: text-area-input
- PascalCase: TextAreaInput
- Description: a multi-line text input area
- HTML tag: <textarea>
- CSS class: .text-area-input
- Interactive: yes

## Key Behaviors

- Renders a single `<textarea>` element with no wrapper
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Supports two-way binding on the `value` prop
- The `rows` prop controls the visible height of the text area
- Spreads `restProps` onto the text-area-input element for consumer extensibility

## ARIA

- `aria-label={label}` -- provides an accessible name for the text-area-input since there is no visible `<label>` element

## Keyboard

- Tab: Moves focus to and from the text-area-input (native browser behavior)
- All standard text editing keys function normally within the text-area-input (native browser behavior)
- Enter: Inserts a new line (does not submit forms, unlike single-line inputs)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- bindable text content of the text-area-input
- `rows`: number (default: undefined) -- number of visible text rows (browser default if unset)
- `required`: boolean (default: false) -- whether the text-area-input is required for form submission
- `disabled`: boolean (default: false) -- whether the text-area-input is disabled
- `...restProps`: unknown -- additional attributes spread onto the text-area-input element

## Acceptance Criteria

- [ ] Renders <textarea> element with class="text-area-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .text-area-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/text-area-input.html
- MDN text-area-input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/text-area-input
