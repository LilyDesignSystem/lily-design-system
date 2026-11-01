# UruguayCedulaDeIdentidadInput

## Metadata

- Component: uruguay-cedula-de-identidad-input
- PascalCase: UruguayCedulaDeIdentidadInput
- Description: an input for entering Uruguay's Cedula de Identidad Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .uruguay-cedula-de-identidad-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `uruguay-cedula-de-identidad-input`
- Format: Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).
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

- [x] Renders <input> element with class="uruguay-cedula-de-identidad-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .uruguay-cedula-de-identidad-input in css-style-sheet-template.css
- Companion: UruguayCedulaDeIdentidadView
- Wikipedia: [Cédula de identidad](https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad)
