# SchweizAhvNummerInput

## Metadata

- Component: schweiz-ahv-nummer-input
- PascalCase: SchweizAhvNummerInput
- Description: an input for entering Switzerland's AHV-Nummer / Numéro AVS
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .schweiz-ahv-nummer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `schweiz-ahv-nummer-input`
- Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.
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

- [x] Renders <input> element with class="schweiz-ahv-nummer-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .schweiz-ahv-nummer-input in css-style-sheet-template.css
- Companion: SchweizAhvNummerView
- Wikipedia: [Data codes for Switzerland](https://en.wikipedia.org/wiki/Data_codes_for_Switzerland)
