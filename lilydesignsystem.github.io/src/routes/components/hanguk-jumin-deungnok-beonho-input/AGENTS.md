# HangukJuminDeungnokBeonhoInput

## Metadata

- Component: hanguk-jumin-deungnok-beonho-input
- PascalCase: HangukJuminDeungnokBeonhoInput
- Description: an input for entering South Korea's Resident Registration Number (주민등록번호)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .hanguk-jumin-deungnok-beonho-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `hanguk-jumin-deungnok-beonho-input`
- Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.
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

- [x] Renders <input> element with class="hanguk-jumin-deungnok-beonho-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hanguk-jumin-deungnok-beonho-input in css-style-sheet-template.css
- Companion: HangukJuminDeungnokBeonhoView
- Wikipedia: [Resident registration number](https://en.wikipedia.org/wiki/Resident_registration_number)
