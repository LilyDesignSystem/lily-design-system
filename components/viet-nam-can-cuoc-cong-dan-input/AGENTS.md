# VietNamCanCuocCongDanInput

## Metadata

- Component: viet-nam-can-cuoc-cong-dan-input
- PascalCase: VietNamCanCuocCongDanInput
- Description: an input for entering Viet Nam's Citizen Identification Number (CCCD)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .viet-nam-can-cuoc-cong-dan-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `viet-nam-can-cuoc-cong-dan-input`
- Format: Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.
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

- [x] Renders <input> element with class="viet-nam-can-cuoc-cong-dan-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .viet-nam-can-cuoc-cong-dan-input in css-style-sheet-template.css
- Companion: VietNamCanCuocCongDanView
- Wikipedia: [Vietnamese identity card](https://en.wikipedia.org/wiki/Vietnamese_identity_card)
