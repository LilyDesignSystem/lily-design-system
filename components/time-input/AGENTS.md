# TimeInput

## Metadata

- Component: time-input
- PascalCase: TimeInput
- Description: an input for entering a time value <input type="time">
- HTML tag: <input>
- CSS class: .time-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="time">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Supports two-way binding for the `value` prop, enabling two-way `value` binding in the parent
- Supports two-way binding on the `value` prop
- Value format is HH:MM (24-hour time string, e.g., "14:30")
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `min`, `max`, `step`)

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, bindable) -- current time value in HH:MM format, supports two-way binding
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Acceptance Criteria

- [ ] Renders <input> element with class="time-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .time-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/time-input.html
- MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
