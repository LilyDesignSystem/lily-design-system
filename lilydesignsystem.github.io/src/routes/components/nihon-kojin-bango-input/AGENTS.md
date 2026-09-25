# NihonKojinBangoInput

## Metadata

- Component: nihon-kojin-bango-input
- PascalCase: NihonKojinBangoInput
- Description: an input for entering Japan's Individual Number / My Number (マイナンバー)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .nihon-kojin-bango-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `nihon-kojin-bango-input`
- Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
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

- [x] Renders <input> element with class="nihon-kojin-bango-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nihon-kojin-bango-input in css-style-sheet-template.css
- Companion: NihonKojinBangoView
- Wikipedia: [Individual Number](https://en.wikipedia.org/wiki/Individual_Number)
