# Vital Sign Belly Circumference As Cm View

## Metadata

- Component: vital-sign-belly-circumference-as-cm-view
- PascalCase: VitalSignBellyCircumferenceAsCmView
- Description: number display of one vital sign belly circumference in centimetres with integers
- HTML tag: <span>
- CSS class: .vital-sign-belly-circumference-as-cm-view
- Interactive: no

## Key Behaviors

- Renders a `<span>` element with `role="img"` displaying the belly circumference value as text
- Uses `aria-label` for screen reader description
- Uses `data-value` attribute for consumer CSS styling based on the numeric value
- Spreads `restProps` onto the `<span>` element

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element
- `aria-label={label}` -- provides full belly circumference description for screen readers

## Keyboard

- None (passive, read-only display element)

## Props

- `value`: number (required) -- belly circumference value in centimetres
- `label`: string (required) -- accessible description via `aria-label`
- `...restProps`: unknown -- additional attributes spread onto the `<span>`

## Acceptance Criteria

- [ ] Renders <span> element with class="vital-sign-belly-circumference-as-cm-view"
- [ ] Has role="img" and aria-label
- [ ] Has data-value attribute
- [ ] Displays value as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .vital-sign-belly-circumference-as-cm-view in css-style-sheet-template.css
- Companion: VitalSignBellyCircumferenceAsCmInput
