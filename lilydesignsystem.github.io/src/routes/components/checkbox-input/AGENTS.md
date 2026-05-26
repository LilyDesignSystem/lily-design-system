# CheckboxInput

## Metadata

- Component: checkbox-input
- PascalCase: CheckboxInput
- Description: a checkbox input for toggling a boolean value <input type="checkbox">
- HTML tag: <input>
- CSS class: .checkbox-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="checkbox">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a wrapping `<label>` element
- Supports two-way binding on the `checked` prop
- Spreads `restProps` onto the input element for consumer extensibility

## ARIA

- `aria-label={label}` -- provides an accessible name for the checkbox since there is no visible `<label>` element

## Keyboard

- Space: Toggles the checkbox checked state (native browser behavior)
- Tab: Moves focus to and from the checkbox (native browser behavior)

## Props

- `checked`: boolean (default: false) -- bindable boolean indicating whether the checkbox is checked
- `label`: string (required) -- accessible name applied via `aria-label`
- `disabled`: boolean (default: false) -- whether the checkbox is disabled
- `required`: boolean (default: false) -- whether the checkbox is required for form submission
- `name`: string (default: undefined) -- form field name attribute
- `id`: string (default: undefined) -- element id attribute
- `value`: string (default: undefined) -- value attribute for form submission
- `...restProps`: unknown -- additional attributes spread onto the input element

## Acceptance Criteria

- [ ] Renders <input> element with class="checkbox-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .checkbox-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/checkbox-input.html
- MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
- WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
