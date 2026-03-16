# Date Time Now Input

## Metadata

- Component: date-time-now-input
- PascalCase: DateTimeNowInput
- Description: an input for entering a date and time and "now" button <input type="date"><input type="time"><button type="button">
- HTML tag: <div>
- CSS class: .date-time-now-input
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing a date input, a time input, and a "Now" button
- The date input is `<input type="date">` for selecting a date
- The time input is `<input type="time">` for selecting a time
- The "Now" button sets both date and time inputs to the current local date and time
- Uses `aria-label` for accessible naming on each input and the button
- Supports two-way binding on the `dateValue` and `timeValue` props
- Spreads `restProps` onto the wrapper `<div>` for consumer extensibility

## ARIA

- `aria-label={dateLabel}` -- provides an accessible name for the date input
- `aria-label={timeLabel}` -- provides an accessible name for the time input
- `aria-label={nowLabel}` -- provides an accessible name for the "Now" button

## Keyboard

- Tab: Moves focus between the date input, time input, and "Now" button
- Enter/Space on the "Now" button: Sets both inputs to the current date and time
- Arrow keys: Navigate within the date and time picker fields (native browser behavior)

## Props

- `label`: string (required) -- accessible name for the wrapper group via `aria-label`
- `dateLabel`: string (default: "Date") -- accessible name for the date input via `aria-label`
- `timeLabel`: string (default: "Time") -- accessible name for the time input via `aria-label`
- `nowLabel`: string (default: "Now") -- accessible label and text for the "Now" button
- `dateValue`: string (default: "") -- bindable date string (format: YYYY-MM-DD)
- `timeValue`: string (default: "") -- bindable time string (format: HH:mm)
- `required`: boolean (default: false) -- whether the inputs are required for form submission
- `disabled`: boolean (default: false) -- whether the inputs and button are disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="date-time-now-input"
- [ ] Contains <input type="date"> with aria-label
- [ ] Contains <input type="time"> with aria-label
- [ ] Contains <button type="button"> with aria-label
- [ ] "Now" button sets date and time to current values
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .date-time-now-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/date-time-now-input.html
- MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
- MDN time input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
