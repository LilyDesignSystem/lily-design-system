# AustraliaTaxFileNumberInput

## Metadata

- Component: australia-tax-file-number-input
- PascalCase: AustraliaTaxFileNumberInput
- Description: an input for entering Australia's Tax File Number (TFN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .australia-tax-file-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `australia-tax-file-number-input`
- Format: Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.
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

- [x] Renders <input> element with class="australia-tax-file-number-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .australia-tax-file-number-input in css-style-sheet-template.css
- Companion: AustraliaTaxFileNumberView
- Wikipedia: [Tax file number](https://en.wikipedia.org/wiki/Tax_file_number)
