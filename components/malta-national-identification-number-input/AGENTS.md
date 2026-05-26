# MaltaNationalIdentificationNumberInput

## Metadata

- Component: malta-national-identification-number-input
- PascalCase: MaltaNationalIdentificationNumberInput
- Description: an input for entering Malta's Malta National Identification Number
- HTML tag: <input>
- CSS class: .malta-national-identification-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `malta-national-identification-number-input`
- Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `aria-label` provided from the `label` prop

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <input> element with class="malta-national-identification-number-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .malta-national-identification-number-input in css-style-sheet-template.css
- Companion: MaltaNationalIdentificationNumberView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Malta
