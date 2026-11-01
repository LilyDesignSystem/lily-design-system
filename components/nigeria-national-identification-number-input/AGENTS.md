# NigeriaNationalIdentificationNumberInput

## Metadata

- Component: nigeria-national-identification-number-input
- PascalCase: NigeriaNationalIdentificationNumberInput
- Description: an input for entering Nigeria's National Identification Number (NIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .nigeria-national-identification-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `nigeria-national-identification-number-input`
- Format: Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit algorithm is published, so only the length and digits can be checked.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <input> element with class="nigeria-national-identification-number-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nigeria-national-identification-number-input in css-style-sheet-template.css
- Companion: NigeriaNationalIdentificationNumberView
- Wikipedia: [National Identity Management Commission](https://en.wikipedia.org/wiki/National_Identity_Management_Commission)
