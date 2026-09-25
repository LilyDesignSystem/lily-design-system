# RossiyaSnilsInput

## Metadata

- Component: rossiya-snils-input
- PascalCase: RossiyaSnilsInput
- Description: an input for entering Russia's СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .rossiya-snils-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `rossiya-snils-input`
- Format: Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.
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

- [x] Renders <input> element with class="rossiya-snils-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .rossiya-snils-input in css-style-sheet-template.css
- Companion: RossiyaSnilsView
- Wikipedia: [SNILS (Russia)](https://en.wikipedia.org/wiki/SNILS_(Russia))
