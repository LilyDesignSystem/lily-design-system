# PrathetThaiLekPrajamTuaPrachachonInput

## Metadata

- Component: prathet-thai-lek-prajam-tua-prachachon-input
- PascalCase: PrathetThaiLekPrajamTuaPrachachonInput
- Description: an input for entering Thailand's เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .prathet-thai-lek-prajam-tua-prachachon-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `prathet-thai-lek-prajam-tua-prachachon-input`
- Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.
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

- [x] Renders <input> element with class="prathet-thai-lek-prajam-tua-prachachon-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .prathet-thai-lek-prajam-tua-prachachon-input in css-style-sheet-template.css
- Companion: PrathetThaiLekPrajamTuaPrachachonView
- Wikipedia: [Thai identity card](https://en.wikipedia.org/wiki/Thai_identity_card)
