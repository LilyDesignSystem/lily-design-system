# AsSaudiyahRaqmAlHuwiyahAlWataniyahInput

## Metadata

- Component: as-saudiyah-raqm-al-huwiyah-al-wataniyah-input
- PascalCase: AsSaudiyahRaqmAlHuwiyahAlWataniyahInput
- Description: an input for entering Saudi Arabia's National Identification Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .as-saudiyah-raqm-al-huwiyah-al-wataniyah-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `as-saudiyah-raqm-al-huwiyah-al-wataniyah-input`
- Format: Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.
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

- [x] Renders <input> element with class="as-saudiyah-raqm-al-huwiyah-al-wataniyah-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .as-saudiyah-raqm-al-huwiyah-al-wataniyah-input in css-style-sheet-template.css
- Companion: AsSaudiyahRaqmAlHuwiyahAlWataniyahView
- Wikipedia: [National identity card](https://en.wikipedia.org/wiki/National_identity_card)
