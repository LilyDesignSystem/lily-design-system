# IranKodEMelliInput

## Metadata

- Component: iran-kod-e-melli-input
- PascalCase: IranKodEMelliInput
- Description: an input for entering Iran's National Code (Kod-e Melli)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .iran-kod-e-melli-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `iran-kod-e-melli-input`
- Format: Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.
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

- [x] Renders <input> element with class="iran-kod-e-melli-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .iran-kod-e-melli-input in css-style-sheet-template.css
- Companion: IranKodEMelliView
- Wikipedia: [Iranian identity card](https://en.wikipedia.org/wiki/Iranian_identity_card)
