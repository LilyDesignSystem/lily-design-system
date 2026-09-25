# OsterreichSozialversicherungsnummerInput

## Metadata

- Component: osterreich-sozialversicherungsnummer-input
- PascalCase: OsterreichSozialversicherungsnummerInput
- Description: an input for entering Austria's Sozialversicherungsnummer (SVNR)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .osterreich-sozialversicherungsnummer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `osterreich-sozialversicherungsnummer-input`
- Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.
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

- [x] Renders <input> element with class="osterreich-sozialversicherungsnummer-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .osterreich-sozialversicherungsnummer-input in css-style-sheet-template.css
- Companion: OsterreichSozialversicherungsnummerView
- Wikipedia: [Sozialversicherungsnummer](https://de.wikipedia.org/wiki/Sozialversicherungsnummer)
