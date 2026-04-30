# MeasurementInstanceInput

## Metadata

- Component: measurement-instance-input
- PascalCase: MeasurementInstanceInput
- Description: an input for entering a measurement value and unit
- HTML tag: <input>
- CSS class: .measurement-instance-input
- Interactive: no

## Companion

- measurement-instance-view

## Key Behaviors

- Uses `<input type="text">` with `aria-label` for accessible naming
- A measurement instance is a specific measured value (e.g., "72 kg", "98.6 F")
- Bindable `value` prop for two-way data binding via two-way binding
- Supports `required` and `disabled` HTML attributes
- Spreads `...restProps` on the root `<input>` element
- All text content comes through props for internationalization

## ARIA

- `aria-label` -- set from the `label` prop to provide an accessible name

## Keyboard

- Native `<input type="text">` keyboard behavior (typing, selection, clipboard)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: "", bindable) -- bindable measurement instance value
- `required`: boolean (default: false) -- whether the field is required
- `disabled`: boolean (default: false) -- whether the field is disabled
- `...restProps`: Any additional HTML attributes passed to the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="measurement-instance-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .measurement-instance-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/measurement-instance-input.html
