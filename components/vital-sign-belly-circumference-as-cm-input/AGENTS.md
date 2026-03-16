# Vital Sign Belly Circumference As Cm Input

## Metadata

- Component: vital-sign-belly-circumference-as-cm-input
- PascalCase: VitalSignBellyCircumferenceAsCmInput
- Description: number input of one vital sign belly circumference in centimetres with integers
- HTML tag: <input>
- CSS class: .vital-sign-belly-circumference-as-cm-input
- Interactive: yes

## Key Behaviors

- Renders a bare `<input type="number">` element with no wrapper
- Uses `aria-label` for accessible naming
- Default min=0, max=300, step=1 for belly circumference in centimetres
- Supports two-way binding on the `value` prop
- Spreads `restProps` onto the `<input>` element

## ARIA

- `aria-label={label}` -- provides an accessible name for the input
- Implicit spinbutton role from `<input type="number">`

## Keyboard

- Up Arrow: increment value by step (native browser behavior)
- Down Arrow: decrement value by step (native browser behavior)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: number | undefined (default: undefined) -- bindable belly circumference value
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 300) -- maximum allowed value
- `step`: number (default: 1) -- increment/decrement step size
- `required`: boolean (default: false) -- whether the input is required
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders <input> element with class="vital-sign-belly-circumference-as-cm-input"
- [ ] Has type="number" and aria-label
- [ ] Has min, max, step attributes
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .vital-sign-belly-circumference-as-cm-input in css-style-sheet-template.css
- Companion: VitalSignBellyCircumferenceAsCmView
- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
