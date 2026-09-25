# BrasilCartaoNacionalDeSaudeInput

## Metadata

- Component: brasil-cartao-nacional-de-saude-input
- PascalCase: BrasilCartaoNacionalDeSaudeInput
- Description: an input for entering Brazil's Cartão Nacional de Saúde (CNS)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .brasil-cartao-nacional-de-saude-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `brasil-cartao-nacional-de-saude-input`
- Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
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

- [x] Renders <input> element with class="brasil-cartao-nacional-de-saude-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .brasil-cartao-nacional-de-saude-input in css-style-sheet-template.css
- Companion: BrasilCartaoNacionalDeSaudeView
- Wikipedia: [CPF number (Cartão Nacional de Saúde)](https://en.wikipedia.org/wiki/CPF_number)
