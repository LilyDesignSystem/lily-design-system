# ColombiaCedulaDeCiudadaniaInput

## Metadata

- Component: colombia-cedula-de-ciudadania-input
- PascalCase: ColombiaCedulaDeCiudadaniaInput
- Description: an input for entering Colombia's Cedula de Ciudadania Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .colombia-cedula-de-ciudadania-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `colombia-cedula-de-ciudadania-input`
- Format: Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.
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

- [x] Renders <input> element with class="colombia-cedula-de-ciudadania-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .colombia-cedula-de-ciudadania-input in css-style-sheet-template.css
- Companion: ColombiaCedulaDeCiudadaniaView
- Wikipedia: [Colombian identity card](https://en.wikipedia.org/wiki/Colombian_identity_card)
