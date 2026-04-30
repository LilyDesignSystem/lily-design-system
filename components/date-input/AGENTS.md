# DateInput

## Metadata

- Component: date-input
- PascalCase: DateInput
- Description: an input for entering a date value <input type="date">
- HTML tag: <input>
- CSS class: .date-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="date">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Supports two-way binding on the `value` prop
- The browser provides the native date picker UI
- Spreads `restProps` onto the input element for consumer extensibility

## ARIA

- `aria-label={label}` -- provides an accessible name for the date input since there is no visible `<label>` element

## Keyboard

- Tab: Moves focus to and from the date input (native browser behavior)
- Arrow keys: Navigate within the date picker fields (native browser behavior)
- Enter: Opens or confirms the date picker (native browser behavior)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- bindable date string in YYYY-MM-DD format
- `min`: string (default: undefined) -- minimum allowed date in YYYY-MM-DD format
- `max`: string (default: undefined) -- maximum allowed date in YYYY-MM-DD format
- `required`: boolean (default: false) -- whether the input is required for form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the input element

## Acceptance Criteria

- [ ] Renders <input> element with class="date-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .date-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/date-input.html
- MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
