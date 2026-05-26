# MonthInput

## Metadata

- Component: month-input
- PascalCase: MonthInput
- Description: an input for selecting a month and year <input type="month">
- HTML tag: <input>
- CSS class: .month-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="month">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding, storing the month in `YYYY-MM` format
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization (e.g., `min`, `max`, `id`, `name`)
- pattern: `two-way binding` for the value prop

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the month input

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- current month value in `YYYY-MM` format; bindable with two-way `value` binding
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="month-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .month-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/month-input.html
- HTML month input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month
