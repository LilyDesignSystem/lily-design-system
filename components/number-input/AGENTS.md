# NumberInput

## Metadata

- Component: number-input
- PascalCase: NumberInput
- Description: an input for entering a numeric value with validation <input type="number">
- HTML tag: <input>
- CSS class: .number-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Supports optional `min`, `max`, and `step` constraints
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization (e.g., `id`, `name`, `placeholder`)
- pattern: `two-way binding` for the value prop

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the number input

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current numeric value; bindable with two-way `value` binding
- `min`: number (optional) -- minimum allowed value
- `max`: number (optional) -- maximum allowed value
- `step`: number (optional) -- increment/decrement step size
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="number-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .number-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/number-input.html
- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role (implicit): https://www.w3.org/TR/wai-aria-1.2/#spinbutton
