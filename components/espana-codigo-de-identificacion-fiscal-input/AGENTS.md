# EspanaCodigoDeIdentificacionFiscalInput

## Metadata

- Component: espana-codigo-de-identificacion-fiscal-input
- PascalCase: EspanaCodigoDeIdentificacionFiscalInput
- Description: an input for entering Spain's Código de Identificación Fiscal (CIF)
- HTML tag: <input>
- CSS class: .espana-codigo-de-identificacion-fiscal-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `espana-codigo-de-identificacion-fiscal-input`
- Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `aria-label` provided from the `label` prop

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <input> element with class="espana-codigo-de-identificacion-fiscal-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .espana-codigo-de-identificacion-fiscal-input in css-style-sheet-template.css
- Companion: EspanaCodigoDeIdentificacionFiscalView
- Wikipedia: https://en.wikipedia.org/wiki/VAT_identification_number#Spain
