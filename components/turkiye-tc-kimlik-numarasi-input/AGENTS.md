# TurkiyeTcKimlikNumarasiInput

## Metadata

- Component: turkiye-tc-kimlik-numarasi-input
- PascalCase: TurkiyeTcKimlikNumarasiInput
- Description: an input for entering Turkey's T.C. Kimlik Numarası
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .turkiye-tc-kimlik-numarasi-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `turkiye-tc-kimlik-numarasi-input`
- Format: Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) × 7) plus ((sum of digits 2,4,6,8) × 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.
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

- [x] Renders <input> element with class="turkiye-tc-kimlik-numarasi-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .turkiye-tc-kimlik-numarasi-input in css-style-sheet-template.css
- Companion: TurkiyeTcKimlikNumarasiView
- Wikipedia: [Turkish Identification Number](https://en.wikipedia.org/wiki/Turkish_Identification_Number)
