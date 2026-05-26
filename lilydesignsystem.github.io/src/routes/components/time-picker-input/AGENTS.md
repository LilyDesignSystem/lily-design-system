# TimePickerInput

## Metadata

- Component: time-picker-input
- PascalCase: TimePickerInput
- Description: an input with a dropdown for picking a time
- HTML tag: <div>
- CSS class: .time-picker-input
- Interactive: yes

## Key Behaviors

- Uses a native `<input type="time">` element for built-in browser time selection behavior
- Supports two-way binding on the `value` prop
- Native input handles 12-hour/24-hour format based on browser locale
- Accepts `...restProps` for forwarding additional attributes to the input element

## ARIA

- `aria-label={label}` -- provides an accessible name for the time input

## Keyboard

- Tab: Move focus to/from the time input
- Up Arrow / Down Arrow: Increment/decrement the focused time segment (hours, minutes, AM/PM)
- Left Arrow / Right Arrow: Move between time segments within the input

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current time value in HH:MM format; bindable
- `required`: boolean (default: false) -- whether a value is required for form submission
- `disabled`: boolean (default: false) -- whether the input is disabled

## Acceptance Criteria

- [ ] Renders <div> element with class="time-picker-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .time-picker-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/time-picker-input.html
- MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
