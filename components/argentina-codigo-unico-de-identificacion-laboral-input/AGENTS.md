# ArgentinaCodigoUnicoDeIdentificacionLaboralInput

## Metadata

- Component: argentina-codigo-unico-de-identificacion-laboral-input
- PascalCase: ArgentinaCodigoUnicoDeIdentificacionLaboralInput
- Description: an input for entering Argentina's Código Único de Identificación Laboral (CUIL)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .argentina-codigo-unico-de-identificacion-laboral-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `argentina-codigo-unico-de-identificacion-laboral-input`
- Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.
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

- [x] Renders <input> element with class="argentina-codigo-unico-de-identificacion-laboral-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .argentina-codigo-unico-de-identificacion-laboral-input in css-style-sheet-template.css
- Companion: ArgentinaCodigoUnicoDeIdentificacionLaboralView
- Wikipedia: [Código Único de Identificación Laboral](https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral)
