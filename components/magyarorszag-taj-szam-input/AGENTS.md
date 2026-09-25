# MagyarorszagTajSzamInput

## Metadata

- Component: magyarorszag-taj-szam-input
- PascalCase: MagyarorszagTajSzamInput
- Description: an input for entering Hungary's Társadalombiztosítási Azonosító Jel (TAJ)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .magyarorszag-taj-szam-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `magyarorszag-taj-szam-input`
- Format: Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an algorithm unique to Hungary, distinct from Luhn.
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

- [x] Renders <input> element with class="magyarorszag-taj-szam-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .magyarorszag-taj-szam-input in css-style-sheet-template.css
- Companion: MagyarorszagTajSzamView
- Wikipedia: [Társadalombiztosítási azonosító jel](https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel)
