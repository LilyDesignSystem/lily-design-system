# DateTime Local Input

## Metadata

- Component: date-time-local-input
- PascalCase: DateTimeLocalInput
- Description: an input for entering a date and time without time zone <input type="datetime-local">
- HTML tag: <input>
- CSS class: .date-time-local-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="datetime-local">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Supports two-way binding on the `value` prop
- The browser provides the native datetime picker UI
- Spreads `restProps` onto the input element for consumer extensibility

## ARIA

- `aria-label={label}` -- provides an accessible name for the datetime input since there is no visible `<label>` element

## Keyboard

- Tab: Moves focus to and from the datetime input (native browser behavior)
- Arrow keys: Navigate within the datetime picker fields (native browser behavior)
- Enter: Opens or confirms the datetime picker (native browser behavior)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- bindable datetime string (format: YYYY-MM-DDThh:mm)
- `min`: string (default: undefined) -- minimum allowed datetime
- `max`: string (default: undefined) -- maximum allowed datetime
- `required`: boolean (default: false) -- whether the input is required for form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the input element

## Acceptance Criteria

- [ ] Renders <input> element with class="date-time-local-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .date-time-local-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/date-time-local-input.html
- MDN datetime-local input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
