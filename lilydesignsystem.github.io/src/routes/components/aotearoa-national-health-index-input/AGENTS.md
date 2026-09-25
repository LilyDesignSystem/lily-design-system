# AotearoaNationalHealthIndexInput

## Metadata

- Component: aotearoa-national-health-index-input
- PascalCase: AotearoaNationalHealthIndexInput
- Description: an input for entering New Zealand's National Health Index (NHI) Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .aotearoa-national-health-index-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `aotearoa-national-health-index-input`
- Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
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

- [x] Renders <input> element with class="aotearoa-national-health-index-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .aotearoa-national-health-index-input in css-style-sheet-template.css
- Companion: AotearoaNationalHealthIndexView
- Wikipedia: [NHI Number](https://en.wikipedia.org/wiki/NHI_Number)
